/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTable } from "react-table";
import Modal from "react-modal";

import "../styles/ProfileActivities.css";

// Dummy Data. When the backend routes are done, the data should be passed in through props.
const data = [
  { Date: "02/15/21", Event: "Backyard Makeover", Hours: 2, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover1", Hours: 3, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover2", Hours: 4, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover3", Hours: 5, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover4", Hours: 6, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover5", Hours: 7, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover6", Hours: 8, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover7", Hours: 9, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover8", Hours: 11, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover", Hours: 2, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover1", Hours: 3, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover2", Hours: 4, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover3", Hours: 5, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover4", Hours: 6, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover5", Hours: 7, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover6", Hours: 8, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover7", Hours: 9, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover8", Hours: 11, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover", Hours: 2, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover1", Hours: 3, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover2", Hours: 4, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover3", Hours: 5, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover4", Hours: 6, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover5", Hours: 7, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover6", Hours: 8, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover7", Hours: 9, Id: "BackyardMakeOver123" },
  { Date: "02/15/21", Event: "Backyard Makeover8", Hours: 11, Id: "BackyardMakeOver123" },
];

// Pass in through props?
const columns = [
  {
    Header: "Date",
    accessor: "Date",
  },
  {
    Header: "Event",
    accessor: "Event",
  },
  {
    Header: "Hours",
    accessor: "Hours",
  },
  // {
  //   Header: "",
  //   accessor: "Id",
  // },
];

export default function ProfileActivities(props) {
  const tableInstance = useTable({ columns, data });
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [activityDate, setActivityDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDuration, setEventDuration] = useState("");

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

  const logActivity = (e) => {
    e.preventDefault();
    console.log(activityDate);
    console.log(eventName);
    console.log(eventDuration);
  };

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
                          cell.render("Cell")
                        }
                      </td>
                    ))
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>

      <Modal
        className="log_activity_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={logModalOpen}
        onRequestClose={() => setLogModalOpen(false)}
        contentLabel="Manually Log Activity"
      >
        <button
          className="close_button"
          aria-label="close_button"
          type="button"
          onClick={() => setLogModalOpen(false)}
        />
        <form className="log_activity_form" onSubmit={(e) => logActivity(e)}>
          <h2>Log New Activity</h2>
          <p className="form_prompt">Date:</p>
          <input
            type="text"
            placeholder="Enter date of event"
            onChange={(e) => setActivityDate(e.target.value)}
          />
          <p className="form_prompt">Event Name:</p>
          <input
            type="text"
            placeholder="Enter the event name"
            onChange={(e) => setEventName(e.target.value)}
          />
          <p className="form_prompt">Hours:</p>
          <input
            type="text"
            placeholder="Enter number of hours volunteered"
            onChange={(e) => setEventDuration(e.target.value)}
          />
          <button className="modal-button button-primary" type="submit">
            Add
          </button>
        </form>
      </Modal>
    </div>
  );
}
