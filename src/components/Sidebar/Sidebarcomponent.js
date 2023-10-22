import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListIcon from "@mui/icons-material/List";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
function Sidebarcomponent() {
  const [activeItem, setActiveItem] = useState("dashboard"); // Initialize with the default active item

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <>
      <nav
        id="sidebarMenu"
        className="collapse d-lg-block sidebar collapse bg-white pt-5"
        style={{ width: "15vw", height: "93.5vh" }}
      >
        <div className="position-sticky">
          <div className="list-group list-group-flush mx-3 mt-4">
            <Link
              to="/"
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleItemClick("dashboard")}
            >
              {/* <i className="fas fa-tachometer-alt fa-fw me-3"></i> */}
              <span className="d-flex align-center" style={{ gap: "0.3em" }}>
                <DashboardIcon /> Dashboard
              </span>
            </Link>
            <Link
              to="/students"
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "students" ? "active" : ""
              }`}
              onClick={() => handleItemClick("students")}
            >
              {/* <i className="fas fa-chart-area fa-fw me-3"></i> */}
              <span className="d-flex align-center" style={{ gap: "0.3em" }}>
                <SchoolIcon /> Students
              </span>
            </Link>
            <Link
              to="/courses"
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "courses" ? "active" : ""
              }`}
              onClick={() => handleItemClick("courses")}
            >
              {/* <i className="fas fa-lock fa-fw me-3"></i> */}
              <span className="d-flex align-center" style={{ gap: "0.3em" }}>
                <MenuBookIcon /> Courses
              </span>
            </Link>
            <Link
              to="/attendences"
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "attendance" ? "active" : ""
              }`}
              onClick={() => handleItemClick("attendance")}
            >
              <span className="d-flex align-center" style={{ gap: "0.3em" }}>
                <ListIcon /> Attendance
              </span>
            </Link>
            <h6 className="mt-3 px-2">Recently Deleted</h6>
            <ul className="nav nav-pills flex-column px-1">
              <li className="nav-item text-dark mb-3 ">
                <Link
                  to="/deleted"
                  className="nav-link text-dark  text-decoration-none py-1"
                >
                  <RestoreFromTrashIcon size={18} className="text-danger" />
                  <span className="d-none d-sm-inline ms-2">Recycle Bin</span>
                </Link>
              </li>
            </ul>
            <Link
              to=""
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "logout" ? "active" : ""
              }`}
              onClick={() => handleItemClick("logout")}
            >
              <i className="fas fa-chart-line fa-fw me-3"></i>
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebarcomponent;
