import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/stockStatus";
import * as actionTypes from "./actionTypes";

export const fetchStockStatus = () => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_STOCK_STATUS,
  [PROMISE_CALL]: () => api.fetchStockStatus(),
});
