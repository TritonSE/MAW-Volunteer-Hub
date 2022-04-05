import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Message() {
  const [convertedText, setConvertedText] = useState("Some default content");
  return (
    <div>
      <ReactQuill
        theme="snow"
        value={convertedText}
        onChange={setConvertedText}
        style={{ minHeight: "300px" }}
      />
    </div>
  );
}
