import React, { useState } from "react";
import { default as ReactSelect, components } from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Option(props) {
  // Source: https://medium.com/geekculture/creating-multi-select-dropdown-with-checkbox-in-react-792ff2464ef3
  return (
    <div>
      <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
}

export default function Message() {
  const [convertedText, setConvertedText] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState();
  // const [subject, setSubject] = useState("");
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

  return (
    <div>
      <form className="message_meta">
        <ReactSelect
          options={recipients}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{
            Option,
          }}
          onChange={(e) => setSelectedRecipients(e)}
          allowSelectAll
          value={selectedRecipients}
        />
        <ReactQuill
          theme="snow"
          modules={modules}
          value={convertedText}
          onChange={setConvertedText}
          style={{ minHeight: "300px" }}
        />
      </form>
    </div>
  );
}
