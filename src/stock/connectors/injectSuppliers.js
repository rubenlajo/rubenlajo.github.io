import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/suppliers";
import * as getters from "stock/getters/suppliers";

/**
 * HOC que inyecta las props de proveedores
 *
 * @param {Component} WrappedComponent el componente en el que se inyectan las props
 */
const injectSuppliers = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      suppliers: getters.getSuppliers(state),
      suppliersFetching: getters.getSuppliersFetching(state),
      suppliersFetched: getters.getSuppliersFetched(state),
    }),
    (dispatch) => ({
      fetchSuppliers: (centerId, filters) => dispatch(actions.fetchSuppliers(centerId, filters)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withSuppliers"))(Wrapper);
};

export default injectSuppliers;
