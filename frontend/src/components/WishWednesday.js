import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/WishWednesday.css";

export default function WishWednesday() {
  const [convertedText, setConvertedText] = useState("");
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="wwed_layout">
      <h2 className="title">Wish Wednesday Annoucements</h2>
      <div className="editor_container">
        <ReactQuill
          className="md_editor"
          theme="snow"
          modules={modules}
          value={convertedText}
          onChange={setConvertedText}
        />
        <div className="button_container">
          <button className="post_announcement" type="submit" onClick={() => alert(convertedText)}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
