import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/warehouseMovements";
import * as actionTypes from "./actionTypes";

export const fetchWarehouseMovements = (centerId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENTS,
  payload: {
    centerId,
    filters,
  },
  [PROMISE_CALL]: () => api.fetchWarehouseMovements(centerId, filters),
});

export const fetchWarehouseMovement = (centerId, warehouseMovementId) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_BYID,
  payload: {
    centerId,
    warehouseMovementId,
  },
  [PROMISE_CALL]: () => api.fetchWarehouseMovement(centerId, warehouseMovementId),
});

export const fetchWarehouseMovementTypes = () => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_TYPES,

  [PROMISE_CALL]: () => api.fetchWarehouseMovementTypes(),
});

export const fetchWarehouseMovementStatus = () => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_STATUS,

  [PROMISE_CALL]: () => api.fetchWarehouseMovementStatus(),
});

export const fetchWarehouseMovementsByIdList = (centerId, orderIdList) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_BYIDLIST,
  payload: { centerId, orderIdList },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementsByIdList(centerId, orderIdList),
});

export const setView = (viewId) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_SETVIEW,
  payload: viewId,
});

export const setSelected = (reflist) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_SETSELECTED,
  payload: reflist,
});

export const removeStockMovements = (centerId, listId) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_REMOVE,
  payload: { centerId, listId },
  [PROMISE_CALL]: () => api.removeStockMovements(centerId, listId),
});

export const assignWarehouseMovement = (
  centerId,
  warehouseMovementId,
  technicianLogin,
  type,
  reasign = false,
  pendingOrders = 0,
) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_ASSIGN_ORDER_OPERATOR,
  payload: {
    centerId,
    warehouseMovementId,
    technicianLogin,
    type,
    reasign,
    pendingOrders,
  },
  [PROMISE_CALL]: () => api.assignWarehouseMovement(centerId, warehouseMovementId, technicianLogin),
});

export const fetchStockMovement = (centerId, stockMovementId) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_STOCKMOVEMENT,
  payload: {
    centerId,
    stockMovementId,
  },
  [PROMISE_CALL]: () => api.fetchStockMovement(centerId, stockMovementId),
});

export const fetchAssignedUser = (userLogin) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_ASSIGNED_USER,
  payload: {
    userLogin,
  },
  [PROMISE_CALL]: () => api.fetchAssignedUser(userLogin),
});

export const fetchWarehouseMovementReferences = (centerId, warehouseMovementId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_REFERENCES,
  payload: { centerId, warehouseMovementId, filters },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementReferences(centerId, warehouseMovementId, filters),
});

export const fetchWarehouseMovementEditReferences = (centerId, warehouseMovementId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMEMNTS_FETCH_EDIT_TRASPASE_REFS,
  payload: { centerId, warehouseMovementId, filters },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementReferences(centerId, warehouseMovementId, filters),
});

export const fetchWarehouseMovementLocations = (centerId, warehouseMovementId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_LOCATIONS,
  payload: { centerId, warehouseMovementId, filters },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementLocations(centerId, warehouseMovementId, filters),
});

export const fetchWarehouseMovementEditLocations = (centerId, warehouseMovementId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_EDIT_WAREHOUSEMOVEMENT_LOCATIONS,
  payload: { centerId, warehouseMovementId, filters },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementLocations(centerId, warehouseMovementId, filters),
});

export const fetchWarehouseMovementsTechnicians = (centerId) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_TECHNICIANS,
  [PROMISE_CALL]: () => api.fetchWarehouseMovementsTechnicians(centerId),
});

export const fetchWarehouseMovementByIdList = (centerId, warehouseMovementIdList) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_BYIDLIST,
  payload: { warehouseMovementIdList },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementByIdList(centerId, warehouseMovementIdList),
});

export const fetchReferencesToTraspaseByIdList = (centerId, referencesIdList) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_REFERENCES_TO_TRASPASE,
  payload: { centerId, referencesIdList },
  [PROMISE_CALL]: () => api.fetchReferencesToTraspaseByIdList(centerId, referencesIdList),
});

