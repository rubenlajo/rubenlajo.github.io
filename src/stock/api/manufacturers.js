import { get, getEndpoint, asJson, asError, applyPathParams } from "@/utils/";

const manufacturersEndpoint = getEndpoint("materialManufacturers");
const manufacturerEndpoint = getEndpoint("materialManufacturer");

const fetchManufacturers = (filters) =>
  get(manufacturersEndpoint, { params: filters })
    .then(asJson)
    .catch(asError);

const fetchManufacturerById = (manufacturerId) =>
  get(applyPathParams(manufacturerEndpoint, { manufacturerId }))
    .then(asJson)
    .catch(asError);

// Exposed api methods
export default {
  fetchManufacturers,
  fetchManufacturerById,
};
