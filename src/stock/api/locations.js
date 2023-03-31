import { get, post, put, del, getEndpoint, asJson, asError, applyPathParams } from "@/utils/";

const locationsEndpoint = getEndpoint("locations");
const locationEndpoint = getEndpoint("location");
const locationBehaviourTypesEndpoint = getEndpoint("locationBehaviourTypes");
const locationsPatternsEndpoint = getEndpoint("locationsPatterns");
const locationMaterialsEndpoint = getEndpoint("locationMaterials");
const sparePartsWarehousesEndpoint = getEndpoint("sparePartsWarehouses");
const locationLastInventoryStatusEndpoint = getEndpoint("locationLastInventoryStatus");
const warehouseMovementEndpoint = getEndpoint("warehouseMovements");

const fetchLocations = (centerId, filters) =>
  get(applyPathParams(locationsEndpoint, { centerId }), { params: filters })
    .then(asJson)
    .catch(asError);

const getLocationDetail = (centerId, locationId) =>
  get(applyPathParams(locationEndpoint, { centerId, locationId }))
    .then(asJson)
    .catch(asError);

const createLocation = (centerId, data) =>
  post(applyPathParams(locationsEndpoint, { centerId }), {
    body: data,
  })
    .then(asJson)
    .catch(asError);

const saveLocation = (centerId, locationId, data) =>
  put(applyPathParams(locationEndpoint, { centerId, locationId }), {
    body: data,
  })
    // .then(asJson)
    .catch(asError);

const removeLocations = (centerId, locationsList) => {
  const callList = [];
  locationsList.forEach((location) => {
    callList.push(del(applyPathParams(locationEndpoint, { centerId, locationId: location.locationId })));
  });

  return Promise.all(callList).catch(asError);
};

const fetchLocationBehaviourTypes = () =>
  get(locationBehaviourTypesEndpoint)
    .then(asJson)
    .catch(asError);

const fetchLocationsPatterns = (centerId) =>
  get(applyPathParams(locationsPatternsEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);

const fetchLocationMaterials = (centerId, locationId, filters) =>
  get(applyPathParams(locationMaterialsEndpoint, { centerId, locationId }), { params: filters })
    .then(asJson)
    .catch(asError);

const fetchSparePartsWarehouses = (centerId) =>
  get(applyPathParams(sparePartsWarehousesEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);

const fetchLocationLastInventoryStatus = () =>
  get(locationLastInventoryStatusEndpoint)
    .then(asJson)
    .catch(asError);

const inventoryLocations = (centerId, locationsList = []) => {
  const warehouseMovements = [];
  locationsList.forEach((locationId) => {
    warehouseMovements.push({
      warehouseMovementTypeId: 1,
      locationId: locationId,
    });
  });
  return post(applyPathParams(warehouseMovementEndpoint, { centerId }), {
    body: {
      warehouseMovements: warehouseMovements,
    },
  })
    .then(asJson)
    .catch(asError);
};

const fetchLastMovements = (centerId, filters) => {
  return get(applyPathParams(warehouseMovementEndpoint, { centerId }), { params: filters })
    .then(asJson)
    .catch(asError);
};

// Exposed api methods
export default {
  fetchLocations,
  getLocationDetail,
  createLocation,
  saveLocation,
  removeLocations,
  fetchLocationBehaviourTypes,
  fetchLocationsPatterns,
  fetchLocationMaterials,
  fetchSparePartsWarehouses,
  fetchLocationLastInventoryStatus,
  inventoryLocations,
  fetchLastMovements,
};
