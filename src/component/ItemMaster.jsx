import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ItemMaster({ Base_url }) {
  const [formDetails, setFormDetails] = useState([]);
  const [date, setDate] = useState("");
  const [invoice, setInvoice] = useState();
  const [array, setArray] = useState([]);
  const [desciption, setDescription] = useState();
  const [editIndex, setEditIndex] = useState(null);
  const [editedCaseValue, setEditedCaseValue] = useState(0);
  const [editMRP, setEditMRP] = useState();
  const [itemCode, setItemCode] = useState();
  const [findItem, setFindItem] = useState();
  const [editedLooseValue, setEditedLooseValue] = useState(0);
  const [ReceiptBottle, setReceiptBottle] = useState();
  const [OpeningBottle, setOpeningBottle] = useState();
  const [dummy, setDummy] = useState([]);

  // console.log(formDetails);
  const handleEdit = (
    id,
    invoice,
    receiptbottle,
    openingBottle,
    mrp,
    itemCode,
    description
  ) => {
    setEditIndex(id);
    setInvoice(invoice);
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
    filterdata();
  }, [findItem, array]);

  const get = async () => {
    const response = await axios.get(`${Base_url}/user/getdata`, headers);
    // console.log(response.data);
    setFormDetails(response.data);
    setDummy(response.data);
  };
  useEffect(() => {
    get();
  }, []);

  const handleSubmit = async (id) => {
    console.log(id);
    const data = {
      date,
      invoice,
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
      // toast.success("successfully added");
      const get1 = async () => {
        const response = await axios.get(`${Base_url}/user/getdata`, headers);
        // console.log(response.data);
        setDummy(response.data);
        setArray(response.data);
      };
      await get1();
      filterdata();
    } catch (error) {
      console.log("Error in updating case and loose : ", error);
      toast.warning("something error");
    }
    setEditIndex(null);
  };
  0;
  const handleSearch = (e) => {
    e.preventDefault();
    filterdata();
  };
  const filterdata = async () => {
    let a = dummy;
    if (
      findItem == "Beer" ||
      findItem == "Whisky" ||
      findItem == "Rum" ||
      findItem == "Vodka" ||
      findItem == "Wine" ||
      findItem == "Gin" ||
      findItem == "Brandy"
    ) {
      const filt = a.filter((d) => d.Product == findItem);
      console.log(filt);
      setFormDetails(filt);
    } else {
      const filt = a.filter((d) => d.Item_Code == findItem);
      console.log(filt);
      setFormDetails(filt);
    }
  };

  const handleSearch1 = async () => {
    console.log(date);
    const filt = array.filter((d) => d.Date.substring(0, 10) == date);
    setFormDetails(filt);
    console.log(formDetails);
  };

  const totalClosingValue = formDetails.reduce((total, item) => {
    return total + item.Closing_value;
  }, 0);

  const totalValue = formDetails.reduce((total, item) => {
    return total + parseInt(item.Total_value);
  }, 0);

  const OpeningValue = formDetails.reduce((total, item) => {
    return total + parseInt(item.Opening_value);
  }, 0);

  const ReceiptValue = formDetails.reduce((total, item) => {
    return total + item.Receipt_value;
  }, 0);

  const openingBottle = formDetails.reduce((total, item) => {
    return total + item.Opening_bottle;
  }, 0);

  const receiptBottle = formDetails.reduce((total, item) => {
    return total + item.Receipt_bottle;
  }, 0);

  const overallTotalBottle = formDetails.reduce((total, d) => {
    return total + d.Total_bottle;
  }, 0);
  // console.log(formDetails)
  console.log(overallTotalBottle);
  return (
    <>
      <Dashboard />
      <ToastContainer />
      <div className="table-container">
        <div className="table-body-container">
          <table className="table table-dark table-bordered border border-primary p-2 m-4">
            <thead className="table-primary">
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
                  {" "}
                  you can seach using prpoper Product name(Beer like that) or
                  item_code
                </th>
                <th colSpan={3}>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />

                  <button onClick={handleSearch1}>Search</button>
                </th>
              </tr>
            </thead>
            <thead className="table-secondary border-danger">
              <tr>
                {/* <th>Date</th> */}
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
                <th></th>
                <th>Receipt value</th>
                <th>Total value</th>
                <th>Total Bottle</th>
                <th>invoice number </th>
              </tr>
            </thead>

            {formDetails
              .sort((a, b) => a.Product.localeCompare(b.Product))
              .map((d, i) => (
                <tbody key={i}>
                  <tr>
                    {/* <td>{d.Date}</td> */}
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
                          style={{
                            width: "60px",
                            padding: "5px",
                            fontSize: "12px",
                          }}
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
                          style={{
                            width: "60px",
                            padding: "5px",
                            fontSize: "12px",
                          }}
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
                          style={{
                            width: "60px",
                            padding: "5px",
                            fontSize: "12px",
                          }}
                          onChange={(e) => setReceiptBottle(e.target.value)}
                        />
                      ) : (
                        d.Receipt_bottle
                      )}
                    </td>
                    <td>
                      {editIndex === d._id ? (
                        <button onClick={() => handleSubmit(d._id)}>
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleEdit(
                              d._id,
                              invoice,
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
                    <td>{d.Receipt_value}</td>
                    <td>{d.Total_value}</td>
                    <td>{d.Total_bottle}</td>
                    <td>
                      {editIndex === d._id ? (
                        <input
                          type="text"
                          value={invoice}
                          onChange={(e) => setInvoice(e.target.value)}
                        />
                      ) : (
                        d.invoice
                      )}
                    </td>
                  </tr>
                </tbody>
              ))}

            <tfoot>
              <tr>
                <td colSpan={8}>Total</td>
                <td>{openingBottle > 0 ? openingBottle : 0}</td>
                <td>{OpeningValue > 0 ? OpeningValue : 0}</td>
                <td>{receiptBottle > 0 ? receiptBottle : 0}</td>
                <td></td>
                <td>{ReceiptValue > 0 ? ReceiptValue : 0}</td>
                <td>{totalValue > 0 ? totalValue : 0}</td>
                <td>{overallTotalBottle > 0 ? overallTotalBottle : 0}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

export default ItemMaster;
