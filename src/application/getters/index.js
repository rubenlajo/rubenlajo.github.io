/**
 * Getter de Areas logisticas disponibles y seleccioandas
 */
export const getCenters = (state) => state.application.centers;
export const getCenterSelected = (state) => state.application.centerSelected;
export const getCentersFetching = (state) => state.application.centersFetching;
export const getCenterFetching = (state) => state.application.centerFetching;
/**
 * Getters de idiomas
 */
export const getLanguages = (state) => state.application.languages;

/**
 * Getter de Notificaciones
 */
export const getNotifications = (state) => state.application.notifications;

/**
 * Get list of sfistatus
 */
export const getSfiStatusList = (state) => state.application.sfiStatusList;
export const getSfiStatusListFetching = (state) => state.application.sfiStatusListFetching;

/**
 * App metadata getter
 */
export const getAppMetadata = (state) => state.application.appMetadata;

/**
 * user photos
 */
export const getUserPhotos = (state) => state.application.userPhotos;

/**
 * user names
 */
 export const getUserNames = (state) => state.application.userNames;
 export const getUserNamesLoading = (state) => state.application.userNamesLoading;
