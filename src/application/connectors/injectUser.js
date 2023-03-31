import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";

import connect from "amiga-core/application/connect";
import { getAuthenticatedUser } from "amiga-core/application/reducers/application/selectors";

var injectUser = (WrappedComponent) => {
  const Wrapper = connect(function (state) {
    return {
      user: getAuthenticatedUser(state)
    };
  })(WrappedComponent);
  return setDisplayName(wrapDisplayName(WrappedComponent, "withUser"))(Wrapper);
};

export default injectUser;
