import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";

import connect from "amiga-core/application/connect";

import * as appGetters from "application/getters";
import * as appActions from "application/actions";

/**
 * HOC que inyecta las props userPhotos y fetchUserPhoto en el componente que rodea
 *
 * @param {Component} WrappedComponent el componente en el que se inyectan las
 * credenciales del usuario.
 */
const injectUserPhotos = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      userPhotos: appGetters.getUserPhotos(state),
    }),
    (dispatch) => ({
      fetchUserPhoto: (userLogin) => dispatch(appActions.fetchUserPhoto(userLogin)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withUserPhotos"))(Wrapper);
};

export default injectUserPhotos;
