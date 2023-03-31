import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/references/actionTypes";

const initialState = {
  forceUpdate: 0,
  all: [],
  materialFetching: false,
  materialRefresh: false,
  view: "table", //dashboard
  filters: {
    offset: 1,
    limit: 25,
  },
  itemsTotal: 0,
  selected: [],
  referenceDetailFetching: false,
  currentReference: {},
  editMode: false,
  materialManufacturers: [],
  materialClassifications: [],
  materialClassificationsFetching: false,
  lastMovements: {
    fetching: false,
    list: [],
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  materialElements: {
    fetching: false,
    list: [],
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  materialLocations: {
    fetching: false,
    materialStock: null,
    list: [],
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  materialUsages: {
    fetching: false,
    usedSince: null,
    list: [],
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  materialDates: {
    fetching: false,
    list: [],
  },
  availableLocations: {
    fetching: false,
    list: [],
    limit: 100,
    offset: 0,
  },
};

function references(state = initialState, { type, payload }) {
  switch (type) {
    case requestType(actionTypes.STOCK_REFERENCES_FETCH_REFERENCES):
      return {
        ...state,
        materialFetching: true,
        materialRefresh: true,
        editMode: false,
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_REFERENCES):
      if (payload.response.hasError) {
        return state;
      }
      const all = payload.append ? [...state.all, ...payload.response.data] : payload.response.data;

      return {
        ...state,
        all,
        materialFetching: false,
        materialRefresh: false,
        selected: [],
        itemsTotal: payload.response.metadata.itemsTotal,
        filters: payload.filters,
        currentReference: {},
        forceUpdate: state.forceUpdate + 1,
        lastMovements: initialState.lastMovements,
        materialElements: initialState.materialElements,
        materialLocations: initialState.materialLocations,
        materialUsages: initialState.materialUsages,
        materialDates: initialState.materialDates,
      };

    case successType(actionTypes.STOCK_REFERENCES_REMOVE): {
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        materialRefresh: true,
        selected: [],
        forceUpdate: state.forceUpdate + 1,
      };
    }

    case actionTypes.STOCK_REFERENCES_SETVIEW:
      return {
        ...state,
        view: payload,
      };

    case actionTypes.STOCK_REFERENCES_SETSELECTED:
      return {
        ...state,
        selected: payload,
      };

    case actionTypes.STOCK_REFERENCES_SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload,
      };

    case requestType(actionTypes.STOCK_REFERENCES_GET_REFERENCE_DETAIL):
      return {
        ...state,
        referenceDetailFetching: true,
      };

    case successType(actionTypes.STOCK_REFERENCES_GET_REFERENCE_DETAIL):
      if (payload.response.hasError) {
        return {
          ...state,
          referenceDetailFetching: false,
        };
      }

      return {
        ...state,
        currentReference: payload.response,
        referenceDetailFetching: false,
        selected: [],
      };

    case successType(actionTypes.STOCK_REFERENCES_SAVE_REFERENCE):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        currentReference: payload.response,
        materialRefresh: true,
        referenceDetailFetching: false,
        selected: [],
      };

    case successType(actionTypes.STOCK_REFERENCES_GET_REFERENCE_PURCHASE):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        currentReference: {
          ...state.currentReference,
          materialPurchase: payload.response,
        },
      };

    case successType(actionTypes.STOCK_REFERENCES_CREATE_REFERENCE):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        materialRefresh: true,
        currentReference: payload.response,
        editMode: true,
        selected: [],
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_MATERIALMANUFACTURERS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        materialManufacturers: payload.response,
      };

    case requestType(actionTypes.STOCK_REFERENCES_FETCH_CLASSIFICATIONS):
      return {
        ...state,
        materialClassificationsFetching: true,
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_CLASSIFICATIONS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        materialClassifications: payload.response,
        materialClassificationsFetching: false,
      };

    case requestType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_MOVEMENTS):
      return {
        ...state,
        lastMovements: {
          ...state.lastMovements,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_MOVEMENTS):
      if (payload.response.hasError) {
        return {
          ...state,
          lastMovements: {
            ...state.lastMovements,
            fetching: false,
            haveMore: false,
          },
        };
      }
      return {
        ...state,
        lastMovements: {
          ...state.lastMovements,
          list: [...state.lastMovements.list, ...payload.response.data],
          haveMore: payload.response.data.length === payload.limit,
          offset: state.lastMovements.offset + state.lastMovements.limit,
          fetching: false,
        },
      };

    case requestType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_ELEMENTS):
      return {
        ...state,
        materialElements: {
          ...state.materialElements,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_ELEMENTS):
      if (payload.response.hasError) {
        return {
          ...state,
          materialElements: {
            ...state.materialElements,
            fetching: false,
            haveMore: false,
          },
        };
      }
      return {
        ...state,
        materialElements: {
          ...state.materialElements,
          list: [...state.materialElements.list, ...payload.response.data],
          haveMore: payload.response.data.length === payload.limit,
          offset: state.materialElements.offset + state.materialElements.limit,
          fetching: false,
        },
      };

    case requestType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_LOCATIONS):
      return {
        ...state,
        materialLocations: {
          ...state.materialLocations,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_LOCATIONS):
      if (payload.response.hasError) {
        return {
          ...state,
          materialLocations: {
            ...state.materialLocations,
            fetching: false,
            haveMore: false,
          },
        };
      }
      return {
        ...state,
        materialLocations: {
          ...state.materialLocations,
          list: [...state.materialLocations.list, ...payload.response.data],
          haveMore: payload.response.data.length === payload.limit,
          offset: state.materialLocations.offset + state.materialElements.limit,
          materialStock: payload.response.materialStock,
          fetching: false,
        },
      };

    case requestType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_USAGES):
      return {
        ...state,
        materialUsages: {
          ...state.materialUsages,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_USAGES):
      if (payload.response.hasError) {
        return {
          ...state,
          materialUsages: {
            ...state.materialUsages,
            fetching: false,
            haveMore: false,
          },
        };
      }

      return {
        ...state,
        materialUsages: {
          ...state.materialUsages,
          list: [...state.materialUsages.list, ...payload.response.data],
          haveMore: payload.response.data.length === payload.limit,
          offset: state.materialUsages.offset + state.materialElements.limit,
          usedSince: payload.response.usedSince,
          fetching: false,
        },
      };

    case requestType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_DATES):
      return {
        ...state,
        materialDates: {
          ...state.materialDates,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_MATERIAL_DATES):
      if (payload.response.hasError) {
        return {
          ...state,
          materialDates: {
            ...state.materialDates,
            fetching: false,
            haveMore: false,
          },
        };
      }

      return {
        ...state,
        materialDates: {
          ...state.materialDates,
          list: [...state.materialDates.list, ...payload.response],
          fetching: false,
        },
      };

    case successType(actionTypes.STOCK_REFERENCES_INVENTORY):
      return {
        ...state,
        materialRefresh: true,
        selected: [],
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_LOCATIONS_AVAILABLE):
      if (payload.response.hasError) {
        return {
          ...state,
          availableLocations: {
            fetching: false,
            list: [],
            limit: 100,
            offset: 0,
          },
        };
      }

      const newList =
        payload.filters.offset === 0
          ? payload.response.data
          : [...state.availableLocations.list, ...payload.filters.offset];

      return {
        ...state,
        availableLocations: {
          fetching: false,
          list: newList,
          limit: payload.filters.limit,
          offset: payload.filters.offset + payload.filters.limit,
        },
      };

    default:
      return state;
  }
}

export default references;
