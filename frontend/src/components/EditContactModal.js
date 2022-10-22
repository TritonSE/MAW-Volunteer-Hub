import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/EditContactModal.css";

function ContactCardInfoSection({ name, phone, index, updateName, updatePhone }) {
  const [contactName, setContactName] = useState(name);
  const [contactPhone, setContactPhone] = useState(phone);

  const handleContactChange = (nameVal) => {
    setContactName(nameVal);
    updateName(nameVal, index);
  };

  const handlePhoneChange = (phoneVal) => {
    setContactPhone(phoneVal);
    updatePhone(phoneVal, index);
  };

  return (
    <div className="contact_card_info">
      <div className="name_info_label">Contact {index + 1}</div>
      <input
        className="contact_name_info"
        placeholder="Full name here"
        value={contactName}
        onChange={(e) => {
          handleContactChange(e.target.value);
        }}
      />
      <div className="phone_info_label">Phone Extension {index + 1}</div>
      <input
        className="contact_phone_info"
        placeholder="Position / role in organization"
        value={contactPhone}
        onChange={(e) => {
          handlePhoneChange(e.target.value);
        }}
      />
    </div>
  );
}

export default function EditContactModal({ open, setOpen, contactInput }) {
  const NUM_CONTACTS = 4;
  const [description, setDescription] = useState("");

  // Fills in blanks for empty contacts
  const initContacts = () => {
    const res = contactInput;
    while (res.length < NUM_CONTACTS) {
      res.push({
        name: "",
        phone: "",
      });
    }
    return res;
  };

  const originalContacts = initContacts();
  const updatedContacts = originalContacts;

  // This is the function that will talk to the backend
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Description: " + description);
    for (let i = 0; i < updatedContacts.length; i++) {
      console.log(updatedContacts[i].name + " " + updatedContacts[i].phone);
    }
    setOpen(false);
  };

  // Callbacks
  const updateName = (nameVal, index) => {
    updatedContacts[index].name = nameVal;
  };

  const updatePhone = (phoneVal, index) => {
    updatedContacts[index].phone = phoneVal;
  };

  return (
    <Modal
      className="edit_contacts_modal"
      overlayClassName="maw-ui_modal-overlay"
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      contentLabel="Add Contacts Modal"
    >
      <form className="add_contacts_form" onSubmit={(e) => handleSubmit(e)}>
        <div className="edit_contacts_header">
          <div className="edit_contacts_title">Edit Contact Card</div>
          <button
            className="contacts_close_button"
            aria-label="contacts_close_button"
            type="button"
            onClick={() => setOpen(false)}
          />
        </div>
        <input
          className="contact_card_description"
          type="text"
          placeholder="Contact Card Description Here"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <div className="contact_card_main_section">
          {originalContacts.map((contact, i) => (
            <ContactCardInfoSection
              key={Math.random()}
              name={contact.name}
              phone={contact.phone}
              index={i}
              updateName={updateName}
              updatePhone={updatePhone}
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
