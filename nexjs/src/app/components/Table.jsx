import React from "react";

import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

import "./Table.css";

export const Table = ({ rows, deleteRow, editRow }) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Year</th>
            <th className="expand">Title</th>
            <th className="expand">Author</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            row.status = row.status ? row.status : "na"
            const statusText = row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase();

            return (
              <tr key={idx}>
                <td>{row.year}</td>
                <td className="expand">{row.title}</td>
                <td className="expand">{row.author.name}</td>
                <td>
                  <span className={`label label-${row.status.toLowerCase()}`}>
                    {statusText}
                  </span>
                </td>
                <td className="fit">
                  <span className="actions">
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editRow(idx)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};