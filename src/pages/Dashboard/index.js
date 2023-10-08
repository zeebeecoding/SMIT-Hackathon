import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AddStudent from "./AddStudent";
import AddCourse from "./AddCourse";
import UpdateStudent from "./AddStudent/UpdateStudent";
import UpdateCourse from "./AddCourse/UpdateCourse";
import PrivateRoute from "components/PrivateRoute";

export default function Index() {
  return (
    <div className="dashboard">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/students" />} />
        <Route path="/" element={<Navigate to="/dashboard/courses" />} />
        <Route
          path="/students"
          element={
            <PrivateRoute
              Component={AddStudent}
              allowedRoles={["superAdmin", "customer"]}
            />
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute
              Component={AddCourse}
              allowedRoles={["superAdmin", "customer"]}
            />
          }
        />
        <Route path="/students/:id" element={<UpdateStudent />} />
        <Route path="/courses/:id" element={<UpdateCourse />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
}
