import React, { useRef, useState } from "react";

import { Icon } from "lib-frontsga";

import "./styles.css";

const CodeScanner = (props) => {
  const { className, onChange, disabled, onScanClick } = props;

  const [focused, setFocused] = useState(false);

  let refFromUseRef = useRef();

  const setFocus = () => {
    refFromUseRef.current.focus();
    refFromUseRef.current.value = "";
    setFocused(true);
    onChange("");
  };

  const scanClick = () => {
    if (onScanClick) {
      onScanClick();
    }
    if (!disabled) {
      setFocus();
    }
  };

  return (
    <div className={`code-scanner-container ${className || ""}`}>
      <div className="qr-icon" tabIndex={0} onClick={scanClick}>
        <div className="icon-bg">
          <Icon icon="sga-icon-qrcode" iconSize="3.6rem" iconColor="link" />
        </div>
        <div className="hidden-input">
          <input
            type="text"
            onChange={(e) => {
              onChange(e.target.value);
              setFocused(false);
            }}
            ref={refFromUseRef}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeScanner;
