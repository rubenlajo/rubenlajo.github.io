import React, { useState, useEffect } from "react";

import { T, intl } from "amiga-core/components/i18n";
import { history } from "amiga-core/components/router";
import { injectUser } from "amiga-core/components/auth";

import { Chip } from "lib-frontsga";
import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";
import { Button } from "lib-frontsga";
import { ButtonSquare } from "lib-frontsga";
import { NumberField } from "lib-frontsga";

import PageMobile from "shared/components/page-mobile/";
import MobileSidePanel from "shared/components/mobile-slide-panel/";
import AssignPannel from "../components/assign-pannel/";
import Image from "shared/components/image/image";

import injectWarehouse from "application/connectors/injectWarehouse";
import injectReferences from "stock/connectors/injectReferences";
import connectPda from "stock/connectors/connectPda";
import { isAuthorized, getAuthRoles } from "@/utils/permissions";
import { getEndpoint, applyPathParams } from "@/utils/";

import NoImage from "@/assets/images/noimage.png";

import "./styles.css";

function MaerialDetail({
  fetchCenters,
  centers,
  match,
  centerSelected,
  material,
  fetchMaterialById,
  fetchMaterialLocations,
  setRedirect,
  createWarehouseMovementInventoryMaterial,
  warehouseMovementsCreated,
  assignWarehouseMovement,
  user,
  addNotification,
  redirectToExec,
  clearCreatedWarehouseMovement,
}) {
  const isAuthorizedEditReference = isAuthorized(user.roles, getAuthRoles("referencesEdit"));

  const cancelText = intl.formatMessage({
    id: "stock.pda.location-detail.menu.cancel",
  });

  const menus = {
    MAIN: {
      key: "mainMenu",
      title: intl.formatMessage({ id: "stock.pda.location-detail.menu.title" }),
      cancelLabel: cancelText,
    },
    INVENTARY: {
      key: "inventaryMenu",
      title: intl.formatMessage({
        id: "stock.pda.reference-detail-menu.inventary",
      }),
      cancelLabel: intl.formatMessage({
        id: "stock.pda.reference-detail-menu.inventaryMenu.cancel",
      }),
      onCancel: () => {
        clearCreatedWarehouseMovement();
        addNotification({
          type: "success",
          fadeout: true,
          content: intl
            .formatMessage({ id: "stock.reactions.pda.invetary-created-ok" })
            .replace("XmaterialIdX", match.params.materialId),
        });
      },
    },
    TRASPASE: {
      key: "traspaseMenu",
      title: intl.formatMessage({
        id: "stock.pda.location-detail.menu.traspase",
      }),
      cancelLabel: intl.formatMessage({
        id: "stock.pda.reference-detail-menu.traspaseMenu.cancel",
      }),
    },
    CANCEL: {
      key: "cancelMenu",
      title: intl.formatMessage({
        id: "stock.pda.location-detail.menu.title-cancel-order",
      }),
      cancelLabel: cancelText,
    },
    PRINT: {
      key: "printMenu",
      title: intl.formatMessage({
        id: "stock.pda.reference-detail-menu.print-menu.print",
      }),
      cancelLabel: cancelText,
    },
  };

  const [pageMenu, setPageMenu] = useState(menus.MAIN);
  const [showLocations, setShowLocations] = useState(false);
  const [showMaterialImage, setShowMaterialImage] = useState(false);
  const [numTags, setNumTags] = useState(0);
  const [showAssign, setShowAssign] = useState(false);

  useEffect(() => {
    setRedirect(false);
    if (centers.length === 0) {
      fetchCenters();
    }
  }, []);

  useEffect(() => {
    if (centerSelected) {
      fetchMaterialById(centerSelected.centerId, match.params.materialId);
    }
  }, [centerSelected]);

  /**
   * Fetch material locations paginated
   */
  useEffect(() => {
    if (
      material &&
      material.locations.length === 0 &&
      !material.locationsFetching &&
      material.hasMore
    ) {
      fetchMaterialLocations(centerSelected.centerId, match.params.materialId, {
        offset: 0,
        limit: 100,
      });
    }
  }, [material]);

  useEffect(() => {
    if (
      material &&
      material.locations &&
      material.locations.length > 0 &&
      material.hasMore &&
      !material.locationsFetching
    ) {
      fetchMaterialLocations(centerSelected.centerId, match.params.materialId, {
        offset: material.filters.offset + material.filters.limit,
        limit: material.filters.limit,
      });
    }
  }, [material]);
  /* end fetch material locations */

  useEffect(() => {
    if (warehouseMovementsCreated && warehouseMovementsCreated.length > 0) {
      const wm = warehouseMovementsCreated[0];
      if (wm.warehouseMovementType.warehouseMovementTypeId === 1) {
        setPageMenu(menus.INVENTARY);
      }
    }
  }, [warehouseMovementsCreated]);

  useEffect(() => {
    if (redirectToExec && warehouseMovementsCreated !== null) {
      const warehouseMovement = warehouseMovementsCreated[0];
      history.push(
        `/stock/pda/warehouse-movements-exec-inventary-materials/${warehouseMovement.warehouseMovementId}`
      );
    }
  }, [redirectToExec]);

  if (!material) {
    return null;
  }

  const handleInventary = () => {
    createWarehouseMovementInventoryMaterial(centerSelected.centerId, match.params.materialId);
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
      true
    );
  };

  let menu = null;
  const noop = () => {};

  switch (pageMenu.key) {
    case "cancelMenu":
      menu = [
        {
          type: "primary",
          disabled: true,
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.cancelMenu.yes",
          }),
          onClick: noop,
          closeOnClick: true,
        },
        {
          type: "secondary",
          disabled: true,
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.cancelMenu.no",
          }),
          onClick: () => setShowConfirmCancel(false),
          closeOnClick: false,
        },
      ];
      break;
    case "inventaryMenu":
      menu = [
        {
          type: "text",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.inventaryMenu.title",
          }),
          disabled: !isAuthorizedEditReference,
        },
        {
          type: "primary",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.inventaryMenu.yes",
          }),
          onClick: () => handleAssignAndExec(),
          disabled: !isAuthorizedEditReference,
        },
        {
          type: "secondary",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.inventaryMenu.no",
          }),
          onClick: () => {
            setShowAssign(true);
            setPageMenu(menus.MAIN);
          },
          onlyCloseOnClick: true,
          disabled: !isAuthorizedEditReference,
        },
      ];
      break;
    case "traspaseMenu":
      menu = [
        {
          type: "text",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.traspaseMenu.title",
          }),
          disabled: !isAuthorizedEditReference,
        },
        {
          type: "primary",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.traspaseMenu.yes",
          }),
          onClick: () => handleAssignAndExec(),
          disabled: !isAuthorizedEditReference,
        },
        {
          type: "secondary",
          disabled: true,
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.traspaseMenu.no",
          }),
          onClick: () => setPageMenu(menus.MAIN),
          disabled: !isAuthorizedEditReference,
        },
      ];
      break;
    case "printMenu":
      menu = [
        {
          type: "text",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.print-menu.title",
          }),
          disabled: !isAuthorizedEditReference,
        },
        {
          type: "custom",
          component: (
            <>
              <NumberField
                label={intl.formatMessage({
                  id: "stock.pda.reference-detail-menu.print-menu.tags-number",
                })}
                value={numTags}
                onChange={value => setNumTags(value)}
              />
              <Button
                kind='primary'
                disabled
                size='size-s'
                label={intl.formatMessage({
                  id: "stock.pda.reference-detail-menu.print-menu.print",
                })}
              />
            </>
          ),
        },
      ];
      break;

    case "mainMenu":
    default:
      menu = [
        {
          type: "primary",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.inventary",
          }),
          onClick: handleInventary,
          disabled: !isAuthorized(user.roles, getAuthRoles("stockInventary")),
        },
        {
          type: "secondary",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.traspase",
          }),
          onClick: () => history.push(`/stock/pda/materials/${match.params.materialId}/transfer`),
          disabled: !isAuthorized(user.roles, getAuthRoles("stockTraspase")),
        },
        {
          type: "secondary",
          label: intl.formatMessage({
            id: "stock.pda.reference-detail-menu.freeentry",
          }),
          onClick: () =>
            history.push(
              `/stock/pda/warehouse-movements-exec-free-entry/${match.params.materialId}`
            ),
          disabled: !isAuthorized(user.roles, getAuthRoles("stockMovementExecute")),
        },
      ];
      break;
  }

  const renderReferences = () => {
    return (
      <MobileSidePanel
        title={intl.formatMessage({
          id: "stock.pda.reference-detail.secondary-locations",
        })}
        visible={showLocations}
        onClose={() => setShowLocations(false)}
      >
        {material.locations
          ? material.locations.map(location => (
              <DataDefault
                key={location.locationCode}
                className='material-detail_location-list-item'
                title={`${location.stock} ${intl.formatMessage({
                  id: "stock.pda.reference-detail.units",
                })}`}
                subtitle={location.locationCode}
              />
            ))
          : null}
      </MobileSidePanel>
    );
  };

  const renderAssign = () => {
    const closeAssignPanel = () => {
      setShowAssign(false);
      clearCreatedWarehouseMovement();
      setPageMenu(menus.MAIN);
    };

    return (
      <AssignPannel
        visible={showAssign}
        close={closeAssignPanel}
        onSelect={technicianLogin => {
          const warehouseMovement = warehouseMovementsCreated[0];
          assignWarehouseMovement(
            centerSelected.centerId,
            warehouseMovement.warehouseMovementId,
            technicianLogin,
            warehouseMovement.warehouseMovementType.warehouseMovementTypeId === 1
              ? intl.formatMessage({ id: "stock.routes.pda.inventory" })
              : intl.formatMessage({ id: "stock.routes.pda.transfer" })
          );
          closeAssignPanel();
          setShowAssign(false);
          clearCreatedWarehouseMovement();
        }}
      />
    );
  };

  const renderTitle = () => {
    return (
      <>
        <span>ID {match.params.materialId} </span>
        <ButtonSquare icon='sga-icon-camera' onClick={() => setShowMaterialImage(true)} />
      </>
    );
  };

  const REFERENCE_STATUS_COLOR = {
    0: "info",
    1: "success",
    2: "link",
    3: "error",
  };

  const renderMaterialImage = () => {
    const materialImageUrl = applyPathParams(getEndpoint("materialPhoto"), {
      materialId: material.materialId,
    });

    return (
      <MobileSidePanel
        title={intl.formatMessage({ id: "stock.pda.reference-detail.photo" })}
        visible={showMaterialImage}
        onClose={() => setShowMaterialImage(false)}
      >
        <Image
          className='w100'
          src={materialImageUrl}
          altSrc={NoImage}
          altText={material.general.materialI18n.name}
        />
      </MobileSidePanel>
    );
  };

  return (
    <PageMobile
      className='pda-material-detail'
      title={renderTitle()}
      subtitle={`${material.general.materialI18n.name}`}
      breadcrumb={intl.formatMessage({
        id: "stock.pda.reference-detail.page.title",
      })}
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
      resourceName='referenceDetailPage'
    >
      <Chip
        label={`${(material.local && material.local.stock) || 0} ${intl.formatMessage({
          id: "stock.pda.reference-detail.stock",
        })}`}
        stateColor={
          REFERENCE_STATUS_COLOR[(material && material.local && material.local.stockStatusId) || 0]
        }
      />
      <div className='detail-container'>
        <Salient
          title={material.local.location ? material.local.location.locationName : "-"}
          subtitle={intl.formatMessage({
            id: "stock.pda.reference-detail.principal-location",
          })}
          number={material.locations ? material.locations.length : "00"}
          icon='sga-icon-info-circle'
          onActionClicked={() => setShowLocations(true)}
          disabledIcon={
            !material.locations || (material.locations && material.locations.length === 0)
          }
          disabledNumber
        />
        <DataDefault
          title={intl.formatMessage({
            id: "stock.pda.reference-detail.sfi-id",
          })}
          subtitle={material.general.codSFI}
        />
        <DataDefault
          title={intl.formatMessage({
            id: "stock.pda.reference-detail.manufaturer",
          })}
          subtitle={
            material.general.manufacturer ? material.general.manufacturer.manufacturerName : "-"
          }
        />
        <DataDefault
          title={intl.formatMessage({
            id: "stock.pda.reference-detail.manufacturerReference",
          })}
          subtitle={material.general.manufacturerReference || "-"}
        />
      </div>
      {renderReferences()}
      {renderMaterialImage()}
      {renderAssign()}
    </PageMobile>
  );
}

export default injectUser(injectWarehouse(injectReferences(connectPda(MaerialDetail))));
