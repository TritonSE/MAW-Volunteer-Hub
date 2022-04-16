import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { useArrayState } from "@cubedoodl/react-simple-scheduler";
import ROLES from "../constants/roles";
import { api_calendar_delete, api_calendar_respond } from "../api";
import { CurrentUser } from "./Contexts";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";

function GuestsContainer({ guests, addGuest, deleteGuest }) {
  /*
   * TODO: Validation
   */
  return (
    <div className="guests_container">
      {guests.map((guest) => (
        <div key={guest.id}>
          <div className="guests_flex">
            <div>
              <input
                placeholder="Guest's name"
                defaultValue={guest.name}
                onChange={(e) => {
                  guest.name = e.target.value;
                }}
              />
              <input
                placeholder="Guest's relationship to you"
                defaultValue={guest.relation}
                onChange={(e) => {
                  guest.relation = e.target.value;
                }}
              />
            </div>
            <div>
              <button type="button" onClick={() => deleteGuest(guest)}>
                <img alt="Delete guest" src="/img/filelisting_delete.svg" />
              </button>
            </div>
          </div>
          <hr />
        </div>
      ))}

      <button type="button" onClick={() => addGuest({ id: Math.random(), name: "", relation: "" })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
        </svg>
        <span>Add more guests</span>
      </button>
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

  const [hasChanges, setHasChanges] = useState(-1);
  const [confirmModal, setConfirmModal] = useState(0);

  useEffect(() => {
    const tmp = event.guests.filter((guest) => guest.with._id === currentUser._id);
    if (tmp.length > 0) {
      setGuests(tmp);
      setHasGuests(true);
    } else setGuests([{ name: "", relation: "" }]);

    setResponse(
      event.responses
        ? event.responses.find((resp) => resp.volunteer._id === currentUser._id)?.response ?? ""
        : ""
    );
  }, []);

  useEffect(() => setHasChanges(hasChanges + 1), [hasGuests, guests, response]);

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

    const res = await api_calendar_respond(event._id, going, hasGuests ? guests : null, response);
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
            <h1>{event.name}</h1>
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
                  Wed Apr 13 | 11:00 AM - 1:00 PM
                  {/*
                <DateFormatter date={event.from} fmt="x o d | " />
                <DateRangeFormatter from={event.from} to={event.to} />
                */}
                </div>
                <div className="question_info small_indented">Repeat schedule</div>
                <div className="prop">
                  <img alt="Event time" src="/img/calendar_location.svg" />
                  {event.location}
                </div>
                <br />
                <div className="prop list underlined">
                  <img src="/img/calendar_send.svg" alt="Send to" />
                  <div>
                    {event.calendars.map((name) => {
                      const css = ROLES.find((cal) => cal.name === name);

                      return (
                        <div key={name}>
                          <div className="role_listing">
                            <div className="circle" style={{ background: css.color }} />
                            {name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                <div className="prop underlined">View who is going</div>
                <div className="question_info smallskip">
                  {event.volunteers.length + event.guests.length}/{event.number_needed} spots filled
                </div>
                <button type="button">Assign volunteers</button>
              </div>
            </div>
          </div>
          <div className="evt_modal_separator">Question Responses</div>
          <div className="evt_modal_scroll">
            {event.responses.map((resp) => (
              <div className="evt_modal_smallbox">
                <div className="name">{resp.volunteer.name}</div>
                <div className="content">
                  <Abbreviator
                    content={resp.response}
                    maxLength={95 - resp.volunteer.name.length}
                  />
                </div>
              </div>
            ))}
            {event.responses.length === 0 ? (
              <div className="evt_modal_center">
                <div>No responses yet.</div>
              </div>
            ) : null}
          </div>
        </Modal>

        <ConfirmationModal
          confirmModal={confirmModal}
          setConfirmModal={setConfirmModal}
          setIsOpen={setIsOpen}
          saveResponse={(val) => save_response(val)}
          deleteEvent={() => delete_event()}
        />
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
          <h1>{event.name}</h1>
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
          <div>
            <div className="spots_filled">
              {event.volunteers.length + event.guests.length}/{event.number_needed} spots filled
            </div>

            <div className="prop">
              <img alt="Event time" src="/img/calendar_time.svg" />
              Wed Apr 13 | 11:00 AM - 1:00 PM
              {/*
            <DateFormatter date={event.from} fmt="x o d | " />
            <DateRangeFormatter from={event.from} to={event.to} />
            */}
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
            <br />

            {event.question ? (
              <>
                <div className="question">
                  <b>Q: </b>
                  {event.question}
                </div>
                <br />
                <textarea
                  placeholder="Type your response here..."
                  defaultValue={
                    event.responses.find((resp) => resp.volunteer._id === currentUser._id)?.response
                  }
                  onChange={(e) => setResponse(e.target.value)}
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="evt_modal_footer">
          {!event.volunteers.some((vol) => vol._id === currentUser._id) ? (
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
