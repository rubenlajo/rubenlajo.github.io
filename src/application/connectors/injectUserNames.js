import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";

import connect from "amiga-core/application/connect";

import * as appGetters from "application/getters";
import * as appActions from "application/actions";

/**
 * HOC que inyecta las props userNames y fetchUserNames en el componente que rodea
 *
 * @param {Component} WrappedComponent el componente en el que se inyectan las
 * credenciales del usuario.
 */
const injectUserNames = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      userNames: appGetters.getUserNames(state),
      userNamesLoading: appGetters.getUserNamesLoading(state),
    }),
    (dispatch) => ({
      fetchUserNames: (userLogins) => dispatch(appActions.fetchUserNames(userLogins)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withUserNames"))(Wrapper);
};

export default injectUserNames;
