import React, { useEffect } from "react";
import { intl } from "amiga-core/components/i18n";

import { DataDefault } from "lib-frontsga";
import { ButtonSquare } from "lib-frontsga";

import connectPda from "../../../../connectors/connectPda";
import injectWarehouse from "application/connectors/injectWarehouse";

import "./styles.css";

function AvailableLocations(props) {
  const {
    centerSelected,
    materialId,
    availableLocations,
    fetchAvailableLoc,
    onSelect,
    fetchNextAvailableLoc,
    disabled,
    excludeLocations,
  } = props;

  useEffect(() => {
    const canFetch = availableLocations.location === null && availableLocations.hasMore && !availableLocations.fetching;

    const isExcludedLocation =
      availableLocations.location !== null &&
      !availableLocations.fetching &&
      excludeLocations &&
      excludeLocations.length > 0 &&
      excludeLocations.some((locationId) => locationId === availableLocations.location.locationId);

    if (materialId && centerSelected && (canFetch || isExcludedLocation)) {
      fetchAvailableLoc(centerSelected.centerId, materialId, {
        offset: availableLocations.offset,
        limit: availableLocations.limit,
      });
    }
  }, [centerSelected, availableLocations, disabled]);

  return (
    <div className="available-locations  mb-16 ">
      <DataDefault
        title={intl.formatMessage({ id: "stock.pda.available-locations.title" })}
        subtitle={availableLocations.location ? availableLocations.location.locationName : "-"}
      />
      {/* <ButtonSquare
        className="btn-select"
        icon="sga-icon-check-circle"
        onClick={() => onSelect(availableLocations.location)}
        disabled={disabled || !availableLocations.location}
      /> */}
      <ButtonSquare
        className="btn-next"
        icon="sga-icon-arrow-circle-right"
        onClick={() => fetchNextAvailableLoc()}
        disabled={disabled || !availableLocations.hasMore}
      />
    </div>
  );
}

AvailableLocations.defaulProps = {
  disabled: false,
  excludeLocations: [],
};

export default injectWarehouse(connectPda(AvailableLocations));
