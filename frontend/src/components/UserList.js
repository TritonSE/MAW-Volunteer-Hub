/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTable, useSortBy } from "react-table";
import "../styles/UserList.css";

/**
 * @param {Array} tableHeaders Array containing header objects with corresponding accessors
 * @param {Array} userData Array containing user information to be displayed
 * @returns
 */
function UserList({ tableHeaders, userData }) {
  /**
   * userData should be formated as such:
   * const userData = [
   *    {
   *        Name: "User's name",
   *        Roles: []             // Contains user's roles via AssignBtn components
   *        Completed: 0          // Number of assignments completed
   *        Start: "Date"         // Day volunter started
   *    },
   * ]
   */
  const data = React.useMemo(() => userData, []);

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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const getArrowImage = (sorted, direction) => {
    if (sorted) {
      if (direction) {
        return <img src="/img/up_arrow.svg" alt="Up Arrow" />;
      }

      return <img src="/img/down_arrow.svg" alt="Down Arrow" />;
    }

    return <img src="/img/updown_arrow.svg" alt="upDown Arrow" />;
  };

  /**
   * Returns the header element to be displayed depending on the position in the table
   * @param {*} column A column acquired with react table methods
   * @param {int} index The current location in the table header
   * @returns
   */
  const getHeader = (column, index) => {
    // Start of the header
    if (index === 0) {
      return (
        <th
          className="people_table_header_start"
          {...column.getHeaderProps(column.getSortByToggleProps())}
        >
          {column.render("Header")}
          <span className="sort_toggle">{getArrowImage(column.isSorted, column.isSortedDesc)}</span>
        </th>
      );
    }
    // End of the header
    if (index === columns.length - 1) {
      return (
        <th
          className="people_table_header_end"
          {...column.getHeaderProps(column.getSortByToggleProps())}
        >
          {column.render("Header")}
          <span className="sort_toggle">{getArrowImage(column.isSorted, column.isSortedDesc)}</span>
        </th>
      );
    }
    // Header elements in the middle

    return (
      <th className="people_table_header" {...column.getHeaderProps(column.getSortByToggleProps())}>
        {column.render("Header")}
        <span className="sort_toggle">{getArrowImage(column.isSorted, column.isSortedDesc)}</span>
      </th>
    );
  };

  const getCell = (cell, colIndex, rowIndex) => {
    if (colIndex === 0) {
      return (
        <td
          {...cell.getCellProps()}
          style={
            rowIndex % 2 === 0
              ? { background: "white" }
              : { background: "rgba(187, 188, 188, 0.2)" }
          }
          className="people_table_data_start"
          key={Math.random()}
        >
          {cell.render("Cell")}
        </td>
      );
    }

    if (colIndex === columns.length - 1) {
      return (
        <td
          {...cell.getCellProps()}
          style={
            rowIndex % 2 === 0
              ? { background: "white" }
              : { background: "rgba(187, 188, 188, 0.2)" }
          }
          className="people_table_data_end"
          key={Math.random()}
        >
          {cell.render("Cell")}
        </td>
      );
    }

    return (
      <td
        {...cell.getCellProps()}
        style={
          rowIndex % 2 === 0 ? { background: "white" } : { background: "rgba(187, 188, 188, 0.2)" }
        }
        className="people_table_data"
        key={Math.random()}
      >
        {cell.render("Cell")}
      </td>
    );
  };

  return (
    <table className="people_table" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => getHeader(column, index))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={Math.random()}>
              {row.cells.map((cell, colIndex) => getCell(cell, colIndex, rowIndex))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default UserList;
