import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "lib-frontsga";

import "./styles.css";

const propTypes = {
  /**
   * Valor actual del input
   */
  value: PropTypes.any,
  /**
   * Opciones disponibles para seleccionar
   */
  options: PropTypes.arrayOf(PropTypes.object),
  /**
   * función que se llama con cada cambio
   */
  onChange: PropTypes.func,
};

function DropdownSelect({ value, options, onChange, className }) {
  const [opened, setOpened] = useState(false);

  const handleClick = (option) => {
    setOpened(false);
    onChange(option);
  };

  return (
    <div className={`dropdown-select ${className || ""} ${opened ? "is-open" : "is-closed"}`}>
      <div className="dropdown-select-value" onClick={() => setOpened(!opened)}>
        <span>{value ? value.label : null}</span>
        <Icon icon={`${opened ? "sga-icon-caret-filled-down" : "sga-icon-caret-filled-right"}`} size="size-xs" />
      </div>
      {opened ? (
        <div className="dropdown-select-options-container">
          <div className="dropdown-select-overlay" onClick={() => setOpened(false)} />
          <ul className="dropdown-select-options">
            {options.map((option, index) => {
              return (
                <li
                  key={index}
                  onClick={() => handleClick(option)}
                  className={`select-option ${value.label === option.label ? "selected" : ""}`}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

DropdownSelect.propTypes = propTypes;

DropdownSelect.defaultProps = {
  options: [],
};

export default DropdownSelect;
