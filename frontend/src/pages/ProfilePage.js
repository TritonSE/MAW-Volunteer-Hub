import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactCrop from "react-image-crop";
import Modal from "react-modal";
import "react-image-crop/dist/ReactCrop.css";

import { API_ENDPOINTS } from "../constants/links";
import { api_user, api_pfp_upload } from "../auth";
import { CacheBreaker } from "../components/Contexts";

import "../styles/ProfilePage.css";

Modal.setAppElement(document.getElementById("root"));

function ProfilePage({ isAdmin }) {
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
  const [dragActive, setDragActive] = useState(false);

  const [user, setUser] = useState({});
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  // const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(true); // change this once andrew's pr gets merged in

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

    /*
    const corrected_crop = {
      width: Math.round((crop.width / imgRef.width) * imgRef.naturalWidth),
      height: Math.round((crop.height / imgRef.height) * imgRef.naturalHeight),
      x: Math.round((crop.x / imgRef.width) * imgRef.naturalWidth),
      y: Math.round((crop.y / imgRef.height) * imgRef.naturalHeight),
    };
    */

    const corrected_crop = {
      width: Math.floor((crop.width / 100) * imgRef.naturalWidth),
      height: Math.floor((crop.height / 100) * imgRef.naturalHeight),
      left: Math.floor((crop.x / 100) * imgRef.naturalWidth),
      top: Math.floor((crop.y / 100) * imgRef.naturalHeight),
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

  useEffect(() => {
    window.addEventListener("resize", fix_crop);
    return () => window.removeEventListener("resize", fix_crop);
  }, [imgRef]);

  useEffect(async () => {
    const res = await api_user(id ?? "");
    if (!res || !res.user) navigate("/user-not-found");
    else {
      setUser(res.user);
      setIsCurrentUser(res.sameUser);
    }
  }, [id]);

  return (
    <div className="profile-page">
      <section className="header-section">
        <div className="profile-image">
          <img
            src={`${API_ENDPOINTS.PFP_GET}/${id ?? ""}?cacheBreaker=${cacheBreaker}`}
            alt={`${user.name}'s Profile`}
            style={{ opacity, transition: "opacity 0.3s" }}
          />
          {isCurrentUser && (
            <>
              <button type="button">
                <label htmlFor="pfp_input">
                  +
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
