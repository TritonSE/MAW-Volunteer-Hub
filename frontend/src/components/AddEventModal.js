/* eslint jsx-a11y/no-autofocus: off */
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import ReactSelect from "react-select";
import {
  Calendar,
  DateFormatter,
  dateFunctions,
  date_format,
} from "@cubedoodl/react-simple-scheduler";
import RoleSelect from "./RoleSelect";
import AssignModal from "./AssignModal";
import ROLES from "../constants/roles";
import { api_calendar_new, api_calendar_update } from "../api";
import "../styles/AddEventModal.css";

Modal.setAppElement("#root");

function FormInput({
  type,
  placeholder,
  autoFocus,
  step,
  min,
  onChange,
  value,
  setValue,
  error,
  setError,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={error ? "error" : ""}
      step={step}
      min={min}
      value={value}
      onChange={
        onChange ??
        ((e) => {
          setValue(e.target.value);
          setError(false);
        })
      }
    />
  );
}

export default function AddEventModal({ currentEvent, setCurrentEvent, onAddEvent, isEditing }) {
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState();

  const [calendars, setCalendars] = useState([]);
  const [errorCalendars, setErrorCalendars] = useState();

  const [from, setFrom] = useState(new Date());
  const [errorFrom, setErrorFrom] = useState();

  const [to, setTo] = useState(new Date());
  const [errorTo, setErrorTo] = useState();

  const [repeat, setRepeat] = useState();

  const [numberNeeded, setNumberNeeded] = useState();
  const [errorNumberNeeded, setErrorNumberNeeded] = useState();

  const [volunteers, setVolunteers] = useState([]);

  const [loc, setLoc] = useState();
  const [errorLoc, setErrorLoc] = useState();

  const [question, setQuestion] = useState("");

  const [over18, setOver18] = useState(false);
  const [under18, setUnder18] = useState(false);

  const [assignModal, setAssignModal] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [animationPlaying, setAnimationPlaying] = useState(false);

  const [repetitionOptions, setRepetitionOptions] = useState([
    {
      value: 0,
      label: "Does not repeat",
    },
  ]);

  useEffect(() => setTo(dateFunctions.copy_time(from, to)), [from]);

  function on_open() {
    const from_tmp = currentEvent?.from ? new Date(currentEvent.from) : new Date();
    const rep_tmp = [
      {
        value: 0,
        label: "Does not repeat",
      },
      {
        value: 1,
        label: "Daily",
      },
      {
        value: 2,
        label: (
          <>
            Weekly on <DateFormatter date={from_tmp} fmt="X" />
          </>
        ),
      },
      {
        value: 3,
        label: (
          <>
            Bi-Weekly on <DateFormatter date={from_tmp} fmt="X" />
          </>
        ),
      },
      {
        value: 4,
        label: "Monthly",
      },
      {
        value: 5,
        label: (
          <>
            Annually on <DateFormatter date={from_tmp} fmt="O d" />
          </>
        ),
      },
      {
        value: 6,
        label: "Every Weekday (Mon-Fri)",
      },
    ];

    setName(currentEvent?.name ?? "");
    setErrorName();

    if (currentEvent?.calendars) {
      setCalendars(
        currentEvent.calendars.map((cal_name) => ({
          ...ROLES.find((role) => role.name === cal_name),
          value: cal_name,
          label: cal_name,
        }))
      );
    } else {
      setCalendars([]);
    }
    setErrorCalendars();

    setFrom(from_tmp);
    setErrorFrom();

    setTo(currentEvent?.to ? new Date(currentEvent.to) : dateFunctions.walk_hour(new Date(), 1));
    setErrorTo();

    setRepetitionOptions(rep_tmp);

    if (currentEvent?.repeat) {
      setRepeat(rep_tmp.find((rep) => rep.value === currentEvent.repeat) ?? rep_tmp[0]);
    } else {
      setRepeat(rep_tmp[0]);
    }

    setNumberNeeded(currentEvent?.number_needed ?? "");
    setErrorNumberNeeded();

    setVolunteers(Object.values(currentEvent?.attendees ?? {}).map((att) => att.volunteer));

    setLoc(currentEvent?.location ?? "");
    setErrorLoc();

    setQuestion(currentEvent?.question ?? "");
    setOver18(currentEvent?.over18 ?? false);
    setUnder18(currentEvent?.under18 ?? false);
  }

  function change_time(e, kind) {
    if (e.target.value.trim() === "") return;

    const d = new Date(from);
    const arr = e.target.value.split(":");
    d.setHours(Number.parseInt(arr[0], 10));
    d.setMinutes(Number.parseInt(arr[1], 10));

    if (kind === 0) setFrom(d);
    else {
      setTo(d);
      setErrorTo(false);
    }
  }

  async function add_event(e) {
    e.preventDefault();

    /*
     * VALIDATION
     */
    let has_err = false;

    if (!name || name.trim() === "") {
      setErrorName(true);
      has_err = true;
    }
    if (!calendars || calendars.length === 0) {
      setErrorCalendars(true);
      has_err = true;
    }
    if (!from || from.toString().trim() === "") {
      setErrorFrom(true);
      has_err = true;
    }
    if (!to || to.toString().trim() === "" || to < from) {
      setErrorTo(true);
      has_err = true;
    }
    if (!numberNeeded || numberNeeded < 0) {
      setErrorNumberNeeded(true);
      has_err = true;
    }
    if (!loc || loc.trim() === "") {
      setErrorLoc(true);
      has_err = true;
    }

    if (has_err) return;

    /*
     * VOLUNTEER ASSIGNMENT
     */
    const date = from.toDateString();
    /* Deep clone via new JS API */
    const repetitions = structuredClone(currentEvent.repetitions ?? {});
    const rep = repetitions[date] ?? {
      attendees: {},
      completed: false,
    };

    volunteers.forEach(({ _id }) => {
      /* Nullish assignment via new JS operator */
      rep.attendees[_id] ??= {
        volunteer: _id,
        guests: [],
        response: "",
      };
    });

    repetitions[date] = rep;

    /*
     * API REQUEST
     */
    const args = {
      from: from.toISOString(),
      to: to.toISOString(),
      name,
      calendars: calendars.map((cal) => cal.name),
      number_needed: numberNeeded,
      location: loc,

      repeat: repeat.value,
      repetitions,

      over18,
      under18,
      question,
    };

    const res = await (isEditing
      ? api_calendar_update(currentEvent._id, args)
      : api_calendar_new(args));
    if (res && !res.error) {
      onAddEvent(res.event);
      setCurrentEvent();
      if (!isEditing) {
        setAnimationPlaying(true);
        setTimeout(() => setAnimationPlaying(false), 2500);
      }
    }
  }

  return (
    <>
      <Modal
        isOpen={Boolean(currentEvent)}
        onRequestClose={() => setCurrentEvent()}
        onAfterOpen={() => on_open()}
        className="evt_modal"
        overlayClassName="evt_modal_overlay highest"
      >
        <form onSubmit={add_event} id="aria_modal_form">
          <div className="evt_modal_header">
            <h1>{isEditing ? "Edit" : "Create"} an Event</h1>
            <button type="button" onClick={() => setCurrentEvent()}>
              <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
            </button>
          </div>
          <div className="evt_modal_content" aria-describedby="aria_modal_form">
            <div>
              <FormInput
                type="text"
                placeholder="Event Name"
                autoFocus
                value={name}
                setValue={setName}
                error={errorName}
                setError={setErrorName}
              />
              <br />
              <img src="/img/calendar_date.svg" alt="Date" />
              <input
                type="date"
                value={date_format(from, "4Y-2n-2d")}
                onFocus={() => setCalendarVisible(true)}
                readOnly
              />
              {from && calendarVisible ? (
                <>
                  <div
                    role="presentation"
                    className="date_picker_overlay"
                    onClick={() => setCalendarVisible(false)}
                    onKeyDown={() => setCalendarVisible(false)}
                  />
                  <Calendar selected={from} setSelected={setFrom} />
                </>
              ) : null}
              <br />
              <img src="/img/calendar_time.svg" alt="Time" />
              <FormInput
                type="time"
                step={60}
                value={date_format(from, "2H:2M")}
                onChange={(e) => change_time(e, 0)}
                error={errorFrom}
                setError={setErrorFrom}
              />
              –
              <FormInput
                type="time"
                step={60}
                value={date_format(to, "2H:2M")}
                onChange={(e) => change_time(e, 1)}
                error={errorTo}
                setError={setErrorTo}
              />
              <br />
              <div className="indent">
                <ReactSelect
                  options={repetitionOptions}
                  value={repeat}
                  onChange={(newVal) => setRepeat(newVal)}
                  styles={{
                    container: (provided) => ({
                      ...provided,
                      flex: "1",
                      marginBottom: "10px",
                      maxWidth: "216px",
                      maxHeight: "70px",
                      fontSize: "14px",
                    }),
                    control: (provided) => ({
                      ...provided,
                      border: "1px solid black !important",
                    }),
                  }}
                />
              </div>
              <img src="/img/calendar_people.svg" alt="People" />
              <FormInput
                type="number"
                placeholder="# of volunteers needed"
                min={0}
                value={numberNeeded ?? ""}
                setValue={setNumberNeeded}
                error={errorNumberNeeded}
                setError={setErrorNumberNeeded}
              />
              <br />
              <div className="indent">
                <button type="button" onClick={() => setAssignModal(true)}>
                  Assign volunteers
                </button>
              </div>
              <br />
              <img src="/img/calendar_location.svg" alt="Location" />
              <FormInput
                type="text"
                placeholder="Location (or Zoom link)"
                value={loc ?? ""}
                setValue={setLoc}
                error={errorLoc}
                setError={setErrorLoc}
              />
            </div>
            <div>
              <div className="evt_modal_row">
                <img src="/img/calendar_send.svg" alt="Send to" />
                <RoleSelect
                  value={calendars}
                  setValue={(val) => {
                    setCalendars(val);
                    setErrorCalendars(false);
                  }}
                  hasError={errorCalendars}
                />
              </div>
              <br />
              <br />
              <textarea
                placeholder="Add a question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={175}
              />
              <br />
              <br />
              <div className="evt_modal_guests">
                <span>Guests Allowed</span>
                <div>
                  <label htmlFor="over18">
                    <input
                      type="checkbox"
                      id="over18"
                      checked={over18}
                      onChange={(e) => {
                        setOver18(e.target.checked);
                        if (e.target.checked) setUnder18(false);
                      }}
                    />
                    <div className="calendar_checkbox" />
                    <span>Over 18 years only</span>
                  </label>
                  <label htmlFor="under18">
                    <input
                      type="checkbox"
                      id="under18"
                      checked={under18}
                      onChange={(e) => {
                        setUnder18(e.target.checked);
                        if (e.target.checked) setOver18(false);
                      }}
                    />
                    <div className="calendar_checkbox" />
                    <span>Under 18 years</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="evt_modal_footer">
            <button type="submit">{isEditing ? "Save" : "Create"}</button>
          </div>
        </form>
      </Modal>
      <div className={`wand_container ${animationPlaying ? "playing" : ""}`}>
        <svg
          width="120"
          height="120"
          viewBox="-12 -12 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="wand_svg"
        >
          <g clipPath="url(#clip0_1433_12590)">
            <path
              d="M48 96C74.5097 96 96 74.5097 96 48C96 21.4903 74.5097 0 48 0C21.4903 0 0 21.4903 0 48C0 74.5097 21.4903 96 48 96Z"
              fill="#8DC8E8"
              className="wand_bgd"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M62.3109 28.4245L11.5384 79.197C14.0476 82.1267 16.8989 84.7451 20.0315 86.996L70.4574 36.5701C71.5826 35.4459 70.6706 32.7099 68.4213 30.4606C66.171 28.2123 63.435 27.3003 62.3109 28.4245Z"
              fill="#ECF0F1"
              className="wand_main"
            />
            <path
              d="M84.9607 22.0819C85.697 15.457 89.3767 11.7763 96.0007 11.041C89.3767 10.3046 85.6961 6.62496 84.9607 0.00096C84.2244 6.62496 80.5447 10.3056 73.9207 11.041C80.5437 11.7763 84.2244 15.457 84.9607 22.0819ZM30.2407 0C29.7607 4.32 27.3607 6.72 23.0397 7.20096C27.3597 7.68096 29.7607 10.081 30.2407 14.401C30.7207 10.081 33.1207 7.68096 37.4417 7.20096C33.1207 6.72 30.7207 4.32 30.2407 0ZM87.8407 44.161C87.3607 48.481 84.9607 50.881 80.6397 51.3619C84.9597 51.8419 87.3607 54.2419 87.8407 58.5619C88.3207 54.2419 90.7207 51.8419 95.0417 51.3619C90.7207 50.881 88.3207 48.48 87.8407 44.161Z"
              fill="#F0C419"
              className="wand_sparkles gold"
            />
            <path
              d="M68.64 50.88C68.2877 54.047 66.528 55.8077 63.36 56.16C66.528 56.5114 68.2886 58.272 68.64 61.439C68.9923 58.272 70.752 56.5114 73.92 56.16C70.752 55.8077 68.9913 54.0461 68.64 50.88ZM44.64 21.119C44.2877 24.287 42.528 26.0477 39.36 26.4C42.528 26.7523 44.2886 28.511 44.64 31.68C44.9923 28.511 46.752 26.7523 49.92 26.4C46.752 26.0477 44.9913 24.287 44.64 21.119ZM56.16 2.88C55.8077 6.04608 54.048 7.80768 50.88 8.16C54.048 8.51136 55.8086 10.272 56.16 13.439C56.5113 10.272 58.272 8.51136 61.44 8.16C58.272 7.80768 56.5113 6.04608 56.16 2.88Z"
              fill="white"
              className="wand_sparkles white"
            />
          </g>
        </svg>
        <h1>Event Created</h1>
      </div>
      <AssignModal
        isOpen={assignModal}
        setOpen={setAssignModal}
        volunteers={volunteers}
        setVolunteers={setVolunteers}
      />
    </>
  );
}
