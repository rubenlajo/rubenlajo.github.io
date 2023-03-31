import React from "react";
import "./styles.css";

function InputErrors({ errors = [] }) {
  return (
    <ul className="input-errors">
      {errors.map((error) => (
        <li>{error}</li>
      ))}
    </ul>
  );
}

export default InputErrors;
