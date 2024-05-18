import React, { useEffect, useState } from "react";
import "./sample.css";
import * as XLSX from "xlsx";
import axios from "axios";
import Dashboard from "../dashboard/Dashboard";

function Sample({ Base_url, formDetails, valueType }) {
  const [T, setT] = useState("");
  const [data, setData] = useState([]);
  const val = data;
  // useEffect(() => {
  //   const get = async () => {
  //     const response = await axios.get(`${Base_url}/user/getdailyData`);
  //     // console.log(response.data);
  //     setFormDetails(response.data);
  //     setData(response.data);
  //     // console.log(formDetails);
  //   };
  //   get();
  // }, []);
  const totalOpeningBottles = {};

  // formDetails.forEach((item) => {
  //   const { Range, Size, Item_type } = item;
  //   const value = item[valueType];
  //   if (!totalOpeningBottles[Item_type]) {
  //     totalOpeningBottles[Item_type] = {};
  //   }
  //   if (!totalOpeningBottles[Item_type][Range]) {
  //     totalOpeningBottles[Item_type][Range] = {};
  //   }
  //   if (!totalOpeningBottles[Item_type][Range][Size]) {
  //     totalOpeningBottles[Item_type][Range][Size] = 0;
  //   }
  //   totalOpeningBottles[Item_type][Range][Size] += value || 0;
  // });
  formDetails.forEach((item) => {
    const { Range, Size } = item;
    const value = item[valueType];
    if (!totalOpeningBottles[Range]) {
      totalOpeningBottles[Range] = {};
    }
    if (!totalOpeningBottles[Range][Size]) {
      totalOpeningBottles[Range][Size] = 0;
    }
    totalOpeningBottles[Range][Size] += value || 0;
  });
  const ranges = [...new Set(formDetails.map((item) => item.Range))];
  const sizes = [...new Set(formDetails.map((item) => item.Size))];
  const itemTypes = [...new Set(formDetails.map((item) => item.Item_type))];
  const exportToExcel = () => {
    const data = generateExportData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "sales_data.xlsx");
  };

  // const generateExportData = () => {
  //   const exportData = [];
  //   itemTypes.forEach((itemType) => {
  //     sizes.forEach((size) => {
  //       const rowData = { Size: size, ItemType: itemType };
  //       ranges.forEach((range) => {
  //         const value =
  //           totalOpeningBottles[itemType] &&
  //           totalOpeningBottles[itemType][range] &&
  //           totalOpeningBottles[itemType][range][size]
  //             ? totalOpeningBottles[itemType][range][size]
  //             : 0;
  //         rowData[range] = value;
  //       });
  //       rowData["Total"] = ranges.reduce((acc, range) => {
  //         return (
  //           ((totalOpeningBottles[itemType] &&
  //             totalOpeningBottles[itemType][range] &&
  //             totalOpeningBottles[itemType][range][size]) ||
  //             0) + acc
  //         );
  //       }, 0);
  //       exportData.push(rowData);
  //     });
  //   });
  //   return exportData;
  // };

  const generateExportData = () => {
    const exportData = [];
    sizes.forEach((size) => {
      const rowData = { Size: size };
      ranges.forEach((range) => {
        let total = 0;
        const filteredFormDetails = formDetails.filter(
          (item) => item[valueType] === "Opening Bottle"
        );
        filteredFormDetails.forEach((item) => {
          total +=
            (totalOpeningBottles[item.Item_type] &&
              totalOpeningBottles[item.Item_type][range] &&
              totalOpeningBottles[item.Item_type][range][size]) ||
            0;
        });
        rowData[range] = total;
      });
      rowData["Total"] = ranges.reduce((acc, range) => {
        return acc + rowData[range];
      }, 0);
      exportData.push(rowData);
    });
    return exportData;
  };
  return (
    <>
      <div className="card-container">
        {itemTypes.map((itemType) => (
          <div key={itemType} className="sub-card">
            <h3>{itemType}</h3>
            <table border="1">
              <thead>
                <tr>
                  <th colSpan={6}>{valueType}</th>
                </tr>
                <tr>
                  <th>Size</th>
                  {ranges.map((range) => (
                    <th key={range}>{range}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {/* {sizes.map((size) => (
                  <tr key={size}>
                    <td>{size}</td>
                    {ranges.map((range) => (
                      <td key={`${range}-${size}`}>
                        {totalOpeningBottles[itemType] &&
                        totalOpeningBottles[itemType][range] &&
                        totalOpeningBottles[itemType][range][size]
                          ? totalOpeningBottles[itemType][range][size]
                          : 0}
                      </td>
                    ))}
                    <td>
                      {ranges.reduce((acc, range) => {
                        return (
                          ((totalOpeningBottles[itemType] &&
                            totalOpeningBottles[itemType][range] &&
                            totalOpeningBottles[itemType][range][size]) ||
                            0) + acc
                        );
                      }, 0)}
                    </td>
                  </tr>
                ))} */}
                {sizes.map((size) => (
                  <tr key={size}>
                    <td>{size}</td>
                    {ranges.map((range) => (
                      <td key={`${range}-${size}`}>
                        {totalOpeningBottles[range] &&
                        totalOpeningBottles[range][size]
                          ? totalOpeningBottles[range][size]
                          : 0}
                      </td>
                    ))}
                    <td>
                      {ranges.reduce((acc, range) => {
                        return (
                          ((totalOpeningBottles[range] &&
                            totalOpeningBottles[range][size]) ||
                            0) + acc
                        );
                      }, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}

export default Sample;
