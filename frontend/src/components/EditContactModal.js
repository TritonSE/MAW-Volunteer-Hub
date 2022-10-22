import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../styles/EditContactModal.css";

function ContactCardInfoSection({ name, phone, index, submit, setSubmit }) {
  const [contactName, setContactName] = useState(name);
  const [contactPhone, setContactPhone] = useState(phone);

  useEffect(() => {
    if (submit) {
      console.log("ContactName" + (index + 1) + ": " + contactName);
      console.log("ContactPhone" + (index + 1) + ": " + contactPhone);
      setSubmit(false);
    }
  }, [submit]);

  return (
    <div className="contact_card_info">
      <div className="name_info_label">Contact {index + 1}</div>
      <input
        className="contact_name_info"
        placeholder="Full name here"
        value={contactName}
        onChange={(e) => {
          setContactName(e.target.value);
        }}
      />
      <div className="phone_info_label">Phone Extension {index + 1}</div>
      <input
        className="contact_phone_info"
        placeholder="Position / role in organization"
        value={contactPhone}
        onChange={(e) => {
          setContactPhone(e.target.value);
        }}
      />
    </div>
  );
}

export default function EditContactModal({ open, setOpen, contactInput }) {
  /**
   * Input Needed:
   * 1). Contact Information
   */
  const NUM_CONTACTS = 4;
  const [submitValues, setSubmitValues] = useState(false);

  function initContacts() {
    const res = contactInput;
    while (res.length < NUM_CONTACTS) {
      res.push({
        name: "",
        phone: "",
      });
    }
    return res;
  }

  const contacts = initContacts();

  function closeModal() {
    setOpen(false);
    setSubmitValues(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitValues(true);
    setOpen(false);
  }

  return (
    <Modal
      className="edit_contacts_modal"
      overlayClassName="maw-ui_modal-overlay"
      isOpen={open}
      onRequestClose={() => closeModal()}
      contentLabel="Add Contacts Modal"
    >
      <form className="add_contacts_form" onSubmit={(e) => handleSubmit(e)}>
        <div className="edit_contacts_header">
          <div className="edit_contacts_title">Edit Contact Card</div>
          <button
            className="contacts_close_button"
            aria-label="contacts_close_button"
            type="button"
            onClick={() => closeModal()}
          />
        </div>
        <input
          className="contact_card_description"
          type="text"
          placeholder="Contact Card Description Here"
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />

        <div className="contact_card_main_section">
          {contacts.map((contact, i) => (
            <ContactCardInfoSection
              key={Math.random()}
              name={contact.name}
              phone={contact.phone}
              index={i}
              submit={submitValues}
              setSubmit={setSubmitValues}
            />
          ))}
        </div>
        <button className="maw-ui_button edit_contact_modal" type="submit">
          Add
        </button>
      </form>
    </Modal>
  );
}
