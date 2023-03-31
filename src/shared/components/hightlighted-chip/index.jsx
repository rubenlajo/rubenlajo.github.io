import React from "react";

import { Chip } from "lib-frontsga";

function HightlightedChip({ label, color = "#e6e6e6", borderLeftColor = "#E6E6E6", size = "size-s" }) {
  const style = {
    borderLeft: `3px solid ${borderLeftColor}`,
    borderRadius: "4px",
    display: "inline-block",
  };

  return (
    <span className="left-highlighted-chip" style={style}>
      <Chip label={label} color={color} info size={size} />
    </span>
  );
}

export default HightlightedChip;
