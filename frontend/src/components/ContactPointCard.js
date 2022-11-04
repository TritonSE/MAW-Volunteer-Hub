import React, { useState, useEffect } from "react";
import "../styles/ContactPointCard.css";
import EditContactModal from "./EditContactModal";

function ContactPointCard({ idx, step, description, contacts, id, setModifiedContent, admin }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [cardDescription, setCardDescription] = useState(description);
  const [contactList, setContactList] = useState(contacts);

  useEffect(() => {
    setCardDescription(description);
    setContactList(contacts);
  }, [editModalOpen]);

  return (
    <div className="conptcard_background">
      <div className="conptcard_header">
        <div className="conptcard_step_num">{idx}</div>
        {admin > 0 ? (
          <button className="edit-button" type="button" onClick={() => setEditModalOpen(true)}>
            <img src="img/edit_icon.svg" alt="edit" style={{ height: "20px" }} />
          </button>
        ) : null}
      </div>
      <div className="conptcard_body">
        <h3 className="conptcard_title">{step}</h3>
        <p className="conptcard_description">{cardDescription}</p>
      </div>
      <div className="conptrcard_links">
        {contactList.map((contact) => (
          <div className="contact_info" key={Math.random()}>
            <a href="/">
              {contact.name} {contact.phone}{" "}
            </a>
          </div>
        ))}
      </div>
      <EditContactModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        cardDescription={cardDescription}
        contactInput={contactList}
        cardId={id}
        modifiedContent={setModifiedContent}
      />
    </div>
  );
}

export default ContactPointCard;
