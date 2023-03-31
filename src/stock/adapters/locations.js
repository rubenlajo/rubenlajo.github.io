import React from "react";
import { moment } from "amiga-core/application/i18n/moment";
import { T, intl } from "amiga-core/components/i18n";

import { Chip } from "lib-frontsga";
import Link from "amiga-core/components/router/link";

import NoData from "shared/components/no-data/";

import { dateFormat, dateFormatEN } from "@/generalConfig";

const FIELDS_TABLE = {
  id: 0,
  locationName: null,
  reference: null,
  inventary: null,
  lastInventaryDate: <NoData />,
  behaviour: <NoData />,
  enabled: <NoData />,
};

const FIELDS_DASHBOARD = {
  id: 0,
  title: "",
  start: "",
  end: "",
  classNames: "",
  extendedProps: {
    status: null,
  },
  description: "",
};

const LOCATION_STATUS_COLORS = {
  1: "link",
  2: "error",
  3: "success"
}

// const status = [
//   { statusCode: "DRAFT", statusId: 1 },
//   { statusCode: "REQUESTED_WINDOW", statusId: 2 },
//   { statusCode: "WAITING", statusId: 3 },
//   { statusCode: "IN_COURSE", statusId: 4 },
// ];

class LocationAdapter {
  constructor(locationRaw) {
    this.locationRaw = locationRaw;
  }

  toTable() {
    const keys = Object.keys(FIELDS_TABLE);
    const locationFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "id":
          locationFinal[key] = this.locationRaw.locationId ? this.locationRaw.locationId : FIELDS_TABLE[key];
          break;

        case "locationName":
          locationFinal[key] = locationFinal[key] = (
            <Link to={`/stock/locations/${this.locationRaw.locationId}`}>{this.locationRaw.locationName}</Link>
          );
          break;

        case "reference": {
          let reference = <NoData />;
          if (this.locationRaw.materials.length === 1) {
            reference = this.locationRaw.materials[0].materialId;
          }
          if (this.locationRaw.materials.length > 1) {
            reference = intl.formatMessage({ id: "stock.adapters.locations.multiple" });
          }
          locationFinal[key] = reference;
          break;
        }

        case "inventary":
          locationFinal[key] = this.locationRaw.locationLastInventoryStatus ? (
            <Chip
              label={`${this.locationRaw.locationLastInventoryStatus.locationLastInventoryStatusName}`}
              color={`var(--color-locationstatus-${this.locationRaw.locationLastInventoryStatus.locationLastInventoryStatusId}, #85D2F3)`}
              className="status"
            />
          ) : null;

          break;

        case "lastInventaryDate":
          locationFinal[key] =
            this.locationRaw.lastInventory && this.locationRaw.lastInventory.creationDate
              ? moment(this.locationRaw.lastInventory.creationDate)
                  .utc()
                  .format(intl.locale === "es" ? dateFormat : dateFormatEN)
              : FIELDS_TABLE[key];
          break;

        case "behaviour":
          locationFinal[key] = this.locationRaw.locationBehaviorType.locationBehaviorTypeName;
          break;

        case "enabled":
          locationFinal[key] = this.locationRaw.enabled
            ? intl.formatMessage({ id: "stock.locations.table.view.enabled.yes" })
            : intl.formatMessage({ id: "stock.locations.table.view.enabled.no" });
          break;

        default:
          if (typeof this.locationRaw[key] !== "undefined") {
            locationFinal[key] = this.locationRaw[key];
          } else {
            locationFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return locationFinal;
  }

  toColumnRender(key, text) {
    let value = {}

      switch (key) {
        case "id":
          value = {text};
          break;

        case "locationName":
          value = (
            <Link to={`/stock/locations/${text.locationId}`}>{text.locationName}</Link>
          );
          break;
        
        case "reference":
          if (text.length === 1) {
            value = (
              text[0].materialId
            );
          } else if (text.length > 1) {
            value = (intl.formatMessage({ id: "stock.adapters.locations.multiple" }));
          } else {
            value = <NoData />;
          }
          break;

        case "inventary":
          value = text ? (
            <Chip
              label={`${text.locationLastInventoryStatusName}`}
              stateColor={LOCATION_STATUS_COLORS[text.locationLastInventoryStatusId]}
              className="status"
            />
          ) : <NoData />;
          break;

        case "lastInventaryDate":
          value =
          text ? moment(text)
                .utc()
                .format(intl.locale === "es" ? dateFormat : dateFormatEN)
            : FIELDS_TABLE[key];
          break;

        case "behaviour":
          value = text ? (
           text.locationBehaviorTypeName
          ) : (
            <NoData />
          );
          break;

        case "enabled":
          value = text ? (
            intl.formatMessage({ id: "stock.locations.table.view.enabled.yes" })
          ) : (
            intl.formatMessage({ id: "stock.locations.table.view.enabled.no" })
          );
          break;

        default:
          value = {text}
          break;
      }

    return value;
  }

  toDashboard() {
    const keys = Object.keys(FIELDS_DASHBOARD);
    const locationFinal = {};

    keys.forEach((key) => {
      switch (key) {
        default:
          if (typeof this.locationRaw[key] !== "undefined") {
            locationFinal[key] = this.locationRaw[key];
          } else {
            locationFinal[key] = FIELDS_DASHBOARD[key];
          }
          break;
      }
    });

    return locationFinal;
  }
}

export default LocationAdapter;
