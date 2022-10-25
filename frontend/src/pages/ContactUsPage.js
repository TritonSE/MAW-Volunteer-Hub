import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import "../styles/ContactUs.css";
import ContactCard from "../components/ContactCard";
import { api_contacts, api_contacts_add, api_contacts_delete, api_contacts_edit } from "../api";

Modal.setAppElement("#root");

export function ContactUsPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [id, setId] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [contacts, setContacts] = useState([]);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const getContacts = async () => {
    const res = await api_contacts();
    if (!res || res.error) {
      /* TODO */
    } else {
      setContacts(res.users);
    }
  };

  const contactAdd = async (e) => {
    e.preventDefault();

    const res = await api_contacts_add(name, position, org, email, phone);
    if (!res || res.error) {
      /* TODO */
      console.log(res);
    } else {
      setAddOpen(false);
      getContacts();
    }
  };

  const contactEdit = async (delId) => {
    const res = await api_contacts_edit(delId, name, email, phone, org, position);
    console.log(res);
    if (!res || res.error) {
      /* TODO */
      console.log(res);
    } else {
      setEditOpen(false);
      getContacts();
    }
  };

  const contactDelete = async (Id) => {
    const res = await api_contacts_delete(Id);
    setDeleteOpen(false);
    getContacts();
    if (!res || res.error) {
      /* TODO */
      console.log(res);
    } else {
      getContacts();
    }
  };

  useEffect(getContacts, []);

  return (
    <>
      <main>
        <div className="titles">
          <div className="title_Contacts">
            <div>Contacts</div>
            <button type="button" onClick={() => setAddOpen(true)}>
              <img src="/img/add.svg" />
              <div>Add Contact</div>
            </button>
          </div>
          <div />
        </div>
        <div className="Contacts">
          {contacts.map((element) => (
            <ContactCard
              key={element._id}
              Name={element.name}
              Position={element.position}
              Org={element.organization}
              Email={element.email}
              Phone={element.phone}
              Delete={() => {
                setDeleteOpen(true);
                setId(element._id);
              }}
              Edit={() => {
                setEditOpen(true);
                setEditId(element._id);
              }}
            />
          ))}
        </div>
        <div />
      </main>

      <Modal
        isOpen={addOpen}
        onRequestClose={() => setAddOpen(false)}
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
              onClick={() => {
                setAddOpen(false);
              }}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <form onSubmit={contactAdd}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name here"
            />
            <label>Position</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position / role in Organization"
              type="text"
            />
            <label>Organization</label>
            <input
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Organization here"
              type="text"
            />
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address here"
            />
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
            <button type="submit">Add</button>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onRequestClose={() => {
          setId("");
          setDeleteOpen(false);
        }}
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
              onClick={() => {
                setId("");
                setDeleteOpen(false);
              }}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <div className="column">
            Are you sure you want to delete this contact?
            <div className="buttons">
              <button
                type="button"
                onClick={() => {
                  setId("");
                  setDeleteOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  contactDelete(id);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={editOpen}
        onRequestClose={() => {
          setEditId("");
          setEditOpen(false);
        }}
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
              onClick={() => {
                setEditId("");
                setEditOpen(false);
              }}
            >
              <img src="/img/wishgranting_modal_close.svg" alt="Close modal" />
            </button>
          </div>
          <form>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=" Full Name here"
            />
            <label>Position</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position / role in organization"
              type="text"
            />
            <label>Organization</label>
            <input
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Organization here"
              type="text"
            />
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email here"
            />
            <label>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
            />
            <button
              type="submit"
              onClick={() => {
                console.log(id);
                contactEdit(editId);
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
