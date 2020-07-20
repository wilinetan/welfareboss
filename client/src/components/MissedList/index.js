import React from "react";

import SurveyImage from "../SurveyImage";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

const MissedList = ({ students, checkVerified }) => (
  <div>
    <h1>Missed</h1>
    <Table
      bordered
      hover
      size="sm"
      style={{ width: "1200px", marginLeft: "auto", marginRight: "auto" }}
    >
      <thead>
        <tr>
          <th>Queue Number</th>
          <th>Name</th>
          <th>Matric Number</th>
          <th>Faculty survey</th>
          <th>NUSSU survey</th>
          <th>Verified</th>
        </tr>
      </thead>
      <tbody>
        {students.sort(studentComparator).map((student) => (
          <tr key={student.teleid} data-test={"missedlist-" + student.teleid}>
            <td>{student.queueNum}</td>
            <td>{student.name}</td>
            <td>{student.matric}</td>
            <td>
              <SurveyImage imageUrl={student.faculty} />
            </td>
            <td>
              <SurveyImage imageUrl={student.nussu} />
            </td>
            <td>
              <Form.Check
                id={student.teleid}
                type="checkbox"
                onChange={() => checkVerified(student.teleid)}
                checked={student.surveyVerified}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);

const studentComparator = (student1, student2) =>
  student1.queueNum - student2.queueNum;

export default MissedList;
