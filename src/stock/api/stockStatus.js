import { intl } from "amiga-core/components/i18n";
import { get, getEndpoint, asJson, asError } from "@/utils/";

const stockStatusEndpoint = getEndpoint("stockStatus");

const fetchStockStatus = () =>
  get(stockStatusEndpoint, { params: { locale: intl.locale } })
    .then(asJson)
    .catch(asError);

// Exposed api methods
export default {
  fetchStockStatus,
};
