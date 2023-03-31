import React, { useState, useEffect } from "react";

import { T, intl } from "amiga-core/components/i18n";
import { history } from "amiga-core/components/router";

import { DataDefault } from "lib-frontsga";
import { Salient } from "lib-frontsga";
import { Button, ButtonGroup } from "lib-frontsga";
import { NumberField } from "lib-frontsga";

import PageMobile from "shared/components/page-mobile/";
import MobileSidePanel from "shared/components/mobile-slide-panel/";

import injectWarehouse from "application/connectors/injectWarehouse";
import injectReferences from "stock/connectors/injectReferences";
import connectPda from "stock/connectors/connectPda";

import AvailableLocations from "../../components/available-locations/";

import { debounce } from "@/utils/";

import "./styles.css";

function FreeEntry(props) {
  const {
    match,
    centerSelected,
    fetchCenters,
    material,
    fetchMaterialById,
    fetchMaterialLocations,
    freeEntry,
    scanLocationFreeEntry,
    confirmScannedLocation,
    createWhMFreeEntry,
    warehouseMovementsCreated,
  } = props;

  const menus = {
    PRINT: {
      key: "printMenu",
      title: intl.formatMessage({
        id: "stock.pda.reference-detail-menu.print-menu.print",
      }),
      cancelLabel: intl.formatMessage({
        id: "stock.pda.location-detail.menu.cancel",
      }),
    },
  };

  const [pageMenu, setPageMenu] = useState(menus.PRINT);
  const [showLocations, setShowLocations] = useState(false);
  const [numTags, setNumTags] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [showConfirmScannedPanel, setShowConfirmScannedPannel] = useState(
    false
  );
  const [showUnitsPanel, setShowUnitsPanel] = useState(false);
  const [unitsToTraspase, setUnitsToTraspase] = useState(0);

  useEffect(() => {
    if (!centerSelected) {
      fetchCenters();
    }
  }, []);

  useEffect(() => {
    if (centerSelected) {
      fetchMaterialById(centerSelected.centerId, match.params.materialId);
    }
  }, [centerSelected]);

  /**
   * Fetch material locations paginated
   */
  useEffect(() => {
    if (material && material.hasMore && !material.locationsFetching) {
      fetchMaterialLocations(centerSelected.centerId, material.materialId, {
        offset: 0,
        limit: 100,
      });
    }
  }, [material]);

  useEffect(() => {
    if (
      material &&
      material.locations &&
      material.locations.length > 0 &&
      material.hasMore &&
      !material.locationsFetching
    ) {
      fetchMaterialLocations(centerSelected.centerId, material.materialId, {
        offset: material.filters.offset + material.filters.limit,
        limit: material.filters.limit,
      });
    }
  }, [material]);
  /* end fetch material locations */

  /**
   * check the scanned location if already have material or not
   */
  useEffect(() => {
    if (freeEntry.scannedLocation) {
      if (
        material.locations.some(
          (location) =>
            location.locationId === freeEntry.scannedLocation.locationId
        )
      ) {
        setShowUnitsPanel(true);
      } else {
        setShowConfirmScannedPannel(true);
      }
    }
  }, [freeEntry]);

  useEffect(() => {
    if (warehouseMovementsCreated !== null) {
      history.push(`/stock/pda/materials/${match.params.materialId}`);
    }
  }, [warehouseMovementsCreated]);

  let menu = null;

  // switch (pageMenu.key) {
  //   case "printMenu":
  //   default:
  //     menu = [
  //       {
  //         type: "text",
  //         label: intl.formatMessage({ id: "stock.pda.reference-detail-menu.print-menu.title" }),
  //       },
  //       {
  //         type: "custom",
  //         component: (
  //           <>
  //             <NumberField
  //               label={intl.formatMessage({ id: "stock.pda.reference-detail-menu.print-menu.tags-number" })}
  //               value={numTags}
  //               onChange={(value) => setNumTags(value)}
  //               errors={numTags < 1 ? ["Cantidad incorrecta"] : []}
  //             />
  //             <Button
  //               kind="primary"
  //               disabled
  //               size="size-s"
  //               label={intl.formatMessage({ id: "stock.pda.reference-detail-menu.print-menu.print" })}
  //             />
  //           </>
  //         ),
  //       },
  //     ];
  //     break;
  // }

  if (!material) {
    return null;
  }

  const renderReferences = () => {
    return (
      <MobileSidePanel
        title={intl.formatMessage({
          id: "stock.pda.reference-detail.secondary-locations",
        })}
        visible={showLocations}
        onClose={() => setShowLocations(false)}
        onSearch={setSearchText}
        searchText={searchText}
      >
        {material.locations
          ? material.locations
              .filter((location) => {
                if (!searchText) {
                  return true;
                } else {
                  return location.locationCode
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
                }
              })
              .map((location) => (
                <DataDefault
                  key={location.locationCode}
                  className="material-detail_location-list-item"
                  title={`${location.stock} ${intl.formatMessage({
                    id: "stock.pda.reference-detail.units",
                  })}`}
                  subtitle={location.locationCode}
                />
              ))
          : null}
      </MobileSidePanel>
    );
  };

  const renderConfirmScanLocation = () => {
    return (
      <MobileSidePanel
        title={
          <span className="warning-title">
            <T id="stock.pda.warehouse-movement.free-entry.not-asigned-ref" />
          </span>
        }
        visible={showConfirmScannedPanel}
        className="location-not-asigned-pannel"
        showArrowClose={false}
      >
        <p>
          <T id="stock.pda.warehouse-movement.free-entry.not-asigned-msg" />
        </p>
        <ButtonGroup block orientation='column'>
        <Button
          kind="primary"
          onClick={() => {
            setTimeout(() => {
              setShowConfirmScannedPannel(false);
            }, 100);
            confirmScannedLocation();
            setShowUnitsPanel(true);
          }}
          label={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.continue",
          })}
        />
        <Button
          kind="secondary"
          onClick={() => setShowConfirmScannedPannel(false)}
          label={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.cancel",
          })}
        />
        </ButtonGroup>
      </MobileSidePanel>
    );
  };

  const renderUnitsPannel = () => {
    const unitsValid = unitsToTraspase > 0;
    return (
      <MobileSidePanel
        title={intl.formatMessage({
          id: "stock.pda.warehouse-movement.free-entry.sanned-location",
        })}
        visible={showUnitsPanel}
        showArrowClose={false}
      >
        <DataDefault
          title={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.location",
          })}
          subtitle={
            freeEntry.targetLocation
              ? freeEntry.targetLocation.locationName
              : "-"
          }
        />
        <NumberField
          key={JSON.stringify(freeEntry)}
          label={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.units-to-traspase",
          })}
          onChange={(uds) => setUnitsToTraspase(uds)}
          value={unitsToTraspase}
          errors={
            !unitsValid
              ? [
                  intl.formatMessage({
                    id:
                      "stock.pda.warehouse-movement.free-entry.incorrect-units",
                  }),
                ]
              : []
          }
        />
        <ButtonGroup block orientation='column'>
        <Button
          kind="primary"
          disabled={!unitsValid}
          onClick={() => {
            createWhMFreeEntry(
              centerSelected.centerId,
              material.materialId,
              freeEntry.targetLocation.locationId,
              unitsToTraspase
            );
            setShowUnitsPanel(false);
          }}
          label={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.continue",
          })}
        />
        <Button
          kind="secondary"
          onClick={() => {
            setShowUnitsPanel(false);
            setUnitsToTraspase(0);
          }}
          label={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.cancel",
          })}
        />
        </ButtonGroup>
      </MobileSidePanel>
    );
  };

  return (
    <PageMobile
      className="mobile-free-entry-page"
      breadcrumb={intl.formatMessage({
        id: "stock.pda.warehouse-movement.free-entry.page.title",
      })}
      onBack={() =>
        history.push(`/stock/pda/materials/${match.params.materialId}`)
      }
      pageActions={menu}
      pageActionsTitle={pageMenu.title}
      pageActionsCancelLabel={pageMenu.cancelLabel}
      onPageActionsClose={() => setPageMenu(menus.PRINT)}
      contentScroll={false}
      onScan={debounce((barcode) => {
        if (barcode) {
          scanLocationFreeEntry(centerSelected.centerId, barcode);
          setUnitsToTraspase(0);
        }
      }, 100)}
      resource="warehouseMovmementExecFreeEntryPage"
    >
      <div className="group-1">
        <DataDefault
          title={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.reference",
          })}
          subtitle={material.materialId}
        />
        <Salient
          title={
            material.local.location ? material.local.location.locationName : "-"
          }
          subtitle={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.locations",
          })}
          number={material.locations ? material.locations.length : "00"}
          icon="sga-icon-info-circle"
          onActionClicked={() => setShowLocations(true)}
          disabledIcon={
            !material.locations ||
            (material.locations && material.locations.length === 0)
          }
          disabledNumber
        />
        <AvailableLocations
          materialId={material.materialId}
          onSelect={(location) =>
            scanLocationFreeEntry(
              centerSelected.centerId,
              location.locationName
            )
          }
        />
        <DataDefault
          title={intl.formatMessage({
            id: "stock.pda.warehouse-movement.free-entry.location",
          })}
          subtitle={
            freeEntry.targetLocation
              ? freeEntry.targetLocation.locationName
              : "-"
          }
        />
      </div>
      {renderReferences()}
      {renderConfirmScanLocation()}
      {renderUnitsPannel()}
    </PageMobile>
  );
}

export default injectWarehouse(injectReferences(connectPda(FreeEntry)));
