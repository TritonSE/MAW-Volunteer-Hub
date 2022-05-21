/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTable } from "react-table";
import Modal from "react-modal";
import { api_add_event, api_edit_event, api_delete_event } from "../auth";

import "../styles/ProfileActivities.css";

const dateStart = 0;
const dateEnd = 10;

// Formats the date
const formatDate = (original) => {
  const trimmed = original.substring(dateStart, dateEnd);
  const vals = trimmed.split("-");
  const YEAR = 0;
  const MONTH = 1;
  const DAY = 2;

  return vals[MONTH] + "/" + vals[DAY] + "/" + vals[YEAR];
};

const columns = [
  {
    Header: "Date",
    accessor: "date",
    Cell: (props) => <div>{formatDate(props.cell.value)}</div>,
  },
  {
    Header: "Event",
    accessor: "title",
  },
  {
    Header: "Hours",
    accessor: "hours",
  },
  {
    Header: "",
    accessor: "edit",
    Cell: (props) => (
      <div className="edit_activity_container">
        <button type="button" onClick={() => props.editActivity(props.cell.row)}>
          <img src="/img/filelisting_edit.svg" alt="" />
        </button>
        <button type="button" onClick={() => props.deleteActivity(props.cell.row)}>
          <img src="/img/filelisting_delete.svg" alt="" />
        </button>
      </div>
    ),
  },
];

export default function ProfileActivities(props) {
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [activityDate, setActivityDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [editing, setEditing] = useState(false);
  const [currActivity, setCurrActivity] = useState({});

  const data = React.useMemo(() => props.events, [props.events]);
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const getHeaderSuffix = (colIndex) => {
    if (colIndex === 0) {
      return "start";
    }
    if (colIndex === columns.length - 1) {
      return "end";
    }
    return "";
  };

  // Closes modal
  function closeModal() {
    setEditing(false);
    setLogModalOpen(false);
  }

  // Clears all values that are displayed on the add/edit activity form
  function clearFields() {
    setActivityDate("");
    setEventName("");
    setEventDuration(0);
  }

  // Adds an activity
  function logActivity(e) {
    e.preventDefault();
    api_add_event(props.id, activityDate, eventName, eventDuration).then((res) => {
      // console.log(res.success === true);
    });

    // Call back to ProfilePage.js
    props.updateEvents(true);

    // Clean up
    closeModal();
    clearFields();
  }

  // Begin the activity editing process
  function startEditActivity(activity) {
    // Change to editing mode
    setEditing(true);
    setLogModalOpen(true);

    setCurrActivity(activity);

    // Set fields of edit activity form
    setEventName(activity.original.title);
    setEventDuration(activity.original.hours);
    setActivityDate(activity.original.date.substring(dateStart, dateEnd));
  }

  // Makes an API call to update an activity.
  function updateActivity(e) {
    e.preventDefault();
    api_edit_event(
      props.id,
      currActivity.original._id,
      activityDate,
      eventName,
      eventDuration
    ).then((res) => {
      // console.log(res.success === true);
    });

    // Call back to ProfilePage.js to fetch new user data.
    props.updateEvents(true);

    // Clean up
    closeModal();
    clearFields();
  }

  function deleteActivity(activity) {
    api_delete_event(props.id, activity.original._id).then((res) => {
      // console.log(res);
    });

    props.updateEvents(true);
  }

  return (
    <div>
      <div className="header_container">
        <h2>Activity Log</h2>
        <div className="manually_log_activity">
          <h2>Manually Log Activity</h2>
          {props.admin ? (
            <div />
          ) : (
            <button type="button" className="add_roles" onClick={() => setLogModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <table className="activities_table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, colIndex) => (
                <th
                  {...column.getHeaderProps()}
                  className={`activities_table_header ${getHeaderSuffix(colIndex)}`}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {/* Apply the table body props */}
        {data.length > 0 ? (
          <tbody {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()}>
                    {
                      // Loop over the rows cells
                      row.cells.map((cell, colIndex) => (
                        // Apply the cell props
                        <td
                          {...cell.getCellProps()}
                          className={`activities_table_data ${getHeaderSuffix(colIndex)}`}
                        >
                          {
                            // Render the cell contents
                            cell.render("Cell", { editActivity: startEditActivity, deleteActivity })
                          }
                        </td>
                      ))
                    }
                  </tr>
                );
              })
            }
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td>No Activities Yet</td>
            </tr>
          </tbody>
        )}
      </table>

      <Modal
        className="log_activity_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={logModalOpen}
        onRequestClose={() => closeModal()}
        contentLabel="Manually Log Activity"
      >
        <button
          className="close_button"
          aria-label="close_button"
          type="button"
          onClick={() => closeModal()}
        />
        <form
          className="log_activity_form"
          onSubmit={editing ? (e) => updateActivity(e) : (e) => logActivity(e)}
        >
          <h2>{editing ? "Edit Activity" : "Log New Activity"}</h2>
          <p className="form_prompt">Date:</p>
          <input
            type="date"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
          />
          <p className="form_prompt">Event Name:</p>
          <input
            type="text"
            placeholder="Enter event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <p className="form_prompt">Hours:</p>
          <input
            type="number"
            placeholder="Enter number of hours volunteered"
            value={eventDuration}
            onChange={(e) => setEventDuration(e.target.value)}
          />
          <button className="modal-button button-primary" type="submit">
            {editing ? "Update" : "Add"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
