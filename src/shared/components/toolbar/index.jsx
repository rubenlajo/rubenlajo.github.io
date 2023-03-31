import React from "react";
import "./styles.css";

function Toolbar({ left, center, right }) {
  return (
    <div className="toolbar">
      <div className="left">{left}</div>
      <div className="center">{center}</div>
      <div className="right">{right}</div>
    </div>
  );
}

export default Toolbar;
