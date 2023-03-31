import React, { useState, useEffect } from "react";
import injectUser from "application/connectors/injectUser";
import { history } from "amiga-core/components/router";
import { T, intl } from "amiga-core/components/i18n";

import { Chip } from "lib-frontsga";
import { Salient } from "lib-frontsga";
import { SalientDual } from "lib-frontsga";
import { Button } from "lib-frontsga";

import injectWarehouse from "application/connectors/injectWarehouse";
import connectPda from "stock/connectors/connectPda";
import PageMobile from "shared/components/page-mobile/";
import MobileSidePanel from "shared/components/mobile-slide-panel/";

import InventoryLocation from "./components/inventory-location";
import InventoryReference from "./components/inventory-reference/";
import Traspase from "./components/traspase/";
import FreeEntry from "./components/free-entry";
import Location from "./components/location/";

import AssignPannel from "../components/assign-pannel/";

import { getUserName } from "@/utils/";

import { transferTypes } from "../CONSTANTS";
import { getAuthRoles, isAuthorized } from "@/utils/permissions";

import "./styles.css";

function WarehouseMovementDetail(props) {
  const {
    match,
    centerSelected,
    fetchWarehouseMovement,
    warehouseMovement,
    assignWarehouseMovement,
    updateWarehouseMovemementStatus,
    fetchWarehouseMovementStatus,
    warehouseMovementsStatus,
    user,
    fetchWarehouseMovementReferences,
    warehouseMovementReferences,
    fetchWarehouseMovementLocations,
    warehouseMovementLocations,
    setRedirect,
    redirect,
    redirectToExec,
    resetWarehouseMovementStatusFlag,
  } = props;

  const [showReferences, setShowReferences] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showTechnicians, setShowTechnicians] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [transferType, setTransferType] = useState("");

  useEffect(() => {
    if (centerSelected) {
      fetchWarehouseMovement(centerSelected.centerId, match.params.warehouseMovementId);

      if (warehouseMovementsStatus.length === 0) {
        fetchWarehouseMovementStatus();
      }
    }
    if (redirect) {
      setRedirect(false);
    }
    if (!redirect) {
      resetWarehouseMovementStatusFlag();
    }
  }, [centerSelected]);

  useEffect(() => {
    if (
      warehouseMovement &&
      warehouseMovement.warehouseMovementType.warehouseMovementTypeId === 2 &&
      warehouseMovement.materials &&
      warehouseMovement.materials.length === 1
    ) {
      setTransferType(transferTypes.MATERIAL);
    }

    if (
      warehouseMovement &&
      warehouseMovement.warehouseMovementType.warehouseMovementTypeId === 2 &&
      warehouseMovement.locations &&
      warehouseMovement.locations.length === 1
    ) {
      setTransferType(transferTypes.LOCATION);
    }
  }, [warehouseMovement]);

  useEffect(() => {
    if (redirectToExec) {
      redirectToExecPage();
    }
  }, [warehouseMovement]);

  /**
   * Get warehouse movement references paginated
   */
  useEffect(() => {
    const needToFetchWMRef =
      warehouseMovement &&
      ((warehouseMovement.locations && warehouseMovement.locations.length === 1) ||
        warehouseMovement.warehouseMovementType.warehouseMovementTypeId === 5) &&
      warehouseMovement.warehouseMovementType.warehouseMovementTypeId !== 4;
    if (
      centerSelected &&
      warehouseMovementReferences.haveMore &&
      !warehouseMovementReferences.fetching &&
      needToFetchWMRef
    ) {
      fetchWarehouseMovementReferences(centerSelected.centerId, match.params.warehouseMovementId, {
        offset: warehouseMovementReferences.offset,
        limit: warehouseMovementReferences.limit,
      });
    }
  }, [centerSelected, warehouseMovementReferences, warehouseMovement]);

  /**
   * Get warehouse movement locations paginated
   */
  useEffect(() => {
    const needToFetchWMLoc =
      warehouseMovement &&
      warehouseMovement.materials &&
      warehouseMovement.materials.length === 1 &&
      ![3, 4, 5].some(
        typeId => typeId === warehouseMovement.warehouseMovementType.warehouseMovementTypeId
      );

    if (
      centerSelected &&
      warehouseMovementLocations.haveMore &&
      !warehouseMovementLocations.fetching &&
      needToFetchWMLoc
    ) {
      fetchWarehouseMovementLocations(centerSelected.centerId, match.params.warehouseMovementId, {
        offset: warehouseMovementLocations.offset,
        limit: warehouseMovementLocations.limit,
      });
    }
  }, [centerSelected, warehouseMovementLocations, warehouseMovement]);

  const handleExecute = () => {
    if (
      !warehouseMovement.assignedUsers ||
      warehouseMovement.assignedUsers.length === 0 ||
      !warehouseMovement.assignedUsers.some(auser => auser.assignedUser === user.login)
    ) {
      assignWarehouseMovement(
        centerSelected.centerId,
        warehouseMovement.warehouseMovementId,
        user.login,
        warehouseMovement.warehouseMovementType.warehouseMovementTypeName,
        true //redirectToExec
      );
    } else {
      redirectToExecPage();
    }
  };

  const redirectToExecPage = () => {
    switch (warehouseMovement.warehouseMovementType.warehouseMovementTypeId) {
      case 1:
        if (warehouseMovement.materials && warehouseMovement.materials.length === 1) {
          history.push(
            `/stock/pda/warehouse-movements-exec-inventary-materials/${warehouseMovement.warehouseMovementId}`
          );
        } else {
          history.push(
            `/stock/pda/warehouse-movements-exec-inventary-locations/${warehouseMovement.warehouseMovementId}`
          );
        }
        break;
      case 2:
        history.push(
          `/stock/pda/warehouse-movements-exec-traspase/${warehouseMovement.warehouseMovementId}`
        );
        break;
      case 3:
        // these warehouse movements should not exist
        break;
      case 4:
        //Free entry creates and exec at time
        break;
      case 5:
        history.push(
          `/stock/pda/warehouse-movements-exec-locate/${warehouseMovement.warehouseMovementId}`
        );
        break;
      default:
        break;
    }
  };

  const pageActions = [
    {
      type: "primary",
      label: intl.formatMessage({ id: "stock.pda.work-order-detail.menu.execute" }),
      onClick: handleExecute,
      closeOnClick: true,
      disabled:
        !isAuthorized(user.roles, getAuthRoles("stockMovementExecute")) ||
        (warehouseMovement &&
          warehouseMovement.warehouseMovementStatus &&
          ![1, 2, 4].some(
            id => id === warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId
          )),
    },
    {
      type: "secondary",
      label: intl.formatMessage({ id: "stock.pda.work-order-detail.menu.assign" }),
      onClick: () => setShowTechnicians(true),
      closeOnClick: true,
      disabled:
        !isAuthorized(user.roles, getAuthRoles("stockMovementAssign")) ||
        (warehouseMovement &&
          warehouseMovement.warehouseMovementStatus &&
          ![1, 4].some(
            id => id === warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId
          )),
    },
    {
      type: "secondary",
      label: intl.formatMessage({ id: "stock.pda.work-order-detail.menu.cancel-order" }),
      onClick: () => setShowConfirmCancel(true),
      closeOnClick: false,
      disabled:
        !isAuthorized(user.roles, getAuthRoles("stockMovmementCancel")) ||
        (warehouseMovement &&
          warehouseMovement.warehouseMovementStatus &&
          warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId !== 4), // != pausado
    },
  ];

  const cancelConfirmActions = [
    {
      type: "primary",
      label: intl.formatMessage({ id: "stock.pda.work-order-detail.menu.cancel-order.confirm" }),
      onClick: () => {
        const warehouseMovementStatusCancel = warehouseMovementsStatus.find(
          wms => wms.warehouseMovementStatusId === 5
        );
        updateWarehouseMovemementStatus(
          centerSelected.centerId,
          match.params.warehouseMovementId,
          warehouseMovementStatusCancel,
          warehouseMovement.warehouseMovementType.warehouseMovementTypeName
        );
        setShowConfirmCancel(false);
      },
      closeOnClick: true,
    },
    {
      type: "secondary",
      label: intl.formatMessage({ id: "stock.pda.work-order-detail.menu.back" }),
      onClick: () => setShowConfirmCancel(false),
      closeOnClick: false,
    },
  ];

  const renderReferences = () => {
    if (!warehouseMovement) {
      return null;
    }

    let title = "";
    switch (warehouseMovement.warehouseMovementType.warehouseMovementTypeId) {
      case 1:
        title = intl.formatMessage({
          id: "stock.pda.work-order-detail.inventary.references-and-units",
        });
        break;
      case 2:
        title = intl.formatMessage({
          id: "stock.pda.work-order-detail.traspase.references-and-units",
        });
        break;
      case 3:
        title = intl.formatMessage({ id: "stock.pda.work-order-detail.references-and-units" });
        break;
      case 4:
        title = intl.formatMessage({ id: "stock.pda.work-order-detail.free-entry.locations" });
        break;
      case 5:
        title = intl.formatMessage({ id: "stock.pda.work-order-detail.references-and-units" });
        break;
      default:
        break;
    }

    if (warehouseMovement.locations && warehouseMovement.locations.length > 0) {
      return (
        <MobileSidePanel
          title={title}
          visible={showReferences}
          onClose={() => setShowReferences(false)}
        >
          {warehouseMovementReferences.list &&
            warehouseMovementReferences.list.map(movement => {
              switch (warehouseMovement.warehouseMovementType.warehouseMovementTypeId) {
                case 1:
                case 3:
                  return (
                    <Salient
                      key={movement.material.materialId}
                      className='order-detail_references-list-item'
                      number={
                        movement.sourceLocation.unitsToTransfer ||
                        movement.sourceLocation.movementUnits ||
                        "-"
                      }
                      title={movement.material.manufacturerReference}
                      subtitle={movement.material.materialName.name}
                    />
                  );
                case 2:
                  // case 5:
                  if (warehouseMovement.locations.length === 1) {
                    return (
                      <SalientDual
                        key={movement.material.materialId}
                        className='order-detail_references-list-item'
                        items={[
                          {
                            title: `${Math.abs(
                              movement.sourceLocation.unitsToTransfer
                            )} ${intl.formatMessage({
                              id: "stock.pda.work-order-transfer-exec.units",
                            })}`,
                            subtitle: movement.material.materialName.name,
                          },
                          {
                            title: intl.formatMessage({
                              id: "stock.pda.work-order-detail.destination",
                            }),
                            subtitle:
                              movement.targetLocations && movement.targetLocations.length > 0
                                ? movement.targetLocations.length > 1
                                  ? intl.formatMessage({
                                      id: "stock.pda.work-order-detail.multiple",
                                    })
                                  : movement.targetLocations[0].location.locationName
                                : "-",
                          },
                        ]}
                      />
                    );
                  }
                  return null;
                default:
                  return null;
              }
            })}
        </MobileSidePanel>
      );
    }

    return null;
  };

  const renderLocations = () => {
    if (!warehouseMovement) {
      return null;
    }

    let title = "";
    switch (warehouseMovement.warehouseMovementType.warehouseMovementTypeId) {
      case 1:
        title = intl.formatMessage({
          id: "stock.pda.work-order-detail.inventary.references-and-units",
        });
        break;
      case 2:
        title = intl.formatMessage({
          id: "stock.pda.work-order-detail.traspase.references-and-units",
        });
        break;
      case 3:
        title = intl.formatMessage({ id: "stock.pda.work-order-detail.references-and-units" });
        break;
      case 4:
        title = intl.formatMessage({ id: "stock.pda.work-order-detail.free-entry.locations" });
        break;
      case 5:
        title = intl.formatMessage({ id: "stock.pda.work-order-detail.references-and-units" });
        break;
      default:
        break;
    }

    if (warehouseMovement.materials && warehouseMovement.materials.length > 0) {
      return (
        <MobileSidePanel
          title={title}
          visible={showLocations}
          onClose={() => setShowLocations(false)}
        >
          {warehouseMovementLocations.list &&
            warehouseMovementLocations.list.map(movement => {
              switch (warehouseMovement.warehouseMovementType.warehouseMovementTypeId) {
                case 1:
                case 3:
                  return (
                    <Salient
                      key={movement.sourceLocation.location.locationId}
                      className='order-detail_references-list-item'
                      number={movement.sourceLocation.movementUnits || "-"}
                      title={movement.sourceLocation.location.locationName}
                      subtitle={intl.formatMessage({ id: "stock.pda.work-order-detail.location" })}
                    />
                  );
                case 2:
                  // case 5:
                  if (warehouseMovement.materials.length === 1) {
                    return (
                      <SalientDual
                        key={movement.sourceLocation.location.locationId}
                        className='order-detail_references-list-item'
                        items={
                          movement.targetLocations && movement.targetLocations.length > 0
                            ? [
                                {
                                  title: `${Math.abs(
                                    movement.sourceLocation.unitsToTransfer
                                  )} ${intl.formatMessage({
                                    id: "stock.pda.work-order-transfer-exec.units",
                                  })}`,
                                  subtitle: movement.sourceLocation.location.locationName,
                                },
                                {
                                  title: intl.formatMessage({
                                    id: "stock.pda.work-order-detail.destination",
                                  }),
                                  subtitle:
                                    movement.targetLocations.length > 1
                                      ? intl.formatMessage({
                                          id: "stock.pda.work-order-detail.multiple",
                                        })
                                      : movement.targetLocations[0].location.locationName,
                                },
                              ]
                            : [
                                {
                                  title: intl.formatMessage({
                                    id: "stock.pda.work-order-transfer-exec.description",
                                  }),
                                  subtitle: movement.sourceLocation.location.locationName,
                                },
                                {
                                  title: intl.formatMessage({
                                    id: "stock.pda.work-order-detail.units",
                                  }),
                                  subtitle: Math.abs(movement.sourceLocation.unitsToTransfer),
                                },
                              ]
                        }
                      />
                    );
                  }
                  return null;
                default:
                  return null;
              }
            })}
        </MobileSidePanel>
      );
    }

    return null;
  };

  const renderDetailContent = () => {
    if (!warehouseMovement) {
      return null;
    }

    const creationUser = getUserName(warehouseMovement.creationUser || "");
    const assignedUser = getUserName(
      warehouseMovement.assignedUsers ? warehouseMovement.assignedUsers[0].assignedUser : ""
    );

    switch (warehouseMovement.warehouseMovementType.warehouseMovementTypeId) {
      case 1:
        return warehouseMovement.locations && warehouseMovement.locations.length > 0 ? (
          <InventoryLocation
            {...warehouseMovement}
            warehouseMovementReferences={warehouseMovementReferences}
            creationUser={creationUser}
            assignedUser={assignedUser}
            setShowReferences={setShowReferences}
          />
        ) : (
          <InventoryReference
            {...warehouseMovement}
            warehouseMovementLocations={warehouseMovementLocations}
            creationUser={creationUser}
            assignedUser={assignedUser}
            setShowLocations={setShowLocations}
          />
        );
      case 2:
        return (
          <Traspase
            {...warehouseMovement}
            warehouseMovementReferences={warehouseMovementReferences}
            warehouseMovementLocations={warehouseMovementLocations}
            creationUser={creationUser}
            assignedUser={assignedUser}
            setShowReferences={setShowReferences}
            setShowLocations={setShowLocations}
            transferType={transferType}
          />
        );
      case 3:
        return (
          <InventoryLocation
            {...warehouseMovement}
            warehouseMovementReferences={warehouseMovementReferences}
            creationUser={creationUser}
            assignedUser={assignedUser}
            setShowReferences={setShowReferences}
          />
        );
      case 4:
        return (
          <FreeEntry
            {...warehouseMovement}
            warehouseMovementReferences={warehouseMovementReferences}
            creationUser={creationUser}
            assignedUser={assignedUser}
          />
        );
      case 5:
        return (
          <Location
            {...warehouseMovement}
            warehouseMovementReferences={warehouseMovementReferences}
            creationUser={creationUser}
            assignedUser={assignedUser}
            setShowReferences={setShowReferences}
          />
        );
      default:
        return null;
    }
  };

  const renderTechnicians = () => {
    return (
      <AssignPannel
        visible={showTechnicians}
        close={() => setShowTechnicians(false)}
        onSelect={technicianLogin => {
          assignWarehouseMovement(
            centerSelected.centerId,
            match.params.warehouseMovementId,
            technicianLogin,
            warehouseMovement.warehouseMovementType.warehouseMovementTypeName,
            false //redirectToExec
          );
          setShowTechnicians(false);
        }}
      />
    );
  };

  const WAREHOUSE_MOVEMENTS_STATUS_COLOR = {
    1: "link",
    2: "info",
    3: "success",
    4: "link",
    5: "error",
  };

  let currentPageActions = null;
  const isAssignedWM =
    warehouseMovement &&
    warehouseMovement.assignedUsers &&
    warehouseMovement.assignedUsers.length > 0 &&
    warehouseMovement.assignedUsers[0].assignedUser === user.login;

  currentPageActions = !showConfirmCancel ? pageActions : cancelConfirmActions;

  if (warehouseMovement && warehouseMovement.progressPercent > 0 && isAssignedWM) {
    currentPageActions = null;
  }

  const canExecute =
    warehouseMovement &&
    warehouseMovement.warehouseMovementStatus &&
    [1, 2, 4].some(
      id => id === warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId
    );

  return (
    <PageMobile
      title={`Nº ${match.params.warehouseMovementId}`}
      subtitle={`${
        warehouseMovement ? warehouseMovement.warehouseMovementType.warehouseMovementTypeName : "-"
      }`}
      breadcrumb={intl.formatMessage({ id: "stock.pda.work-order-detail.title" })}
      onBack={() =>
        isAssignedWM
          ? history.push("/stock/pda/warehouse-movements/assigned")
          : history.push("/stock/pda/warehouse-movements/pending")
      }
      pageActions={currentPageActions}
      pageActionsTitle={
        !showConfirmCancel
          ? intl.formatMessage({ id: "stock.pda.work-order-detail.menu.actions" })
          : intl.formatMessage({ id: "stock.pda.work-order-detail.menu.cancel" })
      }
      resourceName='warehouseMovementDetailPage'
    >
      {warehouseMovement ? (
        <Chip
          label={warehouseMovement.warehouseMovementStatus.warehouseMovementStatusName}
          //color={`var(--color-warehouse-movement-status${warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId}, #858585)`}
          stateColor={
            WAREHOUSE_MOVEMENTS_STATUS_COLOR[
              warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId
            ]
          }
          info
        />
      ) : null}
      <div className='detail-container'>{renderDetailContent()}</div>
      {canExecute && warehouseMovement.progressPercent > 0 && isAssignedWM ? (
        <Button
          kind='primary'
          size='size-s'
          onClick={() => redirectToExecPage()}
          disabled={
            !isAuthorized(user.roles, getAuthRoles("stockMovementExecute")) ||
            (warehouseMovement &&
              warehouseMovement.warehouseMovementStatus &&
              ![1, 2, 4].some(
                id => id === warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId
              ))
          }
          label={intl.formatMessage({ id: "stock.pda.work-order-detail.execute-order" })}
        />
      ) : null}
      {renderReferences()}
      {renderLocations()}
      {renderTechnicians()}
    </PageMobile>
  );
}

export default injectUser(injectWarehouse(connectPda(WarehouseMovementDetail)));
