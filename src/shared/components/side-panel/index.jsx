import React from "react";
import PropTypes from "prop-types";

import { ModalSidebar } from "lib-frontsga";

import "./styles.css";

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.any.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  className: PropTypes.string,
  size: PropTypes.string, //"size-m"|"size-s"
};

function SidePanel(props) {
  const {
    title,
    children,
    visible,
    setVisible,
    size = "size-m",
    widthSizeM,
    className,
    buttonPrimaryProps,
    buttonSecondaryProps,
    buttonTertiaryProps,
    onClose,
  } = props;

  return (
    <ModalSidebar
      className={className}
      show={visible}
      onClose={onClose ? onClose : () => setVisible(false)}
      position='right'
      size={size}
      widthSizeM={widthSizeM ? widthSizeM : "33%"}
      title={title}
      buttonPrimaryProps={buttonPrimaryProps}
      buttonSecondaryProps={buttonSecondaryProps}
      buttonTertiaryProps={buttonTertiaryProps}
      closeOnClickOutside={false}
    >
      {children}
    </ModalSidebar>
  );
}

SidePanel.propTypes = propTypes;

export default SidePanel;
