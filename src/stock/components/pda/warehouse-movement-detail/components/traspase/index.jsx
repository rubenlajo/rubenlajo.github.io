import React from "react";
import { T, intl } from "amiga-core/components/i18n";
import Col from "amiga-core/components/layout/col";
import Row from "amiga-core/components/layout/row";
import { moment } from "amiga-core/application/i18n/moment";

import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";

import { transferTypes } from "../../../CONSTANTS";
import { dateFormat, dateFormatEN } from "@/generalConfig";

function Traspase({
  warehouseMovementId,
  locations,
  materials,
  creationDate,
  creationUser,
  assignedUser,
  closeDate,
  setShowReferences,
  setShowLocations,
  transferType,
}) {
  return (
    <>
      {transferType === transferTypes.LOCATION ? (
        <>
          <DataDefault
            title={intl.formatMessage({ id: "stock.pda.work-order-detail.location" })}
            subtitle={locations && locations.length > 0 ? locations[0].locationName : null}
          />
          <Salient
            title={intl.formatMessage({ id: "stock.pda.work-order-detail.traspase.references-and-units" })}
            number={materials.length}
            icon="sga-icon-info-circle"
            onActionClicked={() => setShowReferences(true)}
            disabledNumber
          />
        </>
      ) : null}

      {transferType === transferTypes.MATERIAL ? (
        <>
          <DataDefault
            title={intl.formatMessage({ id: "stock.pda.work-order-detail.material" })}
            subtitle={materials && materials.length > 0 ? materials[0].materialId : null}
          />
          <Salient
            title={intl.formatMessage({ id: "stock.pda.work-order-detail.traspase.locations-and-units" })}
            number={locations.length}
            icon="sga-icon-info-circle"
            onActionClicked={() => setShowLocations(true)}
            disabledNumber
          />
        </>
      ) : null}

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

Traspase.defaultProps = {
  locations: [],
  materials: [],
};

export default Traspase;
