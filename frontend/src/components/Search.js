/* eslint-disable no-nested-ternary */
import React, { useEffect } from "react";
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
    Search component, which allows searching of files by keyword and opens up a modal with the 
    results. Component is displayed under different conditions for the mobile & desktop view.

    -showResults: if the modal is currently active in the site
    -setShowResults: toggle the modal
    -input: the current user input
    -setInput: set the user input when it changes
    -filteredFiles: the current filtered files
    -setFilteredFiles: set the filtered files when it changes
*/

function Search({ showResults, setShowResults, input, setInput, filteredFiles, setFilteredFiles }) {
  // re-filter files when user input changes
  useEffect(() => {
    setFilteredFiles(allFiles.filter((f) => f["name"].toLowerCase().includes(input.toLowerCase())));
  }, [input]);

  useEffect(() => {
    // get all files
  }, []);

  const handleClose = () => {
    setShowResults((prevState) => !prevState);
    // setInput(""); // clear input after search?
  };

  const handleOpen = () => {
    setShowResults((prevState) => !prevState);
  };

  return (
    <form className="search-container" role="search" onSubmit={(e) => e.preventDefault()}>
      <input
        className="search-input"
        placeholder="Search all files..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="search-button" type="submit" onClick={handleOpen}>
        <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon" />
      </button>

      {/* Pop-up search modal with either (a) no results (b) filtered files or (c) all files,
      displaying the files using the FileEntry component
      */}
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
