// import React, { useEffect, useState } from "react";
// import Dashboard from "../dashboard/Dashboard";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // const Base_url = process.env.Base_url;
// function ExcelDetails({ Base_url }) {
//   const [formdetail, setformdetail] = useState([]);
//   const [date, setDate] = useState("");
//   const [array, setArray] = useState([]);
//   const [enable, setEnable] = useState(true);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editedCaseValue, setEditedCaseValue] = useState();
//   const [formDisable, setFormDisable] = useState(false);
//   const [editedLooseValue, setEditedLooseValue] = useState();
//   const [findItem, setFindItem] = useState();
//   const [isFormVisible, setIsFormVisible] = useState(true);
//   const [dummy, setDummy] = useState([]);
//   useEffect(() => {
//     // Check if form should be visible based on submission date

//     get();
//     // const lastSubmissionDate = localStorage.getItem("lastSubmissionDate");
//     // if (lastSubmissionDate) {
//     //   const today = new Date().toLocaleDateString();
//     //   if (lastSubmissionDate === today) {
//     //     setIsFormVisible(false);
//     //   }
//     // }

//     const today = new Date().toLocaleDateString();
//     const endOfDay = new Date(today + " 23:59:59");
//     const timeRemaining = endOfDay.getTime() - new Date().getTime();
//     setTimeout(() => {
//       handlesave(); // Auto-submit the form
//     }, timeRemaining);
//   }, []);

//   // console.log(formdetail);
//   const handleEdit = (id, value, loose, date) => {
//     setEditIndex(id);
//     // console.log(id);
//     setEditedCaseValue(value || 0);
//     setEditedLooseValue(loose || 0);
//     setDate(date);
//   };

//   const token = localStorage.getItem("token");
//   const headers = {
//     headers: { authorization: `${token}` },
//   };
//   // if(findItem0)
//   useEffect(() => {
//     filterData();
//   }, [findItem, array]);
//   // console.log(findItem, a);

//   var get = async () => {
//     const response = await axios.get(`${Base_url}/user/getData`, headers);
//     const fil = response.data.filter((f) => f.Opening_bottle > 0);
//     setformdetail(fil);
//     setDummy(response.data);
//   };
//   // console.log(formdetail);
//   const totalClosingValue = formdetail.reduce((total, item) => {
//     return total + item.Closing_value;
//   }, 0);

//   const totalSalesBottle = formdetail.reduce((total, item) => {
//     return total + item.Sales_bottle;
//   }, 0);
//   const totalSalesValue = formdetail.reduce((total, item) => {
//     return total + item.Sale_value;
//   }, 0);
//   const totalClosingBottle = formdetail.reduce((total, item) => {
//     return total + item.Closing_bottle;
//   }, 0);
//   const totalValue = formdetail.reduce((total, item) => {
//     return total + parseInt(item.Total_value);
//   }, 0);

//   console.log(totalValue);
//   // console.log(formdetail);
//   const overallTotalBottle = formdetail.reduce((total, detail) => {
//     return total + parseInt(detail.Opening_bottle);
//   }, 0);

//   // console.log(overallTotalBottle);

//   const totalCase = formdetail.reduce((total, item) => {
//     return total + item.Case;
//   }, 0);
//   // console.log(totalCase);
//   const totalLoose = formdetail.reduce((total, item) => {
//     return total + item.Loose;
//   }, 0);
//   // console.log(totalLoose);
//   var a;
//   const filterData = () => {
//     /// (formdetail);
//     a = dummy;
//     if (
//       findItem == "Beer" ||
//       findItem == "Whisky" ||
//       findItem == "Rum" ||
//       findItem == "Vodka" ||
//       findItem == "Wine" ||
//       findItem == "Gin" ||
//       findItem == "Brandy"
//     ) {
//       const filt = a.filter((d) => d.Product == findItem);
//       setformdetail(filt);

//       console.log(formdetail);
//     } else {
//       const filt = a.filter((d) => d.Item_Code == findItem);
//       console.log(filt);
//       setformdetail(filt);
//     }
//   };

//   const handleSearch = async () => {
//     filterData();
//   };
//   const handleSubmit = async (id) => {
//     // console.log(id);
//     const Data = {
//       date,
//       editedCaseValue,
//       editedLooseValue,
//       id,
//       formdetail,
//     };
//     try {
//       const response = await axios.put(
//         `${Base_url}/user/updateData`,
//         Data,
//         headers
//       );
//       console.log(response.data);

//       var get1 = async () => {
//         const response = await axios.get(`${Base_url}/user/getData`, headers);
//         //  setformdetail(response.data);
//         setArray(response.data);
//         setDummy(response.data);
//       };
//       await get1();

