import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DailySalesReport({ Base_url }) {
  const [Pos, setPos] = useState();
  const [data, setData] = useState([]);
  const [Cash, setCash] = useState();
  const [Bank, setBank] = useState();
  const [paytm, setPaytm] = useState();
  const [date, setDate] = useState(new Date());
  const [formDetails, setFormDetails] = useState([]);

  const [val, setVal] = useState([]);

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
    };
    get();
  }, []);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${Base_url}/user/bank`, headers);
      console.log(response.data);
      setData(response.data);
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

  return (
    <>
      <Dashboard />
      <ToastContainer />
      <div className="container-fluid form-container">
        <div class="form-group">
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
        </div>
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
              <th>Sale</th>
              <th>Pos</th>
              <th>Cash</th>
              <th>Bank</th>
              <th>Paytm</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.Date}</td>
                <td>{d.Sale}</td>
                <td>{d.Pos}</td>
                <td>{d.Cash}</td>
                <td>{d.Bank}</td>
                <td>{d.Paytm}</td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={1}>Total</td>
              <td>{totalsale}</td>
              <td>{totalPos}</td>
              <td>{totalcash}</td>
              <td>{totalbank}</td>
              <td>{totalpaytm}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default DailySalesReport;
