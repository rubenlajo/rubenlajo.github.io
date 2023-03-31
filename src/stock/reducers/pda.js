import { successType, requestType, failureType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/pda/actionTypes";
import * as locationActionTypes from "../actions/locations/actionTypes";

const initialState = {
  dashboard: {
    showScanError: false,
    materialFailed: false,
    locationFailed: false,
  },
  assignedWorkOrders: 0,
  totalWorkOrders: 0,
  purchaseOrders: 0,
  warehouseMovements: {
    list: [],
    haveMore: true,
  },
  warehouseMovementsStatus: [],
  warehouseMovement: null,
  changeStatusTriggered: false,
  foceUpdateMovement: 0,
  warehouseMovementReferences: {
    list: [],
    offset: 0,
    limit: 100,
    haveMore: true,
    fetching: false,
  },
  warehouseMovementLocations: {
    list: [],
    offset: 0,
    limit: 100,
    haveMore: true,
    fetching: false,
  },
  lastBarcodeScan: null,
  fetchingMaterialByBarcode: false,
  material: null,
  materials: [],
  location: null,
  redirect: false,
  redirectToExec: false,
  technicians: {
    list: [],
    fetching: false,
    requestDone: false,
  },
  createdWarehouseMovement: null,
  locationMaterials: {
    list: [],
    offset: 0,
    limit: 100,
    haveMore: true,
    fetching: false,
  },
  materialLocations: {
    list: [],
    offset: 0,
    limit: 100,
    haveMore: true,
    fetching: false,
  },
  locationEditing: null,
  materialEditing: null,
  freeEntry: {
    error: false,
    scannedLocation: null,
    targetLocation: null,
  },
  inventoryLocationExec: {
    scannedMaterials: [],
    scannedMaterial: null,
    update: 0,
  },
  inventoryMaterialExec: {
    scannedLocation: null,
    update: 0,
  },
  transferStart: false,
  transferLocationExec: {
    materials: [],
    material: null,
    transferUnitsMax: 0,
    transferUnits: 0,
    targetLocation: null,
    error: false,
  },
  transferMaterialExec: {
    sourceLocation: null,
    transferUnitsMax: 0,
    transferUnits: 0,
    targetLocation: null,
    error: false,
  },
  availableLocations: {
    location: null,
    offset: 0,
    limit: 1,
    hasMore: true,
    fetching: false,
  },
};

function pda(state = initialState, { type, payload }) {
  switch (type) {
    case successType(actionTypes.STOCK_PDA_FETCH_MATERIAL):
      return {
        ...state,
        redirect: false,
        redirectToExec: false,
        material: {
          ...payload.response,
          locations: [],
          locationsFetching: false,
          hasMore: true,
          filters: {
            offset: 0,
            limit: 100,
          },
        },
        materials: [],
        location: null,
        locationEditing: null,
        locationMaterials: initialState.locationMaterials,
        availableLocations: initialState.availableLocations,
        freeEntry: initialState.freeEntry,
        changeStatusTriggered: false,
      };

    case requestType(actionTypes.STOCK_PDA_FETCH_MATERIAL_LOCATIONS):
      return {
        ...state,
        redirect: false,
        redirectToExec: false,
        material: {
          ...state.material,
          locationsFetching: true,
        },
        materialLocations: {
          ...state.materialLocations,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_PDA_FETCH_MATERIAL_LOCATIONS):
      if (payload.response.hasError) {
        return {
          ...state,
          material: {
            ...state.material,
            locationsFetching: false,
            locations: [],
          },
          materialLocations: {
            ...state.materialLocations,
            fetching: false,
            haveMore: false,
          },
        };
      }

      const newLocationsList =
        payload.filters.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.materialLocations.list, ...payload.response.data];

      const hasMore =
        payload.response.metadata.itemsTotal > newLocationsList.length && payload.response.data.length > 0;

      return {
        ...state,
        material: {
          ...state.material,
          locationsFetching: false,
          locations: newLocationsList.map((location) => ({ ...location, unitsToTraspase: location.stock })),
          filters: payload.filters,
          hasMore,
        },
        materialLocations: {
          list: newLocationsList,
          offset: payload.filters.offset + payload.filters.limit,
          limit: payload.filters.limit,
          haveMore: hasMore,
          fetching: false,
        },
        createdWarehouseMovement: null,
      };

    case requestType(actionTypes.STOCK_PDA_CHECK_BARCODE_MATERIAL):
      return { ...state, fetchingMaterialByBarcode: true };

    case failureType(actionTypes.STOCK_PDA_CHECK_BARCODE_MATERIAL):
      return {
        ...state,
        fetchingMaterialByBarcode: false,
        dashboard: {
          ...state.dashboard,
          materialFailed: true,
        },
      };

    case successType(actionTypes.STOCK_PDA_CHECK_BARCODE_MATERIAL):
      if (payload.response.hasError) {
        return {
          ...state,
          fetchingMaterialByBarcode: false,
          dashboard: {
            ...state.dashboard,
            materialFailed: true,
          },
        };
      }

      return {
        ...state,
        lastBarcodeScan: payload.barcode,
        fetchingMaterialByBarcode: false,
        material: payload.response && payload.response.length === 1 ? { ...payload.response[0], locations: [] } : null,
        materials: payload.response.length > 1 ? payload.response : [],
        redirect: payload.redirect || false,
        location: null,
      };

    case successType(actionTypes.STOCK_PDA_FETCH_LOCATION):
      return {
        ...state,
        redirect: false,
        location: payload.response,
        material: null,
        materials: [],
        changeStatusTriggered: false,
      };

    case requestType(actionTypes.STOCK_PDA_CHECK_BARCODE_LOCATION):
      return { ...state, fetchingMaterialByBarcode: true };

    case failureType(actionTypes.STOCK_PDA_CHECK_BARCODE_LOCATION):
      return {
        ...state,
        fetchingMaterialByBarcode: false,
        dashboard: {
          ...state.dashboard,
          locationFailed: true,
        },
      };

    case successType(actionTypes.STOCK_PDA_CHECK_BARCODE_LOCATION):
      if (payload.response.hasError) {
        return {
          ...state,
          fetchingMaterialByBarcode: false,
          dashboard: {
            ...state.dashboard,
            locationFailed: true,
          },
        };
      }

      return {
        ...state,
        lastBarcodeScan: payload.barcode,
        fetchingMaterialByBarcode: false,
        location: payload.response,
        redirect: payload.redirect || false,
        material: null,
      };

    case actionTypes.STOCK_PDA_SET_SHOW_SCAN_ERROR:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          showScanError: payload,
          materialFailed: false,
          locationFailed: false,
        },
      };

    case actionTypes.STOCK_PDA_SET_REDIRECT:
      return {
        ...state,
        redirect: payload,
      };

    case successType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENTS):
      if (payload.response.hasError) {
        return {
          ...state,
          warehouseMovements: {
            ...state.warehouseMovements,
            haveMore: false,
          },
        };
      }

      const list =
        payload.filters.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.warehouseMovements.list, ...payload.response.data];

      const haveMore = payload.response.metadata.itemsTotal !== list.length && payload.response.data.length > 0;

      return {
        ...state,
        warehouseMovementReferences: initialState.warehouseMovementReferences,
        warehouseMovementLocations: initialState.warehouseMovementLocations,
        warehouseMovement: initialState.warehouseMovement,
        locationMaterials: initialState.locationMaterials,
        materialLocations: initialState.materialLocations,
        freeEntry: initialState.freeEntry,
        inventoryLocationExec: initialState.inventoryLocationExec,
        inventoryMaterialExec: initialState.inventoryMaterialExec,
        transferLocationExec: initialState.transferLocationExec,
        transferMaterialExec: initialState.transferMaterialExec,
        changeStatusTriggered: false,
        warehouseMovements: {
          list,
          haveMore,
        },
      };

    case successType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENTS_DASHBOARD):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        assignedWorkOrders: payload.response.assignedWarehouseMovements,
        totalWorkOrders: payload.response.unassignedWarehouseMovements,
        location: initialState.location,
        material: initialState.material,
        locationMaterials: initialState.locationMaterials,
        materialLocations: initialState.materialLocations,
        technicians: initialState.technicians,
        changeStatusTriggered: false,
        createdWarehouseMovement: initialState.createdWarehouseMovement,
        dashboard: initialState.dashboard,
        availableLocations: initialState.availableLocations,
      };

    case successType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT):
      if (payload.response.hasError) {
        return {
          ...state,
          whmovementcreated: false,
          redirect: false,
          createdWarehouseMovement: null,
        };
      }
      return {
        ...state,
        warehouseMovementReferences: initialState.warehouseMovementReferences,
        warehouseMovementLocations: initialState.warehouseMovementLocations,
        // locationMaterials: initialState.locationMaterials,
        // materialLocations: initialState.materialLocations,
        freeEntry: initialState.freeEntry,
        inventoryLocationExec: initialState.inventoryLocationExec,
        inventoryMaterialExec: initialState.inventoryMaterialExec,
        transferLocationExec: initialState.transferLocationExec,
        transferMaterialExec: initialState.transferMaterialExec,
        technicians: initialState.technicians,
        warehouseMovement: payload.response,
        whmovementcreated: false,
        redirect: false,
        createdWarehouseMovement: null,
      };

    case requestType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_TECHNICIANS):
      return {
        ...state,
        technicians: {
          list: [],
          fetching: true,
          requestDone: false,
        },
      };

    case successType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_TECHNICIANS):
      if (payload.response.hasError) {
        return {
          ...state,
          technicians: {
            list: [],
            fetching: false,
            requestDone: true,
          },
        };
      }

      return {
        ...state,
        technicians: {
          list: payload.response,
          fetching: false,
          requestDone: true,
        },
      };

    case actionTypes.STOCK_PDA_CLEAR_WAREHOUSE_MOVEMENT_TECHNICIANS:
      return {
        ...state,
        technicians: initialState.technicians,
      };

    case successType(actionTypes.STOCK_PDA_ASSIGN_WAREHOUSE_MOVEMENT):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        warehouseMovement: {
          ...state.warehouseMovement,
          assignedUsers: [
            {
              assignedUser: payload.assignUser,
              assignedDate: "",
            },
          ],
        },
        redirectToExec: payload.redirectToExec,
        technicians: initialState.technicians,
      };

    case actionTypes.STOCK_PDA_SET_REDIRECT_TO_EXEC:
      return {
        ...state,
        redirectToExec: payload,
      };

    case successType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENTS_STATUS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        warehouseMovementsStatus: payload.response,
      };

    case requestType(actionTypes.STOCK_PDA_UPDATE_WAREHOUSE_MOVEMENT_STATUS):
    case requestType(actionTypes.STOCK_PDA_UPDATE_WAREHOUSE_MOVEMENT_STATUS_NOTLOADING):
      return {
        ...state,
        changeStatusTriggered: true,
      };

    case successType(actionTypes.STOCK_PDA_UPDATE_WAREHOUSE_MOVEMENT_STATUS):
    case successType(actionTypes.STOCK_PDA_UPDATE_WAREHOUSE_MOVEMENT_STATUS_NOTLOADING):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        warehouseMovement: {
          ...state.warehouseMovement,
          warehouseMovementStatus: {
            warehouseMovementStatusId: payload.warehouseMovementsStatus.warehouseMovementStatusId,
            warehouseMovementStatusName: payload.warehouseMovementsStatus.warehouseMovementStatusName,
          },
        },
        changeStatusTriggered: true,
        redirect: payload.redirect,
      };

    case actionTypes.STOCK_PDA_RESET_WAREHOUSE_MOVEMENTS_STATUS_FLAG:
      return {
        ...state,
        changeStatusTriggered: false,
      };

    case successType(actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_INVENTARY_MATERIAL):
    case successType(actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_INVENTARY_LOCATION):
    case successType(actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER):
    case successType(actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_LOCATION):
    case successType(actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_FREEENTRY):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        createdWarehouseMovement: payload.response.warehouseMovements,
        availableLocations: initialState.availableLocations,
      };

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_LOCATION_EDITING:
      return {
        ...state,
        locationEditing: payload.location,
      };

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_REF_SET_UNITS:
      return {
        ...state,
        locationEditing: {
          ...state.locationEditing,
          unitsToTraspase: payload.units,
        },
      };

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_LOCATION_UNITS:
      const locationId = state.locationEditing.locationId;
      return {
        ...state,
        locationEditing: null,
        material: {
          ...state.material,
          locations: state.material.locations.map((location) => {
            if (location.locationId === locationId) {
              return {
                ...location,
                unitsToTraspase: payload.units,
              };
            } else {
              return location;
            }
          }),
        },
      };

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_REF_REMOVE_LOCATION:
      return {
        ...state,
        locationEditing: null,
        material: {
          ...state.material,
          locations: state.material.locations.filter((location) => location.locationId !== payload.locationId),
        },
      };

    case requestType(actionTypes.STOCK_PDA_WM_TRANSFER_FETCH_LOCATION_REFERENCES):
      return {
        ...state,
        locationMaterials: {
          ...state.locationMaterials,
          fetching: true,
        },
      };
    case successType(actionTypes.STOCK_PDA_WM_TRANSFER_FETCH_LOCATION_REFERENCES): {
      if (payload.response.hasError) {
        return {
          ...state,
          locationMaterials: {
            ...state.locationMaterials,
            fetching: false,
          },
          createdWarehouseMovement: null,
        };
      }

      const newLocationMaterialList =
        state.locationMaterials.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.locationMaterials.list, ...payload.response.data];

      const haveMoreRefs =
        newLocationMaterialList.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;

      return {
        ...state,
        locationMaterials: {
          ...state.locationMaterials,
          list: newLocationMaterialList.map((material) => ({
            ...material,
            unitsToTraspase: material.locationStock || 0,
          })),
          offset: state.locationMaterials.offset + state.locationMaterials.limit,
          haveMore: haveMoreRefs,
          fetching: false,
        },
        createdWarehouseMovement: null,
      };
    }

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_MATERIAL_EDITING:
      return {
        ...state,
        materialEditing: payload.material,
      };

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_SET_MATERIAL_UNITS:
      const materialId = state.materialEditing.materialId;
      return {
        ...state,
        materialEditing: null,
        locationMaterials: {
          ...state.locationMaterials,
          list: state.locationMaterials.list.map((material) => {
            if (material.materialId === materialId) {
              return {
                ...material,
                unitsToTraspase: payload.units,
              };
            } else {
              return material;
            }
          }),
        },
      };

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_TRANSFER_REF_REMOVE_MATERIAL:
      return {
        ...state,
        materialEditing: null,
        locationMaterials: {
          ...state.locationMaterials,
          list: state.locationMaterials.list.filter((material) => material.materialId !== payload.materialId),
        },
      };

    case successType(actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_FREEENTRY_FETCH_LOCATION):
      if (payload.response.hasError) {
        return {
          ...state,
          freeEntry: {
            scannedLocation: null,
            targetLocation: null,
            error: true,
          },
        };
      }

      return {
        ...state,
        freeEntry: {
          ...state.freeEntry,
          scannedLocation: payload.response,
          targetLocation: state.material.locations.some(
            (location) => location.locationId === payload.response.locationId,
          )
            ? payload.response
            : null,
        },
      };

    case actionTypes.STOCK_PDA_CREATE_WAREHOUSE_MOVEMENT_FREEENTRY_CONFIRM:
      return {
        ...state,
        freeEntry: {
          ...state.freeEntry,
          targetLocation: state.freeEntry.scannedLocation,
        },
      };

    case requestType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_REFERENCES):
      return {
        ...state,
        warehouseMovementReferences: {
          ...state.warehouseMovementReferences,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_REFERENCES):
      if (payload.response.hasError) {
        return {
          ...state,
          warehouseMovementReferences: {
            ...state.warehouseMovementReferences,
            fetching: false,
            haveMore: false,
          },
        };
      }
      const newMovmementReferencesList =
        payload.filters.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.warehouseMovementReferences.list, ...payload.response.data];

      return {
        ...state,
        warehouseMovementReferences: {
          ...state.warehouseMovementReferences,
          fetching: false,
          list: newMovmementReferencesList,
          offset: payload.filters.offset + payload.filters.limit,
          haveMore:
            newMovmementReferencesList.length < payload.response.metadata.itemsTotal &&
            payload.response.data.length > 0,
        },
      };

    case requestType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_LOCATIONS):
      return {
        ...state,
        warehouseMovementLocations: {
          ...state.warehouseMovementLocations,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_PDA_FETCH_WAREHOUSE_MOVEMENT_LOCATIONS):
      if (payload.response.hasError) {
        return {
          ...state,
          warehouseMovementLocations: {
            ...state.warehouseMovementLocations,
            fetching: false,
            haveMore: false,
          },
        };
      }
      const newMovementLocationsList =
        payload.filters.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.warehouseMovementLocations.list, ...payload.response.data];

      return {
        ...state,
        warehouseMovementLocations: {
          ...state.warehouseMovementLocations,
          fetching: false,
          list: newMovementLocationsList,
          offset: payload.filters.offset + payload.filters.limit,
          haveMore:
            newMovementLocationsList.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0,
        },
      };

    case successType(actionTypes.STOCK_PDA_INVENTORY_LOCATION_SCAN_REF):
      if (payload.response.hasError) {
        return state;
      }

      const scannedRef = state.locationMaterials.list.find((ref) => ref.materialId === payload.response[0].materialId);

      return {
        ...state,
        inventoryLocationExec: {
          ...state.inventoryLocationExec,
          currentStock: scannedRef ? scannedRef.locationStock : 0,
          scannedMaterials: payload.response,
          scannedMaterial: {
            ...payload.response[0],
            local: {
              ...payload.response[0].local,
              stock: scannedRef ? scannedRef.locationStock : 0,
            },
          },
        },
      };

    case successType(actionTypes.STOCK_PDA_INVENTORY_MATERIAL_SCAN_LOC):
      if (payload.response.hasError) {
        return state;
      }

      const fullLoc = state.material.locations.find((loc) => loc.locationId === payload.response.locationId);

      return {
        ...state,
        inventoryMaterialExec: {
          ...state.inventoryMaterialExec,
          currentStock: fullLoc ? fullLoc.stock : 0,
          scannedLocation: payload.response,
        },
      };

    case actionTypes.STOCK_PDA_INVENTORY_LOCATION_UPDATE_REF_STOCK:
      return {
        ...state,
        inventoryLocationExec: {
          ...state.inventoryLocationExec,
          currentStock: payload.stock,
        },
      };

    case actionTypes.STOCK_PDA_INVENTORY_MATERIAL_UPDATE_LOC_STOCK:
      return {
        ...state,
        inventoryMaterialExec: {
          ...state.inventoryMaterialExec,
          currentStock: payload.stock,
        },
      };

    case actionTypes.STOCK_PDA_INVENTORY_LOCATION_CANCEL_INPUT:
      return {
        ...state,
        inventoryLocationExec: initialState.inventoryLocationExec,
        inventoryMaterialExec: initialState.inventoryMaterialExec,
      };

    case successType(actionTypes.STOCK_PDA_EXEC_INVENTARY_REFERENCE_IN_LOCATION):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        inventoryLocationExec: {
          ...state.inventoryLocationExec,
          scannedMaterial: null,
          update: state.inventoryLocationExec.update + 1,
        },
        inventoryMaterialExec: {
          ...state.inventoryMaterialExec,
          scannedLocation: null,
          update: state.inventoryMaterialExec.update + 1,
        },
        warehouseMovementReferences: initialState.warehouseMovementReferences,
        warehouseMovementLocations: initialState.warehouseMovementLocations,
        locationMaterials: initialState.locationMaterials,
        materialLocations: initialState.materialLocations,
      };

    case successType(actionTypes.STOCK_PDA_TRANSFER_LOCATION_SCAN_REF): {
      if (payload.response.hasError) {
        return state;
      }
      //search materialId scanned in list of material to transfer
      const movement = state.warehouseMovementReferences.list.find(
        (m) => m.material.materialId === payload.response[0].materialId,
      );

      const transferUnits = movement
        ? Math.abs(movement.sourceLocation.unitsToTransfer) - (movement.sourceLocation.movementUnits || 0)
        : 0;

      return {
        ...state,
        transferLocationExec: {
          ...state.transferLocationExec,
          materials: payload.response.length > 1 ? payload.response : [],
          material: movement ? payload.response[0] : null,
          transferUnitsMax: transferUnits < 0 ? 0 : parseFloat(transferUnits.toFixed(2)),
          transferUnits: transferUnits < 0 ? 0 : parseFloat(transferUnits.toFixed(2)),
          error: !movement,
        },
      };
    }

    case actionTypes.STOCK_PDA_TRANSFER_CHANGE_TRANSFER_UNITS:
      return {
        ...state,
        transferLocationExec: {
          ...state.transferLocationExec,
          transferUnits: payload.units,
        },
        transferMaterialExec: {
          ...state.transferMaterialExec,
          transferUnits: payload.units,
        },
      };

    case successType(actionTypes.STOCK_PDA_TRANSFER_LOCATION_SCAN_TARGET_LOC):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        transferLocationExec: {
          ...state.transferLocationExec,
          targetLocation: payload.response,
        },
      };

    case successType(actionTypes.STOCK_PDA_TRANSFER_EXEC):
      if (payload.response.hasError) {
        return {
          ...state,
          transferLocationExec: initialState.transferLocationExec,
          transferMaterialExec: initialState.transferMaterialExec,
          availableLocations: initialState.availableLocations,
        };
      }

      return {
        ...state,
        transferStart: true,
        transferLocationExec: initialState.transferLocationExec,
        transferMaterialExec: initialState.transferMaterialExec,
        foceUpdateMovement: state.foceUpdateMovement + 1,
        availableLocations: initialState.availableLocations,
      };

    case successType(actionTypes.STOCK_PDA_TRANSFER_MATERIAL_SCAN_SOURCE_LOC): {
      if (payload.response.hasError) {
        return state;
      }

      //search location scanned in list of locations to transfer
      const movement = state.warehouseMovementLocations.list.find(
        (m) => m.sourceLocation.location.locationId === payload.response.locationId,
      );

      const transferUnits = movement
        ? Math.abs(movement.sourceLocation.unitsToTransfer) - (movement.sourceLocation.movementUnits || 0)
        : 0;

      return {
        ...state,
        transferMaterialExec: {
          ...state.transferMaterialExec,
          sourceLocation: movement ? payload.response : null,
          transferUnitsMax: transferUnits < 0 ? 0 : parseFloat(transferUnits.toFixed(2)),
          transferUnits: transferUnits < 0 ? 0 : parseFloat(transferUnits.toFixed(2)),
          error: !movement,
        },
      };
    }

    case successType(actionTypes.STOCK_PDA_TRANSFER_MATERIAL_SCAN_TARGET_LOC):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        transferMaterialExec: {
          ...state.transferMaterialExec,
          targetLocation: payload.response,
        },
      };

    case successType(locationActionTypes.STOCK_LOCATIONS_GET_LOCATION_DETAIL): {
      return {
        ...state,
        createdWarehouseMovement: initialState.createdWarehouseMovement,
        locationMaterials: initialState.locationMaterials,
      };
    }

    case requestType(actionTypes.STOCK_PDA_FETCH_AVAILABLE_LOC):
      return {
        ...state,
        availableLocations: {
          ...state.availableLocations,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_PDA_FETCH_AVAILABLE_LOC):
      if (payload.response.hasError) {
        return {
          ...state,
          availableLocations: {
            ...state.availableLocations,
            fetching: false,
            hasMore: false,
          },
        };
      }

      return {
        ...state,
        availableLocations: {
          ...state.availableLocations,
          location: payload.response.data[0],
          offset: payload.filters.offset + payload.filters.limit,
          hasMore:
            payload.response.metadata.itemsTotal > payload.response.metadata.itemsTo &&
            payload.response.data.length > 0,
          fetching: false,
        },
      };

    case actionTypes.STOCK_PDA_FETCH_AVAILABLE_LOC_NEXT:
      return {
        ...state,
        availableLocations: {
          ...state.availableLocations,
          location: null,
        },
      };

    case actionTypes.STOCK_PDA_CLEAR_CREATED_WAREHOUSE_MOVEMENT:
      return {
        ...state,
        createdWarehouseMovement: initialState.createdWarehouseMovement,
      };

    case actionTypes.STOCK_PDA_WAREHOUSE_MOVEMENT_TRANSFER_LOCATION_CHOOSE_REF: {
      //search materialId scanned in list of material to transfer
      const movement = state.warehouseMovementReferences.list.find((m) => m.material.materialId === payload.materialId);

      const transferUnits = movement
        ? Math.abs(movement.sourceLocation.unitsToTransfer) - (movement.sourceLocation.movementUnits || 0)
        : 0;

      const material = state.transferLocationExec.materials.find((m) => m.materialId === payload.materialId);

      return {
        ...state,
        transferLocationExec: {
          ...state.transferLocationExec,
          material: movement ? material : null,
          transferUnitsMax: transferUnits < 0 ? 0 : parseFloat(transferUnits.toFixed(2)),
          transferUnits: transferUnits < 0 ? 0 : parseFloat(transferUnits.toFixed(2)),
          error: !movement,
        },
      };
    }

    case actionTypes.STOCK_PDA_WAREHOUSE_MOVEMENT_INVENTORY_CHOOSE_REF: {
      const scannedMaterial = state.inventoryLocationExec.scannedMaterials.find(
        (m) => m.materialId === payload.materialId,
      );

      const scannedRef = state.locationMaterials.list.find((ref) => ref.materialId === payload.materialId);

      return {
        ...state,
        inventoryLocationExec: {
          ...state.inventoryLocationExec,
          currentStock: scannedRef ? scannedRef.locationStock : 0,
          scannedMaterial: {
            ...scannedMaterial,
            local: {
              ...scannedMaterial.local,
              stock: scannedRef ? scannedRef.locationStock : 0,
            },
          },
        },
      };
    }

    default:
      return state;
  }
}

export default pda;
