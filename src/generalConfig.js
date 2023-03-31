import builder from "@rsql/builder";
import { emit } from "@rsql/emitter";
import { moment } from "amiga-core/application/i18n/moment";
import { intl } from "amiga-core/components/i18n";
import PERMISSION from "./PERMISSIONS.json";
import { getIMMSURL } from "./utils/";
import { isAuthorized } from "./utils/permissions";

/** ******************************************************************
 *  Archivo de configuración para introducir elementos comunes a    *
 *  varias pantallas de la app y tenerlos todos en un mismo sitio   *
 *  por si hay que cambiarlos de forma rápida                       *
 *                                                                  *
 *  Para usarlo solo hay que importar la propiedad deseada asi:     *
 *  import { xxx } from "@/generalConfig";                          *
 ********************************************************************/

/**
 * Nombre de la app en la cabecera
 */
export const headerLabel = "IM";

/**
 * COOKIES
 */
export const IMMS_WAREHOUSE = "imms_warehouse";
export const IMMS_WAREHOUSE_LOGISTIC_AREA = "imms_idLogisticAreaCompanyId";

/**
 * Configuración general para los paginated grid
 */
// Número de elementos por página disponibles
export const availablePageSizes = [10, 25, 50, 100];
export const pageSize = 25;

// Página por defecto cargada al inicio en las tablas
export const defaultFirstPage = 1;

// Tipos de errores de api
export const NOTIFICATION_TYPE = {
  INFO: "info",
  ERROR: "error",
  SUCCESS: "success",
};

// Tiempo (en segundos) que las notificaciones se mantienen visibles antes de desaparecer
export const NOTIFICATIONS_DELAY = 15;

// Deshabilitar mensage de error generico para las peticiones con siguiente errorCode
export const errorModalDisabledCodes = [];

// Formato de fechas para librería moment
export const dateTimeFormat = "DD/MM/YYYY HH:mm";
export const dateTimeFormatEN = "MM/DD/YYYY HH:mm";
export const dateTimeFormatDetail = "DD/MM/YYYY HH:mm:ss";
export const dateTimeFormatDetailEN = "YYYY-MM-DD HH:mm:ss";
export const dateFormat = "DD/MM/YYYY";
export const dateFormatEN = "MM/DD/YYYY";
export const timeFormat = "HH:mm";
export const utcDateTimeFormat = "DD MMM YYYY HH:mm";
export const dateTimeFormatBack = "YYYY-MM-DDTHH:mm";
export const unixTimestampFormat = "x";
export const compDateTimeFormat = "DD/MM/YYYY HH:mm";
export const compDateTimeFormatEN = "MM/DD/YYYY HH:mm";
export const formatISO8601 = moment.ISO_8601;
export const maskISO8601 = "2099-99-99T99:99Z";
export const urlDate = "YYYY-MM-DD";
export const emptyDate = "--/--/----";

export const MILISECONDS_IN_ONE_DAY = 86400000;

export const breachTimes = () => [
  {
    label: intl.formatMessage({ id: "expired" }),
    value: emit(builder.lt("breachTimeMinutes", 0)),
  },
  {
    label: intl.formatMessage({ id: "24hours" }),
    value: emit(
      builder.and(builder.gt("breachTimeMinutes", 0), builder.le("breachTimeMinutes", `${24 * 60}`))
    ),
  },
  {
    label: intl.formatMessage({ id: "48hours" }),
    value: emit(
      builder.and(builder.gt("breachTimeMinutes", 0), builder.le("breachTimeMinutes", `${48 * 60}`))
    ),
  },
  {
    label: intl.formatMessage({ id: "7days" }),
    value: emit(
      builder.and(
        builder.gt("breachTimeMinutes", 0),
        builder.le("breachTimeMinutes", `${7 * 24 * 60}`)
      )
    ),
  },
  {
    label: intl.formatMessage({ id: "14days" }),
    value: emit(
      builder.and(
        builder.gt("breachTimeMinutes", 0),
        builder.le("breachTimeMinutes", `${14 * 24 * 60}`)
      )
    ),
  },
  {
    label: intl.formatMessage({ id: "28days" }),
    value: emit(
      builder.and(
        builder.gt("breachTimeMinutes", 0),
        builder.le("breachTimeMinutes", `${28 * 24 * 60}`)
      )
    ),
  },
  {
    label: intl.formatMessage({ id: "mt28days" }),
    value: emit(builder.gt("breachTimeMinutes", `${28 * 24 * 60}`)),
  },
];

