import React, { useState } from "react";
import Modal from "react-modal";

import "../styles/ProfilePage.css";

Modal.setAppElement(document.getElementById("root"));

function ProfilePage() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const user = {
    full_name: "Carly Shay",
    email: "carlyshay@gmail.com",
    join_date: "June 2019",
    profilePicture: "",
  };

  return (
    <div className="profile-page">
      <section className="header-section">
        <div className="profile-image">
          <img
            src="https://www.pinclipart.com/picdir/big/372-3725108_user-profile-avatar-scalable-vector-graphics-icon-woman.png"
            alt={`${user.full_name}'s Profile`}
          />
          <button type="button">+</button>
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
        isOpen={passModalOpen}
        onRequestClose={() => setPassModalOpen(false)}
        contentLabel="Example Modal"
      >
        <h2>Change Password</h2>
        <button type="button" onClick={() => setPassModalOpen(false)}>x</button>
        <form>
          <input />
          <input />
          <input />

          <button type="submit"> submit</button>
        </form>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        contentLabel="Example Modal"
      >
        <h2>Are you sure you want to delete this profile?</h2>
        <button type="button" onClick={() => setDeleteModalOpen(false)}>
          x
        </button>
        <button type="button">Cancel</button>
        <button type="button">Delete</button>
      </Modal>
    </div>
  );
}

export default ProfilePage;
