/* eslint-disable indent */
import { getApiBasePath, getAppBasePath } from "amiga-core/application/environment.js";
import {
  get as getRaw,
  post as postRaw,
  put as putRaw,
  del as delRaw,
  withToken,
} from "amiga-core/application/api-utils";

import builder from "@rsql/builder";
import { emit } from "@rsql/emitter";

import { endpoints } from "@/generalConfig";

const apiPath = getApiBasePath();
const basePath = getAppBasePath();

const PATH_VARS = {
  PEDIDOS_SERVICES_URL: "immspddsPath",
  INFORMES_SERVICES_URL: "immsrprtPath",
  STOCK_SERVICES_URL: "immsstokPath",
  AUTHENTICATION_URL: "authPath",
  OTRA_SERVICES_URL: "immsotraPath",
};

const applyPathParams = (uri, params) => {
  let finalUri = uri;

  Object.entries(params).forEach(entry => {
    const [k, v] = entry;
    const re = new RegExp(`:${k}`, "g");

    if (finalUri.indexOf(`:${k}`) !== -1) {
      finalUri = finalUri.replace(re, v);
    }
  });

  return finalUri
    .replace("//", "/")
    .replace("http:/", "http://")
    .replace("https:/", "https://");
};

const getEndpoint = (key, defaultValue = "") => {
  const endpoint = endpoints[key] || defaultValue;

  return applyPathParams(endpoint, {
    apiPath: apiPath,
    [PATH_VARS.PEDIDOS_SERVICES_URL]: window.PEDIDOS_SERVICES_URL,
    [PATH_VARS.STOCK_SERVICES_URL]: window.STOCK_SERVICES_URL,
    [PATH_VARS.OTRA_SERVICES_URL]: window.OTRA_SERVICES_URL,
    [PATH_VARS.INFORMES_SERVICES_URL]: window.INFORMES_SERVICES_URL,
    [PATH_VARS.AUTHENTICATION_URL]: window.AUTHENTICATION_URL,
  });
};

const crsfEndpoint = getEndpoint("csrftoken");

const asJson = res => res.json();
const asError = res => {
  if (res.type === "opaqueredirect") {
    window.location = getIMMSURL("/login.html#initDashboard/");
    return {};
  } else {
    if (res.status < 500) {
      return res.json().then(response => ({ hasError: true, httpStatus: res.status, ...response }));
    } else {
      return { hasError: true };
    }
  }
};

const withCors = fetchFn => (endpoint, options) =>
  fetchFn(endpoint, {
    ...options,
    mode: "cors",
  });

const disableRedirect = fetchFn => (endpoint, options) =>
  fetchFn(endpoint, {
    ...options,
    redirect: "manual",
  });

const withCsrfToken = withToken("X-CSRF-TOKEN")({
  requestToken: (refresh, oldToken) => {
    const req = refresh
      ? get(applyPathParams(crsfEndpoint, { apiPath }), {
          params: {
            token: oldToken,
          },
          mode: "cors",
          redirect: "manual",
        })
      : get(applyPathParams(crsfEndpoint, { apiPath }), {
          mode: "cors",
          redirect: "manual",
        });
    return req.then(res => res.headers.get("X-CSRF-TOKEN")).catch(asError);
  },
  requestTokenRetries: 5,
  waitForRetry: n => n * 1000,
});

/*
 *  Esto es para desactivar el overloading de las peticiones PUT y DELETE ya que
 *  amiga lo trata como un POST añadiendo un /delete o /update en el endpoint
 */
const disableOverload = fn => (endpoint, options) =>
  fn(endpoint, {
    overload: false,
    ...options,
  });

/**
 * Funcionalidad de autenticación en Janus
 */
const authError = res => res.status === 401 || res.status === 403;

const refreshToken = () => {
  console.log("Post to refresh token");
  return postRaw(window.AUTHENTICATION_URL + "/authenticate/refresh", {
    mode: "cors",
    credentials: "include",
  });
};

const withJanusAuth = fetchFn => (endpoint, options) => {
  const updatedOptions = {
    ...options,
    credentials: "include",
    mode: "cors",
  };

  const decoratedFetch = () => fetchFn(endpoint, updatedOptions);

  return decoratedFetch()
    .then(res => {
      if (res.ok) {
        return res;
      }
      throw res;
    })
    .catch(res => {
      if (authError(res)) {
        console.log("Auth error");
        return refreshToken()
          .then(decoratedFetch)
          .then(res => {
            if (res.ok) {
              return res;
            }
            throw res;
          })
          .catch(res => {
            logOut();
          });
      }
      throw res;
    });
};

