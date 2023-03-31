import React from "react";

function Image(props) {
  const { src, altSrc, altText, className, onError = () => {} } = props;

  const onErr = (e) => {
    e.target.onerror = null;
    e.target.src = altSrc;
    e.target.classList.add("has-error");
    onError();
  };

  return <img className={`alternate-img ${className || ""}`} src={src} onError={onErr} alt={altText || ""} />;
}

export default Image;
