import React, { useState } from "react";
import Modal from "react-modal";
import { useOutletContext } from "react-router-dom";
import { FileEntry, FileCategory, FileListing, FileButton } from "./FileEntry";
import "../styles/WishGrantingPage.css";

Modal.setAppElement("#root");

function WishStep({ stepName }) {
  const [categories, setCategories] = useOutletContext();

  const [addFileModal, setAddFileModal] = useState(false);
  const [editFileModal, setEditFileModal] = useState(false);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [deleteFileModal, setDeleteFileModal] = useState(false);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
  const [activeListing, setActiveListing] = useState(null);
  const [name, setName] = useState("");
  const [fileContents, setFileContents] = useState("");

  function file_upload(e) {
    if (e.target.files.length === 0) return;

    const file = e.target.files[0];
    setName(file.name);

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setFileContents(reader.result);
    };
  }
  function download_file(file) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    const url = window.URL.createObjectURL(new Blob([file.contents], { type: "text/plain" }));
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /*
   * Modal wrappers
   */
  function add_category() {
    if (name.trim() === "") return;

    categories.push({ id: Math.random(), name, files: [] });
    setName("");
    setAddCategoryModal(false);
    setCategories(categories);
  }
  function edit_category() {
    if (name.trim() === "") return;

    activeListing.name = name;
    setName("");
    setEditCategoryModal(false);
    setCategories(categories);
  }
  function delete_category() {
    categories.splice(categories.indexOf(activeListing), 1);
    setDeleteCategoryModal(false);
    setCategories(categories);
  }
  function add_file() {
    if (name.trim() === "") return;

    activeListing.files.push({
      id: Math.random(),
      name,
      contents: fileContents,
    });
    setName("");
    setFileContents("");
    setAddFileModal(false);
    setCategories(categories);
  }
  function edit_file() {
    if (name.trim() === "") return;

    activeListing.name = name;
    setName("");
    setEditFileModal(false);
    setCategories(categories);
  }
  function delete_file() {
    activeListing.cat.files.splice(activeListing.find, 1);
    setDeleteFileModal(false);
    setCategories(categories);
  }

  /*
   * Util for <style> tag injection
   * https://stackoverflow.com/questions/7627000/javascript-convert-string-to-safe-class-name-for-css
   */
  function make_safe(unsafe) {
    return unsafe.replace(/[^a-z0-9]/g, (s) => {
      const c = s.charCodeAt(0);
      if (c === 32) return "-";
      if (c >= 65 && c <= 90) return "_" + s.toLowerCase();
      return "__" + ("000" + c.toString(16)).slice(-4);
    });
  }

  return (
    <div className="wishgranting">
      <div className="wishgranting_header">
        <h1 className="wishgranting_title">{stepName}</h1>
      </div>
      <br />
      <div className="wishgranting_categories">
        <FileListing
          name="New category"
          className="wishgranting_newcategory"
          onClick={() => {
            setAddCategoryModal(true);
            setName("");
          }}
          leftButtonOverride={
            <FileButton
              description="Add category"
              image="/img/wishgranting_plus.svg"
              onClick={() => add_category()}
            />
          }
        />
        {categories.map((cat, ind) => (
          <FileCategory
            name={cat.name}
            key={cat.id + cat.name}
            id={`category_${ind}_${make_safe(cat.name)}_${cat.files.length}_${make_safe(stepName)}`}
            onDownloadFile={() => {}}
            onAddFile={() => {
              setAddFileModal(true);
              setActiveListing(cat);
              setName("");
            }}
            onEditCategory={() => {
              setEditCategoryModal(true);
              setActiveListing(cat);
              setName(cat.name);
            }}
            onDeleteCategory={() => {
              setDeleteCategoryModal(true);
              setActiveListing(cat);
            }}
          >
            {cat.files.map((f, find) => (
              <FileEntry
                name={f.name}
                key={f.id + f.name}
                onDownloadFile={() => download_file(f)}
                onEditFile={() => {
                  setEditFileModal(true);
                  setActiveListing(f);
                  setName(f.name);
                }}
                onDeleteFile={() => {
                  setDeleteFileModal(true);
                  setActiveListing({ cat, find });
                }}
              />
            ))}
          </FileCategory>
        ))}
      </div>
      <br />
      <Modal
        isOpen={addFileModal}
        onRequestClose={() => setAddFileModal(false)}
        contentLabel="Add File"
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>Add File</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setAddFileModal(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_label">File Name</div>
          <input
            type="text"
            id="wishgranting_addfile_filename"
            placeholder="Type file name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <br />
          <div className="wishgranting_modal_label">Upload File</div>
          <input type="file" id="wishgranting_addfile_upload" onChange={file_upload} />
        </div>
        <div className="wishgranting_modal_bottom">
          <button type="button" className="wishgranting_modal_button primary" onClick={add_file}>
            Add
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={editFileModal}
        onRequestClose={() => setEditFileModal(false)}
        contentLabel="Edit File"
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>Edit File</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setEditFileModal(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_label">File Name</div>
          <input
            type="text"
            id="wishgranting_addfile_filename"
            placeholder="Type file name here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <br />
          <div className="wishgranting_modal_label">Upload File</div>
          <input type="file" id="wishgranting_addfile_upload" onChange={file_upload} />
        </div>
        <div className="wishgranting_modal_bottom">
          <button type="button" className="wishgranting_modal_button primary" onClick={edit_file}>
            Update
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={addCategoryModal}
        onRequestClose={() => setAddCategoryModal(false)}
        contentLabel="Add Category"
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>Add Category</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setAddCategoryModal(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_label">Category Name</div>
          <input
            type="text"
            id="wishgranting_addfile_filename"
            placeholder="Type category title here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="wishgranting_modal_bottom">
          <button
            type="button"
            className="wishgranting_modal_button primary"
            onClick={add_category}
          >
            Add
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={editCategoryModal}
        onRequestClose={() => setEditCategoryModal(false)}
        contentLabel="Edit Category"
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>Edit Category</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setEditCategoryModal(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_label">Category Name</div>
          <input
            type="text"
            id="wishgranting_addfile_filename"
            placeholder="Type category title here"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="wishgranting_modal_bottom">
          <button
            type="button"
            className="wishgranting_modal_button primary"
            onClick={edit_category}
          >
            Update
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={deleteFileModal}
        onRequestClose={() => setDeleteFileModal(false)}
        contentLabel="Delete File"
        style={{ content: { height: "202px" } }}
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3> </h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setDeleteFileModal(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_center halfheight column">
            <div className="wishgranting_modal_center">
              Are you sure you want to delete this file?
            </div>
            <br />
            <div className="wishgranting_modal_center thin">
              <button
                type="button"
                className="wishgranting_modal_button"
                onClick={() => setDeleteFileModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="wishgranting_modal_button error"
                onClick={delete_file}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deleteCategoryModal}
        onRequestClose={() => setDeleteCategoryModal(false)}
        contentLabel="Delete Category"
        style={{ content: { height: "202px" } }}
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3> </h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setDeleteCategoryModal(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_center halfheight">
            <div className="wishgranting_modal_center column">
              <div className="wishgranting_modal_center">
                Are you sure you want to delete this category?
                <br />
                All files under this category will also be deleted.
              </div>
              <br />
              <div className="wishgranting_modal_center thin">
                <button
                  type="button"
                  className="wishgranting_modal_button"
                  onClick={() => setDeleteCategoryModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="wishgranting_modal_button error"
                  onClick={delete_category}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WishStep;
