import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/suppliers";
import * as actionTypes from "./actionTypes";

export const fetchSuppliers = (centerId, filters) => ({
  type: actionTypes.STOCK_SUPPLIERS_FETCH_SUPPLIERS,
  payload: {
    centerId,
    filters,
  },
  [PROMISE_CALL]: () => api.fetchSuppliers(centerId, filters),
});
