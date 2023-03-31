import React, { useState, useEffect } from "react";
import { Row, Col } from "amiga-core/components/layout/";

import { history } from "amiga-core/components/router";
import { T, intl } from "amiga-core/components/i18n";

import { Salient } from "lib-frontsga";
import { DataDefault } from "lib-frontsga";
import { Button } from "lib-frontsga";
import { NumberField } from "lib-frontsga";

import injectWarehouse from "application/connectors/injectWarehouse";
import connectPda from "stock/connectors/connectPda";
import PageMobile from "shared/components/page-mobile/";
import MobileSidePanel from "shared/components/mobile-slide-panel/";

import FinalizePannel from "../../components/finalize-pannel/";

import { debounce } from "@/utils/";

let timer = null;

function InventaryReferencesExec(props) {
  const {
    match,
    centerSelected,
    fetchWarehouseMovement,
    warehouseMovement,
    fetchWarehouseMovementStatus,
    warehouseMovementsStatus,
    inventoryReferenceScanLoc,
    inventoryMaterialExec,
    inventoryMaterialUpdateLocStock,
    inventoryLocationCancelInput,
    inventoryReferenceInLocation,
    updateWarehouseMovemementStatus,
    fetchMaterialLocations,
    materialLocations,
    fetchWarehouseMovementLocations,
    warehouseMovementLocations,
    redirect,
    redirectToExec,
    setRedirectToExec,
    changeStatusTriggered,
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

  const forceUpdate = inventoryMaterialExec.update;

  useEffect(() => {
    if (centerSelected) {
      fetchWarehouseMovement(
        centerSelected.centerId,
        match.params.warehouseMovementId
      );
    }
  }, [centerSelected, forceUpdate]);

  /**
   * Get reference locations paginated
   */
  useEffect(() => {
    if (
      warehouseMovement &&
      centerSelected &&
      materialLocations.haveMore &&
      !materialLocations.fetching &&
      warehouseMovement.materials.length > 0
    ) {
      fetchMaterialLocations(
        centerSelected.centerId,
        warehouseMovement.materials[0].materialId,
        {
          offset: materialLocations.offset,
          limit: materialLocations.limit,
        },
        true //append instead of replace
      );
    }
  }, [warehouseMovement, materialLocations]);

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
      if (!timer) {
        const warehouseMovementStatusInProcess = warehouseMovementsStatus.find(
          (wms) => wms.warehouseMovementStatusId === 2
        );
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
      warehouseMovement.materials &&
      (!warehouseMovement.locations ||
        (warehouseMovement.locations &&
          warehouseMovement.locations.length === 0));
    if (
      centerSelected &&
      warehouseMovementLocations.haveMore &&
      !warehouseMovementLocations.fetching &&
      needToFetchWMRef
    ) {
      fetchWarehouseMovementLocations(
        centerSelected.centerId,
        match.params.warehouseMovementId,
        {
          offset: warehouseMovementLocations.offset,
          limit: warehouseMovementLocations.limit,
        }
      );
    }
  }, [centerSelected, warehouseMovementLocations, warehouseMovement]);

  useEffect(() => {
    if (inventoryMaterialExec.scannedLocation !== null) {
      setShowReferenceStockPannel(true);
    }
  }, [inventoryMaterialExec]);

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
          <T id="stock.pda.exec-inventary-material.finalize-warning" />
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
        materialId: warehouseMovement.materials[0].materialId,
      },
      sourceLocation: {
        location: {
          locationId: inventoryMaterialExec.scannedLocation.locationId,
        },
        movementUnits: inventoryMaterialExec.currentStock
          ? inventoryMaterialExec.currentStock
          : 0,
      },
    };
    inventoryReferenceInLocation(
      centerSelected.centerId,
      match.params.warehouseMovementId,
      data,
      {
        material: warehouseMovement.materials[0].manufacturerReference,
        location: inventoryMaterialExec.scannedLocation.locationName,
      }
    );

    setShowReferenceStockPannel(false);
  };

  //Se filtran las referencias que ya han sido inventariadas
  const materialLocationsFiltered = materialLocations.list.filter(
    (location) =>
      !warehouseMovementLocations.list.some(
        (wml) => wml.sourceLocation.location.locationId === location.locationId
      )
  );

  const renderReferenceLocations = () => {
    if (!warehouseMovement) {
      return null;
    }

    if (materialLocations.list && materialLocations.list.length > 0) {
      return (
        <MobileSidePanel
          title={intl.formatMessage({
            id:
              "stock.pda.work-order-detail.inventary.locations-and-units-pending",
          })}
          visible={showReferences}
          onClose={() => setShowReferences(false)}
        >
          {materialLocationsFiltered.map((location) => {
            return (
              <Salient
                key={location.locationId}
                className="order-detail_references-list-item"
                number={location.stock || "-"}
                title={location.locationCode}
                subtitle={intl.formatMessage({
                  id: "stock.pda.work-order-detail.location",
                })}
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
      warehouseMovementLocations.list &&
      warehouseMovementLocations.list.length
    ) {
      return (
        <MobileSidePanel
          title={intl.formatMessage({
            id: "stock.pda.work-order-detail.inventary.locations-and-units",
          })}
          visible={showFinalizedReferences}
          onClose={() => setShowFinalizedReferences(false)}
        >
          {warehouseMovementLocations.list &&
            warehouseMovementLocations.list.map((movement) => {
              return (
                <Salient
                  key={`${movement.sourceLocation.location.locationId}-finalized`}
                  className="order-detail_references-list-item"
                  number={movement.sourceLocation.movementUnits || "-"}
                  title={movement.sourceLocation.location.locationName}
                  subtitle={intl.formatMessage({
                    id: "stock.pda.work-order-detail.location",
                  })}
                />
              );
            })}
        </MobileSidePanel>
      );
    }

    return null;
  };

  const renderReferenceStockPanel = () => {
    if (!inventoryMaterialExec.scannedLocation) {
      return null;
    }

    const errors = [];
    if (
      inventoryMaterialExec.currentStock &&
      inventoryMaterialExec.currentStock < 0
    ) {
      errors.push(
        intl.formatMessage({
          id: "stock.pda.work-order-detail.incorrect-value",
        })
      );
    }

    // const locationFull = materialLocations.list.find(
    //   (loc) => loc.locationId === inventoryMaterialExec.scannedLocation.locationId,
    // );

    return (
      <MobileSidePanel
        key={
          inventoryMaterialExec.scannedMaterial
            ? inventoryMaterialExec.scannedMaterial.materialId
            : 0
        }
        title={
          warehouseMovement &&
          warehouseMovement.materials &&
          warehouseMovement.materials.length > 0
            ? warehouseMovement.materials[0].manufacturerReference
            : intl.formatMessage({
                id: "stock.pda.work-order-detail.scanned-location",
              })
        }
        visible={showReferenceStockPannel}
      >
        <DataDefault
          className="mb-16"
          title={intl.formatMessage({
            id: "stock.pda.work-order-detail.location",
          })}
          subtitle={
            inventoryMaterialExec.scannedLocation
              ? inventoryMaterialExec.scannedLocation.locationName
              : null
          }
        />
        {/* <DataDefault
          className="mb-16"
          title={intl.formatMessage({ id: "stock.pda.work-order-detail.units-to-inventary" })}
          subtitle={locationFull ? locationFull.stock : null}
        /> */}
        <NumberField
          className="mb-16"
          label={intl.formatMessage({
            id: "stock.pda.work-order-detail.units-inventary",
          })}
          value={
            inventoryMaterialExec.currentStock
              ? inventoryMaterialExec.currentStock
              : 0
          }
          onChange={(val) => inventoryMaterialUpdateLocStock(val)}
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
          id: "stock.pda.work-order.inventary-reference.finalize.title",
        })}
        content={intl.formatMessage({
          id: "stock.pda.work-order.inventary-reference.finalize.content",
        })}
        visible={showFinalizePannel}
        onClose={() => {
          setShowFinalizePannel(false);
          setContinueAfterEnd(true);
        }}
        onFinalize={() => handleFinalize()}
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
          inventoryReferenceScanLoc(
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
        <Row>
          <Col w={6}>
            <DataDefault
              className="mb-16"
              title={intl.formatMessage({
                id: "stock.pda.work-order.inventary.order-num",
              })}
              subtitle={
                warehouseMovement ? warehouseMovement.warehouseMovementId : null
              }
            />
          </Col>
          <Col w={6}>
            <DataDefault
              className="mb-16"
              title={intl.formatMessage({
                id: "stock.pda.work-order-detail.material.manufacturerRef",
              })}
              subtitle={
                warehouseMovement &&
                warehouseMovement.materials &&
                warehouseMovement.materials.length > 0
                  ? warehouseMovement.materials[0].manufacturerReference
                  : null
              }
            />
          </Col>
        </Row>
        <DataDefault
          className="mb-16 mt-0"
          title={intl.formatMessage({
            id: "stock.pda.work-order-detail.material",
          })}
          subtitle={
            warehouseMovement &&
            warehouseMovement.materials &&
            warehouseMovement.materials.length > 0
              ? warehouseMovement.materials[0].materialName.name
              : null
          }
        />
        <Salient
          className="mb-16"
          title={intl.formatMessage({
            id:
              "stock.pda.work-order-detail.inventary.locations-and-units-pending",
          })}
          number={materialLocationsFiltered.length}
          icon="sga-icon-info-circle"
          onActionClicked={() => setShowReferences(true)}
          disabledNumber
        />
        <Salient
          className="mb-16"
          title={intl.formatMessage({
            id: "stock.pda.work-order-detail.inventary.locations-and-units",
          })}
          number={warehouseMovementLocations.list.length}
          icon="sga-icon-info-circle"
          onActionClicked={() => setShowFinalizedReferences(true)}
          disabledNumber
        />
      </div>

      {renderReferenceLocations()}
      {renderFinalizedReferences()}
      {renderReferenceStockPanel()}
      {renderFinalizePannel()}
    </PageMobile>
  );
}

export default injectWarehouse(connectPda(InventaryReferencesExec));
