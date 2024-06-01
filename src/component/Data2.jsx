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
  // console.log(formDetails);
  // const productWiseSales = formDetails.reduce((acc, item) => {
  //   const { Product, Closing_value } = item;
  //   if (!acc[Product]) {
  //     acc[Product] = 0;
  //   }
  //   acc[Product] += Closing_value;
  //   return acc;
  // }, {});
  // console.log(productWiseSales);

  const calculateProductWiseSale_value = () => {
    const productWiseSale_value = {};

    // Iterate over formDetails array
    formDetails.forEach((item) => {
      const { Product, Sale_value } = item;
      if (Product && Sale_value) {
        // Check if the product already exists in the productWiseClosingSale object
        if (productWiseSale_value[Product]) {
          productWiseSale_value[Product] += Sale_value;
        } else {
          productWiseSale_value[Product] = Sale_value;
        }
      }
    });

    return productWiseSale_value;
  };

  const productWiseSale_value = calculateProductWiseSale_value();
  console.log(productWiseSale_value);
  const totalSale_value = formDetails.reduce((total, item) => {
    // Check if Closing_value is a valid number
    const Salevalue = parseFloat(item.Sale_value);
    if (!isNaN(Salevalue)) {
      return total + Salevalue;
    } else {
      // If Closing_value is not a valid number, return the current total
      return total;
    }
  }, 0);
  console.log(totalSale_value);
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
        {Object.entries(productWiseSale_value).map((d, i) => (
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
            <td>{totalSale_value}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default Data2;
