import { intl } from "amiga-core/components/i18n";
import { get, getEndpoint, asJson, asError } from "@/utils/";

const materialClasificationEndpoint = getEndpoint("materialClasifications");

const fetchMaterialClassifications = () =>
  get(materialClasificationEndpoint, { params: { locale: intl.locale } })
    .then(asJson)
    .catch(asError);

export default {
  fetchMaterialClassifications,
};
