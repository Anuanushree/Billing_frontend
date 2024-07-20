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
      console.log(filtered);
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
      const response = await axios.get(`${Base_url}/user/getData`, headers);

      const rData = response.data.filter(
        (item) =>
          item.updatedAt.split("T")[0] === today && item.Receipt_bottle > 0
      );

      console.log(rData);
      setReceipt(rData);
      receiptCase(rData);
      const filteredData = response.data.filter((f) => f.Total_bottle > 0);
      // console.log(filteredData);
      setData(filteredData);
      processSalesData(filteredData);
    };
    get();
  }, [Base_url, headers]);

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
    localStorage.setItem(`submitClicked-${today}`, "true");
    try {
      console.log("save button clicked");
      const res = await axios.post(
        `${Base_url}/user/dailyData`,
        formdetail,
        headers
      );
      console.log(res.data);
      toast.success("Successfully submitted");
      get();
    } catch (error) {
      console.log("Error in submitting the form:", error);
      toast.warning("Something went wrong while submitting the form");
    } finally {
      setFormDisable(true);
    }
    setShowData(true);
  };

  // const handlesave = async () => {
  //   try {
  //     console.log("save button clicked");
  //     const res = await axios.post(
  //       `${Base_url}/user/dailyData`,
  //       formdetail,
  //       headers
  //     );
  //     console.log(res.data);
  //     toast.success("Successfully submitted");
  //     get();
  //   } catch (error) {
  //     console.log("Error in submitting the form:", error);
  //     toast.warning("Something went wrong while submitting the form");
  //   } finally {
  //     setFormDisable(true);
  //   }
  // };
  return (
    <div id="wrapper">
      <Dashboard />
      <>
        {!showData && (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
        {showData && (
          <TableContainer
            component={Paper}
            className="m-4"
            style={{ width: "500px" }}
          >
            <Table>
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
