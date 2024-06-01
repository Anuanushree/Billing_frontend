// import React from 'react'
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [profile, setprofile] = useState([]);
  const navigate = useNavigate();
  const hanldleLogout = (event) => {
    event.preventDefault();
    // localStorage.removeItem(token);
    // localStorage.removeItem(id);
    // localStorage.removeItem(totalSaving);

    navigate("/");
  };

  return (
    <div>
      {/* <h2 className='text-right' id='headingStyle'>admin <span><a href='/userlist'>
                <i class="fa fa-user" aria-hidden="true"></i></a></span></h2> */}

      <div id="wrapper">
        <ul
          className="navbar-nav bg-gradient bg sidebar sidebar-dark accordion"
          id="accordionSidebar"
        >
          <a className="sidebar-brand d-flex align-items-center justify-content-center">
            <div className="sidebar-brand-icon rotate-n-15">
              <br />
              <br />
              <a>
                <i class="fa fa-user icon" aria-hidden="true"></i>
              </a>
              <p className="dashboard-user">{profile.username}</p>
            </div>
            <div className="sidebar-brand-text mx-3"></div>
          </a>
          <br />
          <br />
          <li className="nav-item active">
            <Link className="nav-link" to="/excelform">
              <i className="far fa-id-badge" style={{ fontSize: "20px" }}></i>
              {/* <FontAwesomeIcon icon={faTachometerAlt} /> */}
              <span>Inward</span>
            </Link>
          </li>

          <hr className="sidebar-divider"></hr>
          <li className="nav-item ">
            <Link className="nav-link" to="/exceldata">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Billing</span>
            </Link>
          </li>
          <hr className="sidebar-divider"></hr>
          <li className="nav-item ">
            <Link className="nav-link" to="/dailyReport">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>sales report</span>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/Report">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>total value </span>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/itemMaster">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Item Master</span>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/data">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Daily Statement</span>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/SaleReport">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Report</span>
            </Link>
          </li>
          <li className="nav-item ">
            <Link className="nav-link" to="/invoice">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>Invoice Data</span>
            </Link>
          </li>
          <li className="nav-item ">
            <div className="nav-link">
              <i style={{ fontSize: "20px" }}></i>
              <span onClick={hanldleLogout}>Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
