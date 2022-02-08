/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles/Search.css";
import { FileEntry } from "./FileEntry";

const allFiles = [
  {
    id: "file_1",
    name: "MAW File",
  },
  {
    id: "file_2",
    name: "TSE File",
  },
  {
    id: "file_3",
    name: "Testing",
  },
];

Modal.setAppElement(document.getElementById("#root"));

/*
    Search component, which opens a search modal and allows searching of files by keyword.
    - extraAction: extra setState to perform, since search can be opened from both desktop and mobile
    - closeModal: whenever search modal is closed, also set the mobile search state to false
*/

function Search({ extraAction = false, closeModal }) {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(extraAction);
  const [filteredFiles, setFilteredFiles] = useState([]);

  // const [allFiles, setAllFiles] = useState([]);

  useEffect(() => {
    setFilteredFiles(allFiles.filter((f) => f["name"].toLowerCase().includes(input.toLowerCase())));
  }, [input]);

  useEffect(() => {
    // get all files
  }, []);

  const handleClose = () => {
    setShowResults((prevState) => !prevState);
    if (extraAction) closeModal((prevState) => !prevState);
  };

  return (
    <form className="search-container" role="search" onSubmit={(e) => e.preventDefault()}>
      <input
        className="search-input"
        placeholder="Search all files..."
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="search-button"
        type="submit"
        onClick={() => setShowResults((prevState) => !prevState)}
      >
        <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon" />
      </button>

      <Modal
        isOpen={showResults}
        onRequestClose={handleClose}
        className="search-results"
        overlayClassName="search-results-overlay"
      >
        <div className="results-container">
          <button className="close-btn" onClick={handleClose} type="button">
            <img
              src="/img/search_exit_icon.svg"
              alt="Close Search Results"
              className="close-icon"
            />
          </button>

          {input === "" ? (
            <div className="show-results">
              <p className="files-title">All files</p>
              {allFiles.map((val) => (
                <FileEntry key={val.id} name={val.name} searchModal />
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="no-results">
              <img src="/img/sad_face.svg" alt="Sad Face" className="sad-face" />
              <p style={{ fontSize: "18px", marginBottom: "14px", marginTop: 0 }}>
                No files related to <q>{input}</q> found.
              </p>
              <p style={{ fontSize: "12px", margin: 0 }}>Please enter a new search keyword.</p>
            </div>
          ) : (
            <div className="show-results">
              <p className="files-title">
                All files with keyword <q>{input}</q>
              </p>
              {filteredFiles.map((val) => (
                <FileEntry key={val.id} name={val.name} searchModal />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </form>
  );
}

export default Search;
