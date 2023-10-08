import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebarcomponent() {
  const [activeItem, setActiveItem] = useState("dashboard"); // Initialize with the default active item

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <>
      <nav
        id="sidebarMenu"
        className="collapse d-lg-block sidebar collapse bg-white"
        style={{ width: "15vw", height: "93.5vh" }}
      >
        <div className="position-sticky">
          <div className="list-group list-group-flush mx-3 mt-4">
            <Link
              to=""
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleItemClick("dashboard")}
            >
              <i className="fas fa-tachometer-alt fa-fw me-3"></i>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/"
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "students" ? "active" : ""
              }`}
              onClick={() => handleItemClick("students")}
            >
              <i className="fas fa-chart-area fa-fw me-3"></i>
              <span>Students</span>
            </Link>
            <Link
              to="/courses"
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "courses" ? "active" : ""
              }`}
              onClick={() => handleItemClick("courses")}
            >
              <i className="fas fa-lock fa-fw me-3"></i>
              <span>Courses</span>
            </Link>
            <Link
              to=""
              className={`list-group-item list-group-item-action py-2 ripple ${
                activeItem === "attendance" ? "active" : ""
              }`}
              onClick={() => handleItemClick("attendance")}
            >
              <i className="fas fa-chart-line fa-fw me-3"></i>
              <span>Attendance</span>
            </Link>
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
