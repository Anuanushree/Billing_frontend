import React, { useEffect, useState } from "react";
import "./sample.css";

function Sample({ Base_url, formDetails, valueType }) {
  const [data, setData] = useState([]);
  const val = data;
  const totalOpeningBottles = {};
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const headers = {
    headers: { authorization: `${token}` },
  };
  // Calculate total opening bottles for each size and range
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
  // console.log(totalOpeningBottles, "totyui");
  const ranges = [...new Set(formDetails.map((item) => item.Range))];
  const sizes = [...new Set(formDetails.map((item) => item.Size))];
  const itemTypes = [...new Set(formDetails.map((item) => item.Item_type))];
  // console.log(formDetails);
  const calculateTotalSaleValue = (productType) => {
    return formDetails
      .filter((item) => item.Range === productType)
      .reduce((total, item) => total + (item[valueType] || 0), 0);
  };

  const grandTotal =
    calculateTotalSaleValue("Beer") +
    calculateTotalSaleValue("Premium") +
    calculateTotalSaleValue("Ordinary") +
    calculateTotalSaleValue("Medium");
  const calculateAddt = (range, size) => {
    if (
      totalOpeningBottles[range] &&
      totalOpeningBottles[range][size] !== undefined
    ) {
      const value = totalOpeningBottles[range][size];
      switch (size) {
        case "375":
        case "325":
        case "500":
          return Math.round(value / 24);
        case "650":
        case "750":
          return Math.round(value / 12);
        case "180":
          return Math.round(value / 48);
        case "1000":
          return Math.round(value / 9);
        default:
          return 0;
      }
    }
    return 0;
  };

  // Calculate total addt across all sizes and ranges
  const calculateTotalAddt = () => {
    let totalAddt = 0;
    sizes.forEach((size) => {
      ranges.forEach((range) => {
        totalAddt += calculateAddt(range, size);
      });
    });
    return totalAddt;
  };
const filteredRanges = ranges.filter(
  (range) => range !== "Closing_value" && range !== "Sale_value"
);
  return (
    <div id="wrapper">
      {/* Table for total opening bottles based on size and range */}
      <div className="card-container">
        <div className="sub-card">
          <h3>{valueType}</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Size</th>
                {ranges.map((range) => (
                  <th key={range}>{range}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {sizes
                .sort((a, b) => parseInt(b) - parseInt(a))
                .map((size) => (
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
              <tr>
                <th>Grand Total</th>

                <td>{calculateTotalSaleValue("Beer")}</td>
                <td>{calculateTotalSaleValue("Premium")}</td>
                <td>{calculateTotalSaleValue("Medium")}</td>
                <td>{calculateTotalSaleValue("Ordinary")}</td>
                <td>{grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table for total bottle divided by size quantity */}
      <div className="card-container">
        <div className="sub-card">
          <table border="1">
            <thead>
              <tr>
                <th>Size</th>
                {ranges.map((range) => (
                  <th key={range}>{range}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes
                .sort((a, b) => parseInt(b) - parseInt(a))
                .map((size) => (
                  <tr key={size}>
                    <td>{size}</td>
                    {ranges.map((range) => (
                      <td key={`${range}-${size}`}>
                        {totalOpeningBottles[range] &&
                        totalOpeningBottles[range][size]
                          ? ((size == "375" ||
                              size == "325" ||
                              size == "500") &&
                              Math.round(
                                totalOpeningBottles[range][size] / 24
                              )) ||
                            ((size == "650" || size == "750") &&
                              Math.round(
                                totalOpeningBottles[range][size] / 12
                              )) ||
                            (size == "180" &&
                              Math.round(
                                totalOpeningBottles[range][size] / 48
                              )) ||
                            (size == "1000" &&
                              Math.round(totalOpeningBottles[range][size] / 9))
                          : 0}
                      </td>
                    ))}
                    <td>
                      {filteredRanges.reduce((acc, range) => {
                        return calculateAddt(range, size) + acc;
                      }, 0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sample;
