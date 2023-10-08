import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "components/Header";
import Footer from "components/Footer";
import Sidebar from "components/Sidebar";
import Attendence from "./Attendance";
import Home from "./Student";
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
              <Route path="/" element={<Home />} />
              <Route path="details/:id" element={<Details />} />
              <Route path="/courses" element={<Course />} />
              <Route path="/attandences" element={<Attendence />} />
              <Route path="*" element={<h1>404</h1>} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
