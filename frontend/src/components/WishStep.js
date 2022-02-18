import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useOutletContext } from "react-router-dom";
import { FileEntry, FileCategory, FileListing, FileButton } from "./FileEntry";
import {
  api_category_all,
  api_category_create,
  api_category_delete,
  api_category_update,
  api_category_download,
  api_file_upload,
  api_file_update,
  api_file_delete,
  api_file_display,
} from "../auth";
import "../styles/WishGrantingPage.css";

Modal.setAppElement("#root");

function WishStep({ index, stepName }) {
  /**
   * STATE
   */
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState({});
  const [activeListing, setActiveListing] = useState(null);
  const [name, setName] = useState("");
  const [fileContents, setFileContents] = useState("");

  const rerender = useOutletContext();

  /**
   * MODAL VARIANTS
   */
  const modal_variants = {
    add_file: {
      title: "Add File",
      name: {
        title: "File Name",
        placeholder: "Type file name here",
      },
      has_upload: true,
      action_button: {
        title: "Add",
      },
      on_submit: async (args) =>
        api_file_upload(args.fileContents, args.name, args.activeListing._id),
    },
    edit_file: {
      title: "Edit File",
      name: {
        title: "File Name",
        placeholder: "Type file name here",
      },
      has_upload: true,
      action_button: {
        title: "Update",
      },
      on_submit: async (args) =>
        api_file_update(args.activeListing._id, args.fileContents, args.name),
    },
    delete_file: {
      title: " ",
      style: { height: "202px" },
      name: false,
      has_upload: false,
      action_button: false,
      center: {
        title: "Are you sure you want to delete this file?",
        action_button: {
          title: "Delete",
        },
      },
      on_submit: async (args) => api_file_delete(args.activeListing._id),
    },

    add_category: {
      title: "Add Category",
      name: {
        title: "Category Name",
        placeholder: "Type category title here",
      },
      has_upload: false,
      action_button: {
        title: "Add",
      },
      on_submit: async (args) => api_category_create(args.name, stepName),
    },
    edit_category: {
      title: "Edit Category",
      name: {
        title: "Category Name",
        placeholder: "Type category title here",
      },
      has_upload: false,
      action_button: {
        title: "Update",
      },
      on_submit: async (args) => api_category_update(args.activeListing._id, args.name),
    },
    delete_category: {
      title: " ",
      style: { height: "202px" },
      name: false,
      has_upload: false,
      action_button: false,
      center: {
        title: (
          <div>
            Are you sure you want to delete this category?
            <br />
            All files under this category will also be deleted.
          </div>
        ),
        action_button: {
          title: "Delete",
        },
      },
      on_submit: async (args) => api_category_delete(args.activeListing._id),
    },
  };

  /**
   * UTILITY FUNCTIONS
   */
  function file_upload(e) {
    if (e.target.files.length === 0) return;

    setFileContents(e.target.files[0]);
    setName(e.target.files[0].name);
  }
  async function download_file(file) {
    const res = await api_file_display(file._id);
    if (res && !res.error) {
      const url = window.URL.createObjectURL(res);
      window.open(url);
      window.URL.revokeObjectURL(url);
    }
  }
  async function download_all_files(cat) {
    const res = await api_category_download(cat._id);
    if (res && !res.error) {
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(res);
      a.download = cat.name;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
    const res = await api_category_all(stepName);
    if (res) setCategories(res);
    setModalOpen(false);
    setName("");
    setActiveListing(null);
  }
  function validate() {
    /* TODO */
    return true;
  }

  /**
   * HOOK
   */
  useEffect(hide_modal, [rerender]);

  /**
   * RENDER
   */
  return (
    <div className="wishgranting">
      <div className="wishgranting_header">
        <h1 className="wishgranting_title">
          Step {index}: {stepName}
        </h1>
      </div>
      <br />
      <div className="wishgranting_categories">
        <FileListing
          name="New category"
          className="wishgranting_newcategory"
          onClick={() => show_modal(modal_variants.add_category)}
          leftButtonOverride={
            <FileButton
              description="Add category"
              image="/img/wishgranting_plus.svg"
              onClick={() => show_modal(modal_variants.add_category)}
            />
          }
        />
        {categories.map((cat) => (
          <FileCategory
            name={cat.name}
            key={cat._id + cat.name}
            id={`category_${cat._id}`}
            onDownloadFile={() => download_all_files(cat)}
            onAddFile={() => show_modal(modal_variants.add_file, "", cat)}
            onEditCategory={() => show_modal(modal_variants.edit_category, cat.name, cat)}
            onDeleteCategory={() => show_modal(modal_variants.delete_category, "", cat)}
          >
            {cat.Files.map((f) => (
              <FileEntry
                name={f.name}
                key={f._id + f.name}
                onDownloadFile={() => download_file(f)}
                onEditFile={() => show_modal(modal_variants.edit_file, f.name, f)}
                onDeleteFile={() => show_modal(modal_variants.delete_file, "", f)}
              />
            ))}
          </FileCategory>
        ))}
      </div>
      <br />
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel={modalVariant.title}
        style={{ content: modalVariant.style ?? {} }}
        className="wishgranting_react_modal"
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>{modalVariant.title}</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setModalOpen(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (validate()) {
                await modalVariant.on_submit({
                  name,
                  activeListing,
                  fileContents,
                });
                hide_modal();
              }
            }}
          >
            <input type="submit" hidden /> {/* Form submits on enter key */}
            <div className={modalVariant.name ? "" : "hidden"}>
              <div className="wishgranting_modal_label">{(modalVariant.name ?? {}).title}</div>
              <input
                type="text"
                id="wishgranting_addfile_filename"
                placeholder={(modalVariant.name ?? {}).placeholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <br />
            </div>
            {modalVariant.has_upload ? (
              <>
                <div className="wishgranting_modal_label">Upload File</div>
                <input type="file" id="wishgranting_addfile_upload" onChange={file_upload} />
              </>
            ) : null}
            {modalVariant.center ? (
              <div className="wishgranting_modal_center halfheight column">
                <div className="wishgranting_modal_center">{modalVariant.center.title}</div>
                <br />
                <div className="wishgranting_modal_center thin">
                  <button
                    type="button"
                    className="wishgranting_modal_button"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="wishgranting_modal_button error">
                    {modalVariant.center.action_button.title}
                  </button>
                </div>
              </div>
            ) : null}
            {modalVariant.action_button ? (
              <div className="wishgranting_modal_bottom">
                <button type="submit" className="wishgranting_modal_button primary">
                  {modalVariant.action_button.title}
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default WishStep;
