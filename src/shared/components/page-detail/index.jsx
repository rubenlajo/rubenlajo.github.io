import React, { useEffect, useState } from "react";
import { intl } from "amiga-core/components/i18n";

import injectWarehouse from "application/connectors/injectWarehouse";
import { Title } from "lib-frontsga";
import CheckAccess from "shared/components/check-access/";

import "./styles.css";

function PageDetail(props) {
  const {
    title,
    subtitle,
    children,
    className,
    onGoBack,
    centers,
    fetchCenters,
    fetchCenter,
    resourceName,
    appMetadata,
    titleRight,
    centerSelected,
  } = props;

  useEffect(() => {
    if (centers.length === 0) {
      fetchCenters();
    }
  }, [centers]);

  useEffect(() => {
    if (centerSelected && !centerSelected.mapParameters) {
      fetchCenter(centerSelected.centerId);
    }
  }, [centerSelected]);

  const isHistoryInstance = appMetadata && appMetadata.immsReadOnly;

  return (
    <CheckAccess resource={resourceName}>
      <div className={`page-detail ${className || ""} ${isHistoryInstance ? "history-instance" : ""}`}>
        <div className="header-container">
          {title ? <Title title={title} subtitle={subtitle} onGoBack={onGoBack} /> : null}
          {titleRight ? <span className="title-right">{titleRight}</span> : null}
        </div>
        <div className="page-detail-content">{children}</div>
      </div>
    </CheckAccess>
  );
}

PageDetail.defaultProps = {
  subtitle: "",
  resourceName: "all",
  onGoBack: () => {},
};

// export default injectWarehouse(PageDetail);
export default injectWarehouse(PageDetail);
