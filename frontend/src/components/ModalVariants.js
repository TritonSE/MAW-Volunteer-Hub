import React, { useEffect, useState, useContext } from "react";

import Modal from "./Modal";

import { FileStructure, ModalVariantsManager } from "./Contexts";

import {
  api_category_create,
  api_category_delete,
  api_category_update,
  api_file_upload,
  api_file_update,
  api_file_delete,
} from "../api";

import "../styles/ModalVariants.css";

function ModalVariants() {
  /**
   * STATE
   */
  const [fileContents, setFileContents] = useState();
  const [variant, setVariant] = useState({});
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [nameError, setNameError] = useState(false);

  const [_structure, getStructure] = useContext(FileStructure);
  const {
    modalVariant: [modalVariant],
    open: [open, setOpen],
    errorMessage: [errorMessage, setErrorMessage],
    progress: [progress, setProgress],
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
      on_submit: async (args) => {
        setProgress(0);
        const res = await api_file_upload(
          args.fileContents,
          args.name,
          args.activeListing._id,
          (val) => setProgress(val)
        );
        setProgress("done");
        return res;
      },
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
      on_submit: async (args) => {
        if (args.fileContents) setProgress(0);
        const res = await api_file_update(
          args.activeListing._id,
          args.fileContents,
          args.name,
          (val) => {
            if (args.fileContents) {
              setProgress(val);
            }
          }
        );
        setProgress("done");
        return res;
      },
    },
    delete_file: {
      title: " ",
      class_name: "thin",
      center: {
        title: (
          <div>
            <br />
            Are you sure you want to delete this file?
            <br />
          </div>
        ),
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
      class_name: "thin",
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
    error: {
      title: "Error",
      class_name: "thin",
      custom: (
        <>
          <br />
          <div className="center">{errorMessage}</div>
          <br />
          <div className="center thin center">
            <button
              type="button"
              className="maw-ui_button primary"
              onClick={() => setErrorMessage()}
            >
              Okay
            </button>
          </div>
        </>
      ),
    },
    progress: {
      title: "Progress",
      class_name: "thin",
      has_close: false,
      custom: (
        <>
          <div className="center">
            <div
              className={`progress ${progress}`}
              role="progressbar"
              style={{ "--progress": `${typeof progress === "number" ? progress : 50}%` }}
            >
              <div className="progress_inner">
                {progress === "indeterminate" ? "Loading..." : Math.floor(progress) + "%"}
              </div>
            </div>
          </div>
          <br />
        </>
      ),
    },
  };

  /**
   * HOOKS
   */
  useEffect(() => {
    if (!modalVariant && !errorMessage) setOpen(false);
    else if (modalVariant && modal_variants[modalVariant]) setVariant(modal_variants[modalVariant]);
  }, [modalVariant]);
  useEffect(() => {
    if (errorMessage) setVariant(modal_variants.error);
    else if (modal_variants[modalVariant]) setVariant(modal_variants[modalVariant]);

    if (errorMessage || modal_variants[modalVariant]) setOpen(true);
    else if (!modalVariant) setOpen(false);
  }, [errorMessage]);
  useEffect(() => {
    // Explicitly check for undefined because 0 is a valid progress state
    if (!errorMessage && progress !== undefined) {
      if (progress !== "done") setVariant(modal_variants.progress);
      else if (modal_variants[modalVariant]) setVariant(modal_variants[modalVariant]);

      setOpen(progress !== "done");
    }
  }, [progress]);

  /**
   * UTILITY FUNCTIONS
   */
  function file_upload(e) {
    if (e.target.files.length === 0) return;

    setFileContents(e.target.files[0]);
    setName(e.target.files[0].name);
  }
  function validate() {
    if (name.trim() === "") {
      setNameError(true);
      return false;
    }
    return true;
  }
  async function handle_submit(e) {
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
        setErrorMessage(res ? res.error : "Unable to reach server, please try again.");
      } else {
        getStructure();
        setOpen(false);
        setName("");
        setActiveListing(null);
        setFileContents();
      }
    }
  }

  return (
    <Modal
      isOpen={open}
      onRequestClose={() => {
        if (variant.has_close === undefined) setOpen(false);
      }}
      contentLabel={variant.title}
      className={variant?.class_name}
      title={variant?.title}
      hasClose={variant?.has_close}
      actionButton={variant?.action_button?.title}
      actionButtonProps={{ type: "submit", disabled: !submitEnabled, onClick: handle_submit }}
    >
      <form onSubmit={handle_submit}>
        <input type="submit" hidden /> {/* Form submits on enter key */}
        <div className={variant.name ? "" : "hidden"}>
          <div className="label">{(variant.name ?? {}).title}</div>
          <input
            className={`maw-ui_input ${nameError ? "error" : ""}`}
            placeholder={(variant.name ?? {}).placeholder}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError(false);
            }}
          />
          <br />
          <br />
        </div>
        {variant.has_upload && (
          <>
            <div className="label">Upload File</div>
            <input type="file" onChange={file_upload} />
          </>
        )}
        {variant.center && (
          <>
            <div className="center">{variant.center.title}</div>
            <br />
            <br />
            <div className="center">
              <button type="button" className="maw-ui_button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <div className="spacer" />
              <button type="submit" className="maw-ui_button error" disabled={!submitEnabled}>
                {variant.center.action_button.title}
              </button>
            </div>
          </>
        )}
        {variant.custom || null}
      </form>
    </Modal>
  );
}

export default ModalVariants;
