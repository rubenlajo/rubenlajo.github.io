import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/references";
import * as actionTypes from "./actionTypes";

export const fetchReferences = (centerId, filters, append = false) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_REFERENCES,
  payload: {
    centerId,
    filters,
    append,
  },
  [PROMISE_CALL]: () => api.fetchReferences(centerId, filters),
});

export const setView = (viewId) => ({
  type: actionTypes.STOCK_REFERENCES_SETVIEW,
  payload: viewId,
});

export const setSelected = (reflist) => ({
  type: actionTypes.STOCK_REFERENCES_SETSELECTED,
  payload: reflist,
});

export const setEditMode = (value) => ({
  type: actionTypes.STOCK_REFERENCES_SET_EDIT_MODE,
  payload: value,
});

export const getReferenceDetail = (centerId, referenceId) => ({
  type: actionTypes.STOCK_REFERENCES_GET_REFERENCE_DETAIL,
  payload: { centerId, referenceId },
  [PROMISE_CALL]: () => api.getReferenceDetail(centerId, referenceId),
});

export const fetchMaterialMovements = (centerId, materialId, limit, offset) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_MOVEMENTS,
  paylaod: { centerId, materialId, limit, offset },
  [PROMISE_CALL]: () => api.fetchMaterialMovements(centerId, materialId, limit, offset),
});

export const fetchMaterialElements = (centerId, materialId, limit, offset) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_ELEMENTS,
  paylaod: { centerId, materialId, limit, offset },
  [PROMISE_CALL]: () => api.fetchMaterialElements(centerId, materialId, limit, offset),
});

export const fetchMaterialLocations = (centerId, materialId, limit, offset) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_LOCATIONS,
  paylaod: { centerId, materialId, limit, offset },
  [PROMISE_CALL]: () => api.fetchMaterialLocations(centerId, materialId, limit, offset),
});

export const fetchMaterialUsages = (centerId, materialId, limit, offset) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_USAGES,
  paylaod: { centerId, materialId, limit, offset },
  [PROMISE_CALL]: () => api.fetchMaterialUsages(centerId, materialId, limit, offset),
});

export const fetchMaterialDates = (centerId, materialId) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_DATES,
  payload: { centerId, materialId },
  [PROMISE_CALL]: () => api.fetchMaterialDates(centerId, materialId),
});

export const createReference = (centerId, manufacturerRef) => ({
  type: actionTypes.STOCK_REFERENCES_CREATE_REFERENCE,
  payload: { manufacturerRef, centerId },
  [PROMISE_CALL]: () => api.createReference(centerId, manufacturerRef),
});

export const saveReference = (centerId, materialId, data) => ({
  type: actionTypes.STOCK_REFERENCES_SAVE_REFERENCE,
  payload: {
    centerId,
    materialId,
    data,
  },
  [PROMISE_CALL]: () => api.saveReference(centerId, materialId, data),
});

export const removeReferences = (centerId, materialIds) => ({
  type: actionTypes.STOCK_REFERENCES_REMOVE,
  payload: { centerId, materialIds },
  [PROMISE_CALL]: () => api.removeReferences(centerId, materialIds),
});

export const fetchMaterialManufacturers = () => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_MATERIALMANUFACTURERS,
  [PROMISE_CALL]: () => api.fetchMaterialManufacturers(),
});

export const fetchMaterialClassification = () => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_CLASSIFICATIONS,
  [PROMISE_CALL]: () => api.fetchMaterialClassification(),
});

export const getMaterialPurchase = (centerId, locationId, materialId) => ({
  type: actionTypes.STOCK_REFERENCES_GET_REFERENCE_PURCHASE,
  payload: {
    centerId,
    locationId,
    materialId,
  },
  [PROMISE_CALL]: () => api.getMaterialPurchase(centerId, locationId, materialId),
});

export const inventoryMaterials = (centerId, materialsList) => ({
  type: actionTypes.STOCK_REFERENCES_INVENTORY,
  payload: { centerId, materialsList },
  [PROMISE_CALL]: () => api.inventoryMaterials(centerId, materialsList),
});

export const getMaterialByBarcode = (centerId, materialBarcode) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_BY_BARCODE,
  payload: {
    centerId,
    materialBarcode,
  },
  [PROMISE_CALL]: () => api.getMaterialByBarcode(centerId),
});

export const getLocationsAvailable = (centerId, materialId, filters) => ({
  type: actionTypes.STOCK_REFERENCES_FETCH_LOCATIONS_AVAILABLE,
  payload: { centerId, materialId, filters },
  [PROMISE_CALL]: () => api.getLocationsAvailable(centerId, materialId, filters),
});
