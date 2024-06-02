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
      <div>
        <div className="table-container">
          <table className="table table-dark table-bordered border border-primary p-2 m-4">
            <thead>
              <tr>
                <th rowSpan={2}>Invoice Date</th>
                <th rowSpan={2}>Invoice No</th>
                <th rowSpan={2}>IMFL Cases</th>
                <th rowSpan={2}>BEER Cases</th>
                <th rowSpan={2}>Total Cases</th>
                <th colSpan={6}>IMFS Sale</th>
                <th colSpan={4}>Beer Sale</th>
                <th rowSpan={2}>Total bottle</th>
                <th rowSpan={2}>Total Amount</th>
              </tr>
              <tr>
                <th>1000</th>
                <th>750</th>
                <th>375</th>
                <th>180</th>
                <th>Total</th>
                <th>Amount</th>

                <th>650</th>
                <th>325</th>

                <th>Total</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {formDetails.map((d) => (
                <tr>
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
