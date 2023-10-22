import React, { useEffect, useState } from "react";
import { Button, Divider, Select, Space, Tooltip, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "config/firebase";
import { useAuthContext } from "contexts/AuthContext";

export default function Hero() {
  const { user } = useAuthContext();
  const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [status, SetStatus] = useState("active");

  const navigate = useNavigate();

  const getcourses = async () => {
    const q = query(
      collection(firestore, "courses"),
      where("createdBy.uid", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    const array = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let data = doc.data();
      array.push(data);
    });
    setAllDocuments(array);
    setDocuments(array);
  };

  useEffect(() => {
    getcourses();
  }, []);

  useEffect(() => {
    const filteredDocuments = allDocuments.filter(
      (student) => student.status === status
    );
    setDocuments(filteredDocuments);
  }, [allDocuments, status]);

  const handleDelete = async (student) => {
    try {
      await deleteDoc(doc(firestore, "courses", student.id));

      let documentsAfterDelete = documents.filter(
        (doc) => doc.id !== student.id
      );
      setAllDocuments(documentsAfterDelete);
      setDocuments(documentsAfterDelete);

      message.success("Course deleted successfully");
    } catch (err) {
      console.error(err);
      message.error("Something went wrong while delting student");
    }
  };

  return (
    <>
      <div className="py-5 mt-4">
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
                    {documents.map((student, i) => {
                      return (
                        <tr key={i}>
                          <th>{i + 1}</th>
                          <td>
                            <Link to={`/details/${student.id}`}>
                              {student.name}
                            </Link>
                          </td>
                          <td>{student.code}</td>
                          <td>{student.description}</td>
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
                                      `/dashboard/courses/${student.id}`
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
    </>
  );
}
