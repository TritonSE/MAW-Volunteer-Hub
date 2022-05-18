/* eslint-disable import/no-named-default */
import React, { useState } from "react";
import { default as ReactSelect, components } from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/Message.css";
import Modal from "react-modal";
import { api_message_email } from "../api";
import { ROLES as recipients } from "../constants/EmailRoles_fe";

Modal.setAppElement("#root");

function Option(props) {
  // Source: https://medium.com/geekculture/creating-multi-select-dropdown-with-checkbox-in-react-792ff2464ef3
  return (
    <div>
      <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
        <label htmlFor="option_label">{props.label}</label>
      </components.Option>
    </div>
  );
}

export default function Message() {
  const [convertedText, setConvertedText] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState(null);
  const [subject, setSubject] = useState("");
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // recipients in EmailRoles_fe.js

  const customStyles = {
    control: (base) => ({
      ...base,
      height: "auto",
      border: 1,
      borderRadius: 7,
    }),
  };

  const handleSelect = (e) => {
    for (let i = 0; i < e.length; i++) {
      // If "All" is one of the options
      if (e[i].label === "All") {
        // If we want to select all, but not all options have been selected
        if (selectedRecipients === null || selectedRecipients.length !== recipients.length) {
          setSelectedRecipients(recipients);
          return;
        }
        // If we previously selected all and decided to reduce the number of selections
        if (selectedRecipients.length === recipients.length) {
          // Removes the "All" option
          setSelectedRecipients(e.slice(1));
          return;
        }
      }
    }
    setSelectedRecipients(e);
  };

  // message sending modal and modal text
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  // if any fields of the message are empty
  const emptyFields = () => {
    const text_empty =
      convertedText.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
      !convertedText.includes("<img");
    const recipients_empty = selectedRecipients === null || selectedRecipients.length === 0;
    const subject_empty = subject === "";
    return text_empty || recipients_empty || subject_empty;
  };

  // when "Post" is clicked, handle email sending
  const handleSubmit = async () => {
    // console.log("Recipients: ");
    // console.log(selectedRecipients);
    // console.log("Subject: " + subject);
    // console.log("Message: " + convertedText);

    // if fields are empty, don't allow email sending
    if (!emptyFields()) {
      const roles_to_message = selectedRecipients
        .map((elem) => elem.label)
        .filter((elem) => elem !== "All");
      // console.log("ROLES TO MSG", roles_to_message);

      const res = await api_message_email(JSON.stringify(roles_to_message), convertedText, subject);

      // console.log(res);
      if (res && res.success) {
        // clear fields if success
        setConvertedText("");
        setSubject("");
        setSelectedRecipients(null);
        setModalText("The message was successfully sent via email!");
      } else {
        setModalText("There was an error sending the message via email.");
      }

      setModalOpen(true);
    }
  };

  return (
    <div className="msg_layout">
      <h2 className="title">Send a Message</h2>
      <div className="input_container">
        <div className="message_meta">
          <div className="recipient_section">
            <p className="prompt_title">To: </p>
            <ReactSelect
              className="select_recipients"
              options={recipients}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                Option,
              }}
              onChange={(e) => handleSelect(e)}
              allowSelectAll
              value={selectedRecipients}
              styles={customStyles}
            />
          </div>

          <div className="subject_section">
            <p className="prompt_title">Subject: </p>
            <input
              type="text"
              className="subject_line"
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
            />
          </div>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={convertedText}
            onChange={setConvertedText}
          />
          <div className="button_container">
            {emptyFields() ? (
              <div className="emptyfields">
                Some field(s) are empty. Please make sure all fields are specified.
              </div>
            ) : (
              <div className="placeholder" />
            )}
            <button
              className="post_announcement_message"
              type="submit"
              onClick={() => handleSubmit()}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="login_react_modal"
      >
        <div className="login_flex login_form login_modal">
          <div className="login_flex nomargin">
            {modalOpen === true ? <div>&nbsp;</div> : <h3>Error</h3>}
            <button
              type="button"
              className="login_button_unstyled"
              onClick={() => setModalOpen(false)}
            >
              <img src="/img/close-modal.svg" alt="Close modal" />
            </button>
          </div>
          <div className="login_modal_content">{modalOpen === true ? modalText : modalOpen}</div>
          <button type="button" className="login_button_round" onClick={() => setModalOpen(false)}>
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}
