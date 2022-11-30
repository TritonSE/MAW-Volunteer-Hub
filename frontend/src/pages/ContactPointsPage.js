import React, { useEffect, useState, useContext } from "react";

import Custom404Page from "./Custom404Page";
import { api_get_contact_points } from "../api";

import { CurrentUser } from "../components/Contexts";
import ContactPointCard from "../components/ContactPointCard";

import "../styles/ContactPointsPage.css";

export default function ContactPointsPage() {
  const [contactPoints, setContactPoints] = useState({});
  const [modifiedContent, setModifiedContent] = useState(false);
  const [gotContactInfo, setGotContactInfo] = useState(false);
  const [is404, setIs404] = useState(false);
  const [currentUser, setCurrentUser] = useContext(CurrentUser);

  useEffect(() => {
    async function handleContactPointInfo() {
      const res = await api_get_contact_points();
      if (!res) setIs404(true);
      else {
        setIs404(false);
        const resArr = res.map((contact) => contact);
        setContactPoints(resArr);
        setGotContactInfo(true);
        setModifiedContent(false);
      }
    }
    if (!gotContactInfo || modifiedContent) {
      handleContactPointInfo();
    }
  }, [modifiedContent]);

  return is404 ? (
    <Custom404Page />
  ) : (
    <div className="contactpoints_page_layout">
      <h2 className="contactpoints_title">Contact Points</h2>
      <div className="contactpoints_container">
        {gotContactInfo
          ? contactPoints?.map((contact, idx) => (
              <ContactPointCard
                idx={idx + 1}
                key={Math.random()}
                step={contact.wishStep}
                id={contact._id}
                description={contact.description}
                contacts={contact.contacts}
                setModifiedContent={setModifiedContent}
                admin={currentUser.admin}
              />
            ))
          : null}
      </div>
    </div>
  );
}
