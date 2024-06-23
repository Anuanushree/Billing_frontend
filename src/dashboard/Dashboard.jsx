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
  const [data, setdata] = useState([]);
  const navigate = useNavigate();
  const hanldleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem(token);
    localStorage.removeItem(id);
    navigate("/");
  };

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };
  var get = async () => {
    const response = await axios.get(`${Base_url}/user/getData`, headers);
    // console.log(response.data);
    // const fil = response.data.filter((f) => f.Total_bottle > 0);
    setdata(response.data);
  };
  const exportToExcels = (data) => {
    const groupedData = {};

    // Group data by 'Product'
    data.forEach((item) => {
      const productName = item.Product || "Unknown Product";

      if (!groupedData[productName]) {
        groupedData[productName] = {
          data: [],
          totalBottles: 0,
          totalValue: 0,
        };
      }

      const totalBottle = item.Closing_bottle || 0;
      const totalValue = item.Closing_value || 0;

      groupedData[productName].data.push({
        "Brand Name": item.Description || "",
        "Item Code": item.Item_Code,
        Size: item.Size || "",
        "New Rate": item.MRP_Value || "",
        "Closing Bottles": totalBottle,
        "Closing Values": totalValue,
      });

      groupedData[productName].totalBottles += totalBottle;
      groupedData[productName].totalValue += totalValue;
    });

    const dataForExcel = [];

    // Add header content
    dataForExcel.push(["TAMIL NADU STATE MARKETING CORPORATION LIMITED"]);
    dataForExcel.push([
      "B-4, Ambattur Industrial Estate, Chennai (South) District, Chennai - 58.",
    ]);
    dataForExcel.push(["CLOSING STOCK DETAILS AS ON 30 JUNE 2021 SHOP NO 928"]);
    dataForExcel.push([
      "Brand Name",
      "Item Code",
      "Size",
      "New Rate",
      "Closing Bottles",
      "Closing Values",
    ]);

    let grandTotalBottles = 0;
    let grandTotalValue = 0;

    // Add data for each product
    for (const productName in groupedData) {
      groupedData[productName].data.forEach((item) => {
        dataForExcel.push([
          item["Brand Name"],
          item["Item Code"],
          item.Size,
          item["New Rate"],
          item["Closing Bottles"],
          item["Closing Values"],
        ]);
      });

      // Add product-wise total
      dataForExcel.push([
        `TOTAL ${productName.toUpperCase()}`,
        "",
        "",
        "",
        groupedData[productName].totalBottles,
        groupedData[productName].totalValue,
      ]);

      // Update grand totals
      grandTotalBottles += groupedData[productName].totalBottles;
      grandTotalValue += groupedData[productName].totalValue;

      // Add an empty row for separation
      dataForExcel.push([]);
    }

    // Add product-wise totals
    dataForExcel.push(["PRODUCT-WISE TOTALS"]);
    for (const productName in groupedData) {
      dataForExcel.push([
        productName.toUpperCase(),
        "",
        "",
        "",
        groupedData[productName].totalBottles,
        groupedData[productName].totalValue,
      ]);
    }
    dataForExcel.push([]);

    // Add grand total at the end
    dataForExcel.push([
      "GRAND TOTAL",
      "",
      "",
      "",
      grandTotalBottles,
      grandTotalValue,
    ]);

    // Add footer
    dataForExcel.push(["", "", "", "", ""]);
    dataForExcel.push([
      "Verification Supervisor Signature",
      "",
      "",
      "",
      "Shop Supervisor Signature",
    ]);

    // Create a new workbook and sheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
    worksheet["!cols"] = [
      { wch: 50 }, // Width of the "Brand name" column
      { wch: 15 }, // Width of the "Item code" column
      { wch: 10 }, // Width of the "Size" column
      { wch: 10 }, // Width of the "MRP" column
      { wch: 15 }, // Width of the "Total bottle" column
      { wch: 15 }, // Width of the "Total value" column
    ];
    // Append sheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Details");

    // Save workbook as Excel file
    XLSX.writeFile(workbook, "Daily_Stock_Details.xlsx");
  };
  const handleClick = () => {
    exportToExcels(data);
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
              <span>Sales value </span>
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
            <Link className="nav-link" to="/pv_report ">
              <i class="fas fa-poll icon" style={{ fontSize: "20px" }}></i>
              <span>PV report</span>
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