//       // Reapply search filter
//       filterData();
//     } catch (error) {
//       console.log("Error in updating case and loose : ", error);
//       toast.warning("error in updating case and loose");
//     }
//     setEditIndex(null);
//   };
//   // filterData();
//   const handlesave = async () => {
//     get();
//     try {
//       console.log("save button");
//       const formdetails = formdetail;
//       console.log(formdetails);
//       // const res = await axios.post(`${Base_url}/user/dailyData`, formdetails);
//       // console.log(res.data);
//       toast.success("successfully submitted");
//       setformdetail();
//     } catch (error) {
//       console.log("Error in submiting the form : ", error);
//       toast.warning("something is not right");
//     } finally {
//       setFormDisable(true);
//     }

//     const today = new Date().toLocaleDateString();
//     localStorage.setItem("lastSubmissionDate", today);
//     setIsFormVisible(false);
//     alert("Form submitted successfully!");
//   };

//   // console.log(formdetail);
//   return (
//     <>
//       <Dashboard />
//       <ToastContainer />
//       {isFormVisible ? (
//         <div className="table-container">
//           <table className=" table table-bordered border border-primary p-2 m-4">
//             <thead>
//               <tr>
//                 <th colSpan={3}>
//                   <input
//                     type="text"
//                     value={findItem}
//                     onChange={(e) => setFindItem(e.target.value)}
//                   />

//                   <button onClick={handleSearch}>Search</button>
//                 </th>
//                 <th colSpan={6}>
//                   {" "}
//                   you can seach using proper Product name (Beer like that) or
//                   item_code
//                 </th>
//               </tr>
//             </thead>
//             <thead className="table-primary">
//               <tr>
//                 <th>Item code</th>
//                 <th colSpan={2}>Brand Name</th>
//                 <th>Size</th>
//                 <th>MRP</th>
//                 <th>Total value</th>
//                 <th>Total Bottle</th>
//                 <th>Case</th>
//                 <th>Loose</th>
//                 <th></th>
//                 <th>Closing bottle</th>
//                 <th>Sales Bottle</th>
//                 <th>Sales Value</th>
//                 <th>Closing value</th>
//               </tr>
//             </thead>

//             <tbody>
//               {formdetail
//                 .filter(
//                   (fil) => fil.Opening_bottle > 0 || fil.Receipt_bottle > 0
//                 )
//                 .sort((a, b) => a.Product.localeCompare(b.Product))
//                 .map((d, i) => (
//                   <tr>
//                     {/* <td>{i + 1} </td> */}
//                     {/* <td>{d.Product}</td> */}
//                     <td>{d.Item_Code}</td>
//                     <td colSpan={2} style={{ width: "900px" }}>
//                       {d.Description}
//                     </td>
//                     <td>{d.Size}</td>
//                     <td>{d.MRP_Value}</td>
//                     <td>{d.Total_value}</td>
//                     <td>{parseInt(d.Total_bottle)}</td>
//                     <td>
//                       {editIndex === d._id ? (
//                         <input
//                           type="Number"
//                           style={{
//                             width: "70px",
//                             padding: "5px",
//                             fontSize: "12px",
//                           }}
//                           value={editedCaseValue}
//                           onChange={(e) => setEditedCaseValue(e.target.value)}
//                         />
//                       ) : (
//                         d.Case
//                       )}
//                     </td>
//                     <td>
//                       {editIndex === d._id ? (
//                         <input
//                           type="Number"
//                           value={editedLooseValue}
//                           style={{
//                             width: "70px",
//                             padding: "5px",
//                             fontSize: "12px",
//                           }}
//                           onChange={(e) => setEditedLooseValue(e.target.value)}
//                         />
//                       ) : (
//                         d.Loose
//                       )}
//                     </td>
//                     <td>
//                       {editIndex === d._id ? (
//                         <button onClick={() => handleSubmit(d._id)}>
//                           Save
//                         </button>
//                       ) : (
//                         <button
//                           value={enable}
//                           onClick={() =>
//                             handleEdit(d._id, d.Case, d.Loose, d.Date)
//                           }
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </td>
//                     <td>{d.Closing_bottle}</td>
//                     <td>{d.Sales_bottle} </td>
//                     <td>{d.Sale_value}</td>
//                     <td>{d.Closing_value}</td>
//                   </tr>
//                 ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={5}>Total</td>

//                 <td>{totalValue}</td>
//                 <td>{overallTotalBottle}</td>
//                 <td>{totalCase}</td>
//                 {totalLoose > 0 ? <td>{totalLoose}</td> : <td>0</td>}

