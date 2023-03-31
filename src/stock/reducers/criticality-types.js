import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/criticalityTypes/actionTypes";

const initialState = {
  list: [],
  map: null,
  fetching: false,
};

function materialCriticalityTypes(state = initialState, { type, payload }) {
  switch (type) {
    case requestType(actionTypes.STOCK_MATERIAL_CRITICALITY_TYPES_FETCH):
      return {
        ...state,
        fetching: true,
      };

    case successType(actionTypes.STOCK_MATERIAL_CRITICALITY_TYPES_FETCH):
      if (payload.response.hasError) {
        return {
          ...state,
          fetching: false,
        };
      }

      const newMap = {};

      payload.response.forEach((criticality) => {
        newMap[criticality.criticalityTypeId] = criticality;
      });

      return {
        list: payload.response,
        map: newMap,
        fetching: false,
      };

    default:
      return state;
  }
}

export default materialCriticalityTypes;
