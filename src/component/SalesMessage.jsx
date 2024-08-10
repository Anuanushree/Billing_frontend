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
} from "@mui/material";
import Dashboard from "../dashboard/Dashboard";

function SalesMessage({ Base_url }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [today, setToday] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    // Set today's date
    setToday(new Date().toISOString().split("T")[0]);

    const getData = async () => {
      try {
        const response = await axios.get(`${Base_url}/user/getData`, headers);
        // console.log(response.data);

        const submit = response.data.filter(
          (d) => d.isSubmit == true && d.Date.substring(0, 10) === date
        );

        console.log(submit);
        if (submit.length > 10) {
          const response1 = await axios.get(
            `${Base_url}/user/getdailyData`,
            headers
          );
          setData(response1.data);
          // console.log(data);
        } else {
          setData(response.data);
          // console.log(data);
        }
      } catch (error) {
        console.error("Error fetching daily data:", error);
      }
    };
    console.log(data);
    const getBankData = async () => {
      try {
        const response = await axios.get(`${Base_url}/user/bank`, headers);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching bank data:", error);
      }
    };

    getData();
    getBankData();
  }, []);

  useEffect(() => {
    const calculateTotals = (data, filteredData) => {
      const newTotals = {
        // existing totals
        "1000 ML": 0,
        "750 ML": 0,
        "375 ML": 0,
        "180 ML": 0,
        "BEER 650 ML": 0,
        "BEER 500 ML": 0,
        "BEER 325 ML": 0,
        "IMFL VALUE": 0,
        "BEER VALUE": 0,
        BANK: 0,
        "POS CARD": 0,
        "SALES VALUE": 0,
        "1000 ML closing bottle": 0,
        "750 ML closing bottle": 0,
        "375 ML closing bottle": 0,
        "180 ML closing bottle": 0,
        "BEER 650 ML closing bottle": 0,
        "BEER 500 ML closing bottle": 0,
        "BEER 325 ML closing bottle": 0,

        "1000 ML receipt case": 0, // Added entry for receipt cases
        "750 ML receipt case": 0, // Added entry for receipt cases
        "375 ML receipt case": 0, // Added entry for receipt cases
        "180 ML receipt case": 0, // Added entry for receipt cases
        "BEER 650 ML receipt case": 0, // Added entry for receipt cases
        "BEER 500 ML receipt case": 0, // Added entry for receipt cases
        "BEER 325 ML receipt case": 0,
        "TOTAL RECEIPT BOTTLES": 0,
        "1000 ML sales case": 0,
        "750 ML sales case": 0,
        "375 ML sales case": 0,
        "180 ML sales case": 0,
        "BEER 650 ML sales case": 0,
        "BEER 500 ML sales case": 0,
        "BEER 325 ML sales case": 0,
        "TOTAL SALES BOTTLES": 0,
        "ORDINARY CLOSING VALUE": 0,
        "MEDIUM CLOSING VALUE": 0,
        "PREMIUM CLOSING VALUE": 0,
        "BEER CLOSING VALUE": 0,
        // Added entry for receipt bottles
        // Added entry for receipt cases
        BALANCE: 0,
      };

      let totalSalesBottles = 0;
      let ordinaryClosingValue = 0;
      let mediumClosingValue = 0;
      let premiumClosingValue = 0;
      let beerClosingValue = 0;
      let totalSalesValue = 0;
      let totalClosingValue = 0;
      let totalReceiptBottles = 0;

      data.forEach((item) => {
        const size = item.Size;
        const salesBottle = item.Sales_bottle || 0;
        const receiptBottle = item.Receipt_bottle || 0; // Added receipt bottle handling
        const saleValue = item.Sale_value || 0;
        const closingValue = item.Closing_value || 0;
        const closingBottle = item.Closing_bottle || 0;

        totalSalesBottles += salesBottle;
        totalReceiptBottles += receiptBottle; // Aggregate receipt bottles
        totalSalesValue += saleValue;

        switch (size) {
          case 1000:
            newTotals["1000 ML"] += salesBottle;
            newTotals["1000 ML receipt case"] += Math.round(receiptBottle / 9); // Convert receipt bottles to cases
            newTotals["IMFL VALUE"] += saleValue;
            newTotals["1000 ML sales case"] += Math.round(salesBottle / 9);
            ordinaryClosingValue += closingValue;
            newTotals["1000 ML closing bottle"] += Math.round(
              closingBottle / 9
            );
            break;
          case 750:
            newTotals["750 ML"] += salesBottle;
            newTotals["750 ML receipt case"] += Math.round(receiptBottle / 12); // Convert receipt bottles to cases
            newTotals["IMFL VALUE"] += saleValue;
            newTotals["750 ML sales case"] += Math.round(salesBottle / 12);
            ordinaryClosingValue += closingValue;
            newTotals["750 ML closing bottle"] += Math.round(
              closingBottle / 12
            );
            break;
          case 375:
            newTotals["375 ML"] += salesBottle;
            newTotals["375 ML receipt case"] += Math.round(receiptBottle / 24); // Convert receipt bottles to cases
            newTotals["IMFL VALUE"] += saleValue;
            newTotals["375 ML sales case"] += Math.round(salesBottle / 24);
            mediumClosingValue += closingValue;
            newTotals["375 ML closing bottle"] += Math.round(
              closingBottle / 24
            );
            break;
          case 180:
            newTotals["180 ML"] += salesBottle;
            newTotals["180 ML receipt case"] += Math.round(receiptBottle / 48); // Convert receipt bottles to cases
            newTotals["IMFL VALUE"] += saleValue;
            newTotals["180 ML sales case"] += Math.round(salesBottle / 48);
            premiumClosingValue += closingValue;
            newTotals["180 ML closing bottle"] += Math.round(
              closingBottle / 48
            );
            break;
          case 650:
            newTotals["BEER 650 ML"] += salesBottle;
            newTotals["BEER 650 ML receipt case"] += Math.round(
              receiptBottle / 12
            ); // Convert receipt bottles to cases
            newTotals["BEER VALUE"] += saleValue;
            newTotals["BEER 650 ML sales case"] += Math.round(salesBottle / 12);
            beerClosingValue += closingValue;
            newTotals["BEER 650 ML closing bottle"] += Math.round(
              closingBottle / 12
            );
            break;
          case 500:
            newTotals["BEER 500 ML"] += salesBottle;
            newTotals["BEER 500 ML receipt case"] += Math.round(
              receiptBottle / 24
            ); // Convert receipt bottles to cases
            newTotals["BEER VALUE"] += saleValue;
            newTotals["BEER 500 ML sales case"] += Math.round(salesBottle / 24);
            beerClosingValue += closingValue;
            newTotals["BEER 500 ML closing bottle"] += Math.round(
              closingBottle / 24
            );
            break;
          case 325:
            newTotals["BEER 325 ML"] += salesBottle;
            newTotals["BEER 325 ML receipt case"] += Math.round(
              receiptBottle / 24
            ); // Convert receipt bottles to cases
            newTotals["BEER VALUE"] += saleValue;
            newTotals["BEER 325 ML sales case"] += Math.round(salesBottle / 24);
            beerClosingValue += closingValue;
            newTotals["BEER 325 ML closing bottle"] += Math.round(
              closingBottle / 24
            );
            break;
          default:
            break;
        }
      });

      filteredData.forEach((item) => {
        newTotals["BANK"] += item.Bank || 0;
        newTotals["POS CARD"] += item.Pos || 0;
        newTotals["SALES VALUE"] += item.Sale || 0;
      });

      totalClosingValue =
        ordinaryClosingValue +
        mediumClosingValue +
        premiumClosingValue +
        beerClosingValue;

      newTotals["TOTAL SALES BOTTLES"] = totalSalesBottles;
      newTotals["TOTAL RECEIPT BOTTLES"] = totalReceiptBottles; // Added total receipt bottles
      newTotals["ORDINARY CLOSING VALUE"] = ordinaryClosingValue;
      newTotals["MEDIUM CLOSING VALUE"] = mediumClosingValue;
      newTotals["PREMIUM CLOSING VALUE"] = premiumClosingValue;
      newTotals["BEER CLOSING VALUE"] = beerClosingValue;
      newTotals["BALANCE"] = totalSalesValue - totalClosingValue; // Calculate balance

      return newTotals;
    };

    const totals = calculateTotals(data, filteredData);
    setTotals(totals);
  }, [data, filteredData]);

  return (
    <div id="wrapper">
      <Dashboard />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <tr>
              <TableCell>Date</TableCell>
              <TableCell>{today}</TableCell>
            </tr>
            {Object.entries(totals).map(([category, value]) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell>{value}</TableCell>{" "}
                {/* Format value to 2 decimal places */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default SalesMessage;
