import React, { useState, useEffect } from "react";
import { Row, Col } from "amiga-core/components/layout/";

import { history } from "amiga-core/components/router";
import { T, intl } from "amiga-core/components/i18n";

import { Salient } from "lib-frontsga";
import { DataDefault } from "lib-frontsga";
import { Button } from "lib-frontsga";
import { NumberField } from "lib-frontsga";
import { Select } from "lib-frontsga";

import injectWarehouse from "application/connectors/injectWarehouse";
import connectPda from "stock/connectors/connectPda";
import PageMobile from "shared/components/page-mobile/";
import MobileSidePanel from "shared/components/mobile-slide-panel/";

import FinalizePannel from "../../components/finalize-pannel/";

import { debounce } from "@/utils/";

let timer = null;

function InventaryLocationsExec(props) {
  const {
    match,
    centerSelected,
    fetchWarehouseMovement,
    warehouseMovement,
    fetchWarehouseMovementStatus,
    warehouseMovementsStatus,
    fetchWarehouseMovementReferences,
    warehouseMovementReferences,
    inventoryLocationScanRef,
    inventoryLocationExec,
    inventoryLocationUpdateRefStock,
    inventoryLocationCancelInput,
    inventoryReferenceInLocation,
    updateWarehouseMovemementStatus,
    fetchLocationMaterials,
    locationMaterials,
    redirect,
    redirectToExec,
    setRedirectToExec,
    changeStatusTriggered,
    inventoryLocationChooseMaterial,
  } = props;

  const [showReferences, setShowReferences] = useState(false);
  const [showFinalizedReferences, setShowFinalizedReferences] = useState(false);
  const [showConfirmFinalize, setShowConfirmFinalize] = useState(false);
  const [showReferenceStockPannel, setShowReferenceStockPannel] = useState(
    false
  );
  const [showFinalizePannel, setShowFinalizePannel] = useState(false);
  const [continueAfterEnd, setContinueAfterEnd] = useState(false);

  useEffect(() => {
    if (warehouseMovementsStatus.length === 0) {
      fetchWarehouseMovementStatus();
    }
    if (redirectToExec) {
      setRedirectToExec(false);
    }

    timer = null;
  }, []);

  const forceUpdate = inventoryLocationExec.update;

  useEffect(() => {
    if (centerSelected) {
      fetchWarehouseMovement(
        centerSelected.centerId,
        match.params.warehouseMovementId
      );
    }
  }, [centerSelected, forceUpdate]);

  /**
   * Get location references paginated
   */
  useEffect(() => {
    if (
      centerSelected &&
      warehouseMovement &&
      locationMaterials.haveMore &&
      !locationMaterials.fetching &&
      warehouseMovement.locations.length > 0
    ) {
      fetchLocationMaterials(
        centerSelected.centerId,
        warehouseMovement.locations[0].locationId,
        {
          offset: locationMaterials.offset,
          limit: locationMaterials.limit,
        }
      );
    }
  }, [warehouseMovement, locationMaterials]);

  /**
   * change state to "in process"
   */
  useEffect(() => {
    if (
      centerSelected &&
      warehouseMovement &&
      warehouseMovement.warehouseMovementStatus &&
      warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId !==
        2 &&
      !changeStatusTriggered
    ) {
      const warehouseMovementStatusInProcess = warehouseMovementsStatus.find(
        (wms) => wms.warehouseMovementStatusId === 2
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
        }, 2000);
      }
    }
  }, [centerSelected, warehouseMovement]);

  /**
   * Get warehouse movement references paginated
   */
  useEffect(() => {
    const needToFetchWMRef =
      warehouseMovement &&
      warehouseMovement.locations &&
      (!warehouseMovement.materials ||
        (warehouseMovement.materials &&
          warehouseMovement.materials.length === 0));
    if (
      centerSelected &&
      warehouseMovementReferences.haveMore &&
      !warehouseMovementReferences.fetching &&
      needToFetchWMRef
    ) {
      fetchWarehouseMovementReferences(
        centerSelected.centerId,
        match.params.warehouseMovementId,
        {
          offset: warehouseMovementReferences.offset,
          limit: warehouseMovementReferences.limit,
        }
      );
    }
  }, [centerSelected, warehouseMovementReferences, warehouseMovement]);

  useEffect(() => {
    if (inventoryLocationExec.scannedMaterial) {
      setShowReferenceStockPannel(true);
    } else {
      setShowReferenceStockPannel(false);
    }
  }, [inventoryLocationExec]);

  /**
   * Redirect to detail when update finished
   */
  useEffect(() => {
    if (redirect) {
      history.push(
        `/stock/pda/warehouse-movements/${match.params.warehouseMovementId}`
      );
    }
  }, [redirect]);

  useEffect(() => {
    if (
      warehouseMovement &&
      warehouseMovement.progressPercent === 100 &&
      !continueAfterEnd
    ) {
      setShowFinalizePannel(true);
    }
  }, [warehouseMovement]);

  const onBack = () => {
    if (
      warehouseMovement.warehouseMovementStatus.warehouseMovementStatusId === 2
    ) {
      const warehouseMovementStatusPaused = warehouseMovementsStatus.find(
        (wms) => wms.warehouseMovementStatusId === 4
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

  const handleFinalize = () => {
    const warehouseMovementStatusClosed = warehouseMovementsStatus.find(
      (wms) => wms.warehouseMovementStatusId === 3
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

  const finalizeConfirmActions = [];

  if (warehouseMovement && warehouseMovement.progressPercent < 100) {
    finalizeConfirmActions.push({
      type: "text",
      label: (
        <span className="error-msg">
          <T id="stock.pda.exec-inventary-location.finalize-warning" />
        </span>
      ),
    });
  }

  finalizeConfirmActions.push({
    type: "primary",
    label: intl.formatMessage({ id: "stock.pda.work-order-exec.finalize" }),
    onClick: handleFinalize,
    closeOnClick: true,
  });

  finalizeConfirmActions.push({
    type: "secondary",
    label: intl.formatMessage({ id: "stock.pda.work-order-detail.menu.back" }),
    onClick: () => setShowConfirmFinalize(false),
    closeOnClick: false,
  });

  const handleInventoryMaterialInLocation = () => {
    const data = {
      material: {
        materialId: inventoryLocationExec.scannedMaterial
          ? inventoryLocationExec.scannedMaterial.materialId
          : 0,
      },
      sourceLocation: {
        location: {
          locationId: warehouseMovement.locations[0].locationId,
        },
        movementUnits: inventoryLocationExec.currentStock
          ? inventoryLocationExec.currentStock
          : 0,
      },
    };
    inventoryReferenceInLocation(
      centerSelected.centerId,
      match.params.warehouseMovementId,
      data,
      {
        material:
          inventoryLocationExec.scannedMaterial.general.manufacturerReference,
      }
    );

    setShowReferenceStockPannel(false);
  };

  const locationMaterialsFiltered = locationMaterials.list.filter(
    (material) =>
      !warehouseMovementReferences.list.some(
        (wmr) => wmr.material.materialId === material.materialId
      )
  );

  const renderLocationReferences = () => {
    if (!warehouseMovement) {
      return null;
    }

    if (locationMaterials.list && locationMaterials.list.length > 0) {
      return (
        <MobileSidePanel
          title={intl.formatMessage({
            id:
              "stock.pda.work-order-detail.inventary.references-and-units-pending",
          })}
          visible={showReferences}
          onClose={() => setShowReferences(false)}
        >
          {locationMaterialsFiltered.map((material) => {
            return (
              <Salient
                key={material.materialId}
                className="order-detail_references-list-item"
                number={material.locationStock || "-"}
                title={material.manufacturerReference}
                subtitle={material.materialName.name}
              />
            );
          })}
        </MobileSidePanel>
      );
    }

    return null;
  };

  const renderFinalizedReferences = () => {
    if (!warehouseMovement) {
      return null;
    }

    if (
      warehouseMovementReferences.list &&
      warehouseMovementReferences.list.length
    ) {
      return (
        <MobileSidePanel
          title={intl.formatMessage({
            id: "stock.pda.work-order-detail.inventary.references-and-units",
          })}
          visible={showFinalizedReferences}
          onClose={() => setShowFinalizedReferences(false)}
        >
          {warehouseMovementReferences.list &&
            warehouseMovementReferences.list.map((movement) => {
              return (
                <Salient
                  key={movement.material.materialId}
                  className="order-detail_references-list-item"
                  number={movement.sourceLocation.movementUnits || "-"}
                  title={movement.material.materialId}
                  subtitle={movement.material.materialName.name}
                />
              );
            })}
        </MobileSidePanel>
      );
    }

    return null;
  };

  const renderReferenceStockPanel = () => {
    const errors = [];
    if (
      inventoryLocationExec.currentStock &&
      inventoryLocationExec.currentStock < 0
    ) {
      errors.push(
        intl.formatMessage({
          id: "stock.pda.work-order-detail.incorrect-value",
        })
      );
    }

    return (
      <MobileSidePanel
        key={
          inventoryLocationExec.scannedMaterial
            ? inventoryLocationExec.scannedMaterial.materialId
            : 0
        }
        title={intl.formatMessage({
          id: "stock.pda.work-order-detail.scanned-reference",
        })}
        visible={showReferenceStockPannel}
        showArrowClose={false}
      >
        {inventoryLocationExec.scannedMaterials.length === 1 ? (
          <DataDefault
            className="mb-16"
            title={intl.formatMessage({
              id: "stock.pda.work-order-detail.material",
            })}
            subtitle={
              inventoryLocationExec.scannedMaterial
                ? inventoryLocationExec.scannedMaterial.materialId
                : null
            }
          />
        ) : (
          <Select
            label={intl.formatMessage({
              id: "stock.pda.work-order-detail.material",
            })}
            options={inventoryLocationExec.scannedMaterials.map((material) => ({
              label: material.general.materialI18n.name,
              value: material.materialId,
            }))}
            onChange={(material) =>
              inventoryLocationChooseMaterial(material.value)
            }
            value={
              inventoryLocationExec.scannedMaterial
                ? {
                    label:
                      inventoryLocationExec.scannedMaterial.general.materialI18n
                        .name,
                    value: inventoryLocationExec.scannedMaterial.materialId,
                  }
                : null
            }
          />
        )}
        <NumberField
          className="mb-16"
          label={intl.formatMessage({
            id: "stock.pda.work-order-detail.units-inventary",
          })}
          value={
            inventoryLocationExec.currentStock
              ? inventoryLocationExec.currentStock
              : 0
          }
          onChange={(val) => inventoryLocationUpdateRefStock(val)}
          errors={errors}
        />
        <Button
          kind="primary"
          className="mb-16"
          disabled={errors.length > 0}
          onClick={() => handleInventoryMaterialInLocation()}
          label={intl.formatMessage({
            id: "stock.pda.work-order-detail.inventary",
          })}
        />
        <Button
          kind="secondary"
          onClick={() => {
            setShowReferenceStockPannel(false);
            inventoryLocationCancelInput();
          }}
          label={intl.formatMessage({
            id: "stock.pda.work-order-detail.cancel",
          })}
        />
      </MobileSidePanel>
    );
  };

  const renderFinalizePannel = () => {
    return (
      <FinalizePannel
        title={intl.formatMessage({
          id: "stock.pda.work-order.inventary-location.finalize.title",
        })}
        content={intl.formatMessage({
          id: "stock.pda.work-order.inventary-location.finalize.content",
        })}
        visible={showFinalizePannel}
        onClose={() => {
          setShowFinalizePannel(false);
          setContinueAfterEnd(true);
        }}
        onFinalize={handleFinalize}
      />
    );
  };

  let currentPageActions = pageActions;

  currentPageActions = !showConfirmFinalize
    ? currentPageActions
    : finalizeConfirmActions;

  return (
    <PageMobile
      breadcrumb={intl.formatMessage({
        id: "stock.pda.work-order.inventary.exect.title",
      })}
      onBack={onBack}
      pageActions={currentPageActions}
      onPageActionsClose={() => setShowConfirmFinalize(false)}
      pageActionsTitle={
        !showConfirmFinalize
          ? intl.formatMessage({
              id: "stock.pda.work-order-detail.menu.actions",
            })
          : intl.formatMessage({
              id: "stock.pda.work-order-detail.menu.actions.confirm-finalize",
            })
      }
      onScan={debounce((scan) => {
        if (scan) {
          inventoryLocationScanRef(
            centerSelected ? centerSelected.centerId : 0,
            scan
          );
        }
      }, 100)}
      scanLabel={intl.formatMessage({
        id: "stock.pda.work-order-detail.free-entry.scan-material",
      })}
      resourceName="warehouseMovmementExecInventoryPage"
    >
      <div className="detail-container">
        <DataDefault
          className="mb-16"
          title={intl.formatMessage({
            id: "stock.pda.work-order.inventary.order-num",
          })}
          subtitle={
            warehouseMovement
              ? `${warehouseMovement.warehouseMovementId}`
              : null
          }
        />
        <DataDefault
          className="mb-16"
          title={intl.formatMessage({
            id: "stock.pda.work-order-detail.location",
          })}
          subtitle={
            warehouseMovement &&
            warehouseMovement.locations &&
            warehouseMovement.locations.length > 0
              ? warehouseMovement.locations[0].locationName
              : null
          }
        />
        <Salient
          className="mb-16"
          title={intl.formatMessage({
            id:
              "stock.pda.work-order-detail.inventary.references-and-units-pending",
          })}
          number={locationMaterialsFiltered.length}
          icon="sga-icon-info-circle"
          onActionClicked={() => setShowReferences(true)}
          disabledNumber
        />
        <Salient
          className="mb-16"
          title={intl.formatMessage({
            id: "stock.pda.work-order-detail.inventary.references-and-units",
          })}
          number={warehouseMovementReferences.list.length}
          icon="sga-icon-info-circle"
          onActionClicked={() => setShowFinalizedReferences(true)}
          disabledNumber
        />
      </div>

      {renderLocationReferences()}
      {renderFinalizedReferences()}
      {renderReferenceStockPanel()}
      {renderFinalizePannel()}
    </PageMobile>
  );
}

export default injectWarehouse(connectPda(InventaryLocationsExec));
