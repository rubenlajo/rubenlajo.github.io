import React, { Children } from "react";
import PropTypes from "prop-types";
import Media from "react-media";
import { pick, keys, values, filter } from "ramda";

/*
 * Estos tamaños de breakpoints tienen que coincidir con los que se
 * especifican en las CSS de la guía Faro.
 */
export const __AMIGA_FRAMEWORK_BREAKPOINT_SIZES__ = {
  xs: "(max-width: 767px)",
  sm: "(min-width: 768px) and (max-width: 1023px)",
  md: "(min-width: 1024px) and (max-width: 1279px)",
  lg: "(min-width: 1280px)",
};

const composeQueries = queries => queries.join(",");

const queriesForSizes = sizes => {
  const activeSizes = filter(k => sizes[k], keys(__AMIGA_FRAMEWORK_BREAKPOINT_SIZES__));

  return values(pick(activeSizes, __AMIGA_FRAMEWORK_BREAKPOINT_SIZES__));
};

/**
 * Permite controlar el renderizado de sus hijos mediante _media queries_.
 *
 * El _framework_ define cuatro _breakpoints_ por defecto en función del ancho
 * del _viewport_, que se pueden especificar mediante _props_: `xs`, `sm`, `md`
 * y `lg`. Estos _breakpoints_ se pueden combinar en un mismo componente:
 *
 * ```js
 * <MediaQuery xs sm>...</MediaQuery>
 * ```
 *
 * También se puede especificar una _media query_ personalizada usando la
 * _prop_ `query`:
 *
 * ```js
 * <MediaQuery lg query="(min-aspect-ration: 16/9)">...</MediaQuery>
 * ```
 *
 * Si `children` es una función, se invocará con
 * un booleano que indica si se satisface la
 * _query_.
 */
const MediaQuery = ({ xs = false, sm = false, md = false, lg = false, query, Wrapper = "div", children }) => {
  const queries = queriesForSizes({ xs, sm, md, lg });

  if (query) {
    queries.push(query);
  }

  const mediaQuery = composeQueries(queries);

  if (typeof children === "function") {
    return <Media query={mediaQuery}>{children}</Media>;
  }

  const contents = Children.count(children) > 0 ? <Wrapper>{children}</Wrapper> : children;

  return <Media query={mediaQuery} render={() => contents} />;
};

MediaQuery.propTypes = {
  /**
   * Si toma el valor `true`, el hijo del componente sólo se
   * mostrará en pantallas de menos de 768px.
   */
  xs: PropTypes.bool,

  /**
   * Si toma el valor `true`, el hijo del componente sólo se
   * mostrará en pantallas de entre 768px y 1023px.
   */
  sm: PropTypes.bool,

  /**
   * Si toma el valor `true`, el hijo del componente sólo se
   * mostrará en pantallas de entre 1024px y 1279px.
   */
  md: PropTypes.bool,

  /**
   * Si toma el valor `true`, el hijo del componente sólo se
   * mostrará en pantallas de más de 1280px.
   */
  lg: PropTypes.bool,

  /**
   * Permite especificar una _media-query_ personalizada. Cualquier
   * valor que cumpla la especificación se puede utilizar en esta
   * _prop_. Si se especifica también alguno de los tamaños prefijados,
   * las _queries_ se combinarán mediante un _OR_.
   */
  query: PropTypes.string,

  /**
   * _Wrapper_ con el que rodear el contenido cuando el componente tiene más de
   * un hijo. Por defecto se usa un `div`.
   */
  Wrapper: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default MediaQuery;
