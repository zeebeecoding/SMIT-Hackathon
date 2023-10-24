// import React, { useEffect, useState } from "react";
// import { Button, Divider, Select, Space, Tooltip, message } from "antd";
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { firestore } from "config/firebase";
// import { useAuthContext } from "contexts/AuthContext";

// export default function Hero() {
//   const { user } = useAuthContext();
//   const [allDocuments, setAllDocuments] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [status, SetStatus] = useState("active");

//   const navigate = useNavigate();

//   const getCoursess = async () => {
//     const q = query(
//       collection(firestore, "courses"),
//       where("createdBy.uid", "==", user.uid)
//     );

//     const querySnapshot = await getDocs(q);
//     const array = [];
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       let data = doc.data();
//       array.push(data);
//     });
//     setAllDocuments(array);
//     setDocuments(array);
//   };

//   useEffect(() => {
//     getCoursess();
//   }, []);

//   useEffect(() => {
//     const filteredDocuments = allDocuments.filter(
//       (student) => student.status === status
//     );
//     setDocuments(filteredDocuments);
//   }, [allDocuments, status]);

//   const handleDelete = async (student) => {
//     try {
//       await deleteDoc(doc(firestore, "courses", student.id));

//       let documentsAfterDelete = documents.filter(
//         (doc) => doc.id !== student.id
//       );
//       setAllDocuments(documentsAfterDelete);
//       setDocuments(documentsAfterDelete);

//       message.success("Course deleted successfully");
//     } catch (err) {
//       console.error(err);
//       message.error("Something went wrong while delting student");
//     }
//   };
import React, { useState } from "react";

import { Button, Divider, Space, Tooltip, message } from "antd";

import { firestore } from "../../../config/firebase";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { useFetchCourses } from "../../../contexts/FetchCourses";

import { Link, useNavigate } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function Courses() {
  const [getSearch, setGetSearch] = useState("");
  const { getCourses, setgetCourses } = useFetchCourses();
  const navigate = useNavigate();

  // search = Number(search)
  console.log("getCourse", getCourses);

  let searchedCustomers = [];
  if (getSearch === "") {
    searchedCustomers = getCourses;
  } else {
    searchedCustomers = getCourses.filter(
      (course) =>
        course.courseName &&
        course.courseName.toLowerCase().includes(getSearch.toLowerCase())
    );
  }
  const sortedCourses = [...searchedCustomers].sort(
    (a, b) => a.courseCode - b.courseCode
  );
  const handleDelete = async (course) => {
    try {
      await deleteDoc(doc(firestore, "course", course.id));

      let courseAfterDelete = getCourses.filter((doc) => doc.id !== course.id);
      setgetCourses(courseAfterDelete);
      message.success("Course Deleted Successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("SomeThing went Wrong While Deleting course");
    }
  };
  return (
    <>
      <div className="container mt-5 pt-4">
        <div className="row">
          <div className="col">
            <div className="row">
              <h2 className="text-center">Courses</h2>
            </div>
            <div className="row bg-light rounded-3">
              <div className="col">
                <div className="row ">
                  <div className="col py-2 d-flex align-items-center">
                    {" "}
                    <h5 className="mb-0">Courses Table</h5>{" "}
                  </div>
                  <div className="col py-2">
                    {" "}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Any..."
                      onChange={(e) => {
                        setGetSearch(e.target.value);
                      }}
                    />
                  </div>
                  <div className="col py-2 text-end">
                    <Link to="/dashboard/courses" className="btn btn-info">
                      Add Course
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
                            <th>Name</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedCourses.map((course, i) => {
                            return (
                              <tr key={i}>
                                <th>{i + 1}</th>
                                <td>{course.name}</td>
                                <td>{course.code}</td>
                                <td>{course.description}</td>
                                <td>
                                  <Space>
                                    <Tooltip title="Delete" color="red">
                                      <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                          handleDelete(course);
                                        }}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                      <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                          navigate(
                                            `/dashboard/courses/${course.id}`
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

      {/* <div className="py-5 mt-4">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h1>Courses</h1>
            </div>
            <div className="d-flex">
              <Link to="/dashboard/courses" className="btn btn-info">
                Add Course
              </Link>
            </div>
          </div>
          <Divider />

          <div className="row">
            <div className="col">
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCourses.map((course, i) => {
                      return (
                        <tr key={i}>
                          <th>{i + 1}</th>
                          <td>
                            <Link to={`/details/${course.id}`}>
                              {course.name}
                            </Link>
                          </td>
                          <td>{course.code}</td>
                          <td>{course.description}</td>
                          <td>
                            <Space>
                              <Tooltip title="Delete" color="red">
                                <Button
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(course);
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="Edit">
                                <Button
                                  type="primary"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    navigate(
                                      `/dashboard/courses/${course.id}`
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
      </div> */}
    </>
  );
}
