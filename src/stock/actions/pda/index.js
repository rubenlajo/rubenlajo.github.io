import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/pda";
import * as actionTypes from "./actionTypes";

export const fetchMaterialById = (centerId, materialId) => ({
  type: actionTypes.STOCK_PDA_FETCH_MATERIAL,
  payload: {
    centerId,
    materialId,
  },
  [PROMISE_CALL]: () => api.fetchMaterialById(centerId, materialId),
});

export const fetchMaterialLocations = (centerId, materialId, filters) => ({
  type: actionTypes.STOCK_PDA_FETCH_MATERIAL_LOCATIONS,
  payload: { centerId, materialId, filters },
  [PROMISE_CALL]: () => api.fetchMaterialLocations(centerId, materialId, filters),
});

export const fetchMaterialByBarcode = (centerId, barcode, redirect = false) => ({
  type: actionTypes.STOCK_PDA_CHECK_BARCODE_MATERIAL,
  payload: {
    centerId,
    barcode,
    redirect,
  },
  [PROMISE_CALL]: () => api.fetchMaterialByBarcode(centerId, barcode),
});

export const fetchLocationById = (centerId, materialId) => ({
  type: actionTypes.STOCK_PDA_FETCH_LOCATION,
  payload: {
    centerId,
    materialId,
  },
  [PROMISE_CALL]: () => api.fetchLocationById(centerId, materialId),
});

export const fetchLocationByBarcode = (centerId, barcode, redirect = false) => ({
  type: actionTypes.STOCK_PDA_CHECK_BARCODE_LOCATION,
  payload: {
    centerId,
    barcode,
    redirect,
  },
  [PROMISE_CALL]: () => api.fetchLocationByBarcode(centerId, barcode),
});

export const setRedirect = (redirect) => ({
  type: actionTypes.STOCK_PDA_SET_REDIRECT,
  payload: redirect,
});

export const fetchWarehouseMovements = (centerId, filters) => ({
  type: actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENTS,
  payload: {
    centerId,
    filters,
  },
  [PROMISE_CALL]: () => api.fetchWarehouseMovements(centerId, filters),
});

export const fetchAssignement = (centerId) => ({
  type: actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENTS_DASHBOARD,
  payload: {
    centerId,
  },
  [PROMISE_CALL]: () => api.fetchAssignement(centerId),
});

export const fetchWarehouseMovement = (centerId, warehouseMovementId) => ({
  type: actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT,
  payload: {
    centerId,
    warehouseMovementId,
  },
  [PROMISE_CALL]: () => api.fetchWarehouseMovement(centerId, warehouseMovementId),
});

export const fetchWarehouseMovementTechnicians = (centerId) => ({
  type: actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_TECHNICIANS,
  payload: { centerId },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementTechnicians(centerId),
});

export const clearWarhouseMovementTechnicians = () => ({
  type: actionTypes.STOCK_PDA_CLEAR_WAREHOUSE_MOVEMENT_TECHNICIANS,
});

export const assignWarehouseMovement = (
  centerId,
  warehouseMovementId,
  assignUser,
  warehouseMovementTypeName,
  redirectToExec = false,
) => ({
  type: actionTypes.STOCK_PDA_ASSIGN_WAREHOUSE_MOVEMENT,
  payload: { centerId, warehouseMovementId, assignUser, warehouseMovementTypeName, redirectToExec },
  [PROMISE_CALL]: () => api.assignWarehouseMovement(centerId, warehouseMovementId, assignUser),
});

export const updateWarehouseMovemementStatus = (
  centerId,
  warehouseMovementId,
  warehouseMovementsStatus,
  warehouseMovementTypeName,
  redirect = false,
  displayNotification = true,
) => ({
  type: displayNotification
    ? actionTypes.STOCK_PDA_UPDATE_WAREHOUSE_MOVEMENT_STATUS
    : actionTypes.STOCK_PDA_UPDATE_WAREHOUSE_MOVEMENT_STATUS_NOTLOADING,
  payload: {
    centerId,
    warehouseMovementId,
    warehouseMovementsStatus,
    warehouseMovementTypeName,
    redirect,
  },
  [PROMISE_CALL]: () =>
    api.updateWarehouseMovemementStatus(
      centerId,
      warehouseMovementId,
      warehouseMovementsStatus.warehouseMovementStatusId,
    ),
});

