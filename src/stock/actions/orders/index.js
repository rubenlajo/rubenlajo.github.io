import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../../api/purchaseOrders";
import * as actionTypes from "./actionTypes";

export const fetchPurchaseOrders = (centerId, filters) => ({
  type: actionTypes.STOCK_ORDERS_FETCH_ORDERS,
  payload: {
    centerId,
    filters,
  },
  [PROMISE_CALL]: () => api.fetchPurchaseOrders(centerId, filters),
});

export const setView = (viewId) => ({
  type: actionTypes.STOCK_ORDERS_SETVIEW,
  payload: viewId,
});

export const setSelected = (orderList) => ({
  type: actionTypes.STOCK_ORDERS_SETSELECTED,
  payload: orderList,
});

export const removeOrders = (centerId, orderList) => ({
  type: actionTypes.STOCK_ORDERS_REMOVE,
  payload: {
    centerId,
    orderList,
  },
  [PROMISE_CALL]: () => api.removeOrders(centerId, orderList),
});

export const fetchOrderById = (centerId, orderId) => ({
  type: actionTypes.STOCK_ORDERS_FETCH_BYID,
  payload: {
    centerId,
    orderId,
  },
  [PROMISE_CALL]: () => api.fetchOrderById(centerId, orderId),
});

export const setOrderSelectedRefs = (centerId, purchaseLocationId, references) => ({
  type: actionTypes.STOCK_ORDERS_NEW_SET_REFERENCES,
  payload: { centerId, purchaseLocationId, references },
  [PROMISE_CALL]: () => api.fetchMaterialPurchase(centerId, purchaseLocationId, references),
});

export const setOrderSelectedRefsEdit = (centerId, purchaseLocationId, references) => ({
  type: actionTypes.STOCK_ORDERS_EDIT_SET_REFERENCES,
  payload: { centerId, purchaseLocationId, references },
  [PROMISE_CALL]: () => api.fetchMaterialPurchase(centerId, purchaseLocationId, references),
});

export const removeOrderRefs = (materialId) => ({
  type: actionTypes.STOCK_ORDERS_NEW_REMOVE_REFERENCES,
  payload: { materialId },
});

export const setOrderSelectedProvider = (provider) => ({
  type: actionTypes.STOCK_ORDERS_NEW_SET_PROVIDER,
  payload: provider,
});

export const setOrderLineQty = (lineId, qty) => ({
  type: actionTypes.STOCK_ORDERS_SET_ORDER_LINE_QTY,
  payload: {
    lineId,
    qty,
  },
});

export const fetchPurchaseOrderStatus = () => ({
  type: actionTypes.STOCK_ORDERS_FETCH_ORDER_STATUS,
  [PROMISE_CALL]: () => api.fetchPurchaseOrderStatus(),
});

export const deletePurchaseOrder = (centerId, purchaseOrderId) => ({
  type: actionTypes.STOCK_ORDERS_DELETE_PURCHASE_ORDER,
  payload: {
    centerId,
    purchaseOrderId,
  },
  [PROMISE_CALL]: () => api.deletePurchaseOrder(centerId, purchaseOrderId),
});

export const syncSfiPurchaseOrder = (centerId, purchaseOrderId) => ({
  type: actionTypes.STOCK_ORDERS_SYNCSFI_PURCHASE_ORDER,
  payload: {
    centerId,
    purchaseOrderId,
  },
  [PROMISE_CALL]: () => api.syncSfiPurchaseOrder(centerId, purchaseOrderId),
});

export const syncSfiPurchaseOrders = (centerId, purchaseOrderIds) => ({
  type: actionTypes.STOCK_ORDERS_SYNCSFI_PURCHASE_ORDERS,
  payload: {
    centerId,
    purchaseOrderIds,
  },
  [PROMISE_CALL]: () => api.syncSfiPurchaseOrders(centerId, purchaseOrderIds),
});

export const launchPurchaseOrder = (centerId, purchaseOrderId, contactData) => ({
  type: actionTypes.STOCK_ORDERS_LAUNCH_PURCHASE_ORDER,
  payload: {
    centerId,
    purchaseOrderId,
    contactData,
  },
  [PROMISE_CALL]: () => api.launchPurchaseOrder(centerId, purchaseOrderId, contactData),
});

export const launchPurchaseOrders = (centerId, purchaseOrderIds, contactData) => ({
  type: actionTypes.STOCK_ORDERS_LAUNCH_PURCHASE_ORDERS,
  payload: {
    centerId,
    purchaseOrderIds,
    contactData,
  },
  [PROMISE_CALL]: () => api.launchPurchaseOrders(centerId, purchaseOrderIds, contactData),
});

export const createPurchaseOrder = (centerId, purchaseOrderData) => ({
  type: actionTypes.STOCK_ORDERS_CREATE_PURCHASE_ORDER,
  payload: {
    centerId,
    purchaseOrderData,
  },
  [PROMISE_CALL]: () => api.createPurchaseOrder(centerId, purchaseOrderData),
});

