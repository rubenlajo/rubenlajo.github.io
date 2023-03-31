import { successType, requestType } from "amiga-core/application/actions";
import * as actiontypes from "../actions/actionTypes";
import { NOTIFICATIONS_DELAY, IMMS_WAREHOUSE, IMMS_WAREHOUSE_LOGISTIC_AREA } from "@/generalConfig";
import Cookies from "amiga-core/application/cookies.js";

const initialState = {
  centers: [],
  centerSelected: null,
  centersFetching: false,
  centerFetching: false,
  notifications: [],
  languages: [],
  sfiStatusListFetching: false,
  sfiStatusList: [],
  // isDragging: false,
  // sessionStatus: null,
  appMetadata: null,
  userPhotos: {},
  userNames: [],
  userNamesLoading: false,
};

const decode = (str) => {
  const el = document.createElement("div");
  el.innerHTML = decodeURIComponent(str);
  return el.innerText;
};

function application(state = initialState, { type, payload }) {
  switch (type) {
    case actiontypes.APPLICATION_ADD_NOTIFICATION: {
      const newNotification = {
        ...payload,
        visible: false,
        closed: false,
        new: true,
        fadeout: payload.fadeout ? NOTIFICATIONS_DELAY : undefined,
      };

      return {
        ...state,
        notifications: [...state.notifications, newNotification],
      };
    }
    
    case actiontypes.APPLICATION_CLOSE_NOTIFICATION:
      return {
        ...state,
        notifications: [
          // Las que ya no estan visibles las cerramos
          ...state.notifications.filter((n) => !n.visible && !n.closed).map((n) => ({ ...n, closed: true })),
          // las que estan visibles pero no son la acutal las dejamos
          ...state.notifications.filter((n) => n.visible && n.id !== payload),
          // La que queremos ocultar le quitamos la visibilidad
          ...state.notifications.filter((n) => n.visible && n.id === payload).map((n) => ({ ...n, visible: false })),
        ],
      };
    case actiontypes.APPLICATION_TICK_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications.map((n) => {
              if (n.new) {
                return { ...n, visible: true, new: false };
              }
              if (n.visible && typeof n.fadeout !== "undefined") {
                if (n.fadeout > 0) {
                  return { ...n, fadeout: n.fadeout - 1 };
                } else {
                  return { ...n, visible: false };
                }
              } else if (!n.visible && !n.closed) {
                return { ...n, closed: true };
              } else {
                return n;
              }
          }),
        ],
      };

    case requestType(actiontypes.APPLICATION_FETCH_CENTERS):
      return {
        ...state,
        centersFetching: true,
        centerFetching: true,
      };
    case successType(actiontypes.APPLICATION_FETCH_CENTERS):
      if (payload.response.hasError) {
        return {
          ...state,
          centersFetching: false,
          centerFetching: false,
        };
      }
      // Se obtiene el valor de la cookie del usuario
      const logAreaSelCookie = Cookies.get(IMMS_WAREHOUSE_LOGISTIC_AREA);
      let centerSelected = payload.response[0];
      if (logAreaSelCookie) {
        centerSelected = payload.response.find((l) => l.logisticAreaCompanyId === parseInt(logAreaSelCookie, 10));
      }
      Cookies.set(IMMS_WAREHOUSE, centerSelected.centerId);
      Cookies.set(IMMS_WAREHOUSE_LOGISTIC_AREA, centerSelected.logisticAreaCompanyId);

      return {
        ...state,
        centers: payload.response,
        centerSelected,
        centersFetching: false,
        centerFetching: false,
      };

    case actiontypes.APPLICATION_SET_CENTER: {
      // Se guarda la seleccion en la cookie
      Cookies.set(IMMS_WAREHOUSE, payload.centerId);
      Cookies.set(IMMS_WAREHOUSE_LOGISTIC_AREA, payload.logisticAreaCompanyId);
      return {
        ...state,
        centerSelected: payload,
      };
    }

    case requestType(actiontypes.APPLICATION_FETCH_CENTER):
      return {
        ...state,
        centerFetching: true,
      };
    case successType(actiontypes.APPLICATION_FETCH_CENTER):
      if (payload.response.hasError) {
        return {
          ...state,
          centerFetching: false,
        };
      }

      const mapParameters = {};
      payload.response.configurationParameters.forEach((parameter) => {
        mapParameters[parameter.configurationParameterName] = parameter.value;
      });

      return {
        ...state,
        centerSelected: {
          ...state.centerSelected,
          mapParameters,
          centerFetching: false,
        },
      };

    case requestType(actiontypes.APPLICATION_FETCH_SFISTATUS):
      return {
        ...state,
        sfiStatusListFetching: true,
      };

    case successType(actiontypes.APPLICATION_FETCH_SFISTATUS):
      if (payload.response.hasError) {
        return state;
      }
      return {
        ...state,
        sfiStatusList: payload.response,
        sfiStatusListFetching: false,
      };

    case successType(actiontypes.APPLICATION_FETCH_APP_METADATA):
      if (payload.response.hasError) {
        return {
          ...state,
          appMetadata: {
            imms_readonly: false,
          },
        };
      }
      return {
        ...state,
        appMetadata: payload.response,
      };

    case requestType(actiontypes.APPLICATION_FETCH_USER_PHOTO):
      return {
        ...state,
        userPhotos: {
          ...state.userPhotos,
          [payload.userLogin]: null,
        },
      };

    case successType(actiontypes.APPLICATION_FETCH_USER_PHOTO):
      if (payload.response.hasError) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        userPhotos: {
          ...state.userPhotos,
          [payload.userLogin]: payload.response.userPhoto ? decode(payload.response.userPhoto) : null,
        },
      };

    case requestType(actiontypes.APPLICATION_FETCH_USER_NAMES):
      return {
        ...state,
        ...state.userNames,
        userNamesLoading: true
      };

    case successType(actiontypes.APPLICATION_FETCH_USER_NAMES):
      if (payload.response.hasError) {
        return {
          ...state,
          userNamesLoading: false
        };
      }

      return {
        ...state,
        userNames: payload.response,
        userNamesLoading: false
      };

    default:
      return state;
  }
}

export default application;
