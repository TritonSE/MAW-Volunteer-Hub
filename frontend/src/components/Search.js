import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import { api_file_display } from "../api";
import "../styles/Search.css";
import { FileEntry } from "./FileEntry";
import ModalVariants from "./ModalVariants";
import FileStructure from "./FileStructure";

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

function Search() {
  const [input, setInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [structure, getStructure] = useContext(FileStructure);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("add_file");
  const [name, setName] = useState("");
  const [activeListing, setActiveListing] = useState();

  /**
   * UTILITY FUNCTIONS
   */
  async function display_file(file) {
    const res = await api_file_display(file._id);
    if (res && !res.error) {
      const url = window.URL.createObjectURL(res);
      window.open(url);
      window.URL.revokeObjectURL(url);
    }
  }
  function show_modal(variant, new_name = "", new_activeListing = null) {
    setModalVariant(variant);
    setName(new_name);
    setActiveListing(new_activeListing);
    setModalOpen(true);
  }
  async function hide_modal() {
    getStructure();
    setModalOpen(false);
    setName("");
    setActiveListing(null);
  }
  function filter_files(filter = input) {
    const arr = [];
    Object.entries(structure).forEach(([_tab, categories]) => {
      categories.forEach((cat) => {
        cat.Files.forEach((file) => {
          if (file.name.toLowerCase().indexOf(filter.toLowerCase()) > -1) arr.push(file);
        });
      });
    });
    setFilteredFiles(arr);
  }

  /**
   * HOOKS
   */
  useEffect(hide_modal, []);
  useEffect(filter_files, [structure]);

  return (
    <>
      <form className="search-container" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          className="search-input"
          placeholder="Search all files..."
          onChange={(e) => {
            setInput(e.target.value);
            filter_files(e.target.value);
          }}
        />
        <button className="search-button" type="submit" onClick={() => setShowResults(true)}>
          <img src="/img/searchbar.svg" alt="Search" className="searchbar-icon" />
        </button>
      </form>

      {/* Pop-up search modal with either (a) no results (b) filtered files or (c) all files,
      displaying the files using the FileEntry component
      */}
      <Modal
        isOpen={showResults}
        onRequestClose={() => setShowResults(false)}
        className="search-results"
        overlayClassName="search-results-overlay"
      >
        <div className="results-container">
          <button className="close-btn" onClick={() => setShowResults(false)} type="button">
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
                    &nbsp;with keyword <q>{input}</q>
                  </>
                )}
              </p>
              {filteredFiles.map((val) => (
                <FileEntry
                  key={val._id}
                  name={val.name}
                  searchModal
                  onDownloadFile={() => display_file(val)}
                  onEditFile={() => show_modal("edit_file", val.name, val)}
                  onDeleteFile={() => show_modal("delete_file", "", val)}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ModalVariants
        modalVariant={modalVariant}
        open={modalOpen}
        setOpen={setModalOpen}
        name={name}
        setName={setName}
        activeListing={activeListing}
        onClose={() => hide_modal()}
      />
    </>
  );
}

export default Search;
