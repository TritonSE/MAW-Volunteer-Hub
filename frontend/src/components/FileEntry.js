/* eslint no-alert: "off" */

/**
 * Component displaying information about a
 *   specific file or folder, as well as
 *   various actions that can be taken on
 *   each
 */

import React, { useState } from "react";
import "../styles/FileEntry.css";

function UnmemoizedFileAccordion({ children }) {
  if (!children) children = [<div>There are no files in this category.</div>];

  function compute_top(i) {
    return (i + 1) * 60 + "px";
  }

  return (
    <div
      className="filelisting_accordion_parent"
      style={{ height: `calc(60px + (var(--is-expanded) * ${compute_top(children.length - 1)}))` }}
    >
      <div className="filelisting_accordion">
        {children.map((child, i) => (
          <div
            key={Math.random()}
            className={`filelisting_accordion_entry${i % 2 === 1 ? " is_odd" : ""}`}
            style={{
              top: `calc(var(--is-expanded) * ${compute_top(i)})`,
              zIndex: children.length - i,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
const FileAccordion = React.memo(UnmemoizedFileAccordion);

function FileButton({ description, image, onClick, className }) {
  function fix_bubbling(e) {
    e.stopPropagation();
    onClick(e);
  }

  return (
    <button
      type="button"
      className={`filelisting_button ${className ?? ""}`}
      onClick={fix_bubbling}
    >
      <img alt={description} src={image} />
    </button>
  );
}

function FileListing({ name, noalternate, onClick, style, children, searchModal = false }) {
  return (
    <div
      className={`filelisting
        ${noalternate ? " no_nth_child" : ""}
        ${onClick !== undefined ? " pointer" : ""}
        ${searchModal ? " search-modal" : ""}`}
      onClick={onClick ?? (() => {})}
      style={style !== undefined ? style : {}}
      role="presentation"
    >
      <div className="filelisting_flex_center">
        <FileButton
          description="Download file"
          image="img/filelisting_download.svg"
          onClick={() => {
            alert("Download file clicked.");
          }}
        />
        {name}
      </div>
      <div className="filelisting_flex_center">{children}</div>
    </div>
  );
}

function FileEntry({ name, searchModal = false }) {
  return (
    <FileListing name={name} searchModal={searchModal}>
      <FileButton
        description="Edit file"
        image="img/filelisting_edit.svg"
        onClick={() => {
          alert("Edit file clicked.");
        }}
      />
      <FileButton
        description="Delete file"
        image="img/filelisting_delete.svg"
        onClick={() => {
          alert("Delete file clicked.");
        }}
      />
    </FileListing>
  );
}

function FileCategory({ name, children }) {
  const [isExpanded, setIsExpanded] = useState(true);

  /*
   * This approach is necessary because every other solution
   *   I tried prevented React's rerendering logic from
   *   playing nice with CSS transitions.
   */
  const hash = `${name}-${children ? children.length : 0}`;

  return (
    <div className={`filelisting_folder ${hash}`}>
      <style>
        {`
          .${hash} {
            --is-expanded: ${isExpanded + 0};
          }
        `}
      </style>
      <FileListing
        name={name}
        noalternate
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ zIndex: (children ?? []).length + 2 }}
      >
        <FileButton
          description="Add file"
          image="img/filelisting_add.svg"
          onClick={() => {
            alert("Add file clicked.");
          }}
        />
        <FileButton
          description="Edit file"
          image="img/filelisting_edit.svg"
          onClick={() => {
            alert("Edit file clicked.");
          }}
        />
        <FileButton
          description="Delete file"
          image="img/filelisting_delete.svg"
          onClick={() => {
            alert("Delete file clicked.");
          }}
        />
        <div className="filelisting_separator" />
        <FileButton
          description="Expand category"
          image="img/filelisting_chevron.svg"
          onClick={() => setIsExpanded(!isExpanded)}
          className={isExpanded ? "expanded" : "not_expanded"}
        />
      </FileListing>
      <FileAccordion>{children}</FileAccordion>
    </div>
  );
}

export { FileEntry, FileCategory };
