/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTable } from "react-table";
import "../styles/UserList.css";

function UserList() {
  /**
   * Plan:
   * 0. Read through the documentation and this page to understand what the code is doing.
   * 1. Automate the data variable such that it can take in information from props.
   */
  const data = React.useMemo(
    () => [
      {
        col1: "Hello",
        col2: "World",
      },
      {
        col1: "react-table",
        col2: "rocks",
      },
      {
        col1: "whatever",
        col2: "you want",
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Column 1",
        accessor: "col1", // accessor is the "key" in the data
      },
      {
        Header: "Column 2",
        accessor: "col2",
      },
      {
        Header: "Column 3",
        accessor: "col3",
      },
      {
        Header: "Column 4",
        accessor: "col4",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

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
        <th className="people_table_header_start" {...column.getHeaderProps()}>
          {column.render("Header")}
        </th>
      );
    }
    // End of the header
    if (index === columns.length - 1) {
      return (
        <th className="people_table_header_end" {...column.getHeaderProps()}>
          {column.render("Header")}
        </th>
      );
    }
    // Header elements in the middle

    return (
      <th className="people_table_header" {...column.getHeaderProps()}>
        {column.render("Header")}
      </th>
    );
  };

  return (
    <table cellPadding="0" cellSpacing="0" border="0" className="people_table" {...getTableProps()}>
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
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} className="people_table_data">
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
