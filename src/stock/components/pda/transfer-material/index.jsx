import React, { useState, useEffect } from "react";

import { T, intl } from "amiga-core/components/i18n";
import { history } from "amiga-core/components/router";
import { injectUser } from "amiga-core/components/auth";

import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";
import { Button } from "lib-frontsga";
import PageMobile from "shared/components/page-mobile/";

import injectWarehouse from "application/connectors/injectWarehouse";
import injectReferences from "stock/connectors/injectReferences";
import connectPda from "stock/connectors/connectPda";

import AssignPannel from "../components/assign-pannel";
import TransferPannel from "../components/transfer-panel";
import EditUnitsPannel from "./components/edit-units-pannel";

import "./styles.css";

function TransferMaterial(props) {
  const {
    fetchCenters,
    centers,
    match,
    centerSelected,
    material,
    fetchMaterialById,
    fetchMaterialLocations,
    createWhMTransferRefSetUnits,
    locationEditing,
    setLocationEditing,
    createWhMTransferRefConfirmUnits,
    createWhMTransferRemoveLocation,
    createWhMTransferReference,
    warehouseMovementsCreated,
    assignWarehouseMovement,
    addNotification,
    user,
    redirectToExec,
    clearCreatedWarehouseMovement,
  } = props;

  const [showEditUnits, setShowEditUnits] = useState(false);
  const [showTraspaseOptions, setShowTraspaseOptions] = useState(false);
  const [showAssignPannel, setShowAssignPannel] = useState(false);

  useEffect(() => {
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
    if (material && material.hasMore && !material.locationsFetching) {
      fetchMaterialLocations(centerSelected.centerId, material.materialId, {
        offset: 0,
        limit: 100,
      });
    }
  }, [material]);

  useEffect(() => {
    if (material && material.locations.length > 0 && material.hasMore && !material.locationsFetching) {
      fetchMaterialLocations(centerSelected.centerId, material.materialId, {
        offset: material.filters.offset + material.filters.limit,
        limit: material.filters.limit,
      });
    }
  }, [material]);
  /* end fetch material locations */

  useEffect(() => {
    if (warehouseMovementsCreated !== null) {
      setShowTraspaseOptions(true);
    }
  }, [warehouseMovementsCreated]);

  useEffect(() => {
    if (redirectToExec && warehouseMovementsCreated !== null) {
      const warehouseMovement = warehouseMovementsCreated[0];
      history.push(`/stock/pda/warehouse-movements-exec-traspase/${warehouseMovement.warehouseMovementId}`);
    }
  }, [redirectToExec]);

  if (!material) {
    return null;
  }

  const onBack = () => history.push(`/stock/pda/materials/${match.params.materialId}`);

  const handleAssignAndExec = () => {
    const warehouseMovement = warehouseMovementsCreated[0];
    assignWarehouseMovement(
      centerSelected.centerId,
      warehouseMovement.warehouseMovementId,
      user.login,
      intl.formatMessage({ id: "stock.routes.pda.transfer" }),
      true, //redirect to exec on assign ok
    );
  };

  const renderEditUnits = () => {
    if (!locationEditing) {
      return null;
    }

    return (
      <EditUnitsPannel
        visible={showEditUnits}
        onClose={() => {
          setShowEditUnits(false);
          setTimeout(() => setLocationEditing(null), 50);
        }}
        locationEditing={locationEditing}
        onChangeUnitsConfirm={(unitsToTraspase) => {
          setShowEditUnits(false);
          createWhMTransferRefSetUnits(unitsToTraspase);
          setTimeout(() => {
            createWhMTransferRefConfirmUnits(unitsToTraspase);
          }, 50);
        }}
        onRemoveLocation={() => {
          setShowEditUnits(false);
          setTimeout(() => createWhMTransferRemoveLocation(locationEditing.locationId), 50);
        }}
        disableRemove={material.locations.length < 2}
      />
    );
  };

  const renderTraspaseOptionsPannel = () => (
    <TransferPannel
      visible={showTraspaseOptions}
      onClose={() => {
        const warehouseMovement = warehouseMovementsCreated[0];
        setShowTraspaseOptions(false);
        if (warehouseMovementsCreated && warehouseMovementsCreated.length === 1) {
          addNotification({
            type: "success",
            fadeout: true,
            content: intl
              .formatMessage({ id: "stock.reactions.pda.transfer-material.created" })
              .replace("XwarehouseMovementIdX", warehouseMovement.warehouseMovementId),
          });
          clearCreatedWarehouseMovement();
          onBack();
        }
      }}
      onExecute={handleAssignAndExec}
      onAssign={() => {
        setShowTraspaseOptions(false);
        setShowAssignPannel(true);
      }}
    />
  );

  const handleAssignTechnician = (technician) => {
    if (warehouseMovementsCreated && warehouseMovementsCreated.length === 1) {
      assignWarehouseMovement(
        centerSelected.centerId,
        warehouseMovementsCreated[0].warehouseMovementId,
        technician,
        intl.formatMessage({ id: "stock.routes.pda.transfer" }),
      );
    }
    setShowAssignPannel(false);
    setShowTraspaseOptions(false);
    onBack();
  };

  const renderAssignPannel = () => (
    <AssignPannel
      visible={showAssignPannel}
      close={() => setShowAssignPannel(false)}
      onSelect={handleAssignTechnician}
    />
  );

  const renderMaterialLocations = () => {
    if (material.locations.length === 0) {
      return (
        <div className="flex halign-center valign-center h100">
          <T id="stock.pda.transfer-material.no-locations" />
        </div>
      );
    } else {
      return material.locations.map((location) => (
        <Salient
          key={location.locationId}
          title={location ? location.locationCode : "-"}
          subtitle={intl.formatMessage({ id: "stock.pda.transfer-material.units-to-transfer-in" })}
          number={location.unitsToTraspase || "00"}
          icon="sga-icon-pen-alt"
          onActionClicked={() => {
            setLocationEditing(location);
            setTimeout(() => setShowEditUnits(true), 50);
          }}
          disabledIcon={!location.stock || location.stock === 0}
        />
      ));
    }
  };

  return (
    <PageMobile
      className="transfer-material-page-mobile"
      breadcrumb={intl.formatMessage({ id: "stock.pda.transfer-material.page.title" })}
      onBack={() => onBack()}
      contentScroll={false}
      resourceName="warehouseMovmementExecTransferPage"
    >
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.reference-detail.reference" })}
        subtitle={material.general.manufacturerReference}
      />
      <div className="locations-list">{renderMaterialLocations()}</div>
      <Button
        kind="primary"
        size="size-s"
        onClick={() => createWhMTransferReference(centerSelected.centerId, material.materialId, material.locations)}
        disabled={material.locations.length === 0}
        label={intl.formatMessage({ id: "stock.pda.transfer-material.page.title" })}
      />
      {renderEditUnits()}
      {renderTraspaseOptionsPannel()}
      {renderAssignPannel()}
    </PageMobile>
  );
}

export default injectUser(injectWarehouse(injectReferences(connectPda(TransferMaterial))));
