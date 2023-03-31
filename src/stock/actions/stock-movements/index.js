import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/stockMovements";
import * as actionTypes from "./actionTypes";

export const fetchStockMovements = logisticAreaId => ({
  type: actionTypes.STOCK_STOCKMOVEMENTS_FETCH_STOCKMOVEMENTS,
  payload: {
    logisticAreaId,
  },
  [PROMISE_CALL]: () => api.fetchStockMovements(logisticAreaId),
});

export const fetchStockMovementsByIdList = (logisticAreaId, orderIdList) => ({
  type: actionTypes.STOCK_STOCKMOVEMENTS_FETCH_STOCKMOVEMENTS_BYIDLIST,
  payload: { logisticAreaId, orderIdList },
  [PROMISE_CALL]: () => api.fetchStockMovementsByIdList(logisticAreaId, orderIdList),
});

export const setView = viewId => ({
  type: actionTypes.STOCK_STOCKMOVEMENTS_SETVIEW,
  payload: viewId,
});

export const setSelected = reflist => ({
  type: actionTypes.STOCK_STOCKMOVEMENTS_SETSELECTED,
  payload: reflist,
});

export const removeStockMovements = (logisticAreaId, listId) => ({
  type: actionTypes.STOCK_STOCKMOVEMENTS_REMOVE,
  payload: { logisticAreaId, listId },
  [PROMISE_CALL]: () => api.removeStockMovements(logisticAreaId, listId),
});

export const assignOrderToOperator = (logisticAreaId, orderId, operatorId) => ({
  type: actionTypes.STOCK_STOCKMOVEMENTS_ASSIGN_ORDER_OPERATOR,
  payload: {
    logisticAreaId,
    orderId,
    operatorId,
  },
  [PROMISE_CALL]: () => api.assignOrderToOperator(logisticAreaId, orderId, operatorId),
});

export const fetchStockMovement = (logisticAreaId, stockMovementId) => ({
  type: actionTypes.STOCK_STOCKMOVEMENTS_FETCH_STOCKMOVEMENT,
  payload: {
    logisticAreaId,
    stockMovementId,
  },
  [PROMISE_CALL]: () => api.fetchStockMovement(logisticAreaId, stockMovementId),
});
