import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/classifications";
import * as getters from "stock/getters/classifications";

const injectClassifications = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      classifications: getters.getMaterialClassifications(state),
      classificationsFetching: getters.getMaterialClassificationsFetching(state),
    }),
    (dispatch) => ({
      fetchMaterialClassifications: () => dispatch(actions.fetchMaterialClassifications()),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withClassifications"))(Wrapper);
};

export default injectClassifications;
