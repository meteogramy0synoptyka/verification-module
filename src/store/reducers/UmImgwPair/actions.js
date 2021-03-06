// add data, update_slope, update_intercept

export const UPDATE_FORECAST_DATA = "UPDATE_FORECAST_DATA";
export const UPDATE_HISTORICAL_DATA = "UPDATE_HISTORICAL_DATA";
export const UPDATE_SLOPE = "UPDATE_SLOPE";
export const UPDATE_INTERCEPT = "UPDATE_INTERCEPT";
export const UPDATE_FORECAST_FILTERS = "UPDATE_FORECAST_FILTERS";
export const UPDATE_HISTORICAL_FILTERS = "UPDATE_HISTORICAL_FILTERS";

export const updateForecastData = (data) => ({
  type: UPDATE_FORECAST_DATA,
  data,
});

export const updateHistoricalData = (data) => ({
  type: UPDATE_HISTORICAL_DATA,
  data,
});

export const updateForecastFilters = (filters) => ({
  type: UPDATE_FORECAST_FILTERS,
  filters,
});

export const updateHistoricalFilters = (hist_filters) => ({
  type: UPDATE_HISTORICAL_FILTERS,
  hist_filters,
});

export const updateSlope = (slope) => ({
  type: UPDATE_SLOPE,
  slope,
});

export const updateIntercept = (intercept) => ({
  type: UPDATE_INTERCEPT,
  intercept,
});
