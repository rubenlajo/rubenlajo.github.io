import React from "react";
import { T, intl } from "amiga-core/components/i18n";

import { Chip } from "lib-frontsga";
import Link from "amiga-core/components/router/link";

const FIELDS_TABLE = {
  id: 0,
  orderId: null,
  type: null,
  references: null,
  location: "",
  status: null,
  creationDate: "",
  closedDate: "",
  asignedUser: null,
};

const FIELDS_FORM = {
  id: 0,
  location: "",
  references: null,
  status: null,
  creationDate: "",
  closedDate: "",
  asignedUser: null,
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

// const status = [
//   { statusCode: "DRAFT", statusId: 1 },
//   { statusCode: "REQUESTED_WINDOW", statusId: 2 },
//   { statusCode: "WAITING", statusId: 3 },
//   { statusCode: "IN_COURSE", statusId: 4 },
// ];

class StockMovementAdapter {
  constructor(stockMovementRaw) {
    this.stockMovementRaw = stockMovementRaw;
  }

  toTable() {
    const keys = Object.keys(FIELDS_TABLE);
    const stockMovementFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "id":
          stockMovementFinal[key] = this.stockMovementRaw.id;
          break;

        case "orderId":
          stockMovementFinal[key] = (
            <Link to={`/stock/movements/${this.stockMovementRaw.id}`}>{this.stockMovementRaw.orderId}</Link>
          );
          break;

        case "type":
          stockMovementFinal[key] = this.stockMovementRaw.type.typeName;
          break;

        case "references":
          stockMovementFinal[key] =
            this.stockMovementRaw.references.length > 1
              ? intl.formatMessage({ id: "stock.adapters.locations.multiple" })
              : this.stockMovementRaw.references[0].reference;
          break;

        case "location":
          stockMovementFinal[key] = this.stockMovementRaw.location;
          break;

        case "status":
          stockMovementFinal[key] = (
            <Chip label={`${this.stockMovementRaw.status.statusName}`} color="#fcdd82" className="playground" />
          );
          break;
        case "creationDate":
          stockMovementFinal[key] = this.stockMovementRaw.creationDate;
          break;
        case "closedDate":
          stockMovementFinal[key] = this.stockMovementRaw.closedDate ? this.stockMovementRaw.closedDate : "";
          break;
        case "asignedUser":
          stockMovementFinal[key] = this.stockMovementRaw.asignedUser ? this.stockMovementRaw.asignedUser : null;
          break;

        default:
          if (typeof this.stockMovementRaw[key] !== "undefined") {
            stockMovementFinal[key] = this.stockMovementRaw[key];
          } else {
            stockMovementFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return stockMovementFinal;
  }

  toForm() {
    const keys = Object.keys(FIELDS_FORM);
    const stockMovementFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "type":
          stockMovementFinal[key] = this.stockMovementRaw.type.typeName;
          break;

        case "references":
          stockMovementFinal[key] =
            this.stockMovementRaw.references.length > 1
              ? intl.formatMessage({ id: "stock.adapters.locations.multiple" })
              : this.stockMovementRaw.references[0].reference;
          break;

        case "location":
          stockMovementFinal[key] = this.stockMovementRaw.location;
          break;

        case "status":
          stockMovementFinal[key] = this.stockMovementRaw.status.statusName;
          break;
        case "creationDate":
          stockMovementFinal[key] = this.stockMovementRaw.creationDate;
          break;
        case "closedDate":
          stockMovementFinal[key] = this.stockMovementRaw.closedDate ? this.stockMovementRaw.closedDate : "";
          break;
        case "asignedUser":
          stockMovementFinal[key] = this.stockMovementRaw.asignedUser ? this.stockMovementRaw.asignedUser : null;
          break;

        default:
          if (typeof this.stockMovementRaw[key] !== "undefined") {
            stockMovementFinal[key] = this.stockMovementRaw[key];
          } else {
            stockMovementFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return stockMovementFinal;
  }

  toDashboard() {
    const keys = Object.keys(FIELDS_DASHBOARD);
    const stockMovementFinal = {};

    keys.forEach((key) => {
      switch (key) {
        default:
          if (typeof this.stockMovementRaw[key] !== "undefined") {
            stockMovementFinal[key] = this.stockMovementRaw[key];
          } else {
            stockMovementFinal[key] = FIELDS_DASHBOARD[key];
          }
          break;
      }
    });

    return stockMovementFinal;
  }
}

export default StockMovementAdapter;
