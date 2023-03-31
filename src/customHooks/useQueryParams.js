import { useState } from "react";

/**
 * Get all params
 */
const getQueryParams = () => {
  const paramObj = {};
  Array.from(new URLSearchParams(window.location.search)).forEach((param) => {
    paramObj[param[0]] = param[1];
  });

  return paramObj;
};

/**
 * Clear empty params
 */
const clearEmptyParams = () => {
  const params = new URLSearchParams(window.location.search);
  const keysForDel = [];
  Object.keys(getQueryParams()).forEach((param) => {
    if (params.get(param) === "") {
      keysForDel.push(param);
    }
  });
  keysForDel.forEach((k) => {
    params.delete(k);
  });

  history.replaceState(null, null, "?" + params.toString());
};

/**
 * Set param value
 * @param {string} param
 * @param {any} value
 */
const setQueryParam = (param, value) => {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set(param, value);
  history.replaceState(null, null, "?" + queryParams.toString());
};

const useQueryParams = () => {
  const [params, setParams] = useState(getQueryParams());

  const setNonEmptyParams = (newParams) => {
    const finalParams = { ...params, ...newParams };
    const keysForDel = [];

    Object.keys(finalParams).forEach((param) => {
      setQueryParam(param, finalParams[param]);
      if (finalParams[param] === "") {
        keysForDel.push(param);
      }
    });
    keysForDel.forEach((k) => {
      delete finalParams[k];
    });

    setParams(finalParams);
    clearEmptyParams();
  };

  return [params, setNonEmptyParams];
};

export default useQueryParams;
