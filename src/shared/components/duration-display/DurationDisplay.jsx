import React from "react";
import { T, intl } from "amiga-core/components/i18n";

import { Icon } from "lib-frontsga";

import "./styles.css";

function DurationDisplay(props) {
  const { title, icon, duration } = props;

  return (
    <div className="duration-display">
      <div className="heading">
        <Icon icon={icon} iconColor="#b5b5b5" iconSize={"1.2rem"} />
        <span>{title}</span>
      </div>
      <div className="duration">{duration}</div>
    </div>
  );
}

export default DurationDisplay;
