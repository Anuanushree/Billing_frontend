import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

function DailySalesReport({ Base_url }) {
  const [Pos, setPos] = useState();
  const [data, setData] = useState([]);
  const [Cash, setCash] = useState();
  const [Bank, setBank] = useState();
  const [paytm, setPaytm] = useState();
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState();
  const [formDetails, setFormDetails] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [val, setVal] = useState([]);

  const token = localStorage.getItem("token");
  const headers = {
    headers: { authorization: `${token}` },
  };
  useEffect(() => {
    const dateObj = new Date();

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const day = dateObj.getDate().toString().padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);
    const fil = formDetails.filter(
      (d) => d.Date.substring(0, 10) == formattedDate
    );
    console.log(fil);
    const totalClosingValue = fil.reduce((total, item) => {
      return total + item.Sale_value;
    }, 0);
    console.log(totalClosingValue);
    setVal(totalClosingValue);
  });

  useEffect(() => {
    const get = async () => {
      const response = await axios.get(
        `${Base_url}/user/getdailyData`,
        headers
      );
      // console.log(response.data);

      setFormDetails(response.data);
    };
    get();
  }, []);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${Base_url}/user/bank`, headers);
      console.log(response.data);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so we add 1
      const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
      const filt = response.data.filter((d) => {
        const date = new Date(d.Date);
        return date >= firstDayOfMonth && date <= lastDayOfMonth;
      });
      setData(filt);
    };
    getData();
  }, []);

  // console.log(formDetails);
  // console.log(formDetails.data.Date);

  const totalPos = useMemo(() => {
    return data.reduce((total, item) => {
      return total + item.Pos;
    }, 0);
  }, [data]);
  const totalcash = useMemo(() => {
    return data.reduce((total, item) => {
      return total + item.Cash;
    }, 0);
  }, [data]);
  const totalsale = useMemo(() => {
    return data.reduce((total, item) => {
      return total + item.Sale;
    }, 0);
  }, [data]);

  const totalbank = useMemo(() => {
    return data.reduce((total, item) => {
      return total + item.Bank;
    }, 0);
  }, [data]);
  const totalpaytm = useMemo(() => {
    return data.reduce((total, item) => {
      return total + parseInt(item.Paytm);
    }, 0);
  }, [data]);
  console.log(val);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      Pos: Pos,
      Cash: Cash,
      Bank: Bank,
      Sale: val,
      Paytm: paytm,
    };

    try {
      const response = await axios.post(
        `${Base_url}/user/dailyReport`,
        data,
        headers
      );
      console.log(response.data);
      toast.success("successfully added");
    } catch (error) {
      console.log("Error in dailyreport : ", error);
      toast.warning(error.message);
    }
  };

  const handleSeacrhDate = async () => {
    const getData = async () => {
      let response;
      if (fromDate && toDate) {
        const dateSearch = {
          fromDate,
          toDate,
        };
        response = await axios.post(`${Base_url}/user/getReportSearch`, {
          dateSearch,
        });
        console.log(response.data, "resposme");
      }
      setData(response.data);
    };
    getData();
  };

  const handleSearch = async () => {
    console.log("search");
    console.log(date);
    const fil = formDetails.filter((d) => d.Date.substring(0, 10) == date);
    // setFormDetails(fil);
    console.log(fil);
    const totalClosingValue = fil.reduce((total, item) => {
      return total + item.Closing_value;
    }, 0);
    console.log(totalClosingValue);
    setVal(totalClosingValue);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportToExcel = () => {
    // Remove _id and __v fields from the data and format date
    const sanitizedData = data.map(({ _id, __v, Date, ...rest }) => ({
      Date: formatDate(Date),
      "Sale Details": rest.Sale,
      "Cash Collection Amount": rest.Cash,
      "Swiping Card Amount": rest.Pos,
      "Paytm Amount": parseFloat(rest.Paytm || 0),
      "Bank Deposit amount": rest.Bank,
    }));

    // Calculate totals
    const total = sanitizedData.reduce(
      (acc, item) => {
        acc["Sale Details"] += item["Sale Details"];
        acc["Cash Collection Amount"] += item["Cash Collection Amount"];
        acc["Swiping Card Amount"] += item["Swiping Card Amount"];
        acc["Paytm Amount"] += item["Paytm Amount"];
        acc["Bank Deposit amount"] += item["Bank Deposit amount"];
        return acc;
      },
      {
        Date: "Total",
        "Sale Details": 0,
        "Cash Collection Amount": 0,
        "Swiping Card Amount": 0,
        "Paytm Amount": 0,
        "Bank Deposit amount": 0,
      }
    );

    // Prepare data for Excel sheet
    const dataWithTotal = sanitizedData.concat(total);

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(dataWithTotal);

    // Adjust column width
    ws["!cols"] = [
      { wch: 12 }, // Date
      { wch: 15 }, // Sale Details
      { wch: 22 }, // Cash Collection Amount
      { wch: 22 }, // Swiping Card Amount
      { wch: 16 }, // Paytm Amount
      { wch: 22 }, // Bank Deposit amount
    ];

    // Convert worksheet to workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Save Excel file
    XLSX.writeFile(wb, `Sale_Report from ${fromDate} to ${toDate}.xlsx`);
  };
  return (
    <>
      <Dashboard />
      <ToastContainer />
      <div className="container-fluid form-container">
        {/* <div class="form-group">
          <label>Date : </label>
          <span>
            &nbsp;&nbsp;
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </span>
          <button onClick={handleSearch}>search</button>
        </div> */}
        <div className="form-group">
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="form-control"
          />
        </div>
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
        <button onClick={handleSeacrhDate}>Search</button>
        <button onClick={exportToExcel}>Export to Excel</button>
        <form onSubmit={handleSubmit}>
          <div class="form-group">
            <label>Sale : </label>&nbsp;&nbsp;
            <label>{val}</label>
          </div>
          <div class="form-group">
            <label>Pos</label>
            <input
              type="Number"
              // type="text"
              name="Description"
              value={Pos}
              onChange={(e) => setPos(e.target.value)}
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label>Cash</label>
            <input
              type="Number"
              // type="text"
              // name="Description"
              value={Cash}
              onChange={(e) => setCash(e.target.value)}
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label>Bank</label>
            <input
              type="Number"
              // type="text"
              value={Bank}
              onChange={(e) => setBank(e.target.value)}
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label>Paytm</label>
            <input
              type="Number"
              // type="text"
              // name="Description"
              value={paytm}
              onChange={(e) => setPaytm(e.target.value)}
              class="form-control"
              required
            />
          </div>
          <button
            type="submit"
            class="btn btn-default form-control bg-primary mt-4"
          >
            Submit
          </button>
        </form>

        <table className="table table-dark table-bordered border border-primary p-2 m-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sale Details</th>
              <th>Cash Collection Amount</th>
              <th>Swiping Card Amount</th>
              <th>Paytm Amount</th>
              <th>Bank Deposite amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{new Date(d.Date).toLocaleDateString("en-GB")}</td>
                <td>{d.Sale}</td>
                <td>{d.Cash}</td>
                <td>{d.Pos}</td>
                <td>{d.Paytm}</td>
                <td>{d.Bank}</td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={1}>Total</td>
              <td>{totalsale}</td>
              <td>{totalcash}</td>
              <td>{totalPos}</td>

              <td>{totalpaytm}</td>
              <td>{totalbank}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default DailySalesReport;
