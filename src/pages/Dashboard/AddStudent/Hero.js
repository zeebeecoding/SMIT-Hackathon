import React, { useState } from "react";
import Select from "react-select";
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
import { useFetchCourses } from "../../../contexts/FetchCourses";

const { Title } = Typography;

const initialState = {
  name: "",
  email: "",
  contact: "",
  date: "",
  courseName: [],
  description: "",
};

export default function Hero() {
  const [state, setState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const { user } = useAuthContext();
  const { getCourses } = useFetchCourses();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleDate = (_, date) => setState((s) => ({ ...s, date }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { name, email, contact, date, courseName } = state;

    if (!name) {
      return message.error("Please enter name");
    }

    const student = {
      name,
      email,
      contact,
      date,
      courseName,
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
        return message.error("Your file size is greater than 500 KB");
      }
      uploadFile(student);
    } else {
      createDocument(student);
    }
  };

  const createDocument = async (student) => {
    try {
      await setDoc(doc(firestore, "students", student.id), student);
      message.success("A new student added successfully");
      setState(initialState); // Reset the form fields
      setFile(null); // Reset the file state
      setProgress(0); // Reset the progress state
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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.floor(progress));
      },
      (error) => {
        message.error("Something went wrong while uploading file");
        setIsProcessing(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          let data = { ...student, file: downloadURL };
          createDocument(data);
        });
      }
    );
  };

  const options = getCourses.map((course) => ({
    value: course.name,
    label: course.name,
  }));

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
                Add Student
              </Title>

              <Divider />

              <Form layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Student name">
                      <Input
                        placeholder="Enter your name"
                        name="name"
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Student email">
                      <Input
                        placeholder="Enter your contact"
                        name="email"
                        type="email "
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Contact No">
                      <Input
                        placeholder="Enter your contact"
                        className="w-100"
                        type="number"
                        name="contact"
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Date of birth">
                      <DatePicker
                        className="w-100"
                        onChange={handleDate}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
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
                          courseName: selectedOptions.map(
                            (option) => option.value
                          ),
                        }));
                      }}
                      options={options}
                    />
                  </Col>

                  <Col xs={12} lg={8}>
                    <Form.Item label="Upload Image">
                      <Input
                        type="file"
                        placeholder="Upload picture"
                        onChange={(e) => {
                          setFile(e.target.files[0]);
                        }}
                      />
                    </Form.Item>
                    {isProcessing && file && (
                      <Progress percent={progress} showInfo={false} />
                    )}
                  </Col>
                  <Col xs={12} lg={4}>
                    <Form.Item label="Preview">
                      {file && (
                        <Image
                          src={URL.createObjectURL(file)}
                          style={{ width: 50, height: 50 }}
                        />
                      )}
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
                      Add Student
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
