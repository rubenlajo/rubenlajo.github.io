import { PROMISE_CALL } from "amiga-core/application/actions";
import api from "../api";
import * as actionTypes from "./actionTypes";

/*
 *  {
 *    type: enum("info" | "error" | "success"),
 *    title :"string"
 *    content: "string"
 *    fadeout: number (numero de segundos que estará visible) | undefined => no se oculta automaticamente
 *    buttonPrimary: {
 *      content: "string",
 *      click: function
 *    }
 *    buttonSecondary : {
 *      content: "string",
 *      click: function
 *    }
 * }
 */
export const addNotification = (notification) => ({
  type: actionTypes.APPLICATION_ADD_NOTIFICATION,
  payload: notification,
});

export const tickNotification = () => ({
  type: actionTypes.APPLICATION_TICK_NOTIFICATION,
});

export const closeNotification = (id) => ({
  type: actionTypes.APPLICATION_CLOSE_NOTIFICATION,
  payload: id,
});

export const fetchCenters = () => ({
  type: actionTypes.APPLICATION_FETCH_CENTERS,
  [PROMISE_CALL]: () => api.fetchCenters(),
});

export const fetchCenter = (centerId) => ({
  type: actionTypes.APPLICATION_FETCH_CENTER,
  payload: { centerId },
  [PROMISE_CALL]: () => api.fetchCenter(centerId),
});

export const setCenterSelected = (center) => ({
  type: actionTypes.APPLICATION_SET_CENTER,
  payload: center,
});

/**
 * SFI status
 */
export const fetchStatusSFI = () => ({
  type: actionTypes.APPLICATION_FETCH_SFISTATUS,
  [PROMISE_CALL]: () => api.fetchStatusSFI(),
});

/**
 * Metadata
 */
export const fetchAppMetadata = () => ({
  type: actionTypes.APPLICATION_FETCH_APP_METADATA,
  [PROMISE_CALL]: () => api.fetchAppMetadata(),
});

/**
 * user photo
 */
export const fetchUserPhoto = (userLogin) => ({
  type: actionTypes.APPLICATION_FETCH_USER_PHOTO,
  payload: {
    userLogin,
  },
  [PROMISE_CALL]: () => api.fetchUserPhoto(userLogin),
});

/**
 * user names
 */
 export const fetchUserNames = (users) => ({
  type: actionTypes.APPLICATION_FETCH_USER_NAMES,
  payload: {
    users,
  },
  [PROMISE_CALL]: () => api.fetchUserNames(users),
});