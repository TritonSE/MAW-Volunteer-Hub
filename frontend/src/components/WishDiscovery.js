import React from "react";
import { FileEntry, FileCategory } from "./FileEntry";

function WishDiscovery() {
  return (
    <div>
      <FileCategory name="Category">
        <FileEntry name="File Name" />
        <FileEntry name="File Name" />
        <FileEntry name="File Name" />
        <FileEntry name="File Name" />
      </FileCategory>
      <FileCategory name="Category" />
    </div>
  );
}

export default WishDiscovery;
