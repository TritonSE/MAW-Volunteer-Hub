import React, { useState } from "react";
import "../styles/ContactPointCard.css";
import EditContactModal from "./EditContactModal";

function ContactPointCard({ description, contacts }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  /**
   * Input Needed:
   * 1). Step Number
   * 2). Step Title
   * 3). Step Description
   * 4). Contact Points
   */
  // const contactPoints = [
  //   {
  //     Name: "Charlie Lerner",
  //     Extension: "x100",
  //   },
  //   {
  //     Name: "Dharlie Lerner",
  //     Extension: "x101",
  //   },
  //   {
  //     Name: "Eharlie Lerner",
  //     Extension: "x102",
  //   },
  // ];
  const [cardDescription, setCardDescription] = useState(description);
  const [contactList, setContactList] = useState(contacts);
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
        contactInput={[{ name: "James", phone: "x1000" }]}
      />
    </div>
  );
}

export default ContactPointCard;
