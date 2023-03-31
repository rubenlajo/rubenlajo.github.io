import { csrfGet, get, post, put, del, getEndpoint, asJson, asError, applyPathParams, jsonToRSQL } from "@/utils/";

const warehouseMovementsEndpoint = getEndpoint("warehouseMovements");
const warehouseMovementEndpoint = getEndpoint("warehouseMovement");
const warehouseMovementTechniciansAssignEndpoint = getEndpoint("warehouseMovementTechniciansAssign");
const warehouseMovementTypesEndpoint = getEndpoint("warehouseMovementTypes");
const warehouseMovementStatusEndpoint = getEndpoint("warehouseMovementStatus");
const userPhotoEndpoint = getEndpoint("userPhoto");
const warehouseMovementReferencesEndpoint = getEndpoint("warehouseMovementReferences");
const warehouseMovementLocationsEndpoint = getEndpoint("warehouseMovementLocations");
const warehouseMovementsTechniciansEndpoint = getEndpoint("warehouseMovementTechnicians");
const materialsEndpoint = getEndpoint("materials");
const materialLocationsEndpoint = getEndpoint("materialLocations");
const locationsEndpoint = getEndpoint("locations");
const locationMaterialsEndpoint = getEndpoint("locationMaterials");
const locationsAvailableEndpoint = getEndpoint("locationsAvailable");

const fetchWarehouseMovements = (centerId, filters) =>
  get(applyPathParams(warehouseMovementsEndpoint, { centerId }), { params: filters })
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovementTypes = () => {
  return get(warehouseMovementTypesEndpoint)
    .then(asJson)
    .catch(asError);
};

const fetchWarehouseMovementStatus = () =>
  get(warehouseMovementStatusEndpoint)
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovement = (centerId, warehouseMovementId) =>
  get(applyPathParams(warehouseMovementEndpoint, { centerId, warehouseMovementId }))
    .then(asJson)
    .catch(asError);

const removeStockMovements = (centerId, warehouseMovementIdList) => {
  const calls = [];
  warehouseMovementIdList.forEach((warehouseMovementId) => {
    calls.push(del(applyPathParams(warehouseMovementEndpoint, { centerId, warehouseMovementId })));
  });

  return (
    Promise.all(calls)
      // .then(asJson)
      .catch(asError)
  );
};

const assignWarehouseMovement = (centerId, warehouseMovementId, technicianLogin) =>
  put(applyPathParams(warehouseMovementTechniciansAssignEndpoint, { centerId, warehouseMovementId }), {
    body: { assignedUser: technicianLogin },
  })
    // .then(asJson)
    .catch(asError);

const fetchAssignedUser = (userLogin) =>
  csrfGet(userPhotoEndpoint, { params: { userLogin } })
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovementReferences = (centerId, warehouseMovementId, { offset, limit }) =>
  get(applyPathParams(warehouseMovementReferencesEndpoint, { centerId, warehouseMovementId }), {
    params: { offset, limit },
  })
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovementLocations = (centerId, warehouseMovementId, { offset, limit }) =>
  get(applyPathParams(warehouseMovementLocationsEndpoint, { centerId, warehouseMovementId }), {
    params: { offset, limit },
  })
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovementsTechnicians = (centerId) =>
  get(applyPathParams(warehouseMovementsTechniciansEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovementByIdList = (centerId, warehouseMovementIdList) => {
  const calls = [];
  warehouseMovementIdList.forEach((warehouseMovementId) => {
    calls.push(fetchWarehouseMovement(centerId, warehouseMovementId));
  });

  return Promise.all(calls).catch(asError);
};

const fetchReferencesToTraspaseByIdList = (centerId, referencesIdList) =>
  get(applyPathParams(materialsEndpoint, { centerId }), {
    params: {
      offset: 0,
      limit: referencesIdList.length,
      query: jsonToRSQL({ materialId: referencesIdList }),
    },
  })
    .then(asJson)
    .catch(asError);

const fetchMaterialLocations = (centerId, materialId, filters) => {
  return get(applyPathParams(materialLocationsEndpoint, { centerId, materialId }), { params: filters })
    .then(asJson)
    .catch(asError);
};

const createMaterialTraspase = (centerId, warehouseMovements) => {
  return post(applyPathParams(warehouseMovementsEndpoint, { centerId }), {
    body: {
      warehouseMovements,
    },
  })
    .then(asJson)
    .catch(asError);
};

const fetchLocationsByIdList = (centerId, locationsIdsList) => {
  const params = {
    offset: 0,
    limit: locationsIdsList.length,
    query: jsonToRSQL({ locationId: locationsIdsList }),
  };
  return get(applyPathParams(locationsEndpoint, { centerId }), { params })
    .then(asJson)
    .catch(asError);
};

const fetchLocationReferencesToTraspase = (centerId, locationId, filters) =>
  get(applyPathParams(locationMaterialsEndpoint, { centerId, locationId }), {
    params: filters,
  })
    .then(asJson)
    .catch(asError);

const fetchLocationsOfReference = (centerId, materialId, filters) =>
  get(applyPathParams(materialLocationsEndpoint, { centerId, materialId }), { params: filters })
    .then(asJson)
    .catch(asError);

const updateWarehouseMovement = (centerId, warehouseMovementId, data) =>
  put(applyPathParams(warehouseMovementEndpoint, { centerId, warehouseMovementId }), { body: data })
    .then(asJson)
    .catch(asError);

const fetchAvailableLocations = (centerId, materialId, filters) => {
  return get(applyPathParams(locationsAvailableEndpoint, { centerId, materialId }), { params: filters })
    .then(asJson)
    .catch(asError);
};

// Exposed api methods
export default {
  fetchWarehouseMovements,
  fetchWarehouseMovementTypes,
  fetchWarehouseMovementStatus,
  fetchWarehouseMovement,
  removeStockMovements,
  assignWarehouseMovement,
  fetchAssignedUser,
  fetchWarehouseMovementReferences,
  fetchWarehouseMovementLocations,
  fetchWarehouseMovementsTechnicians,
  fetchWarehouseMovementByIdList,
  fetchReferencesToTraspaseByIdList,
  fetchMaterialLocations,
  createMaterialTraspase,
  fetchLocationsByIdList,
  fetchLocationReferencesToTraspase,
  fetchLocationsOfReference,
  updateWarehouseMovement,
  fetchAvailableLocations,
};
