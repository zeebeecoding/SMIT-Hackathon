// Dashboard.js
import React, { useEffect, useState } from "react";
import { useFetchStudents } from "../../../contexts/FetchStudents";
import { useFetchCourses } from "../../../contexts/FetchCourses";
import { useFetchAttendence } from "../../../contexts/FetchAttendence";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import ListIcon from "@mui/icons-material/List";
import { auth } from "config/firebase";

const Dashboard = () => {
  const { getStudents } = useFetchStudents();
  const { getCourses } = useFetchCourses();
  const { getAttendence } = useFetchAttendence();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.email);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="row p-4">
            {/* <h1>Welcome, ........</h1> */}
            <h1>Welcome, {userName}!</h1>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-4 mb-4 mb-md-0">
              <div className="homeTag1" style={{ background: "#c6f4fe" }}>
                <span className="tagIcon">
                  <SchoolIcon size={22} />{" "}
                </span>
                <span>
                  {getStudents.length} <p>Students</p>{" "}
                </span>
              </div>
            </div>
            <div className="col-md-12 col-lg-4 mb-4 mb-md-0">
              <div className="homeTag1" style={{ background: "#fbdfee" }}>
                <span className="tagIcon">
                  <MenuBookIcon size={22} />{" "}
                </span>
                <span>
                  {getCourses.length}
                  <p>Courses</p>{" "}
                </span>
              </div>
            </div>
            <div className="col-md-12 col-lg-4">
              <div className="homeTag1" style={{ background: "#bde0fe" }}>
                <span className="tagIcon">
                  <ListIcon size={22} />{" "}
                </span>
                <span>
                  {getAttendence.length} <p>Attendence</p>{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
