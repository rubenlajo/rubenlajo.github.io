import { get, post, put, getEndpoint, asJson, asError, applyPathParams } from "@/utils/";

const materialDetailEndpoint = getEndpoint("materialDetail");
const materialLocationsEndpoint = getEndpoint("materialLocations");
const materialLocationAvailable = getEndpoint("locationsAvailable");
const materialDetailBarcodeEndpoint = getEndpoint("materialDetailBarcode");
const locationDetailEndpoint = getEndpoint("location");
const locationDetailBarcodeEndpoint = getEndpoint("locationDetailBarcode");
const warehouseMovementsEndpoint = getEndpoint("warehouseMovements");
const warehouseMovementEndpoint = getEndpoint("warehouseMovement");
const warehouseMovementReferencesEndpoint = getEndpoint("warehouseMovementReferences");
const warehouseMovementLocationsEndpoint = getEndpoint("warehouseMovementLocations");
const warehouseMovementTehcnniciansEndpoint = getEndpoint("warehouseMovementTechnicians");
const warehouseMovementTechniciansAssignEndpont = getEndpoint("warehouseMovementTechniciansAssign");
const warehouseMovementChangeStatusEndpoint = getEndpoint("warehouseMovementChangeStatus");
const warehouseMovementStatusEndpoint = getEndpoint("warehouseMovementStatus");
const locationMaterialsEndpoint = getEndpoint("locationMaterials");
const warehouseMovementAssignementsEndpoint = getEndpoint("warehouseMovementAssignements");
const warehouseMovementInventoriesEndpoint = getEndpoint("warehouseMovementInventories");
const warehouseMovementTransferEndpoint = getEndpoint("warehouseMovementTransfer");

const fetchMaterialById = (centerId, materialId) =>
  get(applyPathParams(materialDetailEndpoint, { centerId, materialId }))
    .then(asJson)
    .catch(asError);

const fetchMaterialLocations = (centerId, materialId, filters) =>
  get(applyPathParams(materialLocationsEndpoint, { centerId, materialId }), { params: filters }).then(asJson);

const fetchMaterialByBarcode = (centerId, materialBarcode) =>
  get(applyPathParams(materialDetailBarcodeEndpoint, { centerId }), {
    params: { materialBarcode },
  }).then(asJson);

const fetchLocationById = (centerId, locationId) =>
  get(applyPathParams(locationDetailEndpoint, { centerId, locationId }))
    .then(asJson)
    .catch(asError);

const fetchLocationByBarcode = (centerId, locationBarcode) =>
  get(applyPathParams(locationDetailBarcodeEndpoint, { centerId }), {
    params: { locationBarcode },
  }).then(asJson);

const scanLocation = (centerId, locationBarcode) => fetchLocationByBarcode(centerId, locationBarcode).catch(asError);
const scanMaterial = (centerId, materialBarcode) => fetchMaterialByBarcode(centerId, materialBarcode).catch(asError);

const fetchWarehouseMovements = (centerId, filters) =>
  get(applyPathParams(warehouseMovementsEndpoint, { centerId }), {
    params: filters,
  })
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovement = (centerId, warehouseMovementId) =>
  get(applyPathParams(warehouseMovementEndpoint, { centerId, warehouseMovementId }))
    .then(asJson)
    .catch(asError);

