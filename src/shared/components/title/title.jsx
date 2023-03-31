import React from "react";

import "./styles.css";

function Title(props) {
  const { level, title, subtitle } = props;

  const renderTitleTag = () => {
    switch (level) {
      case 2:
        return <h2 className="title-label">{title}</h2>;
      case 3:
        return <h3 className="title-label">{title}</h3>;
      case 4:
        return <h4 className="title-label">{title}</h4>;
      case 5:
        return <h5 className="title-label">{title}</h5>;
      case 6:
        return <h6 className="title-label">{title}</h6>;
      default:
        return <h1 className="title-label">{title}</h1>;
    }
  };

  return (
    <div className="title-sga">
      {renderTitleTag()}
      <span className="title-subtitle">{subtitle}</span>
    </div>
  );
}

Title.defaultProps = {
  level: 1,
};

export default Title;
