/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { useTable } from "react-table";
import Modal from "react-modal";
import { Calendar, date_format, dateFunctions } from "@cubedoodl/react-simple-scheduler";
import { api_add_event, api_edit_event, api_delete_event } from "../api";

import "../styles/ProfileActivities.css";

function Abbreviator({ content, maxLength }) {
  return (
    <>
      {content.substring(0, maxLength)}
      {content.length >= maxLength ? <>...</> : null}
    </>
  );
}

const columns = [
  {
    Header: "Date",
    accessor: "date",
    Cell: (props) => <div>{new Date(props.cell.value).toLocaleDateString()}</div>,
  },
  {
    Header: "Event",
    accessor: "title",
    Cell: (props) => (
      <div className="event_title_container">
        <div className="event_title_value">
          <Abbreviator content={props.value} maxLength={40} />
        </div>
        {!props.getNotEditable(props.row.index) ? (
          <div className="man_event_marker">(Manually Added) </div>
        ) : null}
      </div>
    ),
  },
  {
    Header: "Hours",
    accessor: "hours",
  },
  {
    Header: "",
    accessor: "edit",
    Cell: (props) => (
      <div>
        {!props.getNotEditable(props.row.index) ? (
          <div className="edit_activity_container">
            <button
              type="button"
              disabled={!props.active}
              onClick={() => props.editActivity(props.cell.row)}
            >
              <img src="/img/filelisting_edit.svg" alt="" />
            </button>
            <button
              type="button"
              disabled={!props.active}
              onClick={() => props.deleteActivity(props.cell.row)}
            >
              <img src="/img/filelisting_delete.svg" alt="" />
            </button>
          </div>
        ) : null}
      </div>
    ),
  },
];

export default function ProfileActivities({ id, currId, active, events, updateEvents }) {
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [activityDate, setActivityDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [editing, setEditing] = useState(false);
  const [currActivity, setCurrActivity] = useState({});
  const [calendarVisible, setCalendarVisible] = useState(false);

  const data = React.useMemo(() => events, [events]);
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const is_mobile = navigator.userAgent.indexOf("Mobile") > -1;

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
    setActivityDate(new Date());
    setEventName("");
    setEventDuration(0);
  }

  // Adds an activity
  async function logActivity(e) {
    e.preventDefault();
    const res = await api_add_event(id, activityDate, eventName, eventDuration);

    setErrorModalOpen(!res.success);
    if (res && !res.error) {
      updateEvents();
      closeModal();
      clearFields();
    }
  }

  // Begin the activity editing process
  async function startEditActivity(activity) {
    // Change to editing mode
    setEditing(true);
    setLogModalOpen(true);

    setCurrActivity(activity);

    // Set fields of edit activity form
    setEventName(activity.original.title);
    setEventDuration(activity.original.hours);
    setActivityDate(new Date(activity.original.date));
  }

  // Makes an API call to update an activity.
  async function updateActivity(e) {
    e.preventDefault();
    const res = await api_edit_event(
      id,
      currActivity.original._id,
      activityDate,
      eventName,
      eventDuration
    );

    setErrorModalOpen(!res.success);
    if (res && !res.error) {
      updateEvents();
      closeModal();
      clearFields();
    }
  }

  async function deleteActivity(activity) {
    const res = await api_delete_event(id, activity.original._id);

    setErrorModalOpen(!res.success);
    if (res && !res.error) {
      updateEvents();
    }
  }

  return (
    <div className="activities_table">
      <div className="header_container">
        <h2>Activity Log</h2>
        <div className="manually_log_activity">
          {currId !== id ? (
            <div />
          ) : (
            <>
              <h2>Manually Log Activity</h2>
              <button
                type="button"
                disabled={!active}
                className="add_roles"
                onClick={() => setLogModalOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="table_container">
        <table {...getTableProps()}>
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
                    <tr className="activities_row" {...row.getRowProps()}>
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
                              cell.render("Cell", {
                                editActivity: startEditActivity,
                                deleteActivity,
                                getNotEditable: (index) => data[index].notEditable,
                                active,
                              })
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
              <tr className="no_activities_row">
                <td className="no_activities">&nbsp;</td>
                <td className="no_activities">&nbsp;</td>
              </tr>
              <tr className="no_activities_row">
                <td className="no_activities" />
                <td className="no_activities">No Activities Yet</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

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
          <h3>{editing ? "Edit Activity" : "Log New Activity"}</h3>
          <div className="form_prompt">Event Name</div>
          <input
            type="text"
            placeholder="Enter event name here"
            value={eventName}
            required
            onChange={(e) => setEventName(e.target.value)}
          />
          <br />
          <br />
          <div className="form_prompt">Date</div>
          <input
            type="date"
            value={date_format(activityDate, "4Y-2n-2d")}
            onFocus={() => {
              if (!is_mobile) {
                setCalendarVisible(true);
              }
            }}
            onChange={(e) => {
              if (is_mobile) {
                // Odd iOS Safari bug, dates are off by one
                const d = new Date(e.target.value);
                setActivityDate(dateFunctions.walk_day(d, 1));
              }
            }}
            readOnly={!is_mobile}
            required
          />
          {activityDate && calendarVisible ? (
            <>
              <div
                role="presentation"
                className="calendar_overlay"
                onClick={() => setCalendarVisible(false)}
                onKeyDown={() => setCalendarVisible(false)}
              />
              <Calendar selected={activityDate} setSelected={setActivityDate} />
            </>
          ) : null}
          <br />
          <br />
          <div className="form_prompt">Hours</div>
          <input
            type="number"
            placeholder="Enter number of hours volunteered here"
            value={eventDuration}
            min={0}
            required
            onChange={(e) => setEventDuration(e.target.value)}
          />
          <div className="form_right">
            <div className="form_spacer" />
            <button className="modal-button button-primary" type="submit">
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        className="error_modal"
        overlayClassName="add_roles_modal_overlay"
        isOpen={errorModalOpen}
        onRequestClose={() => setErrorModalOpen(false)}
        contentLabel="Error Modal"
      >
        <h3>Unable to Perform Action</h3>
        <button
          className="modal-button button-primary"
          type="button"
          onClick={() => setErrorModalOpen(false)}
        >
          Okay
        </button>
      </Modal>
    </div>
  );
}
