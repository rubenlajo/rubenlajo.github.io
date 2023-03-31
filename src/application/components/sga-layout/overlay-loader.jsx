import PropTypes from "prop-types";
import React from "react";
import cn from "classnames";
import { connect } from "react-redux";
import { T, intl } from "amiga-core/components/i18n";
import LoaderLayer from "amiga-core/components/loader/loader-layer";
import * as fromApplication from "amiga-core/application/reducers/application";

import { Loader } from "lib-frontsga";

const OverlayLoader = ({ loading, className }) => (
  <LoaderLayer>
    <div className={cn("loader loader--blocking", className, !loading ? "hidden" : "")}>
      <div className="loader__message">
        <Loader label={intl.formatMessage({ id: "amiga.components.loader.loading" })} />
      </div>
    </div>
  </LoaderLayer>
);

OverlayLoader.propTypes = {
  /**
   * Loader visibility.
   */
  loading: PropTypes.bool.isRequired,
  /**
   * Additional CSS class to be applied to the component.
   */
  className: PropTypes.string,
};

const connected = connect((state) => ({
  loading: fromApplication.getBlockingLoadingStatus(state),
}));

export default connected(OverlayLoader);
