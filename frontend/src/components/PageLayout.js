/**
  This page layout component is used to wrap pages for the react router in App.js.
  It currently just puts a navbar at the top of the page.
 */
import React, { useState, useEffect, useMemo } from "react";
import { api_category_all } from "../auth";
import NavBar from "./NavBar";
import { FileStructure } from "./Contexts";

export default function PageLayout({ children }) {
  const [structure, setStructure] = useState({});

  async function get_structure() {
    const res = await api_category_all();
    if (res) setStructure(res);
  }

  useEffect(() => get_structure(), []);

  const fileStructure_memo = useMemo(() => [structure, get_structure], [{}, get_structure]);

  return (
    <div style={{ overflowX: "hidden", height: "100vh" }} id="page-layout">
      <FileStructure.Provider value={fileStructure_memo}>
        <NavBar />
        {children}
      </FileStructure.Provider>
    </div>
  );
}
