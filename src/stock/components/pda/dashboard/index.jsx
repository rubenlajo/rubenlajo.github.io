import React, { useEffect, useState } from "react";
import { intl } from "amiga-core/components/i18n";
import injectUser from "application/connectors/injectUser";

import PageMobile from "shared/components/page-mobile/";

import injectWarehouse from "application/connectors/injectWarehouse";
import connectPda from "stock/connectors/connectPda";

import QRScanner from "./qr-scanner";

import { debounce } from "@/utils/";
import { isAuthorized, getAuthRoles } from "@/utils/permissions";

import "./styles.css";

function Dashboard(props) {
  const {
    user,
  } = props;

  return (
    <PageMobile
      title={intl.formatMessage({ id: "stock.pda.dashboard.title" })}
      subtitle={intl.formatMessage({ id: "stock.pda.dashboard.subtitle" })}
      className='mobile-dashboard-page'
      contentScroll={false}
      onScan={debounce(barcode => checkBarcode(barcode), 500)}
      onSearch={debounce(barcode => checkBarcode(barcode), 2000)}
      resourceName='stockDashboardPage'
      disableScan={!isAuthorized(user.roles, getAuthRoles("pdaDashboardScan"))}
    >
      <QRScanner />
    </PageMobile>
  );
}

export default injectUser(injectWarehouse(connectPda(Dashboard)));
