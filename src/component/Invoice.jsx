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
      <div className="table-container">
        <table className="table table-dark table-bordered border border-primary p-2 m-4">
          <thead>
            <tr>
              <th>Date</th>
              <th> OpeningBottle</th>
              <th>OpeningValue</th>
              <th> ReceiptBottle</th>
              <th>ReceiptValue</th>
              <th>TotalBottle</th>
              <td>TotalValue</td>
            </tr>
          </thead>
          <tbody>
            {formDetails.map((d, i) => (
              <tr key={i}>
                <td>{d.Date}</td>
                <td>{d.OpeningBottle}</td>
                <td>{d.OpeningValue}</td>
                <td>{d.ReceiptBottle}</td>
                <td>{d.ReceiptValue}</td>
                <td>{d.TotalBottle}</td>
                <td>{d.TotalValue}</td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
          <tfoot>
            <tr>{/* <td colSpan={1}>Total</td> */}</tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default Invoice;
("");
