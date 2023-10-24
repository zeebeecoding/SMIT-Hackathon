import React, { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Typography,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { firestore } from "config/firebase";
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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { name, code, description } = state;

    if (!name) {
      return message.error("Please enter name");
    }

    const course = {
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
    createDocument(course);
  };

  const createDocument = async (course) => {
    try {
      await setDoc(doc(firestore, "courses", course.id), course);
      console.log("course.id", course.id);
      message.success("A new course added successfully");
      const initialState = {
        name: "",
        code: "",
        description: "",
      };
      setState(initialState);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <Link to="/courses" className="btn btn-primary mb-5">
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
                        placeholder="Enter course description"
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
