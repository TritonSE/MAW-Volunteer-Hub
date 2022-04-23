import React, { useState, useEffect, useContext } from "react";
import { Calendar, Scheduler, useArrayState } from "@cubedoodl/react-simple-scheduler";
import { api_calendar_all } from "../api";
import { CurrentUser } from "../components/Contexts";
import AddEventModal from "../components/AddEventModal";
import ViewEventModal from "../components/ViewEventModal";
import ROLES from "../constants/roles";
import "../styles/CalendarPage.css";

/*
 * Current TODOs:
 *   - Repeating events
 *   - Fix occasional addition of event when clicking on existing event
 *   - Change volunteer listing in admin view event modal to waste less space
 *   - Better indication that an event is in multiple calendars
 *   - Mobile support/overall better responsiveness
 *   - Style cleanups (e.g. color scheme)
 *   - Memory leak testing/performance tuning
 *   - Keyboard shortcuts
 */
function CalendarPage() {
  const [currentUser] = useContext(CurrentUser);

  const [_rerender, setRerender] = useState();
  const [selected, setSelected] = useState(new Date());
  const [events, setEvents, addEvent, deleteEvent] = useArrayState();
  const [eventAcquire, setEventAcquire] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [addModal, setAddModal] = useState();
  const [viewModal, setViewModal] = useState();
  const [tempEvent, setTempEvent] = useState();

  const [calendars] = useState(
    ROLES.map((role) => ({
      ...role,
      enabled: true,
    }))
  );

  function style_from_event(ev) {
    const css = calendars.find((cal) => cal.name === ev.calendars[0]) ?? calendars[0];

    if (!currentUser.admin && !ev.volunteers.some((vol) => vol._id === currentUser._id)) {
      return {
        background: "white",
        color: css.color,
        border: `1px solid ${css.color}`,
      };
    }
    return css;
  }

  function sanitize_calendars(cals) {
    return cals.map((incal) => calendars.find((outcal) => incal === outcal.name));
  }

  function sanitize_event(ev) {
    return {
      ...ev,
      from: new Date(ev.from),
      to: new Date(ev.to),
      calendar: sanitize_calendars(ev.calendars),
      style: style_from_event(ev),
      volunteers: ev.volunteers.map((vol) => ({
        ...vol,
        guests: ev.guests.filter((guest) => guest.with._id === vol._id),
      })),
    };
  }

  useEffect(async () => {
    const res = await api_calendar_all();
    if (res && res instanceof Array) {
      setEvents(res.map(sanitize_event));
    }
  }, [eventAcquire]);

  return (
    <main className="calendar" role="main">
      <div>
        {currentUser.admin && (
          <button
            type="button"
            className="calendar_new"
            onClick={() => {
              setIsEditing(false);
              setAddModal(true);
            }}
          >
            <img src="/img/calendar_add.svg" alt="New event" />
            <div>New Event</div>
          </button>
        )}
        <Calendar selected={selected} setSelected={setSelected} />
        <div className="calendars_list">
          <div className="calendars_header">View calendars</div>
          {calendars.map((cal) => (
            <label key={cal.name} className="calendar_label" htmlFor={cal.name}>
              <div>
                <input
                  type="checkbox"
                  id={cal.name}
                  checked={cal.enabled}
                  onChange={(e) => {
                    cal.enabled = e.target.checked;
                    setRerender(Math.random());
                  }}
                />
                <div
                  className="calendar_checkbox"
                  style={{ "--checked-color": cal.color ?? "#00BAB3" }}
                />
              </div>
              <div>{cal.name}</div>
            </label>
          ))}
        </div>
      </div>
      <Scheduler
        events={events}
        selected={selected}
        setSelected={setSelected}
        editable={currentUser.admin}
        onRequestAdd={(cur) => {
          if (!currentUser.admin) return;

          setIsEditing(false);
          setAddModal(cur);

          const tmp = {
            ...cur,
            name: "(No title)",
            calendar: {
              enabled: true,
            },
          };
          addEvent(tmp);
          setTempEvent(tmp);
        }}
        onRequestEdit={(evt) => setViewModal(evt)}
      />

      <AddEventModal
        currentEvent={addModal}
        setCurrentEvent={() => {
          setAddModal();
          deleteEvent(tempEvent);
          setTempEvent();
        }}
        onAddEvent={(val) => {
          setEventAcquire(val);
          if (isEditing) setViewModal(sanitize_event(val));
        }}
        isEditing={isEditing}
      />
      <ViewEventModal
        event={viewModal}
        isOpen={Boolean(viewModal)}
        setIsOpen={setViewModal}
        changeEvent={() => setEventAcquire(Math.random())}
        editEvent={() => {
          setIsEditing(true);
          setAddModal(viewModal);
        }}
      />
    </main>
  );
}

export default CalendarPage;
