import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { useArrayState } from "@cubedoodl/react-simple-scheduler";
import { api_calendar_respond } from "../api";
import { CurrentUser } from "./Contexts";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";

function GuestsContainer({ guests, addGuest, deleteGuest }) {
  /*
   * TODO: Validation
   */
  return (
    <div className="guests_container">
      {guests.map((guest, ind) => (
        <div key={guest.name + guest.relation + ind}>
          <input
            placeholder="Guest's name"
            onChange={(e) => {
              guest.name = e.target.value;
            }}
          />
          <input
            placeholder="Guest's relationship to you"
            onChange={(e) => {
              guest.relation = e.target.value;
            }}
          />
          {ind < guests.length - 1 ? (
            <>
              <br />
              <br />
            </>
          ) : null}
        </div>
      ))}

      <button type="button" onClick={() => addGuest({ name: "", relation: "" })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
        </svg>
        <span>Add more guests</span>
      </button>
    </div>
  );
}

function ConfirmationModal({ confirmModal, setConfirmModal, setIsOpen, saveResponse }) {
  return (
    <Modal
      isOpen={confirmModal}
      onRequestClose={() => setConfirmModal(false)}
      className="evt_modal confirm"
      overlayClassName="evt_modal_overlay"
    >
      <div className="columns">
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
          <button type="button" onClick={() => setConfirmModal(false)}>
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
      </div>
    </Modal>
  );
}

export default function ViewEventModal({ event, isOpen, setIsOpen }) {
  if (!event) return null;

  const [currentUser] = useContext(CurrentUser);

  const [hasGuests, setHasGuests] = useState(false);
  const [guests, setGuests, addGuest, deleteGuest] = useArrayState([]);
  const [response, setResponse] = useState("");

  const [hasChanges, setHasChanges] = useState(-1);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    const tmp = event.guests.filter((guest) => guest.with === currentUser._id);
    if (tmp.length > 0) setGuests(tmp);
    else setGuests([{ name: "", relation: "" }]);

    setResponse(
      event.responses
        ? event.responses.find((resp) => resp.volunteer === currentUser._id)?.response ?? ""
        : ""
    );
  }, []);

  useEffect(() => {
    setHasChanges(hasChanges + 1);
  }, [hasGuests, guests, response]);

  async function save_response(going) {
    const res = await api_calendar_respond(event._id, going, hasGuests ? guests : null, response);
    console.log(res);
    if (res && !res.error) {
      /* TODO */
      setIsOpen(false);
    }
  }

  if (currentUser.admin) {
    return (
      <>
        <Modal
          isOpen={isOpen}
          onRequestClose={() => {
            if (hasChanges >= 2) setConfirmModal(true);
            else setIsOpen(false);
          }}
          className="view_modal evt_modal admin"
          overlayClassName="evt_modal_overlay"
        >
          <div className="evt_modal_header">
            <h1>{event.name}</h1>
            <button
              type="button"
              onClick={() => {
                if (hasChanges >= 2) setConfirmModal(true);
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
                <div className="prop">
                  <img alt="Event time" src="/img/calendar_location.svg" />
                  {event.location}
                </div>
              </div>
              <div className="indented">
                <div className="prop">
                  <img alt="Event time" src="/img/calendar_people.svg" />
                  Guests allowed
                </div>
                <div className="prop underlined">View who is going</div>
              </div>
            </div>
          </div>
          <div className="evt_modal_separator">Question Responses</div>
          <div className="evt_modal_scroll">
            {event.responses.map((_resp) => (
              <div className="evt_modal_smallbox">
                <div className="name">Person&apos;s name:</div>
                <div className="content">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...&nbsp;
                  <span className="more">Read more</span>
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
        />
      </>
    );
  }
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          if (hasChanges >= 2) setConfirmModal(true);
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
              if (hasChanges >= 2) setConfirmModal(true);
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
              <input type="checkbox" id="guests" onChange={(e) => setHasGuests(e.target.checked)} />
              <div className="calendar_checkbox primary" />
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
                    event.responses.find((resp) => resp.volunteer === currentUser._id)?.response
                  }
                  onChange={(e) => setResponse(e.target.value)}
                />
              </>
            ) : null}
          </div>
        </div>
        <div className="evt_modal_footer">
          {!event.volunteers.includes(currentUser._id) ? (
            <button type="button" onClick={() => save_response(true)}>
              Going
            </button>
          ) : (
            <div className="evt_modal_spaced">
              <button type="button" className="unstyled" onClick={() => save_response(false)}>
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
