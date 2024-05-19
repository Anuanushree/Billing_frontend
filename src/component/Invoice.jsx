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
      {/* <div className="table-container">
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
          <tfoot></tfoot>
        </table>
      </div> */}
      <div className="table-container">
        <table className="table table-dark table-bordered border border-primary p-2 m-4">
          <thead>
            <tr>
              <th>Invoice Date</th>
              <th>Invoice No</th>
              <th>IMFL Cases</th>
              <th>BEER Cases</th>
              <th>Total Cases</th>
              <th>1000</th>
              <th>750</th>
              <th>375</th>
              <th>180</th>
              <th>Total Bottles</th>
              <th>Total Invoice Amount</th>
              <th>650</th>
              <th>500</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {formDetails.map((data, index) => (
              <tr key={index}>
                <td>{data.date}</td>
                <td>{data.Invoice}</td>
                <td>{data.IMFS_case}</td>
                <td>{data.Beer_Case}</td>
                <td>{data.Total_Case}</td>
                {/* <td>{beerSize}</td> */}
                {/* <td>{Object.values(data.Beer_size[0])}</td> */}
                {Object.entries(data.Beer_size).map((key, value) => (
                  <td>{key === "650" ? value : 0}</td>
                ))}
                <td>{data.Beer_size[1]}</td>
                <td>{data["180"]}</td>
                <td>{data["Total Bottles"]}</td>
                <td>{data["Total Invoice Amount"]}</td>
                <td>{data["650"]}</td>
                <td>{data["500"]}</td>
                <td>{data["Total Amount"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div className="table-container">
        <table className="table table-dark table-bordered border border-primary p-2 m-4">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Opening Bottle</th>
              <th>Opening Value</th>
              <th>Receipt Bottle</th>
              <th>Receipt Value</th>
              <th>Total Bottle</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {formDetails &&
              Object.entries(formDetails).map(([product, details], i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td rowSpan={Object.keys(details.Beer_size).length + 1}>
                      {product}
                    </td>
                    <td>-</td>
                    <td>{details.Beer_Case}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{details.Beer_total_bottle}</td>
                    <td>{details.Beer_total_value}</td>
                  </tr>
                  {details.Beer_size &&
                    Object.entries(details.Beer_size).map(
                      ([size, count], j) => (
                        <tr key={j}>
                          <td>-</td>
                          <td>{size}</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>{count}</td>
                          <td>-</td>
                        </tr>
                      )
                    )}
                </React.Fragment>
              ))}
            {formDetails &&
              Object.entries(formDetails).map(([product, details], i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td rowSpan={Object.keys(details.IMFS_size).length + 1}>
                      {product}
                    </td>
                    <td>-</td>
                    <td>{details.IMFS_case}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{details.IMFS_total_bottle}</td>
                    <td>{details.IMFS_total_value}</td>
                  </tr>
                  {details.IMFS_size &&
                    Object.entries(details.IMFS_size).map(
                      ([size, count], j) => (
                        <tr key={j}>
                          <td>-</td>
                          <td>{size}</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>{count}</td>
                          <td>-</td>
                        </tr>
                      )
                    )}
                </React.Fragment>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2">Total</td>
              <td>{formDetails && formDetails.Total_Case}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>{formDetails && formDetails.Total_Bottle}</td>
              <td>{formDetails && formDetails.Total_amount}</td>
            </tr>
          </tfoot>
        </table>
      </div> */}
    </>
  );
}

export default Invoice;
("");
