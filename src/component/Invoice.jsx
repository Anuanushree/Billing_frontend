import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

function Invoice({ Base_url }) {
  const [date, setDate] = useState(new Date());
  const [formDetails, setFormDetails] = useState([]);
  const [editableContent, setEditableContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const token = localStorage.getItem("token");
  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    const get = async () => {
      const response = await axios.get(`${Base_url}/user/getinvoice`, headers);
      console.log(response.data);
      setFormDetails(response.data);
    };
    get();
  }, []);
  console.log(formDetails);
  // console.log(formDetails);
  // console.log(formDetails.data.Date);

  const handleSearch = async () => {
    console.log("search");
    console.log(date);
    const fil = formDetails.filter((d) => d.Date.substring(0, 10) == date);
    // setFormDetails(fil);
    console.log(fil);
  };

  const handleDoubleClick = (content) => {
    setIsEditing(true);
    setEditableContent(content);
  };

  const handleContentChange = (e) => {
    setEditableContent(e.target.value);
  };

  const handleBlur = async () => {
    setIsEditing(false);
    toast.success("Content updated successfully");
  };
  const handleSeacrhDate = async () => {
    const getData = async () => {
      let response;
      if (fromDate && toDate) {
        const dateSearch = {
          fromDate,
          toDate,
        };
        response = await axios.post(`${Base_url}/user/getInvoiceSearch`, {
          dateSearch,
        });
        console.log(response.data, "resposme");
      }
      setFormDetails(response.data);
    };
    getData();
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const exportToExcel = () => {
    const data = formDetails.map((item) => [
      formatDate(item.Date),
      item.Invoice,
      // new Date(item.Date).toLocaleDateString("en-GB"),
      item.IMFS_case,
      item.Beer_Case,
      item.Total_Case,
      item.IMFS_sie && (item.IMFS_sie["1000"] ? item.IMFS_sie["1000"] : 0),
      item.IMFS_sie && (item.IMFS_sie["750"] ? item.IMFS_sie["750"] : 0),
      item.IMFS_sie && (item.IMFS_sie["375"] ? item.IMFS_sie["375"] : 0),
      item.IMFS_sie && (item.IMFS_sie["180"] ? item.IMFS_sie["180"] : 0),
      item.IMFS_total_bottle,
      item.IMFS_total_value,
      item.Beer_size && (item.Beer_size["650"] ? item.Beer_size["650"] : 0),
      item.Beer_size && (item.Beer_size["500"] ? item.Beer_size["500"] : 0),
      item.Beer_size && (item.Beer_size["325"] ? item.Beer_size["325"] : 0),
      item.Beer_total_bottle,
      item.Beer_total_value,
      item.Total_Bottle,
      item.Total_amount,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([
      [
        { value: "S.no", rowspan: 2 },
        { value: "Invoice Date", rowspan: 2 },
        { value: "STOCK TRANSFER IN CASES", colspan: 4 },
        { value: "STOCK TRANSFER IN BOTTELS IMFL", colspan: 6 },
        { value: "STOCK TRANSFER IN BOTTLES IN BEAR", colspan: 5 },
        { value: "Total bottle", rowspan: 2 },
        { value: "Total Amount", rowspan: 2 },
      ],
      [
        "Invoice Date",
        "Invoice",
        "IMFL Cases",
        "BEER Cases",
        "Total Cases",
        "1000",
        "750",
        "375",
        "180",
        "IMFS Total Bottle",
        "IMFS Total Value",
        "Beer 650",
        "Beer 500",
        "Beer 325",
        "Beer Total Bottle",
        "Beer Total Value",
        "Total Bottle",
        "Total Amount",
      ],
      ...data,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice Data");

    XLSX.writeFile(wb, "invoice_data.xlsx");
  };

  return (
    <>
      <Dashboard />
      <ToastContainer />
      <div>
        <div className="table-container">
          <table className="table table-dark table-bordered border border-primary p-2 m-4">
            <thead>
              <tr>
                <th colSpan={4}>
                  {" "}
                  <div className="form-group">
                    <label>From Date:</label>
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </th>
                <th colSpan={4}>
                  <div className="form-group">
                    <span>
                      <label>To Date:</label>

                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="form-control"
                      />
                    </span>
                  </div>
                </th>
                <th colSpan={11}>
                  <button onClick={handleSeacrhDate}>Search</button>
                </th>
                <th>
                  {" "}
                  <button onClick={exportToExcel}>Export to Excel</button>
                </th>
              </tr>
              <tr>
                <th colSpan={20}>
                  {/* Tamil Nadu State Marketing Corporation Ltd - Chennai (South)
                  District, Chennai - 58. Form-II for thr period from 01.06.2021
                  to 30.06.2021 SHOP NO : 928 */}
                  <div
                    onDoubleClick={() =>
                      handleDoubleClick("Your initial content")
                    }
                    onBlur={handleBlur}
                    contentEditable={isEditing}
                  >
                    Tamil Nadu State Marketing Corporation Ltd - Chennai (South)
                    District, Chennai - 58. Form-II for thr period from
                    01.06.2021 to 30.06.2021 SHOP NO : 928
                  </div>
                </th>
              </tr>
              <tr>
                <th rowSpan={2}>S.no</th>
                <th rowSpan={2}>Invoice Date</th>
                {/* <th rowSpan={2}>Invoice No</th>
                <th rowSpan={2}>IMFL Cases</th>
                <th rowSpan={2}>BEER Cases</th> */}
                <th colSpan={4}>STOCK TRANSFER IN CASES</th>
                <th colSpan={6}>STOCK TRANSFER IN BOTTELS IMFL</th>
                <th colSpan={5}>STOCK TRANSFER IN BOTTLES IN BEAR</th>
                <th rowSpan={2}>Total bottle</th>
                <th rowSpan={2}>Total Amount</th>
              </tr>
              <tr>
                <th>Invoice No</th>
                <th>IMFL Cases</th>
                <th>BEER Cases</th>
                <th>Total Cases</th>
                <th>1000</th>
                <th>750</th>
                <th>375</th>
                <th>180</th>
                <th>Total</th>
                <th>Amount</th>

                <th>650</th>
                <th>500</th>
                <th>325</th>

                <th>Total</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {formDetails.map((d, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{new Date(d.Date).toLocaleDateString("en-GB")}</td>
                  <td>{d.Invoice}</td>
                  <td>{d.IMFS_case}</td>
                  <td>{d.Beer_Case}</td>
                  <td>{d.Total_Case}</td>
                  <td>
                    {d.IMFS_sie &&
                      (d.IMFS_sie["1000"] ? d.IMFS_sie["1000"] : 0)}
                  </td>
                  <td>
                    {d.IMFS_sie && (d.IMFS_sie["750"] ? d.IMFS_sie["750"] : 0)}
                  </td>
                  <td>
                    {d.IMFS_sie && (d.IMFS_sie["375"] ? d.IMFS_sie["375"] : 0)}
                  </td>
                  <td>
                    {d.IMFS_sie && (d.IMFS_sie["180"] ? d.IMFS_sie["180"] : 0)}
                  </td>
                  <td>{d.IMFS_total_bottle}</td>
                  <td>{d.IMFS_total_value}</td>

                  <td>
                    {d.Beer_size &&
                      (d.Beer_size["650"] ? d.Beer_size["650"] : 0)}
                  </td>
                  <td>
                    {d.Beer_size &&
                      (d.Beer_size["500"] ? d.Beer_size["500"] : 0)}
                  </td>
                  <td>
                    {d.Beer_size &&
                      (d.Beer_size["325"] ? d.Beer_size["325"] : 0)}
                  </td>
                  <td>{d.Beer_total_bottle}</td>
                  <td>{d.Beer_total_value}</td>
                  <td>{d.Total_Bottle}</td>
                  <td>{d.Total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Invoice;
("");
