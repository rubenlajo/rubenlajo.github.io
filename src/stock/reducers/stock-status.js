import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/stock-status/actionTypes";

const initialState = {
  list: [],
  stockStatusFetching: false,
};

function stockStatus(state = initialState, { type, payload }) {
  switch (type) {
    case requestType(actionTypes.STOCK_REFERENCES_FETCH_STOCK_STATUS):
      return {
        ...state,
        stockStatusFetching: true,
      };

    case successType(actionTypes.STOCK_REFERENCES_FETCH_STOCK_STATUS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        list: payload.response,
        stockStatusFetching: false,
      };

    default:
      return state;
  }
}

export default stockStatus;
