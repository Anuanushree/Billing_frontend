import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function AllData({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [date, setDate] = useState();
  const [search, setSearch] = useState(true);
  const [data, setData] = useState([]);

  function exportToExcel(data) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "export.xlsx");
  }

  const handleClick = () => {
    exportToExcel(data);
  };

  const token = localStorage.getItem("token");
  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    const get = async () => {
      const response = await axios.get(
        `${Base_url}/user/getdailyData`,
        headers
      );
      // console.log(response.data);
      setFormDetails(response.data);
      setData(response.data);
      console.log(formDetails);
    };
    get();
  }, []);

  const handleSearch = async () => {
    console.log(date);
    const filt = data.filter((d) => d.updatedAt.substring(0, 10) == date);
    setFormDetails(filt);
    console.log(filt);
  };

  const totalClosingValue = formDetails.reduce((total, item) => {
    return total + item.Closing_value;
  }, 0);
  const totalOpeningBottle = formDetails.reduce((total, item) => {
    return total + item.Opening_bottle;
  }, 0);
  const totalReciptBottle = formDetails.reduce((total, item) => {
    return total + item.Receipt_bottle;
  }, 0);
  const totalOpeningValue = formDetails.reduce((total, item) => {
    return total + item.Opening_value;
  }, 0);
  const totalReceiptValue = formDetails.reduce((total, item) => {
    return total + item.Receipt_value;
  }, 0);
  const totalSalesBottle = formDetails.reduce((total, item) => {
    return total + item.Sales_bottle;
  }, 0);
  const totalSalesValue = formDetails.reduce((total, item) => {
    return total + item.Sale_value;
  }, 0);
  const totalClosingBottle = formDetails.reduce((total, item) => {
    return total + item.Closing_bottle;
  }, 0);
  const totalValue = formDetails.reduce((total, item) => {
    return total + item.Total_value;
  }, 0);
  const totalBottle = formDetails.reduce((total, item) => {
    return total + item.Total_bottle;
  }, 0);
  const totalCase = formDetails.reduce((total, item) => {
    return total + item.Case;
  }, 0);
  const totalLoose = formDetails.reduce((total, item) => {
    return total + item.Loose;
  }, 0);

  function exportToExcel(data) {
    const cleanedData = data.map((item) => {
      const { _id, __v, updatedAt, ...rest } = item;
      return rest;
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "export.xlsx");
  }
  const handleAllDate = () => {
    setFormDetails(data);
    setDate(Date.now());
  };
  return (
    <>
      <Dashboard />
      <div></div>
      <table className="table table-dark table-bordered border border-primary p-2 m-4">
        <thead>
          <tr>
            <th>
              {" "}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </th>
            <th>
              <button onClick={handleSearch}>Search</button>
            </th>
            <th colSpan={3}>
              <button onClick={handleAllDate}>All data</button>
            </th>
            <th colSpan={6}>
              <button onClick={handleClick}>Export to Excel</button>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Item code</th>
            <th>Size</th>
            <th>MRP</th>
            <th>Opening Bottle</th>
            <th>Opening value</th>
            <th>Receipt Bottle</th>
            <th>Receipt value</th>
            <th>Total value</th>
            <th>Total Bottle</th>
            <th>Case</th>
            <th>Loose</th>

            <th>Closing bottle</th>
            <th>Sales Bottle</th>
            <th>Sales Value</th>

            <th>Closing value</th>
            <th>Item type</th>
          </tr>
        </thead>

        {formDetails.map((d, i) => (
          <tbody key={i}>
            <tr>
              <td>{i + 1}</td>
              <td>{d.Date}</td>
              <td>{d.Description}</td>
              <td>{d.Item_Code}</td>
              <td>{d.Size}</td>
              <td>{d.MRP_Value}</td>
              <td>{d.Opening_bottle}</td>
              <td>{d.Opening_value}</td>
              <td>{d.Receipt_bottle}</td>
              <td>{d.Receipt_value}</td>
              <td>{d.Total_value}</td>
              <td>{d.Total_bottle}</td>
              <td>{d.Case}</td>
              <td>{d.Loose}</td>

              <td>{d.Closing_bottle}</td>
              <td>{d.Sales_bottle} </td>
              <td>{d.Sale_value}</td>
              <td>{d.Closing_value}</td>
              <td>{d.Item_type}</td>
            </tr>
          </tbody>
        ))}

        <tfoot>
          <tr>
            <td colSpan={5}>Total</td>
            <td>{totalOpeningBottle}</td>
            <td>{totalOpeningValue}</td>
            <td>{totalReciptBottle}</td>
            <td>{totalReceiptValue}</td>
            <td>{totalValue}</td>
            <td>{totalBottle}</td>
            <td>{totalCase}</td>
            <td>{totalLoose}</td>

            <td>{totalClosingBottle}</td>
            <td>{totalSalesBottle}</td>
            <td>{totalSalesValue}</td>
            <td>{totalClosingValue}</td>
          </tr>
          <tr></tr>
        </tfoot>
      </table>
    </>
  );
}

export default AllData;
