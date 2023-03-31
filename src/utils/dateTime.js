import { moment } from "amiga-core/application/i18n/moment";
import { intl } from "amiga-core/components/i18n";
import { dateFormat, dateFormatEN } from "@/generalConfig";

export const formatDate = (date) => moment(date).format(intl.locale === "es" ? dateFormat : dateFormatEN);
