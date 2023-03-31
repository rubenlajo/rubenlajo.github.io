import React, { useState, useEffect } from "react";

import { T, intl } from "amiga-core/components/i18n";
import { history } from "amiga-core/components/router";
import { injectUser } from "amiga-core/components/auth";

import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";
import { Button } from "lib-frontsga";
import PageMobile from "shared/components/page-mobile/";

import injectWarehouse from "application/connectors/injectWarehouse";
import connectPda from "stock/connectors/connectPda";

import EditUnitsPannel from "./components/edit-units-pannel/";
import AssignPannel from "../components/assign-pannel";
import TransferPannel from "../components/transfer-panel";

import "./styles.css";

function TransferLocation(props) {
  const {
    centerSelected,
    match,
    location,
    fetchLocationById,
    locationMaterials,
    fetchLocationMaterials,
    setMaterialEditing,
    materialEditing,
    createWhTransferLocationConfirmUnits,
    createWhMTransferRemoveReference,
    createWhMTransferLocation,
    warehouseMovementsCreated,
    assignWarehouseMovement,
    user,
    addNotification,
    redirectToExec,
    clearCreatedWarehouseMovement,
  } = props;

  const [showEditUnits, setShowEditUnits] = useState(false);
  const [showTraspaseOptions, setShowTraspaseOptions] = useState(false);
  const [showAssignPannel, setShowAssignPannel] = useState(false);

  useEffect(() => {
    if (centerSelected) {
      fetchLocationById(centerSelected.centerId, match.params.locationId);
    }
  }, [centerSelected]);

  useEffect(() => {
    if (location && centerSelected && locationMaterials.haveMore && !locationMaterials.fetching) {
      fetchLocationMaterials(
        centerSelected.centerId,
        location.locationId,
        {
          offset: locationMaterials.offset,
          limit: locationMaterials.limit,
        },
        true, //append instead of replace
      );
    }
  }, [location, locationMaterials]);

  const onBack = () => history.push(`/stock/pda/locations/${match.params.locationId}`);

  useEffect(() => {
    if (warehouseMovementsCreated !== null) {
      setShowTraspaseOptions(true);
    }
  }, [warehouseMovementsCreated]);

  useEffect(() => {
    if (redirectToExec && warehouseMovementsCreated !== null) {
      const warehouseMovement = warehouseMovementsCreated[0];
      history.push(`/stock/pda/warehouse-movements-exec-traspase/${warehouseMovement.warehouseMovementId}`);
      setShowTraspaseOptions(false);
    }
  }, [redirectToExec]);

  const handleAssignAndExec = () => {
    const warehouseMovement = warehouseMovementsCreated[0];
    assignWarehouseMovement(
      centerSelected.centerId,
      warehouseMovement.warehouseMovementId,
      user.login,
      intl.formatMessage({ id: "stock.routes.pda.transfer" }),
      true,
    );
  };

  const renderEditUnits = () => {
    if (!materialEditing) {
      return null;
    }

    return (
      <EditUnitsPannel
        visible={showEditUnits}
        onClose={() => {
          setShowEditUnits(false);
          setTimeout(() => setMaterialEditing(null), 50);
        }}
        materialEditing={materialEditing}
        onChangeUnitsConfirm={(unitsToTraspase) => {
          setShowEditUnits(false);
          setTimeout(() => {
            createWhTransferLocationConfirmUnits(unitsToTraspase);
          }, 50);
        }}
        onRemoveLocation={() => {
          setShowEditUnits(false);
          setTimeout(() => createWhMTransferRemoveReference(materialEditing.materialId), 50);
        }}
        disableRemove={locationMaterials.list.length < 2}
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
              .formatMessage({ id: "stock.reactions.pda.transfer-location.created" })
              .replace("XwarehouseMovementIdX", warehouseMovement.warehouseMovementId),
          });
        }
        clearCreatedWarehouseMovement();
        onBack();
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

  const renderMaterials = () => {
    if (locationMaterials.list.length === 0) {
      return (
        <div className="flex halign-center valign-center h100">
          <T id="stock.pda.transfer-location.no-references" />
        </div>
      );
    } else {
      return locationMaterials.list.map((material) => {
        return (
          <Salient
            key={material.materialId}
            title={material ? material.manufacturerReference : "-"}
            subtitle={intl.formatMessage({ id: "stock.pda.transfer-material.units-to-transfer-in" })}
            number={material.unitsToTraspase || "00"}
            icon="sga-icon-pen-alt"
            onActionClicked={() => {
              setMaterialEditing(material);
              setTimeout(() => setShowEditUnits(true), 50);
            }}
            disabledIcon={!material.locationStock || material.locationStock === 0}
          />
        );
      });
    }
  };

  return (
    <PageMobile
      className="transfer-location-page-mobile"
      breadcrumb={intl.formatMessage({ id: "stock.pda.transfer-location.page.title" })}
      onBack={() => onBack()}
      contentScroll={false}
      onPageActionsClose={() => {}}
      resourceName="warehouseMovmementExecTransferPage"
    >
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.transfer-location.location" })}
        subtitle={(location && location.locationName) || "-"}
      />
      <div className="materials-list">{renderMaterials()}</div>
      <Button
        className="w100"
        kind="primary"
        size="size-s"
        disabled={locationMaterials.list.length === 0}
        onClick={() => createWhMTransferLocation(centerSelected.centerId, location.locationId, locationMaterials.list)}
        label={intl.formatMessage({ id: "stock.pda.transfer-material.page.title" })}
      />
      {renderEditUnits()}
      {renderTraspaseOptionsPannel()}
      {renderAssignPannel()}
    </PageMobile>
  );
}

export default injectUser(injectWarehouse(connectPda(TransferLocation)));
