import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Progress,
  Row,
  Typography,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { firestore, storage } from "config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthContext } from "contexts/AuthContext";

const { Title } = Typography;

const initialState = {
  name: "",
  code: "",
  description: "",
};

export default function Hero() {
  const { user } = useAuthContext();
  const [state, setState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleDate = (_, date) => setState((s) => ({ ...s, date }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { name, code, description } = state;

    if (!name) {
      return message.error("Please enter name");
    }

    const student = {
      name,
      code,
      description,
      status: "active",
      dateCreated: new Date().getTime(),
      id: Math.random().toString(36).slice(2),
      file: "",
      createdBy: {
        fullName: user.fullName,
        email: user.email,
        uid: user.uid,
      },
    };

    setIsProcessing(true);

    if (file) {
      if (file.size > 500000) {
        setIsProcessing(false);
        return message.error("Your file size greater than 500 KB");
      }
      uploadFile(student);
    } else {
      createDocument(student);
    }
  };

  const createDocument = async (student) => {
    try {
      await setDoc(doc(firestore, "students", student.id), student);
      console.log("student.id", student.id);
      message.success("A new student added successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setIsProcessing(false);
  };

  const uploadFile = (student) => {
    const fileName = student.id;
    var fileExtension = file.name.split(".").pop();

    const storageRef = ref(storage, `images/${fileName}.${fileExtension}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.floor(progress));
      },
      (error) => {
        message.error("Something went wrong while uploading file");
        // Handle unsuccessful uploads
        setIsProcessing(false);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          let data = { ...student, file: downloadURL };
          createDocument(data);
        });
      }
    );
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <Link to="/" className="btn btn-primary mb-5">
              Go Back
            </Link>
            <div className="card p-3 p-md-4">
              <Title level={2} className="m-0 text-center">
                Add Course
              </Title>

              <Divider />

              <Form layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Course Name">
                      <Input
                        placeholder="Enter course name"
                        name="name"
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Course Code">
                      <Input
                        placeholder="Enter course code"
                        name="code"
                        type="text"
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Couse Description">
                      <Input.TextArea
                        placeholder="Input your description"
                        name="description"
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    md={{ span: 12, offset: 6 }}
                    lg={{ span: 8, offset: 8 }}
                    className="mt-2"
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-100"
                      loading={isProcessing}
                      onClick={handleSubmit}
                    >
                      Add Course
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
