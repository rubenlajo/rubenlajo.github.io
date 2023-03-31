import React, { useEffect } from "react";
import connect from "amiga-core/application/connect.js";
import * as appGetters from "application/getters";
import * as appActions from "application/actions";
import { Toast } from "lib-frontsga";
import injectDevice from "../sga-layout/inject-device";

function NotificationsRenderer(props) {
  const { notifications, closeNotification, device } = props;

  const availableNotifications = notifications.filter(n => !n.closed);
  const visibleNotifications = notifications.filter(n => n.visible);
  const newNotifications = notifications.filter(n => n.new);

  useEffect(() => {
    let timer = null;
    if (availableNotifications.length > 0 && availableNotifications.some(n => n.fadeout >= 0)) {
      timer = setInterval(function() {
        props.tickNotification();
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [availableNotifications]);

  useEffect(() => {
    let timer = null;
    if (newNotifications.length > 0) {
      timer = setInterval(function() {
        props.tickNotification();
      }, 100);
    }

    return () => {
      clearInterval(timer);
    };
  }, [newNotifications]);

  const renderNotifications = () =>
    availableNotifications.map(notification => {
      if (!notification.id) {
        notification.id = new Date().getTime();
      }

      const onClose = () => closeNotification(notification ? notification.id : "");
      // Control título y contenido
      const title =
        device.mobile && notification && notification.content
          ? notification.content
          : notification && notification.tille
          ? notification.tille
          : notification.content;
      return (
        <>
          <div
            key={`overlay-${notification.id}`}
            className={`notifications-overlay ${visibleNotifications.length === 0 ? "hidden" : ""}`}
          />
          <Toast
            key={notification.id}
            className='notifications-toast'
            type={notification.type}
            title={title}
            content={notification ? notification.content : ""}
            buttonSecondaryContent={
              notification && notification.buttonSecondary
                ? notification.buttonSecondary.content
                : null
            }
            buttonPrimaryContent={
              notification && notification.buttonPrimary ? notification.buttonPrimary.content : null
            }
            icon='sga-icon-info-circle'
            visible={notification ? notification.visible : false}
            onClose={onClose}
            buttonSecondaryClick={
              notification && notification.buttonSecondary
                ? () => {
                    notification.buttonSecondary.click();
                    onClose();
                  }
                : null
            }
            buttonPrimaryClick={
              notification && notification.buttonPrimary
                ? () => {
                    notification.buttonPrimary.click();
                    onClose();
                  }
                : null
            }
            size='size-s'
          />
        </>
      );
    });

  return renderNotifications();
}

export default connect(
  state => ({
    notifications: appGetters.getNotifications(state),
  }),
  dispatch => ({
    closeNotification: id => dispatch(appActions.closeNotification(id)),
    tickNotification: () => dispatch(appActions.tickNotification()),
  })
)(injectDevice(NotificationsRenderer));
