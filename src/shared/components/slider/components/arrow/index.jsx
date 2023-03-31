import React from "react";
import { Icon } from "lib-frontsga";

function Arrow({ position, onClick, disabled = false }) {
  return (
    <div className={`arrow ${position || ""} ${disabled ? "disabled" : ""}`} onClick={() => onClick()}>
      <Icon icon={`sga-icon-angle-${position}`} size="size-s" />
    </div>
  );
}

export default Arrow;
