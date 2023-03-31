import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { intl } from "amiga-core/components/i18n";

import {
  Form,
  TextField,
  Button,
  FormField,
  Select,
  MultiselectInline,
  DateTimePicker,
} from "lib-frontsga";

import "./styles.css";

const FIELD_TYPES = {
  TEXT: "text",
  SELECT: "select",
  DATETIME: "datetime",
};

const propTypes = {
  /**
   * Prop: Title
   * The title of the form
   */
  title: PropTypes.string,
  /**
   * Prop: <fields>
   * array de objectos como este:
   * {
   *    type: text / select / date
   *    field: "field-name"
   *    label: "display name"
   *    options: label - value object array (solo para tipo select)
   *    multi: boolean -> indica si se pueden seleccionar varios valores
   * }
   *
   */
  fields: PropTypes.array.isRequired,

  /**
   * Prop: <onChange>
   * función que será llamada con cada cambio
   */
  onChange: PropTypes.func,
  /**
   * Prop: <onSubmit>
   * funcion que será llamada al hacer click en filtrar
   */
  onSubmit: PropTypes.func,
  /**
   * Prop: <onReset>
   * funcion que será llamada al limpiar el filtro
   */
  onReset: PropTypes.func,
  /**
   * Prop: <inline>
   * flag que indica si la botonera del filtro se mostrará en la misma línea o en la siguiente.
   */
  inline: PropTypes.bool,
  /**
   * Prop: <activeFilters>
   * valores por defecto con los que se inicializa el filtro
   * Array de objetos {label:value} con los filtros activos  (Si no está vacío se muestra esto en vez del formulario)
   */
  activeFilters: PropTypes.object,
};

function Filters(props) {
  const {
    title,
    fields,
    onChange,
    onSubmit,
    onReset,
    inline,
    activeFilters,
  } = props;
  const [values, setValues] = useState(activeFilters);

  useEffect(() => {
    setValues(activeFilters);
  }, [activeFilters]);

  const renderFields = () => {
    return fields.map((field) => {
      switch (field.type) {
        case FIELD_TYPES.TEXT:
          return (
            <TextField
              autoComplete={false}
              key={field.field}
              field={field.field}
              label={field.label}
              required={field.required}
            />
          );
        case FIELD_TYPES.SELECT:
          return (
            <FormField
              key={field.field}
              field={field.field}
              label={field.label}
              required={field.required}
            >
              {
              field.multi ? 
                <MultiselectInline
                  key={field.field + "-select"}
                  autoComplete={false}
                  options={field.options}/>
                : 
                <Select
                  key={field.field + "-select"}
                  autoComplete={false}
                  options={field.options}/>
              }
            </FormField>
          );
        case FIELD_TYPES.DATETIME:
          return (
            <FormField
              key={field.field}
              field={field.field}
              label={field.label}
              required={field.required}>
              <DateTimePicker 
                locale={intl.locale}
              />
            </FormField>
          );
        default:
          return null;
      }
    });
  };

  const renderButtons = () => {
    const buttons = [];

    if (typeof onReset === "function") {
      buttons.push(
        <Button
          key="btn-reset"
          kind="secondary"
          type="reset"
          label={intl.formatMessage({ id: "shared.filters.clear-filters" })}
        />
      );
    }

    buttons.push(
      <Button
        key="btn-submit"
        kind="primary"
        type="submit"
        label={intl.formatMessage({ id: "shared.filters.filter" })}
      />
    );

    return buttons;
  };

  const handleOnReset = () => {
    setValues({});

    if (onReset) {
      onReset();
    }
  };

  return (
    <div className={`filter  ${inline ? "inline-filter" : ""}`}>
      {title ? <div className="filters-title">{title}</div> : null}
      <Form
        key={`${JSON.stringify(fields)} ${JSON.stringify(values)}`}
        className="filters-form"
        onChange={onChange}
        onSubmit={onSubmit}
        onReset={handleOnReset}
        defaultValue={values}
      >
        <div className="filter-fields">{renderFields()}</div>
        <div className="button-container">{renderButtons()}</div>
      </Form>
    </div>
  );
}

Filters.propTypes = propTypes;

export default Filters;
