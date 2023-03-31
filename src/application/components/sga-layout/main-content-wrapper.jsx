import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

const MainContentWrapper = ({ children, className }) => (
  <div className={cn("app-layout-content__main", className)}>
    <div className="app-layout-content-main">{children}</div>
  </div>
);

MainContentWrapper.propTypes = {
  /**
   * Clase adicional que se aplicará al componente.
   */
  className: PropTypes.string,
};

export default MainContentWrapper;
