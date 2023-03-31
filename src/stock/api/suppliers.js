import { get, getEndpoint, asJson, asError, applyPathParams } from "@/utils/";

const suppliersEndpoint = getEndpoint("suppliers");
const supplierEndpoint = getEndpoint("supplier");

const fetchSuppliers = (centerId, filters) =>
  get(applyPathParams(suppliersEndpoint, { centerId }), { params: filters })
    .then(asJson)
    .catch(asError);

const fetchSuppliersById = (centerId, supplierId) =>
  get(applyPathParams(supplierEndpoint, { centerId, supplierId }))
    .then(asJson)
    .catch(asError);

// Exposed api methods
export default {
  fetchSuppliers,
  fetchSuppliersById,
};
