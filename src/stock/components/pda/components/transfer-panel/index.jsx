import React from "react";
import { T, intl } from "amiga-core/components/i18n";
import { Col, Row } from "amiga-core/components/layout/";

import { Button } from "lib-frontsga";

import MobileSidePanel from "shared/components/mobile-slide-panel/";

function TransferPannel(props) {
  const { visible, onClose, onExecute, onAssign } = props;

  return (
    <MobileSidePanel
      title={intl.formatMessage({ id: "stock.pda.transfer-material.transfer-panel.title" })}
      visible={visible}
      onClose={onClose}
      showArrowClose={false}
      className="mobile-slide-pannel_transfer-material"
    >
      <Row>
        <Col className="align-center">
          <T id="stock.pda.transfer-material.transfer-panel.execute" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            kind="primary"
            icon=""
            className="btn align-center"
            disabled={!onExecute}
            onClick={() => (onExecute ? onExecute() : null)}
            label={intl.formatMessage({ id: "stock.pda.transfer-material.transfer-panel.yes-execute" })}
          />

          <Button
            kind="secondary"
            icon=""
            className="btn align-center"
            onClick={() => (onAssign ? onAssign() : null)}
            label={intl.formatMessage({ id: "stock.pda.transfer-material.transfer-panel.no-assign" })}
          />
          <Button
            kind="tertiary"
            className="btn align-center"
            onClick={() => onClose()}
            label={intl.formatMessage({ id: "stock.pda.transfer-material.transfer-panel.cancel" })}
          />
        </Col>
      </Row>
    </MobileSidePanel>
  );
}

export default TransferPannel;
