import React from "react";

import "./styles.css";

function TitleMobile(props) {
  const { title, subtitle, className } = props;
  return (
    <div className={`title-mobile ${className}`}>
      <div className="title">{title}</div>
      <div className="subtitle">{subtitle.toLowerCase()}</div>
    </div>
  );
}

TitleMobile.defaultProps = {
  className: "",
  title: "",
  subtitle: "",
};

export default TitleMobile;