export const fetchWarehouseMovementStatus = () => ({
  type: actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENTS_STATUS,
  [PROMISE_CALL]: () => api.fetchWarehouseMovementStatus(),
});

export const resetWarehouseMovementStatusFlag = () => ({
  type: actionTypes.STOCK_PDA_RESET_WAREHOUSE_MOVEMENTS_STATUS_FLAG,
});

export const createWarehouseMovementInventoryMaterial = (centerId, materialId) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_INVENTARY_MATERIAL,
  payload: { centerId, materialId },
  [PROMISE_CALL]: () => api.createWarehouseMovementInventoryMaterial(centerId, materialId),
});
export const createWarehouseMovementInventoryLocation = (centerId, locationId) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_INVENTARY_LOCATION,
  payload: { centerId, locationId },
  [PROMISE_CALL]: () => api.createWarehouseMovementInventoryLocation(centerId, locationId),
});

export const createWhMTransferRefSetUnits = (units) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_REF_SET_UNITS,
  payload: { units },
});

export const setLocationEditing = (location) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_LOCATION_EDITING,
  payload: { location },
});

export const createWhMTransferRefConfirmUnits = (units) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_LOCATION_UNITS,
  payload: { units },
});

export const createWhMTransferRemoveLocation = (locationId) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_REF_REMOVE_LOCATION,
  payload: { locationId },
});

export const createWhMTransferReference = (centerId, materialId, locations) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER,
  payload: { centerId, materialId },
  [PROMISE_CALL]: () => api.createWhMTransferReference(centerId, materialId, locations),
});

export const fetchLocationMaterials = (centerId, locationId, filters) => ({
  type: actionTypes.STOCK_PDA_WM_TRANSFER_FETCH_LOCATION_REFERENCES,
  payload: { centerId, locationId, filters },
  [PROMISE_CALL]: () => api.fetchLocationMaterials(centerId, locationId, filters),
});

export const setMaterialEditing = (material) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_MATERIAL_EDITING,
  payload: { material },
});
export const createWhTransferLocationConfirmUnits = (units) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_MATERIAL_UNITS,
  payload: { units },
});

export const createWhMTransferRemoveReference = (materialId) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_REF_REMOVE_MATERIAL,
  payload: { materialId },
});

export const createWhMTransferLocation = (centerId, locationId, materials) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_LOCATION,
  payload: { centerId, locationId, materials },
  [PROMISE_CALL]: () => api.createWhMTransferLocation(centerId, locationId, materials),
});

export const scanLocationFreeEntry = (centerId, locationBarCode) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_FREEENTRY_FETCH_LOCATION,
  payload: { centerId, locationBarCode },
  [PROMISE_CALL]: () => api.scanLocation(centerId, locationBarCode),
});

export const confirmScannedLocation = () => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_FREEENTRY_CONFIRM,
});

export const createWhMFreeEntry = (centerId, materialId, locationId, unitsToTraspase) => ({
  type: actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_FREEENTRY,
  payload: { centerId, materialId, locationId, unitsToTraspase },
  [PROMISE_CALL]: () => api.createWhMFreeEntry(centerId, materialId, locationId, unitsToTraspase),
});

export const fetchWarehouseMovementReferences = (centerId, warehouseMovementId, filters) => ({
  type: actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_REFERENCES,
  payload: { centerId, warehouseMovementId, filters },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementReferences(centerId, warehouseMovementId, filters),
});

export const fetchWarehouseMovementLocations = (centerId, warehouseMovementId, filters) => ({
  type: actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_LOCATIONS,
  payload: { centerId, warehouseMovementId, filters },
  [PROMISE_CALL]: () => api.fetchWarehouseMovementLocations(centerId, warehouseMovementId, filters),
});

export const inventoryLocationScanRef = (centerId, barcode) => ({
  type: actionTypes.STOCK_PDA_INVENTORY_LOCATION_SCAN_REF,
  payload: { centerId, barcode },
  [PROMISE_CALL]: () => api.fetchMaterialByBarcode(centerId, barcode),
});

export const inventoryReferenceScanLoc = (centerId, barcode) => ({
  type: actionTypes.STOCK_PDA_INVENTORY_MATERIAL_SCAN_LOC,
  payload: { centerId, barcode },
  [PROMISE_CALL]: () => api.fetchLocationByBarcode(centerId, barcode),
});

