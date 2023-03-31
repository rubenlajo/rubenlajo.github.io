import React from "react";
import { Icon } from "lib-frontsga";

import "./styles.css";

function ActionIcon({
  onClick,
  iconColor,
  iconName,
  className,
  iconSize,
  disabled,
  notVisible,
  label = "",
}) {
  return notVisible ? (
    <span></span>
  ) : (
    <div
      onClick={onClick}
      className={`action-icon ${className || ""} ${disabled ? "disabled" : ""}`}
    >
      <Icon icon={iconName} iconColor={iconColor} size={iconSize} label={label} />
    </div>
  );
}

export default ActionIcon;
