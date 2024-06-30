import React from "react";
import "./sample.css";

function Sample({ Base_url, formDetails, valueType }) {
  const totalOpeningBottles = {};

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

  const ranges = [...new Set(formDetails.map((item) => item.Range))];
  const filteredRanges = ranges.filter(
    (range) => range !== "Closing_value" && range !== "Sale_value"
  );
  const sizes = [...new Set(formDetails.map((item) => item.Size))];

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
                {ranges.map((range) => (
                  <td key={`grand-${range}`}>
                    {calculateTotalSaleValue(range)}
                  </td>
                ))}
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
                {filteredRanges.map((range) => (
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
                    {filteredRanges.map((range) => (
                      <td key={`${range}-${size}`}>
                        {totalOpeningBottles[range] &&
                        totalOpeningBottles[range][size]
                          ? calculateAddt(range, size)
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
              <tr>
                <th>Grand Total</th>
                {filteredRanges.map((range) => (
                  <td key={`grand-${range}-addt`}>
                    {sizes.reduce((acc, size) => {
                      return calculateAddt(range, size) + acc;
                    }, 0)}
                  </td>
                ))}
                <td>
                  {sizes.reduce((acc, size) => {
                    return (
                      filteredRanges.reduce((rangeAcc, range) => {
                        return calculateAddt(range, size) + rangeAcc;
                      }, 0) + acc
                    );
                  }, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sample;
