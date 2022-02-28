import React, { useState, useContext, createRef } from "react";
import ReactCrop from "react-image-crop";
import Modal from "react-modal";
import "react-image-crop/dist/ReactCrop.css";

import { API_ENDPOINTS } from "../constants/links";
import { api_pfp_upload } from "../auth";
import { CacheBreaker } from "../components/Contexts";

import "../styles/ProfilePage.css";

Modal.setAppElement(document.getElementById("root"));

function ProfilePage() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pfpModalOpen, setPFPModalOpen] = useState(false);
  const [pfpErrorModalOpen, setPFPErrorModalOpen] = useState(false);
  const [cacheBreaker, setCacheBreaker] = useContext(CacheBreaker);
  const [opacity, setOpacity] = useState(1);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [upImg, setUpImg] = useState();
  const [file, setFile] = useState();
  const [imgRef, setImgRef] = useState();

  // TODO: Refs are never usually required, there's almost always a better way
  const pfp_ref = createRef();

  const user = {
    full_name: "Carly Shay",
    email: "carlyshay@gmail.com",
    join_date: "June 2019",
    profilePicture: "",
  };

  function open_pfp() {
    pfp_ref.current.click();
  }

  function prepare_pfp(e) {
    if (e.target.files.length === 0) return;

    if (e.target.files[0].size > 1.6e7) {
      // 16 MB, same as multer on backend
      setPFPErrorModalOpen("File is too large, max is 16 MB.");
      return;
    }

    setFile(e.target.files[0]);

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setPFPModalOpen(true);
      setUpImg(reader.result);
    };
  }

  async function do_upload() {
    setOpacity(0.5);

    const corrected_crop = {
      width: Math.round((crop.width / imgRef.width) * imgRef.naturalWidth),
      height: Math.round((crop.height / imgRef.height) * imgRef.naturalHeight),
      x: Math.round((crop.x / imgRef.width) * imgRef.naturalWidth),
      y: Math.round((crop.y / imgRef.height) * imgRef.naturalHeight),
    };

    const res = await api_pfp_upload(file, JSON.stringify(corrected_crop));
    if (res && res.success) {
      setCacheBreaker(cacheBreaker + 1);
    } else {
      setPFPErrorModalOpen("Failed to upload file, please try again.");
    }
    setOpacity(1);
    setPFPModalOpen(false);
    setCrop({ aspect: 1 });
  }

  return (
    <div className="profile-page">
      <section className="header-section">
        <div className="profile-image">
          <img
            key={cacheBreaker}
            src={`${API_ENDPOINTS.PFP_GET}?${cacheBreaker}`}
            alt={`${user.full_name}'s Profile`}
            style={{ opacity, transition: "opacity 0.3s" }}
          />
          <input ref={pfp_ref} className="hidden" type="file" onChange={prepare_pfp} hidden />
          <button type="button" onClick={open_pfp}>
            +
          </button>

          <Modal
            className="profile-page-modal"
            overlayClassName="profile-page-modal-overlay"
            isOpen={pfpModalOpen}
            onRequestClose={() => {
              setPFPModalOpen(false);
              setCrop({ aspect: 1 });
            }}
            contentLabel="Change profile picture"
          >
            {/* TODO: This modal overlaps with the searchbar at small sizes */}
            <h1 className="modal-title-crop">Crop Profile Picture</h1>
            <ReactCrop
              src={upImg}
              crop={crop}
              minWidth={10}
              onImageLoaded={(img) => setImgRef(img)}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCrop(c)}
            />
            <br />
            <button
              type="button"
              className="modal-button button-primary button-nomargin"
              onClick={do_upload}
            >
              Upload
            </button>
          </Modal>
          <Modal
            className="profile-page-modal"
            overlayClassName="profile-page-modal-overlay"
            isOpen={Boolean(pfpErrorModalOpen)}
            onRequestClose={() => setPFPErrorModalOpen(false)}
            contentLabel="Profile picture error"
          >
            <h1 className="modal-title-crop">Error:</h1>
            <span>{pfpErrorModalOpen}</span>
            <br />
            <button
              type="button"
              className="modal-button button-primary button-nomargin"
              onClick={() => setPFPErrorModalOpen(false)}
            >
              Okay
            </button>
          </Modal>
        </div>
        <div className="profile-header-info">
          <h1>{user.full_name}</h1>
          <h2>Joined {user.join_date}</h2>
          <br />
          <p>{user.email}</p>
        </div>
        <div className="profile-buttons-container">
          <button
            type="button"
            className="change-password-button"
            onClick={() => setPassModalOpen(true)}
          >
            Change Password
          </button>
          <button
            type="button"
            className="delete-account-button"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Profile
          </button>
        </div>
      </section>

      {/* Change Password and Delete Profile Modals */}
      <Modal
        className="profile-page-modal"
        overlayClassName="profile-page-modal-overlay"
        isOpen={passModalOpen}
        onRequestClose={() => setPassModalOpen(false)}
        contentLabel="Change Password Modal"
      >
        <button
          className="close-button"
          aria-label="close-button"
          type="button"
          onClick={() => setPassModalOpen(false)}
        />
        <form className="change-pass-form">
          <input placeholder="Enter old password" type="password" />
          <input placeholder="Enter new password" type="password" />
          <input placeholder="Reenter new password" type="password" />

          <button className="modal-button button-primary" type="submit">
            Change password
          </button>
        </form>
      </Modal>

      <Modal
        className="profile-page-modal"
        overlayClassName="profile-page-modal-overlay"
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        contentLabel="Delete Account Modal"
      >
        <h1>Are you sure you want to delete this profile?</h1>
        <button
          className="close-button"
          aria-label="close-button"
          type="button"
          onClick={() => setDeleteModalOpen(false)}
        />
        <div className="delete-button-container">
          <button
            className="modal-button small button-secondary"
            type="button"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button className="modal-button small button-danger " type="button">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ProfilePage;
