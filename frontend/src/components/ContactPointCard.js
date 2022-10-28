import React, { useState, useEffect } from "react";
import "../styles/ContactPointCard.css";
import EditContactModal from "./EditContactModal";

function ContactPointCard({ description, contacts, id }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  /**
   * Input Needed:
   * 1). Step Number
   * 2). Step Title
   * 3). Step Description
   * 4). Contact Points
   */
  const [cardDescription, setCardDescription] = useState(description);
  const [contactList, setContactList] = useState(contacts);

  useEffect(() => {
    setCardDescription(description);
    setContactList(contacts);
  }, [editModalOpen]);

  return (
    <div className="conptcard_background">
      <div className="conptcard_header">
        <div className="conptcard_step_num">1</div>
        <button className="edit-button" type="button" onClick={() => setEditModalOpen(true)}>
          <img src="img/edit_icon.svg" alt="edit" style={{ height: "20px" }} />
        </button>
      </div>
      <div className="conptcard_body">
        <h3 className="conptcard_title">Wish Discovery</h3>
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
      />
    </div>
  );
}

export default ContactPointCard;
