import { successType } from "amiga-core/application/actions";
import * as stkMovementsActiontypes from "../actions/stock-movements/actionTypes";

const initialState = {
  all: [],
  view: "table", //dashboard
  offset: 0,
  selected: [],
  current: null,
};

function stockMovements(state = initialState, { type, payload }) {
  switch (type) {
    case successType(stkMovementsActiontypes.STOCK_STOCKMOVEMENTS_FETCH_STOCKMOVEMENTS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        all: payload.response.data,
        offset: payload.response.metadata,
      };

    case stkMovementsActiontypes.STOCK_STOCKMOVEMENTS_SETVIEW:
      return {
        ...state,
        view: payload,
      };

    case stkMovementsActiontypes.STOCK_STOCKMOVEMENTS_SETSELECTED:
      return {
        ...state,
        selected: [...payload],
      };

    case successType(stkMovementsActiontypes.STOCK_STOCKMOVEMENTS_FETCH_STOCKMOVEMENTS_BYIDLIST):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        selected: [...payload.response],
      };

    case successType(stkMovementsActiontypes.STOCK_STOCKMOVEMENTS_ASSIGN_ORDER_OPERATOR):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        selected: [
          ...state.selected.map(order => {
            if (order.id === payload.orderId) {
              return {
                ...order,
                asignedUser: { id: payload.operatorId },
              };
            } else {
              return order;
            }
          }),
        ],
      };
    case successType(stkMovementsActiontypes.STOCK_STOCKMOVEMENTS_FETCH_STOCKMOVEMENT):
      return {
        ...state,
        current: payload.response,
      };

    default:
      return state;
  }
}

export default stockMovements;
