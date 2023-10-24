// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Button,
//   Col,
//   DatePicker,
//   Divider,
//   Form,
//   Input,
//   Row,
//   Select,
//   Typography,
//   message,
// } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import dayjs from "dayjs";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { firestore } from "config/firebase";

// const { Title } = Typography;

// const initialState = {
//   name: "",
//   code: "",
//   description: "",
// };

// export default function UpdateStudent() {
//   const [state, setState] = useState(initialState);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const navigate = useNavigate();
//   const params = useParams();

//   const handleChange = (e) =>
//     setState((s) => ({ ...s, [e.target.name]: e.target.value }));
//   const handleDate = (_, date) => setState((s) => ({ ...s, date }));

//   const getDocument = useCallback(async () => {
//     const docRef = doc(firestore, "courses", params.id);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const student = docSnap.data();
//       setState(student);
//     } else {
//       // docSnap.data() will be undefined in this case
//       message.error("Course not found");
//     }
//   }, [params.id]);

//   useEffect(() => {
//     getDocument();
//   }, [getDocument]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   let { name, code, description, status } = state;

//   //   if (!name) {
//   //     return message.error("Please enter name");
//   //   }

//   //   const student = {
//   //     ...state,
//   //     name,
//   //     code,
//   //     description,
//   //     status,
//   //     dateModified: new Date().getTime(),
//   //   };

//   //   setIsProcessing(true);
//   //   try {
//   //     await setDoc(doc(firestore, "course", student.id), student);
//   //     message.success("Course updated successfully");
//   //     navigate("/");
//   //   } catch (e) {
//   //     console.error("Error adding document: ", e);
//   //   }
//   //   setIsProcessing(false);
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, contact, date, description } = state;

//     if (!name) {
//       return message.error("Please enter name");
//     }

//     setIsProcessing(true);
//     try {
//       await updateCourse(params.id, {
//         ...state,
//         dateModified: new Date().getTime(),
//       });
//       message.success("Student updated successfully");
//       navigate("/");
//     } catch (error) {
//       console.error("Error updating student: ", error);

//       if (error instanceof Error && error.message) {
//         message.error(`Error: ${error.message}`);
//       } else {
//         message.error("Something went wrong while updating student");
//       }
//     } finally {
//       setIsProcessing(false);
//     }
//   };
//   return (
// <>
//   <div className="container">
//     <div className="row">
//       <div className="col">
//         <div className="card p-3 p-md-4">
//           <Title level={2} className="m-0 text-center">
//             Update Course
//           </Title>

//           <Divider />

//           <Form layout="vertical">
//             <Row gutter={16}>
//               <Col xs={24} lg={12}>
//                 <Form.Item label="Course Name">
//                   <Input
//                     placeholder="Enter course name"
//                     name="name"
//                     value={state.name}
//                     onChange={handleChange}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col xs={24} lg={12}>
//                 <Form.Item label="Course Code">
//                   <Input
//                     placeholder="Enter course code"
//                     name="code"
//                     value={state.code}
//                     onChange={handleChange}
//                   />
//                 </Form.Item>
//               </Col>

//               <Col xs={24} lg={12}>
//                 <Form.Item label="Status">
//                   <Select
//                     value={state.status}
//                     onChange={(status) =>
//                       setState((s) => ({ ...s, status }))
//                     }
//                   >
//                     {["active", "inactive"].map((status, i) => {
//                       return (
//                         <Select.Option key={i} value={status}>
//                           {status}
//                         </Select.Option>
//                       );
//                     })}
//                   </Select>
//                 </Form.Item>
//               </Col>
//               <Col span={24}>
//                 <Form.Item label="Description">
//                   <Input.TextArea
//                     placeholder="Enter course description"
//                     name="description"
//                     onChange={handleChange}
//                     value={state.description}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col
//                 xs={24}
//                 md={{ span: 12, offset: 6 }}
//                 lg={{ span: 8, offset: 8 }}
//               >
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   className="w-100"
//                   loading={isProcessing}
//                   onClick={handleSubmit}
//                 >
//                   Update Student
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//       </div>
//     </div>
//   </div>
// </>
//   );
// }
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "config/firebase";
import { useFetchCourses } from "../../../contexts/FetchCourses";

const { Title } = Typography;

const initialState = {
  name: "",
  code: "",
  description: "",
};

export default function UpdateCourse() {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { getCourses, updateCourse } = useFetchCourses();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const getDocument = useCallback(() => {
    const course = getCourses.find((course) => course.id === params.id);

    if (course) {
      setState(course);
    } else {
      message.error("Course not found");
    }
  }, [getCourses, params.id]);

  useEffect(() => {
    getDocument();
  }, [getDocument]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, code, description, status } = state;

    if (!name) {
      return message.error("Please enter name");
    }

    setIsProcessing(true);
    try {
      await updateCourse(params.id, {
        ...state,
        dateModified: new Date().getTime(),
      });
      message.success("Course updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating course: ", error);

      if (error instanceof Error && error.message) {
        message.error(`Error: ${error.message}`);
      } else {
        message.error("Something went wrong while updating course");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card p-3 p-md-4">
              <Title level={2} className="m-0 text-center">
                Update Course
              </Title>

              <Divider />

              <Form layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Course Name">
                      <Input
                        placeholder="Enter course name"
                        name="name"
                        value={state.name}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Form.Item label="Course Code">
                      <Input
                        placeholder="Enter course code"
                        name="code"
                        value={state.code}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Description">
                      <Input.TextArea
                        placeholder="Enter course description"
                        name="description"
                        onChange={handleChange}
                        value={state.description}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    md={{ span: 12, offset: 6 }}
                    lg={{ span: 8, offset: 8 }}
                  >
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="w-100"
                      loading={isProcessing}
                      onClick={handleSubmit}
                    >
                      Update Student
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
