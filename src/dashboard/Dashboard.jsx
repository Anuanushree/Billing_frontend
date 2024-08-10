import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

function Dashboard({ Base_url }) {
  const [profile, setProfile] = useState({});
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.clear();
    navigate("/");
  };

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await axios.get(`${Base_url}/user/getData`, headers);
        setData(response.data);
        setProfile(response.data.profile); // Assuming the profile data is part of the response
      } catch (error) {
        console.error(error);
      }
    };
    getProfileData();
  }, [headers]);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div>
      <div id="wrapper">
        <ul
          className="navbar-nav bg-gradient bg sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <a className="sidebar-brand d-flex align-items-center justify-content-center">
            <div className="sidebar-brand-icon rotate-n-15">
              <br />
              <br />
              <i className="fa fa-user icon" aria-hidden="true"></i>
              <p className="dashboard-user"></p>
            </div>
          </a>
          <br />
          <br />
          <hr className="sidebar-divider"></hr>
          <li className={`nav-item ${isActive("/exceldata")}`}>
            <Link className="nav-link" to="/exceldata">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Billing</span>
            </Link>
          </li>
          <hr className="sidebar-divider"></hr>
          <li className={`nav-item ${isActive("/dailyReport")}`}>
            <Link className="nav-link" to="/dailyReport">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Sales Report</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/Report")}`}>
            <Link className="nav-link" to="/Report">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Sales Value</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/itemMaster")}`}>
            <Link className="nav-link" to="/itemMaster">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Item Master</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/data")}`}>
            <Link className="nav-link" to="/data">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Daily Statement</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/SaleReport")}`}>
            <Link className="nav-link" to="/SaleReport">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Report</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/invoice")}`}>
            <Link className="nav-link" to="/invoice">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Invoice Data</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/pv_report")}`}>
            <Link className="nav-link" to="/pv_report">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>PV Report</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/calc")}`}>
            <Link className="nav-link" to="/calc">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Denomination </span>
            </Link>
          </li>

          <li className={`nav-item ${isActive("/calc")}`}>
            <Link className="nav-link" to="/saleMessage">
              <i className="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>saleMessage</span>
            </Link>
          </li>
          <li className="nav-item">
            <div className="nav-link" onClick={handleLogout}>
              <i
                className="fas fa-sign-out-alt"
                style={{ fontSize: "20px" }}
              ></i>
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
