import React from "react";
import { T } from "amiga-core/components/i18n";

import "./styles.css";

function NoData() {
  return (
    <div className="no-data-component">
      <T id="shared.components.no-data.text" />
    </div>
  );
}

export default NoData;
