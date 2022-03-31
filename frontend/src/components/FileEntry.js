/**
 * Component displaying information about a
 *   specific file or folder, as well as
 *   various actions that can be taken on
 *   each
 */

import React, { useState, useContext } from "react";
import { CurrentUser } from "./Contexts";
import "../styles/FileEntry.css";

function evt_wrapper(func) {
  if (func) return () => func();
  return () => {};
}

function UnmemoizedFileAccordion({ children }) {
  if (!children || children.length === 0)
    children = [<div className="filelisting_no_files">There are no files in this category.</div>];

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
            key={child.props.name ?? child.props.children}
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

function FileButton({ description, image, adminOnly, onClick, className }) {
  const [currentUser] = useContext(CurrentUser);

  function fix_bubbling(e) {
    e.stopPropagation();
    onClick(e);
  }

  if (adminOnly && (!currentUser || !currentUser.admin)) return null;

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

function FileListing({
  name,
  noalternate,
  leftButtonOverride,
  onDownloadFile,
  className,
  onClick,
  style,
  children,
  searchModal = false,
  adminOnly,
}) {
  const [currentUser] = useContext(CurrentUser);

  return (adminOnly && currentUser && currentUser.admin) || !adminOnly ? (
    <div
      className={`filelisting
          ${noalternate ? " no_nth_child" : ""}
          ${onClick !== undefined ? " pointer " : ""}
          ${className !== undefined ? className : ""}
          ${searchModal ? " search-modal" : ""}`}
      onClick={onClick ?? (() => {})}
      style={style !== undefined ? style : {}}
      role="presentation"
    >
      <div className="filelisting_flex_center">
        {leftButtonOverride ?? (
          <FileButton
            description="Download file"
            image="/img/filelisting_download.svg"
            onClick={evt_wrapper(onDownloadFile)}
          />
        )}
        <span className="filelisting_flex_center_name">{name}</span>
      </div>
      <div className="filelisting_flex_center">{children}</div>
    </div>
  ) : null;
}

function FileEntry({ name, onDownloadFile, onEditFile, onDeleteFile, searchModal = false }) {
  return (
    <FileListing name={name} onDownloadFile={onDownloadFile} searchModal={searchModal}>
      <FileButton
        description="Edit file"
        image="/img/filelisting_edit.svg"
        adminOnly
        onClick={evt_wrapper(onEditFile)}
      />
      <FileButton
        description="Delete file"
        image="/img/filelisting_delete.svg"
        adminOnly
        onClick={evt_wrapper(onDeleteFile)}
      />
    </FileListing>
  );
}

function FileCategory({
  name,
  id,
  children,
  onDownloadFile,
  onAddFile,
  onEditCategory,
  onDeleteCategory,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  /*
   * This approach is necessary because every other solution
   *   I tried prevented React's rerendering logic from
   *   playing nice with CSS transitions.
   */
  const hash = id ?? `${name}-${children ? children.length : 0}`;

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
        onDownloadFile={onDownloadFile}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ zIndex: (children ?? []).length + 2 }}
      >
        <FileButton
          description="Add file"
          image="/img/filelisting_add.svg"
          adminOnly
          onClick={evt_wrapper(onAddFile)}
        />
        <FileButton
          description="Edit file"
          image="/img/filelisting_edit.svg"
          adminOnly
          onClick={evt_wrapper(onEditCategory)}
        />
        <FileButton
          description="Delete file"
          image="/img/filelisting_delete.svg"
          adminOnly
          onClick={evt_wrapper(onDeleteCategory)}
        />
        <div className="filelisting_separator" />
        <FileButton
          description="Expand category"
          image="/img/filelisting_chevron.svg"
          onClick={() => setIsExpanded(!isExpanded)}
          className={isExpanded ? "expanded" : "not_expanded"}
        />
      </FileListing>
      <FileAccordion>{children}</FileAccordion>
    </div>
  );
}

export { FileEntry, FileCategory, FileListing, FileButton };
