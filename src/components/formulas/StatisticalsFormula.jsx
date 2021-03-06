import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSlope,
  updateIntercept,
} from "../../store/reducers/UmImgwPair/actions";
import { debounce } from "debounce";

export function StatisticalsFormula() {
  const dispatch = useDispatch();
  //const { slope, intercept } = useSelector((state) => state.UmImgwPair);
  const UmImgwPair = useSelector((state) => state.UmImgwPair);
  const debouncedDispatch = debounce(dispatch, 100);

  const handleSlopeChange = (e) => {
    debouncedDispatch(updateSlope(Number(e.target.value)));
  };

  const handleInterceptChange = (e) => {
    debouncedDispatch(updateIntercept(Number(e.target.value)));
  };

  const changeSelect = (e) => {
    var slope = e.target[e.target.selectedIndex].attributes.getNamedItem(
      "slope"
    ).value;
    var intercept = e.target[e.target.selectedIndex].attributes.getNamedItem(
      "intercept"
    ).value;
    dispatch(updateIntercept(Number(intercept)));
    dispatch(updateSlope(Number(slope)));
  };

  return (
    <div>
      <div>
        Sigmoid: slope
        <b>{UmImgwPair.slope}</b>
        <br />
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={UmImgwPair.slope * 100}
          onChange={handleSlopeChange}
        />
      </div>

      <div>
        Sigmoid: intercept
        <b>{UmImgwPair.intercept}</b>
        <br />
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={UmImgwPair.intercept * 100}
          onChange={handleInterceptChange}
        />
      </div>
      <form name="ParametersSet1">
        <select onChange={changeSelect} name="mySelect">
          <option slope="0.97" intercept="0.084">
            air
          </option>
          <option slope="0.34" intercept="3.2">
            ground
          </option>
        </select>
      </form>
      <div>
        Wartość progowa: <b>10%</b>
      </div>
    </div>
  );
}
