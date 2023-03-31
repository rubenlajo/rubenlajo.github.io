export const getQueryParam = (paramName) => {
  return new URLSearchParams(window.location.search).get(paramName);
};

export const setQueryParam = (param, value) => {
  let queryParams = new URLSearchParams(window.location.search);
  queryParams.set(param, value);
  history.replaceState(null, null, "?" + queryParams.toString());
};
