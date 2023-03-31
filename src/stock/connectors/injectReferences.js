import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/references";
import * as getters from "stock/getters/references";

const injectReferences = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      references: getters.getReferences(state),
      referencesFetching: getters.getReferencesFetching(state),
      materialRefresh: getters.getReferencesRefresh(state),
      forceUpdate: getters.getForceUpdate(state),
      filters: getters.getFilters(state),
      itemsTotal: getters.getItemsTotal(state),
      view: getters.getView(state),
      selectedReferences: getters.getSelectedRefs(state),
      materialClassifications: getters.getMaterialClassifications(state),
      materialClassificationsFetching: getters.getMaterialClassificationsFetching(state),
      referenceDetail: getters.getCurrentReference(state),
      referenceDetailFetching: getters.getCurrentReferenceFetching(state),
      editMode: getters.getEditMode(state),
      lastMovements: getters.getLastMovements(state),
      materialElements: getters.getMaterialElements(state),
      materialLocations: getters.getMaterialLocations(state),
      materialUsages: getters.getMaterialUsages(state),
      materialDates: getters.getMaterialDates(state),
      availableLocations: getters.getAvailableLocations(state)
    }),
    (dispatch) => ({
      fetchReferences: (centerId, filters, append) => dispatch(actions.fetchReferences(centerId, filters, append)),
      setViewReferences: (viewId) => dispatch(actions.setView(viewId)),
      setSelectedReferences: (refList) => dispatch(actions.setSelected(refList)),
      removeReferences: (centerId, materialId) => dispatch(actions.removeReferences(centerId, materialId)),
      // fetchMaterialManufacturers: (centerId, filters) =>
      //   dispatch(actions.fetchMaterialManufacturers(centerId, filters)),
      fetchMaterialClassification: () => dispatch(actions.fetchMaterialClassification()),
      // fetchStockStatus: () => dispatch(actions.fetchStockStatus()),
      //detail
      getReferenceDetail: (centerId, materialId) => dispatch(actions.getReferenceDetail(centerId, materialId)),
      setEditMode: (value) => dispatch(actions.setEditMode(value)),
      createReference: (centerId, manufacturerRef) => dispatch(actions.createReference(centerId, manufacturerRef)),
      saveReference: (centerId, values, data) => dispatch(actions.saveReference(centerId, values, data)),
      getMaterialPurchase: (centerId, locationId, materialId) =>
        dispatch(actions.getMaterialPurchase(centerId, locationId, materialId)),
      fetchMaterialMovements: (centerId, materialId, limit, offset) =>
        dispatch(actions.fetchMaterialMovements(centerId, materialId, limit, offset)),
      fetchMaterialElements: (centerId, materialId, limit, offset) =>
        dispatch(actions.fetchMaterialElements(centerId, materialId, limit, offset)),
      fetchMaterialLocations: (centerId, materialId, limit, offset) =>
        dispatch(actions.fetchMaterialLocations(centerId, materialId, limit, offset)),
      fetchMaterialUsages: (centerId, materialId, limit, offset) =>
        dispatch(actions.fetchMaterialUsages(centerId, materialId, limit, offset)),
      fetchMaterialDates: (centerId, materialId) => dispatch(actions.fetchMaterialDates(centerId, materialId)),
      inventoryMaterials: (centerId, materialIds) => dispatch(actions.inventoryMaterials(centerId, materialIds)),
      getMaterialByBarcode: (centerId, barcode) => dispatch(actions.getMaterialByBarcode(centerId, barcode)),
      getLocationsAvailable: (centerId, materialId, filters) =>
        dispatch(actions.getLocationsAvailable(centerId, materialId, filters)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withReferences"))(Wrapper);
};

export default injectReferences;
