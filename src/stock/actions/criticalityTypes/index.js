import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/criticalityTypes";
import * as actionTypes from "./actionTypes";

export const fetchMaterialCriticalityTypes = () => ({
  type: actionTypes.STOCK_MATERIAL_CRITICALITY_TYPES_FETCH,
  [PROMISE_CALL]: () => api.fetchMaterialCriticalityTypes(),
});