export const fetchMaterialLocations = (centerId, materialId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_MATERIAL_LOCATIONS,
  payload: { centerId, materialId, filters },
  [PROMISE_CALL]: () => api.fetchMaterialLocations(centerId, materialId, filters),
});

export const setTrapaseUnits = (materialId, units) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_SET_TRASPASE_UNITS,
  payload: { materialId, units },
});

export const setEditTraspaseLocationRefUnits = (materialId, units) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMEMNTS_EDIT_TRASPASE_REFS_SETUNITS,
  payload: { materialId, units },
});

export const setEditTraspaseReferenceLocsUnits = (locationId, units) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMEMNTS_EDIT_TRASPASE_LOCS_SETUNITS,
  payload: { locationId, units },
});

export const setGeneralTraspaseUnits = (materialId, sourceLocation, units) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_SET_GENERAL_TRASPASE_UNITS,
  payload: { materialId, sourceLocation, units },
});

export const addTraspaseRefTargetLocationLine = (materialId, sourceLocation) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_ADD_TRASPASE_REF_TARGET_LOCATION_LINE,
  payload: { materialId, sourceLocation },
});

export const removeTraspaseRefTargetLocationLine = (materialId, lineId) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_REMOVE_TRASPASE_REF_TARGET_LOCATION_LINE,
  payload: { materialId, lineId },
});

export const updateTraspaseRefTargetLocationLineQty = (materialId, lineId, qty) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_TRASPASE_REF_TARGET_LOCATION_LINE_UPDATE_UNITS,
  payload: { materialId, lineId, qty },
});

export const updateTraspaseRefTargetLocationLineLocation = (materialId, lineId, location, targetLocation) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_TRASPASE_REF_TARGET_LOCATION_LINE_UPDATE_LOCATION,
  payload: { materialId, lineId, location, targetLocation },
});

export const createMaterialTraspase = (centerId, data) => ({
  type: actionTypes.STOCK_WAREHOSUEMOVEMENTS_CREATE_MATERIAL_TRASPASE,
  payload: { centerId, data },
  [PROMISE_CALL]: () => api.createMaterialTraspase(centerId, data),
});

export const fetchLocationsByIdList = (centerId, locationsIdsList) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATIONS_BY_IDLIST,
  payload: { centerId, locationsIdsList },
  [PROMISE_CALL]: () => api.fetchLocationsByIdList(centerId, locationsIdsList),
});

export const fetchLocationReferencesToTraspase = (centerId, locationId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATION_REFERENCES_BY_ID,
  payload: { centerId, locationId, filters },
  [PROMISE_CALL]: () => api.fetchLocationReferencesToTraspase(centerId, locationId, filters),
});

export const fetchLocationsOfReference = (centerId, materialId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATIONS_OF_REFERENCE,
  payload: { centerId, materialId, filters },
  [PROMISE_CALL]: () => api.fetchLocationsOfReference(centerId, materialId, filters),
});

export const removeReferenceLocationTransfer = (locationId, materialId) => ({
  type: actionTypes.STOCK_WAREHOUSE_REMOVE_REFERENCE_LOC_TRANSFER,
  payload: { locationId, materialId },
});

export const removeReferenceLocationEditTransfer = (locationId, materialId) => ({
  type: actionTypes.STOCK_WAREHOUSE_REMOVE_REFERENCE_LOC_EDIT_TRANSFER,
  payload: { locationId, materialId },
});

export const removeReferenceMaterialTransfer = (locationId, materialId) => ({
  type: actionTypes.STOCK_WAREHOUSE_REMOVE_REFERENCE_REF_TRANSFER,
  payload: { locationId, materialId },
});

export const updateWarehouseMovement = (centerId, warehouseMovmementId, data) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVMEMENTS_UPDATE_WAREHOUSE_MOVEMENT,
  payload: { centerId, warehouseMovmementId, data },
  [PROMISE_CALL]: () => api.updateWarehouseMovement(centerId, warehouseMovmementId, data),
});

export const fetchAvailableLocations = (centerId, materialId, filters) => ({
  type: actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_AVAILABLE_LOCATIONS,
  payload: { centerId, materialId, filters },
  [PROMISE_CALL]: () => api.fetchAvailableLocations(centerId, materialId, filters),
});
