import React, { useContext } from "react";
import { FileEntry, FileCategory, FileListing, FileButton } from "./FileEntry";
import { api_category_download, api_file_display } from "../auth";
import "../styles/WishGrantingPage.css";
import { FileStructure, ModalVariantsManager } from "./Contexts";

function WishStep({ index, stepName }) {
  /**
   * STATE
   */
  const [structure] = useContext(FileStructure);
  const {
    modalVariant: [_modalVariant, setModalVariant],
    open: [_modalOpen, setModalOpen],
    errorMessage: [_errorMessage, setErrorMessage],
    progress: [_progress, setProgress],
    name: [_name, setName],
    activeListing: [_activeListing, setActiveListing],
    categoryParent: [_categoryParent, setCategoryParent],
  } = useContext(ModalVariantsManager);

  /**
   * UTILITY FUNCTIONS
   */
  async function download_file(file) {
    setProgress(0);
    const res = await api_file_display(file._id, setProgress);
    if (res && !res.error) {
      const url = window.URL.createObjectURL(res);
      window.open(url);
      window.URL.revokeObjectURL(url);
    } else {
      setModalVariant();
      setErrorMessage("Failed to download file, please try again.");
    }
  }
  async function download_all_files(cat) {
    setProgress(0);
    const res = await api_category_download(cat._id, setProgress);
    if (res && !res.error) {
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(res);
      a.download = cat.name;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      setModalVariant();
      setErrorMessage("Failed to download category, please try again.");
    }
  }
  function show_modal(variant, new_name = "", new_activeListing = null) {
    setModalVariant(variant);
    setName(new_name);
    setActiveListing(new_activeListing);
    setCategoryParent(stepName);
    setModalOpen(true);
  }

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
          onClick={() => show_modal("add_category")}
          leftButtonOverride={
            <FileButton
              description="Add category"
              image="/img/wishgranting_plus.svg"
              onClick={() => show_modal("add_category")}
            />
          }
        />
        {(structure[stepName] ?? []).map((cat) => (
          <FileCategory
            name={cat.name}
            key={cat._id + cat.name}
            id={`category_${cat._id}`}
            onDownloadFile={() => download_all_files(cat)}
            onAddFile={() => show_modal("add_file", "", cat)}
            onEditCategory={() => show_modal("edit_category", cat.name, cat)}
            onDeleteCategory={() => show_modal("delete_category", "", cat)}
          >
            {cat.Files.map((f) => (
              <FileEntry
                name={f.name}
                key={f._id + f.name}
                onDownloadFile={() => download_file(f)}
                onEditFile={() => show_modal("edit_file", f.name, f)}
                onDeleteFile={() => show_modal("delete_file", "", f)}
              />
            ))}
          </FileCategory>
        ))}
      </div>
      <br />
    </div>
  );
}

export default WishStep;