const get = withJanusAuth(getRaw);
const post = withJanusAuth(disableOverload(postRaw));
const put = withJanusAuth(disableOverload(putRaw));
const del = withJanusAuth(disableOverload(delRaw));

const csrfGet = disableRedirect(withCors(getRaw));
const csrfPost = disableRedirect(withCors(postRaw));
const csrfPut = disableRedirect(withCors(disableOverload(putRaw)));
const csrfDel = disableRedirect(withCors(disableOverload(delRaw)));

export default disableOverload;

/**
 *	Login functions
 */
const credentialsEndpoint = endpoints["credentials"];
const logoutEndpoint = `${window.IMMS_BASE_PATH}/${endpoints["logout"]}`;

const promiseThen = new Promise((resolve, reject) => {
  setTimeout(() => {
      resolve({
        name: "John Doe",
        login: "central\\jondoe",
        serviceProvider: {
          serviceProviderId: 729198,
          serviceProviderName: "DEMATIC LOGISTIC SYSTEMS,S.A.",
        },
        roles: [ "sga.imms.activity.delete", "sga.imms.shift.report" ],
        technician: {
          technicianId: 125,
          technicianLogin: "central\\jondoe",
          technicianName: "John Doe",
          isTechnicianHead: true,
          serviceProviders: [
            {
              serviceProviderId: 5598,
            },
          ],
        },
      });
  }, 1000);
});

/* Obtienen los credenciales del usuario logueado o devuelve un 401 si no está logueado */
const getCredentials = () => {
  return promiseThen;
};

const checkCredentials = (username, password, endpoint = loginEndpoint) =>
  csrfPost(endpoint, {
    mode: "cors",
    credentials: "include",
    formData: {
      j_username: username,
      j_password: password,
    },
  });

/* Desloguea un usuario */
const logOut = () => {
  csrfPost(`${logoutEndpoint}`, {
    credentials: "include",
  })
    .then(() => {
      document.location = basePath;
    })
    .catch(() => {
      document.location = basePath;
    });
};

const getIMMSURL = relativePath => {
  return `${window.location.origin}${window.IMMS_BASE_PATH || ""}${relativePath}`;
};

/**
 * Function isValidJson
 * checks if a string is a json valid object
 * @param {string} json
 * @returns Boolean
 */
const isValidJson = json => {
  let valid = true;
  try {
    JSON.parse(json);
  } catch (e) {
    valid = false;
  }

  return valid;
};

const jsonToRSQL = json => {
  const keys = Object.keys(json);
  if (keys.length > 0) {
    let expression = null;
    keys.forEach((key, i) => {
      let expressionPart = null;
      if (isArray(json[key])) {
        expressionPart = builder.in(key, json[key]);
      } else if (!isNaN(json[key])) {
        expressionPart = builder.eq(key, `${json[key]}`.trim());
      } else if (json[key].start && json[key].end) {
        expressionPart = builder.and(
          builder.ge(key, json[key].start),
          builder.le(key, json[key].end)
        );
      } else if (key === "date") {
        // Dates should be considered as strings, but not include * at the begginning and end
        expressionPart = builder.eq(key, `${json[key]}`.trim());
      } else {
        if (json[key].indexOf("!") === 0) {
          expressionPart = builder.neq(
            key,
            `*${json[key]
              .trim()
              .replace("!", "")
              .replace(/\"/g, ' "')
              .replace(/\*/g, "")}*`
          );
        } else if (json[key].indexOf("<=") === 0) {
          expressionPart = builder.le(key, json[key].replace(/[<=]/g, ""));
        } else if (json[key].indexOf(">") === 0) {
          expressionPart = builder.gt(key, json[key].replace(/[>]/g, ""));
        } else if (json[key].indexOf("<") === 0) {
          expressionPart = builder.lt(key, json[key].replace(/[<]/g, ""));
        } else if (json[key].indexOf(">=") === 0) {
          expressionPart = builder.ge(key, json[key].replace(/[>=]/g, ""));
        } else {
          expressionPart = builder.eq(
            key,
            `*${json[key]
              .trim()
              .replace(/\"/g, ' "')
              .replace(/\*/g, "")}*`
          );
        }
      }

      if (i === 0) {
        expression = expressionPart;
      } else {
        expression = builder.and(expression, expressionPart);
      }
    });

    return emit(expression);
  }
  return "";
};

