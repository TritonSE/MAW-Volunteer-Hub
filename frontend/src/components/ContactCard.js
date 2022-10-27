import "../styles/ContactCard.css";
import React from "react";
import { API_ENDPOINTS } from "../constants/links";

function ContactCard({
  id,
  name,
  position,
  org,
  email,
  phone,
  handleDelete,
  handleEdit,
  profilePictureModified,
}) {
  const mailto = "mailto:" + email;
  return (
    <div>
      <main>
        <div className="contact_card">
          <button type="button" onClick={() => handleEdit()}>
            <img className="edit" src="/img/edit_icon2.svg" />
          </button>
          <button className="delete" type="button" onClick={() => handleDelete()}>
            <img src="/img/delete_icon2.svg" />
          </button>
          <div className="card_back" />
          <img
            alt={`${name}'s Profile Picture`}
            src={
              id
                ? `${API_ENDPOINTS.CONTACTS_PFP_GET}/${id}/${new Date(
                    profilePictureModified
                  ).getTime()}`
                : "/img/contact_icon.svg"
            }
            className="contact_icon"
          />
          <div className="card_name">{name}</div>
          <div className="position" id="pos1">
            {position}
          </div>
          <div className="position">{org}</div>
          <div className="info" id="info1">
            <a href={mailto}>{email}</a>
          </div>
          <div className="info">{phone}</div>
        </div>
      </main>
    </div>
  );
}

export default ContactCard;
