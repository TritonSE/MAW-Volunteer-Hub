/**
  This page layout component is used to wrap pages for the react router in App.js.
  It currently just puts a navbar at the top of the page.
 */
import React, { useState, useEffect, useMemo } from "react";
import { api_category_all } from "../auth";
import NavBar from "./NavBar";
import { FileStructure, CacheBreaker } from "./Contexts";

export default function PageLayout({ isAdmin, children }) {
  const [structure, setStructure] = useState({});

  async function get_structure() {
    const res = await api_category_all();
    if (res) setStructure(res);
  }

  useEffect(() => get_structure(), []);

  const memo = useMemo(() => [structure, get_structure], [{}, get_structure]);
  const breaker = useState(0);

  return (
    <div style={{ overflowX: "hidden", height: "100vh" }} id="page-layout">
      <FileStructure.Provider value={memo}>
        <CacheBreaker.Provider value={breaker}>
          <NavBar isAdmin={isAdmin} />
          {children}
        </CacheBreaker.Provider>
      </FileStructure.Provider>
    </div>
  );
}
