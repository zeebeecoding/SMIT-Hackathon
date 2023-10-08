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
  const [attendence, setAttendence] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setAttendence((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleDate = (_, date) => setAttendence((s) => ({ ...s, date }));

  const getAttendences = async () => {
    const q = query(
      collection(firestore, "attendences"),
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
    getAttendences();
  }, []);

  useEffect(() => {
    const filteredDocuments = allDocuments.filter(
      (attendence) => attendence.status === status
    );
    setDocuments(filteredDocuments);
  }, [allDocuments, status]);

  const handleUpdate = () => {
    let { date } = attendence;

    if (!date) {
      return message.error("Please enter date");
    }

    const updatedattendence = {
      date,
      dateModified: new Date().getTime(),
    };

    const updatedattendences = documents.map((oldAttendence) => {
      if (oldAttendence.id === attendence.id) return updatedattendence;
      return oldAttendence;
    });

    setDocuments(updatedattendences);
    localStorage.setItem("attendences", JSON.stringify(updatedattendences));
    message.success("attendence updated successfully");
    setIsModalOpen(false);
  };

  const handleDelete = async (attendence) => {
    try {
      await deleteDoc(doc(firestore, "attendences", attendence.id));

      let documentsAfterDelete = documents.filter(
        (doc) => doc.id !== attendence.id
      );
      setAllDocuments(documentsAfterDelete);
      setDocuments(documentsAfterDelete);

      message.success("attendence deleted successfully");
    } catch (err) {
      console.error(err);
      message.error("something went wrong while delting attendence");
    }
  };

  return (
    <>
      <div className="py-5">
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <h1>attendences</h1>
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
              <Link to="/dashboard" className="btn btn-info">
                Add attendence
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
                      <th>Image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>Date of birth</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((attendence, i) => {
                      return (
                        <tr key={i}>
                          <th>{i + 1}</th>
                          <td>
                            {attendence.file ? (
                              <Image
                                src={attendence.file}
                                className="rounded-circle"
                                style={{ width: 50 }}
                              />
                            ) : (
                              <Avatar size={50} icon={<UserOutlined />} />
                            )}
                          </td>
                          <td>
                            <Link to={`/details/${attendence.id}`}>
                              {attendence.name}
                            </Link>
                          </td>
                          <td>{attendence.email}</td>
                          <td>{attendence.contact}</td>
                          <td>
                            {attendence.date
                              ? dayjs(attendence.date).format(
                                  "dddd, DD/MM/YYYY"
                                )
                              : ""}
                          </td>
                          <td>{attendence.status}</td>
                          <td>
                            <Space>
                              <Tooltip title="Delete" color="red">
                                <Button
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => {
                                    handleDelete(attendence);
                                  }}
                                />
                              </Tooltip>
                              <Tooltip title="Edit">
                                <Button
                                  type="primary"
                                  icon={<EditOutlined />}
                                  onClick={() => {
                                    navigate(
                                      `/dashboard/attendences/${attendence.id}`
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
        title="Update attendence"
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
                  value={attendence.title}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Location">
                <Input
                  placeholder="Input your location"
                  name="location"
                  value={attendence.location}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Date">
                <DatePicker
                  className="w-100"
                  value={attendence.date ? dayjs(attendence.date) : ""}
                  onChange={handleDate}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description" className="mb-0">
                <Input.TextArea
                  placeholder="Input your description"
                  name="description"
                  value={attendence.description}
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
