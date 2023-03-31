import React, { useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import injectAuthenticationContext from "amiga-core/components/auth/inject-authentication-context";
import injectUser from "application/connectors/injectUser";
import PageProperties from "amiga-core/components/pages/page-properties";
import { intl } from "amiga-core/components/i18n";
import { default as DefaultLoader } from "amiga-core/components/loader/loader";
import { default as DefaultOverlayLoader } from "amiga-core/components/loader/overlay-loader";
import SideMenu from "shared/components/side-menu/";
import injectDevice from "./inject-device";
import MainContentWrapper from "./main-content-wrapper";
import NotificationsRenderer from "./notifications-renderer";
import DefaultLayerOutputs from "./default-layer-outputs";
import { ConduitProvider } from "react-conduit";
import injectWarehouse from "../../connectors/injectWarehouse";
import injectUserPhotos from "application/connectors/injectUserPhotos";
import OverlayLoader from "./overlay-loader";

import "./styles.css";

const propTypes = {
  /**
   * Contenido de la app
   */
  children: PropTypes.any,
  /**
   * Clase adicional que tendrá el wrapper del framewok
   */
  className: PropTypes.string,
  /**
   * Titulo de la página
   */
  title: PropTypes.string,
  /**
   * Renderizador de los mensajes de notificación
   */
  NotificationRenderer: PropTypes.any,
  /**
   * Renderizador del "cargando..."
   */
  Loader: PropTypes.any,
  /**
   * Logo de la app
   */
  logo: PropTypes.any,
  /**
   * Contenido del menú lateral
   *
   * Debe ser un array de objetos asi:
   *  [
   *    { to: "", label: "Stock", icon: "sga-icon-tools", forRoles: ["admin"] },
   *    { to: "", label: "Opción 4", icon: "sga-icon-dot-circle", forRoles: ["admin"] },
   * ]
   */
  menu: PropTypes.func,
  /**
   * Objeto de usuario donde se indica el nombre, los roles y la imagen de perfil
   */
  user: PropTypes.object,
  /**
   * objeto con funciones para manejar la sesión
   */
  authenticationContext: PropTypes.object,
  /**
   * Callback que se llama al pulsar sobre el icono de notificaciones del menú
   */
  onNotifications: PropTypes.func,
  /**
   * Callback que se llama al pulsar sobre el icono de configuración del menú
   */
  onSettings: PropTypes.func,
  /**
   * Iniciales del proyecto que se muestran a modo de logo en el menú
   */
  headerLabel: PropTypes.string,
  /**
   * Indicador de que el usuario tiene notificaciones
   */
  withBadge: PropTypes.bool,
  /**
   * Dispositivo donde se está ejecutando la app ["desktop", "mobile"]
   */
  device: PropTypes.object,
  /**
   * Información sobre versiones e historificación
   */
  appMetadata: PropTypes.object,
  /**
   * Funcion para obtener información sobre las versiones e historificación
   */
  fetchAppMetadata: PropTypes.func,
};

/**
 * Componente layou para framework AMIGA
 *
 * Deps.
 *  - lib-frontsga
 *  - amiga
 */
const SGALayout = props => {
  const {
    children,
    className,
    title = intl.formatMessage({ id: "amiga.components.layout.title" }),
    logo,
    menu,
    user,
    authenticationContext,
    onNotifications,
    onSettings,
    headerLabel,
    withBadge,
    device,
    Loader,
    OverlayLoader,
    appMetadata,
    fetchAppMetadata,
    userPhotos,
    fetchUserPhoto,
  } = props;

  useEffect(() => {
    if (appMetadata === null) {
      fetchAppMetadata();
    }
  }, []);

  /*useEffect(() => {
    if (user.login && !userPhotos[user.login]) {
      fetchUserPhoto(user.login);
    }
  }, [user]);*/

  const layoutClassName = cn("app-layout", "app-layout--sga", device, className);

  const avatarName = user.name;
  const avatarLogin = user.login;
  // ? `${user.name
  //     .split(" ")
  //     .map((word) => word.charAt(0))
  //     .join("")
  //     .toUpperCase()}`
  // : `N A`;

  return (
    <ConduitProvider>
      <div className={layoutClassName}>
        <PageProperties titleTemplate={`%s - ${title}`} defaultTitle={title} />
        <Loader />
        <OverlayLoader />
        <SideMenu
          withBadge={withBadge}
          headerImage={logo}
          headerLabel={headerLabel}
          options={menu(user.roles, device)}
          onLogout={authenticationContext.logOut}
          onNotifications={onNotifications}
          onSettings={onSettings}
          profileImage={
            userPhotos[user.login] ? `data:image;base64, ${userPhotos[user.login]}` : null
          }
          avatarName={avatarName.trim()}
          avatarLogin={user.login}
        />
        <MainContentWrapper>{children}</MainContentWrapper>
        <DefaultLayerOutputs />
        <NotificationsRenderer />
      </div>
    </ConduitProvider>
  );
};

SGALayout.defaultProps = {
  OverlayLoader: OverlayLoader,
  Loader: DefaultLoader,
};

SGALayout.propTypes = propTypes;

export default injectWarehouse(
  injectAuthenticationContext(injectDevice(injectUser(injectUserPhotos(SGALayout))))
);
