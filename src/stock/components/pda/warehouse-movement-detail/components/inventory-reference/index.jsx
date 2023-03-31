import React from "react";
import { T, intl } from "amiga-core/components/i18n";
import Col from "amiga-core/components/layout/col";
import Row from "amiga-core/components/layout/row";
import { moment } from "amiga-core/application/i18n/moment";

import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";

import { dateFormat, dateFormatEN } from "@/generalConfig";

function InventoryReference({
  locations,
  materials,
  creationDate,
  creationUser,
  assignedUser,
  closeDate,
  setShowLocations,
  warehouseMovementLocations,
}) {
  return (
    <>
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.material" })}
        subtitle={materials && materials.length > 0 ? materials[0].manufacturerReference : null}
      />
      <Salient
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.inventary.locations-and-units" })}
        number={warehouseMovementLocations.list.length}
        icon="sga-icon-info-circle"
        onActionClicked={() => setShowLocations(true)}
        disabledIcon={warehouseMovementLocations.list.length === 0}
        disabledNumber
      />
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.creation-date" })}
        subtitle={moment(creationDate).format(intl.locale === "es" ? dateFormat : dateFormatEN)}
      />
      <Row>
        <Col>
          <DataDefault
            title={intl.formatMessage({ id: "stock.pda.work-order-detail.creation-user" })}
            subtitle={creationUser || "-"}
          />
        </Col>
        <Col>
          <DataDefault
            title={intl.formatMessage({ id: "stock.pda.work-order-detail.asigned-user" })}
            subtitle={assignedUser || "-"}
          />
        </Col>
      </Row>
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.closed-date" })}
        subtitle={closeDate ? moment(closeDate).format(intl.locale === "es" ? dateFormat : dateFormatEN) : "-"}
      />
    </>
  );
}

InventoryReference.defaultProps = {
  locations: [],
  materials: [],
};

export default InventoryReference;
