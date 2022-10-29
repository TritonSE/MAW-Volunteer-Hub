/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "../styles/EditContactModal.css";
import { api_edit_contact_points } from "../api";

function ContactCardInfoSection({ name, phone, index, updateName, updatePhone, modalOpen }) {
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

  useEffect(() => {
    setContactName(name);
    setContactPhone(phone);
  }, [modalOpen]);

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

export default function EditContactModal({
  open,
  setOpen,
  cardDescription,
  contactInput,
  cardId,
  modifiedContent,
}) {
  const NUM_CONTACTS = 4;
  const [description, setDescription] = useState(cardDescription);

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
  const [originalContacts, setOriginalContacts] = useState(initContacts());

  useEffect(() => {
    setDescription(cardDescription);
    setOriginalContacts(contactInput);
  }, [open]);

  // Source: https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
  const deepCopyFunction = (inObject) => {
    let value;
    let key;

    if (typeof inObject !== "object" || inObject === null) {
      return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    const outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
      if (true) {
        value = inObject[key];

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopyFunction(value);
      }
    }
    return outObject;
  };

  const updatedContacts = deepCopyFunction(contactInput);

  // This is the function that will talk to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    const res = await api_edit_contact_points(cardId, description, JSON.stringify(updatedContacts));
    if (!res || res.error) {
      alert("Update Failed");
    } else {
      modifiedContent(true);
    }
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
          placeholder={description ? "Description Goes Here" : null}
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
              modalOpen={open}
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
