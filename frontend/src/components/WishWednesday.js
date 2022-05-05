import React, { useState, useContext } from "react";
import ReactQuill from "react-quill";
import history from "../history";
import "react-quill/dist/quill.snow.css";
import "../styles/WishWednesday.css";
import { ModalVariantsManager } from "./Contexts";

import { api_wish_wednesday_add } from "../api";

export default function WishWednesday() {
  const [convertedText, setConvertedText] = useState("");
  const {
    modalVariant: [_modalVariant, setModalVariant],
    open: [_modalOpen, setModalOpen],
    errorMessage: [_error, setErrorMessage],
    activeListing: [_activeListing, setActiveListing],
  } = useContext(ModalVariantsManager);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
    ],
  };
  function handleWishWednesdayPost() {
    // ensure there is no empty post
    if (!convertedText) {
      setModalVariant();
      setErrorMessage("Cannot create an empty Wish Wednesday post");
      return;
    }

    api_wish_wednesday_add(convertedText)
      .then((res) => {
        if (!res) {
          throw new Error("");
        }
        setModalVariant("wish_wednesday_success");
        setModalOpen(true);
        setConvertedText("");
      })
      .catch((err) => {
        setModalVariant();
        setErrorMessage("Unable to reach server, please try again.");
        setModalOpen(true);
      });
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
