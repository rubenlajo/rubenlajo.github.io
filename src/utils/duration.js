import { T, intl } from "amiga-core/components/i18n";
import moment from "moment";

const defaultOptions = {
  short: false,
};

export const printDuration = (min, { short } = defaultOptions) => {
  const duration = moment.duration({ minutes: min });

  const days = duration.days();
  const haveDays = days > 0;
  const hours = duration.hours();
  const minutes = duration.minutes();
  const haveHours = hours > 0;
  const haveMinutes = minutes > 0;

  const literals = {
    day: short ? "day-short" : "day",
    days: short ? "day-short" : "days",
    hour: short ? "hour-short" : "hour",
    hours: short ? "hour-short" : "hours",
    minute: short ? "minute-short" : "minute",
    minutes: short ? "minute-short" : "minutes",

    and: short ? "" : intl.formatMessage({ id: "and" }),
  };

  const daysStr = `${days}${intl.formatMessage({ id: days === 1 ? literals.day : literals.days })}`;

  const hoursStr = `${hours}${intl.formatMessage({ id: hours === 1 ? literals.hour : literals.hours })}`;

  const minutesStr = `${minutes}${intl.formatMessage({ id: minutes === 1 ? literals.minute : literals.minutes })}`;

  if (min === 0) {
    return minutesStr;
  }

  return (
    `${haveDays ? daysStr : ""}${haveDays && haveHours && haveMinutes && !short ? `, ` : " "}` +
    `${haveDays && haveHours && !haveMinutes ? ` ${literals.and} ` : ""}` +
    `${haveDays && !haveHours && haveMinutes ? ` ${literals.and} ` : ""}` +
    `${haveHours ? hoursStr : ""}` +
    `${haveHours && haveMinutes ? ` ${literals.and} ` : ""}` +
    `${haveMinutes ? minutesStr : ""}`
  );
};
