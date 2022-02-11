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

  // Returns the suffix of a cell's/header's className depending on the column index
  const getColTitle = (colIndex) => {
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
            {headerGroup.headers.map((column, colIndex) => (
              <th
                className={`people_table_header${getColTitle(colIndex)}`}
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
          return (
            <tr {...row.getRowProps()} key={Math.random()}>
              {row.cells.map((cell, colIndex) => (
                <td
                  {...cell.getCellProps()}
                  className={`people_table_data${getColTitle(colIndex)}`}
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
