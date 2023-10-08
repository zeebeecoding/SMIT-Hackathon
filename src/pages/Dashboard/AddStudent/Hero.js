import React, { useEffect, useState } from "react";
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
import { setDoc, doc, query, collection, getDocs } from "firebase/firestore";
import { firestore, storage } from "config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuthContext } from "contexts/AuthContext";
const { Title } = Typography;

const initialState = {
  name: "",
  email: "",
  contact: "",
  date: "",
  description: "",
};

export default function Hero() {
  const { user } = useAuthContext();
  const [state, setState] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleDate = (_, date) => setState((s) => ({ ...s, date }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { name, email, contact, date, description } = state;

    if (!name) {
      return message.error("Please enter name");
    }

    const student = {
      name,
      email,
      contact,
      date,
      description,
      courses,
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
  const getCourses = async () => {
    const q = query(collection(firestore, "courses"));
    const querySnapshot = await getDocs(q);
    const array = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      array.push({
        label: data.name, // Assuming there is a 'name' field in your course document
        value: doc.id, // Assuming the course ID is stored in the document ID
      });
    });
    return array;
  };
  useEffect(() => {
    getCourses().then((courses) => setCourses(courses));
  }, []);
  const MultiSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
    isDarkTheme,
  }) => (
    <div
      {...innerProps}
      className="react-select-menu-patients"
      style={{
        backgroundColor: isDarkTheme ? "#1a1f21" : "#f2f2f2",
        color: isDarkTheme ? "white" : "black",
      }}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => null}
        value={data.value}
      />
      {label}
    </div>
  );
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
                    <Form.Item label="Date of birth">
                      <Select
                        options={courses} // Assuming 'courses' is the state containing the list of courses
                        value={selectedCourse}
                        onChange={(selectedOption) =>
                          setSelectedCourse(selectedOption)
                        }
                        options={[...fetchedDoctorOptions]}
                        placeholder="Select Referring Doctors"
                        isMulti
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        components={{
                          Option: (props) => <MultiSelectOption {...props} />,
                        }}
                      />
                    </Form.Item>
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
