import PropTypes from "prop-types";
import React from "react";
import cn from "classnames";
import { intl } from "amiga-core/components/i18n";
import PageProperties from "amiga-core/components/pages/page-properties";
import loginImage from "./images/login-image.png";
import immslogo from "../../../assets/images/imms_logo.svg";
import "./styles.css";

/**
 * _Layout_ por defecto utilizado en las pantallas relacionadas con el proceso de _login_.
 *
 * Es una versión simplificada del _layout_ de aplicación. Sólo muestra el
 * título de la aplicación, una zona de contenido y un pie con el número de
 * versión y el selector de idioma.
 */
const DefaultLoginLayout = ({
  title = intl.formatMessage({ id: "amiga.components.layout.title" }),
  version,
  children,
  className,
  // locale,
  // setLocale,
}) => {
  return (
    <div className={cn("app-layout app-layout--login", className)}>
      <PageProperties titleTemplate={`%s - ${title}`} defaultTitle={title} />
      <div className="app-layout-content--login">
        <div className="app-layout-content__main">
          <div className="login-content">
            <div className="logo">
              <img src={immslogo} />
            </div>
            {children}
            <div className="language-selector"></div>
          </div>
          <div className="login-image">
            <img src={loginImage} />
          </div>
        </div>
        <div className="right-column">
          <div className="slogan">
            <p>{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

DefaultLoginLayout.propTypes = {
  /**
   * Título de la aplicación. Si no se especifica, se utilizará el valor de
   * traducción de la clave "amiga.components.layout.title".
   */
  title: PropTypes.string,

  /**
   * Número de versión de la aplicación
   */
  version: PropTypes.string,

  /**
   * Clase adicional que se aplicará al componente.
   */
  className: PropTypes.string,
};

export default DefaultLoginLayout;
