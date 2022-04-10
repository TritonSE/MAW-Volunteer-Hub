/* eslint-disable import/no-named-default */
import React, { useState } from "react";
import { default as ReactSelect, components } from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/Message.css";

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

  const recipients = [
    { label: "All", value: 1 },
    { label: "Volunteer", value: 2 },
    { label: "Wish Granters", value: 3 },
    { label: "Mentor", value: 4 },
    { label: "Airport Greeter", value: 5 },
    { label: "Office", value: 6 },
    { label: "Special Events", value: 7 },
    { label: "Translator", value: 8 },
    { label: "Speaker's Bureau", value: 9 },
    { label: "Las Estrallas", value: 10 },
    { label: "Primary Admin", value: 11 },
    { label: "Secondary Admin", value: 12 },
  ];

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

  // Dummy Method
  const handleSubmit = () => {
    console.log("Recipients: ");
    console.log(selectedRecipients);
    console.log("Subject: " + subject);
    console.log("Message: " + convertedText);
  };

  return (
    <div className="msg_layout">
      <h2 className="title">Send a Message</h2>
      <div className="message_meta">
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
        />
        Subject:{" "}
        <input type="text" className="subject_line" onChange={(e) => setSubject(e.target.value)} />
        <ReactQuill
          theme="snow"
          modules={modules}
          value={convertedText}
          onChange={setConvertedText}
          style={{ minHeight: "300px" }}
        />
      </div>
      <div className="button_container">
        <button className="post_announcement" type="submit" onClick={() => handleSubmit()}>
          Post
        </button>
      </div>
    </div>
  );
}
