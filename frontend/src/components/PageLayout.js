/**
  This page layout component is used to wrap pages for the react router in App.js.
  It currently just puts a navbar at the top of the page.
 */
import React, { useState, useEffect, useMemo } from "react";
import { api_category_all } from "../api";
import NavBar from "./NavBar";
import ModalVariants from "./ModalVariants";
import { FileStructure, ModalVariantsManager } from "./Contexts";

export default function PageLayout({ children }) {
  const [structure, setStructure] = useState({});

  async function get_structure() {
    const res = await api_category_all();
    if (res) setStructure(res);
  }

  useEffect(() => get_structure(), []);

  const fileStructure_memo = useMemo(() => [structure, get_structure], [{}, get_structure]);

  /*
   * MODAL VARIANT PROPS
   */
  const modalVariant = useState();
  const open = useState(false);
  const errorMessage = useState();
  const progress = useState();
  const name = useState("");
  const activeListing = useState();
  const categoryParent = useState();

  const modal_variant_props = useMemo(
    () => ({
      modalVariant,
      open,
      errorMessage,
      progress,
      name,
      activeListing,
      categoryParent,
    }),
    [
      modalVariant[0],
      open[0],
      errorMessage[0],
      progress[0],
      name[0],
      activeListing[0],
      categoryParent[0],
    ]
  );

  return (
    <div style={{ overflowX: "hidden", height: "100vh" }} id="page-layout">
      <FileStructure.Provider value={fileStructure_memo}>
        <ModalVariantsManager.Provider value={modal_variant_props}>
          <NavBar />
          {children}
          <ModalVariants />
        </ModalVariantsManager.Provider>
      </FileStructure.Provider>
    </div>
  );
}
