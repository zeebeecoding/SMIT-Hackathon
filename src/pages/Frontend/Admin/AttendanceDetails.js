// AttendanceDetails.js
import React from "react";

const AttendanceDetails = () => {
  return (
    <div className="attendance-details">
      <h2>Attendance Details</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Present</th>
            <th>Absent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2023-10-10</td>
            <td>30</td>
            <td>20</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDetails;
