import React, { useState, useEffect } from "react";

import { history } from "amiga-core/components/router";
import { T, intl } from "amiga-core/components/i18n";
import Col from "amiga-core/components/layout/col";
import Row from "amiga-core/components/layout/row";

import { Salient } from "lib-frontsga";
import { DataDefault } from "lib-frontsga";
import { NumberField } from "lib-frontsga";
import { Select } from "lib-frontsga";

import injectWarehouse from "application/connectors/injectWarehouse";
import connectPda from "stock/connectors/connectPda";
import PageMobile from "shared/components/page-mobile/";

import MovementsPannel from "./components/movements-pannel/";
import FinalizePannel from "../../components/finalize-pannel/";
import AvailableLocations from "../../components/available-locations/";

import { transferTypes } from "../../CONSTANTS";

import { debounce } from "@/utils/";

let timer = null;

import "./styles.css";

function TraspaseExec(props) {
  const {
    match,
    fetchWarehouseMovement,
    warehouseMovement,
    warehouseMovementsStatus,
    fetchWarehouseMovementStatus,
    setRedirect,
    centerSelected,
    redirect,
    warehouseMovementReferences,
    fetchWarehouseMovementReferences,
    warehouseMovementLocations,
    fetchWarehouseMovementLocations,
    updateWarehouseMovemementStatus,
    transferLocScanRef,
    transferLocationExec,
    transferMaterialExec,
    transferExec,
    changeTransferUnits,
    transferLocScanTargetLoc,
    transferStart,
    foceUpdateMovement,
    transferRefScanSourceLoc,
    transferRefScanTargetLoc,
    redirectToExec,
    setRedirectToExec,
    changeStatusTriggered,
    addNotification,
    transferLocationChooseMaterial,
  } = props;

  const [showMovements, setShowMovements] = useState(false);
  const [transferType, setTransferType] = useState("");
  const [showConfirmFinalize, setShowConfirmFinalize] = useState(false);
  const [showFinalizePannel, setShowFinalizePannel] = useState(false);
  const [continueAfterEnd, setContinueAfterEnd] = useState(false);

  useEffect(() => {
    if (warehouseMovementsStatus.length === 0) {
      fetchWarehouseMovementStatus();
    }

    if (redirect) {
      setRedirect(false);
    }
    if (redirectToExec) {
      setRedirectToExec(false);
    }

    timer = null;
  }, []);

  useEffect(() => {
    if (centerSelected) {
      fetchWarehouseMovement(centerSelected.centerId, match.params.warehouseMovementId);
    }
  }, [centerSelected, foceUpdateMovement]);

  useEffect(() => {
    if (
      warehouseMovement &&
      warehouseMovement.materials &&
      warehouseMovement.materials.length === 1
    ) {
      setTransferType(transferTypes.MATERIAL);
    }
    if (
      warehouseMovement &&
      warehouseMovement.locations &&
      warehouseMovement.locations.length === 1
    ) {
      setTransferType(transferTypes.LOCATION);
    }
  }, [warehouseMovement]);

  /**
   * change state to "in process"
   */
  useEffect(() => {
    if (
      centerSelected &&
      warehouseMovement &&
      warehouseMovement.warehouseMovementStatus &&
      warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId !== 2 &&
      !changeStatusTriggered
    ) {
      const warehouseMovementStatusInProcess = warehouseMovementsStatus.find(
        wms => wms.warehouseMovementStatusId === 2
      );
      if (!timer) {
        timer = setTimeout(() => {
          updateWarehouseMovemementStatus(
            centerSelected.centerId,
            match.params.warehouseMovementId,
            warehouseMovementStatusInProcess,
            warehouseMovement.warehouseMovementType.warehouseMovementTypeName,
            false,
            false //not shown loading and notification
          );
          clearTimeout(timer);
        }, 2000);
      }
    }
  }, [centerSelected, warehouseMovement]);

  /**
   * Get warehouse movement references paginated
   */
  useEffect(() => {
    if (
      centerSelected &&
      warehouseMovementReferences.haveMore &&
      !warehouseMovementReferences.fetching &&
      transferType === transferTypes.LOCATION
    ) {
      fetchWarehouseMovementReferences(centerSelected.centerId, match.params.warehouseMovementId, {
        offset: warehouseMovementReferences.offset,
        limit: warehouseMovementReferences.limit,
      });
    }
  }, [centerSelected, warehouseMovementReferences, transferType]);

  /**
   * Get warehouse movement locations paginated
   */
  useEffect(() => {
    if (
      centerSelected &&
      warehouseMovementLocations.haveMore &&
      !warehouseMovementLocations.fetching &&
      transferType === transferTypes.MATERIAL
    ) {
      fetchWarehouseMovementLocations(centerSelected.centerId, match.params.warehouseMovementId, {
        offset: warehouseMovementLocations.offset,
        limit: warehouseMovementLocations.limit,
      });
    }
  }, [centerSelected, warehouseMovementLocations, transferType]);

  /**
   * Redirect to detail when update finished
   */
  useEffect(() => {
    if (redirect) {
      history.push(`/stock/pda/warehouse-movements/${match.params.warehouseMovementId}`);
    }
  }, [redirect]);

  useEffect(() => {
    // Si todas las dependencias están cubiertas lanzar el traspaso
    if (transferType === transferTypes.LOCATION) {
      if (transferLocationExec.error) {
        addNotification({
          type: "error",
          fadeout: true,
          content: intl.formatMessage({
            id: "stock.pda.work-order-transfer-exec.scan-material-error",
          }),
        });
      }

      if (transferLocationExec.materials.length > 1) {
        //console.log("seleccionar referencia");
      }

      if (transferLocationExec.material && transferLocationExec.targetLocation) {
        const data = {
          material: {
            materialId: transferLocationExec.material.materialId,
          },
          sourceLocation: {
            location: {
              locationId: warehouseMovement.locations[0].locationId,
            },
            unitsToTransfer: transferLocationExec.transferUnits,
          },
          targetLocations: [
            {
              location: {
                locationId: transferLocationExec.targetLocation.locationId,
              },
              unitsToTransfer: transferLocationExec.transferUnits,
            },
          ],
        };

        transferExec(centerSelected.centerId, warehouseMovement.warehouseMovementId, data, {
          location: transferLocationExec.targetLocation.locationName,
          material: transferLocationExec.material.general.manufacturerReference,
        });
      }
    } else if (transferType === transferTypes.MATERIAL) {
      if (transferMaterialExec.error) {
        addNotification({
          type: "error",
          fadeout: true,
          content: intl.formatMessage({
            id: "stock.pda.work-order-transfer-exec.scan-location-error",
          }),
        });
      }
      if (transferMaterialExec.sourceLocation && transferMaterialExec.targetLocation) {
        const data = {
          material: {
            materialId: warehouseMovement.materials[0].materialId,
          },
          sourceLocation: {
            location: {
              locationId: transferMaterialExec.sourceLocation.locationId,
            },
            unitsToTransfer: transferMaterialExec.transferUnits,
          },
          targetLocations: [
            {
              location: {
                locationId: transferMaterialExec.targetLocation.locationId,
              },
              unitsToTransfer: transferMaterialExec.transferUnits,
            },
          ],
        };

        transferExec(centerSelected.centerId, warehouseMovement.warehouseMovementId, data, {
          location: transferMaterialExec.targetLocation.locationName,
          material: warehouseMovement.materials[0].manufacturerReference,
        });
      }
    }
  }, [transferLocationExec, transferMaterialExec]);

  useEffect(() => {
    const movementFinished = warehouseMovement && warehouseMovement.progressPercent === 100;

    if (
      transferType === transferTypes.LOCATION &&
      movementFinished &&
      transferStart &&
      !continueAfterEnd
    ) {
      setShowFinalizePannel(true);
    }

    if (
      transferType === transferTypes.MATERIAL &&
      movementFinished &&
      transferStart &&
      !continueAfterEnd
    ) {
      setShowFinalizePannel(true);
    }
  }, [warehouseMovementReferences, warehouseMovementLocations]);

  const onBack = () => {
    if (warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId === 2) {
      const warehouseMovementStatusPaused = warehouseMovementsStatus.find(
        wms => wms.warehouseMovementStatusId === 4
      );
      updateWarehouseMovemementStatus(
        centerSelected.centerId,
        match.params.warehouseMovementId,
        warehouseMovementStatusPaused,
        warehouseMovement.warehouseMovementType.warehouseMovementTypeName,
        true
      );
    }
  };

  const handleFinalize = () => {
    const warehouseMovementStatusClosed = warehouseMovementsStatus.find(
      wms => wms.warehouseMovementStatusId === 3
    );
    updateWarehouseMovemementStatus(
      centerSelected.centerId,
      match.params.warehouseMovementId,
      warehouseMovementStatusClosed,
      warehouseMovement.warehouseMovementType.warehouseMovementTypeName,
      true
    );
    setShowConfirmFinalize(false);
  };

  const pageActions = [
    {
      type: "primary",
      label: intl.formatMessage({ id: "stock.pda.work-order-exec.finalize" }),
      onClick: () => setShowConfirmFinalize(true),
      closeOnClick: false,
    },
    {
      type: "secondary",
      label: intl.formatMessage({ id: "stock.pda.work-order-exec.pause" }),
      onClick: () => {
        onBack();
      },
      closeOnClick: true,
    },
  ];

  const finalizeConfirmActions = [
    {
      type: "primary",
      label: intl.formatMessage({ id: "stock.pda.work-order-exec.finalize" }),
      onClick: handleFinalize,
      closeOnClick: true,
    },
    {
      type: "secondary",
      label: intl.formatMessage({
        id: "stock.pda.work-order-detail.menu.back",
      }),
      onClick: () => setShowConfirmFinalize(false),
      closeOnClick: false,
    },
  ];

  const handleScan = scan => {
    if (scan) {
      if (transferType === transferTypes.LOCATION) {
        if (transferLocationExec.material === null) {
          transferLocScanRef(centerSelected.centerId, scan);
        } else {
          //se ha escaneado ubicación destino del traspaso de ubicación
          if (isCorrectQty()) {
            transferLocScanTargetLoc(centerSelected.centerId, scan);
          }
        }
      } else {
        if (transferMaterialExec.sourceLocation === null) {
          transferRefScanSourceLoc(centerSelected.centerId, scan);
        } else {
          if (isCorrectQty()) {
            transferRefScanTargetLoc(centerSelected.centerId, scan);
          }
        }
      }
    }
  };

  const renderMovements = () => {
    if (!warehouseMovement) {
      return null;
    }

    return (
      <MovementsPannel
        transferType={transferType}
        warehouseMovementReferences={warehouseMovementReferences}
        warehouseMovementLocations={warehouseMovementLocations}
        showMovements={showMovements}
        setShowMovements={setShowMovements}
      />
    );
  };

  const renderFinalizePannel = () => (
    <FinalizePannel
      title={intl.formatMessage({
        id: "stock.pda.work-order-transfer-exec.finalize-pannel.title",
      })}
      content={intl.formatMessage({
        id: "stock.pda.work-order-transfer-exec.finalize-pannel.msg-location",
      })}
      visible={showFinalizePannel}
      onClose={() => {
        setShowFinalizePannel(false);
        setContinueAfterEnd(true);
      }}
      onFinalize={handleFinalize}
    />
  );

  const isCorrectQty = () => {
    //Si no hay escaneado ninguna ubicación o referencia, la damos por buena
    if (
      (transferType === transferTypes.LOCATION && transferLocationExec.material === null) ||
      (transferType === transferTypes.MATERIAL && transferMaterialExec.sourceLocation === null)
    ) {
      return true;
    }

    if (
      transferType === transferTypes.LOCATION &&
      transferLocationExec.material !== null &&
      transferLocationExec.transferUnits > 0 //&&
      // transferLocationExec.transferUnits <= transferLocationExec.transferUnitsMax
    ) {
      return true;
    } else if (
      transferType === transferTypes.MATERIAL &&
      transferMaterialExec.sourceLocation !== null &&
      transferMaterialExec.transferUnits > 0 //&&
      // transferMaterialExec.transferUnits <= transferMaterialExec.transferUnitsMax
    ) {
      return true;
    }

    return false;
  };

  let currentPageActions = pageActions;

  currentPageActions = !showConfirmFinalize ? currentPageActions : finalizeConfirmActions;

  return (
    <PageMobile
      className='transfer-exec-page'
      breadcrumb={intl.formatMessage({
        id: "stock.pda.work-order-transfer-exec.title",
      })}
      onBack={onBack}
      pageActions={currentPageActions}
      pageActionsTitle={
        !showConfirmFinalize
          ? intl.formatMessage({
              id: "stock.pda.work-order-detail.menu.actions",
            })
          : intl.formatMessage({
              id: "stock.pda.work-order-detail.menu.actions.confirm-finalize",
            })
      }
      onScan={debounce(handleScan, 100)}
      resourceName='warehouseMovmementExecTransferPage'
    >
      <p>
        <T id='stock.pda.work-order-transfer-exec.title-name' /> {match.params.warehouseMovementId}
      </p>
      {/* <DataDefault
        className="mb-16"
        title={intl.formatMessage({ id: "stock.pda.work-order-transfer-exec.order-num" })}
        subtitle={match.params.warehouseMovementId}
      /> */}
      {transferType === transferTypes.LOCATION ? (
        <DataDefault
          className='mb-16'
          title={intl.formatMessage({
            id: "stock.pda.work-order-transfer-exec.location",
          })}
          subtitle={
            warehouseMovement &&
            warehouseMovement.locations &&
            warehouseMovement.locations.length > 0
              ? warehouseMovement.locations[0].locationName
              : null
          }
        />
      ) : (
        <DataDefault
          className='mb-16'
          title={intl.formatMessage({
            id: "stock.pda.work-order-transfer-exec.material",
          })}
          subtitle={
            warehouseMovement &&
            warehouseMovement.materials &&
            warehouseMovement.materials.length > 0
              ? warehouseMovement.materials[0].manufacturerReference
              : null
          }
        />
      )}
      <Salient
        className='mb-16'
        title={
          transferType === transferTypes.LOCATION
            ? intl.formatMessage({
                id: "stock.pda.work-order-transfer-exec.materials-to-traspase",
              })
            : intl.formatMessage({
                id: "stock.pda.work-order-transfer-exec.locations-to-traspase",
              })
        }
        number={
          transferType === transferTypes.LOCATION
            ? warehouseMovementReferences.list.length
            : warehouseMovementLocations.list.length
        }
        icon='sga-icon-info-circle'
        onActionClicked={() => setShowMovements(true)}
        disabledNumber
      />
      {transferType === transferTypes.LOCATION ? (
        <>
          {transferLocationExec.materials.length > 1 ? (
            <Select
              label={intl.formatMessage({
                id: "stock.pda.work-order-detail.material",
              })}
              options={transferLocationExec.materials.map(material => ({
                label: material.general.materialI18n.name,
                value: material.materialId,
              }))}
              onChange={material => transferLocationChooseMaterial(material.value)}
              value={
                transferLocationExec.material
                  ? {
                      label: transferLocationExec.material.general.materialI18n.name,
                      value: transferLocationExec.material.materialId,
                    }
                  : null
              }
            />
          ) : (
            <DataDefault
              className='mb-16'
              isActive={transferLocationExec.material === null}
              title={intl.formatMessage({
                id: "stock.pda.work-order-transfer-exec.material",
              })}
              subtitle={
                transferLocationExec.material
                  ? transferLocationExec.material.general.manufacturerReference
                  : intl.formatMessage({
                      id: "stock.pda.work-order-transfer-exec.pending",
                    })
              }
            />
          )}
        </>
      ) : (
        <DataDefault
          className='mb-16'
          isActive={transferMaterialExec.sourceLocation === null}
          title={intl.formatMessage({
            id: "stock.pda.work-order-transfer-exec.source-location",
          })}
          subtitle={
            transferMaterialExec.sourceLocation
              ? transferMaterialExec.sourceLocation.locationName
              : intl.formatMessage({
                  id: "stock.pda.work-order-transfer-exec.pending",
                })
          }
        />
      )}
      <NumberField
        className='mb-16'
        label={intl.formatMessage({
          id: "stock.pda.work-order-transfer-exec.transfer-units",
        })}
        value={
          transferType === transferTypes.LOCATION
            ? transferLocationExec.transferUnits
            : transferMaterialExec.transferUnits
        }
        key={
          transferType === transferTypes.LOCATION
            ? JSON.stringify(transferLocationExec.material)
            : JSON.stringify(transferMaterialExec.sourceLocation)
        }
        disabled={
          transferType === transferTypes.LOCATION
            ? transferLocationExec.material === null
            : transferMaterialExec.sourceLocation === null
        }
        onChange={units => changeTransferUnits(units)}
        errors={
          !isCorrectQty()
            ? [
                intl.formatMessage({
                  id: "stock.pda.work-order-detail.incorrect-value",
                }),
              ]
            : []
        }
      />
      <AvailableLocations
        disabled={
          transferType === transferTypes.LOCATION
            ? transferLocationExec.material === null
            : transferMaterialExec.sourceLocation === null
        }
        materialId={
          transferType === transferTypes.MATERIAL
            ? warehouseMovement.materials.length > 0
              ? warehouseMovement.materials[0].materialId
              : null
            : transferLocationExec.material && transferLocationExec.material.materialId
        }
        onSelect={location => handleScan(location.locationName)}
        excludeLocations={
          transferType === transferTypes.MATERIAL
            ? transferMaterialExec.sourceLocation
              ? [transferMaterialExec.sourceLocation.locationId]
              : []
            : warehouseMovement &&
              warehouseMovement.locations &&
              warehouseMovement.locations.length > 0
            ? [warehouseMovement.locations[0].locationId]
            : []
        }
      />
      <DataDefault
        className='mb-16'
        title={intl.formatMessage({
          id: "stock.pda.work-order-transfer-exec.target-location",
        })}
        isActive={
          transferType === transferTypes.LOCATION
            ? transferLocationExec.material !== null
            : transferMaterialExec.sourceLocation !== null
        }
        disabled={
          transferType === transferTypes.LOCATION
            ? transferLocationExec.material === null
            : transferMaterialExec.sourceLocation === null
        }
        subtitle={
          transferType === transferTypes.LOCATION
            ? (transferLocationExec.targetLocation &&
                transferLocationExec.targetLocation.locationName) ||
              intl.formatMessage({
                id: "stock.pda.work-order-transfer-exec.pending",
              })
            : (transferMaterialExec.targetLocation &&
                transferMaterialExec.targetLocation.locationName) ||
              intl.formatMessage({
                id: "stock.pda.work-order-transfer-exec.pending",
              })
        }
      />

      {renderMovements()}
      {renderFinalizePannel()}
    </PageMobile>
  );
}

export default injectWarehouse(connectPda(TraspaseExec));
