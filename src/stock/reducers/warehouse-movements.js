import { successType, requestType } from "amiga-core/application/actions";
import * as actionTypes from "../actions/warehouse-movements/actionTypes";
import * as refActionTypes from "../actions/references/actionTypes";
import * as locationsActionTypes from "../actions/locations/actionTypes";
import { composeState } from "@/utils/state";
import { v4 as uuidV4 } from "uuid";

const initialState = {
  all: [],
  view: "table", //dashboard
  fetchingWarehouseMovements: false,
  forceUpdate: 0,
  itemsTotal: 0,
  filters: {
    offset: 0,
    limit: 25,
  },
  selected: [],
  warehouseMovementsToAssign: [],
  warehouseMovementTypes: {
    list: [],
    fetching: false,
  },
  warehouseMovementStatus: {
    list: [],
    fetching: false,
  },
  assignedUsers: {},
  currentWarehouseMovement: null,
  currentWarehouseMovementReferences: {
    list: [],
    fetching: false,
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  currentWarehouseMovementLocations: {
    list: [],
    fetching: false,
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  deletedWaerhouseMovement: false,
  warehouseMovementTechnicians: {
    list: [],
    fetching: false,
  },
  referencesToTraspase: [],
  traspaseTargetLocations: [],
  locationsToTraspase: [],
  traspaseCreated: false,
  locationsAvailableByMaterial: [],
  editTraspaseLocation: {
    referencesToTraspase: [],
    fetching: false,
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  editTraspaseMaterial: {
    locationsToTraspase: [],
    fetching: false,
    haveMore: true,
    limit: 100,
    offset: 0,
  },
  warehouseMovementUpdated: false,
  availableLocationsByMaterial: {},
};

const decode = (str) => {
  const el = document.createElement("div");
  el.innerHTML = decodeURIComponent(str);
  return el.innerText;
};

function warehouseMovements(state = initialState, { type, payload }) {
  switch (type) {
    //Fetching warehouse movements
    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENTS):
      return composeState(state, { fetchingWarehouseMovements: true });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENTS):
      if (payload.response.hasError) {
        return composeState(state, { fetchingWarehouseMovements: false });
      }
      return composeState(state, {
        all: payload.response.data,
        selected: [],
        itemsTotal: payload.response.metadata.itemsTotal,
        fetchingWarehouseMovements: false,
        currentWarehouseMovement: null,
        deletedWaerhouseMovement: false,
        currentWarehouseMovementReferences: initialState.currentWarehouseMovementReferences,
        currentWarehouseMovementLocations: initialState.currentWarehouseMovementLocations,
        traspaseCreated: false,
        warehouseMovement: initialState.warehouseMovement,
        warehouseMovementsToAssign: initialState.warehouseMovementsToAssign,
        availableLocationsByMaterial: initialState.availableLocationsByMaterial,
        editTraspaseLocation: initialState.editTraspaseLocation,
        editTraspaseMaterial: initialState.editTraspaseMaterial,
        traspaseTargetLocations: initialState.traspaseTargetLocations,
        warehouseMovementUpdated: initialState.warehouseMovementUpdated,
      });

    //Fetching warehouse movement types
    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_TYPES):
      return composeState(state, {
        warehouseMovementTypes: {
          list: [],
          fetching: true,
        },
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_TYPES):
      if (payload.response.hasError) {
        return composeState(state, {
          warehouseMovementTypes: {
            list: state.warehouseMovementTypes.list,
            fetching: false,
          },
        });
      }

      return composeState(state, {
        warehouseMovementTypes: {
          list: payload.response,
          fetching: false,
        },
      });

    //Fetching warehouse movement status
    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_STATUS):
      return composeState(state, {
        warehouseMovementStatus: {
          list: [],
          fetching: true,
        },
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_STATUS):
      if (payload.response.hasError) {
        return composeState(state, {
          warehouseMovementStatus: {
            list: state.warehouseMovementStatus.list,
            fetching: false,
          },
        });
      }

      return composeState(state, {
        warehouseMovementStatus: {
          list: payload.response,
          fetching: false,
        },
      });

    case actionTypes.STOCK_WAREHOUSEMOVEMENTS_SETVIEW:
      return composeState(state, { view: payload });

    case actionTypes.STOCK_WAREHOUSEMOVEMENTS_SETSELECTED:
      return composeState(state, { selected: [...payload] });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_BYID):
      if (payload.response.hasError) {
        return state;
      }
      return composeState(state, {
        currentWarehouseMovement: payload.response,
        warehouseMovementUpdated: initialState.warehouseMovementUpdated,
        currentWarehouseMovementLocations: initialState.currentWarehouseMovementLocations,
        editTraspaseMaterial: initialState.editTraspaseMaterial,
        editTraspaseLocation: initialState.editTraspaseLocation,
        traspaseTargetLocations: initialState.traspaseTargetLocations,
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_BYIDLIST):
      if (payload.response.hasError) {
        return state;
      }
      return composeState(state, {
        warehouseMovementsToAssign: [...payload.response],
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_REMOVE):
      if (payload.response.hasError) {
        return state;
      }

      return composeState(state, {
        selected: [],
        forceUpdate: state.forceUpdate + 1,
        deletedWaerhouseMovement: true,
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_STOCKMOVEMENT):
      if (payload.response.hasError) {
        return state;
      }
      return composeState(state, {
        currentWarehouseMovement: payload.response,
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_ASSIGNED_USER): {
      if (payload.response.hasError) {
        return state;
      }
      return composeState(state, {
        assignedUsers: {
          ...state.assignedUsers,
          [payload.userLogin]: payload.response.userPhoto ? decode(payload.response.userPhoto) : null,
        },
      });
    }

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_REFERENCES):
      return composeState(state, {
        currentWarehouseMovementReferences: {
          ...state.currentWarehouseMovementReferences,
          fetching: true,
        },
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_REFERENCES): {
      if (payload.response.hasError) {
        return composeState(state, {
          currentWarehouseMovementReferences: {
            ...state.currentWarehouseMovementReferences,
            fetching: false,
            haveMore: false,
          },
        });
      }

      const list =
        payload.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.currentWarehouseMovementReferences.list, ...payload.response.data];

      const haveMore = list.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;

      return composeState(state, {
        currentWarehouseMovementReferences: {
          ...state.currentWarehouseMovementReferences,
          fetching: false,
          list,
          haveMore,
          offset: state.currentWarehouseMovementReferences.offset + state.currentWarehouseMovementReferences.limit,
          limit: state.currentWarehouseMovementReferences.limit,
        },
      });
    }

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_LOCATIONS):
      return composeState(state, {
        currentWarehouseMovementLocations: {
          ...state.currentWarehouseMovementLocations,
          fetching: true,
        },
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_WAREHOUSEMOVEMENT_LOCATIONS): {
      if (payload.response.hasError) {
        return composeState(state, {
          currentWarehouseMovementLocations: {
            ...state.currentWarehouseMovementLocations,
            fetching: false,
            haveMore: false,
          },
        });
      }

      const list =
        payload.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.currentWarehouseMovementLocations.list, ...payload.response.data];

      const haveMore = list.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;

      return composeState(state, {
        currentWarehouseMovementLocations: {
          ...state.currentWarehouseMovementLocations,
          fetching: false,
          list,
          haveMore,
          offset: state.currentWarehouseMovementLocations.offset + state.currentWarehouseMovementLocations.limit,
          limit: state.currentWarehouseMovementLocations.limit,
        },
      });
    }

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_TECHNICIANS):
      return composeState(state, {
        warehouseMovementTechnicians: { list: [], fetching: true },
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_TECHNICIANS):
      if (payload.response.hasError) {
        return composeState(state, {
          warehouseMovementTechnicians: { list: [], fetching: false },
        });
      }

      return composeState(state, {
        warehouseMovementTechnicians: {
          list: payload.response,
          fetching: false,
        },
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_ASSIGN_ORDER_OPERATOR):
      if (payload.response.hasError) {
        return state;
      }

      return composeState(state, {
        warehouseMovementsToAssign: state.warehouseMovementsToAssign.map((wm) => {
          if (wm.warehouseMovementId === payload.warehouseMovementId) {
            return {
              ...wm,
              assignedUsers: [{ assignedUser: payload.technicianLogin }],
            };
          } else {
            return wm;
          }
        }),
      });

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_REFERENCES_TO_TRASPASE):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        referencesToTraspase: payload.response.data,
      };

    case actionTypes.STOCK_WAREHOUSEMOVEMENTS_SET_GENERAL_TRASPASE_UNITS:
      return {
        ...state,
        referencesToTraspase: state.referencesToTraspase.map((material) => {
          if (material.materialId === payload.materialId) {
            return {
              ...material,
              locations: {
                ...material.locations,
                list: material.locations.list.map((location) => {
                  if (location.locationId === payload.sourceLocation) {
                    return {
                      ...location,
                      unitsToTrapsase: payload.units,
                    };
                  } else {
                    return location;
                  }
                }),
              },
            };
          } else {
            return material;
          }
        }),
        locationsToTraspase: state.locationsToTraspase.map((location) => {
          if (location.locationId === payload.sourceLocation) {
            return {
              ...location,
              materialToTraspase: {
                ...location.materialToTraspase,
                list: location.materialToTraspase.list.map((material) => {
                  if (material.materialId === payload.materialId) {
                    return {
                      ...material,
                      unitsToTrapsase: payload.units || 0,
                    };
                  } else {
                    return material;
                  }
                }),
              },
            };
          } else {
            return location;
          }
        }),
      };

    case actionTypes.STOCK_WAREHOUSEMOVEMENTS_ADD_TRASPASE_REF_TARGET_LOCATION_LINE:
      return {
        ...state,
        traspaseTargetLocations: [
          ...state.traspaseTargetLocations,
          {
            lineId: uuidV4(),
            materialId: payload.materialId,
            qty: 0,
            sourceLocation: payload.sourceLocation,
            targetLocation: null,
          },
        ],
      };

    case actionTypes.STOCK_WAREHOUSEMOVEMENTS_REMOVE_TRASPASE_REF_TARGET_LOCATION_LINE:
      return {
        ...state,
        traspaseTargetLocations: state.traspaseTargetLocations.filter((line) => payload.lineId !== line.lineId),
      };

    case actionTypes.STOCK_WAREHOUSEMOVEMENTS_TRASPASE_REF_TARGET_LOCATION_LINE_UPDATE_UNITS:
      return {
        ...state,
        traspaseTargetLocations: state.traspaseTargetLocations.map((line) => {
          if (line.lineId === payload.lineId) {
            return {
              ...line,
              qty: payload.qty,
            };
          } else {
            return line;
          }
        }),
      };

    case actionTypes.STOCK_WAREHOUSEMOVEMENTS_TRASPASE_REF_TARGET_LOCATION_LINE_UPDATE_LOCATION:
      return {
        ...state,
        traspaseTargetLocations: state.traspaseTargetLocations.map((line) => {
          if (line.lineId === payload.lineId) {
            return {
              ...line,
              targetLocation: payload.targetLocation,
            };
          } else {
            return line;
          }
        }),
      };

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_MATERIAL_LOCATIONS):
      return {
        ...state,
        referencesToTraspase: state.referencesToTraspase.map((material) => {
          if (material.materialId === payload.materialId) {
            return {
              ...material,
              locations: {
                ...material.locations,
                fetching: true,
              },
            };
          } else {
            return material;
          }
        }),
      };

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_MATERIAL_LOCATIONS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        referencesToTraspase: state.referencesToTraspase.map((material) => {
          if (material.materialId === payload.materialId) {
            const newList =
              payload.filters.offset === 0 || payload.response.metadata.itemsFrom === 0
                ? payload.response.data
                : [...material.locations.list, ...payload.response.data];
            const hasMore = newList.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;
            return {
              ...material,
              locations: {
                list: newList,
                hasMore,
                ...payload.filters,
                fetching: false,
              },
            };
          } else {
            return material;
          }
        }),
      };

    case successType(actionTypes.STOCK_WAREHOSUEMOVEMENTS_CREATE_MATERIAL_TRASPASE):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        traspaseCreated: true,
      };

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATIONS_BY_IDLIST):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        locationsToTraspase: payload.response.data,
      };

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATION_REFERENCES_BY_ID):
      return {
        ...state,
        locationsToTraspase: state.locationsToTraspase.map((location) => {
          if (location.locationId === payload.locationId) {
            return {
              ...location,
              materialToTraspase: {
                ...location.materialToTraspase,
                fetching: true,
              },
            };
          } else {
            return location;
          }
        }),
      };

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATION_REFERENCES_BY_ID): {
      if (payload.response.hasError) {
        return {
          ...state,
          locationsToTraspase: state.locationsToTraspase.map((location) => {
            if (location.locationId === payload.locationId) {
              return {
                ...location,
                materialToTraspase: {
                  ...location.materialToTraspase,
                  fetching: false,
                },
              };
            } else {
              return location;
            }
          }),
        };
      }

      const locationsToTraspase = state.locationsToTraspase.map((location) => {
        if (location.locationId === payload.locationId) {
          const newList =
            payload.filters.offset === 0 || payload.response.metadata.itemsFrom === 0
              ? payload.response.data
              : [...location.materialToTraspase.list, ...payload.response.data];
          return {
            ...location,
            materialToTraspase: {
              list: newList,
              hasMore: newList.length < payload.response.metadata.itemsTotal && payload.response.data.length !== 0,
              offset: payload.filters.offset,
              limit: payload.filters.limit,
              fetching: false,
            },
          };
        } else {
          return location;
        }
      });

      return {
        ...state,
        locationsToTraspase,
      };
    }

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATIONS_OF_REFERENCE):
      const exist = state.locationsAvailableByMaterial.some((material) => material.materialId === payload.materialId);

      return {
        ...state,
        locationsAvailableByMaterial: exist
          ? state.locationsAvailableByMaterial.map((material) => {
              if (material.materialId === payload.materialId) {
                return {
                  ...material,
                  fetching: true,
                };
              } else {
                return material;
              }
            })
          : [...state.locationsAvailableByMaterial, { materialId: payload.materialId, fetching: true }],
      };
    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_LOCATIONS_OF_REFERENCE):
      if (payload.response.hasError) {
        return {
          ...state,
          locationsAvailableByMaterial: state.locationsAvailableByMaterial.map((material) => {
            if (material.materialId === payload.materialId) {
              return {
                ...material,
                fetching: false,
              };
            } else {
              return material;
            }
          }),
        };
      }

      const hasCurrent = state.locationsAvailableByMaterial.some(
        (material) => material.materialId === payload.materialId,
      );

      return {
        ...state,
        locationsAvailableByMaterial: hasCurrent
          ? state.locationsAvailableByMaterial.map((material) => {
              if (material.materialId === payload.materialId) {
                const newList =
                  payload.filters.offset === 0 || payload.response.metadata.itemsFrom === 0
                    ? payload.response.data
                    : [...material.locations, ...payload.response.data];
                return {
                  ...material,
                  locations: newList,
                  offset: payload.filters.offset,
                  limit: payload.filters.limit,
                  hasMore: newList.length < payload.response.metadata.itemsTotal && payload.response.data.length !== 0,
                  fetching: false,
                };
              } else {
                return material;
              }
            })
          : [
              ...state.locationsAvailableByMaterial,
              {
                materialId: payload.materialId,
                locations: payload.response.data,
                offset: payload.filters.offset,
                limit: payload.filters.limit,
                hasMore:
                  payload.response.data.length < payload.response.metadata.itemsTotal &&
                  payload.response.data.length !== 0,
                fetching: false,
              },
            ],
      };

    case actionTypes.STOCK_WAREHOUSE_REMOVE_REFERENCE_LOC_TRANSFER:
      return {
        ...state,
        locationsToTraspase: state.locationsToTraspase.map((location) => {
          if (location.locationId === payload.locationId) {
            return {
              ...location,
              materialToTraspase: {
                ...location.materialToTraspase,
                list: location.materialToTraspase.list.filter((material) => material.materialId !== payload.materialId),
              },
            };
          } else {
            return location;
          }
        }),
        traspaseTargetLocations: state.traspaseTargetLocations.filter(
          (line) => line.materialId !== payload.materialId && line.sourceLocation !== payload.locationId,
        ),
      };

    case actionTypes.STOCK_WAREHOUSE_REMOVE_REFERENCE_LOC_EDIT_TRANSFER:
      return {
        ...state,
        editTraspaseLocation: {
          ...state.editTraspaseLocation,
          referencesToTraspase: state.editTraspaseLocation.referencesToTraspase.filter(
            (movement) => movement.material.materialId !== payload.materialId,
          ),
        },
        editTraspaseMaterial: {
          ...state.editTraspaseMaterial,
          locationsToTraspase: state.editTraspaseMaterial.locationsToTraspase.filter(
            (movement) => movement.sourceLocation.location.locationId !== payload.locationId,
          ),
        },
        traspaseTargetLocations: state.traspaseTargetLocations.filter((line) => line.locationId !== payload.locationId),
      };

    case actionTypes.STOCK_WAREHOUSE_REMOVE_REFERENCE_REF_TRANSFER:
      return {
        ...state,
        referencesToTraspase: state.referencesToTraspase.map((reference) => {
          if (reference.materialId === payload.materialId) {
            return {
              ...reference,
              locations: {
                ...reference.locations,
                list: reference.locations.list.filter((location) => location.locationId !== payload.locationId),
              },
            };
          } else {
            return reference;
          }
        }),
      };

    case successType(refActionTypes.STOCK_REFERENCES_FETCH_REFERENCES):
    case successType(locationsActionTypes.STOCK_LOCATIONS_FETCH_LOCATIONS):
      return {
        ...state,
        referencesToTraspase: initialState.referencesToTraspase,
        traspaseTargetLocations: initialState.traspaseTargetLocations,
        locationsToTraspase: initialState.locationsToTraspase,
        traspaseCreated: initialState.traspaseCreated,
      };

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMEMNTS_FETCH_EDIT_TRASPASE_REFS):
      return {
        ...state,
        editTraspaseLocation: {
          ...state.editTraspaseLocation,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMEMNTS_FETCH_EDIT_TRASPASE_REFS): {
      if (payload.response.hasError) {
        return {
          ...state,
          editTraspaseLocation: {
            ...state.editTraspaseLocation,
            fetching: false,
          },
        };
      }

      const referencesToTraspase =
        payload.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.editTraspaseLocation.referencesToTraspase, ...payload.response.data];

      const haveMore =
        referencesToTraspase.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;

      const targetLocations = [];
      referencesToTraspase.forEach((movement) => {
        if (movement.targetLocations) {
          movement.targetLocations.forEach((targetLocation) => {
            targetLocations.push({
              lineId: uuidV4(),
              materialId: movement.material.materialId,
              qty: movement.sourceLocation.unitsToTransfer || movement.sourceLocation.movementUnits || 0,
              sourceLocation: movement.sourceLocation.location.locationId,
              targetLocation: targetLocation.location.locationId,
            });
          });
        }
      });

      return {
        ...state,
        editTraspaseLocation: {
          ...state.editTraspaseLocation,
          referencesToTraspase,
          haveMore,
          fetching: false,
          offset: state.editTraspaseLocation.offset + state.editTraspaseLocation.limit,
          limit: state.editTraspaseLocation.limit,
        },
        traspaseTargetLocations: targetLocations,
      };
    }

    case actionTypes.STOCK_WAREHOUSEMOVEMEMNTS_EDIT_TRASPASE_REFS_SETUNITS:
      return {
        ...state,
        editTraspaseLocation: {
          ...state.editTraspaseLocation,
          referencesToTraspase: state.editTraspaseLocation.referencesToTraspase.map((movement) => {
            if (movement.material.materialId === payload.materialId) {
              return {
                ...movement,
                sourceLocation: {
                  ...movement.sourceLocation,
                  unitsToTransfer: payload.units,
                },
              };
            } else {
              return movement;
            }
          }),
        },
      };

    case actionTypes.STOCK_WAREHOUSEMOVEMEMNTS_EDIT_TRASPASE_LOCS_SETUNITS:
      return {
        ...state,
        editTraspaseMaterial: {
          ...state.editTraspaseMaterial,
          locationsToTraspase: state.editTraspaseMaterial.locationsToTraspase.map((movement) => {
            if (movement.sourceLocation.location.locationId === payload.locationId) {
              return {
                ...movement,
                sourceLocation: {
                  ...movement.sourceLocation,
                  unitsToTransfer: payload.units,
                },
              };
            } else {
              return movement;
            }
          }),
        },
      };

    case successType(actionTypes.STOCK_WAREHOUSEMOVMEMENTS_UPDATE_WAREHOUSE_MOVEMENT):
      if (payload.response.hasError) {
        return state;
      }

      return {
        ...state,
        warehouseMovementUpdated: true,
        currentWarehouseMovementReferences: initialState.currentWarehouseMovementReferences,
        currentWarehouseMovementLocations: initialState.currentWarehouseMovementLocations,
      };

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_EDIT_WAREHOUSEMOVEMENT_LOCATIONS):
      return {
        ...state,
        editTraspaseMaterial: {
          ...state.editTraspaseMaterial,
          fetching: true,
        },
      };

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_EDIT_WAREHOUSEMOVEMENT_LOCATIONS): {
      if (payload.response.hasError) {
        return {
          ...state,
          editTraspaseMaterial: {
            ...state.editTraspaseMaterial,
            fetching: false,
          },
        };
      }

      const locationsToTraspase =
        payload.offset === 0 || payload.response.metadata.itemsFrom === 0
          ? payload.response.data
          : [...state.editTraspaseMaterial.locationsToTraspase, ...payload.response.data];

      const haveMore =
        locationsToTraspase.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;

      const targetLocations = [];
      locationsToTraspase.forEach((movement) => {
        if (movement.targetLocations) {
          movement.targetLocations.forEach((targetLocation) => {
            targetLocations.push({
              lineId: uuidV4(),
              materialId: state.currentWarehouseMovement.materials[0].materialId,
              qty: targetLocation.unitsToTransfer || 0,
              sourceLocation: movement.sourceLocation.location.locationId,
              targetLocation: targetLocation.location.locationId,
            });
          });
        }
      });

      return {
        ...state,
        editTraspaseMaterial: {
          ...state.editTraspaseMaterial,
          locationsToTraspase,
          haveMore,
          fetching: false,
          offset: state.editTraspaseMaterial.offset + state.editTraspaseMaterial.limit,
          limit: state.editTraspaseMaterial.limit,
        },
        traspaseTargetLocations: targetLocations,
      };
    }

    case requestType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_AVAILABLE_LOCATIONS):
      return {
        ...state,
        availableLocationsByMaterial: {
          ...state.availableLocationsByMaterial,
          [payload.materialId]: {
            ...state.availableLocationsByMaterial[payload.materialId],
            fetching: true,
          },
        },
      };

    case successType(actionTypes.STOCK_WAREHOUSEMOVEMENTS_FETCH_AVAILABLE_LOCATIONS):
      if (payload.response.hasError) {
        return {
          ...state,
          availableLocationsByMaterial: {
            ...state.availableLocationsByMaterial,
            [payload.materialId]: {
              ...state.availableLocationsByMaterial[payload.materialId],
              fetching: false,
            },
          },
        };
      }

      const newList =
        payload.filters.offset === 0
          ? payload.response.data
          : [...state.availableLocationsByMaterial[payload.materialId].list, ...payload.response.data];

      const haveMore = newList.length < payload.response.metadata.itemsTotal && payload.response.data.length > 0;

      return {
        ...state,
        availableLocationsByMaterial: {
          ...state.availableLocationsByMaterial,
          [payload.materialId]: {
            limit: payload.filters.limit,
            offset: payload.filters.offset,
            list: newList,
            haveMore,
            fetching: false,
          },
        },
      };

    default:
      return state;
  }
}

export default warehouseMovements;
