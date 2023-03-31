import React, { Component } from "react";
import { setCurrentLocale } from "amiga-core/components/locale/global-locale";
import LocaleSelector from "amiga-core/components/locale/locale-selector";
import { Select } from "lib-frontsga";

import "./styles.css";

const localeNames = {
  "locale.en": "English",
  "locale.es": "Español",
};

class CustomLocaleSelector extends LocaleSelector {
  render() {
    const availableLocales = [
      { label: "Español", value: "es" },
      { label: "Ingles", value: "en" },
    ];
    return (
      <div className="custom-locale-selector">
        <Select
          label="Elige tu idioma"
          placeholder="Selecciona una opción"
          onChange={(loc) => {
            this.selector.props.onStartLocaleChange(loc[0].value);
            setTimeout(() => setCurrentLocale(loc[0].value), 1000);
          }}
          options={availableLocales}
          value={availableLocales.filter(
            (l) => l.value == this.selector.props.locale
          )}
        />
      </div>
    );
  }
}

export default CustomLocaleSelector;
