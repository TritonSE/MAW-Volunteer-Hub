import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  api_file_search,
  api_file_all,
  api_file_display,
  api_file_delete,
  // api_file_update,
} from "../auth";
import "../styles/Search.css";
import { FileEntry } from "./FileEntry";

Modal.setAppElement(document.getElementById("#root"));

/*
    Search component, which opens a search modal and allows searching of files by keyword. 
*/

function Search() {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState([]);

  async function do_filter() {
    if (input.trim() === "") {
      const res = await api_file_all();
      if (res && !res.error) setFilteredFiles(res);
    } else {
      const res = await api_file_search(input);
      if (res && !res.error) setFilteredFiles(res);
    }
  }

  async function display_file(file) {
    const res = await api_file_display(file._id);
    if (res && !res.error) {
      const url = window.URL.createObjectURL(res);
      window.open(url);
      window.URL.revokeObjectURL(url);
    }
  }

  useEffect(do_filter, []);
  useEffect(() => {
    if (showResults) do_filter();
  }, [showResults]);

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
            className="close-btn"
            onClick={() => setShowResults((prevState) => !prevState)}
            type="button"
          >
            <img
              src="/img/search_exit_icon.svg"
              alt="Close Search Results"
              className="close-icon"
            />
          </button>

          {filteredFiles.length === 0 ? (
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
                All files
                {input === "" ? (
                  ""
                ) : (
                  <>
                    with keyword <q>{input}</q>
                  </>
                )}
              </p>
              {filteredFiles.map((val) => (
                <FileEntry
                  key={val._id}
                  name={val.name}
                  searchModal
                  onDownloadFile={() => display_file(val)}
                  onEditFile={() => {}}
                  onDeleteFile={() => api_file_delete(val._id)}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </form>
  );
}

export default Search;
