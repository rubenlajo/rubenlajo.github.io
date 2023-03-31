import React from "react";
import { Chip } from "lib-frontsga";
import Link from "amiga-core/components/router/link";
import NoData from "shared/components/no-data/";

const REFERENCE_STATUS_COLOR = {
  0: "info",
  1: "success",
  2: "link",
  3: "error"
}

const FIELDS_TABLE = {
  id: 0,
  id2: 0,
  reference: null,
  manufacturerName: null,
  manufacturerRef: null,
  description: "",
  clasification: null,
  SFIStatus: null,
  stock: null,
  criticalityType: "",
};

const FIELDS_ORDER_LINE = {
  id: 0,
  reference: null,
  manufacturerName: null,
  manufacturerRef: null,
  description: "",
  clasification: null,
  sfiStatusId: null,
  stock: 0,
  price: 0,
  qty: 0,
};

const FIELDS_ADD_TO_ORDER = {
  id: 0,
  reference: null,
  description: "",
  manufacturerName: null,
  stock: 0,
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

const FIELDS_FORM = {
  id: 0,
  codSFI: "",
  stock: 0,
  stockStatusId: null,
  clasificacionId: null,
  orderLevel: 0,
  minimumLevel: 0,
  maximumLevel: 0,
  maxOrderAmount: null,
  minOrderAmount: null,
  criticalityTypeId: null,
  maxLevel: 0,
  name: "",
  preferedLocation: "",
  refFabricante: "",
  manufacturer: null,
  supplierName: "",
  supplierId: "",
  unitPrice: null,
  secondaryProviders: [],
  comments: "",
  previewImg: "",
  measurementUnit: null,
};

class ReferenceAdapter {
  constructor(referenceRaw) {
    this.referenceRaw = referenceRaw;
  }

  toTable(sfiStatusList = []) {
    const keys = Object.keys(FIELDS_TABLE);
    const referenceFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "id":
          referenceFinal[key] = this.referenceRaw.materialId ? this.referenceRaw.materialId : FIELDS_TABLE[key];
          break;

        case "id2":
          referenceFinal[key] = (
            <Link to={`/stock/references/${this.referenceRaw.materialId}`}>{this.referenceRaw.materialId}</Link>
          );
          break;

        case "reference":
          referenceFinal[key] = (
            <Link to={`/stock/references/${this.referenceRaw.materialId}`}>{this.referenceRaw.materialId}</Link>
          );
          break;

        case "manufacturerName":
          referenceFinal[key] = this.referenceRaw.general.manufacturer.manufacturerName;
          break;

        case "manufacturerRef":
          referenceFinal[key] =
            this.referenceRaw.general.manufacturerReference.length >= 30
              ? `${this.referenceRaw.general.manufacturerReference.substr(0, 27)}...`
              : this.referenceRaw.general.manufacturerReference;
          break;

        case "preferedLocation":
          referenceFinal[key] = this.referenceRaw.local.location.locationName;
          break;

        case "description":
          referenceFinal[key] =
            this.referenceRaw.general.materialI18n &&
            this.referenceRaw.general.materialI18n.name &&
            this.referenceRaw.general.materialI18n.name.length >= 40
              ? `${this.referenceRaw.general.materialI18n.name.substr(0, 37)}...`
              : this.referenceRaw.general.materialI18n.name;
          break;

        case "clasification":
          referenceFinal[key] =
            this.referenceRaw.general.materialI18n &&
            this.referenceRaw.general.materialI18n.materialClassificationName &&
            this.referenceRaw.general.materialI18n.materialClassificationName.length > 13
              ? `${this.referenceRaw.general.materialI18n.materialClassificationName.substr(0, 10)}...`
              : this.referenceRaw.general.materialI18n.materialClassificationName;
          break;

        case "SFIStatus":
          const sfiStatus = sfiStatusList.find((s) => s.sfiStatusId === this.referenceRaw.general.sfiStatusId);
          referenceFinal[key] = sfiStatus ? sfiStatus.sfiStatusName : "";
          break;

        case "stock":
          referenceFinal[key] = (
            <Chip
              label={`${this.referenceRaw.local.stock}`}
              color={`var(--color-stockstatus-${this.referenceRaw.local.stockStatusId || 0}, #fcdd82)`}
              className="playground"
            />
          );
          break;

        default:
          if (typeof this.referenceRaw[key] !== "undefined") {
            referenceFinal[key] = this.referenceRaw[key];
          } else {
            referenceFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return referenceFinal;
  }

  toColumnRender(key, text, sfiStatusList) {
    let value = {}

      switch (key) {
        case "id":
          value = text;
          break;

        case "reference":
          value = (
            <Link to={`/stock/references/${text}`}>
              {text}
            </Link>
          );
          break;
        
        case "manufacturerName":          
          value = text ? (
            text
          ) : (
            <NoData />
          );
          break;

        case "manufacturerRef":
          value = text ? (
            text.length >= 33
            ? `${text.substr(0, 30)}...`
            : text
          ) : (
            <NoData />
          );
          break;

        case "preferedLocation":
          value = text && text?.length  > 0 ? (
            text.length > 1
            ? intl.formatMessage({ id: "stock.adapters.locations.multiple"})
              : text[0].locationName
          ) : <NoData />
          break;

        case "description":
          value =  text &&
          text.length >= 43
            ? `${text.substr(0, 40)}...`
            : text;
          break;

        case "clasification":
          value =  text &&
          text.length > 16
            ? `${text.substr(0, 13)}...`
            : text;
          break;
        
        case "SFIStatus":
          const sfiStatus = sfiStatusList.find((s) => s.sfiStatusId === text.sfiStatusId);
          value = sfiStatus ? sfiStatus.sfiStatusName : "";
          break; 

        case "stock": {
          value = (
            <Chip
              label={`${text?.stock}`}
              stateColor={REFERENCE_STATUS_COLOR[text.stockStatusId]}
              className="playground"
            />)
          break;
        }

        case "criticalityType":
          value = text;
          break;

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

  toOrderLine() {
    const keys = Object.keys(FIELDS_ORDER_LINE);
    const referenceFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "id":
          referenceFinal[key] = this.referenceRaw.materialId;
          break;

        case "reference":
          referenceFinal[key] = this.referenceRaw.general.materialRefFabricante;
          break;

        case "manufacturerName":
          referenceFinal[key] = this.referenceRaw.general.manufacturer.manufacturerName;
          break;

        case "manufacturerRef":
          referenceFinal[key] = this.referenceRaw.general.manufacturerReference;
          break;

        case "description":
          referenceFinal[key] = this.referenceRaw.general.materialI18n.name;
          break;

        case "clasification":
          referenceFinal[key] = this.referenceRaw.general.materialI18n.materialClassificationName;
          break;

        case "stock":
          referenceFinal[key] = this.referenceRaw.local.stock;
          break;

        case "price":
          referenceFinal[key] = this.referenceRaw.general.price;
          break;

        case "qty":
          referenceFinal[key] = this.referenceRaw.local.orderLevel;
          break;

        case "preferedLocation":
          referenceFinal[key] = this.referenceRaw.local.location.locationName;
          break;

        default:
          if (typeof this.referenceRaw[key] !== "undefined") {
            referenceFinal[key] = this.referenceRaw[key];
          } else {
            referenceFinal[key] = FIELDS_TABLE[key];
          }
          break;
      }
    });

    return referenceFinal;
  }

  toDashboard() {
    const keys = Object.keys(FIELDS_DASHBOARD);
    const referenceFinal = {};

    keys.forEach((key) => {
      switch (key) {
        default:
          if (typeof this.referenceRaw[key] !== "undefined") {
            referenceFinal[key] = this.referenceRaw[key];
          } else {
            referenceFinal[key] = FIELDS_DASHBOARD[key];
          }
          break;
      }
    });

    return referenceFinal;
  }

  toForm() {
    const keys = Object.keys(FIELDS_FORM);
    const referenceFinal = {};

    let estimate = [];
    if (
      this.referenceRaw.materialPurchase &&
      this.referenceRaw.materialPurchase.length > 0 &&
      this.referenceRaw.materialPurchase[0] &&
      this.referenceRaw.materialPurchase[0].estimate &&
      this.referenceRaw.materialPurchase[0].estimate.length > 0
    ) {
      estimate = this.referenceRaw.materialPurchase[0].estimate;
    }

    keys.forEach((key) => {
      switch (key) {
        case "id":
          referenceFinal[key] = this.referenceRaw.materialId ? this.referenceRaw.materialId : FIELDS_TABLE[key];
          break;

        case "codSFI":
          referenceFinal[key] = this.referenceRaw.general ? this.referenceRaw.general.codSFI : FIELDS_FORM[key];
          break;

        case "stock":
          referenceFinal[key] = this.referenceRaw.local ? this.referenceRaw.local.stock : FIELDS_FORM[key];
          break;

        case "stockStatusId":
          referenceFinal[key] = this.referenceRaw.local ? this.referenceRaw.local.stockStatusId : null;
          break;

        case "clasificacionId":
          referenceFinal[key] = this.referenceRaw.general
            ? {
                label: this.referenceRaw.general.materialI18n.materialClassificationName,
                value: this.referenceRaw.general.materialClassificationId,
              }
            : null;
          break;
        // case "clasificacionId":
        //   referenceFinal[key] = this.referenceRaw.general ? this.referenceRaw.general.clasificacionId : null;
        //   break;

        case "orderLevel":
          referenceFinal[key] = this.referenceRaw.local ? this.referenceRaw.local.orderLevel : FIELDS_FORM[key];
          break;

        case "minimumLevel":
          referenceFinal[key] = this.referenceRaw.local ? this.referenceRaw.local.minimumLevel : FIELDS_FORM[key];
          break;

        case "maximumLevel":
          referenceFinal[key] = this.referenceRaw.local ? this.referenceRaw.local.maximumLevel : FIELDS_FORM[key];
          break;

        case "criticalityTypeId":
          referenceFinal[key] = this.referenceRaw.local ? this.referenceRaw.local.criticalityTypeId : FIELDS_FORM[key];
          break;

        case "name":
          referenceFinal[key] = this.referenceRaw.general
            ? this.referenceRaw.general.materialI18n.name
            : FIELDS_FORM[key];
          break;

        case "refFabricante":
          referenceFinal[key] = this.referenceRaw.general
            ? this.referenceRaw.general.manufacturerReference
            : FIELDS_FORM[key];
          break;

        case "manufacturer":
          referenceFinal[key] =
            this.referenceRaw.general && this.referenceRaw.general.manufacturer
              ? {
                  label: this.referenceRaw.general.manufacturer.manufacturerName,
                  value: this.referenceRaw.general.manufacturer.manufacturerId,
                }
              : FIELDS_FORM[key];
          break;

        case "preferedLocation":
          referenceFinal[key] =
            this.referenceRaw && this.referenceRaw.local && this.referenceRaw.local.location
              ? {
                  label: this.referenceRaw.local.location.locationName,
                  value: this.referenceRaw.local.location.locationId,
                }
              : null;
          break;

        case "supplierName":
          referenceFinal[key] = estimate.length > 0 ? estimate[0].supplierName : "";
          break;
        case "supplierId":
          referenceFinal[key] = estimate.length > 0 ? estimate[0].supplierId : "";
          break;

        case "unitPrice":
          const priceObj = estimate.length > 0 && estimate[0].prices.find((p) => !p.until);
          if (priceObj) {
            referenceFinal[key] = priceObj.price;
          } else {
            referenceFinal[key] = 0;
          }
          break;

        case "comments":
          referenceFinal[key] = this.referenceRaw.local ? this.referenceRaw.local.comments : FIELDS_FORM[key];
          break;

        case "measurementUnit":
          referenceFinal[key] =
            estimate.length > 0
              ? {
                  label: estimate[0].measurementUnit.measurementUnitName,
                  value: estimate[0].measurementUnit.measurementUnitId,
                }
              : FIELDS_FORM[key];
          break;

        default:
          if (typeof this.referenceRaw[key] !== "undefined") {
            referenceFinal[key] = this.referenceRaw[key];
          } else {
            referenceFinal[key] = FIELDS_FORM[key];
          }
          break;
      }
    });

    return referenceFinal;
  }

  toAddToOrder() {
    const keys = Object.keys(FIELDS_ADD_TO_ORDER);
    const referenceFinal = {};

    keys.forEach((key) => {
      switch (key) {
        case "id":
          referenceFinal[key] = this.referenceRaw.materialId ? this.referenceRaw.materialId : FIELDS_TABLE[key];
          break;

        case "reference":
          referenceFinal[key] = this.referenceRaw.general.manufacturerReference;
          break;

        case "description":
          referenceFinal[key] = this.referenceRaw.general.materialI18n.name;
          break;

        case "manufacturerName":
          referenceFinal[key] = this.referenceRaw.general.manufacturer.manufacturerName;
          break;

        case "stock":
          referenceFinal[key] = (
            <Chip
              label={`${this.referenceRaw.local.stock}`}
              //color={`var(--color-stockstatus-${this.referenceRaw.local.stockStatusId || 0})`}
              stateColor={REFERENCE_STATUS_COLOR[this.referenceRaw.local.stockStatusId || 0]}
              className="playground"
            />
          );
          break;
        default:
          if (typeof this.referenceRaw[key] !== "undefined") {
            referenceFinal[key] = this.referenceRaw[key];
          } else {
            referenceFinal[key] = FIELDS_DASHBOARD[key];
          }
          break;
      }
    });

    return referenceFinal;
  }
}

export default ReferenceAdapter;
