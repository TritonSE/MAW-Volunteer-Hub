import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import {
  api_category_create,
  api_category_delete,
  api_category_update,
  api_file_upload,
  api_file_update,
  api_file_delete,
} from "../auth";
import { FileStructure, ModalVariantsManager } from "./Contexts";
import "../styles/ModalVariants.css";

Modal.setAppElement("#root");

function ModalVariants() {
  /**
   * STATE
   */
  const [fileContents, setFileContents] = useState();
  const [variant, setVariant] = useState({});
  const [submitEnabled, setSubmitEnabled] = useState(true);

  const [_structure, getStructure] = useContext(FileStructure);
  const {
    modalVariant: [modalVariant],
    open: [open, setOpen],
    errorOpen: [errorOpen, setErrorOpen],
    progressOpen: [progressOpen, setProgressOpen],
    name: [name, setName],
    activeListing: [activeListing, setActiveListing],
    categoryParent: [categoryParent],
  } = useContext(ModalVariantsManager);

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
        api_file_upload(args.fileContents, args.name, args.activeListing._id, (val) => {
          setProgressOpen(val);
          setOpen(false);
        }),
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
        api_file_update(args.activeListing._id, args.fileContents, args.name, (val) => {
          if (args.fileContents) {
            setProgressOpen(val);
            setOpen(false);
          }
        }),
    },
    delete_file: {
      title: " ",
      className: "thin",
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
      on_submit: async (args) => api_category_create(args.name, args.categoryParent),
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
      className: "thin",
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
   * HOOKS
   */
  useEffect(() => setVariant(modal_variants[modalVariant]), [modalVariant]);
  useEffect(() => {
    // Explicit check for false because errorOpen's initial state is null
    if (errorOpen === false) setOpen(true);
  }, [errorOpen]);

  /**
   * UTILITY FUNCTIONS
   */
  function file_upload(e) {
    if (e.target.files.length === 0) return;

    setFileContents(e.target.files[0]);
    setName(e.target.files[0].name);
  }
  function validate() {
    /* TODO */
    return true;
  }

  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        contentLabel={variant.title}
        className={`wishgranting_react_modal ${variant.className ?? ""}`}
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>{variant.title}</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setOpen(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (validate()) {
                setSubmitEnabled(false);
                const res = await variant.on_submit({
                  name,
                  activeListing,
                  fileContents,
                  categoryParent,
                });
                setSubmitEnabled(true);
                if (!res || res.error) {
                  setErrorOpen(res ? res.error : "Unable to reach server, please try again.");
                  setOpen(false);
                } else {
                  getStructure();
                  setOpen(false);
                  setName("");
                  setActiveListing(null);
                  setFileContents();
                }
              }
            }}
          >
            <input type="submit" hidden /> {/* Form submits on enter key */}
            <div className={variant.name ? "" : "hidden"}>
              <div className="wishgranting_modal_label">{(variant.name ?? {}).title}</div>
              <input
                type="text"
                id="wishgranting_addfile_filename"
                placeholder={(variant.name ?? {}).placeholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <br />
            </div>
            {variant.has_upload ? (
              <>
                <div className="wishgranting_modal_label">Upload File</div>
                <input type="file" id="wishgranting_addfile_upload" onChange={file_upload} />
              </>
            ) : null}
            {variant.center ? (
              <div className="wishgranting_modal_center halfheight column">
                <div className="wishgranting_modal_center">{variant.center.title}</div>
                <br />
                <div className="wishgranting_modal_center thin">
                  <button
                    type="button"
                    className="wishgranting_modal_button"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="wishgranting_modal_button error"
                    disabled={!submitEnabled}
                  >
                    {variant.center.action_button.title}
                  </button>
                </div>
              </div>
            ) : null}
            {variant.action_button ? (
              <div className="wishgranting_modal_bottom">
                <button
                  type="submit"
                  className="wishgranting_modal_button primary"
                  disabled={!submitEnabled}
                >
                  {variant.action_button.title}
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={progressOpen !== undefined}
        onRequestClose={() => setProgressOpen()}
        contentLabel="Progress"
        className="wishgranting_react_modal thin"
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>Progress</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setProgressOpen()}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_center halfheight column">
            <div className="wishgranting_modal_center">
              <div
                className="wishgranting_progress"
                role="progressbar"
                style={{ "--progress": `${progressOpen}%` }}
              >
                {Math.floor(progressOpen)}%
              </div>
            </div>
            <br />
            <div className="wishgranting_modal_center thin center">{/* TODO */}</div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={Boolean(errorOpen)}
        onRequestClose={() => setErrorOpen(false)}
        contentLabel="Error"
        className="wishgranting_react_modal thin"
      >
        <div className="wishgranting_modal">
          <div className="wishgranting_modal_header">
            <h3>Error</h3>
            <button
              type="button"
              className="wishgranting_modal_close"
              onClick={() => setErrorOpen(false)}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="wishgranting_modal_center halfheight column">
            <div className="wishgranting_modal_center">{errorOpen}</div>
            <br />
            <div className="wishgranting_modal_center thin center">
              <button
                type="button"
                className="wishgranting_modal_button primary"
                onClick={() => setErrorOpen(false)}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalVariants;
