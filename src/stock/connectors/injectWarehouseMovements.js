import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/warehouse-movements";
import * as getters from "stock/getters/warehouse-movements";

const injectWarehouseMovements = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      warehouseMovements: getters.getWarehouseMovements(state),
      warehouseMovementDetail: getters.getCurrentStockMovement(state),
      view: getters.getView(state),
      selected: getters.getSelected(state),
      itemsTotal: getters.getTotalItems(state),
      warehouseMovementsFetching: getters.getFechingWarehouseMovements(state),
      forceUpdate: getters.getForceUpdateWarehouseMovements(state),
      warehouseMovementTypes: getters.getWarehouseMovementTypes(state),
      warehouseMovementStatus: getters.getWarehouseMovementStatus(state),
      assignedUsers: getters.getAssignedUsers(state),
      warehouseMovementDetailReferences: getters.getCurrentStockMovementReferences(state),
      warehouseMovementDetailLocations: getters.getCurrentStockMovementLocations(state),
      warehouseMovementTechnicians: getters.getWarehouseMovmementTechnicians(state),
      warehouseMovementsToAssign: getters.getWarehouseMovementsToAssign(state),
      deletedWaerhouseMovement: getters.getWarehouseMovementDeleted(state),
      referencesToTraspase: getters.getReferencesToTraspase(state),
      locationsToTraspase: getters.getLocationsToTraspase(state),
      traspaseTargetLocations: getters.getTraspaseTargetLocations(state),
      traspaseCreated: getters.getTraspaseCreated(state),
      locationsAvailableByMaterial: getters.getLocationsAvailableByMaterial(state),
      editTraspaseLocation: getters.getEditTraspaseLocation(state),
      editTraspaseMaterial: getters.getEditTraspaseMaterial(state),
      warehouseMovementUpdated: getters.getWarehouseMovementUpdated(state),
      availableLocationsByMaterial: getters.getAvailableLocationsByMaterial(state),
    }),
    (dispatch) => ({
      fetchWarehouseMovements: (centerId, filters) => dispatch(actions.fetchWarehouseMovements(centerId, filters)),
      fetchWarehouseMovementById: (centerId, warehouseMovementId) =>
        dispatch(actions.fetchWarehouseMovement(centerId, warehouseMovementId)),
      fetchWarehouseMovementTypes: () => dispatch(actions.fetchWarehouseMovementTypes()),
      fetchWarehouseMovementStatus: () => dispatch(actions.fetchWarehouseMovementStatus()),
      setView: (viewId) => dispatch(actions.setView(viewId)),
      setSelected: (selected) => dispatch(actions.setSelected(selected)),
      removeStockMovements: (centerId, stockMovementList) =>
        dispatch(actions.removeStockMovements(centerId, stockMovementList)),
      fetchAssignedUser: (userLogin) => dispatch(actions.fetchAssignedUser(userLogin)),
      fetchWarehouseMovementReferences: (centerId, warehouseMovementId, filters) =>
        dispatch(actions.fetchWarehouseMovementReferences(centerId, warehouseMovementId, filters)),
      fetchWarehouseMovementLocations: (centerId, warehouseMovementId, filters) =>
        dispatch(actions.fetchWarehouseMovementLocations(centerId, warehouseMovementId, filters)),
      fetchWarehouseMovementEditLocations: (centerId, warehouseMovementId, filters) =>
        dispatch(actions.fetchWarehouseMovementEditLocations(centerId, warehouseMovementId, filters)),
      fetchWarehouseMovementsTechnicians: (centerId) => dispatch(actions.fetchWarehouseMovementsTechnicians(centerId)),
      fetchWarehouseMovementByIdList: (centerId, warehouseMovementIdList) =>
        dispatch(actions.fetchWarehouseMovementByIdList(centerId, warehouseMovementIdList)),
      assignWarehouseMovement: (centerId, warehouseMovementId, technicianLogin, type, reasgin, pendingOrders) =>
        dispatch(
          actions.assignWarehouseMovement(centerId, warehouseMovementId, technicianLogin, type, reasgin, pendingOrders),
        ),
      fetchReferencesToTraspaseByIdList: (centerId, referencesIdList) =>
        dispatch(actions.fetchReferencesToTraspaseByIdList(centerId, referencesIdList)),
      addTraspaseRefTargetLocationLine: (materialId, location) =>
        dispatch(actions.addTraspaseRefTargetLocationLine(materialId, location)),
      removeTraspaseRefTargetLocationLine: (materialId, line) =>
        dispatch(actions.removeTraspaseRefTargetLocationLine(materialId, line)),
      updateTraspaseRefTargetLocationLineQty: (materialId, line, qty) =>
        dispatch(actions.updateTraspaseRefTargetLocationLineQty(materialId, line, qty)),
      updateTraspaseRefTargetLocationLineLocation: (materialId, line, location, targetLocation) =>
        dispatch(actions.updateTraspaseRefTargetLocationLineLocation(materialId, line, location, targetLocation)),
      fetchMaterialLocations: (centerId, materialId, filters) =>
        dispatch(actions.fetchMaterialLocations(centerId, materialId, filters)),
      createMaterialTraspase: (centerId, data) => dispatch(actions.createMaterialTraspase(centerId, data)),
      setGeneralTraspaseUnits: (materialId, sourceLocation, units) =>
        dispatch(actions.setGeneralTraspaseUnits(materialId, sourceLocation, units)),

      fetchLocationsByIdList: (centerId, locationIdsList) =>
        dispatch(actions.fetchLocationsByIdList(centerId, locationIdsList)),
      fetchLocationReferencesToTraspase: (centerId, locationId, filters) =>
        dispatch(actions.fetchLocationReferencesToTraspase(centerId, locationId, filters)),
      fetchLocationsOfReference: (centerId, materialId, filters) =>
        dispatch(actions.fetchLocationsOfReference(centerId, materialId, filters)),
      removeReferenceLocationTransfer: (locationId, materialId) =>
        dispatch(actions.removeReferenceLocationTransfer(locationId, materialId)),
      removeReferenceLocationEditTransfer: (locationId, materialId) =>
        dispatch(actions.removeReferenceLocationEditTransfer(locationId, materialId)),
      removeReferenceMaterialTransfer: (locationId, materialId) =>
        dispatch(actions.removeReferenceMaterialTransfer(locationId, materialId)),
      fetchWarehouseMovementEditReferences: (centerId, warehouseMovementId, filters) =>
        dispatch(actions.fetchWarehouseMovementEditReferences(centerId, warehouseMovementId, filters)),
      setEditTraspaseLocationRefUnits: (materialId, units) =>
        dispatch(actions.setEditTraspaseLocationRefUnits(materialId, units)),
      updateWarehouseMovement: (centerId, warehouseMovementId, data) =>
        dispatch(actions.updateWarehouseMovement(centerId, warehouseMovementId, data)),
      setEditTraspaseReferenceLocsUnits: (locationId, units) =>
        dispatch(actions.setEditTraspaseReferenceLocsUnits(locationId, units)),
      fetchAvailableLocations: (centerId, materialId, filters) =>
        dispatch(actions.fetchAvailableLocations(centerId, materialId, filters)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withWarehouseMovements"))(Wrapper);
};

export default injectWarehouseMovements;
