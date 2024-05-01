import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const Base_url = process.env.Base_url;
function ExcelDetails({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [date, setDate] = useState("");
  const [array, setArray] = useState([]);
  const [enable, setEnable] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editedCaseValue, setEditedCaseValue] = useState();
  const [formDisable, setFormDisable] = useState(false);
  const [editedLooseValue, setEditedLooseValue] = useState();
  const [findItem, setFindItem] = useState();
  const [isFormVisible, setIsFormVisible] = useState(true);

  useEffect(() => {
    // Check if form should be visible based on submission date
    const lastSubmissionDate = localStorage.getItem("lastSubmissionDate");
    if (lastSubmissionDate) {
      const today = new Date().toLocaleDateString();
      if (lastSubmissionDate === today) {
        setIsFormVisible(false);
      }
    }
  }, []);

  // console.log(formDetails);
  const handleEdit = (id, value, loose, date) => {
    setEditIndex(id);
    console.log(id);
    setEditedCaseValue(value || 0);
    setEditedLooseValue(loose || 0);
    setDate(date);
  };

  const token = localStorage.getItem("token");
  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    get();
  }, []);

  var get = async () => {
    const response = await axios.get(`${Base_url}/user/getData`, headers);
    // console.log(response.data);
    setFormDetails(response.data);
    setArray(response.data);
  };

  const totalClosingValue = formDetails.reduce((total, item) => {
    return total + item.Closing_value;
  }, 0);
  const totalSalesBottle = formDetails.reduce((total, item) => {
    return total + item.Sales_bottle;
  }, 0);
  const totalSalesValue = formDetails.reduce((total, item) => {
    return total + item.Sale_value;
  }, 0);
  const totalClosingBottle = formDetails.reduce((total, item) => {
    return total + item.Closing_bottle;
  }, 0);
  const totalValue = formDetails.reduce((total, item) => {
    return total + item.Total_value;
  }, 0);
  const totalBottle = formDetails.reduce((total, item) => {
    return total + item.Total_bottle;
  }, 0);
  const totalCase = formDetails.reduce((total, item) => {
    return total + item.Case;
  }, 0);
  const totalLoose = formDetails.reduce((total, item) => {
    return total + item.Loose;
  }, 0);
  // console.log(formDetails);

  const handleSubmit = async (id) => {
    console.log(id);
    const Data = {
      date,
      editedCaseValue,
      editedLooseValue,
      id,
      formDetails,
    };

    try {
      const response = await axios.put(
        `${Base_url}/user/updateData`,
        Data,
        headers
      );
      console.log(response.data);
      get();
    } catch (error) {
      console.log("Error in updating case and loose : ", error);
      toast.warning("error in updating case and loose");
    }
    setEditIndex(null);
  };

  const handlesave = async () => {
    try {
      console.log("save button");
      const res = await axios.post(`${Base_url}/user/dailyData`, formDetails);
      console.log(res.data);
      toast.success("successfully submitted");
      setFormDetails();
    } catch (error) {
      console.log("Error in submiting the form : ", error);
      toast.warning("something is not right");
    } finally {
      setFormDisable(true);
    }

    const today = new Date().toLocaleDateString();
    localStorage.setItem("lastSubmissionDate", today);
    setIsFormVisible(false);
    alert("Form submitted successfully!");
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(date);
    if (
      findItem == "Beer" ||
      findItem == "Whisky" ||
      findItem == "Rum" ||
      findItem == " vodka" ||
      findItem == "Wine" ||
      findItem == "GIN" ||
      findItem == "Brandy"
    ) {
      const filt = array.filter((d) => d.Product == findItem);
      console.log(filt);
      setFormDetails(filt);
    } else {
      const filt = array.filter((d) => d.Item_Code == findItem);
      console.log(filt);
      setFormDetails(filt);
    }
  };
  return (
    <>
      <Dashboard />
      <ToastContainer />
      {isFormVisible ? (
        <table
          id="disable "
          // disabled={formDisable}
          className="table table-bordered border border-primary p-2 m-4"
        >
          <thead>
            <tr>
              <th>
                <input
                  type="text"
                  value={findItem}
                  onChange={(e) => setFindItem(e.target.value)}
                />
              </th>
              <th>
                <button onClick={handleSearch}>Search</button>
              </th>
              <th colSpan={6}>
                {" "}
                you can seach using prpoper Product name(Beer like that) or
                item_code
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th>Item code</th>
              <th> Brand Name</th>

              <th>Size</th>

              <th>MRP</th>

              <th>Total value</th>
              <th>Total Bottle</th>
              <th>Case</th>
              <th>Loose</th>
              <th></th>
              <th>Closing bottle</th>
              <th>Sales Bottle</th>

              <th>Sales Value</th>

              <th>Closing value</th>
              <th>Item type</th>
            </tr>
          </thead>

          {formDetails.map((d, i) => (
            <tbody key={i}>
              <tr>
                <td>{d.Item_Code}</td>
                <td>{d.Description}</td>

                <td>{d.Size}</td>

                <td>{d.MRP_Value}</td>
                {/* <td>{d.Opening_bottle}</td>
                <td>{d.Opening_value}</td>
                <td>{d.Receipt_bottle}</td>
                <td>{d.Receipt_value}</td> */}
                <td>{d.Total_value}</td>
                <td>{d.Total_bottle}</td>
                <td>
                  {editIndex === d._id ? (
                    <input
                      type="Number"
                      value={editedCaseValue}
                      onChange={(e) => setEditedCaseValue(e.target.value)}
                    />
                  ) : (
                    d.Case
                  )}
                </td>
                <td>
                  {editIndex === d._id ? (
                    <input
                      type="Number"
                      value={editedLooseValue}
                      onChange={(e) => setEditedLooseValue(e.target.value)}
                    />
                  ) : (
                    d.Loose
                  )}
                </td>
                <td>
                  {editIndex === d._id ? (
                    <button onClick={() => handleSubmit(d._id)}>Save</button>
                  ) : (
                    <button
                      value={enable}
                      onClick={() => handleEdit(d._id, d.Case, d.Loose, d.Date)}
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td>{d.Closing_bottle}</td>
                <td>{d.Sales_bottle} </td>
                <td>{d.Sale_value}</td>
                <td>{d.Closing_value}</td>
                <td>{d.Item_type}</td>
              </tr>
            </tbody>
          ))}

          <tfoot>
            <tr>
              <td colSpan={4}>Total</td>
              {/* <td>{totalOpeningBottle}</td>
              <td>{totalOpeningValue}</td>
              <td>{totalReciptBottle}</td>
              <td>{totalReceiptValue}</td> */}
              <td>{totalValue}</td>
              <td>{totalBottle}</td>
              <td>{totalCase}</td>
              <td>{totalLoose}</td>
              <td></td>
              <td>{totalClosingBottle}</td>
              <td>{totalSalesBottle}</td>
              <td>{totalSalesValue}</td>
              <td>{totalClosingValue}</td>
              <td>
                {" "}
                <button onClick={handlesave}>Submit</button>
              </td>
            </tr>
            <tr></tr>
          </tfoot>
        </table>
      ) : (
        <h1>Form Submitted Today. Please come back tomorr.</h1>
      )}
    </>
  );
}

export default ExcelDetails;
