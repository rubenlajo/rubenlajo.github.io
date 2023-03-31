import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/pda";
import * as getters from "stock/getters/pda";

const injectPda = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      dashboard: getters.getDashboard(state),
      material: getters.getMaterial(state),
      materials: getters.getMaterials(state),
      location: getters.getLocation(state),
      barcodeScan: getters.getBarcodeScan(state),
      fetchingMaterialByBarcode: getters.getBarcodeScanFetching(state),
      redirect: getters.getRedirect(state),
      assignedWorkOrders: getters.getAsignedWorkOrders(state),
      totalWorkOrders: getters.getTotalWorkOrders(state),
      purchaseOrders: getters.getPurchaseOrders(state),
      warehouseMovements: getters.getWarehouseMovements(state),
      warehouseMovement: getters.getWarehouseMovement(state),
      technicians: getters.getWarehouseMovementTechnicians(state),
      warehouseMovementsStatus: getters.getWarehouseMovementStatus(state),
      warehouseMovementsCreated: getters.getWarehouseMovementCreated(state),
      locationEditing: getters.getLocationEditing(state),
      locationMaterials: getters.getLocationMaterials(state),
      materialLocations: getters.getMaterialLocations(state),
      materialEditing: getters.getMaterialEditing(state),
      freeEntry: getters.getFreeEntry(state),
      warehouseMovementReferences: getters.getWarehouseMovementReferences(state),
      warehouseMovementLocations: getters.getWarehouseMovementLocations(state),
      inventoryLocationExec: getters.getInventoryLocationExec(state),
      inventoryMaterialExec: getters.getInventoryMaterialExec(state),
      transferLocationExec: getters.getTransferLocationExec(state),
      transferMaterialExec: getters.getTransferMaterialExec(state),
      transferStart: getters.getTransferStart(state),
      foceUpdateMovement: getters.getFoceUpdateMovement(state),
      redirectToExec: getters.getRedirectToExect(state),
      changeStatusTriggered: getters.getChangeStatusTriggered(state),
      availableLocations: getters.getAvailableLocations(state),
    }),
    (dispatch) => ({
      setShowScanError: (show) => dispatch(actions.setShowScanError(show)),
      fetchMaterialByBarcode: (centerId, barcode, redirect) =>
        dispatch(actions.fetchMaterialByBarcode(centerId, barcode, redirect)),
      fetchLocationByBarcode: (centerId, barcode, redirect) =>
        dispatch(actions.fetchLocationByBarcode(centerId, barcode, redirect)),
      fetchMaterialById: (centerId, materialId) => dispatch(actions.fetchMaterialById(centerId, materialId)),
      fetchMaterialLocations: (centerId, materialId, filters) =>
        dispatch(actions.fetchMaterialLocations(centerId, materialId, filters)),
      fetchLocationById: (centerId, locationId) => dispatch(actions.fetchLocationById(centerId, locationId)),
      fetchLocationMaterials: (centerId, locationId, filters) =>
        dispatch(actions.fetchLocationMaterials(centerId, locationId, filters)),
      setRedirect: (redirect) => dispatch(actions.setRedirect(redirect)),
      fetchAssignement: (centerId) => dispatch(actions.fetchAssignement(centerId)),
      fetchWarehouseMovementStatus: () => dispatch(actions.fetchWarehouseMovementStatus()),
      resetWarehouseMovementStatusFlag: () => dispatch(actions.resetWarehouseMovementStatusFlag()),
      fetchWarehouseMovements: (centerId, filters) => dispatch(actions.fetchWarehouseMovements(centerId, filters)),
      fetchWarehouseMovement: (centerId, warehouseMovementId) =>
        dispatch(actions.fetchWarehouseMovement(centerId, warehouseMovementId)),
      fetchWarehouseMovementTechnicians: (centerId) => dispatch(actions.fetchWarehouseMovementTechnicians(centerId)),
      clearWarhouseMovementTechnicians: () => dispatch(actions.clearWarhouseMovementTechnicians()),
      assignWarehouseMovement: (centerId, warehouseMovementId, userToAssign, assignWarehouseMovement, redirectToExec) =>
        dispatch(
          actions.assignWarehouseMovement(
            centerId,
            warehouseMovementId,
            userToAssign,
            assignWarehouseMovement,
            redirectToExec,
          ),
        ),
      updateWarehouseMovemementStatus: (
        centerId,
        warehouseMovementId,
        warehouseMovmementStatus,
        warehouseMovementTypeName,
        redirect,
        displayNotification,
      ) =>
        dispatch(
          actions.updateWarehouseMovemementStatus(
            centerId,
            warehouseMovementId,
            warehouseMovmementStatus,
            warehouseMovementTypeName,
            redirect,
            displayNotification,
          ),
        ),
      createWarehouseMovementInventoryMaterial: (centerId, materialId) =>
        dispatch(actions.createWarehouseMovementInventoryMaterial(centerId, materialId)),
      createWarehouseMovementInventoryLocation: (centerId, locationId) =>
        dispatch(actions.createWarehouseMovementInventoryLocation(centerId, locationId)),
      createWhMTransferRefSetUnits: (units) => dispatch(actions.createWhMTransferRefSetUnits(units)),
      setLocationEditing: (location) => dispatch(actions.setLocationEditing(location)),
      createWhMTransferRefConfirmUnits: (units) => dispatch(actions.createWhMTransferRefConfirmUnits(units)),
      createWhMTransferRemoveLocation: (locationId) => dispatch(actions.createWhMTransferRemoveLocation(locationId)),
      createWhMTransferReference: (centerId, material, locations) =>
        dispatch(actions.createWhMTransferReference(centerId, material, locations)),
      setMaterialEditing: (material) => dispatch(actions.setMaterialEditing(material)),
      createWhTransferLocationConfirmUnits: (units) => dispatch(actions.createWhTransferLocationConfirmUnits(units)),
      createWhMTransferRemoveReference: (materialId) => dispatch(actions.createWhMTransferRemoveReference(materialId)),
      createWhMTransferLocation: (centerId, locationId, materials) =>
        dispatch(actions.createWhMTransferLocation(centerId, locationId, materials)),
      scanLocationFreeEntry: (centerId, locationBarCode) =>
        dispatch(actions.scanLocationFreeEntry(centerId, locationBarCode)),
      confirmScannedLocation: () => dispatch(actions.confirmScannedLocation()),
      createWhMFreeEntry: (centerId, materialId, locationId, unitsToTraspase) =>
        dispatch(actions.createWhMFreeEntry(centerId, materialId, locationId, unitsToTraspase)),
      fetchWarehouseMovementReferences: (centerId, warhouseMovementId, filters) =>
        dispatch(actions.fetchWarehouseMovementReferences(centerId, warhouseMovementId, filters)),
      fetchWarehouseMovementLocations: (centerId, warhouseMovementId, filters) =>
        dispatch(actions.fetchWarehouseMovementLocations(centerId, warhouseMovementId, filters)),

      inventoryLocationScanRef: (centerId, barcode) => dispatch(actions.inventoryLocationScanRef(centerId, barcode)),
      inventoryReferenceScanLoc: (centerId, barcode) => dispatch(actions.inventoryReferenceScanLoc(centerId, barcode)),
      inventoryLocationUpdateRefStock: (stock) => dispatch(actions.inventoryLocationUpdateRefStock(stock)),
      inventoryMaterialUpdateLocStock: (stock) => dispatch(actions.inventoryMaterialUpdateLocStock(stock)),
      inventoryLocationCancelInput: () => dispatch(actions.inventoryLocationCancelInput()),
      inventoryReferenceInLocation: (centerId, warehouseMovementId, data, material) =>
        dispatch(actions.inventoryReferenceInLocation(centerId, warehouseMovementId, data, material)),

      transferLocScanRef: (centerId, materialBarcode) =>
        dispatch(actions.transferLocScanRef(centerId, materialBarcode)),
      transferExec: (centerId, warehouseMovementId, data, extraData) =>
        dispatch(actions.transferExec(centerId, warehouseMovementId, data, extraData)),

      changeTransferUnits: (units) => dispatch(actions.changeTransferUnits(units)),
      transferLocScanTargetLoc: (centerId, locationBarCode) =>
        dispatch(actions.transferLocScanTargetLoc(centerId, locationBarCode)),

      transferRefScanSourceLoc: (centerId, locationBarcode) =>
        dispatch(actions.transferRefScanSourceLoc(centerId, locationBarcode)),
      transferRefScanTargetLoc: (centerId, locationBarcode) =>
        dispatch(actions.transferRefScanTargetLoc(centerId, locationBarcode)),
      setRedirectToExec: (redirect) => dispatch(actions.setRedirectToExec(redirect)),
      fetchAvailableLoc: (centerId, materialId, filters) =>
        dispatch(actions.fetchAvailableLoc(centerId, materialId, filters)),
      fetchNextAvailableLoc: () => dispatch(actions.fetchNextAvailableLoc()),
      clearCreatedWarehouseMovement: () => dispatch(actions.clearCreatedWarehouseMovement()),
      transferLocationChooseMaterial: (materialId) => dispatch(actions.transferLocationChooseMaterial(materialId)),
      inventoryLocationChooseMaterial: (materialId) => dispatch(actions.inventoryLocationChooseMaterial(materialId)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withPda"))(Wrapper);
};

export default injectPda;
