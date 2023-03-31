import React from "react";
import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import MediaQuery from "./media-query";

/**
 * HOC que inyecta el tipo de dispositivo en la _prop_ `device` del
 * componente al que rodea. `device` es un objeto con la siguiente
 * forma:
 *
 * { mobile: Boolean, desktop: Boolean }
 *
 * Sólo una propiedad (que se corresponde con el tipo de dispositivo
 * activo) toma el valor `true`.
 *
 * @param {Component} WrappedComponent el componente en el que se inyecta el tipo de dispositivo.
 */
const injectDevice = WrappedComponent => {
  const Wrapper = props => (
    <MediaQuery xs size={["XS"]}>
      {xs => (
        <MediaQuery sm size={["S","M"]}>
          {sm => {
            const mobile = xs || sm;
            const desktop = !mobile;

            const device = { mobile, desktop };

            return <WrappedComponent {...props} device={device} />;
          }}
        </MediaQuery>
      )}
    </MediaQuery>
  );

  Wrapper.propTypes = { ...WrappedComponent.propTypes };

  return setDisplayName(wrapDisplayName(WrappedComponent, "withDevice"))(Wrapper);
};

export default injectDevice;
