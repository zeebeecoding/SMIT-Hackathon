import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "contexts/AuthContext";
import FetchCoursesProvider from "./contexts/FetchCourses";
import FetchStudentsProvider from "./contexts/FetchStudents";
import FetchAttendenceProvider from "./contexts/FetchAttendence";
import "config/global";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <FetchCoursesProvider>
          <FetchStudentsProvider>
            <FetchAttendenceProvider>
              <App />
            </FetchAttendenceProvider>
          </FetchStudentsProvider>
        </FetchCoursesProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
