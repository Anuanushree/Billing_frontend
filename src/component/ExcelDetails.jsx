import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ExcelDetails({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [date, setDate] = useState("");
  const [array, setArray] = useState([]);
  const [enable, setEnable] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editedCaseValue, setEditedCaseValue] = useState();
  const [formDisable, setFormDisable] = useState(false);
  const [editedLooseValue, setEditedLooseValue] = useState();
  const [findItem, setFindItem] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [dummy, setDummy] = useState([]);

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${Base_url}/user/getData`, headers);
      const filteredData = response.data.filter(
        (item) => item.Total_bottle > 0
      );
      setFormDetails(filteredData);
      setDummy(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterData();
  }, [array, findItem]);

  const totalValue = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Total_value) || 0),
      0
    );
  }, [formDetails]);

  const overallTotalBottle = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Total_bottle) || 0),
      0
    );
  }, [formDetails]);

  const totalCase = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Case) || 0),
      0
    );
  }, [formDetails]);

  const totalLoose = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Loose) || 0),
      0
    );
  }, [formDetails]);

  const filterData = async () => {
    const filteredData = findItem
      ? dummy.filter(
          (item) => item.Product === findItem || item.Item_Code === findItem
        )
      : dummy;
    setFormDetails(filteredData);
  };

  const handleSearch = () => {
    filterData();
  };

  const handleSubmit = async (id) => {
    const data = {
      date,
      editedCaseValue: editedCaseValue || 0,
      editedLooseValue: editedLooseValue || 0,
      id,
      formDetails,
    };

    try {
      await axios.put(`${Base_url}/user/updateData`, data, headers);
      await getData();
      filterData();
    } catch (error) {
      console.error("Error updating case and loose:", error);
      toast.warning("Error updating case and loose");
    } finally {
      setEditIndex(null);
    }
  };

  const handleEdit = (id, caseValue, looseValue, date) => {
    setEditIndex(id);
    setEditedCaseValue(caseValue);
    setEditedLooseValue(looseValue);
    setDate(date);
  };

  const totalClosingBottle = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Closing_bottle) || 0),
      0
    );
  }, [formDetails]);

  const totalSalesBottle = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Sales_bottle) || 0),
      0
    );
  }, [formDetails]);

  const totalSalesValue = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Sale_value) || 0),
      0
    );
  }, [formDetails]);

  const totalClosingValue = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Closing_value) || 0),
      0
    );
  }, [formDetails]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${Base_url}/user/delete`);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div id="wrapper">
      <Dashboard />
      <ToastContainer />
      {isFormVisible && formDetails ? (
        <div className="table-container">
          <table className="table table-bordered border-primary p-2 m-4">
            <thead>
              <tr>
                <th colSpan={3}>
                  <input
                    type="text"
                    value={findItem}
                    onChange={(e) => setFindItem(e.target.value)}
                  />
                  <button onClick={handleSearch}>Search</button>
                </th>
                <th colSpan={6}>
                  You can search using the product name (e.g., Beer) or item
                  code.
                </th>
              </tr>
            </thead>
            <thead className="table-primary">
              <tr>
                <th>Item Code</th>
                <th colSpan={2}>Brand Name</th>
                <th>Size</th>
                <th>MRP</th>
                <th>Total Value</th>
                <th>Total Bottle</th>
                <th>Case</th>
                <th>Loose</th>
                <th></th>
                <th>Closing Bottle</th>
                <th>Sales Bottle</th>
                <th>Sales Value</th>
                <th>Closing Value</th>
              </tr>
            </thead>
            <tbody>
              {formDetails
                .sort(
                  (a, b) =>
                    a.Product.localeCompare(b.Product) ||
                    a.Description.localeCompare(b.Description)
                )
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.Item_Code}</td>
                    <td colSpan={2} style={{ width: "900px" }}>
                      {item.Description}
                    </td>
                    <td>{item.Size}</td>
                    <td>{item.MRP_Value}</td>
                    <td>{item.Total_value}</td>
                    <td>{item.Total_bottle}</td>
                    <td>
                      {editIndex === item._id ? (
                        <input
                          type="number"
                          style={{
                            width: "70px",
                            padding: "5px",
                            fontSize: "12px",
                          }}
                          value={editedCaseValue}
                          onChange={(e) => setEditedCaseValue(e.target.value)}
                        />
                      ) : (
                        item.Case
                      )}
                    </td>
                    <td>
                      {editIndex === item._id ? (
                        <input
                          type="number"
                          style={{
                            width: "70px",
                            padding: "5px",
                            fontSize: "12px",
                          }}
                          value={editedLooseValue}
                          onChange={(e) => setEditedLooseValue(e.target.value)}
                        />
                      ) : (
                        item.Loose
                      )}
                    </td>
                    <td>
                      {editIndex === item._id ? (
                        <button onClick={() => handleSubmit(item._id)}>
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleEdit(
                              item._id,
                              item.Case,
                              item.Loose,
                              item.Date
                            )
                          }
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>{item.Closing_bottle}</td>
                    <td>{item.Sales_bottle}</td>
                    <td>{item.Sale_value}</td>
                    <td>{item.Closing_value}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>Total</td>
                <td>{totalValue}</td>
                <td>{overallTotalBottle > 0 ? overallTotalBottle : 0}</td>
                <td>{totalCase}</td>
                <td>{totalLoose > 0 ? totalLoose : 0}</td>
                <td></td>
                <td>{totalClosingBottle > 0 ? totalClosingBottle : 0}</td>
                <td>{totalSalesBottle > 0 ? totalSalesBottle : 0}</td>
                <td>{totalSalesValue > 0 ? totalSalesValue : 0}</td>
                <td>{totalClosingValue > 0 ? totalClosingValue : 0}</td>
              </tr>
              <tr>
                {/* <td colSpan={14}>
                  <button className="custom-button" onClick={handlesave}>
                    Submit
                  </button>
                </td> */}
                {/* <button onClick={handleDelete}>Delete</button> */}
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <h1>Form Submitted Today. Please come back tomorrow.</h1>
      )}
    </div>
  );
}

export default ExcelDetails;
