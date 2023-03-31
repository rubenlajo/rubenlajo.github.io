import React from "react";
import { intl } from "amiga-core/components/i18n";
import { moment } from "amiga-core/application/i18n/moment";

import { DataDefault } from "lib-frontsga";

import { dateFormat, dateFormatEN } from "@/generalConfig";

function FreeEntry({ locations, materials, creationUser, closeDate }) {
  return (
    <>
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.material" })}
        subtitle={materials && materials.length > 0 ? materials[0].materialId : null}
      />
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.location" })}
        subtitle={locations && locations.length > 0 ? locations[0].locationName : null}
      />
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.creation-user" })}
        subtitle={creationUser || "-"}
      />
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.work-order-detail.closed-date" })}
        subtitle={closeDate ? moment(closeDate).format(intl.locale === "es" ? dateFormat : dateFormatEN) : "-"}
      />
    </>
  );
}

FreeEntry.defaultProps = {
  locations: [],
  materials: [],
};

export default FreeEntry;
