import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/orders/actionTypes";
import * as applicationActionTypes from "application/actions/actionTypes";

const initialState = {
  all: [],
  ordersFetching: false,
  ordersFetched: false,
  view: "table", //dashboard
  offset: 0,
  itemsTotal: 0,
  refresh: false,
  selected: [],
  currentOrder: null,
  editMode: false,
  referencesFetching: false,
  references: [],
  redirectToNewOrder: false,
  redirectToOrderList: false,
  hasMoreRefs: false,
  purchaseLocations: [],
  purchaseLocationSelected: null,
  showContactModal: false,
  contactInfo: null,
  newOrder: {
    references: [],
    location: null,
    provider: null,
  },
  status: [],
  statusFetching: false,
  orderEditMode: false,
  creationUsers: {},
};

const decode = (str) => {
  const el = document.createElement("div");
  el.innerHTML = decodeURIComponent(str);
  return el.innerText;
};

function orders(state = initialState, { type, payload }) {
  switch (type) {
    case applicationActionTypes.APPLICATION_SET_CENTER:
      return {
        ...state,
        refresh: true,
      };

    case requestType(actionTypes.STOCK_ORDERS_FETCH_ORDERS):
      return {
        ...state,
        ordersFetching: true,
      };

    case successType(actionTypes.STOCK_ORDERS_FETCH_ORDERS):
      if (payload.response.hasError) {
        return { ...state, ordersFetching: false, ordersFetched: false };
      }
      return {
        ...state,
        all: payload.response.data,
        ordersFetching: false,
        ordersFetched: true,
        itemsTotal: payload.response.metadata.itemsTotal,
        refresh: false,
        newOrder: {
          references: [],
          location: null,
          provider: null,
        },
        references: [],
        selected: [],
        currentOrder: null,
      };
    case actionTypes.STOCK_ORDERS_SET_REDIRECT_TO_NEWORDER:
      return {
        ...state,
        redirectToNewOrder: payload,
      };

    case actionTypes.STOCK_ORDERS_SETVIEW:
      return {
        ...state,
        view: payload,
      };

    case actionTypes.STOCK_ORDERS_SETSELECTED:
      return {
        ...state,
        selected: payload,
      };

    case successType(actionTypes.STOCK_ORDERS_CREATE_PURCHASE_ORDER):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        newOrder: initialState.newOrder,
        references: [],
        refresh: true,
        redirectToOrderList: true,
      };

    case successType(actionTypes.STOCK_ORDERS_FETCH_BYID):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        currentOrder: payload.response,
        selected: [],
        newOrder: {
          references: [],
          location: null,
          provider: null,
        },
      };

    case successType(actionTypes.STOCK_ORDERS_NEW_SET_REFERENCES): {
      if (payload.response.hasError) {
        return state;
      }

      const suppliers = [];
      const references = payload.references.map((reference) => {
        const mp = payload.response.find((m) => m.materialId === parseInt(reference.id));
        if (mp && mp.estimate && mp.estimate.length > 0) {
          mp.estimate.forEach((estimate) => {
            if (!suppliers.some((s) => s.supplierId !== estimate.supplierId)) {
              suppliers.push({
                supplierId: estimate.supplierId,
                supplierName: estimate.supplierName,
              });
            }
          });
        }
        const alreadyInOrder = state.newOrder.references.find((r) => r.id === parseInt(reference.id));
        const qty = alreadyInOrder ? alreadyInOrder.qty : mp ? mp.orderLevel : 1;

        return {
          ...reference,
          materialPurchase: mp ? { ...mp } : null,
          manufacturerRef: mp ? mp.materialRefFabricante : null,
          qty,
        };
      });

      return {
        ...state,
        provider: suppliers.length === 1 ? suppliers[0] : state.provider,
        redirectToNewOrder: true,
        newOrder: {
          ...state.newOrder,
          references: [...references],
        },
      };
    }

    case successType(actionTypes.STOCK_ORDERS_EDIT_SET_REFERENCES): {
      if (payload.response.hasError) {
        return state;
      }

      const references = payload.references.map((reference) => {
        const mp = payload.response.find((m) => m.materialId === reference.id);
        const alreadyInOrder = state.references.find((r) => r.material.materialId === reference.id);
        const qty = alreadyInOrder ? alreadyInOrder.requestUnits : mp ? mp.orderLevel : 1;
        const price = mp && mp.estimate && mp.estimate.length > 0 ? mp.estimate[0].prices.find((p) => !p.until) : null;
        const unitsLimit = mp && mp.estimate && mp.estimate.length > 0 ? mp.estimate[0].unitsLimit : { minimum: 0, maximum: 0 };

        return {
          ...reference,
          materialPurchase: mp ? { ...mp } : null,
          minimumLevel: mp.minimumLevel,
          orderLevel: mp.orderLevel,
          maximumLevel: mp.maximumLevel,
          requestUnits: qty,
          unitPrice: price ? price.price : 0,
          measurementUnit: mp.measurementUnit,
          unitsLimit,
        };
      });

      return {
        ...state,
        references: [...references],
      };
    }

    case actionTypes.STOCK_ORDERS_NEW_REMOVE_REFERENCES:
      return {
        ...state,
        newOrder: {
          ...state.newOrder,
          references: state.newOrder.references.filter((r) => r.id !== payload.materialId),
        },
      };

    case actionTypes.STOCK_ORDERS_NEW_SET_PROVIDER:
      return {
        ...state,
        newOrder: {
          ...state.newOrder,
          provider: payload,
        },
      };
    case actionTypes.STOCK_ORDERS_SET_ORDER_LINE_QTY:
      return {
        ...state,
        newOrder: {
          ...state.newOrder,
          references: state.newOrder.references.map((orderLine) => {
            if (orderLine.id === payload.lineId) {
              return {
                ...orderLine,
                qty: payload.qty > 0 ? payload.qty : 0,
              };
            } else {
              return orderLine;
            }
          }),
        },
      };

    case requestType(actionTypes.STOCK_ORDERS_FETCH_ORDER_STATUS):
      return {
        ...state,
        statusFetching: true,
      };

    case successType(actionTypes.STOCK_ORDERS_FETCH_ORDER_STATUS):
      if (payload.response.hasError) {
        return { ...state, statusFetching: false };
      }
      return {
        ...state,
        statusFetching: false,
        status: payload.response,
      };

    case successType(actionTypes.STOCK_ORDERS_SYNCSFI_PURCHASE_ORDER):
    case successType(actionTypes.STOCK_ORDERS_UPDATE_ORDER_LINES):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        currentOrder: payload.response,
        selected: [],
        refresh: true,
      };

    case successType(actionTypes.STOCK_ORDERS_SYNCSFI_PURCHASE_ORDERS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        selected: [],
        refresh: true,
      };

    case requestType(actionTypes.STOCK_ORDERS_FETCH_ORDER_MATERIAL):
      return {
        ...state,
        referencesFetching: true,
      };

    case successType(actionTypes.STOCK_ORDERS_FETCH_ORDER_MATERIAL):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        references: [
          ...state.references,
          ...payload.response.data.filter(
            (newref) => !state.references.some((oldref) => oldref.purchaseOrderLineId === newref.purchaseOrderLineId),
          ),
        ],
        hasMoreRefs: payload.filters.limit === payload.response.data.length,
        referencesFetching: false,
      };

    case successType(actionTypes.STOCK_ORDERS_UPDATE_ORDER):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        references: payload.response.data,
      };
    case requestType(actionTypes.STOCK_ORDERS_FETCH_PURCHASE_LOCATIONS):
      return {
        ...state,
        purchaseLocationsFetching: true,
      };

    case successType(actionTypes.STOCK_ORDERS_FETCH_PURCHASE_LOCATIONS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        purchaseLocations: payload.response,
        purchaseLocationSelected: payload.response[0],
        purchaseLocationsFetching: false,
      };

    case actionTypes.STOCK_ORDERS_SET_LOCATION:
      return {
        ...state,
        purchaseLocationSelected: payload,
      };

    case actionTypes.STOCK_ORDERS_SET_CONTACT_INFO:
      return {
        ...state,
        contactInfo: payload,
      };

    case actionTypes.STOCK_ORDERS_SET_REFERENCE_REQUEST_UNITS:
      return {
        ...state,
        references: state.references.map((reference) => {
          if (reference.purchaseOrderLineId === payload.purchaseOrderLineId) {
            return {
              ...reference,
              requestUnits: payload.requestUnits,
            };
          } else {
            return reference;
          }
        }),
      };

    case actionTypes.STOCK_ORDERS_SET_REFERENCE_RECEIVE_UNITS:
      return {
        ...state,
        references: state.references.map((reference) => {
          if (reference.purchaseOrderLineId === payload.purchaseOrderLineId) {
            return {
              ...reference,
              receiveUnits: payload.receiveUnits,
            };
          } else {
            return reference;
          }
        }),
      };

    case actionTypes.STOCK_ORDERS_SET_REFERENCE_RETURN_UNITS:
      return {
        ...state,
        references: state.references.map((reference) => {
          if (reference.purchaseOrderLineId === payload.purchaseOrderLineId) {
            return {
              ...reference,
              returnUnits: payload.returnUnits,
            };
          } else {
            return reference;
          }
        }),
      };

    case actionTypes.STOCK_ORDERS_SET_SHOW_CONTACT_INFO:
      return {
        ...state,
        showContactModal: payload,
      };

    case successType(actionTypes.STOCK_ORDERS_CREATE_AND_LAUNCH_PURCHASE_ORDER):
      if (payload.response.hasError) {
        return {
          ...state,
          showContactModal: true,
        };
      }
      return {
        ...state,
        refresh: true,
        redirectToOrderList: true,
      };

    case successType(actionTypes.STOCK_ORDERS_LAUNCH_PURCHASE_ORDER):
      if (payload.response.hasError) {
        return {
          ...state,
          showContactModal: true,
        };
      }

      return {
        ...state,
        currentOrder: payload.response,
        selected: [],
        redirectToOrderList: true,
        refresh: true,
      };

    case successType(actionTypes.STOCK_ORDERS_LAUNCH_PURCHASE_ORDERS):
      return {
        ...state,
        selected: [],
        refresh: true,
      };

    case actionTypes.STOCK_ORDERS_SET_REDIRECT_TO_LIST:
      return {
        ...state,
        redirectToOrderList: payload,
      };

    case actionTypes.STOCK_ORDERS_SET_EDIT_MODE:
      return {
        ...state,
        orderEditMode: payload,
      };

    case successType(actionTypes.STOCK_ORDERS_DELETE_PURCHASE_ORDER):
      if (payload.response.hasError) {
        return {
          ...state,
          showContactModal: true,
        };
      }
      return {
        ...state,
        all: state.all.filter((order) => order.purchaseOrderId !== payload.purchaseOrderId),
        ordersFetching: false,
        itemsTotal: state.itemsTotal - 1,
        selected: [],
        refresh: true,
      };

    case successType(actionTypes.STOCK_ORDERS_FETCH_CREATION_USER_PHOTO): {
      if (payload.response.hasError) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        creationUsers: {
          ...state.creationUsers,
          [payload.userLogin]: payload.response.userPhoto ? decode(payload.response.userPhoto) : null,
        },
      };
    }

    case successType(actionTypes.STOCK_ORDERS_REMOVE_ORDER):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        refresh: true,
      };

    default:
      return state;
  }
}

export default orders;