/**
 * Check if a item is a array
 * @param {any} item
 */
function isArray(item) {
  return item && typeof item === "object" && Array.isArray(item);
}

function getUserName(text = "") {
  if (text.indexOf("\\") !== -1) {
    return text.split("\\")[1];
  }

  return text;
}

//Se devuelven los 2 primeros caracteres del login, sin tener en cuenta el dominio, en mayusculas.
function getUserNameAbbr(text = "") {
  const abbr = text.indexOf("\\") !== -1 ? text.split("\\")[1] : text;

  return abbr.length > 2 ? abbr.substring(0, 2).toUpperCase() : abbr.toUpperCase();
}

function discardArtAndPrepFromNames(arrayName) {
  const articlesAndPreps = ["el", "la", "los", "las", "de", "del", "da", "de", "do", "dos", "das"];

  const nameWithoutArtsAndPreps = [];
  // Se descartan los artículos y preposiciones de los nombres
  // el, la, de, del, de la, de los, en español; da, de, do, dos, en portugués/gallego
  if (arrayName) {
    if (Array.isArray(arrayName) && arrayName.length > 0) {
      arrayName.forEach(namePart => {
        if (namePart && !articlesAndPreps.includes(namePart.toLowerCase())) {
          nameWithoutArtsAndPreps.push(namePart);
        }
      });
    } else {
      // nombre sin apellidos
      nameWithoutArtsAndPreps.push(arrayName);
    }
  }
  return nameWithoutArtsAndPreps;
}


//Se devuelven 2 caracteres. El primero del nombre del empleado, y el segundo del primer carácter del apellido, en mayusculas.
function getUserNameAbbrByName(text = "") {
  const originalArrayName = text && text.indexOf(" ") !== -1 ? text.split(" ") : text;
  // Se descartan los artículos y preposiciones de los nombres
  const arrayName = discardArtAndPrepFromNames(originalArrayName);

  let abbr = "";
  if (arrayName?.length > 0 && arrayName[0].length > 0) {
    // Primer caracter del nombre
    abbr += arrayName[0].substring(0, 1);
    if (Array.isArray(arrayName)) {
      // Primer caracter del primer apellido
      if ((arrayName.length == 2 || arrayName.length == 3)) {
        abbr += arrayName[1].substring(0, 1);
      } else if (arrayName.length > 3) {
        // Tiene nombre compuesto: se toma el primer caracter del penúltimo texto
        abbr += arrayName[arrayName.length - 2].substring(0, 1);
      }
    }
  }
  
  return abbr.toUpperCase();
}

//Abreviatura de usuarios AUTO, AUTO_AZURE y AUTO_SIGLO
function getUserAutoAbbr(text = "") {
  const arrayName = text && text.indexOf("_") !== -1 ? text.split("_") : text;

  let abbr = "";
  if (arrayName?.length > 0 && arrayName[0].length > 0) {
    abbr += arrayName[0].substring(0, 1);
    if (Array.isArray(arrayName) && arrayName.length > 1) {
      abbr += arrayName[1].substring(0, 1);
    }
  }
  return abbr.toUpperCase();
}

/**
 * Obtiene array de logins
 * @param {*} users array de usuarios con propiedad login
 * @returns array de logins sin duplicados 
 */
const getLoginsArray = (users) => {
  const loginsArr = [];
  users?.forEach(({ login, name }) => {
    if ((!name || name?.length == 0)
        && !loginsArr.includes(login)){
      loginsArr.push(login);
    }
  })
  return loginsArr;
}

const getNameFromUserNames = (userNames, login) => {
  if (userNames?.length > 0 && login
    && userNames.find(user => user.login === login)) {
    return userNames.find(user => user.login === login).name;
  }
  return null;
}

function debounce(fn, wait = 500) {
  let t;
  return function() {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, arguments), wait);
  };
}

export {
  applyPathParams,
  csrfGet,
  csrfPost,
  csrfPut,
  csrfDel,
  get,
  post,
  put,
  del,
  getCredentials,
  logOut,
  asJson,
  asError,
  getEndpoint,
  checkCredentials,
  getIMMSURL,
  isValidJson,
  jsonToRSQL,
  getUserName,
  getUserNameAbbr,
  getUserNameAbbrByName,
  getUserAutoAbbr,
  getNameFromUserNames,
  getLoginsArray,
  debounce,
};
