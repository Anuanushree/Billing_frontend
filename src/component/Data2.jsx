import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "../dashboard/Dashboard";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

function Data2({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState(true);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  // const [data, setData] = useState([]);
  // function exportToExcel(data) {
  //   const productWiseSaleValue = calculateProductWiseSaleValue(data);
  //   const total = Object.values(productWiseSaleValue).reduce(
  //     (acc, value) => acc + value,
  //     0
  //   );

  //   const workbook = XLSX.utils.book_new();
  //   const sheetData = [
  //     ["#", "Product", "Total Sales Value"],
  //     ...Object.entries(productWiseSaleValue).map(([product, value], index) => [
  //       index + 1,
  //       product,
  //       value,
  //     ]),
  //     ["Total", "", total],
  //   ];

  //   const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   XLSX.writeFile(workbook, "export.xlsx");
  // }

  function calculateProductWiseSaleValue(data) {
    const productWiseSaleValue = {};

    data.forEach((item) => {
      const { Product, Sale_value } = item;
      if (Product && Sale_value) {
        productWiseSaleValue[Product] =
          (productWiseSaleValue[Product] || 0) + Sale_value;
      }
    });

    return productWiseSaleValue;
  }

  const handleClick = () => {
    exportToExcel(formDetails);
  };

  const token = localStorage.getItem("token");
  const headers = {
    headers: { authorization: `${token}` },
  };
  const handleSearch = async () => {
    console.log(date);
    const filt = data.filter((d) => d.Date.substring(0, 10) == date);
    setFormDetails(filt);
    console.log(formDetails);
  };
  useEffect(() => {
    const get = async () => {
      const response = await axios.get(
        `${Base_url}/user/getdailyData`,
        headers
      );
      const filt = response.data.filter((d) => d.Date.substring(0, 10) == date);
      setFormDetails(filt);
      setData(response.data);
      // Move handleSearch here
    };
    get();
  }, []);

  const handleSeacrhDate = async () => {
    const getData = async () => {
      let response;
      if (fromDate && toDate) {
        const dateSearch = {
          fromDate,
          toDate,
        };
        response = await axios.post(`${Base_url}/user/getdailyDateSearch`, {
          dateSearch,
        });
        console.log(response.data, "resposme");
      }
      setFormDetails(response.data);
      setData(response.data);
    };
    getData();
  };

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

  function exportToExcel() {
    const workbook = XLSX.utils.book_new();

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Product", "Total Sales Value"],
      ...Object.entries(productWiseSale_value).map(([product, value]) => [
        product,
        value,
      ]),
      ["Total", totalSale_value],
    ]);

    // Set column widths
    worksheet["!cols"] = [
      { wpx: 150 }, // Width of the "Product" column
      { wpx: 200 }, // Width of the "Total Sales Value" column
    ];

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Save workbook as Excel file
    XLSX.writeFile(workbook, `Total_Report from ${fromDate} to ${toDate}.xlsx`);
  }

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

  return (
    <>
      <Dashboard />

      <table className="table table-dark table-bordered border border-primary p-2 m-4">
        <thead>
          <tr>
            <td>
              <div className="form-group">
                <label>From Date:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </td>
            <td>
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
            </td>
            <td>
              {" "}
              <button onClick={handleSeacrhDate}>Search</button>
              <button onClick={handleClick}>Export to Excel</button>
            </td>
          </tr>
        </thead>

        {/* <thead>
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

            <th></th>
          </tr>
          <tr>
            <th>S.no</th>

            <th>Product</th>
            <th>Sale Value</th>
          </tr>
        </thead> */}
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
