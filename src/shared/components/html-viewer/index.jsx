import React from "react";
import { T } from "amiga-core/components/i18n";

import "./styles.css";

function HtmlViewer({ html }) {
  return (
    <div
      className="htmlViewer"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    ></div>
  );
}

export default HtmlViewer;
