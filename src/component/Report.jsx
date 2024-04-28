import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import Sample from "./sample";
import axios from "axios";

function Report({ Base_url }) {
  const [date, setDate] = useState();
  const [formDetails, setFormDetails] = useState([]);

  // const [val, setVal] = useState();
  const [data, setData] = useState([]);
  const val = data;
  useEffect(() => {
    const get = async () => {
      const response = await axios.get(`${Base_url}/user/getdailyData`);
      // console.log(response.data);
      setFormDetails(response.data);
      setData(response.data);
      // console.log(formDetails);
    };
    get();
  }, []);
  // const handleSearch = async () => {
  //   console.log(date);
  //   const filt = data.filter((d) => d.Date.substring(0, 10) == date);
  //   setFormDetails(filt);
  // };
  return (
    <>
      <Dashboard />

      <div>
        <Sample valueType="Opening_bottle" formDetails={formDetails} />
        <Sample valueType="Closing_bottle" formDetails={formDetails} />
        <Sample valueType="Opening_value" formDetails={formDetails} />
        <Sample valueType="Closing_value" formDetails={formDetails} />
        <Sample valueType="Receipt_bottle" formDetails={formDetails} />
        <Sample valueType="Receipt_value" formDetails={formDetails} />
      </div>
    </>
  );
}

export default Report;
