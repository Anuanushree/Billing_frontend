import React, { useEffect, useState } from "react";
import "./sample.css";

function Sample({ Base_url, formDetails, valueType }) {
  const [data, setData] = useState([]);
  const val = data;
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

  return (
    <>
      <div className="card-container ">
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
      </div>
    </>
  );
}

export default Sample;
