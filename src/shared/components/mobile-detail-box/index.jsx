import React from "react";

import "./styles.css";

function MobileDetailBox(props) {
  const { label, value, className } = props;
  return (
    <div className={`mdb ${className || ""}`}>
      <div className="mdb-label">{label}</div>
      <div className="mdb-value">{value}</div>
    </div>
  );
}

export default MobileDetailBox;
