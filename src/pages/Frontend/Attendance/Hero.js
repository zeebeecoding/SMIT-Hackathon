import React, { useState } from "react";
import { useFetchStudents } from "../../../contexts/FetchStudents";
import { useFetchCourses } from "../../../contexts/FetchCourses";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../../../config/firebase";
import { message } from "antd";
import { useFetchAttendence } from "../../../contexts/FetchAttendence";
import Select from "react-select";

export default function Attendence() {
  const [state, setState] = useState({ courseName: [] });
  const { getStudents } = useFetchStudents();
  const { getCourses } = useFetchCourses();
  const { getAttendence } = useFetchAttendence();
  const selectedCourseName = state.courseName[0]; // Assuming you only allow one course to be selected
  const getCourseId = getCourses.find(
    (course) => course.id === selectedCourseName
  );
  let showStudents = [];

  if (getCourseId) {
    const filterstudents = getStudents.filter((student) =>
      student.courseName.includes(getCourseId.name)
    );
    showStudents = filterstudents;
  }
  const courseId = getCourses.find(
    (course) => course.id === selectedCourseName
  );

  let courseName = "";

  if (courseId) {
    courseName = courseId.name;
  }

  const handlePresent = async (student) => {
    const data = student;
    data.date = new Date().toLocaleDateString();
    data.attendence = "present";

    try {
      await setDoc(doc(firestore, "attendences", data.id), data);
      message.success("Successfully Done");
      getAttendence.push(data);
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong while taking Attendence");
    }
  };

  const handleAbsent = async (student) => {
    const data = student;
    data.date = new Date().toLocaleDateString();
    data.attendence = "absent";

    try {
      await setDoc(doc(firestore, "attendences", data.id), data);
      message.success("Successfully Done");
      getAttendence.push(data);
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong while taking Attendence");
    }
  };
  const tableRows = showStudents.map((student, i) => {
    const account = getAttendence.find(
      (attendence) => attendence.id === student.id
    );
    console.log("account", account);
    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{student.name}</td>
        <td>{courseName}</td>

        <td className="text-center">
          <button
            className={`btn btn-info p-1 py-0 rounded-2 me-0 me-md-1 ${
              account && account.attendence === "present" ? "disabled" : ""
            }`}
            onClick={() => {
              handlePresent(student);
            }}
          >
            {" "}
            <span className="text-white my-1 d-flex align-items-center">
              Present
            </span>{" "}
          </button>

          <button
            className={`btn btn-danger p-1 py-0 rounded-2 ${
              account && account.attendence === "absent" ? "disabled" : ""
            }`}
            onClick={() => {
              handleAbsent(student);
            }}
          >
            <span className="text-white my-1 d-flex align-items-center">
              Absent
            </span>
          </button>
        </td>
      </tr>
    );
  });
  const options = getCourses.map((course) => ({
    value: course.id,
    label: course.name,
  }));
  return (
    <div className="container mt-5 pt-4">
      <div className="row">
        <div className="col">
          <div className="row">
            <h2>Attendence</h2>
          </div>
          <div className="row">
            <div className="col-6">
              <Select
                isMulti
                className="basic-single"
                classNamePrefix="select"
                name="courseName"
                value={options.filter((option) =>
                  state.courseName.includes(option.value)
                )}
                onChange={(selectedOptions) => {
                  setState((prevState) => ({
                    ...prevState,
                    courseName: selectedOptions.map((option) => option.value),
                  }));
                }}
                options={options}
              />
            </div>
          </div>
          <hr />
          <div className="row mx-0 mb-2">
            <div className="col bg-white rounded-3">
              <div className="table-responsive rounded">
                <table className="table">
                  <thead>
                    <tr
                      className=""
                      style={{ background: "#c1e6c3", color: "#005a16" }}
                    >
                      <th>Sr.No</th>
                      <th>Student Name</th>
                      <th>Course Name</th>

                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>{tableRows}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
