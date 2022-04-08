import React, { useContext } from "react";
import Modal from "react-modal";
import { CurrentUser } from "./Contexts";
import "../styles/AddEventModal.css";
import "../styles/ViewEventModal.css";

export default function ViewEventModal({ event, isOpen, setIsOpen }) {
  if (!event) return null;

  const [currentUser] = useContext(CurrentUser);

  if (currentUser.admin) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="view_modal evt_modal admin"
        overlayClassName="evt_modal_overlay"
      >
        <div className="evt_modal_header">
          <h1>{event.name}</h1>
          <button type="button" onClick={() => setIsOpen(false)}>
            <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
          </button>
        </div>
        <div className="evt_modal_content">
          <div className="columns">
            <div>
              <div className="prop">
                <img alt="Event time" src="/img/calendar_time.svg" />
                {/*
                <DateFormatter date={event.from} fmt="x o d | " />
                <DateRangeFormatter from={event.from} to={event.to} />
                */}
              </div>
              <div className="prop">
                <img alt="Event time" src="/img/calendar_location.svg" />
                1234 Disneyland Dr, Anaheim CA 56789
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
          <div className="evt_modal_smallbox">
            <div className="name">Person&apos;s name:</div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...&nbsp;
              <span className="more">Read more</span>
            </div>
          </div>
          <div className="evt_modal_smallbox">
            <div className="name">Person&apos;s name:</div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...&nbsp;
              <span className="more">Read more</span>
            </div>
          </div>
          <div className="evt_modal_smallbox">
            <div className="name">Person&apos;s name:</div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...&nbsp;
              <span className="more">Read more</span>
            </div>
          </div>
          <div className="evt_modal_smallbox">
            <div className="name">Person&apos;s name:</div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...&nbsp;
              <span className="more">Read more</span>
            </div>
          </div>
          <div className="evt_modal_smallbox">
            <div className="name">Person&apos;s name:</div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...&nbsp;
              <span className="more">Read more</span>
            </div>
          </div>
          <div className="evt_modal_smallbox">
            <div className="name">Person&apos;s name:</div>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed...&nbsp;
              <span className="more">Read more</span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="view_modal evt_modal nonadmin"
      overlayClassName="evt_modal_overlay"
    >
      <div className="evt_modal_header">
        <h1>{event.name}</h1>
        <button type="button" onClick={() => setIsOpen(false)}>
          <img alt="Close modal" src="/img/wishgranting_modal_close.svg" />
        </button>
      </div>
      <div className="evt_modal_content">
        <div>
          <div className="spots_filled">0/{event.number_needed} spots filled</div>

          <div className="prop">
            <img alt="Event time" src="/img/calendar_time.svg" />
            {/*
            <DateFormatter date={event.from} fmt="x o d | " />
            <DateRangeFormatter from={event.from} to={event.to} />
            */}
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
