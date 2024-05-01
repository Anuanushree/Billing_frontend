import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ItemMaster({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [date, setDate] = useState("");
  // const [id, setID] = useState("");
  const [array, setArray] = useState([]);
  const [desciption, setDescription] = useState();
  const [editIndex, setEditIndex] = useState(null);
  const [editedCaseValue, setEditedCaseValue] = useState("0");
  const [editMRP, setEditMRP] = useState();
  const [itemCode, setItemCode] = useState();
  const [findItem, setFindItem] = useState();
  const [editedLooseValue, setEditedLooseValue] = useState("0");
  const [ReceiptBottle, setReceiptBottle] = useState();
  const [OpeningBottle, setOpeningBottle] = useState();

  // console.log(formDetails);
  const handleEdit = (
    id,
    value,
    loose,
    receiptbottle,
    openingBottle,
    mrp,
    itemCode,
    description
  ) => {
    setEditIndex(id);
    setEditedCaseValue(value || 0);
    setEditedLooseValue(loose || 0);
    setReceiptBottle(receiptbottle || 0);
    setOpeningBottle(openingBottle || 0);
    setEditMRP(mrp);
    setItemCode(itemCode);
    setDescription(description);
  };

  const token = localStorage.getItem("token");
  const headers = {
    headers: { authorization: `${token}` },
  };

  useEffect(() => {
    const get = async () => {
      const response = await axios.get(
        `${Base_url}/user/getItemMaster`,
        headers
      );
      // console.log(response.data);
      setFormDetails(response.data);
      setArray(response.data);
    };
    get();
  }, []);

  const handleSubmit = async (id) => {
    console.log(id);
    const data = {
      date,
      editedCaseValue,
      editedLooseValue,
      ReceiptBottle,
      OpeningBottle,
      id,
      editIndex,
      formDetails,
      editMRP,
      itemCode,
      desciption,
    };
    console.log(data);
    try {
      const response = await axios.put(
        `${Base_url}/user/updateReceipt`,
        data,
        headers
      );
      console.log(response.data);
      toast.success("successfully added");
    } catch (error) {
      console.log("Error in updating case and loose : ", error);
      toast.warning("something error");
    }
    setEditIndex(null);
  };

  const handleSearch = async () => {
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
      <table className="table table-dark table-bordered border border-primary p-2 m-4">
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
            <th>Date</th>
            <th>S.No</th>
            <th>Range</th>
            <th>Product</th>
            <th>Brand name</th>
            <th>Item code</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>MRP</th>
            <th>Opening Bottle</th>
            <th>Opening value</th>
            <th>Receipt Bottle</th>
            <th>Receipt value</th>
            <th>Total value</th>
            <th>Total Bottle</th>
            <th>Case</th>
            <th>Loose</th>
            <th></th>
          </tr>
        </thead>

        {formDetails.map((d, i) => (
          <tbody key={i}>
            <tr>
              <td>{d.Date}</td>
              <td>{i + 1}</td>
              <td>{d.Range}</td>
              <td>{d.Product}</td>
              {/* <td>{d.Description}</td> */}
              <td>
                {editIndex === d._id ? (
                  <input
                    type="text"
                    value={desciption}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                ) : (
                  d.Description
                )}
              </td>
              <td>{d.Item_Code}</td>
              <td>{d.Size}</td>

              <td>{d.Quantity}</td>

              <td>
                {editIndex === d._id ? (
                  <input
                    type="Number"
                    value={editMRP}
                    onChange={(e) => setEditMRP(e.target.value)}
                  />
                ) : (
                  d.MRP_Value
                )}
              </td>

              <td>
                {editIndex === d._id ? (
                  <input
                    type="Number"
                    value={OpeningBottle}
                    onChange={(e) => setOpeningBottle(e.target.value)}
                  />
                ) : (
                  d.Opening_bottle
                )}
              </td>
              <td>{d.Opening_value}</td>
              {/* <td>{d.Receipt_bottle}</td> */}
              <td>
                {editIndex === d._id ? (
                  <input
                    type="Number"
                    value={ReceiptBottle}
                    onChange={(e) => setReceiptBottle(e.target.value)}
                  />
                ) : (
                  d.Receipt_bottle
                )}
              </td>
              <td>{d.Receipt_value}</td>
              <td>{d.Total_value}</td>
              <td>{d.Total_bottle}</td>
              <td>
                {editIndex === d._id ? (
                  <input
                    type="text"
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
                    onClick={() =>
                      handleEdit(
                        d._id,
                        d.Case,
                        d.Loose,
                        d.Receipt_bottle,
                        d.Opening_bottle,
                        d.MRP_Value,
                        d.Item_Code,
                        d.Description
                      )
                    }
                  >
                    Edit
                  </button>
                )}
              </td>

              {/* <td>{d.Closing_bottle}</td>
              <td>{d.Sales_bottle} </td>
              <td>{d.Sale_value}</td>
              <td>{d.Closing_value}</td>
              <td>{d.Item_type}</td> */}
            </tr>
          </tbody>
        ))}

        <tfoot>
          <tr>
            <td colSpan={10}>Total</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default ItemMaster;
