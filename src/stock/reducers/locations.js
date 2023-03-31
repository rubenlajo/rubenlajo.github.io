import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/locations/actionTypes";

const initialState = {
  all: [],
  view: "table", //dashboard
  locationsRefresh: false,
  locationsFetching: false,
  offset: 0,
  limit: 100,
  itemsTotal: 0,
  selected: [],
  currentLocation: null,
  locationPattern: "",
  editMode: false,
  behaviourTypes: [],
  locationMaterials: {
    list: [],
    offset: 0,
    limit: 100,
    haveMore: true,
    fetching: false,
  },
  sparePartsWarehouses: [],
  created: false,
  locationLastInventoryStatus: [],
  locationLastMovements: {
    list: [],
    offset: 0,
    limit: 25,
    haveMore: true,
    fetching: false,
  },
};

function locations(state = initialState, { type, payload }) {
  switch (type) {
    case requestType(actionTypes.STOCK_LOCATIONS_FETCH_LOCATIONS):
      return {
        ...state,
        locationsFetching: true,
      };
    case successType(actionTypes.STOCK_LOCATIONS_FETCH_LOCATIONS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        all: payload.response.data,
        offset: payload.response.offset,
        itemsTotal: payload.response.metadata.itemsTotal,
        locationsFetching: false,
        locationsRefresh: false,
        selected: [],
        locationMaterials: initialState.locationMaterials,
        currentLocation: {},
        created: false,
      };

    case successType(actionTypes.STOCK_LOCATIONS_REMOVE):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        locationsRefresh: true,
        selected: [],
      };

    case actionTypes.STOCK_LOCATIONS_SETVIEW:
      return {
        ...state,
        view: payload,
      };

    case actionTypes.STOCK_LOCATIONS_SETSELECTED:
      return {
        ...state,
        selected: payload,
      };

    case actionTypes.STOCK_LOCATIONS_SET_EDIT_MODE:
      return {
        ...state,
        editMode: payload,
      };

    case successType(actionTypes.STOCK_LOCATIONS_GET_LOCATION_DETAIL):
      if (payload.response.hasError) {
        return {
          ...state,
          created: false,
        };
      }
      return {
        ...state,
        currentLocation: { ...payload.response },
        created: false,
      };

    case successType(actionTypes.STOCK_LOCATIONS_SAVE_LOCATION):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        // currentLocation: { ...payload.response.data },
        editMode: false,
      };

    case successType(actionTypes.STOCK_LOCATIONS_CREATE_LOCATION):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        currentLocation: payload.response,
        editMode: false,
        created: true,
      };

    case successType(actionTypes.STOCK_LOCATIONS_FETCH_LOCATION_BEHAVIOUR_TYPES):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        behaviourTypes: payload.response,
      };

    case successType(actionTypes.STOCK_LOCATIONS_FETCH_LOCATION_PATTERNS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        locationPattern: payload.response.locationPattern,
      };

    case requestType(actionTypes.STOCK_LOCATIONS_FETCH_LOCATION_MATERIALS):
      return {
        ...state,
        locationMaterials: {
          ...state.locationMaterials,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_LOCATIONS_FETCH_LOCATION_MATERIALS): {
      if (payload.response.hasError) {
        return {
          ...state,
          locationMaterials: {
            ...state.locationMaterials,
            fetching: false,
            hasMore: false,
          },
        };
      }

      const newList =
        payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.locationMaterials.list, ...payload.response.data];

      const haveMore =
        payload.response.data.length > 0 && payload.response.metadata.itemsTotal > payload.response.metadata.itemsTo;

      return {
        ...state,
        locationMaterials: {
          ...state.locationMaterials,
          list: newList,
          offset: state.locationMaterials.offset + state.locationMaterials.limit,
          haveMore,
          fetching: false,
        },
      };
    }

    case successType(actionTypes.STOCK_LOCATIONS_FETCH_SPARE_PARTS_WAREHOUSES):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        sparePartsWarehouses: payload.response,
      };

    case successType(actionTypes.STOCK_LCOATIONS_FETCH_LASTINVENTORYSTATUS):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        locationLastInventoryStatus: payload.response,
      };

    case successType(actionTypes.STOCK_LOCATIONS_POST_INVENTORIES):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        locationsRefresh: true,
        selected: [],
      };

    case requestType(actionTypes.STOCK_LOCATIONS_FETCH_LAST_MOVEMENTS):
      return {
        ...state,
        locationLastMovements: {
          ...state.locationLastMovements,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_LOCATIONS_FETCH_LAST_MOVEMENTS): {
      if (payload.response.hasError) {
        return {
          ...state,
          locationLastMovements: {
            ...state.locationLastMovements,
            fetching: false,
            haveMore: false,
          },
        };
      }

      const newList =
        payload.filters.offset === 0
          ? payload.response.data
          : [...state.locationLastMovements.list, ...payload.response.data];

      const haveMore = newList.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;

      return {
        ...state,
        locationLastMovements: {
          ...state.locationLastMovements,
          offset: payload.filters.offset,
          list: newList,
          haveMore,
          fetching: false,
        },
      };
    }
    default:
      return state;
  }
}

export default locations;
