import React from "react";
import { T, intl } from "amiga-core/components/i18n";
import Col from "amiga-core/components/layout/col";
import Row from "amiga-core/components/layout/row";
import { moment } from "amiga-core/application/i18n/moment";

import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";

import { dateFormat, dateFormatEN } from "@/generalConfig";

function Location(props) {
  const {
    purchaseOrderId,
    locations,
    materials,
    creationDate,
    creationUser,
    assignedUser,
    closeDate,
    setShowReferences,
  } = props;

  return (
    <>
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.purchaseOrderId" })}
        subtitle={purchaseOrderId}
      />
      <Salient
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.inventary.references-and-units" })}
        number={materials.length}
        icon="sga-icon-info-circle"
        onActionClicked={() => setShowReferences(true)}
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

Location.defaultProps = {
  locations: [],
  materials: [],
};

export default Location;
