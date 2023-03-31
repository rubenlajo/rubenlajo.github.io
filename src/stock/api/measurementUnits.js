import { intl } from "amiga-core/components/i18n";
import { get, getEndpoint, asJson, asError } from "@/utils/";

const measurementsUnitEndpoint = getEndpoint("measurementsUnit");

const fetchMeasurementsUnit = () =>
  get(measurementsUnitEndpoint, { params: { locale: intl.locale } })
    .then(asJson)
    .catch(asError);

export default {
  fetchMeasurementsUnit,
};
