import React from "react";
import { FileEntry, FileCategory } from "../components/FileEntry";

function WishGrantingPage() {
  /*
   * Note: Manual style on background is just for
   *   demo purposes (otherwise every other file
   *   entry would blend into the white background)
   */

  return (
    <div style={{ background: "#f7f7f7" }}>
      <h1>Wish Granting</h1>
      <div>
        <FileCategory name="Category">
          <FileEntry name="File Name" />
          <FileEntry name="File Name" />
          <FileEntry name="File Name" />
          <FileEntry name="File Name" />
        </FileCategory>
        <FileCategory name="Category" />
      </div>
      <br />
    </div>
  );
}

export default WishGrantingPage;
