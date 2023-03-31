import React, { useState } from "react";
import { T, intl } from "amiga-core/components/i18n";
import { Col, Row } from "amiga-core/components/layout/";

import { DataDefault } from "lib-frontsga";
import { Button } from "lib-frontsga";
import { NumberField } from "lib-frontsga";

import MobileSidePanel from "shared/components/mobile-slide-panel/";

function EditUnitsPannel(props) {
  const { visible, onClose, materialEditing, onChangeUnitsConfirm, onRemoveLocation, disableRemove } = props;

  const [unitsToTraspase, setUnitsToTraspase] = useState(materialEditing.unitsToTraspase);

  const unitsValid = materialEditing.locationStock >= unitsToTraspase && unitsToTraspase > 0;

  return (
    <MobileSidePanel
      title={intl.formatMessage({
        id: "stock.pda.transfer-material.transfer-units-modify",
      })}
      visible={visible}
      onClose={onClose}
      showArrowClose={false}
    >
      <Row>
        <Col>
          <DataDefault
            title={intl.formatMessage({
              id: "stock.pda.transfer-material.reference",
            })}
            subtitle={materialEditing.materialId}
          />
        </Col>
        <Col>
          <DataDefault
            title={intl.formatMessage({
              id: "stock.pda.transfer-material.total-units",
            })}
            subtitle={materialEditing.locationStock}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <NumberField
            label={intl.formatMessage({
              id: "stock.pda.transfer-material.units-to-transfer",
            })}
            value={unitsToTraspase}
            onChange={(units) => setUnitsToTraspase(units)}
            errors={
              !unitsValid
                ? [
                    intl.formatMessage({
                      id: "stock.pda.transfer.qty-not-valid",
                    }),
                  ]
                : []
            }
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            kind="primary"
            icon=""
            className="btn align-center"
            disabled={!unitsValid}
            onClick={() => onChangeUnitsConfirm(unitsToTraspase)}
            label={intl.formatMessage({
              id: "stock.pda.transfer-material.modify-units",
            })}
          />
          <Button
            kind="secondary"
            icon=""
            className="btn align-center"
            disabled={disableRemove}
            onClick={onRemoveLocation}
            label={intl.formatMessage({
              id: "stock.pda.transfer-material.remove-material",
            })}
          />
          <Button
            kind="tertiary"
            className="btn align-center"
            onClick={onClose}
            label={intl.formatMessage({
              id: "stock.pda.transfer-material.cancel",
            })}
          />
        </Col>
      </Row>
    </MobileSidePanel>
  );
}

export default EditUnitsPannel;
