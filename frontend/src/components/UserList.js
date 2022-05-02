/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import "../styles/UserList.css";

// Define a default UI for filtering
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  // Allows the enter key to be used to start a search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setGlobalFilter(globalFilter);
    }
  };

  return (
    <div className="user_search_bar">
      <input
        className="user_search_input"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        onKeyPress={(e) => handleKeyPress(e)}
        placeholder="Search by name"
      />
      <button
        className="user_search_button"
        type="button"
        aria-label="Search"
        onClick={() => setGlobalFilter(globalFilter)}
      />
    </div>
  );
}

/**
 * @param {Array} tableHeaders Array containing header objects with corresponding accessors
 * @param {Array} userData Array containing user information to be displayed
 * @param {function} updateMyData function for updating user data
 * @returns
 */
function UserList({
  tableHeaders,
  userData,
  updateMyData,
  handleConfirmationModal,
  filter,
  setFilter,
}) {
  const [showAdmin, setShowAdmin] = useState(false);
  /**
   * NOTE: This format only applies for the hard-coded user information used for V1
   * userData should be formated as such:
   * const userData = [
   *    {
   *        Name: "User's name",
   *        Roles: []             // Contains user's roles via AssignBtn components
   *        Completed: 0          // Number of assignments completed
   *        Start: "Date"         // Day volunter started
   *        Admin: {Num}         // 1 == secondary admin, 2 == primary admin, other = regular user
   *    },
   * ]
   */

  const data = React.useMemo(() => userData, [userData]);

  /**
   * tableHeaders should be formatted as such:
   * const headers = [
   *    {
   *        Header: "Displayed Name",
   *        accessor: "label"       // Used to assign elements to columns in userData
   *    }
   * ]
   */
  const columns = React.useMemo(() => tableHeaders, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      updateMyData, // will be available in cell render
      handleConfirmationModal, // for showing confirm modal
      autoResetGlobalFilter: false,
    },
    useGlobalFilter,
    useSortBy
  );

  useEffect(() => setGlobalFilter(filter), [filter]);

  const getArrowImage = (sorted, direction) => {
    if (sorted) {
      if (direction) {
        return <img src="/img/up_arrow.svg" alt="Up Arrow" />;
      }

      return <img src="/img/down_arrow.svg" alt="Down Arrow" />;
    }

    return <img src="/img/updown_arrow.svg" alt="upDown Arrow" />;
  };

  // Returns the suffix of a cell's/header's className depending on the column index
  const getColTitle = (colIndex) => {
    if (colIndex === 0) {
      return "start";
    }
    if (colIndex === columns.length - 1) {
      return "end";
    }
    return "";
  };

  // Determine if a row should be displayed based on which tab the table is on.
  // Uses the id of the user to check to see if the user is an admin.
  // NOTE: This could be problematic if users have the same name. Emails should work though.
  const separateAdmin = (id) => {
    const isAdmin = userData.some(
      (user) => user._id === id && (user.admin === 1 || user.admin === 2)
    );

    if (isAdmin && showAdmin) {
      return true;
    }

    if (!isAdmin && !showAdmin) {
      return true;
    }

    return false;
  };

  return (
    <div className="user_list_layout">
      <div className="people_table_controls">
        <div className="table_btn_container">
          <button
            type="button"
            className="btn_table_control"
            style={!showAdmin ? { color: "#0057b8" } : {}}
            onClick={() => setShowAdmin(false)}
          >
            Volunteers
          </button>
          <button
            type="button"
            className="btn_table_control"
            style={showAdmin ? { color: "#0057b8" } : {}}
            onClick={() => setShowAdmin(true)}
          >
            Admins
          </button>
        </div>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={(f) => {
            setGlobalFilter(f);
            setFilter(f);
          }}
        />
      </div>
      <div className="table-container">
        <table className="people_table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
                {headerGroup.headers.map((column, colIndex) => (
                  <th
                    className={`people_table_header ${getColTitle(colIndex)}`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={Math.random()}
                  >
                    {column.render("Header")}
                    {/* This ternary operator should be removed to allow sorting for all columns */}
                    {colIndex === 0 ? (
                      <span className="sort_toggle">
                        {getArrowImage(column.isSorted, column.isSortedDesc)}
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return separateAdmin(row.original._id) ? (
                <tr {...row.getRowProps()} key={Math.random()}>
                  {row.cells.map((cell, colIndex) => (
                    <td
                      {...cell.getCellProps()}
                      className={`people_table_data ${getColTitle(colIndex)}`}
                      key={Math.random()}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              ) : null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
