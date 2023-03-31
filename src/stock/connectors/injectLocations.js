import wrapDisplayName from "recompose/wrapDisplayName";
import setDisplayName from "recompose/setDisplayName";
import connect from "amiga-core/application/connect";
import * as actions from "stock/actions/locations";
import * as getters from "stock/getters/locations";

const injectReferences = (WrappedComponent) => {
  const Wrapper = connect(
    (state) => ({
      //Location table
      locations: getters.getLocations(state),
      totalLocations: getters.getTotalItems(state),
      view: getters.getView(state),
      selected: getters.getSelectedLocations(state),
      behaviourTypes: getters.getLocationBehaviourTypes(state),
      locationsFetching: getters.getLocationsFetching(state),
      locationsRefresh: getters.getLocationsRefresh(state),
      //Location detail
      locationDetail: getters.getCurrentLocation(state),
      locationPattern: getters.getLocationPattern(state),
      editMode: getters.getEditMode(state),
      locationMaterials: getters.getLocationMaterials(state),
      sparePartWarehouses: getters.getSparePartsWarehouses(state),
      locationCreated: getters.getLocationCreated(state),
      locationLastInventoryStatus: getters.getLocationLastInventoryStatus(state),
      locationLastMovements: getters.getLocationLastMovements(state),
    }),
    (dispatch) => ({
      // Location table
      fetchLocations: (centerId, filters) => dispatch(actions.fetchLocations(centerId, filters)),
      setView: (viewId) => dispatch(actions.setView(viewId)),
      setSelected: (refList) => dispatch(actions.setSelected(refList)),
      removeLocations: (centerId, locationsList) => dispatch(actions.removeLocations(centerId, locationsList)),
      fetchLocationBehaviourTypes: (centerId) => dispatch(actions.fetchLocationBehaviourTypes(centerId)),
      //Location detail
      getLocationDetail: (centerId, locationId) => dispatch(actions.getLocationDetail(centerId, locationId)),
      fetchLocationsPatterns: (centerId) => dispatch(actions.fetchLocationsPatterns(centerId)),
      createLocation: (centerId, data, locationName) => dispatch(actions.createLocation(centerId, data, locationName)),
      saveLocation: (centerId, locationId, values, saveLocation) =>
        dispatch(actions.saveLocation(centerId, locationId, values, saveLocation)),
      setEditMode: (value) => dispatch(actions.setEditMode(value)),
      fetchLocationMaterials: (centerId, locationId, filters, append) =>
        dispatch(actions.fetchLocationMaterials(centerId, locationId, filters, append)),
      fetchSparePartsWarehouses: (centerId) => dispatch(actions.fetchSparePartsWarehouses(centerId)),
      fetchLocationLastInventoryStatus: () => dispatch(actions.fetchLocationLastInventoryStatus()),
      inventoryLocations: (centerId, locationsList) => dispatch(actions.inventoryLocations(centerId, locationsList)),
      fetchLastMovements: (centerId, filters) => dispatch(actions.fetchLastMovements(centerId, filters)),
    }),
  )(WrappedComponent);

  return setDisplayName(wrapDisplayName(WrappedComponent, "withReferences"))(Wrapper);
};

export default injectReferences;
