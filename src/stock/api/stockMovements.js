import { get, put, del, getEndpoint, asJson, asError, applyPathParams } from "@/utils/";

const stockMovmentsEndpoint = getEndpoint("stockMovements");
const stockMovmentEndpoint = getEndpoint("stockMovement");

const fetchStockMovements = (centerId) =>
  get(applyPathParams(stockMovmentsEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);

const fetchStockMovement = (centerId, warehouseMovementId) =>
  get(applyPathParams(stockMovmentEndpoint, { centerId, warehouseMovementId }))
    .then(asJson)
    .catch(asError);

const fetchStockMovementsByIdList = (centerId, ordersId) =>
  get(applyPathParams(stockMovmentsEndpoint, { centerId }), {
    params: { id: ordersId },
  })
    .then(asJson)
    .catch(asError);

const removeStockMovements = (centerId, listId) =>
  del(applyPathParams(stockMovmentsEndpoint, { centerId }), {
    params: { id: listId },
  });

const assignOrderToOperator = (centerId, orderId, operatorId) =>
  put(`${applyPathParams(stockMovmentEndpoint, { centerId, warehouseMovementId })}/assign/${operatorId}`)
    .then(asJson)
    .catch(asError);

// Exposed api methods
export default {
  fetchStockMovements,
  fetchStockMovement,
  fetchStockMovementsByIdList,
  removeStockMovements,
  assignOrderToOperator,
};
