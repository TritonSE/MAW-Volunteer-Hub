import "../styles/ContactCard.css";
import React from "react";

function ContactCard(name, position, organization, email, phone) {
  return (
    <div>
      <main>
        <div className="contact_card">
          <button type="submit">
            <img className="edit" src="/img/edit_icon2.svg" />
          </button>
          <button type="submit">
            <img className="delete" src="/img/delete_icon2.svg" />
          </button>
          <div className="card_back" />
          <img src="/img/contact_icon.svg" className="contact_icon" />
          <div className="card_name"> Charlie Lerner</div>
          <div className="grid1">
            <div>Vice President</div>
            <div>Helping Cats</div>
          </div>
          <div className="grid2">
            <div>
              <a href="mailto:clearner@sandiego.wish.org">clearner@sandiego.wish.org</a>
            </div>
            <div>(858) 707-9470 x100</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactCard;