const fetchAssignement = (centerId) =>
  get(applyPathParams(warehouseMovementAssignementsEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovementTechnicians = (centerId) =>
  get(applyPathParams(warehouseMovementTehcnniciansEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);

const assignWarehouseMovement = (centerId, warehouseMovementId, assignedUser) =>
  put(applyPathParams(warehouseMovementTechniciansAssignEndpont, { centerId, warehouseMovementId }), {
    body: { assignedUser },
  }).catch(asError);

const updateWarehouseMovemementStatus = (centerId, warehouseMovementId, warehouseMovementStatusId) =>
  put(applyPathParams(warehouseMovementChangeStatusEndpoint, { centerId, warehouseMovementId }), {
    body: {
      warehouseMovementStatus: {
        warehouseMovementStatusId: warehouseMovementStatusId,
      },
    },
  }).catch(asError);

const fetchWarehouseMovementStatus = () =>
  get(warehouseMovementStatusEndpoint)
    .then(asJson)
    .catch(asError);

const createWarehouseMovementInventoryMaterial = (centerId, materialId) =>
  post(applyPathParams(warehouseMovementsEndpoint, { centerId }), {
    body: {
      warehouseMovements: [
        {
          warehouseMovementTypeId: 1,
          materialId: materialId,
        },
      ],
    },
  })
    .then(asJson)
    .catch(asError);

const createWarehouseMovementInventoryLocation = (centerId, locationId) =>
  post(applyPathParams(warehouseMovementsEndpoint, { centerId }), {
    body: {
      warehouseMovements: [
        {
          warehouseMovementTypeId: 1,
          locationId: locationId,
        },
      ],
    },
  })
    .then(asJson)
    .catch(asError);

const createWhMTransferReference = (centerId, materialId, locations) => {
  const data = {
    warehouseMovements: [
      {
        warehouseMovementTypeId: 2,
        materialId: materialId,
        movements: locations.map((location) => ({
          material: {
            materialId: materialId,
          },
          sourceLocation: {
            location: {
              locationId: location.locationId,
            },
            unitsToTransfer: location.unitsToTraspase,
          },
          targetLocations: [],
        })),
      },
    ],
  };

  return post(applyPathParams(warehouseMovementsEndpoint, { centerId }), { body: data })
    .then(asJson)
    .catch(asError);
};

const fetchLocationMaterials = (centerId, locationId, filters) =>
  get(applyPathParams(locationMaterialsEndpoint, { centerId, locationId }), { params: filters })
    .then(asJson)
    .catch(asError);

const createWhMTransferLocation = (centerId, locationId, materials) => {
  const data = {
    warehouseMovements: [
      {
        warehouseMovementTypeId: 2,
        locationId: locationId,
        movements: materials.map((material) => ({
          material: {
            materialId: material.materialId,
          },
          sourceLocation: {
            location: {
              locationId: locationId,
            },
            unitsToTransfer: material.unitsToTraspase,
          },
          targetLocations: [],
        })),
      },
    ],
  };

  return post(applyPathParams(warehouseMovementsEndpoint, { centerId }), { body: data })
    .then(asJson)
    .catch(asError);
};

const createWhMFreeEntry = (centerId, materialId, locationId, unitsToLocate) => {
  const data = {
    warehouseMovements: [
      {
        materialId,
        warehouseMovementTypeId: 4,
        movements: [
          {
            targetLocations: [
              {
                location: {
                  locationId,
                },
                unitsToLocate,
              },
            ],
          },
        ],
      },
    ],
  };

  return post(applyPathParams(warehouseMovementsEndpoint, { centerId }), { body: data })
    .then(asJson)
    .catch(asError);
};

const fetchWarehouseMovementReferences = (centerId, warehouseMovementId, filters) =>
  get(applyPathParams(warehouseMovementReferencesEndpoint, { centerId, warehouseMovementId }), {
    params: filters,
  })
    .then(asJson)
    .catch(asError);

const fetchWarehouseMovementLocations = (centerId, warehouseMovementId, filters) =>
  get(applyPathParams(warehouseMovementLocationsEndpoint, { centerId, warehouseMovementId }), {
    params: filters,
  })
    .then(asJson)
    .catch(asError);

const inventoryReferenceInLocation = (centerId, warehouseMovementId, data) => {
  return post(applyPathParams(warehouseMovementInventoriesEndpoint, { centerId, warehouseMovementId }), {
    body: data,
  }).catch(asError);
};

const transferExec = (centerId, warehouseMovementId, data) => {
  return post(applyPathParams(warehouseMovementTransferEndpoint, { centerId, warehouseMovementId }), {
    body: data,
  }).catch(asError);
};

const fetchAvailableLoc = (centerId, materialId, filters) =>
  get(applyPathParams(materialLocationAvailable, { centerId, materialId }), { params: filters })
    .then(asJson)
    .catch(asError);

// Exposed api methods
export default {
  fetchMaterialById,
  fetchMaterialLocations,
  fetchMaterialByBarcode,
  fetchLocationById,
  fetchLocationByBarcode,
  fetchWarehouseMovements,
  fetchAssignement,
  fetchWarehouseMovement,
  fetchWarehouseMovementTechnicians,
  assignWarehouseMovement,
  updateWarehouseMovemementStatus,
  fetchWarehouseMovementStatus,
  createWarehouseMovementInventoryMaterial,
  createWarehouseMovementInventoryLocation,
  createWhMTransferReference,
  fetchLocationMaterials,
  createWhMTransferLocation,
  createWhMFreeEntry,
  scanLocation,
  scanMaterial,
  fetchWarehouseMovementReferences,
  fetchWarehouseMovementLocations,
  inventoryReferenceInLocation,
  transferExec,
  fetchAvailableLoc,
};
