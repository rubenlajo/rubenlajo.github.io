import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/measurementUnits";
import * as actionTypes from "./actionTypes";

export const fetchMeasurementsUnit = () => ({
  type: actionTypes.STOCK_MEASUREMENTSUNIT_FETCH,
  [PROMISE_CALL]: () => api.fetchMeasurementsUnit(),
});
