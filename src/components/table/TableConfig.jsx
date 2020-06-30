import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateSlope,
  updateIntercept,
} from "../../store/reducers/table/actions";
import { debounce } from "debounce";

export function TableConfig() {
  const dispatch = useDispatch();
  //const { slope, intercept } = useSelector((state) => state.table);
  const s = useSelector((state) => state.table);
  const debouncedDispatch = debounce(dispatch, 100);

  const handleSlopeChange = (e) => {
    debouncedDispatch(updateSlope(Number(e.target.value) / 100));
  };

  const handleInterceptChange = (e) => {
    debouncedDispatch(updateIntercept(Number(e.target.value) / 100));
  };

  return (
    <div>
      <div>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={s.slope * 100}
          onChange={handleSlopeChange}
        />
      </div>
      {s.slope}
      <div>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue={s.intercept * 100}
          onChange={handleInterceptChange}
        />
        {s.intercept}
      </div>
    </div>
  );
}
