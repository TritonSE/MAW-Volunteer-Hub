import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "react-modal";
import RoleSelect from "./RoleSelect";
import { api_message_email } from "../api";
import "../styles/Message.css";

Modal.setAppElement("#root");

export default function Message() {
  const [convertedText, setConvertedText] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  // message sending modal and modal text
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [recipError, setRecipError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [msgError, setMsgError] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // when "Post" is clicked, handle email sending and response modal
  const handleSubmit = async () => {
    let has_error = false;

    if (selectedRecipients.length === 0) {
      setRecipError(true);
      has_error = true;
    }

    if (subject.trim() === "") {
      setSubjectError(true);
      has_error = true;
    }

    if (
      convertedText.replace(/<(.|\n)*?>/g, "").trim().length === 0 &&
      !convertedText.includes("<img")
    ) {
      setMsgError(true);
      has_error = true;
    }

    if (has_error) return;

    const roles_to_message = selectedRecipients.map((elem) => elem.name);

    const res = await api_message_email(JSON.stringify(roles_to_message), convertedText, subject);

    if (res && res.success) {
      // clear fields if success
      setConvertedText("");
      setSubject("");
      setSelectedRecipients(null);
      setModalText(`The message was sent via email to active volunteers in the role(s)! Please regularly monitor the Make-A-Wish email
        for users' responses and notifications if any emails bounced.`);
    } else {
      setModalText(`Error: ${res.error}`);
    }
    setModalOpen(true);
  };

  return (
    <div className="msg_layout">
      <h2 className="title">Send a Message</h2>
      <div className="input_container">
        <div className="message_meta">
          <div className="recipient_section">
            <p className="prompt_title">To: </p>
            <RoleSelect
              value={selectedRecipients}
              setValue={(val) => {
                setSelectedRecipients(val);
                setRecipError(false);
              }}
              hasError={recipError}
              variant={2}
            />
          </div>

          <div className="subject_section">
            <p className="prompt_title">Subject: </p>
            <input
              type="text"
              className={`subject_line ${subjectError ? "has_error" : ""}`}
              value={subject}
              placeholder="Enter a message subject here..."
              onChange={(e) => {
                setSubject(e.target.value);
                setSubjectError(false);
              }}
            />
          </div>
          <ReactQuill
            theme="snow"
            modules={modules}
            value={convertedText}
            className={msgError ? "has_error" : ""}
            onChange={(e) => {
              setConvertedText(e);
              setMsgError(false);
            }}
            bounds=".message_meta"
          />
          <div className="button_container">
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
        className="login_react_modal message_modal_container"
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
          <div className="login_modal_content message_modal">
            {modalOpen === true ? modalText : modalOpen}
          </div>
          <button type="button" className="login_button_round" onClick={() => setModalOpen(false)}>
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}
