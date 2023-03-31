import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/locations";
import * as actionTypes from "./actionTypes";

export const fetchLocations = (centerId, filters) => ({
  type: actionTypes.STOCK_LOCATIONS_FETCH_LOCATIONS,
  payload: {
    centerId,
    filters,
  },
  [PROMISE_CALL]: () => api.fetchLocations(centerId, filters),
});

export const setView = (viewId) => ({
  type: actionTypes.STOCK_LOCATIONS_SETVIEW,
  payload: viewId,
});

export const setSelected = (reflist) => ({
  type: actionTypes.STOCK_LOCATIONS_SETSELECTED,
  payload: reflist,
});

export const removeLocations = (centerId, locationsList) => ({
  type: actionTypes.STOCK_LOCATIONS_REMOVE,
  payload: {
    centerId,
    locationsList,
  },
  [PROMISE_CALL]: () => api.removeLocations(centerId, locationsList),
});

export const setEditMode = (value) => ({
  type: actionTypes.STOCK_LOCATIONS_SET_EDIT_MODE,
  payload: value,
});

export const getLocationDetail = (centerId, locationId) => ({
  type: actionTypes.STOCK_LOCATIONS_GET_LOCATION_DETAIL,
  payload: { centerId, locationId },
  [PROMISE_CALL]: () => api.getLocationDetail(centerId, locationId),
});

export const createLocation = (centerId, data, locationName) => ({
  type: actionTypes.STOCK_LOCATIONS_CREATE_LOCATION,
  payload: { data, locationName, centerId },
  [PROMISE_CALL]: () => api.createLocation(centerId, data),
});

export const saveLocation = (centerId, locationId, data, locationName) => ({
  type: actionTypes.STOCK_LOCATIONS_SAVE_LOCATION,
  payload: { centerId, locationId, data, locationName },
  [PROMISE_CALL]: () => api.saveLocation(centerId, locationId, data),
});

export const fetchLocationBehaviourTypes = () => ({
  type: actionTypes.STOCK_LOCATIONS_FETCH_LOCATION_BEHAVIOUR_TYPES,
  [PROMISE_CALL]: () => api.fetchLocationBehaviourTypes(),
});

export const fetchLocationsPatterns = (centerId) => ({
  type: actionTypes.STOCK_LOCATIONS_FETCH_LOCATION_PATTERNS,
  payload: { centerId },
  [PROMISE_CALL]: () => api.fetchLocationsPatterns(centerId),
});

export const fetchLocationMaterials = (centerId, locationId, filters, append) => ({
  type: actionTypes.STOCK_LOCATIONS_FETCH_LOCATION_MATERIALS,
  payload: { centerId, locationId, filters, append },
  [PROMISE_CALL]: () => api.fetchLocationMaterials(centerId, locationId, filters),
});

export const fetchSparePartsWarehouses = (centerId) => ({
  type: actionTypes.STOCK_LOCATIONS_FETCH_SPARE_PARTS_WAREHOUSES,
  payload: { centerId },
  [PROMISE_CALL]: () => api.fetchSparePartsWarehouses(centerId),
});

export const fetchLocationLastInventoryStatus = () => ({
  type: actionTypes.STOCK_LCOATIONS_FETCH_LASTINVENTORYSTATUS,
  [PROMISE_CALL]: () => api.fetchLocationLastInventoryStatus(),
});

export const inventoryLocations = (centerId, locationsList) => ({
  type: actionTypes.STOCK_LOCATIONS_POST_INVENTORIES,
  payload: { centerId, locationsList },
  [PROMISE_CALL]: () => api.inventoryLocations(centerId, locationsList),
});

export const fetchLastMovements = (centerId, filters) => ({
  type: actionTypes.STOCK_LOCATIONS_FETCH_LAST_MOVEMENTS,
  payload: { centerId, filters },
  [PROMISE_CALL]: () => api.fetchLastMovements(centerId, filters),
});