export const inventoryLocationUpdateRefStock = (stock) => ({
  type: actionTypes.STOCK_PDA_INVENTORY_LOCATION_UPDATE_REF_STOCK,
  payload: { stock },
});

export const inventoryMaterialUpdateLocStock = (stock) => ({
  type: actionTypes.STOCK_PDA_INVENTORY_MATERIAL_UPDATE_LOC_STOCK,
  payload: { stock },
});

export const inventoryLocationCancelInput = () => ({
  type: actionTypes.STOCK_PDA_INVENTORY_LOCATION_CANCEL_INPUT,
});

export const inventoryReferenceInLocation = (centerId, warehouseMovementId, data, extradata) => ({
  type: actionTypes.STOCK_PDA_EXEC_INVENTARY_REFERENCE_IN_LOCATION,
  payload: { centerId, warehouseMovementId, data, extradata },
  [PROMISE_CALL]: () => api.inventoryReferenceInLocation(centerId, warehouseMovementId, data),
});

export const transferLocScanRef = (centerId, materialBarcode) => ({
  type: actionTypes.STOCK_PDA_TRANSFER_LOCATION_SCAN_REF,
  payload: { centerId, materialBarcode },
  [PROMISE_CALL]: () => api.scanMaterial(centerId, materialBarcode),
});

export const transferExec = (centerId, warehousemovmementId, data, extraData = {}) => ({
  type: actionTypes.STOCK_PDA_TRANSFER_EXEC,
  payload: { centerId, warehousemovmementId, data, extraData },
  [PROMISE_CALL]: () => api.transferExec(centerId, warehousemovmementId, data),
});

export const changeTransferUnits = (units) => ({
  type: actionTypes.STOCK_PDA_TRANSFER_CHANGE_TRANSFER_UNITS,
  payload: { units },
});

export const transferLocScanTargetLoc = (centerId, targetLoc) => ({
  type: actionTypes.STOCK_PDA_TRANSFER_LOCATION_SCAN_TARGET_LOC,
  payload: { centerId, targetLoc },
  [PROMISE_CALL]: () => api.scanLocation(centerId, targetLoc),
});

export const transferRefScanSourceLoc = (centerId, sourceLoc) => ({
  type: actionTypes.STOCK_PDA_TRANSFER_MATERIAL_SCAN_SOURCE_LOC,
  payload: { centerId, sourceLoc },
  [PROMISE_CALL]: () => api.scanLocation(centerId, sourceLoc),
});

export const transferRefScanTargetLoc = (centerId, targetLoc) => ({
  type: actionTypes.STOCK_PDA_TRANSFER_MATERIAL_SCAN_TARGET_LOC,
  payload: { centerId, targetLoc },
  [PROMISE_CALL]: () => api.scanLocation(centerId, targetLoc),
});

export const setRedirectToExec = (redirect) => ({
  type: actionTypes.STOCK_PDA_SET_REDIRECT_TO_EXEC,
  payload: redirect,
});

export const setShowScanError = (show) => ({
  type: actionTypes.STOCK_PDA_SET_SHOW_SCAN_ERROR,
  paylaod: show,
});

export const fetchAvailableLoc = (centerId, materialId, filters) => ({
  type: actionTypes.STOCK_PDA_FETCH_AVAILABLE_LOC,
  payload: { centerId, materialId, filters },
  [PROMISE_CALL]: () => api.fetchAvailableLoc(centerId, materialId, filters),
});

export const fetchNextAvailableLoc = () => ({
  type: actionTypes.STOCK_PDA_FETCH_AVAILABLE_LOC_NEXT,
});

export const clearCreatedWarehouseMovement = () => ({
  type: actionTypes.STOCK_PDA_CLEAR_CREATED_WAREHOUSE_MOVEMENT,
});

export const transferLocationChooseMaterial = (materialId) => ({
  type: actionTypes.STOCK_PDA_WAREHOUSE_MOVEMENT_TRANSFER_LOCATION_CHOOSE_REF,
  payload: { materialId },
});

export const inventoryLocationChooseMaterial = (materialId) => ({
  type: actionTypes.STOCK_PDA_WAREHOUSE_MOVEMENT_INVENTORY_CHOOSE_REF,
  payload: { materialId },
});
