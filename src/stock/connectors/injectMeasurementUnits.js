import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/measurementUnits/";
import * as getters from "stock/getters/measurementUnits";

const injectMeasurementUnits = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      measurementUnits: getters.getMeasurmentUnits(state),
      measurementUnitsFetching: getters.getMeasurmentUnitsFetching(state),
    }),
    (dispatch) => ({
      fetchMeasurementsUnit: () => dispatch(actions.fetchMeasurementsUnit()),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "witchMeasurementUnits"))(Wrapper);
};

export default injectMeasurementUnits;
