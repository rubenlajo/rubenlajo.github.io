import React from "react";
import { moment } from "amiga-core/application/i18n/moment";
import { T, intl } from "amiga-core/components/i18n";
import Link from "amiga-core/components/router/link";

import { Avatar, Chip } from "lib-frontsga";
import AvatarWrapper from "@/shared/components/avatar-wrapper/AvatarWrapper";
import NoData from "shared/components/no-data/";

import { formatISO8601, dateFormat, dateFormatEN } from "@/generalConfig";
import { getUserName } from "@/utils/";

const FIELDS_TABLE = {
  id: 0,
  warehouseMovementId: null,
  warehouseMovementType: null,
  materials: null,
  locations: "",
  warehouseMovementStatus: null,
  creationDate: "",
  closedDate: "",
  assignedUser: null,
};

const FIELDS_FORM = {
  id: 0,
  locations: "",
  materials: null,
  status: null,
  creationDate: "",
  closedDate: "",
  assignedUser: "",
  creationUser: "",
  totalDurationTimeMinutes: 0,
  purchaseOrderId: 0,
};

const WAREHOUSE_MOVEMENTS_STATUS_COLOR = {
  1: "link",
  2: "info",
  3: "success",
  4: "link",
  5: "error",
};

class WarehouseMovementAdapter {
  constructor(warehouseMovementRaw) {
    this.warehouseMovementRaw = warehouseMovementRaw;
  }

