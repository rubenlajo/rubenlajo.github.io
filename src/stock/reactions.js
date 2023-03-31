import { successType, failureType } from "amiga-core/application/actions";
import { intl } from "amiga-core/components/i18n";

import { addNotification } from "application/actions";

import * as warehouseMovementActionTypes from "./actions/warehouse-movements/actionTypes";
import * as purchaseOrderActionTypes from "./actions/orders/actionTypes";
import * as referencesActionTypes from "./actions/references/actionTypes";
import * as locationsActionTypes from "./actions/locations/actionTypes";
import * as pdaActionTypes from "./actions/pda/actionTypes";

const reactions = [
  {
    match: successType(warehouseMovementActionTypes.STOCK_WAREHOUSEMOVEMENTS_ASSIGN_ORDER_OPERATOR),
    reaction: ({ payload }) => {
      if (!payload.response.hasError) {
        if (payload.pendingOrders === 1 && !payload.reasign) {
          //cuando se asigna la ultima orden que faltaba
          return addNotification({
            type: "success",
            fadeout: true,
            title: intl.formatMessage({ id: "stock.assign-page.assign-all.ok.title" }),
            content: intl.formatMessage({ id: "stock.assign-page.assign-all.ok.content" }),
          });
        } else {
          return addNotification({
            type: "success",
            fadeout: true,
            title: intl.formatMessage(
              { id: "stock.reactions.assign.ok.title" },
              {
                warehouseMovementTypeName: payload.type,
                reasigned: payload.reasign ? "re" : "",
              }
            ),
            content: intl.formatMessage(
              { id: "stock.reactions.assign.ok.content" },
              { reasigned: payload.reasign ? "re" : "" }
            ),
          });
        }
      }
    },
  },
  {
    match: successType(
      warehouseMovementActionTypes.STOCK_WAREHOSUEMOVEMENTS_CREATE_MATERIAL_TRASPASE
    ),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.transpase.ok.title" }),
          content: intl.formatMessage({ id: "stock.reactions.transpase.ok.content" }),
        });
      }
    },
  },
  {
    match: successType(
      warehouseMovementActionTypes.STOCK_WAREHOUSEMOVMEMENTS_UPDATE_WAREHOUSE_MOVEMENT
    ),
    reaction: ({ payload }) => {
      if (!payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.transpase-edit.ok.title" }),
          content: intl.formatMessage({ id: "stock.reactions.transpase-edit.ok.content" }),
        });
      }
    },
  },
  {
    match: successType(warehouseMovementActionTypes.STOCK_WAREHOUSEMOVEMENTS_REMOVE),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title:
            action.payload.listId.length === 1
              ? intl.formatMessage({
                  id: "stock.reactions.warehouse.movemement-delete.single.ok.title",
                })
              : intl
                  .formatMessage({
                    id: "stock.reactions.warehouse.movemement-delete.multiple.ok.title",
                  })
                  .replace("XnumberX", action.payload.listId.length),
          content:
            action.payload.listId.length === 1
              ? intl
                  .formatMessage({
                    id: "stock.reactions.warehouse.movemement-delete.single.ok.content",
                  })
                  .replace("XwarehouseMovementIdX", action.payload.listId[0])
              : intl
                  .formatMessage({
                    id: "stock.reactions.warehouse.movemement-delete.multiple.ok.content",
                  })
                  .replace("XwarehouseMovementIdsX", action.payload.listId.join(", ")),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_SYNCSFI_PURCHASE_ORDER),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl
            .formatMessage({ id: "stock.reactions.purchaseOrder.sync.title" })
            .replace("XorderIdX", action.payload.purchaseOrderId),
          content: intl.formatMessage({ id: "stock.reactions.purchaseOrder.sync.content" }),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_SYNCSFI_PURCHASE_ORDERS),
    reaction: action => {
      const errors = action.payload.response.filter(r => r.hasError);
      if (errors.length === 0) {
        let title = "";
        let content = "";
        const orderIds = action.payload.purchaseOrderIds.join(", ");

        if (action.payload.purchaseOrderIds.length > 1) {
          title = intl
            .formatMessage({ id: "stock.reactions.purchaseOrder.multiple-sync.title" })
            .replace("XorderIdsX", orderIds);
          content = intl.formatMessage({
            id: "stock.reactions.purchaseOrder.multiple-sync.content",
          });
        } else {
          title = intl
            .formatMessage({ id: "stock.reactions.purchaseOrder.single-sync.title" })
            .replace("XorderIdsX", orderIds);
          content = intl.formatMessage({ id: "stock.reactions.purchaseOrder.single-sync.content" });
        }

        return addNotification({
          type: "success",
          fadeout: true,
          title,
          content,
        });
      } else {
        return addNotification({
          type: "error",
          title: "Error",
          content: errors.map(e => e.error).join(", "),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_LAUNCH_PURCHASE_ORDER),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl
            .formatMessage({ id: "stock.reactions.purchaseOrder.single-launch.title" })
            .replace("XorderIdX", action.payload.purchaseOrderId),
          content: intl.formatMessage({
            id: "stock.reactions.purchaseOrder.single-launch.content",
          }),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_LAUNCH_PURCHASE_ORDERS),
    reaction: action => {
      const ids = action.payload.purchaseOrderIds.join(", ");
      const multiple = action.payload.purchaseOrderIds.length > 1;
      if (!action.payload.response.some(res => res.hasError)) {
        const title = multiple
          ? intl
              .formatMessage({ id: "stock.reactions.purchaseOrder.multiple-launch.title" })
              .replace("XorderIdsX", ids)
          : intl
              .formatMessage({ id: "stock.reactions.purchaseOrder.single-launch.title" })
              .replace("XorderIdX", ids);
        const content = multiple
          ? intl.formatMessage({ id: "stock.reactions.purchaseOrder.multiple-launch.content" })
          : intl.formatMessage({ id: "stock.reactions.purchaseOrder.single-launch.content" });

        return addNotification({
          type: "success",
          fadeout: true,
          title,
          content,
        });
      } else {
        const title = multiple
          ? intl
              .formatMessage({ id: "stock.reactions.purchaseOrder.multiple-launch.error.title" })
              .replace("XorderIdsX", ids)
          : intl
              .formatMessage({ id: "stock.reactions.purchaseOrder.single-launch.error.title" })
              .replace("XorderIdX", ids);
        const content = multiple
          ? intl.formatMessage({
              id: "stock.reactions.purchaseOrder.multiple-launch.error.content",
            })
          : intl.formatMessage({ id: "stock.reactions.purchaseOrder.single-launch.error.content" });
        return addNotification({
          type: "error",
          fadeout: true,
          title,
          content,
        });
      }
    },
  },
  {
    match: successType(referencesActionTypes.STOCK_REFERENCES_SAVE_REFERENCE),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.reference.saved.title" }),
          content: intl.formatMessage({ id: "stock.reactions.reference.saved.content" }),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_CREATE_PURCHASE_ORDER),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.orders.saved.title" }),
          content: intl.formatMessage({ id: "stock.reactions.orders.saved.content" }),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_CREATE_AND_LAUNCH_PURCHASE_ORDER),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.orders.saved-and-launch.title" }),
          content: intl.formatMessage({ id: "stock.reactions.orders.saved-and-launch.content" }),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_DELETE_PURCHASE_ORDER),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.orders.deleted.title" }),
          content: intl
            .formatMessage({ id: "stock.reactions.orders.deleted.content" })
            .replace("XorderIdX", action.payload.purchaseOrderId),
        });
      }
    },
  },
  {
    match: successType(purchaseOrderActionTypes.STOCK_ORDERS_REMOVE_ORDER),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.orders.deleted.title" }),
          content: intl
            .formatMessage({ id: "stock.reactions.orders.deleted.content" })
            .replace("XorderIdX", action.payload.purchaseOrderId),
        });
      }
    },
  },
  {
    match: successType(locationsActionTypes.STOCK_LOCATIONS_POST_INVENTORIES),
    reaction: action => {
      if (!action.payload.response.hasError) {
        if (action.payload.locationsList.length > 1) {
          return addNotification({
            type: "success",
            fadeout: true,
            title: intl.formatMessage({
              id: "stock.reactions.locations.inventories.success.title.plural",
            }),
            content: intl.formatMessage({
              id: "stock.reactions.locations.inventories.success.content.plural",
            }),
          });
        }
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({
            id: "stock.reactions.locations.inventories.success.title.singular",
          }),
          content: intl.formatMessage({
            id: "stock.reactions.locations.inventories.success.content.singular",
          }),
        });
      }
    },
  },
  {
    match: successType(referencesActionTypes.STOCK_REFERENCES_INVENTORY),
    reaction: action => {
      if (!action.payload.response.hasError) {
        if (action.payload.materialsList.length > 1) {
          return addNotification({
            type: "success",
            fadeout: true,
            title: intl.formatMessage({
              id: "stock.reactions.locations.inventories.success.title.plural",
            }),
            content: intl.formatMessage({
              id: "stock.reactions.locations.inventories.success.content.plural",
            }),
          });
        }
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({
            id: "stock.reactions.locations.inventories.success.title.singular",
          }),
          content: intl.formatMessage({
            id: "stock.reactions.locations.inventories.success.content.singular",
          }),
        });
      }
    },
  },
  {
    match: successType(referencesActionTypes.STOCK_REFERENCES_INVENTORY),
    reaction: action => {
      if (!action.payload.response.error) {
        if (action.payload.materialsList.length > 1) {
          return addNotification({
            type: "success",
            title: intl.formatMessage({
              id: "stock.reactions.locations.inventories.success.title.plural",
            }),
            content: intl.formatMessage({
              id: "stock.reactions.locations.inventories.success.content.plural",
            }),
          });
        }
        return addNotification({
          type: "success",
          title: intl.formatMessage({
            id: "stock.reactions.locations.inventories.success.title.singular",
          }),
          content: intl.formatMessage({
            id: "stock.reactions.locations.inventories.success.content.singular",
          }),
        });
      }
    },
  },
  {
    match: successType(locationsActionTypes.STOCK_LOCATIONS_REMOVE),
    reaction: action => {
      if (!action.payload.response.hasError) {
        return addNotification({
          type: "success",
          fadeout: true,
          title:
            action.payload.locationsList.length > 1
              ? intl.formatMessage({ id: "stock.reactions.locations.deleted.title.multi" })
              : intl.formatMessage({ id: "stock.reactions.locations.deleted.title" }),
          content:
            action.payload.locationsList.length > 1
              ? intl
                  .formatMessage({ id: "stock.reactions.locations.deleted.content.multi" })
                  .replace(
                    "XlocationIdsX",
                    action.payload.locationsList.map(l => l.locationName).join(", ")
                  )
              : intl
                  .formatMessage({ id: "stock.reactions.locations.deleted.content" })
                  .replace(
                    "XlocationIdX",
                    action.payload.locationsList.map(l => l.locationName).join(", ")
                  ),
        });
      }
    },
  },
  {
    match: successType(locationsActionTypes.STOCK_LOCATIONS_CREATE_LOCATION),
    reaction: action => {
      if (!action.payload.response.hasError) {
        const location = action.payload.locationName;
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.locations.created.title" }),
          content: intl
            .formatMessage({ id: "stock.reactions.locations.created.content" })
            .replace("XlocationX", location),
        });
      }
    },
  },
  {
    match: successType(locationsActionTypes.STOCK_LOCATIONS_SAVE_LOCATION),
    reaction: action => {
      if (!action.payload.response.hasError) {
        const location = action.payload.locationName;
        return addNotification({
          type: "success",
          fadeout: true,
          title: intl.formatMessage({ id: "stock.reactions.locations.updated.title" }),
          content: intl
            .formatMessage({ id: "stock.reactions.locations.updated.content" })
            .replace("XlocationX", location),
        });
      }
    },
  },
  {
    match: successType(pdaActionTypes.STOCK_PDA_ASSIGN_WAREHOUSE_MOVEMENT),
    reaction: action => {
      if (!action.payload.response.hasError) {
        const warehouseMovementId = action.payload.warehouseMovementId;
        const warehouseMovementTypeName = action.payload.warehouseMovementTypeName;
        return addNotification({
          type: "success",
          fadeout: true,
          content: intl
            .formatMessage({ id: "stock.reactions.pda.assigned.content" })
            .replace("XwarehouseMovementTypeNameX", warehouseMovementTypeName)
            .replace("XwarehouseMovementIdX", warehouseMovementId),
        });
      }
    },
  },
  {
    match: successType(pdaActionTypes.STOCK_PDA_UPDATE_WAREHOUSE_MOVEMENT_STATUS),
    reaction: action => {
      if (!action.payload.response.hasError) {
        const warehouseMovementId = action.payload.warehouseMovementId;
        const warehouseMovementTypeName = action.payload.warehouseMovementTypeName;
        const warehouseMovementStatusName =
          action.payload.warehouseMovementsStatus.warehouseMovementStatusName;

        return addNotification({
          type: "success",
          fadeout: true,
          content: intl
            .formatMessage({ id: "stock.reactions.pda.update-status.content" })
            .replace("XwarehouseMovementTypeNameX", warehouseMovementTypeName)
            .replace("XwarehouseMovementIdX", warehouseMovementId)
            .replace("XwarehouseMovementStatusNameX", warehouseMovementStatusName),
        });
      }
    },
  },
  {
    match: successType(pdaActionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_FREEENTRY),
    reaction: action => {
      if (!action.payload.response.hasError) {
        const materialId = action.payload.materialId;
        const warehouseMovementId =
          action.payload.response.warehouseMovements[0].warehouseMovementId;
        return addNotification({
          type: "success",
          fadeout: true,
          content: intl
            .formatMessage({ id: "stock.reactions.pda.wm.create-free-entry.content" })
            .replace("XmaterialIdX", materialId)
            .replace("XwarehouseMovementIdX", warehouseMovementId),
        });
      }
    },
  },
  {
    match: failureType(pdaActionTypes.STOCK_PDA_INVENTORY_LOCATION_SCAN_REF),
    reaction: ({ payload }) => {
      return addNotification({
        type: "error",
        fadeout: true,
        content: intl
          .formatMessage({ id: "stock.reactions.pda.reference-scan-error" })
          .replace("XbarcodeX", payload.barcode),
      });
    },
  },
  {
    match: failureType(pdaActionTypes.STOCK_PDA_INVENTORY_MATERIAL_SCAN_LOC),
    reaction: ({ payload }) => {
      return addNotification({
        type: "error",
        fadeout: true,
        content: intl
          .formatMessage({ id: "stock.reactions.pda.location-scan-error" })
          .replace("XbarcodeX", payload.barcode),
      });
    },
  },
  {
    match: successType(pdaActionTypes.STOCK_PDA_TRANSFER_EXEC),
    reaction: ({ payload }) => {
      if (!payload.response.error) {
        return addNotification({
          type: "success",
          fadeout: true,
          content: intl.formatMessage(
            { id: "stock.reactions.pda.location-transfer-ok" },
            {
              materialId: payload.extraData.material,
              targetLocation: payload.extraData.location,
            }
          ),
        });
      }
    },
  },
  {
    match: successType(pdaActionTypes.STOCK_PDA_EXEC_INVENTARY_REFERENCE_IN_LOCATION),
    reaction: ({ payload }) => {
      if (!payload.response.error) {
        return addNotification({
          type: "success",
          fadeout: true,
          content: payload.extradata.location
            ? intl.formatMessage(
                { id: "stock.reactions.pda.invetary-reference-in-location-ok" },
                {
                  reference: payload.extradata.material,
                  location: payload.extradata.location,
                }
              )
            : intl.formatMessage(
                { id: "stock.reactions.pda.invetary-reference-ok" },
                {
                  reference: payload.extradata.material,
                }
              ),
        });
      }
    },
  },
  {
    match: pdaActionTypes.STOCK_PDA_SET_SHOW_SCAN_ERROR,
    reaction: () =>
      addNotification({
        type: "error",
        fadeout: true,
        content: intl.formatMessage({ id: "stock.reactions.pda.dashboard.scan-error" }),
      }),
  },
  {
    match: successType(referencesActionTypes.STOCK_REFERENCES_CREATE_REFERENCE),
    reaction: ({ payload }) => {
      if (payload.response.data && payload.response.data.length === 0) {
        return addNotification({
          type: "error",
          fadeout: true,
          title: "Error",
          content: intl.formatMessage(
            { id: "stock.reactions.references.create-reference-error" },
            { manufacturerReference: payload.manufacturerRef }
          ),
        });
      }
    },
  },
];

export default reactions;
