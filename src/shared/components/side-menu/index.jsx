import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "amiga-core/components/router/link";
import { Icon } from "lib-frontsga";

import { getBreadcrumbIconSize } from "@/utils/utilsSize";

import "./side-menu.css";
import AvatarWrapper from "../avatar-wrapper/AvatarWrapper";

/* istanbul ignore next */
const propTypes = {
  /**
   * Imagen de la cabecera del menu, que será siempre el logo de la aplicación
   */
  headerImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Imagen de usuario que se mostrará en la parte inferior del menú.
   * Si no se le pasa una imagen, por defecto cogerá las iniciales del usuario
   */
  profileImage: PropTypes.string,
  /**
   * Label con el nombre corto de la aplicación (se espera un string de 2 letras)
   */
  headerLabel: function(props, propName) {
    if (typeof props.headerLabel !== "string" || props.headerLabel.length !== 2) {
      return new Error(`${propName} needs to be an string of two items`);
    }
  },
  /**
   * Conjunto de configuraciones que se montarán en el menú:
   * - Rutas
   * - Labels de las secciones
   * - Secciones
   * - Subsecciones
   */
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  /**
   * Función llamada al hacer click en el botón logout
   */
  onLogout: PropTypes.func,
  /**
   * Función llamada al hacer click en el botón de notificaciones
   */
  onNotifications: PropTypes.func,
  /**
   * Función llamada al hacer click en el botón de ajustes
   */
  onSettings: PropTypes.func,
  /**
   * Especifica el tamaño del componente. Por defecto es tamaño M
   */
  size: PropTypes.string,
  /**
   * Nombre completo para el avatar
   */
  avatarName: PropTypes.string,
  /**
   * Muestra el Badge de notificación en el avatar
   */
  withBadge: PropTypes.bool,
  /**
   * Función que lanza el icono secundario de la barra superior (solo si está prevista resolución mobile)
   */
  mobileIconOnClick: PropTypes.func,
};

