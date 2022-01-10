/**
  This page layout component is used to wrap pages for the react router in App.js.
  It currently just puts a navbar at the top of the page.
 */
import React from "react";
import NavBar from "./NavBar.js";

export default function PageLayout({ children }) {
  return (
    <div style={{ overflowX: "hidden", height: "100vh" }} id="page-layout">
      <NavBar />
      {children}
    </div>
  );
}
