/* eslint no-restricted-globals: off */
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Custom404Page from "./Custom404Page";
import { API_ENDPOINTS } from "../constants/links";
import { api_user_info, api_user_updatepass, api_user_delete, api_pfp_upload } from "../api";
import { CurrentUser } from "../components/Contexts";

import ProfileRoles from "../components/ProfileRoles";
import ProfileActivities from "../components/ProfileActivities";

import "../styles/ProfilePage.css";

Modal.setAppElement(document.getElementById("root"));

function ProfilePage() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState();
  const [shouldRedirect, setShouldRedirect] = useState(0);
  const [changePassResponse, setChangePassResponse] = useState();
  const [pfpModalOpen, setPFPModalOpen] = useState(false);
  const [pfpErrorModalOpen, setPFPErrorModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [upImg, setUpImg] = useState();
  const [file, setFile] = useState();
  const [imgRef, setImgRef] = useState();
  const [dragActive, setDragActive] = useState(false);
  const [is404, setIs404] = useState(false);

  const [currentUser, setCurrentUser] = useContext(CurrentUser);
  const [user, setUser] = useState({});
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const [rolesChanged, setRolesChanged] = useState(false);
  const [eventsChanged, setEventsChanged] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // const [calendarEvents, setCalendarEvents] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  function fix_crop(e) {
    if (!e || e.currentTarget instanceof Window) {
      if (window.innerWidth >= 450 && window.innerHeight >= 580) return;
      if (imgRef && crop.x + crop.width <= imgRef.width && crop.y + crop.height <= imgRef.height)
        return;
    }

    const img = e.currentTarget instanceof Window ? imgRef : e.currentTarget;
    if (!img) return;

    const new_crop = {
      unit: "%",
      aspect: 1,
    };

    if (Math.min(img.width, img.height) === img.width) {
      new_crop.width = 80;
      new_crop.height = (img.width / img.height) * 80;

      new_crop.x = 10;
      new_crop.y = (100 - new_crop.height) / 2;
    } else {
      new_crop.height = 80;
      new_crop.width = (img.height / img.width) * 80;

      new_crop.y = 10;
      new_crop.x = (100 - new_crop.width) / 2;
    }

    setCrop(new_crop);
    setImgRef(img);
  }

  function prepare_pfp(e) {
    if (e.target.files.length === 0) return;

    // accept="image/*" on the <input> should prevent this
    //   from ever executing
    if (e.target.files[0].type.indexOf("image") === -1) {
      setPFPErrorModalOpen("File is not an image (.jpg, .png, .gif, etc.).");
      return;
    }

    // 16 MB maximum, same as multer on backend
    if (e.target.files[0].size > 1.6e7) {
      setPFPErrorModalOpen(
        `File is too large (${Math.round(e.target.files[0].size / 1e6)} MB), maximum is 16 MB.`
      );
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
      width: Math.floor((crop.width / 100) * imgRef.naturalWidth),
      height: Math.floor((crop.height / 100) * imgRef.naturalHeight),
      left: Math.floor((crop.x / 100) * imgRef.naturalWidth),
      top: Math.floor((crop.y / 100) * imgRef.naturalHeight),
    };

    const res = await api_pfp_upload(file, JSON.stringify(corrected_crop));
    if (res && res.success) {
      setUser(res.user);
      if (res.user._id === currentUser._id) {
        setIsCurrentUser(true);
        setCurrentUser(res.user);
      }
    } else {
      setPFPErrorModalOpen("Failed to upload file, please try again.");
    }
    setOpacity(1);
    setPFPModalOpen(false);
    setCrop({ aspect: 1 });
  }

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
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
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

  useEffect(() => {
    window.addEventListener("resize", fix_crop);
    return () => window.removeEventListener("resize", fix_crop);
  }, [imgRef]);

  useEffect(() => {
    async function handleUserInfo() {
      const res = await api_user_info(id ?? currentUser._id);
      if (!res || !res.user) setIs404(true);
      else {
        setIs404(false);
        setUser(res.user);
        if (res.user._id === currentUser._id) {
          setIsCurrentUser(true);
          setCurrentUser(res.user);
        } else {
          setIsCurrentUser(false);
        }
      }
    }
    handleUserInfo();
  }, [id, rolesChanged, eventsChanged]);

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

  useEffect(() => {
    document.title = `${user.name ?? "Profile"} - Make-a-Wish San Diego`;
  }, [user]);

  // Change format of calendar events to fit in with the format of manual events.
  function formatCalendarEvents() {
    let allNonManual = [];
    user.events.map((event) =>
      allNonManual.push({
        _id: event._id,
        date: event.from,
        title: event.name,
        hours: new Date(event.to).getHours() - new Date(event.from).getHours(),
        notEditable: true,
      })
    );
    allNonManual = allNonManual.concat(user.manualEvents);
    allNonManual.sort(
      (event1, event2) => new Date(event1.date).getTime() - new Date(event2.date).getTime()
    );
    return allNonManual;
  }

  return is404 ? (
    <Custom404Page />
  ) : (
    <div className="profile-page">
      <section className="header-section">
        <div className="profile-image">
          <img
            src={
              user && user._id
                ? `${API_ENDPOINTS.PFP_GET}/${user._id}/${new Date(
                    user.profilePictureModified
                  ).getTime()}`
                : ""
            }
            alt={`${user.name}'s Profile`}
          />
          {isCurrentUser && (
            <>
              <button type="button">
                <label htmlFor="pfp_input">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                  </svg>
                  <input
                    id="pfp_input"
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={prepare_pfp}
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    hidden
                  />
                </label>
              </button>

              <Modal
                className="profile-page-modal"
                overlayClassName="profile-page-modal-overlay"
                isOpen={pfpModalOpen}
                onRequestClose={() => {
                  if (!dragActive) {
                    setPFPModalOpen(false);
                    setCrop({ aspect: 1 });
                  }
                }}
                contentLabel="Change profile picture"
              >
                <h1 className="modal-title-crop">Crop Profile Picture</h1>
                <span className="modal-subtitle-crop">Click and drag to crop</span>
                <ReactCrop
                  crop={crop}
                  aspect={1}
                  minWidth={10}
                  ruleOfThirds
                  onChange={(_c, pc) => setCrop(pc)}
                  onComplete={(_c, pc) => setCrop(pc)}
                  onDragStart={() => setDragActive(true)}
                  onDragEnd={() => setTimeout(() => setDragActive(false), 100)}
                >
                  <img
                    alt="Crop modal"
                    src={upImg}
                    style={{
                      maxHeight: "calc(100vh - 180px)",
                    }}
                    onLoad={fix_crop}
                  />
                </ReactCrop>
                <br />
                <div className="modal-flex-crop">
                  <button
                    type="button"
                    className="modal-button button-nomargin change-password-button"
                    onClick={() => setPFPModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <span>&nbsp;</span>
                  <button
                    type="button"
                    className="modal-button button-primary button-nomargin"
                    onClick={do_upload}
                    style={{ opacity }}
                  >
                    Upload
                  </button>
                </div>
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
            </>
          )}
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
          {currentUser && currentUser.admin === 2 && (
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
      <div>
        {user.roles && user.manualEvents ? (
          <div>
            <div className="user_stats">
              <ProfileRoles user={user} onRolesChange={setRolesChanged} />
              <div className="assign_completed">
                <h2 className="task_title">Assignments Completed</h2>
                <p className="task_number">
                  {user.events.reduce(
                    (prev, next) =>
                      prev +
                      Object.entries(next.repetitions).reduce(
                        (subprev, [date, subnext]) =>
                          subprev +
                          (new Date(date).setHours(
                            new Date(next.to).getHours(),
                            new Date(next.to).getMinutes()
                          ) <= Date.now() &&
                            Object.prototype.hasOwnProperty.call(subnext.attendees, user._id)),
                        0
                      ),
                    0
                  ) +
                    user.manualEvents.filter((evt) => new Date(evt.date).getTime() <= Date.now())
                      .length}
                </p>
              </div>
            </div>
            <ProfileActivities
              events={formatCalendarEvents()}
              admin={currentUser.admin === 2}
              id={user._id}
              currId={currentUser._id}
              updateEvents={() => setEventsChanged(Math.random())}
            />
          </div>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
