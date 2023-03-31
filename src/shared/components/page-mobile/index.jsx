import React, { useEffect, useState } from "react";
import { intl } from "amiga-core/components/i18n";

import { Title, Icon, SearchField, Button, ActionSheet } from "lib-frontsga";

import ButtonFab from "../ButtonFab/button-fab";
import injectWarehouse from "application/connectors/injectWarehouse";
import CodeScanner from "shared/components/form/code-scanner/input";
import CheckAccess from "shared/components/check-access/";

import "./styles.css";

function PageMobile(props) {
  const {
    title,
    subtitle,
    breadcrumb,
    children,
    className,
    onSearch,
    onExternalSearch,
    pageActions,
    pageActionsTitle,
    pageActionsCancelLabel,
    onBack,
    onDelete,
    onOrder,
    order,
    contentScroll,
    onPageActionsClose,
    fetchCenters,
    fetchCenter,
    centers,
    onScan,
    onScanClick,
    scanLabel,
    resourceName,
    disableScan,
    onInfo,
    backgroundColor,
    padding,
    footer,
    onEdit,
    editActive,
    onFilter,
    filtersActive,
    onOrderExternal,
    centerSelected,
    centersFetching,
    centerFetching,
  } = props;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [scanText, setScanText] = useState("");
  const [actionVisible, setActionVisible] = useState(false);
  const [orderType, setOrderType] = useState(order);

  const renderSearch = () => {
    if (onSearch) {
      if (!searchOpen) {
        return (
          <Icon
            icon='sga-icon-search'
            size='size-m'
            iconColor={!disableScan ? "default" : "gray"}
            onClick={!disableScan ? () => setSearchOpen(true) : () => {}}
          />
        );
      } else {
        return (
          <div className='search-container search-active'>
            <SearchField
              label={intl.formatMessage({
                id: "shared.components.page-mobile.search",
              })}
              onChange={search => {
                setSearchText(search);
                onSearch(search);
              }}
              value={searchText}
            />
            <Icon
              className='close-search'
              icon='sga-icon-times'
              size='size-m'
              iconColor='rgb(252, 221, 130)'
              onClick={() => {
                setSearchOpen(false);
                setSearchText("");
                onSearch("");
              }}
            />
          </div>
        );
      }
    }

    if (onExternalSearch !== null) {
      return (
        <Icon
          icon='sga-icon-search'
          size='size-m'
          iconColor={!disableScan ? "default" : "gray"}
          onClick={!disableScan ? () => onExternalSearch(true) : () => {}}
        />
      );
    }

    return null;
  };

  const renderOrder = () => {
    if (onOrder && !searchOpen) {
      return (
        <Icon
          icon={orderType === "DESC" ? "sga-icon-arrow-down" : "sga-icon-arrow-up"}
          size='size-m'
          onClick={() => {
            const newOrder = orderType === "ASC" ? "DESC" : "ASC";
            onOrder(newOrder);
            setOrderType(newOrder);
          }}
        />
      );
    }

    return null;
  };

  const renderOrderExt = () => {
    if (onOrderExternal && !searchOpen) {
      return <Icon icon='sga-icon-sort-amount-down' size='size-m' onClick={onOrderExternal} />;
    }
    return null;
  };

  const renderBack = () => {
    if (onBack) {
      return (
        <Icon
          className='close-search'
          icon='sga-icon-arrow-left'
          size='size-m'
          iconColor='default'
          onClick={() => onBack()}
        />
      );
    }

    return null;
  };

  const renderDelete = () => {
    if (onDelete) {
      return (
        <Icon
          className='info-icon'
          icon='sga-icon-trash'
          size='size-m'
          iconColor='default'
          onClick={() => onDelete()}
        />
      );
    }
  };

  const renderInfo = () => {
    if (onInfo) {
      return (
        <Icon
          className='info-icon'
          icon='sga-icon-info-circle'
          iconSize='2.6rem'
          onClick={() => onInfo()}
        />
      );
    }
    return null;
  };

  const closeActionsMenu = () => {
    setActionVisible(false);

    setTimeout(() => {
      onPageActionsClose();
    }, 600);
  };

  const openActionsMenu = () => {
    setActionVisible(true);
  };

  /**
   * Renders mobile page actions
   *
   * Each action have this API:
   *    - label:  string
   *    - onClick: fn
   *    - closeOnClick: bool -> close actions menú and call onCancel func
   *    - onlyCloseOnClick: bool -> only close actions and not ejecute onCancel menú
   *    - type: primary | secondary | tertiary
   *    - disabled: bool
   */
  const renderPageActions = () => {
    if (pageActions) {
      return (
        <>
          <ButtonFab onClick={openActionsMenu} />
          <ActionSheet
            title={
              pageActionsTitle ||
              intl.formatMessage({
                id: "shared.components.page-mobile.actions",
              })
            }
            visible={actionVisible}
            onIconClose={() => closeActionsMenu()}
            // labelCancel={
            //   pageActionsCancelLabel || intl.formatMessage({ id: "shared.components.page-mobile.actions.cancel" })
            // }
            // buttonTertiaryProps={{
            //   label:
            //     pageActionsCancelLabel || intl.formatMessage({ id: "shared.components.page-mobile.actions.cancel" }),
            // }}
          >
            {pageActions.map(action => {
              switch (action.type) {
                case "primary":
                  return (
                    <Button
                      kind='primary'
                      className='page-mobile-actions'
                      key={action.label}
                      label={action.label}
                      size='size-m'
                      disabled={action.disabled}
                      icon=''
                      onClick={() => {
                        action.onClick();
                        if (action.onlyCloseOnClick) {
                          setActionVisible(false);
                        } else if (action.closeOnClick) {
                          closeActionsMenu();
                        }
                        if (action.onlyCloseOnClick) {
                          setActionVisible(false);
                        }
                      }}
                    />
                  );

                case "secondary":
                  return (
                    <Button
                      kind='secondary'
                      className='page-mobile-actions'
                      key={action.label}
                      size='size-m'
                      disabled={action.disabled}
                      icon=''
                      onClick={() => {
                        action.onClick();
                        if (action.onlyCloseOnClick) {
                          setActionVisible(false);
                        } else if (action.closeOnClick) {
                          closeActionsMenu();
                        }
                        if (action.onlyCloseOnClick) {
                          setActionVisible(false);
                        }
                      }}
                      label={action.label}
                    />
                  );
                case "tertiary":
                  return (
                    <Button
                      kind='tertiary'
                      className='page-mobile-actions'
                      key={action.label}
                      size='size-m'
                      disabled={action.disabled}
                      icon=''
                      onClick={() => {
                        action.onClick();
                        if (action.onlyCloseOnClick) {
                          setActionVisible(false);
                        } else if (action.closeOnClick) {
                          closeActionsMenu();
                        }
                        if (action.onlyCloseOnClick) {
                          setActionVisible(false);
                        }
                      }}
                      label={action.label}
                    />
                  );
                case "text":
                  return <span key={action.label}>{action.label}</span>;
                case "custom":
                  return action.component;
                default:
                  return null;
              }
            })}
            <Button
              kind='tertiary'
              icon=''
              label={
                pageActionsCancelLabel ||
                intl.formatMessage({
                  id: "shared.components.page-mobile.actions.cancel",
                })
              }
              onClick={() => closeActionsMenu()}
            />
          </ActionSheet>
        </>
      );
    }

    return null;
  };

  const renderScanner = () => {
    return (
      <CodeScanner
        label={scanLabel}
        onChange={text => {
          setScanText(text);
          onScan(text);
        }}
        value={scanText}
        disabled={disableScan}
        onScanClick={onScanClick}
      />
    );
  };

  const renderEdit = () => {
    if (onEdit) {
      return (
        <Icon
          icon='sga-icon-check-square'
          size='size-m'
          iconColor='default'
          onClick={() => onEdit()}
        />
      );
    }
    return null;
  };

  const renderFilters = () => {
    if (onFilter) {
      return (
        <Icon
          icon='sga-icon-filter'
          size='size-m'
          iconColor='default'
          onClick={() => onFilter()}
          badge={filtersActive}
        />
      );
    }
    return null;
  };

  const pageStyles = {
    backgroundColor,
    padding,
  };

  return (
    <CheckAccess resource={resourceName}>
      <div
        className={`page-mobile ${className || ""} ${onScan ? "has-scanner" : ""} ${
          footer ? "has-footer" : ""
        } ${padding === 0 ? "no-padding" : ""}`}
        style={pageStyles}
      >
        {!editActive ? (
          <>
            <div
              className={`header-container ${onBack ? "no-menu" : ""}`}
              style={{ backgroundColor }}
            >
              {!searchOpen ? (
                <>
                  <div className='back-arrow'>{renderBack()}</div>
                  <div className='mobile-breadcrumb'>{breadcrumb}</div>
                </>
              ) : null}
              <div className={`page-mobile-actions ${searchOpen ? "full-with" : ""}`}>
                {renderEdit()}
                {renderSearch()}
                {renderOrder()}
                {renderOrderExt()}
                {renderInfo()}
                {renderDelete()}
                {renderFilters()}
              </div>
            </div>
            {title ? <Title title={title} subtitle={subtitle} /> : null}
          </>
        ) : (
          <div className='page-mobile-edit-active-container'>
            <Icon
              icon='sga-icon-times'
              size='size-m'
              iconColor='default'
              onClick={() => onEdit()}
            />
          </div>
        )}
        <div
          className={`page-content ${contentScroll ? "scroll" : ""} ${
            subtitle ? "has-subtitle" : ""
          }`}
        >
          {children}
        </div>
        {renderPageActions()}
        {footer}
        {onScan ? renderScanner() : null}
      </div>
    </CheckAccess>
  );
}

PageMobile.defaultProps = {
  subtitle: "",
  breadcrumb: "",
  filtersPanelState: false,
  onBack: null,
  onSearch: null,
  onExternalSearch: null,
  contentScroll: true, //por defecto scroll en el contenido
  pageActionsTitle: "",
  pageActionsCancelLabel: "",
  onPageActionsClose: () => {},
  scanLabel: "",
  order: "DESC",
  resourceName: "all",
  disableScan: false,
  onInfo: null,
  backgroundColor: "#262626",
  padding: "2.4rem",
  onEdit: null,
  editActive: false,
};

export default injectWarehouse(PageMobile);
