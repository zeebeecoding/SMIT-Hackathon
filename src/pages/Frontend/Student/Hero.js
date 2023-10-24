import React, { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import dayjs from "dayjs";
import { Avatar, Button, Space, Tooltip, message } from "antd";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useFetchStudents } from "../../../contexts/FetchStudents";
import { firestore } from "../../../config/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Students() {
  const [getSearch, setGetSearch] = useState("");
  const navigate = useNavigate();
  const { getStudents, setGetstudents } = useFetchStudents();

  let searchedStudents = [];
  if (getSearch.trim() === "") {
    searchedStudents = getStudents;
  } else {
    searchedStudents = getStudents.filter(
      (student) =>
        student &&
        student.email &&
        student.email.toLowerCase().includes(getSearch.trim().toLowerCase())
    );
  }
  const sortedStudents = [...searchedStudents].sort(
    (a, b) => a.studentId - b.studentId
  );

  const handleDelete = async (student) => {
    try {
      await deleteDoc(doc(firestore, "students", student.id));

      let StudentsAfterDelete = getStudents.filter(
        (doc) => doc.id !== student.id
      );
      setGetstudents(StudentsAfterDelete);
      message.success("Student Deleted Successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong While Deleting Student");
    }
  };

  return (
    <>
      <div className="container mt-5 pt-4">
        <div className="row">
          <div className="col">
            <div className="row">
              <h2 className="text-center">Students</h2>
            </div>
            <div className="row bg-light rounded-3">
              <div className="col">
                <div className="row">
                  <div className="col-12 col-md-4 py-2 d-flex align-items-center">
                    <h5 className="mb-0">Student Table</h5>
                  </div>
                  <div className="col-12 col-md-4 py-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Any By E-mail..."
                      onChange={(e) => {
                        setGetSearch(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col py-2 text-end">
                    <Link to="/dashboard/students" className="btn btn-info">
                      Add Student
                    </Link>
                  </div>
                </div>
                <hr />
                <div className="row mx-0 mb-2">
                  <div className="col bg-white rounded-3">
                    <div className="table-responsive rounded">
                      <table className="table table-striped align-middle">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Date of birth</th>
                            <th>Courses</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedStudents.map((student, i) => {
                            return (
                              <tr key={i}>
                                <th>{i + 1}</th>
                                <td>
                                  {student.file ? (
                                    <img
                                      src={student.file}
                                      alt="Student Image"
                                      className="rounded-circle"
                                      style={{ width: 50 }}
                                    />
                                  ) : (
                                    <Avatar size={50} icon={<UserOutlined />} />
                                  )}
                                </td>

                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.contact}</td>
                                <td>
                                  {student.date
                                    ? dayjs(student.date).format(
                                        "dddd, DD/MM/YYYY"
                                      )
                                    : ""}
                                </td>
                                <td>
                                  {student.courseName &&
                                    student.courseName.map((course, index) => (
                                      <div key={index}>{course}</div>
                                    ))}
                                </td>
                                <td>
                                  <Space>
                                    <Tooltip title="Delete" color="red">
                                      <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                          handleDelete(student);
                                        }}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                          navigate(
                                            `/dashboard/students/${student.id}`
                                          );
                                        }}
                                      />
                                    </Tooltip>
                                  </Space>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