const SideMenu = ({
  disabled,
  headerImage,
  headerLabel,
  onLogout,
  onNotifications,
  onSettings,
  options,
  size,
  avatarName,
  avatarLogin,
  withBadge,
  mobileIconOnClick,
}) => {
  const iconSize = getBreadcrumbIconSize(size);

  const [sideMenuState, setSideMenuState] = useState({ open: false });
  /* istanbul ignore next */
  const toggleMenu = (state = false) => {
    setSideMenuState({ open: state });
  };
  const [activeMenu, setActiveMenu] = useState();
  const [activeSubMenu, setActiveSubMenu] = useState(false);
  const [activeSubOptions, setActiveSubOptions] = useState();
  const [mobileVisibility, setMobileVisibility] = useState(false);

  /* istanbul ignore next */
  const hoverOn = active => {
    if (!disabled) {
      setActiveMenu(active);
      toggleMenu(true);
    }
  };
  const hoverOff = () => {
    setActiveMenu(0);
    toggleMenu(false);
    setActiveSubMenu(false);
  };
  const closeMenu = () => {
    toggleMenu(false);
  };

  return (
    <div
      className={`side-menu ${
        sideMenuState.open || mobileVisibility ? "side-menu--open" : "side-menu--closed"
      }`}
    >
      {/* MENU PRINCIPAL */}
      {!activeMenu ? (
        <div className='menu-mobile-bar'>
          <div
            className='menu-mobile-bar__icon'
            onClick={() => {
              setMobileVisibility(true);
              if (mobileIconOnClick) {
                mobileIconOnClick();
              }
            }}
          >
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            {/* <span className="icon-bar"></span> */}
          </div>
        </div>
      ) : null}
      {/* Contiene los iconos y la barra que está visible siempre */}
      <div className='row-header' onMouseEnter={() => hoverOn()} onMouseLeave={() => hoverOff()}>
        <div className='primary-header'>
          {/* renderizado condicional de close icon para versión mobile */}
          {mobileVisibility ? (
            <Icon
              icon='sga-icon-times'
              iconColor='#e6e6e6'
              onClick={() => {
                setMobileVisibility(false);
                setSideMenuState({ open: false });
              }}
            />
          ) : (
            <span className='primary-header__label'>{`${headerLabel}`}</span>
          )}
        </div>
        <div className={`header-icon secondary-header`}>
          <img src={headerImage} className='secondary-header__logo' />
        </div>
      </div>
      <div className='row-menu' onMouseEnter={() => hoverOn()} onMouseLeave={() => hoverOff()}>
        <div className={`menu-primary ${size || ""} ${mobileVisibility ? "opened" : ""}`}>
          <div className='primary-body'>
            {options.map((option, i) => {
              return (
                <span
                  key={option.label}
                  className={`primary-body__options icon ${option.icon} ${
                    activeMenu === option.label ? "primary-body__options--active" : ""
                  }`}
                  onMouseEnter={() => hoverOn(option.label)}
                />
              );
            })}
          </div>
        </div>
        {/* MENU SECUNDARIO */}
        {/* Continee las opciones principales del menú */}
        <div className={`menu-secondary ${size || ""}`}>
          <div className='secondary-body'>
            {options.map(option => {
              if (option.subOptions === undefined) {
                // SI NO HAY SUBOPCIONES DENTRO DE LA OPCIÓN, CREA UN LINK
                if (
                  option.disabled !== true &&
                  (option.to.indexOf("http") !== -1 || option.to.indexOf("https") !== -1)
                ) {
                  return (
                    <a
                      key={option.label}
                      href={option.to}
                      target={option.external ? "_blank" : "_self"}
                      className={`secondary-body__options ${
                        activeMenu === option.label ? "secondary-body__options--active" : ""
                      }`}
                      onClick={
                        option.buttonOnClick
                          ? () => {
                              option.buttonOnClick();
                              setSideMenuState({ open: false });
                            }
                          : () => {
                              setSideMenuState({ open: false });
                            }
                      }
                    >
                      {option.label}
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={option.label}
                      onClick={
                        // ejecución de funciones de cierre de todo el menú para versión mobile
                        mobileVisibility
                          ? () => {
                              closeMenu();
                              setMobileVisibility(false);
                              setSideMenuState({ open: false });
                            }
                          : () => {
                              closeMenu();
                            }
                      }
                      className={`secondary-body__options ${
                        activeMenu === option.label ? "secondary-body__options--active" : ""
                      }`}
                      onMouseEnter={() => hoverOn(option.label)}
                      to={option.to}
                    >
                      {option.label}
                    </Link>
                  );
                }
              } else {
                // SI HAY SUBOPCIONES DENTRO DEL LINK, CREA UN SPAN, QUE DESPLIEGA EL MENÚ DE SUBOPCIONES
                return (
                  <span
                    key={option.label}
                    onClick={() => {
                      setActiveSubMenu(true);
                      setActiveSubOptions(option.label);
                    }}
                    className={`secondary-body__options ${
                      activeMenu === option.label ? "secondary-body__options--active" : ""
                    }`}
                    onMouseEnter={() => hoverOn(option.label)}
                    to={option.to}
                  >
                    {option.label}
                  </span>
                );
              }
            })}
            {/* SUBMENU */}
            {/* Contiene las subopciones del menú */}
            <div
              className={`sub-menu ${
                activeSubMenu === true ? "sub-menu--open" : "sub-menu--close"
              }`}
            >
              <Icon
                onClick={() => setActiveSubMenu(false)}
                icon='sga-icon-arrow-left'
                iconColor='#fcdd82'
                iconSize={iconSize}
              />
              <div className='suboptions-name'>
                {options.map(option => {
                  if (option.subOptions && option.label === activeSubOptions) {
                    return `${option.label}`;
                  }
                })}
              </div>
              {options.map(option => {
                if (option.subOptions && option.label === activeSubOptions) {
                  return option.subOptions.map(subOption => {
                    if (
                      subOption.disabled !== true &&
                      (subOption.to.indexOf("http") !== -1 || subOption.to.indexOf("https") !== -1)
                    ) {
                      // Botón para rutas externas
                      return (
                        <a
                          key={subOption.label}
                          href={subOption.to}
                          target={subOption.external ? "_blank" : "_self"}
                          className={`sub-menu__options ${size || ""} ${
                            subOption.disabled === true ? "disabled" : ""
                          }`}
                          onClick={
                            subOption.buttonOnClick
                              ? () => {
                                  subOption.buttonOnClick();
                                  setSideMenuState({ open: false });
                                }
                              : () => {
                                  setSideMenuState({ open: false });
                                }
                          }
                        >
                          {subOption.label}
                        </a>
                      );
                    } else {
                      return (
                        <Link
                          key={subOption.label}
                          onClick={
                            //ejecución condicional en caso de versión mobile
                            mobileVisibility
                              ? () => {
                                  closeMenu();
                                  setMobileVisibility(false);
                                  setSideMenuState({ open: false });
                                  setActiveSubMenu(false);
                                }
                              : () => {
                                  closeMenu();
                                }
                          }
                          className={`sub-menu__options ${
                            activeMenu === subOption.label ? "sub-menu__options--active" : ""
                          }`}
                          onMouseEnter={() => hoverOn(subOption.label)}
                          to={subOption.to}
                        >
                          {subOption.label}
                        </Link>
                      );
                    }
                  });
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='row-footer' onMouseEnter={() => hoverOn()} onMouseLeave={() => hoverOff()}>
        <div className='primary-footer profile'>
          <AvatarWrapper users={[{ name: avatarName, login: avatarLogin }]} />
        </div>
        <div className={`secondary-footer`}>
          <Icon
            className='secondary-footer__icon'
            icon='sga-icon-bell'
            badge={withBadge}
            onClick={onNotifications}
          />
          <Icon className='secondary-footer__icon' icon='sga-icon-wrench' onClick={onSettings} />
          <Icon className='secondary-footer__icon' icon='sga-icon-power-off' onClick={onLogout} />
        </div>
      </div>
    </div>
  );
};

SideMenu.propTypes = propTypes;

export default SideMenu;