  toTable(assignedUsers) {
    const keys = Object.keys(FIELDS_TABLE);
    const warehouseMovementFinal = {};

    keys.forEach(key => {
      switch (key) {
        case "id":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.warehouseMovementId;
          break;

        case "warehouseMovementId":
          warehouseMovementFinal[key] = (
            <Link
              to={`/stock/warehouse-movements/${this.warehouseMovementRaw.warehouseMovementId}/detail`}
            >
              {this.warehouseMovementRaw.warehouseMovementId}
            </Link>
          );
          break;

        case "warehouseMovementType":
          warehouseMovementFinal[
            key
          ] = this.warehouseMovementRaw.warehouseMovementType.warehouseMovementTypeName;
          break;

        case "materials":
          if (
            this.warehouseMovementRaw.materials &&
            this.warehouseMovementRaw.materials.length > 0
          ) {
            const materialName = this.warehouseMovementRaw.materials[0].materialName.name;
            warehouseMovementFinal[key] =
              this.warehouseMovementRaw.materials.length > 1
                ? intl.formatMessage({ id: "stock.adapters.locations.multiple" })
                : materialName.length > 30
                ? materialName.substr(0, 27) + "..."
                : materialName;
          } else {
            warehouseMovementFinal[key] = <NoData />;
          }
          break;

        case "locations":
          if (
            this.warehouseMovementRaw.locations &&
            this.warehouseMovementRaw.locations.length > 0
          ) {
            warehouseMovementFinal[key] =
              this.warehouseMovementRaw.locations.length > 1
                ? intl.formatMessage({ id: "stock.adapters.locations.multiple" })
                : this.warehouseMovementRaw.locations[0].locationName;
          } else {
            warehouseMovementFinal[key] = <NoData />;
          }
          break;

        case "warehouseMovementStatus":
          warehouseMovementFinal[key] = (
            <Chip
              label={`${this.warehouseMovementRaw.warehouseMovementStatus.warehouseMovementStatusName}`}
              color={`var(--color-warehouse-movement-status${this.warehouseMovementRaw.warehouseMovementStatus.warehouseMovementStatusId}, #fcdd82)`}
              className='playground'
            />
          );
          break;
        case "creationDate":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.creationDate ? (
            moment(this.warehouseMovementRaw.creationDate, formatISO8601).format(
              intl.locale === "es" ? dateFormat : dateFormatEN
            )
          ) : (
            <NoData />
          );
          break;
        case "closedDate":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.closeDate ? (
            moment(this.warehouseMovementRaw.closeDate, formatISO8601).format(
              intl.locale === "es" ? dateFormat : dateFormatEN
            )
          ) : (
            <NoData />
          );
          break;

        case "assignedUser": {
          if (
            this.warehouseMovementRaw.assignedUsers &&
            this.warehouseMovementRaw.assignedUsers.length > 0
          ) {
            const name = getUserName(this.warehouseMovementRaw.assignedUsers[0].assignedUser);
            const image = assignedUsers[name] || null;

            warehouseMovementFinal[key] = (
              <div className='creation-user'>
                <AvatarWrapper users={[{ name: null, login: this.warehouseMovementRaw.assignedUsers[0].assignedUser }]} />
                <span>{name}</span>
              </div>
            );
          } else {
            warehouseMovementFinal[key] = <NoData />;
          }

          break;
        }

        default:
          if (typeof this.warehouseMovementRaw[key] !== "undefined") {
            warehouseMovementFinal[key] = this.warehouseMovementRaw[key];
          } else {
            warehouseMovementFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return warehouseMovementFinal;
  }

  toColumnRender(key, text) {
    let value = {};

    switch (key) {
      case "id":
        value = text;
        break;

      case "warehouseMovementId":
        value = <Link to={`/stock/warehouse-movements/${text}/detail`}>{text}</Link>;
        break;

      case "warehouseMovementType":
        value =
          text && text?.warehouseMovementTypeName ? text.warehouseMovementTypeName : <NoData />;
        break;

      case "materials":
        if (text && text?.length > 1) {
          value = intl.formatMessage({ id: "stock.adapters.locations.multiple" });
        } else if (text && text?.length > 0) {
          value =
            text[0]?.materialName?.name?.length > 30
              ? text[0]?.materialName?.name?.substr(0, 27) + "..."
              : text[0]?.materialName?.name;
        } else {
          value = <NoData />;
        }
        break;

      case "locations":
        value =
          text && text?.length > 0 ? (
            text.length > 1 ? (
              intl.formatMessage({ id: "stock.adapters.locations.multiple" })
            ) : (
              text[0].locationName
            )
          ) : (
            <NoData />
          );
        break;

      case "warehouseMovementStatus":
        value = (
          <Chip
            label={`${text.warehouseMovementStatusName}`}
            //color={`var(--color-warehouse-movement-status${text.warehouseMovementStatusId}, #fcdd82)`}
            stateColor={WAREHOUSE_MOVEMENTS_STATUS_COLOR[text.warehouseMovementStatusId]}
            className='playground'
          />
        );
        break;

      case "creationDate":
        value = text ? (
          moment(text, formatISO8601).format(intl.locale === "es" ? dateFormat : dateFormatEN)
        ) : (
          <NoData />
        );
        break;

      case "closedDate":
        value = text ? (
          moment(text, formatISO8601).format(intl.locale === "es" ? dateFormat : dateFormatEN)
        ) : (
          <NoData />
        );
        break;

      case "assignedUser": {
        if (text && text?.login) {
          //const name = getUserName(text[0].assignedUser);
          const name = getUserName(text.login);
          const image = text[name] || null;
          value = (
            <div className='creation-user'>
              <AvatarWrapper users={[{ name: text?.name, login: text.login }]} />
            </div>
          );
        } else {
          value = <NoData />;
        }
        break;
      }

      default:
        if (typeof text !== "undefined") {
          value = text;
        } else {
          value = FIELDS_TABLE[key];
        }
        break;
    }

    return value;
  }

  toForm() {
    const keys = Object.keys(FIELDS_FORM);
    const warehouseMovementFinal = {};

    keys.forEach(key => {
      switch (key) {
        case "id":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.warehouseMovementId;
          break;

        case "type":
          warehouseMovementFinal[
            key
          ] = this.warehouseMovementRaw.warehouseMovementType.warehouseMovementTypeName;
          break;

        case "purchaseOrderId":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.purchaseOrderId || null;
          break;

        case "materials":
          if (
            this.warehouseMovementRaw.materials &&
            this.warehouseMovementRaw.materials.length > 0
          ) {
            warehouseMovementFinal[key] =
              this.warehouseMovementRaw.materials.length > 1
                ? intl.formatMessage({ id: "stock.adapters.locations.multiple" })
                : this.warehouseMovementRaw.materials[0].materialId;
          } else {
            warehouseMovementFinal[key] = "";
          }
          break;

        case "locations":
          if (
            this.warehouseMovementRaw.locations &&
            this.warehouseMovementRaw.locations.length > 0
          ) {
            warehouseMovementFinal[key] =
              this.warehouseMovementRaw.locations.length > 1
                ? intl.formatMessage({ id: "stock.adapters.locations.multiple" })
                : this.warehouseMovementRaw.locations[0].locationName;
          } else {
            warehouseMovementFinal[key] = "";
          }
          break;

        case "status":
          warehouseMovementFinal[
            key
          ] = this.warehouseMovementRaw.warehouseMovementStatus.warehouseMovementStatusName;
          break;
        case "creationDate":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.creationDate
            ? moment(this.warehouseMovementRaw.creationDate).format(
                intl.locale === "es" ? dateFormat : dateFormatEN
              )
            : "";
          break;
        case "closedDate":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.closeDate
            ? moment(this.warehouseMovementRaw.closeDate).format(
                intl.locale === "es" ? dateFormat : dateFormatEN
              )
            : "";
          break;
        case "assignedUser":
          warehouseMovementFinal[key] =
            this.warehouseMovementRaw.assignedUsers &&
            this.warehouseMovementRaw.assignedUsers.length > 0
              ? getUserName(this.warehouseMovementRaw.assignedUsers[0].assignedUser)
              : "";
          break;
        case "creationUser":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.creationUser
            ? getUserName(this.warehouseMovementRaw.creationUser)
            : "";
          break;

        case "totalDurationTimeMinutes":
          warehouseMovementFinal[key] = this.warehouseMovementRaw.totalDurationTimeMinutes || "";
          break;

        default:
          if (typeof this.warehouseMovementRaw[key] !== "undefined") {
            warehouseMovementFinal[key] = this.warehouseMovementRaw[key];
          } else {
            warehouseMovementFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return warehouseMovementFinal;
  }
}

export default WarehouseMovementAdapter;
