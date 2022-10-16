import React from "react";
import "../styles/ContactPointCard.css";

function ContactPointCard() {
  /**
   * Input Needed:
   * 1). Step Number
   * 2). Step Title
   * 3). Step Description
   * 4). Contact Points
   */
  const contactPoints = [
    {
      Name: "Charlie Lerner",
      Extension: "x100",
    },
    {
      Name: "Dharlie Lerner",
      Extension: "x101",
    },
    {
      Name: "Eharlie Lerner",
      Extension: "x102",
    },
  ];
  return (
    <div className="conptcard_background">
      <div className="conptcard_header">
        <div className="conptcard_step_num">1</div>
        <button className="edit-button" type="submit">
          <img src="img/edit_icon.svg" alt="edit" style={{ height: "20px" }} />
        </button>
      </div>
      <div className="conptcard_body">
        <h3 className="conptcard_title">Wish Discovery</h3>
        <p className="conptcard_description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id sed nibh orci condimentum
          blandit. Feugiat viverra quam ornare venenatis in odio mi.
        </p>
      </div>
      <div className="conptrcard_links">
        {contactPoints.map((contact) => (
          <div className="contact_info" key={Math.random()}>
            <a href="/">
              {contact.Name} {contact.Extension}{" "}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContactPointCard;
