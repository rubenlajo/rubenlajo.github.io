import React, { useState, useEffect } from "react";

import { RadioGroup, Icon, Button, Radio } from "lib-frontsga";
import { intl } from "amiga-core/components/i18n";

import MobileSlidePanel from "shared/components/mobile-slide-panel/";

import "./styles.css";

const SelectSlidePanel = ({
  options,
  label,
  onChange,
  initialValue,
  multi,
  Component = null,
  disabled = false,
  setSelectedTechnicians,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [value, setValue] = useState(initialValue || {});

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      <div
        className={`form-field select-slide-panel ${disabled ? "disabled" : ""}`}
        onClick={() => {
          if (!disabled) {
            setShowOptions(true);
          }
        }}
      >
        <div className='content'>
          <span className='label'>{label}</span>
          <span className='value'>
            {multi && value ? value?.map(v => v.label).join(", ") : value.label}
          </span>
        </div>
        <div className='icon'>
          <Icon
            icon={showOptions ? "sga-icon-caret-filled-up" : "sga-icon-caret-filled-down"}
            iconColor='link'
            size='size-s'
          />
        </div>
      </div>
      <MobileSlidePanel
        title={label}
        visible={showOptions}
        onClose={() => {
          setShowOptions(false);
        }}
        footer={
          <Button
            kind='primary'
            onClick={() => {
              setShowOptions(false);
              onChange(value);
            }}
            label={intl.formatMessage({ id: "select" })}
          />
        }
      >
        <div className='options'>
          {multi ? (
            <div>
              {options.map(option => {
                const isChecked = multi
                  ? value.some(val => val.value === option.value)
                  : option.value === value.value;
                return (
                  <div
                    key={option.value}
                    className='technician-option'
                    onClick={e => {
                      e.stopPropagation();
                      if (multi) {
                        setValue(
                          isChecked
                            ? value.filter(v => v.value !== option.value)
                            : [...value, option]
                        );
                      } else {
                        setValue(isChecked ? null : option);
                      }
                    }}
                  >
                    {Component ? (
                      <Component isChecked={isChecked} name={option.label} login={option.login} />
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <RadioGroup
              onChange={v => {
                const valueObject = options.find(option => option.value === v);
                onChange(valueObject);
              }}
              value={value.value}
            >
              {options.map(option => {
                return <Radio key={option.value} inputValue={option.value} label={option.label} />;
              })}
            </RadioGroup>
          )}
        </div>
      </MobileSlidePanel>
    </>
  );
};

export default SelectSlidePanel;
