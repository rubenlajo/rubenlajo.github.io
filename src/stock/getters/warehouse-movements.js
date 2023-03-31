export const getWarehouseMovements = state => state.stock.warehouseMovements.all;
export const getTotalItems = state => state.stock.warehouseMovements.itemsTotal;
export const getFechingWarehouseMovements = state =>
  state.stock.warehouseMovements.fetchingWarehouseMovements;
export const getForceUpdateWarehouseMovements = state => state.stock.warehouseMovements.forceUpdate;
export const getView = state => state.stock.warehouseMovements.view;
export const getAssignedUsers = state => state.stock.warehouseMovements.assignedUsers;
export const getSelected = state => state.stock.warehouseMovements.selected;
export const getCurrentStockMovement = state =>
  state.stock.warehouseMovements.currentWarehouseMovement;
export const getCurrentStockMovementReferences = state =>
  state.stock.warehouseMovements.currentWarehouseMovementReferences;
export const getCurrentStockMovementLocations = state =>
  state.stock.warehouseMovements.currentWarehouseMovementLocations;
export const getWarehouseMovementTypes = state =>
  state.stock.warehouseMovements.warehouseMovementTypes;
export const getWarehouseMovementStatus = state =>
  state.stock.warehouseMovements.warehouseMovementStatus;
export const getWarehouseMovmementTechnicians = state =>
  state.stock.warehouseMovements.warehouseMovementTechnicians;
export const getWarehouseMovementsToAssign = state =>
  state.stock.warehouseMovements.warehouseMovementsToAssign;
export const getWarehouseMovementDeleted = state =>
  state.stock.warehouseMovements.deletedWaerhouseMovement;
export const getReferencesToTraspase = state => state.stock.warehouseMovements.referencesToTraspase;
export const getLocationsToTraspase = state => state.stock.warehouseMovements.locationsToTraspase;
export const getTraspaseTargetLocations = state =>
  state.stock.warehouseMovements.traspaseTargetLocations;
export const getTraspaseCreated = state => state.stock.warehouseMovements.traspaseCreated;
export const getLocationsAvailableByMaterial = state =>
  state.stock.warehouseMovements.locationsAvailableByMaterial;
export const getEditTraspaseLocation = state => state.stock.warehouseMovements.editTraspaseLocation;
export const getEditTraspaseMaterial = state => state.stock.warehouseMovements.editTraspaseMaterial;
export const getWarehouseMovementUpdated = state =>
  state.stock.warehouseMovements.warehouseMovementUpdated;
export const getAvailableLocationsByMaterial = state =>
  state.stock.warehouseMovements.availableLocationsByMaterial;
