import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/manufacturers";
import * as actionTypes from "./actionTypes";

export const fetchManufacturers = (filters, append = false) => ({
  type: actionTypes.STOCK_MANUFACTURER_FETCH_MANUFACTURERS,
  payload: {
    filters,
    append,
  },
  [PROMISE_CALL]: () => api.fetchManufacturers(filters),
});

export const fetchManufacturerById = (manufacturerId) => ({
  type: actionTypes.STOCK_MANUFACTURER_FETCH_MANUFACTURER_BYID,
  payload: {
    manufacturerId,
  },
  [PROMISE_CALL]: () => api.fetchManufacturers(manufacturerId),
});
