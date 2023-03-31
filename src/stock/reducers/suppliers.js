import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/suppliers/actionTypes";

const initialState = {
  all: [],
  fetching: false,
  fetched: false,
  view: "table", //dashboard
  offset: 0,
  selected: [],
};

function suppliers(state = initialState, { type, payload }) {
  switch (type) {
    case requestType(actionTypes.STOCK_SUPPLIERS_FETCH_SUPPLIERS):
      return {
        ...state,
        fetching: true,
        fetched: false
      };
    case successType(actionTypes.STOCK_SUPPLIERS_FETCH_SUPPLIERS):
      if (payload.response.hasError) {
        return {
          ...state,
          fetching: false
        };
      }

      return {
        ...state,
        all: payload.response.data,
        fetching: false,
        fetched: true
      };

    default:
      return state;
  }
}

export default suppliers;
