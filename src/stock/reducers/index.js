import { combineReducers } from "redux";

// importar todos los reducers
import locations from "./locations";
import orders from "./orders";
import references from "./references";
import warehouseMovements from "./warehouse-movements";
import suppliers from "./suppliers";
import materialClassifications from "./material-classifications";
import stockStatus from "./stock-status";
import criticalityTypes from "./criticality-types";
import manufacturers from "./manufacturers";
import measurementUnits from "./measurement-units";
import pda from "./pda";

export default combineReducers({
  // poner aqui los reducers importados en orden alfabetico
  criticalityTypes,
  locations,
  manufacturers,
  materialClassifications,
  measurementUnits,
  orders,
  pda,
  suppliers,
  references,
  stockStatus,
  warehouseMovements,
});
