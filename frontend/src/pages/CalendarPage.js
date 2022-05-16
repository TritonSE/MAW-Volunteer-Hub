import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import {
  Calendar,
  Scheduler,
  MobileScheduler,
  useArrayState,
} from "@cubedoodl/react-simple-scheduler";
import { api_calendar_all } from "../api";
import { CurrentUser } from "../components/Contexts";
import AddEventModal from "../components/AddEventModal";
import ViewEventModal from "../components/ViewEventModal";
import ROLES from "../constants/roles";
import "../styles/CalendarPage.css";

Modal.setAppElement("#root");

function CalendarsList({
  calendars,
  calEnabled,
  setCalEnabled,
  events,
  setEvents,
  styleFromEvent,
}) {
  return (
    <div className="calendars_list">
      <div className="calendars_header">View calendars</div>
      {calendars.map((cal, ind) => (
        <label key={cal.name} className="calendar_label" htmlFor={cal.name}>
          <div>
            <input
              type="checkbox"
              id={cal.name}
              checked={calEnabled[ind]}
              onChange={(e) => {
                const arr = calEnabled.map((en, subind) => {
                  if (subind === ind) return e.target.checked;
                  return en;
                });
                setCalEnabled(arr);
                setEvents(
                  events.map((evt) => {
                    const out = { ...evt };
                    out.style = styleFromEvent(out, arr);
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
      {calendars.length === 0 && <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No roles.</>}
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

  const [calendars] = useState(
    currentUser.admin > 0 ? ROLES : ROLES.filter((role) => currentUser.roles.includes(role.name))
  );
  const [calEnabled, setCalEnabled] = useState(ROLES.map(() => true));

  function unify_event(evt) {
    const date = evt.from.toDateString();
    let rep = evt.repetitions[date];
    if (!rep) {
      rep = {
        attendees: {},
      };
    }

    return {
      ...rep,
      ...evt,
    };
  }

  function style_from_event(ev_unprocessed, en = calEnabled) {
    const ev = unify_event(ev_unprocessed);
    const css = calendars.find((cal, ind) => en[ind] && ev.calendars.includes(cal.name));

    if (!css) return { display: "none" };

    if (!currentUser.admin && !ev.attendees[currentUser._id]) {
      return {
        background: "white",
        color: css.color,
        border: `1px solid ${css.color}`,
      };
    }
    return css;
  }

  function sanitize_calendars(cals) {
    return cals.map((incal) => {
      const outcal = calendars.findIndex((tmp) => incal === tmp.name);
      return {
        ...calendars[outcal],
        enabled: () => calEnabled[outcal],
      };
    });
  }

  function sanitize_event(ev) {
    return {
      ...ev,
      from: new Date(ev.from),
      to: new Date(ev.to),
      calendar: sanitize_calendars(ev.calendars),
      style: (e) => style_from_event(e),
    };
  }

  useEffect(() => {
    document.title = "Calendar - Make-a-Wish San Diego";

    function resize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(async () => {
    const res = await api_calendar_all();
    if (res && res instanceof Array) {
      setEvents(res.map(sanitize_event));
    }
  }, [eventAcquire]);

  return (
    <main className="calendar" role="main">
      <div>
        {currentUser.admin > 0 && (
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
          <MobileScheduler
            events={events}
            onRequestEdit={(evt) => setViewModal(unify_event(evt))}
          />
        ) : (
          <>
            <Calendar selected={selected} setSelected={setSelected} />
            <div className="calendar_spacer" />
            <CalendarsList
              calendars={calendars}
              calEnabled={calEnabled}
              setCalEnabled={setCalEnabled}
              events={events}
              setEvents={setEvents}
              styleFromEvent={(evt, arr) => style_from_event(evt, arr)}
            />
          </>
        )}
      </div>
      <Scheduler
        events={events}
        selected={selected}
        setSelected={setSelected}
        editable={currentUser.admin > 0}
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
        onRequestEdit={(evt) => setViewModal(unify_event(evt))}
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
          if (isEditing) setViewModal(unify_event(sanitize_event(val)));
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
      <Modal
        isOpen={calendarModal}
        onRequestClose={() => setCalendarModal(false)}
        className="calendar_modal"
        overlayClassName="calendar_modal_overlay"
      >
        <CalendarsList
          calendars={calendars}
          calEnabled={calEnabled}
          setCalEnabled={setCalEnabled}
          events={events}
          setEvents={setEvents}
          styleFromEvent={(evt, arr) => style_from_event(evt, arr)}
        />
      </Modal>
    </main>
  );
}

export default CalendarPage;
