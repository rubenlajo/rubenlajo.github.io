import { intl } from "amiga-core/components/i18n";
import { get, post, put, del, getEndpoint, asJson, asError, applyPathParams } from "@/utils/";

const materialsEndpoint = getEndpoint("materials");
const materialEndpoint = getEndpoint("material");
const materialDetailEndpoint = getEndpoint("materialDetail");
const materialSummaryEndpoint = getEndpoint("materialSummary");
const materialMovementsEndpoint = getEndpoint("materialMovements");
const materialElementsEndpoint = getEndpoint("materialElements");
const materialLocationsEndpoint = getEndpoint("materialLocations");
const materialUsagesEndpoint = getEndpoint("materialUsages");
const materialDatesEndpoint = getEndpoint("materialDates");
const materialManufacturersEndpoint = getEndpoint("materialManufacturers");
const materialClasificationsEndpoint = getEndpoint("materialClasifications");
const materialPurchasesEndpoint = getEndpoint("materialPurchases");
const warehouseMovementEndpoint = getEndpoint("warehouseMovements");
const locationsEndpoint = getEndpoint("locations");

const fetchReferences = (centerId, filters) => {
  filters.locale = intl.locale;
  return get(applyPathParams(materialsEndpoint, { centerId }), { params: filters })
    .then(asJson)
    .catch(asError);
};

const getReferenceDetail = (centerId, materialId) => {
  const material = get(applyPathParams(materialDetailEndpoint, { centerId, materialId }), {params: {locale: intl.locale}}).then(asJson);

  const materialSummary = get(applyPathParams(materialSummaryEndpoint, { centerId, materialId }), {params: {locale: intl.locale}}).then(asJson);

  return Promise.all([material, materialSummary])
    .then(([materialData, materialSummaryData]) => ({
      ...materialData,
      materialSummary: materialSummaryData,
    }))
    .catch(asError);
};

const fetchMaterialMovements = (centerId, materialId, limit, offset) =>
  get(applyPathParams(materialMovementsEndpoint, { centerId, materialId }), {
    params: { limit, offset, order: "-creationDate" },
  })
    .then(asJson)
    .catch(asError);

const fetchMaterialElements = (centerId, materialId, limit, offset) =>
  get(applyPathParams(materialElementsEndpoint, { centerId, materialId }), { params: { limit, offset } })
    .then(asJson)
    .catch(asError);

const fetchMaterialLocations = (centerId, materialId, limit, offset) =>
  get(applyPathParams(materialLocationsEndpoint, { centerId, materialId }), { params: { limit, offset } })
    .then(asJson)
    .catch(asError);

const fetchMaterialUsages = (centerId, materialId, limit, offset) =>
  get(applyPathParams(materialUsagesEndpoint, { centerId, materialId }), {
    params: { limit, offset, order: "-creationDate" },
  })
    .then(asJson)
    .catch(asError);

const fetchMaterialDates = (centerId, materialId) =>
  get(applyPathParams(materialDatesEndpoint, { centerId, materialId }))
    .then(asJson)
    .catch(asError);

const getMaterialPurchase = (centerId, purchaseLocationCode, referenceId) =>
  get(applyPathParams(materialPurchasesEndpoint, { centerId }), {
    params: {
      materialIds: referenceId,
      purchaseLocationCode,
    },
  }).then(asJson);

const createReference = (centerId, manufacturerReference) =>
  get(applyPathParams(materialsEndpoint, { centerId }), {
    params: { limit: 1, offset: 0, query: `manufacturerReference==${manufacturerReference}`, order: "" },
  })
    .then(asJson)
    .then((response) =>
      response.data.length > 0 ? getReferenceDetail(centerId, response.data[0].materialId) : response,
    )
    .catch(asError);

const saveReference = (centerId, materialId, data) =>
  put(applyPathParams(materialEndpoint, { centerId, materialId }), {
    body: data,
  })
    .then(() => getReferenceDetail(centerId, materialId))
    .catch(asError);

const removeReferences = (centerId, materialIds) => {
  const calls = [];
  materialIds.forEach((materialId) => {
    calls.push(del(applyPathParams(materialEndpoint, { centerId, materialId })).catch(asError));
  });

  return Promise.all(calls).catch(asError);
};

const fetchMaterialManufacturers = () =>
  get(materialManufacturersEndpoint, { params: { limit: 50, offset: 0 } })
    .then(asJson)
    .catch(asError);

const fetchMaterialClassification = () =>
  get(materialClasificationsEndpoint, { params: { locale: intl.locale } })
    .then(asJson)
    .catch(asError);

const inventoryMaterials = (centerId, materialsList = []) => {
  const warehouseMovements = [];
  materialsList.forEach((materialId) => {
    warehouseMovements.push({
      warehouseMovementTypeId: 1,
      materialId: materialId,
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

const getLocationsAvailable = (centerId, materialId, filters) => {
  const params = { offset: filters.offset, limit: filters.limit };
  if (filters.locationName) {
    params.query = `locationName==${filters.locationName}`;
  }

  return get(applyPathParams(locationsEndpoint, { centerId, materialId }), { params })
    .then(asJson)
    .catch(asError);
};

// Exposed api methods
export default {
  fetchReferences,
  getReferenceDetail,
  fetchMaterialMovements,
  fetchMaterialElements,
  fetchMaterialLocations,
  fetchMaterialUsages,
  fetchMaterialDates,
  getMaterialPurchase,
  saveReference,
  createReference,
  removeReferences,
  fetchMaterialManufacturers,
  fetchMaterialClassification,
  inventoryMaterials,
  getLocationsAvailable,
};
