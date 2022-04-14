import React, { useState, useEffect, useContext } from "react";
import { Calendar, Scheduler, useArrayState } from "@cubedoodl/react-simple-scheduler";
import { api_calendar_all } from "../api";
import { CurrentUser } from "../components/Contexts";
import AddEventModal from "../components/AddEventModal";
import ViewEventModal from "../components/ViewEventModal";
import "../styles/CalendarPage.css";

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

  const [calendars] = useState([
    {
      name: "Wish Granters",
      background: "#CCF1F0",
      color: "#00BAB3",
      enabled: true,
    },
    {
      name: "Volunteers",
      background: "#FFF0DB",
      color: "#FFB549",
      enabled: true,
    },
    {
      name: "Mentor",
      background: "#FAEDDB",
      color: "#E2C094",
      enabled: true,
    },
    {
      name: "Airport Greeter",
      background: "#FFB3AE",
      color: "#FE5F55",
      enabled: true,
    },
    {
      name: "Office",
      background: "#CBE2CA",
      color: "#80B87E",
      enabled: true,
    },
    {
      name: "Special Events",
      background: "#D2CDF4",
      color: "#8F82E3",
      enabled: true,
    },
    {
      name: "Translator",
      background: "#CBC4D4",
      color: "#67597A",
      enabled: true,
    },
    {
      name: "Speaker's Bureau",
      background: "#BCC6C8",
      color: "#5C6C70",
      enabled: true,
    },
    {
      name: "Las Estrellas",
      background: "#F1D2CC",
      color: "#BA0068",
      enabled: true,
    },
  ]);

  function style_from_event(ev) {
    const css = calendars.find((cal) => cal.name === ev.calendar) ?? calendars[0];

    if (!currentUser.admin && !ev.volunteers.includes(currentUser._id)) {
      return {
        background: "white",
        color: css.color,
        border: `1px solid ${css.color}`,
      };
    }
    return css;
  }

  function sanitize_event(ev) {
    return {
      ...ev,
      from: new Date(ev.from),
      to: new Date(ev.to),
      style: style_from_event(ev),
      calendar: calendars.find((cal) => cal.name === ev.calendar) ?? calendars[0],
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
        calendars={calendars}
        addEvent={setEventAcquire}
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
