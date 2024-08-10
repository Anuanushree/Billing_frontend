import React, { useEffect, useState, useMemo, useRef } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function ExcelDetails({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [editCell, setEditCell] = useState(null);
  const [dummy, setDummy] = useState([]);
  const [findItem, setFindItem] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const cellRefs = useRef({});

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const headers = {
    headers: { authorization: `${token}` },
  };

  // Fetch data
  const getData = async () => {
    try {
      const response = await axios.get(`${Base_url}/user/getData`, headers);
      const f = response.data.filter((item) => item.Total_bottle > 0);
      setDummy(f);
      filterData(findItem, f); // Filter initial data if needed
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterData = (searchTerm = "", data = dummy) => {
    let filteredData = data;

    if (searchTerm) {
      filteredData = filteredData.filter(
        (item) => item.Product === searchTerm || item.Item_Code === searchTerm
      );
    }

    if (searchTerm && filteredData.length > 0) {
      filteredData = filteredData.filter((item) => item.Total_bottle > 0);
    }

    setFormDetails(filteredData);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleCellChange = async (id, field, value) => {
    const numberValue = parseInt(value, 10) || 0; // Default to 0 if value is not a number

    const updatedDetails = formDetails.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          [field]: numberValue,
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

    try {
      await axios.put(`${Base_url}/user/updateData`, data, headers);
      getData();
      // Fetch and update data after successful update
      // const response = await axios.get(`${Base_url}/user/getData`, headers);
      // setDummy(response.data);
      // filterData(findItem, response.data);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.warning("Error updating data");
    }
  };

  const handleKeyDown = async (e, id, field) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (!editCell) return;

      const value = e.target.innerText.trim();
      const finalValue = value === "" ? "0" : value;

      await handleCellChange(id, field, finalValue);

      setEditCell(null);

      if (e.key === "Tab" || e.key === "Enter") {
        const nextCell = getNextCell(id, field);
        if (nextCell) {
          setEditCell(nextCell);

          setTimeout(() => {
            const cellElement =
              cellRefs.current[`${nextCell.id}-${nextCell.field}`];
            if (cellElement) {
              cellElement.focus();
              const range = document.createRange();
              const sel = window.getSelection();
              range.selectNodeContents(cellElement);
              range.collapse(false); // Move cursor to the end
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }, 0);
        }
      }
    }
  };

  const getNextCell = (id, field) => {
    const fields = ["Case", "Loose"];
    const currentIndex = formDetails.findIndex((item) => item._id === id);
    const nextFieldIndex = (fields.indexOf(field) + 1) % fields.length;
    const nextItemIndex =
      nextFieldIndex === 0 ? currentIndex + 1 : currentIndex;

    if (nextItemIndex < formDetails.length) {
      return {
        id: formDetails[nextItemIndex]._id,
        field: fields[nextFieldIndex],
      };
    }
    return null;
  };

  const handleCellEdit = (id, field) => {
    setEditCell({ id, field });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterData(findItem);
  };

  const handleClearSearch = () => {
    setFindItem("");
    filterData("", dummy);
  };

  const handleSubmit = async () => {
    if (window.confirm("Are you sure you want to submit?")) {
      try {
        await axios.post(`${Base_url}/user/billingUpdate`, { id }, headers);
        toast.success("Successfully submitted");

        // Fetch and update data after successful submit
        const response = await axios.get(`${Base_url}/user/getData`, headers);
        getData();
        // filterData(findItem, response.data);
      } catch (error) {
        console.error("Error in submitting the form:", error);
        toast.warning("Something went wrong while submitting the form");
      }
    }
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
                <button onClick={handleClearSearch}>Clear</button>
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
                    ref={(el) => (cellRefs.current[`${item._id}-Case`] = el)}
                    onKeyDown={(e) => handleKeyDown(e, item._id, "Case")}
                    onClick={() => handleCellEdit(item._id, "Case")}
                    style={{ border: "2px solid red" }}
                  >
                    {item.Case}
                  </td>
                  <td
                    contentEditable
                    suppressContentEditableWarning
                    ref={(el) => (cellRefs.current[`${item._id}-Loose`] = el)}
                    onKeyDown={(e) => handleKeyDown(e, item._id, "Loose")}
                    onClick={() => handleCellEdit(item._id, "Loose")}
                    style={{ border: "2px solid red" }}
                  >
                    {item.Loose !== 0 && item.Loose}
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
            {!findItem && (
              <tr>
                <td colSpan={13}>
                  <button onClick={handleSubmit}>Submit</button>
                  {/* <button onClick={handlePreview}>Preview</button> */}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ExcelDetails;
