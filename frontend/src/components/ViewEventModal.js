import React from "react";
import Modal from "react-modal";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";

export default function ViewEventModal({ event, isOpen, setIsOpen, isAdmin }) {
  if (isAdmin) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="view_modal evt_modal admin"
      >
        <div className="evt_modal_header">
          <h1>{event.name}</h1>
          <button type="button" onClick={() => setIsOpen(false)}>
            <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
          </button>
        </div>
        <div className="evt_modal_content">
          <div>TODO</div>
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="view_modal evt_modal nonadmin"
    >
      <div className="evt_modal_header">
        <h1>{event.name}</h1>
        <button type="button" onClick={() => setIsOpen(false)}>
          <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
        </button>
      </div>
      <div className="evt_modal_content">
        <div>
          <div className="spots_filled">5/7 spots filled</div>

          <div className="prop">
            <img alt="Event time" src="/img/calendar_time.svg" />
            Tue Mar 15 | 11:00 AM – 12:00 PM
          </div>
          <div className="prop">
            <img alt="Event time" src="/img/calendar_location.svg" />
            1234 Disneyland Dr, Anaheim CA 56789
          </div>
          <hr />

          <div className="question">
            <b>Q: </b>Are you bringing guests?
          </div>
          <div className="question_info">Guests 18+ allowed</div>
          <label htmlFor="guests">
            <input type="checkbox" id="guests" />
            <div className="calendar_checkbox primary" />
            <span>Yes</span>
          </label>

          <br />
          <div className="question">
            <b>Q: </b>Can you bring a shovel?
          </div>
          <br />
          <textarea placeholder="Type your response here" />
        </div>
      </div>
      <div className="evt_modal_footer">
        <button type="button" onClick={() => {}}>
          Going
        </button>
      </div>
      <br />
    </Modal>
  );
}
