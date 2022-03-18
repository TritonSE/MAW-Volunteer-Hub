import React, { useState, useContext } from "react";
import { FileEntry, FileCategory, FileListing, FileButton } from "./FileEntry";
import { api_category_download, api_file_display } from "../api";
import ModalVariants from "./ModalVariants";
import "../styles/WishGrantingPage.css";
import FileStructure from "./FileStructure";

function WishStep({ index, stepName }) {
  /**
   * STATE
   */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState("add_file");
  const [name, setName] = useState("");
  const [activeListing, setActiveListing] = useState();
  const [structure, getStructure] = useContext(FileStructure);

  /**
   * UTILITY FUNCTIONS
   */
  async function download_file(file) {
    const res = await api_file_display(file._id);
    if (res && !res.error) {
      const url = window.URL.createObjectURL(res);
      if (!window.open(url)) {
        // Fix for pop-up blockers (e.g. iOS Safari)
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
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
    getStructure();
    setModalOpen(false);
    setName("");
    setActiveListing(null);
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
      <ModalVariants
        modalVariant={modalVariant}
        open={modalOpen}
        setOpen={setModalOpen}
        name={name}
        setName={setName}
        activeListing={activeListing}
        categoryParent={stepName}
        onClose={() => hide_modal()}
      />
    </div>
  );
}

export default WishStep;
