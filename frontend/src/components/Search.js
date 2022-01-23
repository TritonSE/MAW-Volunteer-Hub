/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles/Search.css";

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

function FileResult({ val, index }) {
  return (
    <div
      className="file-result"
      style={{ backgroundColor: index % 2 === 0 ? "rgba(187, 188, 188, 0.2)" : "#FFFFFF" }}
    >
      <button className="file-res-button export" type="button">
        <img src="/img/export_icon.svg" alt="export" className="export-icon" />
      </button>
      <p style={{ fontSize: "14px", margin: 0, flex: 1 }}>{val.name}</p>
      <button className="file-res-button edit" type="button">
        <img src="/img/edit_icon.svg" alt="export" className="edit-icon" />
      </button>
      <button className="file-res-button delete" type="button">
        <img src="/img/delete_icon.svg" alt="export" className="delete-icon" />
      </button>
    </div>
  );
}

function Search() {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState([]);

  // const [allFiles, setAllFiles] = useState([]);

  useEffect(() => {
    setFilteredFiles(allFiles.filter((f) => f["name"].toLowerCase().includes(input.toLowerCase())));
  }, [input]);

  useEffect(() => {
    // get all files
  }, []);

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
        onRequestClose={() => setShowResults((prevState) => !prevState)}
        className="search-results"
        overlayClassName="search-results-overlay"
      >
        <div className="results-container">
          <button
            className="close-button"
            onClick={() => setShowResults((prevState) => !prevState)}
            type="button"
          >
            <img
              src="/img/search_exit_icon.svg"
              alt="Close Search Results"
              className="close-icon"
            />
          </button>

          {input === "" ? (
            <div>
              <p className="files-title">All files</p>
              {allFiles.map((val, index) => (
                <FileResult val={val} index={index} />
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
            <div>
              <p className="files-title">
                All files with keyword <q>{input}</q>
              </p>
              {filteredFiles.map((val, index) => (
                <FileResult val={val} index={index} />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </form>
  );
}

export default Search;
