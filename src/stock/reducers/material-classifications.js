import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/classifications/actionTypes";

const initialState = {
  list: [],
  fetching: false,
};

function materialClassifications(state = initialState, { type, payload }) {
  switch (type) {
    case requestType(actionTypes.STOCK_MATERIALCLASSIFICATIONS_FETCH):
      return {
        ...state,
        fetching: true,
      };
    case successType(actionTypes.STOCK_MATERIALCLASSIFICATIONS_FETCH):
      if (payload.response.hasError) {
        return {
          ...state,
          fetching: false,
        };
      }

      return {
        list: payload.response,
        fetching: false,
      };

    default:
      return state;
  }
}

export default materialClassifications;
