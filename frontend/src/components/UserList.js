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

    // Uncomment lines (82 and 85) and (94 and 97) to get sorting to work for the middle and end headers
    // End of the header
    if (index === columns.length - 1) {
      return (
        <th
          className="people_table_header_end"
          // {...column.getHeaderProps(column.getSortByToggleProps())}
        >
          {column.render("Header")}
          {/* <span className="sort_toggle">{getArrowImage(column.isSorted, column.isSortedDesc)}</span> */}
        </th>
      );
    }
    // Header elements in the middle

    return (
      <th
        className="people_table_header"
        // {...column.getHeaderProps(column.getSortByToggleProps())}
      >
        {column.render("Header")}
        {/* <span className="sort_toggle">{getArrowImage(column.isSorted, column.isSortedDesc)}</span> */}
      </th>
    );
  };

  // Returns the suffix of a cell's className depending on the column index
  const getCellTitle = (colIndex) => {
    if (colIndex === 0) {
      return "_start";
    }
    if (colIndex === columns.length - 1) {
      return "_end";
    }
    return "";
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
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={Math.random()}>
              {row.cells.map((cell, colIndex) => (
                <td
                  {...cell.getCellProps()}
                  className={`people_table_data${getCellTitle(colIndex)}`}
                  key={Math.random()}
                >
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default UserList;
