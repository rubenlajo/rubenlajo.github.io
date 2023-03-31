import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as appGetters from "application/getters";
import * as appActions from "application/actions";

/**
 * HOC que inyecta las credenciales del usuario autenticado en la _prop_
 * `user` del componente al que rodea
 *
 * @param {Component} WrappedComponent el componente en el que se inyectan las
 * credenciales del usuario.
 */
const injectWarehouse = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      centers: appGetters.getCenters(state),
      centerSelected: appGetters.getCenterSelected(state),
      sfiStatusList: appGetters.getSfiStatusList(state),
      sfiStatusListFetching: appGetters.getSfiStatusListFetching(state),
      appMetadata: appGetters.getAppMetadata(state),
      centersFetching: appGetters.getCentersFetching(state),
      centerFetching: appGetters.getCenterFetching(state),
    }),
    (dispatch) => ({
      setCenterSelected: (logisticArea) => dispatch(appActions.setCenterSelected(logisticArea)),
      fetchCenters: () => dispatch(appActions.fetchCenters()),
      fetchStatusSFI: () => dispatch(appActions.fetchStatusSFI()),
      addNotification: (notification) => dispatch(appActions.addNotification(notification)),
      fetchAppMetadata: () => dispatch(appActions.fetchAppMetadata()),
      fetchCenter: (centerId) => dispatch(appActions.fetchCenter(centerId)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withWarehouse"))(Wrapper);
};

export default injectWarehouse;
