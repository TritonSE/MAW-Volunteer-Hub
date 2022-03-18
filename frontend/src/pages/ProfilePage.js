/* eslint no-restricted-globals: off */

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate, useParams } from "react-router-dom";
import { api_user_info, api_user_updatepass, api_user_delete } from "../auth";
import history from "../history";
import "../styles/ProfilePage.css";

Modal.setAppElement(document.getElementById("root"));

function ProfilePage({ isAdmin }) {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState();
  const [shouldRedirect, setShouldRedirect] = useState(0);
  const [changePassResponse, setChangePassResponse] = useState();

  const [user, setUser] = useState({});
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  // const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(true); // change this once andrew's pr gets merged in

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(async () => {
    const res = await api_user_info(id ?? "");
    if (!res || !res.user) navigate("/user-not-found");
    else {
      setUser(res.user);
      console.log(res.sameUser);
      setIsCurrentUser(res.sameUser);
    }
  }, [id]);

  useEffect(() => {
    if (!responseModalOpen) {
      if (shouldRedirect === 1) {
        navigate("/");
        location.reload();
      } else if (shouldRedirect === -1) {
        setDeleteModalOpen(true);
      }
    }
  }, [responseModalOpen]);

  async function change_password(e) {
    e.preventDefault();

    if (newPass !== confirmPass) {
      setChangePassResponse("New passwords do not match.");
      return;
    }

    const res = await api_user_updatepass(oldPass, newPass);
    if (!res || res.error) {
      setChangePassResponse((res ?? {}).error ?? "Unable to reach server, please try again.");
    } else {
      setChangePassResponse();
      setResponseModalOpen("Password changed successfully.");
      setPassModalOpen(false);
    }
  }

  async function delete_account() {
    const res = await api_user_delete(id ?? "");
    if (!res || res.error) {
      setResponseModalOpen((res ?? {}).error ?? "Unable to reach server, please try again.");
      setDeleteModalOpen(false);
      setShouldRedirect(-1);
    } else {
      setResponseModalOpen("Account deleted successfully.");
      setDeleteModalOpen(false);
      setShouldRedirect(1);
    }
  }

  return (
    <div className="profile-page">
      <section className="header-section">
        <div className="profile-image">
          <img
            src="https://www.pinclipart.com/picdir/big/372-3725108_user-profile-avatar-scalable-vector-graphics-icon-woman.png"
            alt={`${user.name}'s Profile`}
          />
          <button type="button">+</button>
        </div>
        <div className="profile-header-info">
          <h1>{user.name}</h1>
          <h2>
            Joined {new Date(user.createdAt).toLocaleString("default", { month: "long" })}{" "}
            {new Date(user.createdAt).getFullYear()}
          </h2>
          <br />
          <p>{user.email}</p>
        </div>
        <div className="profile-buttons-container">
          {isCurrentUser && (
            <button
              type="button"
              className="change-password-button"
              onClick={() => setPassModalOpen(true)}
            >
              Change Password
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              className="delete-account-button"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Profile
            </button>
          )}
        </div>
        {/* <div>{isCurrentUser ? <p>Current User</p> : <p>Not Current User</p>}</div> */}
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
        <form className="change-pass-form" onSubmit={change_password}>
          <input
            placeholder="Enter old password"
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <input
            placeholder="Enter new password"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <input
            placeholder="Reenter new password"
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <div
            className="change-pass-errorbox"
            style={{ visibility: changePassResponse ? "visible" : "hidden" }}
          >
            {changePassResponse}
          </div>

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
          <button
            className="modal-button small button-danger"
            type="button"
            onClick={delete_account}
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        className="profile-page-modal"
        overlayClassName="profile-page-modal-overlay"
        isOpen={Boolean(responseModalOpen)}
        onRequestClose={() => setResponseModalOpen()}
        contentLabel="Response"
      >
        <h1>{responseModalOpen}</h1>
        <div className="delete-button-container">
          <button
            className="modal-button small button-primary"
            type="button"
            onClick={() => setResponseModalOpen()}
          >
            Okay
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ProfilePage;