export const formatBreachTimeDurationDDHHMM = breachTimeMinutes => {
  var days = Math.trunc(breachTimeMinutes / 1440); //dias 1440 es 24*60
  var hours = Math.trunc(breachTimeMinutes / 60); // horas
  var minutes = breachTimeMinutes; // minutos

  var formattedParts = [];

  if (Math.abs(days) >= 1) {
    formattedParts.push(days + "d");
  }
  if (hours < 0 && !days) {
    hours = hours - 24 * days; // restar los días enteros
    formattedParts.push("-" + Math.abs(hours) + "h");
  } else if (hours < 0) {
    hours = hours - 24 * days; // restar los días enteros
    formattedParts.push(Math.abs(hours) + "h");
  } else {
    hours = hours - 24 * days; // restar los días enteros
    if (hours > 0) formattedParts.push(Math.abs(hours) + "h");
  }

  if (breachTimeMinutes < 0 && !days && !hours) {
    minutes = minutes - days * 1440 - hours * 60;
    formattedParts.push("-" + Math.abs(minutes) + "m");
  } else {
    minutes = minutes - days * 1440 - hours * 60;
    if (minutes < 0) {
      formattedParts.push(Math.abs(minutes) + "m");
    } else {
      formattedParts.push(Math.abs(minutes) + "m");
    }
  }

  return formattedParts.length == 0 ? "0" : formattedParts.join(" ");
};

/**
 * Endpoints
 */
