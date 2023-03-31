import React from "react";
import PropTypes from "prop-types";
import { intl } from "amiga-core/components/i18n";
import { moment } from "amiga-core/application/i18n/moment";
import { TextField } from "lib-frontsga";

const DATE_FORMAT = "DD/MM/YYYY HH:mm";
const INPUT_MASK = "99/99/2099 99:99";

const propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  mask: PropTypes.string,
  /*errors: PropTypes.errors,*/
};

function DateTime(props) {
  const { label, value, disabled, format, mask, errors } = props;

  const isCorrectFormat = (dateString) => {
    return moment(dateString, format, true).isValid();
  };

  let fieldErrors = [];
  if (errors.length > 0) {
    fieldErrors = errors;
  } else if (!!value && !isCorrectFormat(value)) {
    fieldErrors.push(
      intl.formatMessage({ id: "shared.fields.date-time.novalid" })
    );
  }

  return (
    <TextField
      {...props}
      className={`date-time__input ${
        isCorrectFormat(value) ? "is-valid" : null
      }`}
      label={label}
      disabled={disabled}
      value={value}
      mask={mask}
      errors={fieldErrors}
    />
  );
}

DateTime.defaultProps = {
  disabled: false,
  format: DATE_FORMAT,
  mask: INPUT_MASK,
  errors: [],
};

DateTime.propTypes = propTypes;

export default DateTime;
