import React, { useState, createRef } from "react";
import Modal from "react-modal";

import { API_ENDPOINTS } from "../constants/links";
import { api_pfp_upload } from "../auth";

import "../styles/ProfilePage.css";

Modal.setAppElement(document.getElementById("root"));

function ProfilePage() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cacheBreaker, setCacheBreaker] = useState(new Date().getTime());

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

  async function upload_pfp(e) {
    if (e.target.files.length === 0) return;

    const res = await api_pfp_upload(e.target.files[0]);
    if (res && res.success) {
      setCacheBreaker(new Date().getTime());
    }
  }

  return (
    <div className="profile-page">
      <section className="header-section">
        <div className="profile-image">
          <img
            key={cacheBreaker}
            src={`${API_ENDPOINTS.PFP_GET}?${cacheBreaker}`}
            alt={`${user.full_name}'s Profile`}
          />
          <input ref={pfp_ref} className="hidden" type="file" onChange={upload_pfp} hidden />
          <button type="button" onClick={open_pfp}>
            +
          </button>
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
