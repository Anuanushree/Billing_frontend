import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import Sample from "./sample";
import axios from "axios";

function Report({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [data, setData] = useState([]);
  const [datas, setDatas] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const get = async () => {
      const response = await axios.get(`${Base_url}/user/getdailyData`);
      // console.log(response.data);
      const filt = response.data.filter((d) => d.Date.substring(0, 10) == date);
      setFormDetails(filt);
      // setFormDetails(response.data);
      setData(response.data);
    };
    get();
  }, []);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${Base_url}/user/bank`, headers);
      console.log(response.data);
      const filt = response.data.filter((d) => d.Date.substring(0, 10) == date);
      setDatas(filt);
    };
    getData();
  }, []);

  const totalPos = useMemo(() => {
    return datas.reduce((total, item) => {
      return total + item.Pos;
    }, 0);
  }, [datas]);
  const totalcash = useMemo(() => {
    return datas.reduce((total, item) => {
      return total + item.Cash;
    }, 0);
  }, [datas]);
  const totalbank = useMemo(() => {
    return datas.reduce((total, item) => {
      return total + item.Bank;
    }, 0);
  }, [datas]);

  const handleSearch = async () => {
    console.log(date);
    const filt = data.filter((d) => d.Date.substring(0, 10) == date);
    setFormDetails(filt);
    console.log(filt);
  };
  // console.log(formDetails)
  const totalClosingValue = formDetails.reduce((total, item) => {
    return total + item.Closing_value;
  }, 0);
  var imfsSale = 0;
  var BeerSale = 0;
  formDetails.map((d) =>
    d.Item_Code == "IMFS_sale"
      ? (imfsSale += parseInt(d.Sale_value))
      : (BeerSale += d.Sale_value)
  );
  console.log(totalClosingValue, "wertyui");
  const totalOpeningValue = formDetails.reduce((total, item) => {
    return total + item.Opening_value;
  }, 0);
  const totalReceiptValue = formDetails.reduce((total, item) => {
    return total + item.Receipt_value;
  }, 0);

  const totalSalesValue = formDetails.reduce((total, item) => {
    return total + item.Sale_value;
  }, 0);

  const totalValue = formDetails.reduce((total, item) => {
    return total + item.Total_value;
  }, 0);

  return (
    <>
      <Dashboard />

      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <div className="card-md-6">
          <Sample valueType="Opening_bottle" formDetails={formDetails} />
          <Sample valueType="Receipt_bottle" formDetails={formDetails} />
          <Sample valueType="Total_bottle" formDetails={formDetails} />
          <Sample valueType="Sales_bottle" formDetails={formDetails} />
          <Sample valueType="Closing_bottle" formDetails={formDetails} />
          <div>
            <table>
              <thead>
                <td>Abstract</td>
                <tr>
                  <td>Sum of opening value</td>
                  <td>Sum of rec</td>
                  <td>Sum of total value</td>
                  <td>sum of Sale value</td>
                  <td>Sum of closing</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>{totalOpeningValue}</th>
                  <th>{totalReceiptValue}</th>
                  <th>{totalValue}</th>
                  <th>{totalSalesValue}</th>
                  <th>{totalClosingValue}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table>
              <thead>
                <td>Daily Sales Abstract</td>
                <tr>
                  <td>Sum of IMFS sale value</td>
                  <td>Sum of Beer sale value</td>
                  <td>Total</td>
                  <td>sum of Pos</td>
                  <td>Sum of NET Sale Cash</td>
                  <td>Sum of Bank</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>{imfsSale}</th>
                  <th>{BeerSale}</th>
                  <th>{totalSalesValue}</th>
                  <th>{totalPos}</th>
                  <th>{totalcash}</th>
                  <th>{totalbank}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <Sample valueType="Sales_bottle" formDetails={formDetails} />
          <Sample valueType="Sale_value" formDetails={formDetails} />
        </div>
      </div>
    </>
  );
}

export default Report;
