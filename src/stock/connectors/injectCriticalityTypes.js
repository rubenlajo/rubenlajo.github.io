import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/criticalityTypes/";
import * as getters from "stock/getters/criticalityTypes";

const injectCriticalityTypes = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      criticalityTypes: getters.getCriticalityTypes(state),
      criticalityTypesMap: getters.getCriticalityTypesMap(state),
      criticalityTypesFetching: getters.getCriticalityTypesFetching(state),
    }),
    (dispatch) => ({
      fetchMaterialCriticalityTypes: () => dispatch(actions.fetchMaterialCriticalityTypes()),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withClassifications"))(Wrapper);
};

export default injectCriticalityTypes;
