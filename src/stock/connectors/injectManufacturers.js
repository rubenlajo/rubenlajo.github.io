import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/manufacturers/";
import * as getters from "stock/getters/manufacturers";

/**
 * HOC que inyecta las credenciales del usuario autenticado en la _prop_
 * `user` del componente al que rodea
 *
 * @param {Component} WrappedComponent el componente en el que se inyectan las
 * credenciales del usuario.
 */
const injectManufacturers = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      manufacturers: getters.getManufacturers(state),
      haveMoreManufacturers: getters.getHaveMoreManufacturers(state),
      manufacturer: getters.getCurrentManufacturer(state),
      manufacturersFetching: getters.getManufacturersFetching(state),
    }),
    (dispatch) => ({
      fetchManufacturers: (filters, append) => dispatch(actions.fetchManufacturers(filters, append)),
      fetchManufacturerById: (centerId, manufacturerId) =>
        dispatch(actions.fetchManufacturerById(centerId, manufacturerId)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withManufacturers"))(Wrapper);
};

export default injectManufacturers;
