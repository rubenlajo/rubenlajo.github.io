import { showOverlayLoader, hideOverlayLoader } from "amiga-core/application/reactions";
import { intl } from "amiga-core/components/i18n";

import { NOTIFICATION_TYPE, NOTIFICATIONS_DELAY } from "@/generalConfig";
import { logOut } from "@/utils/";

const reactions = [
  {
    match: /SHOW_LOADING_OVERLAY/,
    reaction: showOverlayLoader,
  },
  {
    match: /HIDE_LOADING_OVERLAY/,
    reaction: hideOverlayLoader,
  },
  {
    match: /_REQUEST$/,
    reaction: (action) => {
      if (action.type.indexOf("NOTLOADING") === -1) {
        return {
          type: "SHOW_LOADING_OVERLAY",
        };
      }
      return null;
    },
  },
  {
    match: /_(SUCCESS|FAILURE)$/,
    reaction: (action) => {
      if (action.type.indexOf("NOTLOADING") === -1) {
        return {
          type: "HIDE_LOADING_OVERLAY",
        };
      }
      return null;
    },
  },
  {
    match: /_(SUCCESS|FAILURE)$/,
    reaction: (action) => {
      if (
        action &&
        action.payload &&
        action.payload.response &&
        action.payload.response.hasError &&
        action.payload.response.status === 401
      ) {
        logOut();
        return {
          type: "APPLICATION_SESSION_STATUS",
          payload: false,
        };
      }
      return {
        type: "APPLICATION_SESSION_STATUS",
        payload: true,
      };
    },
  },
  {
    match: (action) =>
      action.payload &&
      action.payload.response &&
      action.payload.response.hasError &&
      action.type.indexOf("NO_NOTIFICATION") === -1 &&
      action.type.indexOf("NOTLOADING") === -1,
    reaction: (err) => ({
      type: "APPLICATION_ADD_NOTIFICATION",
      payload: {
        type: NOTIFICATION_TYPE.ERROR,
        title: "Error",
        content: err.payload.response.error || intl.formatMessage({ id: "reactions.default-error" }),
        fadeout: NOTIFICATIONS_DELAY,
      },
    }),
  },
];

export default reactions;
