import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { api_user } from "../auth";
import history from "../history";
import "../styles/ProfilePage.css";

Modal.setAppElement(document.getElementById("root"));

function ProfilePage() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [user, setUser] = useState({});
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  // const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(true); // change this once andrew's pr gets merged in

  const [active, setActive] = useState(history.location.pathname.split("/profile/")[1] ?? "");

  const navigate = useNavigate();

  useEffect(async () => {
    const res = await api_user(active);
    if (!res || !res.user) navigate("/user-not-found");
    else {
      setUser(res.user);
      setIsCurrentUser(res.sameUser);
    }
  }, [active]);

  useEffect(
    () =>
      history.listen((e) => {
        setActive(e.location.pathname.split("/profile/")[1]);
      }),
    []
  );

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
          {true && (
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
          <button className="modal-button small button-danger" type="button">
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ProfilePage;
