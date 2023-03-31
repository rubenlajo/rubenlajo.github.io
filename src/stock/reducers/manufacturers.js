import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/manufacturers/actionTypes";

const initialState = {
  all: [],
  current: null,
  haveMore: false,
  fetching: false,
};

function manufacturers(state = initialState, { type, payload }) {
  switch (type) {
    case requestType(actionTypes.STOCK_MANUFACTURER_FETCH_MANUFACTURERS):
      return {
        ...state,
        fetching: true,
      };
    case successType(actionTypes.STOCK_MANUFACTURER_FETCH_MANUFACTURERS):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        all: payload.append ? [...state.all, ...payload.response] : payload.response,
        haveMore: payload.response.length >= payload.filters.limit,
        fetching: false,
      };

    case successType(actionTypes.STOCK_MANUFACTURER_FETCH_MANUFACTURER_BYID):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        current: payload.response,
      };

    default:
      return state;
  }
}

export default manufacturers;
