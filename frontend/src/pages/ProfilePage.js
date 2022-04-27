/* eslint no-restricted-globals: off */
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import Modal from "../components/Modal";

import Custom404Page from "./Custom404Page";
import { API_ENDPOINTS } from "../constants/links";
import { api_user_info, api_user_updatepass, api_user_delete, api_pfp_upload } from "../api";
import { CurrentUser } from "../components/Contexts";

import "../styles/ProfilePage.css";

function ProfilePage() {
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState();
  const [shouldRedirect, setShouldRedirect] = useState(0);
  const [changePassResponse, setChangePassResponse] = useState();
  const [pfpModalOpen, setPFPModalOpen] = useState(false);
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

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

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
      setResponseModalOpen("File is not an image (.jpg, .png, .gif, etc.).");
      return;
    }

    // 16 MB maximum, same as multer on backend
    if (e.target.files[0].size > 1.6e7) {
      setResponseModalOpen(
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
      setResponseModalOpen("Failed to upload file, please try again.");
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

  useEffect(async () => {
    if (!id) {
      setUser(currentUser);
      setIsCurrentUser(true);
    } else {
      const res = await api_user_info(id ?? "");
      if (!res || !res.user) setIs404(true);
      else {
        setIs404(false);
        setUser(res.user);
        setIsCurrentUser(res.user._id === currentUser._id);
      }
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

  useEffect(() => {
    document.title = `${user.name ?? "Profile"} - Make-a-Wish San Diego`;
  }, [user]);

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
              <button type="button" className="center">
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
                className="modal-container center column"
                isOpen={pfpModalOpen}
                onRequestClose={() => {
                  if (!dragActive) {
                    setPFPModalOpen(false);
                    setCrop({ aspect: 1 });
                  }
                }}
                contentLabel="Change profile picture"
                title="Crop Profile Picture"
              >
                <div className="modal-crop-column">
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
                      className="maw-ui_button fullwidth"
                      onClick={() => setPFPModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <span>&nbsp;</span>
                    <button
                      type="button"
                      className="maw-ui_button primary fullwidth"
                      onClick={() => do_upload()}
                      style={{ opacity }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
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
            <button type="button" className="maw-ui_button" onClick={() => setPassModalOpen(true)}>
              Change Password
            </button>
          )}
          {currentUser && currentUser.admin && (
            <>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <button
                type="button"
                className="maw-ui_button error"
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete Profile
              </button>
            </>
          )}
        </div>
        {/* <div>{isCurrentUser ? <p>Current User</p> : <p>Not Current User</p>}</div> */}
      </section>

      {/* Change Password and Delete Profile Modals */}
      <Modal
        className="profile-change-modal"
        isOpen={passModalOpen}
        onRequestClose={() => setPassModalOpen(false)}
        contentLabel="Change password"
        title="Change Password"
      >
        <form className="change-pass-form" onSubmit={change_password}>
          <input
            className="maw-ui_input"
            placeholder="Enter old password"
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <input
            className="maw-ui_input"
            placeholder="Enter new password"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <input
            className="maw-ui_input"
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

          <br />

          <button type="submit" className="maw-ui_button primary fullwidth">
            Change password
          </button>
        </form>
      </Modal>

      <Modal
        className="thin"
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        contentLabel="Delete Account Modal"
        title=" "
      >
        <br />
        <div className="center">Are you sure you want to delete this profile?</div>
        <br />
        <br />
        <div className="center">
          <button type="button" className="maw-ui_button" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </button>
          <div className="spacer" />
          <button type="button" className="maw-ui_button error" onClick={() => delete_account()}>
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(responseModalOpen)}
        onRequestClose={() => setResponseModalOpen()}
        contentLabel="Response"
        className="thin"
        title="Error"
      >
        <br />
        <div className="center">{responseModalOpen}</div>
        <br />
        <br />
        <div className="center">
          <button
            type="button"
            className="maw-ui_button primary"
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
