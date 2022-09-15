import React, { useEffect, useState } from "react";
import "../styles/ContactUs.css";
import ContactCard from "../components/ContactCard";
import { api_contacts } from "../api";

export function ContactUsPage() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    api_contacts().then((res, temp = []) => {
      res.users.forEach((element) => {
        temp.push(
          <ContactCard
            key={element._id}
            Name={element.name}
            Position={element.position}
            Org={element.organization}
            Email={element.email}
            Phone={element.phone}
          />
        );
      });
      setContacts(temp);
    });
  }, []);

  return (
    <main>
      <div className="titles">
        <div className="title_Contacts">
          <div>Contacts</div>
          <button type="submit">
            <img src="/img/add.svg" />
            <div>Add Contact</div>
          </button>
        </div>
        <div />
      </div>
      <div className="Contacts">
        {contacts.map((card) => (
          <div>{card}</div>
        ))}
      </div>
      <div />
    </main>
  );
}
