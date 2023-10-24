import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "Components/Header";
import Footer from "Components/Footer";
import Sidebar from "Components/Sidebar";
import Attendance from "./Attendance";
import Student from "./Student";
import Admin from "./Admin";
import Course from "./Course";
import Details from "./Student/Details";

export default function Index() {
  return (
    <>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <div className="d-flex flex-grow-1">
          <Sidebar />
          <div
            className="d-flex flex-column flex-grow-1"
            style={{ marginLeft: "15vw", width: "85vw" }}
          >
            <Routes>
              <Route path="/" element={<Admin />} />
              <Route path="details/:id" element={<Details />} />
              <Route path="/students" element={<Student />} />
              <Route path="/courses" element={<Course />} />
              <Route path="/attendences" element={<Attendance />} />
              <Route path="*" element={<h1>404</h1>} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
