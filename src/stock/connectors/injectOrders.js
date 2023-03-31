import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/orders";
import * as getters from "stock/getters/orders";

/**
 * HOC que inyecta los getters y actions de ordenes de compra
 */
const injectOrders = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      orders: getters.getOrders(state),
      ordersFetching: getters.getOrdersFetching(state),
      ordersFetched: getters.getOrdersFetched(state),
      totalItems: getters.getOrdersTotal(state),
      refresh: getters.getRefresh(state),
      view: getters.getView(state),
      selected: getters.getSelected(state),
      orderReferences: getters.getAvailableRefs(state),
      orderReferencesFetching: getters.getAvailableRefsFetching(state),
      hasMoreRefs: getters.getHasMoreRefs(state),
      ordersSelectedRefs: getters.getSelectedReferences(state),
      ordersSelectedProvider: getters.getSelectedProvider(state),
      orderStatus: getters.getOrderStatus(state),
      orderStatusFetching: getters.getOrderStatusFetching(state),
      newOrder: getters.getNewOrder(state),
      purchaseLocations: getters.getPurchaseLocations(state),
      purchaseLocationSelected: getters.getPurchaseLocationSelected(state),
      purchaseLocationsFetching: getters.getPurchaseLocationsFetching(state),
      orderProvider: getters.getOrderProviderSelected(state),
      contactInfo: getters.getContactInfo(state),
      showContactModal: getters.getShowContactModal(state),
      orderDetail: getters.getCurrentOrder(state),
      redirectToNewOrder: getters.getRedirectToNewOrder(state),
      redirectToOrderList: getters.getRedirectToOrderList(state),
      orderEditMode: getters.getOrderEditMode(state),
      creationUsers: getters.getCreationUsers(state),
    }),
    (dispatch) => ({
      fetchPurchaseOrders: (centerId, filters) => dispatch(actions.fetchPurchaseOrders(centerId, filters)),
      createPurchaseOrder: (centerId, purchaseOrderData) =>
        dispatch(actions.createPurchaseOrder(centerId, purchaseOrderData)),
      createAndLaunchPurchaseOrder: (centerId, purchaseOrderData, contactInfo) =>
        dispatch(actions.createAndLaunchPurchaseOrder(centerId, purchaseOrderData, contactInfo)),
      fetchPurchaseOrderStatus: () => dispatch(actions.fetchPurchaseOrderStatus()),
      setView: (viewId) => dispatch(actions.setView(viewId)),
      setSelected: (refList) => dispatch(actions.setSelected(refList)),
      deletePurchaseOrder: (centerId, purchaseOrderId) =>
        dispatch(actions.deletePurchaseOrder(centerId, purchaseOrderId)),
      setOrderSelectedRefs: (centerId, purchaseLocationId, refs) =>
        dispatch(actions.setOrderSelectedRefs(centerId, purchaseLocationId, refs)),
      setOrderSelectedRefsEdit: (centerId, purchaseLocationId, refs) =>
        dispatch(actions.setOrderSelectedRefsEdit(centerId, purchaseLocationId, refs)),
      removeOrderRefs: (materialId) => dispatch(actions.removeOrderRefs(materialId)),
      setOrderSelectedProvider: (provider) => dispatch(actions.setOrderSelectedProvider(provider)),
      setOrderLineQty: (lineId, qty) => dispatch(actions.setOrderLineQty(lineId, qty)),
      setShowContactModal: (show) => dispatch(actions.setShowContactModal(show)),
      //detail
      fetchOrderById: (centerId, orderId) => dispatch(actions.fetchOrderById(centerId, orderId)),
      fetchOrderReferences: (centerId, purchaseOrderId, filters) =>
        dispatch(actions.fetchOrderReferences(centerId, purchaseOrderId, filters)),
      setOrderRequestUnits: (materialId, units) => dispatch(actions.setOrderRequestUnits(materialId, units)),
      setOrderReceiveUnits: (materialId, units) => dispatch(actions.setOrderReceiveUnits(materialId, units)),
      setOrderReturnUnits: (materialId, units) => dispatch(actions.setOrderReturnUnits(materialId, units)),
      updateOrderLine: (centerId, purchaseOrderId, orderLineId, data) =>
        dispatch(actions.updateOrderLine(centerId, purchaseOrderId, orderLineId, data)),
      updateOrderLines: (centerId, purchaseOrderId, data) =>
        dispatch(actions.updateOrderLines(centerId, purchaseOrderId, data)),
      updateOrder: (centerId, purchaseOrderId, data) => dispatch(actions.updateOrder(centerId, purchaseOrderId, data)),
      removeOrder: (centerId, purchaseOrderId) => dispatch(actions.removeOrder(centerId, purchaseOrderId)),
      //new purchase order
      fetchPurchaseLocations: (centerId) => dispatch(actions.fetchPurchaseLocations(centerId)),
      setPurchaseLocation: (location) => dispatch(actions.setPurchaseLocation(location)),
      setOrderContactInfo: (contactInfo) => dispatch(actions.setOrderContactInfo(contactInfo)),
      syncSfiPurchaseOrder: (centerId, purchaseOrderId) =>
        dispatch(actions.syncSfiPurchaseOrder(centerId, purchaseOrderId)),
      syncSfiPurchaseOrders: (centerId, purchaseOrderIds) =>
        dispatch(actions.syncSfiPurchaseOrders(centerId, purchaseOrderIds)),
      launchPurchaseOrder: (centerId, purchaseOrderId, contactData) =>
        dispatch(actions.launchPurchaseOrder(centerId, purchaseOrderId, contactData)),
      launchPurchaseOrders: (centerId, purchaseOrderIds, contactData) =>
        dispatch(actions.launchPurchaseOrders(centerId, purchaseOrderIds, contactData)),
      setRedirectToNewOrder: (redirect) => dispatch(actions.setRedirectToNewOrder(redirect)),
      setRedirectToOrderList: (redirect) => dispatch(actions.setRedirectToOrderList(redirect)),
      orderSetEditMode: (editMode) => dispatch(actions.orderSetEditMode(editMode)),
      fetchCreationUserPhoto: (userLogin) => dispatch(actions.fetchCreationUserPhoto(userLogin)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withOrders"))(Wrapper);
};

export default injectOrders;