export const endpoints = {
  credentials: ":apiPath/credentials",
  csrftoken: ":apiPath/newCsrf",
  logout: "api/logout",
  centers: ":apiPath/centers",
  center: ":immsotraPath/v1/centers/:centerId",
  appMetadata: ":apiPath/appmetadata",
  materials: ":immspddsPath/v1/centers/:centerId/materials",
  material: ":immspddsPath/v1/centers/:centerId/materials/:materialId",
  materialsExport: ":immspddsPath/v1/centers/:centerId/materials/export",
  materialDetail: ":immspddsPath/v1/centers/:centerId/materials/:materialId/detail",
  materialDetailBarcode: ":immspddsPath/v1/centers/:centerId/materials/detail",
  materialSummary: ":immspddsPath/v2/centers/:centerId/materials/:materialId/summary",
  materialMovements: ":immspddsPath/v1/centers/:centerId/materials/:materialId/movements",
  materialElements: ":immspddsPath/v1/centers/:centerId/materials/:materialId/elements",
  materialLocations: ":immspddsPath/v1/centers/:centerId/materials/:materialId/locations",
  materialUsages: ":immspddsPath/v1/centers/:centerId/materials/:materialId/usages",
  materialDates: ":immspddsPath/v1/centers/:centerId/materials/:materialId/dates",
  materialManufacturers: ":immspddsPath/v1/manufacturers",
  materialManufacturer: ":immspddsPath/v1/manufacturers/:manufacturerId",
  purchaseOrders: ":immspddsPath/v1/centers/:centerId/purchase-orders",
  purchaseOrder: ":immspddsPath/v1/centers/:centerId/purchase-orders/:purchaseOrderId",
  purchaseOrdersExport: ":immspddsPath/v1/centers/:centerId/purchase-orders/export",
  purchaseOrdersStatus: ":immspddsPath/v1/purchase-order-status",
  purchaseOrderLaunch:
    ":immspddsPath/v1/centers/:centerId/purchase-orders/:purchaseOrderId/launch-order-sfi",
  purchaseOrderReferences:
    ":immspddsPath/v1/centers/:centerId/purchase-orders/:purchaseOrderId/references",
  purchaseOrderSfiSyncro: ":immspddsPath/v1/purchase-orders/sfi-syncro",
  purchaseLocations: ":immspddsPath/v1/centers/:centerId/purchase-locations",
  materialPurchases: ":immspddsPath/v1/centers/:centerId/material-purchases",
  materialPurchaseLineReceive:
    ":immspddsPath/v1/centers/:centerId/purchase-orders/:purchaseOrderId/lines/:lineId/receive",
  suppliers: ":immspddsPath/v1/centers/:centerId/purchase-orders/suppliers",
  supplier: ":immspddsPath/v1/centers/:centerId/purchase-orders/suppliers/:supplierId",
  materialClasifications: ":immspddsPath/v1/material-classifications",
  stockStatus: ":immspddsPath/v1/stock-status",
  sfiStatus: ":immspddsPath/v1/sfi-status",
  sfisyncro: ":immspddsPath/v1/centers/:centerId/purchase-orders/:purchaseOrderId/sfi-syncro",
  materialCriticalityType: ":immspddsPath/v1/criticality-types",
  measurementsUnit: ":immspddsPath/v1/measurement-units",
  userPhoto: ":apiPath/userphoto",
  materialPhoto: ":immspddsPath/v1/materials/:materialId/photo",
  materialThumbnail: ":immspddsPath/v1/materials/:materialId/thumbnail",
  userNames: ":apiPath/usernames",

  //IMMSSTOK
  locations: ":immsstokPath/v1/centers/:centerId/locations",
  locationsAvailable: ":immsstokPath/v1/centers/:centerId/locations/availables/:materialId",
  locationsExport: ":immsstokPath/v1/centers/:centerId/locations/export",
  location: ":immsstokPath/v1/centers/:centerId/locations/:locationId",
  locationDetailBarcode: ":immsstokPath/v1/centers/:centerId/locations/detail",
  locationsPatterns: ":immsstokPath/v1/centers/:centerId/locations/patterns",
  locationBehaviourTypes: ":immsstokPath/v1/location-behavior-types",
  locationMaterials: ":immsstokPath/v1/centers/:centerId/locations/:locationId/references",
  locationLastInventoryStatus: ":immsstokPath/v1/location-inventory-status",
  sparePartsWarehouses: ":immsstokPath/v1/centers/:centerId/spare-parts-warehouses",
  warehouseMovementAssignements:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/assignment",
  warehouseMovements: ":immsstokPath/v1/centers/:centerId/warehouse-movements",
  warehouseMovementsExport: ":immsstokPath/v1/centers/:centerId/warehouse-movements/export",
  warehouseMovement: ":immsstokPath/v1/centers/:centerId/warehouse-movements/:warehouseMovementId",
  warehouseMovementInventories:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/:warehouseMovementId/inventories",
  warehouseMovementTransfer:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/:warehouseMovementId/transfer",
  warehouseMovementReferences:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/:warehouseMovementId/references",
  warehouseMovementLocations:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/:warehouseMovementId/locations",
  warehouseMovementTypes: ":immsstokPath/v1/warehouse-movement-types",
  warehouseMovementStatus: ":immsstokPath/v1/warehouse-movement-status",
  warehouseMovementTechnicians:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/technnicians",
  warehouseMovementTechniciansAssign:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/:warehouseMovementId/assignment",
  warehouseMovementChangeStatus:
    ":immsstokPath/v1/centers/:centerId/warehouse-movements/:warehouseMovementId/change-status",

  //IMMSRPRT
  hoursAndSpareParesByElement: ":immsrprtPath/v1/report/hoursAndSpareParesByElement",
  sparePartsByElement: ":immsrprtPath/v1/report/sparesByElement/summary",
  hoursByElement: ":immsrprtPath/v1/report/hoursByElement/summary",
  stockMovements: ":immsrprtPath/v1/reports/centers/:centerId/material-movements",
  stockMovementsExport: ":immsrprtPath/v1/reports/centers/:centerId/material-movements/export",

  //IMMSOTRA
  workOrders: ":immsotraPath/v1/centers/:centerId/work-orders",
  workOrdersExport: ":immsotraPath/v1/centers/:centerId/work-orders/export",
  workOrderDetail: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId",
  workOrderFinalize: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/finalize",
  workOrderTechnicianDetail:
    ":immsotraPath/v1/centers/:centerId/work-orders/technicians/:technicianId",
  workOrderDetailActivities:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities",
  workOrderDetailActivitiesExport:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/export",
  workOrderDetailActivity:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/:activityId",
  workOrderWorkProcedures:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/work-procedures",
  workOrderDetailElements:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/:activityId/elements",
  workOrderReasonChangeState: ":immsotraPath/v1/work-order-reason-change-state",
  workOrderChangeStatus:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/change-status",
  workOrderUpdateWorkOrder: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId",
  workOrderElements: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/elements",
  workOrderElement:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/elements/:physicalElementId",
  centerDocuments: ":immsotraPath/v1/centers/:centerId/documents",
  workOrderDocuments: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/documents",
  workOrderDocumentDetail:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/documents/:documentId",
  workOrderHistory: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/history",
  workOrderHistoryExport:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/history/export",
  workOrderComments: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/comments",
  workOrderComment:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/comments/:commentId",
  workOrderMaterials: ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/materials",
  workOrderSparePartAssign:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/spare-parts/assign",
  workOrderPhysicalElementId:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/elements/:physicalElementId",
  workOrderActivityStatusChange:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/:activityId/change-status",
  workOrderActivityElements:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/:activityId/elements",
  workOrderActivityElementsFinish:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/:activityId/elements/finish",
  workOrderActivityComments:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/:activityId/comments",
  workOrderActivityComment:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/activities/:activityId/comments/:commentId",
  workOrderTypes: ":immsotraPath/v1/work-order-types",
  workOrderSubTypes: ":immsotraPath/v1/work-order-subtypes",
  workOrderStatus: ":immsotraPath/v1/work-order-status",
  workOrderSeverity: ":immsotraPath/v1/severity-types",
  elementTypes: ":immsotraPath/v1/element-types",
  workOrderImpedimentTypes: ":immsotraPath/v1/work-order-impediment-types",
  workOrderPriority: ":immsotraPath/v1/priority-types",
  workOrderCriticality: ":immspddsPath/v1/criticality-types",
  workOrderTechnicians: ":immsotraPath/v1/centers/:centerId/work-orders/technicians",
  workOrderZones: ":immsotraPath/v1/centers/:centerId/zones",
  workOrderCauseTypes: ":immsotraPath/v1/work-order-cause-types",
  createWorkOrder: ":immsotraPath/v1/centers/:centerId/elements/:physicalElementId/new-work-order",
  workOrderActivityStatus: ":immsotraPath/v1/work-order-activity-status",
  workOrderAssign: ":immsotraPath/v1/centers/:centerId/work-orders/assign",
  workOrderQualityControlPercent:
    ":immsotraPath/v1/centers/:centerId/work-orders/technical-managers/quality-control-percent",
  workOrderProgressStatusUrlEndpoint:
    ":immsotraPath/v1/centers/:centerId/work-orders/:workOrderId/progress-status",

  //providers
  workOrderServiceProviders: ":immsotraPath/v1/centers/:centerId/service-providers",

  //physicalElements
  physicalElements: ":immsotraPath/v1/centers/:centerId/physical-elements/summary",
  physicalElement:
    ":immsotraPath/v1/centers/:centerId/physical-elements/:physicalElementId/summary/",
  physiscalElementMaterials:
    ":immsotraPath/v1/centers/:centerId/physical-elements/:physicalElementId/materials",
  physicalElementComments:
    ":immsotraPath/v1/centers/:centerId/physical-elements/:physicalElementId/comments",

  //routes
  routeComments: ":immsotraPath/v1/centers/:centerId/routes/:routeId/comments",
  routeMaterials: ":immsotraPath/v1/centers/:centerId/routes/:routeId/materials",
  routes: ":immsotraPath/v1/centers/:centerId/routes/summary",

  //IMMSWORKSHIFTS
  workShifts: ":immsotraPath/v1/centers/:centerId/shifts",
  workShfitTechnicians: ":immsotraPath/v1/centers/:centerId/shifts/shift-planning/technicians",

  //IMMSWORKPLANS
  workPlans: ":immsotraPath/v1/centers/:centerId/work-plans/summary",

  //IMMSACTIVITIES
  activities: ":immsotraPath/v1/activities",

  //IMMSPREVENTIVERANGES
  preventiveRanges: ":immsotraPath/v1/centers/:centerId/preventive-ranges/summary",

  //DOCUMENTS
  document: ":immsotraPath/v1/centers/:centerId/documents/:documentId/download",
  documentThumbnail: ":immsotraPath/v1/centers/:centerId/documents/:documentId/download-thumbnail",
};

const DEVICE = {
  DESKTOP: "desktop",
  MOBILE: "mobile",
};

export const BACK_URL_PARAM_NAME = "backurl";

/**
 * Función que devuelve el menú para el usuario
 * @param {array de roles de usuario} userRoles
 */
export const getMenu = (userRoles, devices) => {
  let currentDevice = "desktop";
  Object.keys(devices).forEach(device => {
    if (devices[device]) {
      currentDevice = device;
    }
  });

  const menu = [];

  if (currentDevice === DEVICE.MOBILE && isAuthorized(userRoles, [PERMISSION.STOCK_READ])) {
    menu.push({
      to: "/stock/pda/dashboard",
      label: intl.formatMessage({ id: "application.menu.stock-mobile" }),
      icon: "sga-icon-tools",
    });
  }

  //----- end stock -----

  return menu;
};
