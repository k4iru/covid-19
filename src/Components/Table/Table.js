import React from "react";
import numeral from "numeral";
import "./table.css";

// use round brackets on countries.map so you return each block. with curly brackets return is ommitted
function Table({ countries, day }) {
  let date = "";
  if (day === "today") date = "Today";
  if (day === "?yesterday=true") date = "Yesterday";
  if (day === "?twoDaysAgo=true") date = "2 Days Ago";
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(({ country, cases, todayCases }) => (
            <tr key={country}>
              <td>
                {country} &#40;{numeral(todayCases).format("+0,0")} {date}&#41;
              </td>
              <td>
                <strong>{numeral(cases).format("0,0")}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
