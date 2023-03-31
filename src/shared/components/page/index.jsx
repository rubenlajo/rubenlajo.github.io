import React, { useEffect, useState } from "react";

import { T, intl } from "amiga-core/components/i18n";
import { history } from "amiga-core/components/router";
import { moment } from "amiga-core/application/i18n/moment";

import { injectWarehouse, injectUser } from "application/connectors";

import { Title, Icon, SearchField, Tooltip, FilterPanel } from "lib-frontsga";

import Breadcrumbs from "shared/components/breadcrumbs";
import DropDownSelect from "shared/components/dropdown-select";
import SidePanel from "shared/components/side-panel";
import CheckAccess from "shared/components/check-access/";

import { isAuthorized } from "@/utils/permissions";

import {
  dateFormat,
  dateFormatEN,
  dateTimeFormat,
  dateTimeFormatEN,
  formatISO8601,
} from "@/generalConfig";

import "./styles.css";

function Page({
  title,
  subtitle,
  titleRow,
  children,
  className,
  filters,
  filtersConfig,
  activeFilters,
  centers,
  fetchCenters,
  fetchCenter,
  centerSelected,
  setCenterSelected,
  match,
  routes,
  filtersPanelState,
  onSearch,
  user,
  resourceName,
  appMetadata,
}) {
  const [filtersOpen, setFiltersOpen] = useState(filtersPanelState);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (centers.length === 0) {
      fetchCenters();
    }
  }, [centers]);

  useEffect(() => {
    if (centerSelected && !centerSelected.mapParameters) {
      fetchCenter(centerSelected.centerId);
    }
  }, [centerSelected]);

  useEffect(() => {
    setFiltersOpen(filtersPanelState);
  }, [filtersPanelState]);

  const centersOptions = centers.map(({ centerName, centerId }) => ({
    label: centerName,
    value: centerId,
  }));

  const localeRoutes = routes.map(route => ({
    ...route,
    label: intl.formatMessage({ id: route.label }),
  }));

  const localRoutesFiltered = localeRoutes.filter(route =>
    isAuthorized(user.roles, route.forRoles || [])
  );

  const baseRoute = localeRoutes.find(route => route.base);

  const breadcrumbs = [
    {
      type: "component",
      label: (
        <DropDownSelect
          value={
            centerSelected
              ? {
                  label: centerSelected.centerName,
                  value: centerSelected.centerId,
                }
              : null
          }
          onChange={center => setCenterSelected(centers.find(a => a.centerId === center.value))}
          options={centersOptions}
        />
      ),
    },
    {
      to: baseRoute.value,
      label: baseRoute.label,
    },
  ];

  if (localRoutesFiltered.filter(route => !route.base && !route.hidden).length > 1) {
    breadcrumbs.push({
      type: "separator",
    });
    breadcrumbs.push({
      type: "component",
      label: (
        <DropDownSelect
          className='path'
          value={localRoutesFiltered.find(route => route.path === match.path)}
          onChange={route => {
            if (route.path.indexOf("http") !== -1 || route.path.indexOf("https") !== -1) {
              document.location = route.path;
            } else {
              history.push(route.path);
            }
          }}
          options={localRoutesFiltered.filter(route => !route.base && !route.hidden)}
        />
      ),
    });
  }

  const renderSearch = () => {
    if (!searchOpen) {
      return <Icon icon='sga-icon-search' iconSize='3.2rem' onClick={() => setSearchOpen(true)} />;
    } else {
      return (
        <div className='search-active'>
          <SearchField label='Buscar' onChange={onSearch} />
          <Icon
            className='close-search'
            icon='sga-icon-times'
            iconSize='3.2rem'
            iconColor='rgb(252, 221, 130)'
            onClick={() => setSearchOpen(false)}
          />
        </div>
      );
    }
  };

  const isHistoryInstance = appMetadata && appMetadata.immsReadOnly;

  const renderHistoryHeaderContent = () => {
    const tooltipContentPlaceholderValues = {
      historicalBatchProcessTime: appMetadata.historicalBatchProcessTime,
      projectName: "IMMS",
      lastHistorificationDate: moment(appMetadata.lastHistorificationDate).format(
        intl.locale === "es" ? dateTimeFormat : dateTimeFormatEN
      ),
    };

    return (
      <div>
        <Tooltip
          className='historical-tooltip'
          position='bottom'
          wrapperClassName='historical-tooltip'
          content={intl.formatMessage(
            { id: "historic.tooltip-content" },
            tooltipContentPlaceholderValues
          )}
        >
          <T id='historic.title' />:{" "}
          {moment(appMetadata.lastHistorificationDate, formatISO8601).format(
            intl.locale === "es" ? dateFormat : dateFormatEN
          )}
        </Tooltip>
      </div>
    );
  };

  const renderFilters = () => {
    if (filters) {
      return (
        <SidePanel
          className='filter-content'
          title={intl.formatMessage({ id: "shared.filters" })}
          visible={filtersOpen}
          setVisible={setFiltersOpen}
          size='small'
        >
          {filters}
        </SidePanel>
      );
    } else {
      return (
        <FilterPanel
          key={JSON.stringify(filtersConfig.selectedFilters)}
          footerButtonSecondary={{
            label: "Cancelar",
            onClick: () => {
              setFiltersOpen(false);
            },
          }}
          onClose={() => {
            setFiltersOpen(false);
          }}
          onSubmit={filters => {
            filtersConfig.onFilter(filters);
            setFiltersOpen(false);
          }}
          selectedFilters={filtersConfig.selectedFilters}
          show={filtersOpen}
          tabs={filtersConfig.tabs}
          toolbarButtonIcon={{
            icon: "sga-icon-save",
            label: "Guardar",
            onClick: () => filtersConfig.saveFilters(),
            disabled: true, //TODO: quitar cuando se añada la funcionalidad
          }}
          size='size-m'
        />
      );
    }
  };

  return (
    <CheckAccess resource={resourceName}>
      <div className={`page ${className || ""} ${isHistoryInstance ? "history-instance" : ""}`}>
        <div className='header-container'>
          {isHistoryInstance ? renderHistoryHeaderContent() : null}
          <Breadcrumbs items={breadcrumbs} />
          {onSearch ? <div className='search-container'>{renderSearch()}</div> : null}
          {filters || filtersConfig ? (
            <div className='filters'>
              <span className='fitler-toggle'>
                {activeFilters && (
                  <Icon
                    icon='sga-icon-filter'
                    size='size-xs'
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    badge
                  />
                )}
              </span>
              {renderFilters()}
            </div>
          ) : null}
        </div>
        {titleRow}
        {!titleRow && title ? <Title title={title} subtitle={subtitle} /> : null}
        <div className='page-content'>{children}</div>
      </div>
    </CheckAccess>
  );
}

Page.defaultProps = {
  subtitle: "",
  filtersPanelState: false,
  resourceName: "all",
};

export default injectWarehouse(injectUser(Page));
