import React from "react";

import { T, intl } from "amiga-core/components/i18n";
import { Visible } from "amiga-core/components/auth";

import injectUser from "application/connectors/injectUser";

import { getAuthRoles, isAuthorized } from "@/utils/permissions";

import image from "./no-permissions.svg";

import "./styles.css";

function AccessCheck(props) {
  const { children, user, resource } = props;

  const canAccess = isAuthorized(user.roles, getAuthRoles(resource));

  return (
    <>
      <Visible onlyIf={() => canAccess}>{children}</Visible>
      <Visible onlyIf={() => !canAccess}>
        <div className="access-deny-message">
          <img src={image} alt={intl.formatMessage({ id: "shared.access-check-no-permissions" })} />
          <div className="access-deny-title">
            <T id="shared.access-check-no-permissions" />
          </div>
        </div>
      </Visible>
    </>
  );
}

export default injectUser(AccessCheck);
