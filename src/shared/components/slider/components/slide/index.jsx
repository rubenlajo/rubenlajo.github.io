import React from "react";

function Slide({ active, children, sliderStyle }) {
  return <li className={`slide ${active ? "active" : ""}`} style={sliderStyle}>{children}</li>;
}

export default Slide;