export const updatePurchaseOrder = (centerId, purchaseOrderData) => ({
  type: actionTypes.STOCK_ORDERS_LAUNCH_PURCHASE_ORDER,
  payload: {
    centerId,
    purchaseOrderData,
  },
  [PROMISE_CALL]: () => api.updatePurchaseOrder(centerId, purchaseOrderData),
});

export const createAndLaunchPurchaseOrder = (centerId, purchaseOrderData, contactInfo) => ({
  type: actionTypes.STOCK_ORDERS_CREATE_AND_LAUNCH_PURCHASE_ORDER,
  payload: {
    centerId,
    purchaseOrderData,
    contactInfo,
  },
  [PROMISE_CALL]: () => api.createAndLaunchPurchaseOrder(centerId, purchaseOrderData, contactInfo),
});

export const fetchOrderReferences = (centerId, orderId, filters) => ({
  type: actionTypes.STOCK_ORDERS_FETCH_ORDER_MATERIAL,
  payload: {
    centerId,
    orderId,
    filters,
  },
  [PROMISE_CALL]: () => api.fetchOrderReferences(centerId, orderId, filters),
});

export const fetchOrderPurchaseLocations = (centerId) => ({
  type: actionTypes.STOCK_ORDERS_FETCH_LOCATIONS,
  payload: {
    centerId,
  },
  [PROMISE_CALL]: () => api.fetchOrderPurchaseLocations(centerId),
});

export const fetchPurchaseLocations = (centerId) => ({
  type: actionTypes.STOCK_ORDERS_FETCH_PURCHASE_LOCATIONS,
  payload: {
    centerId,
  },
  [PROMISE_CALL]: () => api.fetchPurchaseLocations(centerId),
});

export const setPurchaseLocation = (location) => ({
  type: actionTypes.STOCK_ORDERS_SET_LOCATION,
  payload: location,
});

export const setShowContactModal = (show) => ({
  type: actionTypes.STOCK_ORDERS_SET_SHOW_CONTACT_INFO,
  payload: show,
});

export const setOrderContactInfo = (contactInfo) => ({
  type: actionTypes.STOCK_ORDERS_SET_CONTACT_INFO,
  payload: contactInfo,
});

export const setOrderRequestUnits = (purchaseOrderLineId, requestUnits) => ({
  type: actionTypes.STOCK_ORDERS_SET_REFERENCE_REQUEST_UNITS,
  payload: {
    purchaseOrderLineId,
    requestUnits,
  },
});

export const setOrderReceiveUnits = (purchaseOrderLineId, receiveUnits) => ({
  type: actionTypes.STOCK_ORDERS_SET_REFERENCE_RECEIVE_UNITS,
  payload: {
    purchaseOrderLineId,
    receiveUnits,
  },
});

export const setOrderReturnUnits = (purchaseOrderLineId, returnUnits) => ({
  type: actionTypes.STOCK_ORDERS_SET_REFERENCE_RETURN_UNITS,
  payload: {
    purchaseOrderLineId,
    returnUnits,
  },
});

export const updateOrderLine = (centerId, purchaseOrderId, orderLineId, data) => ({
  type: actionTypes.STOCK_ORDERS_UPDATE_ORDER_LINE,
  payload: {
    centerId,
    purchaseOrderId,
    orderLineId,
    data,
  },
  [PROMISE_CALL]: () => api.updateOrderLine(centerId, purchaseOrderId, orderLineId, data),
});

export const updateOrderLines = (centerId, purchaseOrderId, data) => ({
  type: actionTypes.STOCK_ORDERS_UPDATE_ORDER_LINES,
  payload: {
    centerId,
    purchaseOrderId,
    data,
  },
  [PROMISE_CALL]: () => api.updateOrderLines(centerId, purchaseOrderId, data),
});

export const updateOrder = (centerId, purchaseOrderId, data, filters = { limit: 50, offset: 0 }) => ({
  type: actionTypes.STOCK_ORDERS_UPDATE_ORDER,
  payload: {
    centerId,
    purchaseOrderId,
    data,
    filters,
  },
  [PROMISE_CALL]: () => api.updateOrder(centerId, purchaseOrderId, data, filters),
});

export const removeOrder = (centerId, purchaseOrderId) => ({
  type: actionTypes.STOCK_ORDERS_REMOVE_ORDER,
  payload: {
    centerId,
    purchaseOrderId,
  },
  [PROMISE_CALL]: () => api.removeOrder(centerId, purchaseOrderId),
});

export const setRedirectToNewOrder = (redirect) => ({
  type: actionTypes.STOCK_ORDERS_SET_REDIRECT_TO_NEWORDER,
  payload: redirect,
});

export const setRedirectToOrderList = (redirect) => ({
  type: actionTypes.STOCK_ORDERS_SET_REDIRECT_TO_LIST,
  payload: redirect,
});

export const orderSetEditMode = (editMode) => ({
  type: actionTypes.STOCK_ORDERS_SET_EDIT_MODE,
  payload: editMode,
});

export const fetchCreationUserPhoto = (userLogin) => ({
  type: actionTypes.STOCK_ORDERS_FETCH_CREATION_USER_PHOTO,
  payload: {
    userLogin,
  },
  [PROMISE_CALL]: () => api.fetchUserPhoto(userLogin),
});
