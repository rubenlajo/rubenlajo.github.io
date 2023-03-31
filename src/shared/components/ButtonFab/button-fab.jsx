import React from "react";

import { Button } from "lib-frontsga";

import "./styles.css";

function ButtonFab(props) {
  const { className, position = "bottom-right" } = props;

  return (
    <Button
      kind="fab"
      icon="sga-icon-plus"
      size="size-xs"
      {...props}
      className={`button--fab ${className || ""} position-${position}`}
    />
  );
}

export default ButtonFab;