//                 <td></td>
//                 <td>{totalClosingBottle}</td>
//                 <td>{totalSalesBottle}</td>
//                 <td>{totalSalesValue}</td>
//                 <td>{totalClosingValue}</td>
//               </tr>
//               <tr>
//                 <td colSpan={14}>
//                   {" "}
//                   <button className="custom-button" onClick={handlesave}>
//                     Submit
//                   </button>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       ) : (
//         <h1>Form Submitted Today. Please come back tomorrow.</h1>
//       )}
//     </>
//   );
// }

// export default ExcelDetails;

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

  // const handlesave = async () => {
  //   try {
  //     get();
  //     console.log("save button clicked");
  //     const formdetails = formdetail;
  //     console.log(formdetails);
  //     // Make sure to await the axios call and store the response
  //     const res = await axios.post(`${Base_url}/user/dailyData`, formdetails);
  //     console.log(res.data);
  //     toast.success("successfully submitted");
  //     setformdetail([]);

  //   } catch (error) {
  //     console.log("Error in submitting the form:", error);
  //     toast.warning("Something went wrong while submitting the form");
  //   } finally {
  //     setFormDisable(true);
  //   }
  //   //     const today = new Date().toLocaleDateString();
  //   //     localStorage.setItem("lastSubmissionDate", today);
  //   //     setIsFormVisible(false);
  //   //     alert("Form submitted successfully!");
  // };

  // useEffect(() => {
  //   get();
  //   const today = new Date();
  //   // Set end of day to 23:59:58
  //   today.setHours(21, 48, 4);
  //   const timeRemaining = today.getTime() - Date.now();
  //   // Ensure timeRemaining is positive
  //   if (timeRemaining > 0) {
  //     const timer = setTimeout(() => {
  //       handlesave(); // Auto-submit the form
  //     }, timeRemaining);
  //     // Clear the timer when the component unmounts
  //     return () => clearTimeout(timer);
  //   }
  //   get();
  //   // If timeRemaining is negative, the end of day has already passed, handle accordingly
  //   return () => {};
  // }, []);

  const handlesave = async () => {
    try {
      console.log("save button clicked");
      const res = await axios.post(`${Base_url}/user/dailyData`, formdetail);
      console.log(res.data);
      toast.success("Successfully submitted");
      setformdetail([]);
    } catch (error) {
      console.log("Error in submitting the form:", error);
      toast.warning("Something went wrong while submitting the form");
    } finally {
      setFormDisable(true);
    }
  };
  useEffect(() => {
    const today = new Date();
    // Set end of day to 9:48:04 PM
    today.setHours(23, 59, 58);
    const timeRemaining = today.getTime() - Date.now();

    if (timeRemaining > 0) {
      const timer = setTimeout(async () => {
        try {
          await handlesave();
          get();
          // Auto-submit the form
        } catch (error) {
          console.log("Error in auto-submit:", error);
          toast.warning("Something went wrong while auto-submitting the form");
        }
      }, timeRemaining);

      // Clear the timer when the component unmounts
      return () => clearTimeout(timer);
    } else {
      console.log("End of day has already passed.");
    }
  });
  useEffect(() => {
    get();
  }, []);
  useEffect(() => {
    filterData();
  }, [findItem, array]);

  var get = async () => {
    const response = await axios.get(`${Base_url}/user/getData`);
    // console.log(response.data);
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

  const filterData = () => {
    let filteredData = dummy;
    if (
      findItem === "Beer" ||
      findItem === "Whisky" ||
      findItem === "Rum" ||
      findItem === "Vodka" ||
      findItem === "Wine" ||
      findItem === "Gin" ||
      findItem === "Brandy"
    ) {
      filteredData = dummy.filter((d) => d.Product === findItem);
    } else {
      filteredData = dummy.filter((d) => d.Item_Code === findItem);
    }
    setformdetail(filteredData);
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
      await axios.put(`${Base_url}/user/updateData`, Data);
      var get1 = async () => {
        const response = await axios.get(`${Base_url}/user/getData`);
        const fil = response.data.filter((f) => f.Total_bottle > 0);
        setArray(fil);
        setDummy(fil);
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

  return (
    <>
      <Dashboard />
      <ToastContainer />
      {isFormVisible ? (
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
                .sort((a, b) => a.Product.localeCompare(b.Product))
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
              {/* <tr>
                <td colSpan={14}>
                  {" "}
                  <button className="custom-button" onClick={handlesave}>
                    Submit
                  </button>
                </td>
              </tr> */}
            </tfoot>
          </table>
        </div>
      ) : (
        <h1>Form Submitted Today. Please come back tomorrow.</h1>
      )}
    </>
  );
}

export default ExcelDetails;
