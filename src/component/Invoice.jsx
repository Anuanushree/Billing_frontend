import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

function Invoice({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [backData, setBackData] = useState([]);
  const [data, setdata] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${Base_url}/user/getinvoice`,
          headers
        );
        setFormDetails(response.data);
        console.log(response.data);
        setBackData(response.data);
        // Assuming response.data is an array of objects
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data from server");
      }
    };

    fetchData();
  }, [Base_url]);
  useEffect(() => {
    get();
  }, []);

  var get = async () => {
    const response = await axios.get(`${Base_url}/user/getData`, headers);
    console.log(response.data);
    // const fil = response.data.filter((f) => f.Total_bottle > 0);
    setdata(response.data);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // const exportToExcels = (data) => {
  //   // Step 1: Group data by 'Product'
  //   const groupedData = data.reduce((acc, item) => {
  //     const { _id, __v, updatedAt, ...rest } = item;
  //     const productName = rest.Product;

  //     if (!acc[productName]) {
  //       acc[productName] = {
  //         data: [],
  //         totalBottles: 0,
  //         totalValue: 0,
  //         totalClosingBottles: 0,
  //       };
  //     }

  //     // Ensure default values of 0 where data is missing
  //     const totalBottle = rest.Closing_bottle || 0;
  //     const totalValue = rest.Closing_value || 0;
  //     // const closingBottle = rest.Closing_bottle || 0;

  //     acc[productName].data.push({
  //       "Brand name": rest.Description || "", // If Description is missing
  //       "Item code": rest.Item_Code || "", // If Item_Code is missing
  //       Size: rest.Size || "", // If Size is missing
  //       MRP: rest.MRP_Value || 0, // If MRP_Value is missing
  //       "Total bottle": totalBottle,
  //       "Total value": totalValue,
  //     });

  //     // Accumulate totals
  //     acc[productName].totalBottles += totalBottle;
  //     acc[productName].totalValue += totalValue;
  //     // Accumulate closing bottles
  //     // acc[productName].totalClosingBottles += closingBottle;

  //     return acc;
  //   }, {});

  //   // Step 2: Prepare data for Excel with grouped data and totals
  //   const dataForExcel = [];

  //   for (const productName in groupedData) {
  //     // Add rows for each item in the product
  //     groupedData[productName].data.forEach((item) => {
  //       dataForExcel.push(item);
  //     });

  //     // Add totals row for the product at the end of each product section
  //     dataForExcel.push({
  //       "Brand name": "TOTAL " + productName.toUpperCase(),
  //       "Item code": "", // Leave blank for totals row
  //       Size: "",
  //       MRP: "",
  //       "Total bottle": groupedData[productName].totalBottles,
  //       "Total value": groupedData[productName].totalValue,
  //       // "Total closing bottle": groupedData[productName].totalClosingBottles,
  //     });

  //     // Add blank row for spacing (optional)
  //     dataForExcel.push({});
  //   }

  //   // Step 3: Calculate grand totals for specific products
  //   const grandTotalBrandy = groupedData["Brandy"]
  //     ? groupedData["Brandy"].totalBottles
  //     : 0;
  //   const grandTotalBeer = groupedData["Beer"]
  //     ? groupedData["Beer"].totalBottles
  //     : 0;
  //   const grandTotalWine = groupedData["Wine"]
  //     ? groupedData["Wine"].totalBottles
  //     : 0;
  //   const grandTotal = grandTotalBrandy + grandTotalBeer + grandTotalWine;

  //   // Step 4: Create Excel workbook and save the file
  //   const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

  //   // Set column widths
  //   worksheet["!cols"] = [
  //     { wch: 40 }, // Width of the "Brand name" column
  //     { wch: 15 }, // Width of the "Item code" column
  //     { wch: 10 }, // Width of the "Size" column
  //     { wch: 10 }, // Width of the "MRP" column
  //     { wch: 15 }, // Width of the "Total bottle" column
  //     { wch: 15 }, // Width of the "Total value" column
  //     { wch: 20 }, // Width of the "Total closing bottle" column
  //   ];

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //   // Step 5: Add the grand total as a separate sheet
  //   const grandTotalSheet = XLSX.utils.json_to_sheet([
  //     { Product: "BRANDY", "Total bottle": grandTotalBrandy },
  //     { Product: "BEER", "Total bottle": grandTotalBeer },
  //     { Product: "WINE", "Total bottle": grandTotalWine },
  //     { Product: "GRAND TOTAL", "Total bottle": grandTotal },
  //   ]);

  //   XLSX.utils.book_append_sheet(workbook, grandTotalSheet, "Grand Total");

  //   // Step 6: Add the closing bottles summary at the end of the main sheet
  //   const closingBottlesSummary = calculateClosingBottles(data);

  //   const closingBottlesData = [
  //     { "Brand name": "Closing Bottles Summary" },
  //     {
  //       "Brand name": "Beer",
  //       "Total closing bottle": closingBottlesSummary.Beer,
  //     },
  //     {
  //       "Brand name": "Wine",
  //       "Total closing bottle": closingBottlesSummary.Wine,
  //     },
  //     {
  //       "Brand name": "Whisky",
  //       "Total closing bottle": closingBottlesSummary.Whisky,
  //     },
  //     {
  //       "Brand name": "Brandy",
  //       "Total closing bottle": closingBottlesSummary.Brandy,
  //     },
  //     {
  //       "Brand name": "Rum",
  //       "Total closing bottle": closingBottlesSummary.Rum,
  //     },
  //     {
  //       "Brand name": "Gin",
  //       "Total closing bottle": closingBottlesSummary.Gin,
  //     },
  //   ];

  //   XLSX.utils.sheet_add_json(worksheet, closingBottlesData, {
  //     origin: -1,
  //     skipHeader: true,
  //   });

  //   // Write the workbook to file
  //   XLSX.writeFile(workbook, `Daily_statement.xlsx`);
  // };

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
  const handleSeacrhDate = async () => {
    if (fromDate && toDate) {
      const dateSearch = {
        fromDate,
        toDate,
      };

      console.log("Date search:", dateSearch);

      try {
        const response = await axios.post(
          `${Base_url}/user/getinvoiceSearch`,
          { dateSearch },
          headers
        );

        console.log("Response data:", response.data);
        console.log(response.data);
        if (response.data) {
          setFormDetails(response.data);
        } else {
          console.error("No data received from the API.");
        }
      } catch (error) {
        console.error("Error fetching date range data:", error);
      }
    } else {
      console.warn("Both fromDate and toDate must be specified.");
    }
  };

  const exportToExcel = () => {
    const data = formDetails.map((item) => [
      formatDate(item.Date),
      item.Invoice,
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

    // Calculate grand totals
    const grandTotals = calculateGrandTotals();

    // Push grand totals as the last row of data
    data.push([
      "Grand Total",
      "",
      grandTotals.IMFS_case,
      grandTotals.Beer_Case,
      grandTotals.Total_Case,
      grandTotals.IMFS_sie_1000,
      grandTotals.IMFS_sie_750,
      grandTotals.IMFS_sie_375,
      grandTotals.IMFS_sie_180,
      grandTotals.IMFS_total_bottle,
      grandTotals.IMFS_total_value,
      grandTotals.Beer_size_650,
      grandTotals.Beer_size_500,
      grandTotals.Beer_size_325,
      grandTotals.Beer_total_bottle,
      grandTotals.Beer_total_value,
      grandTotals.Total_Bottle,
      grandTotals.Total_amount,
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

  const calculateGrandTotals = () => {
    // Initialize totals object
    const totals = {
      Invoice: "Grand Total",
      IMFS_case: 0,
      Beer_Case: 0,
      Total_Case: 0,
      IMFS_sie_1000: 0,
      IMFS_sie_750: 0,
      IMFS_sie_375: 0,
      IMFS_sie_180: 0,
      IMFS_total_bottle: 0,
      IMFS_total_value: 0,
      Beer_size_650: 0,
      Beer_size_500: 0,
      Beer_size_325: 0,
      Beer_total_bottle: 0,
      Beer_total_value: 0,
      Total_Bottle: 0,
      Total_amount: 0,
    };
    // Loop through formDetails to compute sums
    formDetails.forEach((item) => {
      totals.IMFS_case += item.IMFS_case || 0;
      totals.Beer_Case += item.Beer_Case || 0;
      totals.Total_Case += item.Total_Case || 0;
      totals.IMFS_sie_1000 +=
        item.IMFS_sie && item.IMFS_sie["1000"] ? item.IMFS_sie["1000"] : 0;
      totals.IMFS_sie_750 +=
        item.IMFS_sie && item.IMFS_sie["750"] ? item.IMFS_sie["750"] : 0;
      totals.IMFS_sie_375 +=
        item.IMFS_sie && item.IMFS_sie["375"] ? item.IMFS_sie["375"] : 0;
      totals.IMFS_sie_180 +=
        item.IMFS_sie && item.IMFS_sie["180"] ? item.IMFS_sie["180"] : 0;
      totals.IMFS_total_bottle += item.IMFS_total_bottle || 0;
      totals.IMFS_total_value += item.IMFS_total_value || 0;
      totals.Beer_size_650 +=
        item.Beer_size && item.Beer_size["650"] ? item.Beer_size["650"] : 0;
      totals.Beer_size_500 +=
        item.Beer_size && item.Beer_size["500"] ? item.Beer_size["500"] : 0;
      totals.Beer_size_325 +=
        item.Beer_size && item.Beer_size["325"] ? item.Beer_size["325"] : 0;
      totals.Beer_total_bottle += item.Beer_total_bottle || 0;
      totals.Beer_total_value += item.Beer_total_value || 0;
      totals.Total_Bottle += item.Total_Bottle || 0;
      totals.Total_amount += item.Total_amount || 0;
    });

    return totals;
  };

  // Get grand totals object
  const grandTotals = calculateGrandTotals();

  const handleClick = () => {
    exportToExcels(data);
  };

  console.log(data);
  return (
    <div id="wrapper">
      <Dashboard />
      <ToastContainer />

      <div>
        <table>
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
            </td>
            <td>
              {" "}
              <button onClick={exportToExcel}>Export to Excel</button>
            </td>
          </tr>
        </table>

        <div className="table-container">
          <table className="table table-dark table-bordered border border-primary p-2 m-4">
            <thead>
              <tr>
                <th rowSpan={2}>S.no</th>
                <th rowSpan={2}>Invoice Date</th>
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
              {formDetails &&
                formDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{formatDate(item.Date)}</td>
                    <td>{item.Invoice}</td>
                    <td>{item.IMFS_case}</td>
                    <td>{item.Beer_Case}</td>
                    <td>{item.Total_Case}</td>
                    <td>
                      {item.IMFS_sie && item.IMFS_sie["1000"]
                        ? item.IMFS_sie["1000"]
                        : 0}
                    </td>
                    <td>
                      {item.IMFS_sie && item.IMFS_sie["750"]
                        ? item.IMFS_sie["750"]
                        : 0}
                    </td>
                    <td>
                      {item.IMFS_sie && item.IMFS_sie["375"]
                        ? item.IMFS_sie["375"]
                        : 0}
                    </td>
                    <td>
                      {item.IMFS_sie && item.IMFS_sie["180"]
                        ? item.IMFS_sie["180"]
                        : 0}
                    </td>
                    <td>{item.IMFS_total_bottle}</td>
                    <td>{item.IMFS_total_value}</td>
                    <td>
                      {item.Beer_size && item.Beer_size["650"]
                        ? item.Beer_size["650"]
                        : 0}
                    </td>
                    <td>
                      {item.Beer_size && item.Beer_size["500"]
                        ? item.Beer_size["500"]
                        : 0}
                    </td>
                    <td>
                      {item.Beer_size && item.Beer_size["325"]
                        ? item.Beer_size["325"]
                        : 0}
                    </td>
                    <td>{item.Beer_total_bottle}</td>
                    <td>{item.Beer_total_value}</td>
                    <td>{item.Total_Bottle}</td>
                    <td>{item.Total_amount}</td>
                  </tr>
                ))}
            </tbody>
            <tbody className="bg-warning" style={{ backgroundColor: "red" }}>
              <tr className="bg-warning" style={{ backgroundColor: "red" }}>
                <td className="bg-warning" colSpan={3}>
                  {grandTotals.Invoice}
                </td>
                <td className="bg-warning">{grandTotals.IMFS_case}</td>
                <td className="bg-warning">{grandTotals.Beer_Case}</td>
                <td className="bg-warning">{grandTotals.Total_Case}</td>
                <td className="bg-warning">{grandTotals.IMFS_sie_1000}</td>
                <td className="bg-warning">{grandTotals.IMFS_sie_750}</td>
                <td className="bg-warning">{grandTotals.IMFS_sie_375}</td>
                <td className="bg-warning">{grandTotals.IMFS_sie_180}</td>
                <td className="bg-warning">{grandTotals.IMFS_total_bottle}</td>
                <td className="bg-warning">{grandTotals.IMFS_total_value}</td>
                <td className="bg-warning">{grandTotals.Beer_size_650}</td>
                <td className="bg-warning">{grandTotals.Beer_size_500}</td>
                <td className="bg-warning">{grandTotals.Beer_size_325}</td>
                <td className="bg-warning">{grandTotals.Beer_total_bottle}</td>
                <td className="bg-warning">{grandTotals.Beer_total_value}</td>
                <td className="bg-warning">{grandTotals.Total_Bottle}</td>
                <td className="bg-warning">{grandTotals.Total_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
