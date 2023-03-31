import { intl } from "amiga-core/components/i18n";
import React, { useState } from "react";

import { Icon, TextField } from "lib-frontsga";

import "./styles.css";

function MobileSlidePanel(props) {
  const {
    title,
    visible,
    onClose,
    closeIcon,
    children,
    showArrowClose,
    onSearch,
    searchText,
    className,
    onEdit,
    onDelete,
    footer,
  } = props;

  const [searchActive, setSearchActive] = useState(false);

  return (
    <>
      {visible ? (
        <div
          className="mobile-slide-panel_overlay"
          onClick={() => {
            if (showArrowClose) {
              onClose();
            }
          }}
        ></div>
      ) : null}
      <div
        className={`mobile-slide-panel ${className} ${
          visible ? "is-open" : ""
        }`}
      >
        <div
          className={`mobile-slide-panel_title ${
            searchActive ? "search-active" : ""
          }`}
        >
          {searchActive ? (
            <>
              <TextField
                label={intl.formatMessage({
                  id: "shared.mobile-slide-panel.search",
                })}
                onChange={(value) => onSearch(value)}
                value={searchText}
              />
              <Icon
                icon="sga-icon-times"
                onClick={() => {
                  setSearchActive(false);
                  onSearch("");
                }}
                size="size-xs"
              />
            </>
          ) : (
            <>
              {showArrowClose ? (
                <Icon
                  icon={closeIcon ? closeIcon : "sga-icon-arrow-down"}
                  onClick={() => {
                    onClose();
                  }}
                  size="size-s"
                />
              ) : null}
              <div className="title-text">{title}</div>
              {onSearch ? (
                <Icon
                  icon="sga-icon-search"
                  onClick={() => setSearchActive(true)}
                  size="size-xs"
                />
              ) : null}
              {onEdit ? (
                <Icon
                  icon="sga-icon-edit"
                  onClick={() => onEdit()}
                  size="size-xs"
                />
              ) : null}
              {onDelete ? (
                <Icon 
                  icon="sga-icon-trash"
                  onClick={() => onDelete()}
                  size="size-xs"
                />
              ) : null}
            </>
          )}
        </div>
        <div className="mobile-slide-panel_content">{children}</div>
        {footer ? <footer className="footer">{footer}</footer> : null}
      </div>
    </>
  );
}

MobileSlidePanel.defaultProps = {
  className: "",
  visible: false,
  onClose: () => {},
  closeIcon: null,
  // onSearch: null,
  searchText: "",
  title: "title",
  showArrowClose: true,
  footer: null,
};

export default MobileSlidePanel;
