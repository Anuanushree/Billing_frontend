import React, { useEffect, useState, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ExcelDetails({ Base_url }) {
  const [formdetail, setformdetail] = useState([]);
  const [date, setDate] = useState("");
  const [array, setArray] = useState([]);
  const [enable, setEnable] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editedCaseValue, setEditedCaseValue] = useState();
  const [formDisable, setFormDisable] = useState(false);
  const [editedLooseValue, setEditedLooseValue] = useState();
  const [findItem, setFindItem] = useState();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [dummy, setDummy] = useState([]);

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };
  const handlesave = async () => {
    try {
      console.log("save button clicked");
      const res = await axios.post(
        `${Base_url}/user/dailyData`,
        formdetail,
        headers
      );
      console.log(res.data);
      toast.success("Successfully submitted");
      get();
    } catch (error) {
      console.log("Error in submitting the form:", error);
      toast.warning("Something went wrong while submitting the form");
    } finally {
      setFormDisable(true);
    }
  };
  useEffect(() => {
    get();
  }, []);
  useEffect(() => {
    filterData();
  }, [array, findItem]);

  var get = async () => {
    const response = await axios.get(`${Base_url}/user/getData`, headers);
    console.log(response.data);
    const fil = response.data.filter((f) => f.Total_bottle > 0);
    setformdetail(fil);
    setDummy(fil);
  };
  // get();
  const totalValue = useMemo(() => {
    return formdetail.reduce((total, item) => {
      return total + (parseInt(item.Total_value) || 0);
    }, 0);
  }, [formdetail]);

  const overallTotalBottle = useMemo(() => {
    return formdetail.reduce((total, detail) => {
      // ParseInt will return NaN for null values, so we handle them with || 0
      return total + (parseInt(detail.Total_bottle) || 0);
    }, 0);
  }, [formdetail]);

  const totalCase = useMemo(() => {
    return formdetail.reduce((total, item) => {
      return total + (parseInt(item.Case) || 0);
    }, 0);
  }, [formdetail]);

  console.log(formdetail);
  const totalLoose = useMemo(() => {
    return formdetail.reduce((total, item) => {
      return total + (parseInt(item.Loose) || 0);
    }, 0);
  }, [formdetail]);
  const filterData = async () => {
    let a = dummy;
    const filt =
      findItem && findItem !== ""
        ? a.filter((d) => d.Product === findItem || d.Item_Code === findItem)
        : a;

    setformdetail(filt);
  };

  const handleSearch = async () => {
    filterData();
  };

  const handleSubmit = async (id) => {
    const Data = {
      date,
      editedCaseValue: editedCaseValue || 0,
      editedLooseValue: editedLooseValue || 0,
      id,
      formdetail,
    };
    try {
      const res = await axios.put(`${Base_url}/user/updateData`, Data, headers);
      console.log(res.data);
      const get1 = async () => {
        const response = await axios.get(`${Base_url}/user/getdata`, headers);
        const filt = response.data.filter((f) => f.Total_bottle > 0);
        setDummy(filt);
        setArray(filt);
      };
      await get1();
      filterData();
    } catch (error) {
      console.log("Error in updating case and loose : ", error);
      toast.warning("error in updating case and loose");
    }
    setEditIndex(null);
  };

  const handleEdit = (id, value, loose, date) => {
    setEditIndex(id);
    setEditedCaseValue(value);
    setEditedLooseValue(loose);
    setDate(date);
  };
  const totalClosingBottle = useMemo(() => {
    return formdetail.reduce((total, item) => {
      return total + (parseInt(item.Closing_bottle) || 0);
    }, 0);
  }, [formdetail]);

  const totalSalesBottle = useMemo(() => {
    return formdetail.reduce((total, item) => {
      return total + (parseInt(item.Sales_bottle) || 0);
    }, 0);
  }, [formdetail]);

  const totalSalesValue = useMemo(() => {
    return formdetail.reduce((total, item) => {
      return total + (parseInt(item.Sale_value) || 0);
    }, 0);
  }, [formdetail]);

  const totalClosingValue = useMemo(() => {
    return formdetail.reduce((total, item) => {
      return total + (parseInt(item.Closing_value) || 0);
    }, 0);
  }, [formdetail]);

  const handleDelete = async () => {
    const res = await axios.delete(`${Base_url}/user/delete`);
  };
  return (
    <div id="wrapper">
      <Dashboard />
      <ToastContainer />
      {isFormVisible && formdetail ? (
        <div className="table-container">
          <table className=" table table-bordered border border-primary p-2 m-4">
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
                  {" "}
                  you can search using proper Product name (Beer like that) or
                  item_code
                </th>
              </tr>
            </thead>
            <thead className="table-primary">
              <tr>
                <th>Item code</th>
                <th colSpan={2}>Brand Name</th>
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
              </tr>
            </thead>
            <tbody>
              {formdetail
                // .filter(
                //   (fil) => fil.Opening_bottle > 0 || fil.Receipt_bottle > 0
                // )
                // .sort((a, b) => a.Product.localeCompare(b.Product))
                // .sort((d, c) => d.Description.localeCompare(c.Description))
                .sort((a, b) => {
                  // First, sort by Product
                  const productComparison = a.Product.localeCompare(b.Product);
                  if (productComparison !== 0) {
                    // If Products are different, return the comparison result
                    return productComparison;
                  } else {
                    // If Products are the same, sort by Description
                    return a.Description.localeCompare(b.Description);
                  }
                })
                .map((d, i) => (
                  <tr key={i}>
                    {/* <td>{i+1}</td> */}
                    <td>{d.Item_Code}</td>
                    <td colSpan={2} style={{ width: "900px" }}>
                      {d.Description}
                    </td>
                    <td>{d.Size}</td>
                    <td>{d.MRP_Value}</td>
                    <td>{d.Total_value}</td>
                    <td>{d.Total_bottle}</td>
                    <td>
                      {editIndex === d._id ? (
                        <input
                          type="Number"
                          style={{
                            width: "70px",
                            padding: "5px",
                            fontSize: "12px",
                          }}
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
                          style={{
                            width: "70px",
                            padding: "5px",
                            fontSize: "12px",
                          }}
                          onChange={(e) => setEditedLooseValue(e.target.value)}
                        />
                      ) : (
                        d.Loose
                      )}
                    </td>
                    <td>
                      {editIndex === d._id ? (
                        <button onClick={() => handleSubmit(d._id)}>
                          Save
                        </button>
                      ) : (
                        <button
                          value={enable}
                          onClick={() =>
                            handleEdit(d._id, d.Case, d.Loose, d.Date)
                          }
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td>{d.Closing_bottle}</td>
                    <td>{d.Sales_bottle} </td>
                    <td>{d.Sale_value}</td>
                    <td>{d.Closing_value}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5}>Total</td>
                <td>{totalValue}</td>
                <td>{overallTotalBottle > 0 ? overallTotalBottle : 0}</td>
                <td>{totalCase}</td>
                {totalLoose > 0 ? <td>{totalLoose}</td> : <td>0</td>}
                <td></td>
                {/* <td>{totalClosingValue}</td> */}
                <td>{totalClosingBottle > 0 ? totalClosingBottle : 0}</td>
                <td>{totalSalesBottle > 0 ? totalSalesBottle : 0}</td>
                <td>{totalSalesValue > 0 ? totalSalesValue : 0}</td>
                <td>{totalClosingValue > 0 ? totalClosingValue : 0}</td>
              </tr>
              <tr>
                {/* {
                  <td colSpan={14}>
                    {" "}
                    <button className="custom-button" onClick={handlesave}>
                      Submit
                    </button>
  
                  </td>
                } */}
                {/* <button onClick={handleDelete/}>Delete</button> */}
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
