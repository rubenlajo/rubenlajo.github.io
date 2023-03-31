import React from "react";
import { T, intl } from "amiga-core/components/i18n";

import { SalientDual } from "lib-frontsga";

import MobileSidePanel from "shared/components/mobile-slide-panel/";

import { transferTypes } from "../../../../CONSTANTS";

function MovementsPannel(props) {
  const {
    transferType,
    warehouseMovementReferences,
    warehouseMovementLocations,
    showMovements,
    setShowMovements,
  } = props;

  const movements = [];

  if (transferType === transferTypes.LOCATION) {
    warehouseMovementReferences.list &&
      warehouseMovementReferences.list.forEach((movement) => {
        movements.push(
          <SalientDual
            key={movement.material.materialId}
            className="order-detail_references-list-item"
            items={[
              {
                title: `${Math.abs(movement.sourceLocation.unitsToTransfer)} ${intl.formatMessage({
                  id: "stock.pda.work-order-transfer-exec.units",
                })}`,
                subtitle: movement.material.materialName.name,
              },
              {
                title: intl.formatMessage({ id: "stock.pda.work-order-detail.destination" }),
                subtitle: movement.targetLocations
                  ? movement.targetLocations.length > 1
                    ? intl.formatMessage({ id: "stock.pda.work-order-detail.multiple" })
                    : movement.targetLocations[0].location.locationName
                  : "-",
              },
            ]}
          />,
        );
      });
  }

  if (transferType === transferTypes.MATERIAL) {
    warehouseMovementLocations.list &&
      warehouseMovementLocations.list.forEach((movement) => {
        movements.push(
          <SalientDual
            key={movement.sourceLocation.location.locationId}
            className="order-detail_references-list-item"
            items={[
              {
                title: `${Math.abs(movement.sourceLocation.unitsToTransfer)} ${intl.formatMessage({
                  id: "stock.pda.work-order-transfer-exec.units",
                })}`,
                subtitle: movement.sourceLocation.location.locationName,
              },
              {
                title: intl.formatMessage({ id: "stock.pda.work-order-detail.destination" }),
                subtitle: movement.targetLocations
                  ? movement.targetLocations.length > 1
                    ? intl.formatMessage({ id: "stock.pda.work-order-detail.multiple" })
                    : movement.targetLocations[0].location.locationName
                  : "-",
              },
            ]}
          />,
        );
      });
  }

  const title =
    transferType === transferTypes.LOCATION
      ? intl.formatMessage({ id: "stock.pda.work-order-transfer-exec.materials-to-traspase" })
      : intl.formatMessage({ id: "stock.pda.work-order-transfer-exec.locations-to-traspase" });

  return (
    <MobileSidePanel title={title} visible={showMovements} onClose={() => setShowMovements(false)}>
      {movements}
    </MobileSidePanel>
  );
}

export default MovementsPannel;
