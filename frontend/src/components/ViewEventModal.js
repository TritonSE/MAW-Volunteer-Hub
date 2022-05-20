import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import {
  DateFormatter,
  DateRangeFormatter,
  useArrayState,
} from "@cubedoodl/react-simple-scheduler";
import ROLES from "../constants/roles";
import { api_calendar_delete, api_calendar_respond } from "../api";
import { CurrentUser } from "./Contexts";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";

function GuestsContainer({ guests, addGuest, deleteGuest }) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");

  const [nameError, setNameError] = useState(false);
  const [relationError, setRelationError] = useState(false);

  useEffect(() => setNameError(false), [name]);
  useEffect(() => setRelationError(false), [relation]);

  return (
    <div className="guests_container">
      <form className="guest_form" onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="Guest's name"
          className={nameError ? "error" : ""}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Guest's relationship to you"
          className={relationError ? "error" : ""}
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
        />
        <button
          type="button"
          className="fullwidth"
          onClick={() => {
            let has_error = 0;
            if (name.trim() === "") {
              setNameError(true);
              has_error = 1;
            }
            if (relation.trim() === "") {
              setRelationError(true);
              has_error = 1;
            }
            if (has_error) return;

            addGuest({ name, relation });
            setName("");
            setRelation("");
          }}
        >
          Add
        </button>
      </form>
      {guests.length > 0 ? (
        <div className="chips">
          {guests.map((guest) => (
            <div key={guest.name + guest.relation} className="chip">
              {guest.name}
              <button type="button" onClick={() => deleteGuest(guest)}>
                x
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div>Total number of guests: {guests.length}</div>
    </div>
  );
}

function ConfirmationModal({
  confirmModal,
  setConfirmModal,
  setIsOpen,
  saveResponse,
  deleteEvent,
}) {
  const modals = [
    <>
      <div>
        You have unsaved changes.
        <br />
        <br />
        Are you sure you would like to
        <br />
        return to the calendar?
      </div>
      <br />
      <div className="rows">
        <button type="button" onClick={() => setConfirmModal(0)}>
          Cancel
        </button>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button type="button" className="error" onClick={() => setIsOpen(false)}>
          Return
        </button>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button type="button" className="primary" onClick={() => saveResponse(true)}>
          Save
        </button>
      </div>
    </>,
    <>
      <div>Are you sure you want to respond &quot;Not going&quot;?</div>
      <br />
      <div className="rows">
        <button type="button" onClick={() => setConfirmModal(0)}>
          Cancel
        </button>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button type="button" className="error" onClick={() => saveResponse(false)}>
          Yes
        </button>
      </div>
    </>,
    <div>
      <b>Error</b>:
      <br />
      <br />
      No guests listed.
      <br />
      <br />
      <button type="button" onClick={() => setConfirmModal(0)}>
        Return
      </button>
    </div>,
    <div>
      <b>Error</b>:
      <br />
      <br />
      Invalid guests list.
      <br />
      <br />
      <button type="button" onClick={() => setConfirmModal(0)}>
        Return
      </button>
    </div>,
    <div>
      Are you sure you want to delete this event?
      <br />
      <br />
      <div className="rows">
        <button type="button" onClick={() => setConfirmModal(0)}>
          Cancel
        </button>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <button type="button" className="error" onClick={() => deleteEvent()}>
          Yes
        </button>
      </div>
    </div>,
  ];

  return (
    <Modal
      isOpen={Boolean(confirmModal)}
      onRequestClose={() => setConfirmModal(0)}
      className="evt_modal confirm"
      overlayClassName="evt_modal_overlay"
    >
      <div className="columns">{confirmModal > 0 ? modals[confirmModal - 1] : null}</div>
    </Modal>
  );
}

function Abbreviator({ content, maxLength }) {
  return (
    <>
      {content.substring(0, maxLength)}
      {content.length >= maxLength ? (
        <>
          ...&nbsp;
          <span className="more">Read more</span>
        </>
      ) : null}
    </>
  );
}

export default function ViewEventModal({ event, isOpen, setIsOpen, changeEvent, editEvent }) {
  if (!event) return null;

  const [currentUser] = useContext(CurrentUser);

  const [hasGuests, setHasGuests] = useState(false);
  const [guests, setGuests, addGuest, deleteGuest] = useArrayState([]);
  const [response, setResponse] = useState("");
  const [responseView, setResponseView] = useState();

  const [hasChanges, setHasChanges] = useState(-1);
  const [confirmModal, setConfirmModal] = useState(0);
  const [volModal, setVolModal] = useState(false);

  const [guestsCount, setGuestsCount] = useState(0);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [attendeesArray, setAttendeesArray] = useState([]);

  useEffect(() => {
    const att = event.attendees[currentUser._id];

    if (att && att.guests.length > 0) {
      setGuests(att.guests);
      setHasGuests(true);
    }

    setResponse(att?.response ?? "");

    setGuestsCount(
      Object.values(event.attendees).reduce((prev, next) => prev + next.guests.length, 0)
    );
  }, []);

  useEffect(() => setHasChanges(hasChanges + 1), [hasGuests, guests, response]);

  useEffect(() => setAttendeesArray(Object.values(event.attendees)), [event]);

  async function save_response(going) {
    if (going && hasGuests) {
      if (guests.length === 0) {
        setConfirmModal(3);

        return;
      }

      const arr = guests.filter(
        (guest) => guest.name.trim() === "" || guest.relation.trim() === ""
      );

      if (arr.length > 0) {
        setConfirmModal(4);

        return;
      }
    }

    const res = await api_calendar_respond(
      event._id,
      going,
      event.from.toDateString(),
      guests,
      response
    );
    if (res && !res.error) {
      changeEvent();
      setIsOpen(false);
    }
  }

  async function delete_event() {
    const res = await api_calendar_delete(event._id);
    if (res && !res.error) {
      changeEvent();
      setIsOpen(false);
    }
  }

  if (currentUser.admin) {
    return (
      <>
        <Modal
          isOpen={isOpen}
          onRequestClose={() => {
            if (hasChanges >= 2) setConfirmModal(1);
            else setIsOpen(false);
          }}
          className="view_modal evt_modal admin"
          overlayClassName="evt_modal_overlay"
        >
          <div className="evt_modal_header">
            <h1 title={event.name}>{event.name}</h1>
            <div>
              <button type="button" onClick={() => editEvent()}>
                <img alt="Edit event" src="/img/filelisting_edit.svg" />
              </button>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <button type="button" onClick={() => setConfirmModal(5)}>
                <img alt="Delete event" src="/img/filelisting_delete.svg" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (hasChanges >= 2) setConfirmModal(1);
                else setIsOpen(false);
              }}
            >
              <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
            </button>
          </div>
          <div className="evt_modal_content">
            <div className="columns">
              <div>
                <div className="prop">
                  <img alt="Event time" src="/img/calendar_time.svg" />
                  <DateFormatter date={event.from} fmt="x o d | " />
                  <DateRangeFormatter from={event.from} to={event.to} />
                </div>
                <div className="question_info small_indented">
                  {
                    [
                      "Does not repeat",
                      "Daily",
                      <>
                        Weekly on <DateFormatter date={event.from} fmt="X" />
                      </>,
                      <>
                        Bi-Weekly on <DateFormatter date={event.from} fmt="X" />
                      </>,
                      "Monthly",
                      <>
                        Annually on <DateFormatter date={event.from} fmt="O d" />
                      </>,
                      "Every Weekday (Mon-Fri)",
                    ][event.repeat]
                  }
                </div>
                <div className="prop">
                  <img alt="Event time" src="/img/calendar_location.svg" />
                  {event.location}
                </div>
                <div className="prop list">
                  <img src="/img/calendar_send.svg" alt="Send to" />
                  <div
                    className="role_container"
                    onMouseOver={() => setTooltipVisible(true)}
                    onFocus={() => setTooltipVisible(true)}
                    onMouseOut={() => setTooltipVisible(false)}
                    onBlur={() => setTooltipVisible(false)}
                  >
                    {event.calendars.slice(0, 1).map((name) => {
                      const css = ROLES.find((cal) => cal.long_name === name);

                      return (
                        <div key={name} className="role_listing">
                          <div className="circle" style={{ background: css.color }} title={name} />
                          {name}
                        </div>
                      );
                    })}
                    {event.calendars.length > 1 && (
                      <span className="gentle">... ({event.calendars.length - 1} more)</span>
                    )}
                  </div>
                </div>
                <div className="tooltip" style={!tooltipVisible ? { visibility: "hidden" } : {}}>
                  {event.calendars.join(", ")}
                </div>
              </div>
              <div className="indented">
                <div className="prop">
                  <img alt="Event time" src="/img/calendar_people.svg" />
                  Guests allowed
                </div>
                <div className="question_info small_indented">
                  {event.over18 ? "Guests 18+ only" : ""}
                  {event.under18 ? "Guests under 18 allowed" : ""}
                </div>
                <button
                  type="button"
                  className="prop unstyled underlined"
                  onClick={() => setVolModal(true)}
                >
                  View who is going
                </button>
                <div className="question_info smallskip">
                  {guestsCount + attendeesArray.length}/{event.number_needed} spots filled
                </div>
              </div>
            </div>
          </div>
          <div className="evt_modal_separator">Question Responses</div>
          <div className="evt_modal_scroll">
            {!responseView ? (
              <>
                {attendeesArray
                  .filter((att) => att.response.length > 0)
                  .map((att) => (
                    <button
                      key={att.volunteer._id}
                      type="button"
                      className="evt_modal_smallbox"
                      onClick={() => setResponseView(att)}
                    >
                      <div className="name">{att.volunteer.name}</div>
                      <div className="content">
                        <Abbreviator
                          content={att.response}
                          maxLength={80 - 3 * att.volunteer.name.length}
                        />
                      </div>
                    </button>
                  ))}
                {attendeesArray.filter((att) => att.response.length > 0).length === 0 ? (
                  <div className="evt_modal_center">
                    <div>No responses yet.</div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="response_view">
                <div className="response_view_header">
                  <button type="button" onClick={() => setResponseView()}>
                    <img src="/img/calendar_chevron.svg" alt="Go back" />
                  </button>
                  <h1>{responseView.volunteer.name}</h1>
                  <button type="button" className="spacer">
                    <img src="/img/calendar_chevron.svg" alt="Go back" />
                  </button>
                </div>
                <div className="response_view_content">
                  {responseView.response}
                  <br />
                  <br />
                </div>
              </div>
            )}
          </div>
        </Modal>

        <ConfirmationModal
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          setIsOpen={setIsOpen}
          saveResponse={(val) => save_response(val)}
          deleteEvent={() => delete_event()}
        />

        <Modal
          isOpen={volModal}
          onRequestClose={() => setVolModal(false)}
          className="view_modal evt_modal nonadmin"
          overlayClassName="evt_modal_overlay"
        >
          <div className="evt_modal_header">
            <h1>Attendees</h1>
            <button type="button" onClick={() => setVolModal(false)}>
              <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
            </button>
          </div>
          <div className="evt_modal_content">
            <div className="columns non_responsive">
              <div>
                <div className="gentle">
                  {attendeesArray.length} Volunteer{attendeesArray.length !== 1 ? "s" : ""}
                </div>
                <br />
                {attendeesArray.map((att) => (
                  <div key={att.volunteer._id}>
                    <div className="very-gentle">{att.volunteer.name}</div>
                    <div className="indented">
                      {att.guests.map((guest) => (
                        <span key={guest._id}>
                          {guest.name}
                          <br />
                        </span>
                      ))}
                    </div>
                    <br />
                  </div>
                ))}
              </div>
              <div>
                <div className="gentle">
                  {guestsCount} Guest{guestsCount !== 1 ? "s" : ""}
                </div>
                <br />
                {attendeesArray.map((att) => (
                  <div key={att.volunteer._id}>
                    <br />
                    {att.guests.map((guest) => (
                      <span key={guest._id}>
                        {guest.relation}
                        <br />
                      </span>
                    ))}
                    <br />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {attendeesArray.length > 0 ? <br /> : null}
        </Modal>
      </>
    );
  }
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          if (hasChanges >= 2) setConfirmModal(1);
          else setIsOpen(false);
        }}
        className="view_modal evt_modal nonadmin"
        overlayClassName="evt_modal_overlay"
      >
        <div className="evt_modal_header">
          <h1 title={event.name}>{event.name}</h1>
          <button
            type="button"
            onClick={() => {
              if (hasChanges >= 2) setConfirmModal(1);
              else setIsOpen(false);
            }}
          >
            <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
          </button>
        </div>
        <div className="evt_modal_content nonflex spaced">
          <div>
            <div className="spots_filled">
              {guestsCount + attendeesArray.length}/{event.number_needed} spots filled
            </div>

            <div className="prop">
              <img alt="Event time" src="/img/calendar_time.svg" />
              <DateFormatter date={event.from} fmt="x o d | " />
              <DateRangeFormatter from={event.from} to={event.to} />
            </div>
            <div className="prop">
              <img alt="Event time" src="/img/calendar_location.svg" />
              {event.location}
            </div>
            <hr />

            <div className="question">
              <b>Q: </b>Are you bringing guests?
            </div>
            <div className="question_info">
              {event.over18 ? "Guests 18+ only" : ""}
              {event.under18 ? "Guests under 18 allowed" : ""}
            </div>
            <label htmlFor="guests">
              <input
                type="checkbox"
                id="guests"
                defaultChecked={hasGuests}
                onChange={(e) => setHasGuests(e.target.checked)}
              />
              <div className="calendar_checkbox" />
              <span>Yes</span>
            </label>
            {hasGuests && (
              <GuestsContainer guests={guests} addGuest={addGuest} deleteGuest={deleteGuest} />
            )}

            {event.question ? (
              <>
                <div className="question">
                  <b>Q: </b>
                  {event.question}
                </div>
                <br />
                <textarea
                  placeholder="Type your response here..."
                  defaultValue={event.attendees[currentUser._id]?.response}
                  onChange={(e) => setResponse(e.target.value)}
                />
              </>
            ) : (
              <br />
            )}
          </div>
        </div>
        <div className="evt_modal_footer">
          {!event.attendees[currentUser._id] ? (
            <button type="button" onClick={() => save_response(true)}>
              Going
            </button>
          ) : (
            <div className="evt_modal_spaced">
              <button type="button" className="unstyled" onClick={() => setConfirmModal(2)}>
                Not going
              </button>
              <button type="button" onClick={() => save_response(true)}>
                Save
              </button>
            </div>
          )}
        </div>
        <br />
      </Modal>

      <ConfirmationModal
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
        setIsOpen={setIsOpen}
        saveResponse={(val) => save_response(val)}
      />
    </>
  );
}
