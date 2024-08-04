import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function ExcelDetails({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [editCell, setEditCell] = useState(null);
  const [dummy, setDummy] = useState([]);
  const [findItem, setFindItem] = useState("");

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

  const handleCellChange = async (id, field, value) => {
    const numberValue = parseInt(value, 10);

    const updatedDetails = formDetails.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          [field]: isNaN(numberValue) ? item[field] : numberValue,
        };
      }
      return item;
    });

    setFormDetails(updatedDetails);

    const updatedItem = updatedDetails.find((item) => item._id === id);
    const data = {
      id,
      editedCaseValue: updatedItem.Case || 0,
      editedLooseValue: updatedItem.Loose || 0,
    };

    console.log(`Sending to backend:`, data);

    try {
      const response = await axios.put(
        `${Base_url}/user/updateData`,
        data,
        headers
      );
      console.log(response.data);

      if (response.data.message === "case updated successfully") {
        getData();
        toast.success("Data updated successfully");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.warning("Error updating data");
    }
  };

  const handleKeyDown = async (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!editCell) return;

      const { field } = editCell;
      const value = e.target.innerText.trim();

      await handleCellChange(id, field, value);
      setEditCell(null);
    }
  };

  const handleCellEdit = (id, field) => {
    setEditCell({ id, field });
  };

  const totalValue = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Total_value, 10) || 0),
      0
    );
  }, [formDetails]);

  const overallTotalBottle = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Total_bottle, 10) || 0),
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

  const totalCase = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Case, 10) || 0),
      0
    );
  }, [formDetails]);

  const totalLoose = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Loose, 10) || 0),
      0
    );
  }, [formDetails]);

  const totalClosingBottle = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Closing_bottle, 10) || 0),
      0
    );
  }, [formDetails]);

  const totalSalesBottle = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Sales_bottle, 10) || 0),
      0
    );
  }, [formDetails]);

  const totalSalesValue = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Sale_value, 10) || 0),
      0
    );
  }, [formDetails]);

  const totalClosingValue = useMemo(() => {
    return formDetails.reduce(
      (total, item) => total + (parseInt(item.Closing_value, 10) || 0),
      0
    );
  }, [formDetails]);

  return (
    <div id="wrapper">
      <Dashboard />
      <ToastContainer />
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
                You can search using the product name (e.g., Beer) or item code.
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
              .map((item) => (
                <tr key={item._id}>
                  <td>{item.Item_Code}</td>
                  <td colSpan={2} style={{ width: "900px" }}>
                    {item.Description}
                  </td>
                  <td>{item.Size}</td>
                  <td>{item.MRP_Value}</td>
                  <td>{item.Total_value}</td>
                  <td>{item.Total_bottle}</td>
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={(e) => handleKeyDown(e, item._id)}
                    onClick={() => handleCellEdit(item._id, "Case")}
                  >
                    {item.Case}
                  </td>
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    onKeyDown={(e) => handleKeyDown(e, item._id)}
                    onClick={() => handleCellEdit(item._id, "Loose")}
                  >
                    {item.Loose}
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
              <td>{totalClosingBottle > 0 ? totalClosingBottle : 0}</td>
              <td>{totalSalesBottle > 0 ? totalSalesBottle : 0}</td>
              <td>{totalSalesValue > 0 ? totalSalesValue : 0}</td>
              <td>{totalClosingValue > 0 ? totalClosingValue : 0}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ExcelDetails;
