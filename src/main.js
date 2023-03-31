import React, { Suspense } from "react";

import { renderApplication } from "amiga-core/application";
import { intl } from "amiga-core/components/i18n";
import { localeFromNavigatorPreferences, localeFromCookies, fixedLocale } from "amiga-core/components/locale";

import { ThemeProvider, IntlProvider } from "lib-frontsga";

import Layout from "application/components/sga-layout";
import SGALoginLayout from "application/components/sga-layout-login";

import applicationModule from "@/application/module";
import stockModule from "@/stock/module";
import sharedModule from "@/shared/module";

import { getCredentials, logOut, getIMMSURL } from "./utils/";
import { getMenu, headerLabel } from "./generalConfig";
import logo from "./assets/images/imms_logo.svg";

import "./assets/css/main.css";
import "./assets/css/mobile.css";

const modules = [stockModule, sharedModule, applicationModule];

const allMessages = (locale) => {
  return {
    ...applicationModule.messages()[locale],
    ...stockModule.messages()[locale],
    ...sharedModule.messages()[locale],
  };
};

renderApplication(
  () => ({
    rootNodeId: "app",
    modules,
    authentication: {
      getCredentials,
      forceLogout: true,
      enableLogout: false,
      requestLogout: () => logOut(true),
    },
    localeHandlers: [localeFromNavigatorPreferences, localeFromCookies, fixedLocale("en")],
    LoginLayout: (props) => <SGALoginLayout {...props} />,
    Layout: (props) => (
      <Layout
        {...props}
        logo={logo}
        menu={getMenu}
        headerLabel={headerLabel}
        onSettings={() => {
          window.location = getIMMSURL("/main/index.html#/initTechnicianSheet/");
        }}
        onNotifications={() => {
          window.location = getIMMSURL("/main/index.html#/initNotifications/");
        }}
        withBadge={false}
      />
    ),
    Provider: (props) => (
      <Suspense fallback={null}>
        <ThemeProvider theme="sga-dark">
          <IntlProvider locale={intl.locale} messages={allMessages(intl.locale)}>
            {props.children}
          </IntlProvider>
        </ThemeProvider>
      </Suspense>
    ),
  }),
  {
    useRemoteConfig: false,
  },
);
