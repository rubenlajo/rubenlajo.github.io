export const getLocations = (state) => state.stock.locations.all;
export const getLocationsFetching = (state) => state.stock.locations.locationsFetching;
export const getLocationsRefresh = (state) => state.stock.locations.locationsRefresh;
export const getView = (state) => state.stock.locations.view;
export const getTotalItems = (state) => state.stock.locations.itemsTotal;
export const getSelectedLocations = (state) => state.stock.locations.selected;
export const getCurrentLocation = (state) => state.stock.locations.currentLocation;
export const getEditMode = (state) => state.stock.locations.editMode;
export const getLocationCreated = (state) => state.stock.locations.created;
export const getLocationBehaviourTypes = (state) => state.stock.locations.behaviourTypes;
export const getLocationPattern = (state) => state.stock.locations.locationPattern;
export const getLocationMaterials = (state) => state.stock.locations.locationMaterials;
export const getSparePartsWarehouses = (state) => state.stock.locations.sparePartsWarehouses;
export const getLocationLastInventoryStatus = (state) => state.stock.locations.locationLastInventoryStatus;
export const getLocationLastMovements = (state) => state.stock.locations.locationLastMovements;