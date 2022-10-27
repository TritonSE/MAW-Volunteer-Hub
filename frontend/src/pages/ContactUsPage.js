import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles/ContactUs.css";
import ReactCrop from "react-image-crop";
import ContactCard from "../components/ContactCard";
import { api_contacts, api_contacts_add, api_contacts_delete, api_contacts_edit } from "../api";

import "react-image-crop/dist/ReactCrop.css";

Modal.setAppElement("#root");

export function ContactUsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [contacts, setContacts] = useState([]);

  /* For PFP */
  const [pfpModalOpen, setPFPModalOpen] = useState(false);
  const [pfpErrorModalOpen, setPFPErrorModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [upImg, setUpImg] = useState();
  const [file, setFile] = useState();
  const [imgRef, setImgRef] = useState();
  const [dragActive, setDragActive] = useState(false);

  async function do_upload() {
    setPFPModalOpen(false);
  }

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
  useEffect(() => {
    window.addEventListener("resize", fix_crop);
    return () => window.removeEventListener("resize", fix_crop);
  }, [imgRef]);

  // useEffect(() => {
  //   if (!responseModalOpen) {
  //     if (shouldRedirect === 1) {
  //       navigate("/");
  //       location.reload();
  //     } else if (shouldRedirect === -1) {
  //       setDeleteModalOpen(true);
  //     }
  //   }
  // }, [responseModalOpen]);

  const [modalProps, setModalProps] = useState({
    name: "",
    position: "",
    org: "",
    email: "",
    phone: "",
  });

  const setModalOrg = (org) => {
    setModalProps({ ...modalProps, org });
  };
  const setModalPos = (position) => {
    setModalProps({ ...modalProps, position });
  };
  const setModalName = (name) => {
    setModalProps({ ...modalProps, name });
  };
  const setModalEmail = (email) => {
    setModalProps({ ...modalProps, email });
  };
  const setModalPhone = (phone) => {
    setModalProps({ ...modalProps, phone });
  };

  const getContacts = async () => {
    const res = await api_contacts();
    if (!res || res.error) {
      /* TODO */
    } else {
      setContacts(res.users);
    }
  };

  const handleAddModalOpen = () => {
    // clears modal props and opens modal
    setModalProps({
      name: "",
      position: "",
      org: "",
      email: "",
      phone: "",
      file: null,
      crop: { aspect: 1 },
    });
    setAddOpen(true);
  };

  const handleEditModalOpen = (id) => {
    // clears modal props and opens modal
    const contact = contacts.find((e) => e._id === id);

    if (!contact) {
      return;
    }

    setModalProps({
      name: contact.name,
      position: contact.position,
      org: contact.organization,
      email: contact.email,
      phone: contact.phone,
    });

    setEditId(id);
    setEditOpen(true);
  };

  const handleDeleteModalOpen = (id) => {
    // clears modal props and opens modal
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleModalClose = () => {
    // clears modal props and opens modal
    setDeleteId("");
    setEditId("");

    setModalProps({
      name: "",
      position: "",
      org: "",
      email: "",
      phone: "",
    });

    setAddOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setPFPModalOpen(false);
    setPFPErrorModalOpen(false);
    setCrop({ aspect: 1 });
    setUpImg();
    setFile();
    setImgRef();
  };

  const contactAdd = async (e) => {
    e.preventDefault();
    setOpacity(0.5);

    const corrected_crop = imgRef
      ? {
          width: Math.floor((crop.width / 100) * imgRef.naturalWidth),
          height: Math.floor((crop.height / 100) * imgRef.naturalHeight),
          left: Math.floor((crop.x / 100) * imgRef.naturalWidth),
          top: Math.floor((crop.y / 100) * imgRef.naturalHeight),
        }
      : null;

    const res = await api_contacts_add(
      modalProps.name,
      modalProps.position,
      modalProps.org,
      modalProps.email,
      modalProps.phone,
      file,
      imgRef ? JSON.stringify(corrected_crop) : null
    );
    if (!res || res.error) {
      /* TODO */
      setPFPErrorModalOpen("Failed to upload file, please try again.");
    } else {
      setAddOpen(false);
      getContacts();
    }
    setOpacity(1);
    setPFPModalOpen(false);
    setCrop({ aspect: 1 });
    handleModalClose();
  };

  const contactEdit = async (e, delId) => {
    e.preventDefault();
    if (imgRef && file) {
      const corrected_crop = {
        width: Math.floor((crop.width / 100) * imgRef.naturalWidth),
        height: Math.floor((crop.height / 100) * imgRef.naturalHeight),
        left: Math.floor((crop.x / 100) * imgRef.naturalWidth),
        top: Math.floor((crop.y / 100) * imgRef.naturalHeight),
      };
      const res = await api_contacts_edit(
        delId,
        modalProps.name,
        modalProps.email,
        modalProps.phone,
        modalProps.org,
        modalProps.position,
        file,
        JSON.stringify(corrected_crop)
      );
      if (!res || res.error) {
        /* TODO */
      } else {
        setEditOpen(false);
        getContacts();
      }
    } else {
      const res = await api_contacts_edit(
        delId,
        modalProps.name,
        modalProps.email,
        modalProps.phone,
        modalProps.org,
        modalProps.position
      );
      if (!res || res.error) {
        /* TODO */
      } else {
        setEditOpen(false);
        getContacts();
      }
    }
    handleModalClose();
  };

  const contactDelete = async (id) => {
    const res = await api_contacts_delete(id);
    setDeleteOpen(false);
    getContacts();
    if (!res || res.error) {
      /* TODO */
    } else {
      getContacts();
    }
    handleModalClose();
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <>
      <main>
        <div className="titles">
          <div className="title_contacts">
            <div>Contacts</div>
            <button type="button" onClick={() => handleAddModalOpen()}>
              <img src="/img/add.svg" />
              <div>Add Contact</div>
            </button>
          </div>
          <div />
        </div>
        <div className="contacts">
          {contacts.map((element) => (
            <ContactCard
              key={element._id}
              id={element._id}
              name={element.name}
              position={element.position}
              org={element.organization}
              email={element.email}
              phone={element.phone}
              handleDelete={() => {
                setDeleteOpen(true);
                setDeleteId(element._id);
              }}
              handleEdit={() => handleEditModalOpen(element._id)}
              profilePictureModified={element.profilePictureModified}
            />
          ))}
        </div>
        <div />
      </main>

      <Modal
        isOpen={addOpen}
        onRequestClose={() => handleModalClose()}
        contentLabel="Add Contact"
        className="contact_react_modal"
        overlayClassName="contact_react_modal"
      >
        <div className="contact_modal">
          <div className="contact_modal_header">
            <h3>Add Contact</h3>
            <button
              type="button"
              className="contact_modal_close"
              onClick={() => handleModalClose()}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <form onSubmit={contactAdd}>
            <button className="upload_image_button" type="button">
              <label htmlFor="pfp_input">
                Upload Image
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
            <p className="upload_image_status_text">{file ? `${file.name}` : ""}</p>
            <br />
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

            <label>Name</label>
            <input
              type="text"
              value={modalProps.name}
              onChange={(e) => setModalName(e.target.value)}
              placeholder="Full Name here"
              required
            />
            <label>Position</label>
            <input
              value={modalProps.position}
              onChange={(e) => setModalPos(e.target.value)}
              placeholder="Position / role in Organization"
              type="text"
              required
            />
            <label>Organization</label>
            <input
              value={modalProps.org}
              onChange={(e) => setModalOrg(e.target.value)}
              placeholder="Organization here"
              type="text"
              required
            />
            <label>Email</label>
            <input
              type="email"
              value={modalProps.email}
              onChange={(e) => setModalEmail(e.target.value)}
              placeholder="Email address here"
              required
            />
            <label>Phone</label>
            <input
              type="text"
              value={modalProps.phone}
              onChange={(e) => setModalPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onRequestClose={() => handleModalClose()}
        contentLabel="DeleteContact"
        className="contact_react_modal"
        overlayClassName="contact_react_modal"
      >
        <div className="contact_modal">
          <div className="contact_modal_header">
            <h3>Delete Contact</h3>
            <button
              type="button"
              className="contact_modal_close"
              onClick={() => handleModalClose()}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="delete_modal_body">
            Are you sure you want to delete this contact?
            <div className="delete_modal_button_container">
              <button type="button" onClick={() => handleModalClose()}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  contactDelete(deleteId);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={editOpen}
        onRequestClose={() => handleModalClose()}
        contentLabel="Edit Contact"
        className="contact_react_modal"
        overlayClassName="contact_react_modal"
      >
        <div className="contact_modal">
          <div className="contact_modal_header">
            <h3>Edit Contact</h3>
            <button
              type="button"
              className="contact_modal_close"
              onClick={() => handleModalClose()}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <form>
            <button className="upload_image_button" type="button">
              <label htmlFor="pfp_input">
                Edit Image
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
            <p className="upload_image_status_text">
              {file ? `${file.name}` : "Using current image"}
            </p>
            <br />
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
            <label>Name</label>
            <input
              type="text"
              value={modalProps.name}
              onChange={(e) => setModalName(e.target.value)}
              placeholder="Full Name here"
              required
            />
            <label>Position</label>
            <input
              value={modalProps.position}
              onChange={(e) => setModalPos(e.target.value)}
              placeholder="Position / role in organization"
              type="text"
              required
            />
            <label>Organization</label>
            <input
              value={modalProps.org}
              onChange={(e) => setModalOrg(e.target.value)}
              placeholder="Organization here"
              type="text"
              required
            />
            <label>Email</label>
            <input
              type="email"
              value={modalProps.email}
              onChange={(e) => setModalEmail(e.target.value)}
              placeholder="Email here"
              required
            />
            <label>Phone</label>
            <input
              type="text"
              value={modalProps.phone}
              onChange={(e) => setModalPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />
            <button
              type="submit"
              onClick={(e) => {
                contactEdit(e, editId);
              }}
            >
              Edit
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}
