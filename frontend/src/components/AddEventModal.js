import React, { useState } from "react";
import Modal from "react-modal";
import DATE_UTILS from "../date";
import { api_calendar_new } from "../api";
import "../styles/AddEventModal.css";

Modal.setAppElement("#root");

function FormInput({ type, placeholder, step, onChange, value, setValue, error, setError }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={error ? "error" : ""}
      step={step}
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

export default function AddEventModal({ currentEvent, setCurrentEvent, calendars, addEvent }) {
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState();

  const [calendar, setCalendar] = useState("");
  const [errorCalendar, setErrorCalendar] = useState();

  const [from, setFrom] = useState();
  const [errorFrom, setErrorFrom] = useState();

  const [to, setTo] = useState();
  const [errorTo, setErrorTo] = useState();

  const [numberNeeded, setNumberNeeded] = useState();
  const [errorNumberNeeded, setErrorNumberNeeded] = useState();

  const [loc, setLoc] = useState();
  const [errorLoc, setErrorLoc] = useState();

  const [question, setQuestion] = useState("");

  const [over18, setOver18] = useState(false);
  const [under18, setUnder18] = useState(false);

  const [animationPlaying, setAnimationPlaying] = useState(false);

  function on_open() {
    setName("");
    setErrorName();

    setCalendar("");
    setErrorCalendar();

    setFrom(currentEvent.from ? new Date(currentEvent.from) : new Date());
    setErrorFrom();

    setTo(currentEvent.to ? new Date(currentEvent.to) : DATE_UTILS.walk_hour(new Date(), 1));
    setErrorTo();

    setNumberNeeded();
    setErrorNumberNeeded();

    setLoc();
    setErrorLoc();

    setQuestion("");
    setOver18(false);
    setUnder18(false);
  }

  function change_date(e) {
    setFrom(DATE_UTILS.copy_ymd(from, e.target.value));
    setTo(DATE_UTILS.copy_ymd(to, e.target.value));
  }

  function change_time(e) {
    setFrom(DATE_UTILS.copy_time(from, e.target.value));
    setTo(DATE_UTILS.copy_time(to, e.target.value));
  }

  async function add_event(e) {
    e.preventDefault();

    let has_err = false;

    if (!name || name.trim() === "") {
      setErrorName(true);
      has_err = true;
    }
    if (!calendar || calendar.trim() === "") {
      setErrorCalendar(true);
      has_err = true;
    }
    if (!from || from.toString().trim() === "") {
      setErrorFrom(true);
      has_err = true;
    }
    if (!to || to.toString().trim() === "") {
      setErrorTo(true);
      has_err = true;
    }
    if (!numberNeeded) {
      setErrorNumberNeeded(true);
      has_err = true;
    }
    if (!loc || loc.trim() === "") {
      setErrorLoc(true);
      has_err = true;
    }

    if (has_err) return;

    const res = await api_calendar_new({
      from,
      to,
      name,
      calendar: calendar || calendars[0].name,
      number_needed: numberNeeded,
      location: loc,
      question,
      over18,
      under18,
    });
    if (res && !res.error) {
      res.event.calendar = calendars.find((cal) => cal.name === res.event.calendar) ?? calendars[0];
      addEvent(res.event);
      setAnimationPlaying(true);
      setCurrentEvent();
      setTimeout(() => setAnimationPlaying(false), 2500);
    }
  }

  return (
    <>
      <Modal
        isOpen={Boolean(currentEvent)}
        onRequestClose={() => setCurrentEvent()}
        onAfterOpen={() => on_open()}
        className="evt_modal"
        overlayClassName="evt_modal_overlay"
      >
        <form onSubmit={add_event}>
          <div className="evt_modal_header">
            <h1>Create an Event</h1>
            <button type="button" onClick={() => setCurrentEvent()}>
              <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
            </button>
          </div>
          <div className="evt_modal_content">
            <div>
              <FormInput
                type="text"
                placeholder="Event Name"
                value={name}
                setValue={setName}
                error={errorName}
                setError={setErrorName}
              />
              <br />
              <img src="/img/calendar_date.svg" alt="Date" />
              <FormInput
                type="date"
                value={DATE_UTILS.format_ymd(from)}
                onChange={(e) => change_date(e)}
              />
              <br />
              <img src="/img/calendar_time.svg" alt="Time" />
              <FormInput
                type="time"
                step={60}
                value={DATE_UTILS.format_time(from, false, false, true)}
                onChange={(e) => change_time(e)}
                error={errorFrom}
                setError={setErrorFrom}
              />
              –
              <FormInput
                type="time"
                step={60}
                value={DATE_UTILS.format_time(to, false, false, true)}
                onChange={(e) => change_time(e, false)}
                error={errorTo}
                setError={setErrorTo}
              />
              <br />
              <div className="indent">
                <select>
                  <option>Does not repeat</option>
                  <option>Daily</option>
                  <option>Weekly on Saturday</option>
                  <option>Bi-Weekly on Saturday</option>
                  <option>Annually on February 14</option>
                  <option>Every Weekday (Mon-Fri)</option>
                </select>
              </div>
              <img src="/img/calendar_people.svg" alt="People" />
              <FormInput
                type="number"
                placeholder="# of volunteers needed"
                setValue={setNumberNeeded}
                error={errorNumberNeeded}
                setError={setErrorNumberNeeded}
              />
              <br />
              <div className="indent">
                <button type="button">Assign volunteers</button>
              </div>
              <br />
              <img src="/img/calendar_location.svg" alt="Location" />
              <FormInput
                type="text"
                placeholder="Location (or Zoom link)"
                setValue={setLoc}
                error={errorLoc}
                setError={setErrorLoc}
              />
            </div>
            <div>
              <img src="/img/calendar_send.svg" alt="Send to" />
              <select
                className={`styled ${errorCalendar ? "error" : ""}`}
                value={calendar}
                onChange={(e) => {
                  setCalendar(e.target.value);
                  setErrorCalendar(false);
                }}
              >
                <option value="" disabled>
                  Send event to
                </option>
                {calendars.map((cal) => (
                  <option key={cal.name} value={cal.name}>
                    {cal.name}
                  </option>
                ))}
              </select>
              <br />
              <br />
              <textarea
                placeholder="Add a question..."
                onChange={(e) => setQuestion(e.target.value)}
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
            <button type="submit">Create</button>
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
    </>
  );
}
