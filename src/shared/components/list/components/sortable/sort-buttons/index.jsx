import React from "react";
import PropTypes from "prop-types";
import { Button } from "lib-frontsga";
import "./styles.css";

const propTypes = {
  first: PropTypes.bool,
  last: PropTypes.bool,
  up: PropTypes.func,
  down: PropTypes.func,
};

const SortButtons = ({ first, last, up, down }) => (
  <div className="sort-buttons">
    <Button
      kind="icon"
      icon="sga-icon-angle-up"
      iconColor="#FFFFFF"
      iconSize={"3.2rem"}
      disabled={first}
      onClick={() => {
        if (!first) {
          up();
        }
      }}
    />
    <Button
      kind="icon"
      icon="sga-icon-angle-down"
      iconColor="#FFFFFF"
      iconSize={"3.2rem"}
      disabled={first}
      onClick={() => {
        if (!first) {
          down();
        }
      }}
    />
  </div>
);

SortButtons.propTypes = propTypes;

export default SortButtons;
