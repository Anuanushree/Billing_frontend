import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Invoice({ Base_url }) {
  const [date, setDate] = useState(new Date());
  const [formDetails, setFormDetails] = useState([]);

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
  return (
    <>
      <Dashboard />
      <ToastContainer />
      {/* {formDetails.map((form, i) => (
        <div className="table-container">
          <table className="table table-dark table-bordered border border-primary p-2 m-4">
            <thead>
              <tr>
                <th rowSpan={2}>Invoice Date</th>
                <th rowSpan={2}>Invoice No</th>
                <th rowSpan={2}>IMFL Cases</th>
                <th rowSpan={2}>BEER Cases</th>
                <th rowSpan={2}>Total Cases</th>
                <th colSpan={Object.keys(form.Beer_size).length + 2}>
                  Beer Sale
                </th>
                <th colSpan={Object.keys(form.IMFS_sie).length + 2}>
                  IMFS Sale
                </th>
                <th rowSpan={2}>Total bottle</th>
                <th rowSpan={2}>Total Amount</th>
              </tr>
              <tr>
                {Object.keys(form.Beer_size).map((size, index) => (
                  <th key={index}>{size}</th>
                ))}
                <th>Total</th>
                <th>Amount </th>
                {Object.keys(form.IMFS_sie).map((size, index) => (
                  <th key={index}>{size}</th>
                ))}
                <th>Total</th>
                <th>Amount </th>
              </tr>
            </thead>
            <tbody>
              {form.map((data, index) => (
                <tr key={index}>
                  <td>{data.Date}</td>
                  <td>{data.Invoice}</td>
                  <td>{data.IMFS_case}</td>
                  <td>{data.Beer_Case}</td>
                  <td>{data.Total_Case}</td>
                  {Object.values(data.Beer_size).map((size, index) => (
                    <td key={index}>{size}</td>
                  ))}
                  <td>{data.Beer_total_bottle}</td>
                  <td>{data.Beer_total_value}</td>
                  {Object.values(data.IMFS_sie).map((size, index) => (
                    <td key={index}>{size}</td>
                  ))}
                  <td>{data.IMFS_total_bottle}</td>
                  <td>{data.IMFS_total_value}</td>
                  <td>{data.Total_Bottle}</td>
                  <td>{data.Total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))} */}
      <div>
        {formDetails.map((form, i) => (
          <div key={i} className="table-container">
            <table
              key={i}
              className="table table-dark table-bordered border border-primary p-2 m-4"
            >
              <thead>
                <tr>
                  <th rowSpan={2}>Invoice Date</th>
                  <th rowSpan={2}>Invoice No</th>
                  <th rowSpan={2}>IMFL Cases</th>
                  <th rowSpan={2}>BEER Cases</th>
                  <th rowSpan={2}>Total Cases</th>
                  <th colSpan={Object.keys(form.Beer_size).length + 2}>
                    Beer Sale
                  </th>
                  <th colSpan={Object.keys(form.IMFS_sie).length + 2}>
                    IMFS Sale
                  </th>
                  <th rowSpan={2}>Total bottle</th>
                  <th rowSpan={2}>Total Amount</th>
                </tr>
                <tr>
                  {Object.keys(form.Beer_size).map((size, index) => (
                    <th key={index}>{size}</th>
                  ))}
                  <th>Total</th>
                  <th>Amount</th>
                  {Object.keys(form.IMFS_sie).map((size, index) => (
                    <th key={index}>{size}</th>
                  ))}
                  <th>Total</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{form.Date}</td>
                  <td>{form.Invoice}</td>
                  <td>{form.IMFS_case}</td>
                  <td>{form.Beer_Case}</td>
                  <td>{form.Total_Case}</td>
                  {Object.values(form.Beer_size).map((size, index) => (
                    <td key={index}>{size}</td>
                  ))}
                  <td>{form.Beer_total_bottle}</td>
                  <td>{form.Beer_total_value}</td>
                  {Object.values(form.IMFS_sie).map((size, index) => (
                    <td key={index}>{size}</td>
                  ))}
                  <td>{form.IMFS_total_bottle}</td>
                  <td>{form.IMFS_total_value}</td>
                  <td>{form.Total_Bottle}</td>
                  <td>{form.Total_amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}

export default Invoice;
("");
