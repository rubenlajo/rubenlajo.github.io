import React from "react";
import { moment } from "amiga-core/application/i18n/moment";
import Link from "amiga-core/components/router/link";
import { T, intl } from "amiga-core/components/i18n";

import { Chip } from "lib-frontsga";
import AvatarWrapper from "shared/components/avatar-wrapper/AvatarWrapper";

import NoData from "shared/components/no-data/";

import { dateFormat, dateFormatEN } from "@/generalConfig";
import { getUserName } from "@/utils/";

const FIELDS_TABLE = {
  id: 0,
  purchaseOrderId: 0,
  number: null,
  supplierName: null,
  creationDate: null,
  SFIStatus: "",
  estimatedArrivalDate: null,
  locationStatus: "",
  checked: false,
  creationUser: "",
};

const FIELDS_FORM = {
  supplierName: null,
  references: null,
  status: null,
  assignedUser: null,
  creationDate: null,
  creationDateSFI: null,
  closedDate: null,
  totalPrice: 0,
  estimatedArrivalDate: null,
  purchaseOrderSFICode: "",
  selfDeliveryNote: "",
  purchaseOrderSFIStatusNote: "",
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

const SFI_STATUS_COLORS = {
  1: "grey",
  2: "#f785f9",
  3: "info",
  8: "info",
  4: "error",
  5: "link",
  6: "success",
  7: "success",
  9: "link"
}

class PurchaseOrderAdapter {
  constructor(orderRaw) {
    this.orderRaw = orderRaw;

    this.dateformatLang = intl.locale === "es" ? dateFormat : dateFormatEN;
  }

  toTable(creationUsers) {
    const keys = Object.keys(FIELDS_TABLE);
    const orderFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "id":
          orderFinal[key] = this.orderRaw.purchaseOrderId;
          break;

        case "purchaseOrderId":
          orderFinal[key] = (
            <Link to={`/stock/orders/${this.orderRaw.purchaseOrderId}`}>{this.orderRaw.purchaseOrderId}</Link>
          );
          break;

        case "number":
          orderFinal[key] = (
            <Link to={`/stock/orders/${this.orderRaw.purchaseOrderId}`}>
              {this.orderRaw.purchaseOrderSFICode || "Sin datos"}
            </Link>
          );
          break;

        case "supplierName":
          const name = this.orderRaw.supplier ? this.orderRaw.supplier.supplierName : <NoData />;
          orderFinal[key] = name.length > 20 ? `${name.substr(0, 17)}...` : name;
          break;

        case "creationDate":
          orderFinal[key] = this.orderRaw.creationDateSFI ? (
            moment(this.orderRaw.creationDateSFI).format(this.dateformatLang)
          ) : (
            <NoData />
          );
          break;

        case "estimatedArrivalDate":
          orderFinal[key] = this.orderRaw.estimatedArrivalDate ? (
            moment(this.orderRaw.estimatedArrivalDate).format(this.dateformatLang)
          ) : (
            <NoData />
          );
          break;

        case "SFIStatus":
          orderFinal[key] = (
            <Chip
              label={`${this.orderRaw.purchaseOrderStatus.purchaseOrderStatusName}`}
              color={`var(--color-purchaseorderstatus-${this.orderRaw.purchaseOrderStatus.purchaseOrderStatusId}, #B5B5B5)`}
              className="status"
            />
          );
          break;
        case "locationStatus":
          // orderFinal[key] = (
          //   <Chip label={`${this.orderRaw.locationStatus.locationStatusName}`} color="#fcdd82" className="playground" />
          // );
          orderFinal[key] = <NoData />;
          break;

        case "creationUser": {
          if (this.orderRaw.creationUser) {
            //const name = getUserName(this.orderRaw.creationUser);
            const usersToAvatar = [
              {
                login: this.orderRaw.creationUser,
                name: null,
              },
            ];

            orderFinal[key] = (
              <div className="creation-user">
                <AvatarWrapper users={usersToAvatar} />
              </div>
            );
          } else {
            orderFinal[key] = <NoData />;
          }

          break;
        }

        default:
          if (typeof this.orderRaw[key] !== "undefined") {
            orderFinal[key] = this.orderRaw[key];
          } else {
            orderFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return orderFinal;
  }

  toColumnRender(key, text) {
    let value = {}

      switch (key) {
        case "id":
          value = {text};
          break;

        case "purchaseOrderId":
          value = (
            <Link to={`/stock/orders/${text}`}>{text}</Link>
          );
          break;

        case "number":
          value = (
            <Link to={`/stock/orders/${text.purchaseOrderId}`}>
              {text.purchaseOrderSFICode || "Sin datos"}
            </Link>
          );
          break;

        case "supplierName":
          const name = text ? text : <NoData />;
          value = name.length > 20 ? `${name.substr(0, 17)}...` : name;
          break;

        case "creationDate":
          value = text ? (
            moment(text).format(this.dateformatLang)
          ) : (
            <NoData />
          );
          break;

        case "estimatedArrivalDate":
          value = text ? (
            moment(text).format(this.dateformatLang)
          ) : (
            <NoData />
          );
          break;

        case "SFIStatus":
          value = text.purchaseOrderStatusId == 2 ?
          (
            <Chip
              label={`${text.purchaseOrderStatusName}`}
              stateColor={SFI_STATUS_COLORS[text.purchaseOrderStatusId]}
              customColor="#f785f9"
              className="status"
            />
          )
          : (
            <Chip
              label={`${text.purchaseOrderStatusName}`}
              //color={`var(--color-purchaseorderstatus-${text.purchaseOrderStatusId}, #B5B5B5)`}
              stateColor={SFI_STATUS_COLORS[text.purchaseOrderStatusId]}
              className="status"
            />
          );
          break;
        case "locationStatus":
          // orderFinal[key] = (
          //   <Chip label={`${this.orderRaw.locationStatus.locationStatusName}`} color="#fcdd82" className="playground" />
          // );
          value = <NoData />;
          break;

        case "creationUser": {
          if (text && text.login) {
            //const name = getUserName(text);
            const usersToAvatar = [
              {
                login: text.login,
                name: text?.name,
              },
            ];

            value = (
              <div className="creation-user">
                <AvatarWrapper users={usersToAvatar} />
              </div>
            );
          } else {
            value = <NoData />;
          }

          break;
        }

        default:
          // if (typeof this.orderRaw[key] !== "undefined") {
          //   orderFinal[key] = this.orderRaw[key];
          // } else {
          //   orderFinal[key] = FIELDS_TABLE[key];
          // }
          value = {text}
          break;
      }

    return value;
  }

  toForm() {
    const keys = Object.keys(FIELDS_FORM);
    const orderFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "supplierName":
          orderFinal[key] = this.orderRaw.supplier ? this.orderRaw.supplier.supplierName : "";
          break;

        case "references":
          orderFinal[key] = this.orderRaw.materialsNumber || 0;
          break;

        case "status":
          orderFinal[key] = this.orderRaw.purchaseOrderStatus.purchaseOrderStatusName;
          break;

        case "assignedUser":
          orderFinal[key] = this.orderRaw.creationUser ? this.orderRaw.creationUser : null;
          break;

        case "closedDate":
          orderFinal[key] = this.orderRaw.closedDate
            ? moment(this.orderRaw.closedDate).format(this.dateformatLang)
            : "";
          break;

        case "creationDate":
          orderFinal[key] = this.orderRaw.creationDate
            ? moment(this.orderRaw.creationDate).format(this.dateformatLang)
            : "";
          break;

        case "creationDateSFI":
          orderFinal[key] = this.orderRaw.creationDateSFI
            ? moment(this.orderRaw.creationDateSFI).format(this.dateformatLang)
            : "";
          break;

        case "totalPrice":
          orderFinal[key] = this.orderRaw.totalPrice ? this.orderRaw.totalPrice : FIELDS_FORM[key];
          break;

        case "estimatedArrivalDate":
          orderFinal[key] = this.orderRaw.estimatedArrivalDate
            ? moment(this.orderRaw.estimatedArrivalDate).format(this.dateformatLang)
            : FIELDS_FORM[key];
          break;

        case "purchaseOrderSFIStatusNote":
          orderFinal[key] = this.orderRaw.purchaseOrderSFIStatus
            ? this.orderRaw.purchaseOrderSFIStatus.purchaseOrderSFIStatusNote
            : FIELDS_FORM[key];
          break;

        default:
          if (typeof this.orderRaw[key] !== "undefined") {
            orderFinal[key] = this.orderRaw[key];
          } else {
            orderFinal[key] = FIELDS_FORM[key];
          }
          break;
      }
    });

    return orderFinal;
  }

  toDashboard() {
    const keys = Object.keys(FIELDS_DASHBOARD);
    const orderFinal = {};

    keys.forEach((key) => {
      switch (key) {
        default:
          if (typeof this.orderRaw[key] !== "undefined") {
            orderFinal[key] = this.orderRaw[key];
          } else {
            orderFinal[key] = FIELDS_DASHBOARD[key];
          }
          break;
      }
    });

    return orderFinal;
  }
}

export default PurchaseOrderAdapter;
