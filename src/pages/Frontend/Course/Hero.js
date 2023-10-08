import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
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
  const { isAuth } = useAuthContext();
  const { user } = useAuthContext();
  const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [status, SetStatus] = useState("active");
  const [student, setStudent] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setStudent((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleDate = (_, date) => setStudent((s) => ({ ...s, date }));

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

  const handleUpdate = () => {
    let { name, code, description } = student;

    if (!name) {
      return message.error("Please enter name");
    }

    const updatedstudent = {
      name,
      code,
      description,
      dateModified: new Date().getTime(),
    };

    const updatedcourses = documents.map((oldstudent) => {
      if (oldstudent.id === student.id) return updatedstudent;
      return oldstudent;
    });

    setDocuments(updatedcourses);
    localStorage.setItem("courses", JSON.stringify(updatedcourses));
    message.success("Course updated successfully");
    setIsModalOpen(false);
  };

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
      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h1>Courses</h1>
              <Select
                placeholder="Select status"
                onChange={(status) => SetStatus(status)}
              >
                {["active", "inactive"].map((status, i) => {
                  return (
                    <Select.Option key={i} value={status}>
                      {status}
                    </Select.Option>
                  );
                })}
              </Select>
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
                      <th>Status</th>
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
                          <td>{student.status}</td>
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

      <Modal
        title="Update student"
        centered
        open={isModalOpen}
        onOk={handleUpdate}
        okText="Confirm"
        cancelText="Close"
        onCancel={() => setIsModalOpen(false)}
        style={{ width: 1000, maxWidth: 1000 }}
      >
        <Form layout="vertical" className="py-4">
          <Row gutter={16}>
            <Col xs={24} lg={8}>
              <Form.Item label="Title">
                <Input
                  placeholder="Input your title"
                  name="title"
                  value={student.title}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Location">
                <Input
                  placeholder="Input your location"
                  name="location"
                  value={student.location}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Date">
                <DatePicker
                  className="w-100"
                  value={student.date ? dayjs(student.date) : ""}
                  onChange={handleDate}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description" className="mb-0">
                <Input.TextArea
                  placeholder="Input your description"
                  name="description"
                  value={student.description}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
