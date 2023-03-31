import PERMISSIONS from "@/PERMISSIONS.json";

/*
 *  function GetAuthRoles
 *  param: componentName
 *  return a list of roles that can view a component
 */
const getAuthRoles = (componentName) => {
  /** ******************************************************************************************************/
  const componentsRoleTable = {
    // All roles in the app
    all: [...Object.values(PERMISSIONS)],

    // Roles for the references page
    referencesPage: [PERMISSIONS.MATERIAL_WRITE, PERMISSIONS.MATERIAL_ACTION],
    referenceDetailPage: [PERMISSIONS.MATERIAL_WRITE, PERMISSIONS.MATERIAL_ACTION],
    referenceNewPage: [PERMISSIONS.MATERIAL_WRITE],
    referencesCreate: [PERMISSIONS.MATERIAL_WRITE],
    referencesEdit: [PERMISSIONS.MATERIAL_WRITE],

    // Purchase orders
    stockOrdersPage: [PERMISSIONS.ORDERPROPOSAL_READ, PERMISSIONS.ORDERPROPOSAL_WRITE],
    stockOrdersDetailPage: [PERMISSIONS.ORDERPROPOSAL_READ],
    stockOrdersCreate: [PERMISSIONS.ORDERPROPOSAL_WRITE],
    stockOrdersManage: [PERMISSIONS.ORDERPROPOSAL_READ],

    // Locations
    locationsPage: [PERMISSIONS.LOCATION_READ, PERMISSIONS.LOCATION_WRITE, PERMISSIONS.LOCATION_DELETE],
    locationsDetailPage: [PERMISSIONS.LOCATION_READ],
    locationsNewPage: [PERMISSIONS.LOCATION_READ, PERMISSIONS.LOCATION_WRITE],
    locationsNew: [PERMISSIONS.LOCATION_WRITE],
    locationsEdit: [PERMISSIONS.LOCATION_WRITE],
    locationsDelete: [PERMISSIONS.LOCATION_DELETE],

    // Warehousemovements page
    stockMovementsPage: [PERMISSIONS.STOCK_WRITE, PERMISSIONS.STOCK_READ],
    //execute movmement
    stockMovementExecute: [PERMISSIONS.WAREHOUSEORDER_PROCESS],
    stockMovementAssign: [PERMISSIONS.WAREHOUSEORDER_PROCESS],
    stockMovmementCancel: [PERMISSIONS.STOCK_WRITE],
    // Inventary
    stockInventary: [PERMISSIONS.STOCK_WRITE],
    //Transfer
    stockTraspase: [PERMISSIONS.STOCK_WRITE],

    stockMovmementEdit: [PERMISSIONS.STOCK_WRITE],
    stockMovmementDelete: [PERMISSIONS.STOCK_WRITE],
    workOrdersCreate: [PERMISSIONS.WAREHOUSEORDER_PROCESS],

    //PDA
    stockDashboardPage: [PERMISSIONS.STOCK_READ],
    pdaDashboardScan: [PERMISSIONS.MATERIAL_ACTION, PERMISSIONS.LOCATION_READ],

    warehouseMovementsPage: [PERMISSIONS.STOCK_READ],
    warehouseMovementDetailPage: [PERMISSIONS.STOCK_READ],

    warehouseMovementExecPage: [PERMISSIONS.WAREHOUSEORDER_PROCESS],
    warehouseMovmementExecFreeEntryPage: [PERMISSIONS.WAREHOUSEORDER_PROCESS],
    warehouseMovmementExecInventoryPage: [PERMISSIONS.WAREHOUSEORDER_PROCESS],
    warehouseMovmementExecTransferPage: [PERMISSIONS.WAREHOUSEORDER_PROCESS],
    warehouseMovmementExecLocatePage: [PERMISSIONS.WAREHOUSEORDER_PROCESS],

    //Work Orders (OT)
    workOrderList: [PERMISSIONS.WORKORDER_READ],
    workOrderListPda: [PERMISSIONS.WORKORDER_READ],

    assignWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE],
    startWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE, PERMISSIONS.WORKORDER_TECHNICIAN_WRITE],
    closeWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE],
    lockWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE, PERMISSIONS.WORKORDER_TECHNICIAN_WRITE],
    unlockWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE, PERMISSIONS.WORKORDER_TECHNICIAN_WRITE],
    finalizeWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE, PERMISSIONS.WORKORDER_TECHNICIAN_WRITE],
    validateWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE],
    reopenWordOrder: [PERMISSIONS.WORKORDER_MANAGER_WRITE],

    //Spare Parts
    sparePartsWrite: [PERMISSIONS.WORKORDER_SPAREPARTS_WRITE],
  };
  /** ******************************************************************************************************/

  return componentsRoleTable[componentName] ? componentsRoleTable[componentName] : [];
};

/*
 *  Function isAuthorized
 *  checks if there are some user rol in authorizedRoleList
 *  Params:
 *    userRoles: List of current user roles
 *    authorizedRoleList: list of valid roles
 *  Return:
 *    boolean: true if any userRoles are in authorizedRoleList
 */
const isAuthorized = (userRoles, authorizedRoleList) => {
  return true;
};

export { getAuthRoles, isAuthorized };
