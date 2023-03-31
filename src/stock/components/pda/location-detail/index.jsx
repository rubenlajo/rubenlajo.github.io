import React, { useState, useEffect } from "react";
import { moment } from "amiga-core/application/i18n/moment";
import { T, intl } from "amiga-core/components/i18n";
import { history } from "amiga-core/components/router";
import { injectUser } from "amiga-core/components/auth";

import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";
import { Chip } from "lib-frontsga";

import PageMobile from "shared/components/page-mobile/";
import MobileSidePanel from "shared/components/mobile-slide-panel/";

import injectWarehouse from "application/connectors/injectWarehouse";
import injectLocations from "stock/connectors/injectLocations";
import connectPda from "stock/connectors/connectPda";
import AssignPannel from "../components/assign-pannel/";

import { dateFormat, dateFormatEN, maskISO8601 } from "@/generalConfig";
import { isAuthorized, getAuthRoles } from "@/utils/permissions";

import "./styles.css";

function LocationDetail(props) {
  const {
    match,
    centers,
    fetchCenters,
    centerSelected,
    locationDetail,
    getLocationDetail,
    createWarehouseMovementInventoryLocation,
    warehouseMovementsCreated,
    assignWarehouseMovement,
    setRedirect,
    locationMaterials,
    fetchLocationMaterials,
    user,
    addNotification,
    redirectToExec,
    clearCreatedWarehouseMovement,
  } = props;

  const menus = {
    MAIN: {
      key: "mainMenu",
      title: intl.formatMessage({ id: "stock.pda.location-detail.menu.title" }),
      cancelLabel: intl.formatMessage({ id: "stock.pda.location-detail.menu.cancel" }),
    },
    INVENTARY: {
      key: "inventaryMenu",
      title: intl.formatMessage({ id: "stock.pda.location-detail-menu.inventary" }),
      cancelLabel: intl.formatMessage({ id: "stock.pda.location-detail-menu.inventaryMenu.cancel" }),
      onCancel: () => {
        clearCreatedWarehouseMovement();
        addNotification({
          type: "success",
          fadeout: true,
          content: intl.formatMessage({ id: "stock.reactions.pda.invetary-created-ok" }),
        });
        setTimeout(() => {
          getLocationDetail(centerSelected.centerId, match.params.locationId);
        }, 1500);
      },
    },
  };

  const [showReferences, setShowReferences] = useState(false);
  const [pageMenu, setPageMenu] = useState(menus.MAIN);
  const [showAssign, setShowAssign] = useState(false);

  const localeFormat = intl.locale === "es" ? dateFormat : dateFormatEN;

  useEffect(() => {
    setRedirect(false);
    if (centers.length === 0) {
      fetchCenters();
    }
  }, []);

  useEffect(() => {
    if (centerSelected) {
      getLocationDetail(centerSelected.centerId, match.params.locationId);
    }
  }, [centerSelected]);

  useEffect(() => {
    if (locationDetail && centerSelected && locationMaterials.haveMore && !locationMaterials.fetching) {
      fetchLocationMaterials(centerSelected.centerId, match.params.locationId, {
        offset: locationMaterials.offset,
        limit: locationMaterials.limit,
      });
    }
  }, [locationDetail, locationMaterials]);

  useEffect(() => {
    if (warehouseMovementsCreated && warehouseMovementsCreated.length > 0) {
      const wm = warehouseMovementsCreated[0];
      if (
        wm.warehouseMovementType.warehouseMovementTypeId === 1 ||
        wm.warehouseMovementType.warehouseMovementTypeId === 3
      ) {
        setPageMenu(menus.INVENTARY);
      }
    }
  }, [warehouseMovementsCreated]);

  useEffect(() => {
    if (redirectToExec && warehouseMovementsCreated !== null) {
      setPageMenu(menus.MAIN);
      const warehouseMovement = warehouseMovementsCreated[0];
      history.push(`/stock/pda/warehouse-movements-exec-inventary-locations/${warehouseMovement.warehouseMovementId}`);
    }
  }, [redirectToExec]);

  if (!locationDetail) {
    return null;
  }

  const handleInventory = () => {
    createWarehouseMovementInventoryLocation(centerSelected.centerId, match.params.locationId);
  };

  const handleAssignAndExec = () => {
    const warehouseMovement = warehouseMovementsCreated[0];
    assignWarehouseMovement(
      centerSelected.centerId,
      warehouseMovement.warehouseMovementId,
      user.login,
      warehouseMovement.warehouseMovementType.warehouseMovementTypeId === 1
        ? intl.formatMessage({ id: "stock.routes.pda.inventory" })
        : intl.formatMessage({ id: "stock.routes.pda.transfer" }),
      true,
    );
  };

  let menu = null;

  switch (pageMenu.key) {
    case menus.INVENTARY.key:
      menu = [
        {
          type: "text",
          label: intl.formatMessage({ id: "stock.pda.reference-detail-menu.inventaryMenu.title" }),
        },
        {
          type: "primary",
          label: intl.formatMessage({ id: "stock.pda.reference-detail-menu.inventaryMenu.yes" }),
          onClick: () => handleAssignAndExec(),
        },
        {
          type: "secondary",
          label: intl.formatMessage({ id: "stock.pda.reference-detail-menu.inventaryMenu.no" }),
          onClick: () => {
            setShowAssign(true);
            setPageMenu(menus.MAIN);
          },
          onlyCloseOnClick: true,
        },
      ];
      break;

    case menus.MAIN.key:
    default:
      menu = [
        {
          type: "primary",
          label: intl.formatMessage({ id: "stock.pda.location-detail.menu.inventary" }),
          onClick: handleInventory,
          disabled:
            !isAuthorized(user.roles, getAuthRoles("stockInventary")) ||
            (locationDetail && locationDetail.locationLastInventoryStatus
              ? locationDetail.locationLastInventoryStatus.locationLastInventoryStatusId === 3
              : false),
        },
        {
          type: "secondary",
          label: intl.formatMessage({ id: "stock.pda.location-detail.menu.traspase" }),
          disabled: !isAuthorized(user.roles, getAuthRoles("stockTraspase")),
          onClick: () => history.push(`/stock/pda/locations/${match.params.locationId}/transfer`),
        },
      ];
      break;
  }

  const renderReferences = () => {
    return (
      <MobileSidePanel
        title={intl.formatMessage({ id: "stock.pda.location-detail.references-and-units" })}
        visible={showReferences}
        onClose={() => setShowReferences(false)}
      >
        {locationMaterials.list.map((material) => (
          <DataDefault
            key={material.materialId}
            className="location-detail_material-list-item"
            title={material.materialName.name}
            subtitle={material.manufacturerReference}
            number={material.locationStock}
          />
        ))}
      </MobileSidePanel>
    );
  };

  const LAST_INVENTORY_STATUS_COLOR = {
    0: "#FBD24F",
    1: "#fbd24f",
    2: "#e43e42",
    3: "#73c480"
  }

  const renderAssign = () => {
    return (
      <AssignPannel
        visible={showAssign}
        close={() => setShowAssign(false)}
        onSelect={(technicianLogin) => {
          const warehouseMovement = warehouseMovementsCreated[0];
          assignWarehouseMovement(
            centerSelected.centerId,
            warehouseMovement.warehouseMovementId,
            technicianLogin,
            warehouseMovement.warehouseMovementType.warehouseMovementTypeId === 1
              ? intl.formatMessage({ id: "stock.routes.pda.inventory" })
              : intl.formatMessage({ id: "stock.routes.pda.transfer" }),
          );
          setShowAssign(false);
          clearCreatedWarehouseMovement();
        }}
      />
    );
  };

  return (
    <PageMobile
      className="pda-location-detail"
      title={locationDetail.locationName}
      breadcrumb={intl.formatMessage({ id: "stock.pda.location-detail.page.title" })}
      onBack={() => history.push("/stock/pda/dashboard")}
      pageActions={menu}
      pageActionsTitle={pageMenu.title}
      pageActionsCancelLabel={pageMenu.cancelLabel}
      onPageActionsClose={() => {
        if (pageMenu.key === menus.INVENTARY.key) {
          menus.INVENTARY.onCancel();
        }
        setPageMenu(menus.MAIN);
      }}
      resourceName="locationsDetailPage"
    >
      <Chip
        label={
          locationDetail && locationDetail.locationLastInventoryStatus
            ? locationDetail.locationLastInventoryStatus.locationLastInventoryStatusName
            : ""
        }
        // color={`var(--color-lastinventorystatus-${
        //   locationDetail && locationDetail.locationLastInventoryStatus
        //     ? locationDetail.locationLastInventoryStatus.locationLastInventoryStatusId
        //     : 0
        // }, #FBD24F)`}
        customColor={LAST_INVENTORY_STATUS_COLOR[locationDetail && locationDetail.locationLastInventoryStatus
               ? locationDetail.locationLastInventoryStatus.locationLastInventoryStatusId
               : 0]}
      />
      <div className="detail-container">
        <Salient
          title={locationDetail ? locationDetail.locationName : "-"}
          subtitle={intl.formatMessage({ id: "stock.pda.location-detail.references-and-units" })}
          number={locationMaterials.list ? locationMaterials.list.length : 0}
          icon="sga-icon-info-circle"
          onActionClicked={() => setShowReferences(true)}
          disabledNumber
        />
        <DataDefault
          title={intl.formatMessage({ id: "stock.pda.location-detail.last-inventory" })}
          subtitle={
            // locationDetail.lastInventory 
            //   ? moment(locationDetail.lastInventory.creationDate, maskISO8601).format(
            //       intl.locale === "es" ? dateFormat : dateFormatEN,
            //     )
            //   : "-"
            locationDetail?.lastInventory && locationDetail?.lastInventory?.closeDate ?
              moment(locationDetail.lastInventory.closeDate).format(localeFormat) : "-"
          }
        />
        <DataDefault
          title={intl.formatMessage({ id: "stock.pda.location-detail.behabiour" })}
          subtitle={
            locationDetail && locationDetail.locationBehaviorType
              ? locationDetail.locationBehaviorType.locationBehaviorTypeName
              : ""
          }
        />
        <DataDefault
          title={intl.formatMessage({ id: "stock.pda.location-detail.observations" })}
          subtitle={locationDetail.description}
        />
      </div>
      {renderReferences()}
      {renderAssign()}
    </PageMobile>
  );
}

export default injectUser(injectWarehouse(injectLocations(connectPda(LocationDetail))));
