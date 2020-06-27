import React from "react";

import SurveyImage from "../SurveyImage";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

const StudentList = ({ students, markCollect, checkVerified }) => (
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
        <th>Collected</th>
      </tr>
    </thead>
    <tbody>
      {students
        .filter((student) => student.queueNum !== -1)
        .sort(studentComparator)
        .map((student) => (
          <tr
            key={student.teleid}
            style={{
              background: student.collected ? "grey" : "white",
            }}
            data-test={"queuelist-" + student.teleid}
          >
            <td>{student.queueNum}</td>
            <td>{student.name}</td>
            <td>{student.matric}</td>
            <td data-test={"facultysurvey-" + student.teleid}>
              <SurveyImage imageUrl={student.faculty} />
            </td>
            <td data-test={"nussusurvey-" + student.teleid}>
              <SurveyImage imageUrl={student.nussu} />
            </td>
            <td data-test={"verified-" + student.teleid}>
              <Form.Check
                id={student.teleid}
                type="checkbox"
                onChange={() => checkVerified(student.teleid)}
                checked={student.surveyVerified}
              />
            </td>
            <td data-test={"collected-" + student.teleid}>
              <Form.Check
                id={student.teleid}
                type="checkbox"
                onChange={() => markCollect(student.teleid)}
                checked={student.collected}
              />
            </td>
          </tr>
        ))}
    </tbody>
  </Table>
);

const studentComparator = (student1, student2) => {
  return student1.collected === student2.collected
    ? student1.queueNum - student2.queueNum
    : student1.collected
    ? 1
    : -1;
};

export default StudentList;
