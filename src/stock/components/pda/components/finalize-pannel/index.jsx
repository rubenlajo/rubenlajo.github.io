import React from "react";
import { T, intl } from "amiga-core/components/i18n";

import { Button } from "lib-frontsga";

import MobileSidePanel from "shared/components/mobile-slide-panel/";

import "./styles.css";

function FinalizePannel(props) {
  const { title, content, visible, onClose, onFinalize } = props;

  return (
    <MobileSidePanel
      className="finalize-pannel"
      title={title}
      visible={visible}
      onClose={() => onClose()}
      showArrowClose={false}
    >
      <div className="mb-16">{content}</div>
      <Button
        kind="primary"
        className="mb-16"
        onClick={onFinalize}
        label={intl.formatMessage({ id: "stock.pda.work-order-transfer-exec.finalize-pannel.btn-finalize" })}
      />

      <Button
        kind="secondary"
        className="mb-16"
        onClick={() => onClose()}
        label={intl.formatMessage({ id: "stock.pda.work-order-transfer-exec.finalize-pannel.btn-cancel" })}
      />
    </MobileSidePanel>
  );
}

export default FinalizePannel;
