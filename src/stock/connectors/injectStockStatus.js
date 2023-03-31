import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/stock-status";
import * as getters from "stock/getters/stock-status";

const injectStockStatus = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      stockStatus: getters.getStockStatus(state),
      stockStatusFetching: getters.getStockStatusFetching(state),
    }),
    (dispatch) => ({
      fetchStockStatus: () => dispatch(actions.fetchStockStatus()),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withStockStatus"))(Wrapper);
};

export default injectStockStatus;
