import React from "react";
import "./formulas.css";

export function ForecastFormula() {
  // const loadForecast () => {
  //   fetch()
  // }

  return (
    <>
      <div id="formulas"></div>
      Choose Date of forecast:
      <input type="date"></input>
      <button>Load Forecast</button>
    </>
  );
}
