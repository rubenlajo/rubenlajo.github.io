import React from "react";

import "./styles.css";

function Square({ className = "", squareColor = "#4D4D4D", text, size = "size-m" }) {
  const style = {
    backgroundColor: squareColor,
    color: "var(--color-neutral50, #E6E6E6)",
  };
  return (
    <div className={`square ${className} ${size}`} style={style}>
      {text}
    </div>
  );
}
export default Square;
