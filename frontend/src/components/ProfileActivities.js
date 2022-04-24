/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useTable } from "react-table";

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

  return (
    <div>
      <h2 className="table_header">Activity Log</h2>
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
    </div>
  );
}
