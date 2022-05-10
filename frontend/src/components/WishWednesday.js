import React, { useState, useContext } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageCompress from "quill-image-compress";
import "react-quill/dist/quill.snow.css";
import "../styles/WishWednesday.css";
import { ModalVariantsManager } from "./Contexts";

import { api_wish_wednesday_add } from "../api";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link"],
    ["clean"],
    ["image"],
  ],
  imageCompress: {
    quality: 0.7, // default
    maxWidth: 1000,
    maxHeight: 800,
    imageType: "image/png", // default
    debug: false, // default
    suppressErrorLogging: false, // default
  },
};
Quill.register("modules/imageCompress", ImageCompress);

export default function WishWednesday() {
  const [convertedText, setConvertedText] = useState("");
  const {
    modalVariant: [_modalVariant, setModalVariant],
    open: [_modalOpen, setModalOpen],
    errorMessage: [_error, setErrorMessage],
  } = useContext(ModalVariantsManager);

  async function handleWishWednesdayPost() {
    // ensure there is no empty post
    if (!convertedText) {
      setModalVariant();
      setErrorMessage("Cannot create an empty Wish Wednesday post");
      return;
    }
    const res = await api_wish_wednesday_add(convertedText);
    if (res && !res.error) {
      setModalVariant("wish_wednesday_success");
      setConvertedText("");
    } else {
      setModalVariant();
      setErrorMessage("Unable to reach server, please try again.");
    }
    setModalOpen(true);
  }
  return (
    <div className="wwed_layout">
      <h2 className="title">Wish Wednesday Announcements</h2>
      <div className="editor_container">
        <ReactQuill
          className="md_editor"
          theme="snow"
          modules={modules}
          value={convertedText}
          onChange={setConvertedText}
          bounds=".editor_container"
        />
        <div className="button_container">
          <button
            className="post_announcement"
            type="submit"
            onClick={() => handleWishWednesdayPost()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
