import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import Dashboard from "../dashboard/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";

function SalesMessage({ Base_url }) {
  const [data, setData] = useState([]);
  const [salesData, setSalesData] = useState({});
  const [closingData, setClosingData] = useState({});
  const [receipt, setReceipt] = useState([]);
  const [totalBeerValue, setTotalBeerValue] = useState(0);
  const [totalImfsValue, setTotalImfsValue] = useState(0);
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [totalClosingValue, setTotalClosingValue] = useState(0);
  const [salesCaseData, setSalesCaseData] = useState({});
  const [receiptData, setReceiptData] = useState({});
  const [beerreceiptData, setBeerReceiptData] = useState({});
  const [beerSalesCaseData, setBeerSalesCaseData] = useState({});
  const [closingValueData, setClosingValueData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [showData, setShowData] = useState(false);

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const headers = {
    headers: { authorization: `${token}` },
  };
  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const get1 = async () => {
      const response = await axios.get(`${Base_url}/user/bank`, headers);

      const filtered = response.data.filter(
        (item) => item.Date.split("T")[0] === today
      );

      setFilteredData(filtered);
    };
    get1();
  }, []);

  useEffect(() => {
    const submitClicked = localStorage.getItem(`submitClicked-${today}`);
    if (submitClicked) {
      setShowData(true);
    }
  }, [today]);

  useEffect(() => {
    const get = async () => {
      // const response = await axios.get(`${Base_url}/user/getData`, headers);

      // const rData = response.data.filter(
      //   (item) =>
      //     item.updatedAt.split("T")[0] === today && item.Receipt_bottle > 0
      // );
      const response = await axios.get(
        `${Base_url}/user/getdailyData`,
        headers
      );
      const filt = response.data.filter(
        (d) => d.Date.substring(0, 10) === today
      );
      setReceipt(filt);
      receiptCase(filt);
      const filteredData = response.data.filter((f) => f.Total_bottle > 0);
      // console.log(filteredData);
      setData(filteredData);
      processSalesData(filteredData);
    };
    get();
  }, []);

  const receiptCase = (data) => {
    let receiptcase = { ordinary: 0, medium: 0, premium: 0 };
    let beerReceiptCase = { "325 ML": 0, "500 ML": 0, "650 ML": 0 };

    const imfsSizes = [1000, 750, 375, 180];
    const beerSizes = [325, 500, 650];

    data.forEach((item) => {
      const {
        Size,
        Range,
        Sales_bottle,
        Sale_value,
        Closing_bottle,
        Closing_value,
        Item_type,
        Case,
        Receipt_bottle,
      } = item;

      if (Item_type === "Beer_sale" && beerSizes.includes(Size)) {
        beerReceiptCase[`${Size} ML`] = Receipt_bottle || 0;
      }

      // Process sales cases
      if (Receipt_bottle) {
        if (Range === "Ordinary") {
          receiptCase.ordinary += Receipt_bottle;
        } else if (Range === "Medium") {
          receiptCase.medium += Receipt_bottle;
        } else if (Range === "Premium") {
          receiptCase.premium += Receipt_bottle;
        }
      }
    });
    setReceiptData(receiptcase);
    setBeerReceiptData(beerReceiptCase);
  };

  const processSalesData = (data) => {
    let sales = {};
    let closing = {};
    let totalBeer = 0;
    let totalImfs = 0;
    let totalSales = 0;
    let totalClosing = 0;
    let salesCase = { ordinary: 0, medium: 0, premium: 0 };
    let beerSalesCase = { "325 ML": 0, "500 ML": 0, "650 ML": 0 };
    let closingValue = {
      ordinary: 0,
      medium: 0,
      premium: 0,
      beer: 0,
    };

    const imfsSizes = [1000, 750, 375, 180];
    const beerSizes = [325, 500, 650];

    data.forEach((item) => {
      const {
        Size,
        Range,
        Sales_bottle,
        Sale_value,
        Closing_bottle,
        Closing_value,
        Item_type,
        Case,
        Receipt,
      } = item;

      // Process sales data
      if (!sales[Size]) {
        sales[Size] = 0;
      }
      sales[Size] += Sales_bottle;

      // Process closing data
      if (!closing[Size]) {
        closing[Size] = 0;
      }
      closing[Size] += Closing_bottle;

      // Calculate totals
      totalSales += Sale_value;
      totalClosing += Closing_value;

      if (Item_type === "Beer_sale" && beerSizes.includes(Size)) {
        totalBeer += Sale_value;
        beerSalesCase[`${Size} ML`] = Case || 0;
        if (Size === 325) closingValue.beer325 = Closing_value;
        if (Size === 500) closingValue.beer500 = Closing_value;
        if (Size === 650) closingValue.beer650 = Closing_value;
      } else if (Item_type === "IMFS_sale" && imfsSizes.includes(Size)) {
        totalImfs += Sale_value;
      }

      // Process sales cases
      if (Case) {
        if (Range === "Ordinary") {
          salesCase.ordinary += Case;
        } else if (Range === "Medium") {
          salesCase.medium += Case;
        } else if (Range === "Premium") {
          salesCase.premium += Case;
        }
      }

      // Process receipts

      if (Range) {
        if (Range === "Ordinary") {
          closingValue.ordinary = Closing_value;
        } else if (Range === "Medium") {
          closingValue.medium = Closing_value;
        } else if (Range === "Premium") {
          closingValue.premium = Closing_value;
        } else if (Range === "Beer") {
          closingValue.beer = Closing_value;
        }
      }

      // Update closing values
      if (Item_type === "IMFS_sale" && imfsSizes.includes(Size)) {
        closingValue[`imfs_${Size}`] = Closing_value;
      }
    });

    setSalesData(sales);
    setClosingData(closing);
    setTotalBeerValue(totalBeer);
    setTotalImfsValue(totalImfs);
    setTotalSalesValue(totalSales);
    setTotalClosingValue(totalClosing);
    setSalesCaseData(salesCase);

    setBeerSalesCaseData(beerSalesCase);
    setClosingValueData(closingValue);
  };
  const handleSubmit = async () => {
    // localStorage.setItem(`submitClicked-${today}`, "true");

    try {
      console.log("save button clicked");
      console.log(headers);
      console.log(id);
      const res = await axios.post(`${Base_url}/user/billingUpdate`, { id });
      console.log(res.data);
      toast.success("Successfully submitted");
    } catch (error) {
      console.log("Error in submitting the form:", error);
      toast.warning("Something went wrong while submitting the form");
    }
    setShowData(true);
  };

  const exportToExcel = () => {
    const salesDataArray = [
      ...Object.keys(salesData)
        .filter((key) => [1000, 750, 375, 180].includes(parseInt(key)))
        .map((key) => [`${key} ML`, salesData[key] || 0]),

      ...Object.keys(salesData)
        .filter((key) => [325, 500, 650].includes(parseInt(key)))
        .map((key) => [`BEER ${key} ML`, salesData[key] || 0]),
      ["IMFL VALUE", totalImfsValue],
      ["BEER VALUE", totalBeerValue],
      ...filteredData.flatMap((d) => [
        ["POS CARD", d.Pos],
        ["BANK", d.Bank],
      ]),
      ["sale", totalImfsValue + totalBeerValue],
    ];

    const closingDataArray = [
      ...Object.keys(closingData)
        .filter((key) => [1000, 750, 375, 180].includes(parseInt(key)))
        .map((key) => [`${key} ML closing`, closingData[key] || 0]),
      ...Object.keys(closingData)
        .filter((key) => [325, 500, 650].includes(parseInt(key)))
        .map((key) => [`BEER ${key} ML closing`, closingData[key] || 0]),
      ["CLOSING STOCK VALUE", totalClosingValue],
    ];

    const receiptDataArray = [
      ["Receipt ORDINARY case", receiptData.ordinary || 0],
      ["Receipt CASE MEDIUM", receiptData.medium || 0],
      ["Receipt CASE PREMIUM", receiptData.premium || 0],
      ["BEER 325 ML SALES CASE", beerreceiptData["325 ML"] || 0],
      ["BEER 500 ML SALES CASE", beerreceiptData["500 ML"] || 0],
      ["BEER 650 ML SALES CASE", beerreceiptData["650 ML"] || 0],
      [
        "SALES CASE TOTAL",
        (receiptData.ordinary || 0) +
          (receiptData.medium || 0) +
          (receiptData.premium || 0) +
          (beerreceiptData["325 ML"] || 0) +
          (beerreceiptData["500 ML"] || 0) +
          (beerreceiptData["650 ML"] || 0),
      ],
      ["SALES CASE ORDINARY", salesCaseData.ordinary || 0],
      ["SALES CASE MEDIUM", salesCaseData.medium || 0],
      ["SALES CASE PREMIUM", salesCaseData.premium || 0],
      ["BEER 325 ML SALES CASE", beerSalesCaseData["325 ML"] || 0],
      ["BEER 500 ML SALES CASE", beerSalesCaseData["500 ML"] || 0],
      ["BEER 650 ML SALES CASE", beerSalesCaseData["650 ML"] || 0],
      [
        "SALES CASE TOTAL",
        (salesCaseData.ordinary || 0) +
          (salesCaseData.medium || 0) +
          (salesCaseData.premium || 0) +
          (beerSalesCaseData["325 ML"] || 0) +
          (beerSalesCaseData["500 ML"] || 0) +
          (beerSalesCaseData["650 ML"] || 0),
      ],
      ["ORDINARY CLOSING VALUE", closingValueData.ordinary || 0],
      ["MEDIUM CLOSING VALUE", closingValueData.medium || 0],
      ["PREMIUM CLOSING VALUE", closingValueData.premium || 0],
      ["BEER CLOSING VALUE", closingValueData.beer || 0],
      [
        "TOTAL CLOSING VALUE",
        (closingValueData.ordinary || 0) +
          (closingValueData.medium || 0) +
          (closingValueData.premium || 0) +
          (closingValueData.beer || 0),
      ],
    ];

    // Combine all arrays into one
    const combinedDataArray = [
      ...salesDataArray,
      ...closingDataArray,
      ...receiptDataArray,
    ];

    // Create worksheet and apply column widths
    const ws = XLSX.utils.aoa_to_sheet(combinedDataArray);
    ws["!cols"] = [
      { wch: 30 }, // Adjust column widths as needed
      { wch: 30 },
    ];

    // Apply styles to all cells
    const defaultCellStyle = {
      font: { name: "Arial", sz: 12 },
      alignment: { vertical: "center", horizontal: "center" },
    };

    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        if (!ws[cell_ref]) ws[cell_ref] = { t: "s", v: "" }; // if cell does not exist, create it
        ws[cell_ref].s = defaultCellStyle;
      }
    }

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Combined Data");

    // Write workbook to file
    XLSX.writeFile(wb, "sale message.xlsx");
  };

  // Ensure that all referenced data (salesData, closingData, receiptData, etc.) are defined and populated

  return (
    <div id="wrapper">
      <Dashboard />
      <>
        <div>
          {!showData && (
            <>
              <p>once you submit the form,you will see the sale messgae</p>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </>
          )}
        </div>
        {showData && (
          <TableContainer
            component={Paper}
            className="m-4"
            style={{ width: "500px" }}
          >
            <Table>
              <Button
                onClick={exportToExcel}
                variant="contained"
                color="secondary"
              >
                Export to Excel
              </Button>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* IMFS Sizes */}
                {Object.keys(salesData)
                  .filter((key) =>
                    [1000, 750, 375, 180].includes(parseInt(key))
                  )
                  .map((key) => (
                    <TableRow key={key}>
                      <TableCell>{`${key} ML`}</TableCell>
                      <TableCell>{salesData[key] || 0}</TableCell>
                    </TableRow>
                  ))}

                {/* BEER Sizes */}
                {Object.keys(salesData)
                  .filter((key) => [325, 500, 650].includes(parseInt(key)))
                  .map((key) => (
                    <TableRow key={`beer-${key}`}>
                      <TableCell>{`BEER ${key} ML`}</TableCell>
                      <TableCell>{salesData[key] || 0}</TableCell>
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    IMFL VALUE
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {totalImfsValue}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    BEER VALUE
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {totalBeerValue}
                  </TableCell>
                </TableRow>
                {filteredData.map((d) => (
                  <>
                    <TableRow>
                      <TableCell>POS CARD</TableCell>
                      <TableCell>{d.Pos}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>BANK</TableCell>
                      <TableCell>{d.Bank}</TableCell>
                    </TableRow>
                  </>
                ))}

                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>sale</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {totalImfsValue + totalBeerValue}
                  </TableCell>
                </TableRow>

                {Object.keys(closingData)
                  .filter((key) =>
                    [1000, 750, 375, 180].includes(parseInt(key))
                  )
                  .map((key) => (
                    <TableRow key={key}>
                      <TableCell>{`${key} ML closing`}</TableCell>
                      <TableCell>{closingData[key] || 0}</TableCell>
                    </TableRow>
                  ))}

                {/* BEER Sizes */}
                {Object.keys(closingData)
                  .filter((key) => [325, 500, 650].includes(parseInt(key)))
                  .map((key) => (
                    <TableRow key={`beer-${key}`}>
                      <TableCell>{`BEER ${key} ML closing`}</TableCell>
                      <TableCell>{closingData[key] || 0}</TableCell>
                    </TableRow>
                  ))}

                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    CLOSING STOCK VALUE
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {totalClosingValue}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell> Receipt ORDINARY case</TableCell>
                  <TableCell>{receiptData.ordinary || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Receipt CASE MEDIUM</TableCell>
                  <TableCell>{receiptData.medium || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Receipt CASE PREMIUM</TableCell>
                  <TableCell>{receiptData.premium || 0}</TableCell>
                </TableRow>

                {/* Beer Sales Cases */}
                <TableRow>
                  <TableCell>BEER 325 ML SALES CASE</TableCell>
                  <TableCell>{beerreceiptData["325 ML"] || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BEER 500 ML SALES CASE</TableCell>
                  <TableCell>{beerreceiptData["500 ML"] || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BEER 650 ML SALES CASE</TableCell>
                  <TableCell>{beerreceiptData["650 ML"] || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    SALES CASE TOTAL
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {receiptData.ordinary +
                      receiptData.medium +
                      receiptData.premium +
                      beerreceiptData["325 ML"] +
                      beerreceiptData["500 ML"] +
                      beerreceiptData["650 ML"]}
                  </TableCell>
                </TableRow>
                {/* Sales Cases */}
                <TableRow>
                  <TableCell>SALES CASE ORDINARY</TableCell>
                  <TableCell>{salesCaseData.ordinary || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SALES CASE MEDIUM</TableCell>
                  <TableCell>{salesCaseData.medium || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SALES CASE PREMIUM</TableCell>
                  <TableCell>{salesCaseData.premium || 0}</TableCell>
                </TableRow>

                {/* Beer Sales Cases */}
                <TableRow>
                  <TableCell>BEER 325 ML SALES CASE</TableCell>
                  <TableCell>{beerSalesCaseData["325 ML"] || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BEER 500 ML SALES CASE</TableCell>
                  <TableCell>{beerSalesCaseData["500 ML"] || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BEER 650 ML SALES CASE</TableCell>
                  <TableCell>{beerSalesCaseData["650 ML"] || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    SALES CASE TOTAL
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {salesCaseData.ordinary +
                      salesCaseData.medium +
                      salesCaseData.premium +
                      beerSalesCaseData["325 ML"] +
                      beerSalesCaseData["500 ML"] +
                      beerSalesCaseData["650 ML"]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ORDINARY CLOSING VALUE</TableCell>
                  <TableCell>{closingValueData.ordinary || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>MEDIUM CLOSING VALUE</TableCell>
                  <TableCell>{closingValueData.medium || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PREMIUM CLOSING VALUE</TableCell>
                  <TableCell>{closingValueData.premium || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BEER CLOSING VALUE</TableCell>
                  <TableCell>{closingValueData.beer || 0}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    TOTAL CLOSING VALUE
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>
                    {closingValueData.ordinary +
                      closingValueData.medium +
                      closingValueData.premium +
                      closingValueData.beer}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </>
    </div>
  );
}

export default SalesMessage;
