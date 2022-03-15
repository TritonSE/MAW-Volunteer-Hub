/**
  This page layout component is used to wrap pages for the react router in App.js.
  It currently just puts a navbar at the top of the page.
 */
import React, { useState, useEffect, useMemo } from "react";
import { api_category_all } from "../api";
import NavBar from "./NavBar";
import FileStructure from "./FileStructure";

export default function PageLayout({ isAdmin, children }) {
  const [structure, setStructure] = useState({});

  async function get_structure() {
    const res = await api_category_all();
    if (res) setStructure(res);
  }

  useEffect(() => get_structure(), []);

  const memo = useMemo(() => [structure, get_structure], [{}, get_structure]);

  return (
    <FileStructure.Provider value={memo}>
      <NavBar isAdmin={isAdmin} />
      {children}
    </FileStructure.Provider>
  );
}
