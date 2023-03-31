import { intl } from "amiga-core/components/i18n";
import { get, getEndpoint, asJson, asError } from "@/utils/";

const materialCriticalityTypeEndpoint = getEndpoint("materialCriticalityType");

const fetchMaterialCriticalityTypes = () =>
  get(materialCriticalityTypeEndpoint, { params: { locale: intl.locale } })
    .then(asJson)
    .catch(asError);

export default {
  fetchMaterialCriticalityTypes,
};
