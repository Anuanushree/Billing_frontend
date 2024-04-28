import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "../dashboard/Dashboard";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function Data2({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [data, setData] = useState([]);
  const [date, setDate] = useState();
  const [search, setSearch] = useState(true);
  // const [data, setData] = useState([]);

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
    };
    get();
  }, []);

  const productWiseSales = formDetails.reduce((acc, item) => {
    const { Product, Closing_value } = item;
    if (!acc[Product]) {
      acc[Product] = 0;
    }
    acc[Product] += Closing_value;
    return acc;
  }, {});
  console.log(productWiseSales);

  const totalClosingValue = formDetails.reduce((total, item) => {
    return total + item.Closing_value;
  }, 0);

  const handleSearch = async () => {
    console.log(date);
    const filt = data.filter((d) => d.Date.substring(0, 10) == date);
    setFormDetails(filt);
    console.log(formDetails);
  };
  const handleAllDate = () => {
    setFormDetails(data);
    setDate(Date.now());
  };
  return (
    <>
      <Dashboard />
      <table className="table table-dark table-bordered border border-primary p-2 m-4">
        <thead>
          <tr>
            <th>
              <button onClick={handleAllDate}>All data</button>
            </th>
            <th>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <button onClick={handleSearch}>Search</button>
            </th>

            <th>
              <button onClick={handleClick}>Export to Excel</button>
            </th>
          </tr>
          <tr>
            <th>S.no</th>

            <th>Product</th>
            <th>Sale Value</th>
          </tr>
        </thead>
        {Object.entries(productWiseSales).map((d, i) => (
          <tbody key={i}>
            <tr>
              <td>{i + 1}</td>

              <td>{d[0]}</td>
              <td>{d[1]}</td>
            </tr>
          </tbody>
        ))}

        <tfoot>
          <tr>
            <td colSpan={2}>Total</td>
            <td>{totalClosingValue}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default Data2;
