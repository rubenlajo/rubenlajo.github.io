import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/classifications";
import * as actionTypes from "./actionTypes";

export const fetchMaterialClassifications = () => ({
  type: actionTypes.STOCK_MATERIALCLASSIFICATIONS_FETCH,
  [PROMISE_CALL]: () => api.fetchMaterialClassifications(),
});
