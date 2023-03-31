import { intl } from "amiga-core/components/i18n";
import { get, csrfGet, csrfPost, getEndpoint, asJson, asError } from "@/utils/";
import { applyPathParams } from "../../utils";

const centersEndpoint = getEndpoint("centers");
const centerEndpoint = getEndpoint("center");
const sfiStatusEndpoint = getEndpoint("sfiStatus");
const appMetadataEndpoint = getEndpoint("appMetadata");
const userPhotoEndpoint = getEndpoint("userPhoto");
const userNamesEndpoint = getEndpoint("userNames");

const fetchCenters = () => {
  return csrfGet(centersEndpoint)
    .then(asJson)
    .catch(asError);
};

const fetchCenter = (centerId) => {
  return get(applyPathParams(centerEndpoint, { centerId }))
    .then(asJson)
    .catch(asError);
};

/**
 * SFI Status
 */
const fetchStatusSFI = () =>
  get(sfiStatusEndpoint, { params: { locale: intl.locale } })
    .then(asJson)
    .catch(asError);

const promiseThen = new Promise((resolve, reject) => {
  setTimeout(() => {
      resolve({"versions":[{"name":"AppIMMS","version":"3.14.1"},{"name":"IMMSPDDS","version":"1.17.0"},{"name":"IMMSRPRT","version":"1.16.0"},{"name":"IMMSSTOK","version":"1.6.0"},{"name":"IMMSOTRA","version":"1.15.1"}],"immsReadOnly":false,"lastHistorificationDate":null,"historicalBatchProcessTime":null});
  }, 1000);
});

/**
 * SFI Status
 */
const fetchAppMetadata = () => promiseThen;

const fetchUserPhoto = (userLogin) =>
  csrfGet(userPhotoEndpoint, { params: { userLogin } })
    .then(asJson)
    .catch(asError);

const fetchUserNames = users => {
  const loginsArr = [];
  users?.forEach((login) => {
    if (!loginsArr.includes(login)){
      loginsArr.push(login);
    }
  });

  const result = new Promise((resolve, reject)=>{
    const logins = loginsArr.join(',');
    csrfGet(userNamesEndpoint, { params: { logins } }).then((res) =>{
      res.json().then((data) =>{
        resolve(data);
      })
    }).catch((error) =>{
      reject(asError(error));
    });
  });
  return result;
};

// Exposed api methods
export default {
  fetchCenters,
  fetchCenter,
  fetchStatusSFI,
  fetchAppMetadata,
  fetchUserPhoto,
  fetchUserNames
};
