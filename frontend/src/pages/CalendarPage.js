import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { Calendar, Scheduler, useArrayState } from "@cubedoodl/react-simple-scheduler";
import { api_calendar_all } from "../api";
import { CurrentUser } from "../components/Contexts";
import MobileScheduler from "../components/MobileScheduler";
import AddEventModal from "../components/AddEventModal";
import ViewEventModal from "../components/ViewEventModal";
import ROLES from "../constants/roles";
import "../styles/CalendarPage.css";

Modal.setAppElement("#root");

/*
 * Current TODOs:
 *   - Repeating events (this will take some work)
 *   - Style cleanups (e.g. color scheme)
 *   - Memory leak testing/performance tuning
 *   - Keyboard shortcuts
 */
function CalendarsList({ calendars, events, setEvents, styleFromEvent }) {
  return (
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
                setEvents(
                  events.map((evt) => {
                    const out = { ...evt };
                    const subcal = out.calendar.find((tmp) => tmp.name === cal.name);
                    if (subcal) {
                      subcal.enabled = e.target.checked;
                      out.style = styleFromEvent(out);
                    }
                    return out;
                  })
                );
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
  );
}

function CalendarPage() {
  const [currentUser] = useContext(CurrentUser);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selected, setSelected] = useState(new Date());
  const [events, setEvents, addEvent, deleteEvent] = useArrayState();
  const [eventAcquire, setEventAcquire] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [addModal, setAddModal] = useState();
  const [viewModal, setViewModal] = useState();
  const [calendarModal, setCalendarModal] = useState(false);
  const [tempEvent, setTempEvent] = useState();

  const [calendars, setCalendars] = useState(
    ROLES.map((role) => ({
      ...role,
      enabled: true,
    }))
  );

  function style_from_event(ev) {
    const css =
      calendars.find((cal) => cal.enabled && ev.calendars.includes(cal.name)) ?? calendars[0];

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

  useEffect(() => {
    function resize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(async () => {
    setCalendars([...calendars]);
    const res = await api_calendar_all();
    if (res && res instanceof Array) {
      setEvents(res.map(sanitize_event));
    }
  }, [eventAcquire]);

  return (
    <main className="calendar" role="main">
      <div>
        {currentUser.admin && (
          <div className="mobile_row">
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
            {windowWidth < 600 && (
              <>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <button
                  type="button"
                  className="calendar_modal_toggle"
                  onClick={() => setCalendarModal(true)}
                >
                  <img src="/img/calendar_date.svg" alt="Toggle calendars" />
                </button>
              </>
            )}
          </div>
        )}
        {windowWidth < 600 ? (
          <MobileScheduler events={events} onRequestEdit={(evt) => setViewModal(evt)} />
        ) : (
          <>
            <Calendar selected={selected} setSelected={setSelected} />
            <CalendarsList
              calendars={calendars}
              events={events}
              setEvents={setEvents}
              styleFromEvent={(evt) => style_from_event(evt)}
            />
          </>
        )}
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
      <Modal isOpen={calendarModal} onRequestClose={() => setCalendarModal(false)}>
        <CalendarsList
          calendars={calendars}
          events={events}
          setEvents={setEvents}
          styleFromEvent={(evt) => style_from_event(evt)}
        />
      </Modal>
    </main>
  );
}

export default CalendarPage;
