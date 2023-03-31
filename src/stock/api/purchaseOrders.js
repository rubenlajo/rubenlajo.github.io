import { get, post, put, del, getEndpoint, asJson, asError, applyPathParams } from "@/utils/";

const purchaseOrdersEndpoint = getEndpoint("purchaseOrders");
const purchaseOrderEndpoint = getEndpoint("purchaseOrder");
const purchaseOrderLaunchEndpoint = getEndpoint("purchaseOrderLaunch");
const purchaseOrderReferencesEndpoint = getEndpoint("purchaseOrderReferences");
const purchaseOrderSfiSyncro = getEndpoint("purchaseOrderSfiSyncro");
const materialPurchaseLineReceiveEndpoint = getEndpoint("materialPurchaseLineReceive");
const sfisyncroEndpoint = getEndpoint("sfisyncro");
const materialPurchasesEndpoint = getEndpoint("materialPurchases");
const purchaseLocationsEndpoint = getEndpoint("purchaseLocations");
const purchaseOrderStatusEndpoint = getEndpoint("purchaseOrdersStatus");
const userPhotoEndpoint = getEndpoint("userPhoto");

const fetchPurchaseOrders = (centerId, filters) =>
  get(applyPathParams(purchaseOrdersEndpoint, { centerId }), { params: filters })
    .then(asJson)
    .catch(asError);

const createPurchaseOrder = (centerId, purchaseOrderData) =>
  post(applyPathParams(purchaseOrdersEndpoint, { centerId }), { body: purchaseOrderData })
    .then(asJson)
    .catch(asError);

const updatePurchaseOrder = (centerId, purchaseOrderData) =>
  put(applyPathParams(purchaseOrderEndpoint, { centerId }), { body: purchaseOrderData })
    .then(asJson)
    .catch(asError);

const launchPurchaseOrder = (centerId, purchaseOrderId, data) =>
  post(applyPathParams(purchaseOrderLaunchEndpoint, { centerId, purchaseOrderId }), {
    body: data
      ? {
          notificationContact: data,
        }
      : {},
  })
    .then(() => fetchOrderById(centerId, purchaseOrderId))
    // .then(asJson)
    .catch(asError);

const launchPurchaseOrders = (centerId, purchaseOrderIds, data) => {
  const calls = [];
  purchaseOrderIds.forEach((purchaseOrderId) => {
    calls.push(launchPurchaseOrder(centerId, purchaseOrderId, data));
  });

  return Promise.all(calls).catch(asError);
};

const createAndLaunchPurchaseOrder = (centerId, purchaseOrderData, contactInfo) =>
  post(applyPathParams(purchaseOrdersEndpoint, { centerId }), { body: purchaseOrderData })
    .then(asJson)
    .then((data) =>
      launchPurchaseOrder(
        centerId,
        data.purchaseOrderId,
        contactInfo
          ? {
              name: contactInfo.contactName,
              email: contactInfo.contactEmail,
              save: !!contactInfo.save,
            }
          : null,
      ),
    )
    .catch(asError);

const fetchOrderById = (centerId, purchaseOrderId) =>
  get(applyPathParams(purchaseOrderEndpoint, { centerId, purchaseOrderId }))
    .then(asJson)
    .catch(asError);

const fetchOrderReferences = (centerId, purchaseOrderId, filters) =>
  get(applyPathParams(purchaseOrderReferencesEndpoint, { centerId, purchaseOrderId }), {
    params: filters,
  })
    .then(asJson)
    .catch(asError);

const deletePurchaseOrder = (centerId, purchaseOrderId) =>
  del(applyPathParams(purchaseOrderEndpoint, { centerId, purchaseOrderId })).catch(asError);

const fetchPurchaseOrderStatus = () =>
  get(purchaseOrderStatusEndpoint)
    .then(asJson)
    .catch(asError);

const syncSfiPurchaseOrder = (centerId, purchaseOrderId) => {
  if (centerId && purchaseOrderId) {
    return (
      post(applyPathParams(purchaseOrderSfiSyncro, { centerId, purchaseOrderId }))
        // .then(asJson)
        .then(() => fetchOrderById(centerId, purchaseOrderId))
        .catch(asError)
    );
  } else {
    return post(sfisyncroEndpoint)
      .then(asJson)
      .catch(asError);
  }
};

const syncSfiPurchaseOrders = (centerId, purchaseOrderIds) => {
  const calls = [];

  purchaseOrderIds.forEach((purchaseOrderId) => {
    calls.push(post(applyPathParams(purchaseOrderSfiSyncro, { centerId, purchaseOrderId })).catch(asError));
  });

  return Promise.all(calls).catch(asError);
};

const fetchPurchaseLocations = (centerId) =>
  get(applyPathParams(purchaseLocationsEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);

const fetchMaterialPurchase = (centerId, purchaseLocationCode, materialIds = []) =>
  get(applyPathParams(materialPurchasesEndpoint, { centerId }), {
    params: { purchaseLocationCode, materialIds: materialIds.map((m) => m.id).join(",") },
  })
    .then(asJson)
    .catch(asError);

const updateOrderLine = (centerId, purchaseOrderId, lineId, data) => {
  return put(applyPathParams(materialPurchaseLineReceiveEndpoint, { centerId, purchaseOrderId, lineId }), {
    body: data,
  })
    .then(asJson)
    .catch(asError);
};

const updateOrderLines = (centerId, purchaseOrderId, data, sfisync = false) => {
  const lineRequests = [];
  data.forEach((orderLineData) => {
    lineRequests.push(
      put(
        applyPathParams(materialPurchaseLineReceiveEndpoint, {
          centerId,
          purchaseOrderId,
          lineId: orderLineData.purchaseOrderLineId,
        }),
        {
          body: {
            receiveUnits: orderLineData.receiveUnits,
            returnUnits: orderLineData.returnUnits,
          },
        },
      ).then(asJson),
    );
  });

  return Promise.all(lineRequests)
    .then(() => (sfisync ? syncSfiPurchaseOrder(centerId, purchaseOrderId) : {}))
    .then(() => fetchOrderById(centerId, purchaseOrderId))
    .catch(asError);
};

const updateOrder = (centerId, purchaseOrderId, data, filters) => {
  return put(applyPathParams(purchaseOrderEndpoint, { centerId, purchaseOrderId }), {
    body: data,
  })
    .then(asJson)
    .then(() => fetchOrderReferences(centerId, purchaseOrderId, filters))
    .catch(asError);
};

const removeOrder = (centerId, purchaseOrderId) =>
 del(applyPathParams(purchaseOrderEndpoint, { centerId, purchaseOrderId }))
    // .then(asJson)
    .catch(asError);

const fetchUserPhoto = (userLogin) =>
  get(userPhotoEndpoint, { params: { userLogin } })
    .then(asJson)
    .catch(asError);

// Exposed api methods
export default {
  fetchPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  createAndLaunchPurchaseOrder,
  fetchOrderById,
  deletePurchaseOrder,
  fetchPurchaseOrderStatus,
  syncSfiPurchaseOrder,
  syncSfiPurchaseOrders,
  launchPurchaseOrder,
  launchPurchaseOrders,
  fetchOrderReferences,
  fetchPurchaseLocations,
  fetchMaterialPurchase,
  updateOrderLine,
  updateOrderLines,
  updateOrder,
  removeOrder,
  fetchUserPhoto,
};
