/* eslint-disable no-console */
import React from "react";
import PropTypes from "prop-types";
import Redirect from "amiga-core/components/router/redirect";

import injectWarehouse from "application/connectors/injectWarehouse";
import injectDevice from "../sga-layout/inject-device";

const propTypes = {
  match: PropTypes.object,
  user: PropTypes.object,
};

const Redirector = ({ device }) => {
  let url;

  if (device.mobile) {
    url = "/stock/pda/dashboard";
  } else {
    url = "/stock";
  }

  return <Redirect to={url} />;
};

Redirector.propTypes = propTypes;

export default injectWarehouse(injectDevice(Redirector));
