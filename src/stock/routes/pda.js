import React from "react";

const Dashboard = React.lazy(() => import("../components/pda/dashboard/"));
const WorkOrders = React.lazy(() => import("../components/pda/warehouse-movements/"));
const WorkOrdersDetail = React.lazy(() => import("../components/pda/warehouse-movement-detail/"));
const MaterialDetail = React.lazy(() => import("../components/pda/material-detail/"));
const LocationDetail = React.lazy(() => import("../components/pda/location-detail/"));
const MaterialTransfer = React.lazy(() => import("../components/pda/transfer-material/"));
const LocationTransfer = React.lazy(() => import("../components/pda/transfer-location/"));
const FreeEntry = React.lazy(() => import("../components/pda/warehouse-movement-exec/free-entry/"));
const InventaryLocationsExec = React.lazy(() =>
  import("../components/pda/warehouse-movement-exec/inventary-locations/"),
);
const InventaryReferencesExec = React.lazy(() =>
  import("../components/pda/warehouse-movement-exec/inventary-references/"),
);
const TraspaseExec = React.lazy(() => import("../components/pda/warehouse-movement-exec/traspase/"));

const dashboardRoutes = [
  //Dashboard
  {
    path: "/stock/pda/dashboard",
    component: Dashboard,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  // order lists (assigned and pending)
  {
    path: "/stock/pda/warehouse-movements/assigned",
    component: (props) => <WorkOrders {...props} type="assigned" />,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  {
    path: "/stock/pda/warehouse-movements/pending",
    component: (props) => <WorkOrders {...props} type="pending" />,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  //Warhouse Movment detail
  {
    path: "/stock/pda/warehouse-movements/:warehouseMovementId",
    component: WorkOrdersDetail,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  //Reference transfer
  {
    path: "/stock/pda/materials/:materialId/transfer",
    component: MaterialTransfer,
    label: "stock.routes.pda.transfer",
    hidden: true,
  },
  //Reference detail
  {
    path: "/stock/pda/materials/:materialId",
    component: MaterialDetail,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  //Location detail
  {
    path: "/stock/pda/locations/:locationId/transfer",
    component: LocationTransfer,
    label: "stock.routes.pda.transfer",
    hidden: true,
  },
  //Location detail
  {
    path: "/stock/pda/locations/:locationId",
    component: LocationDetail,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  //Warhouse Movment free entry exec
  {
    path: "/stock/pda/warehouse-movements-exec-free-entry/:materialId",
    component: FreeEntry,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  //Warhouse Movment inventary location exec
  {
    path: "/stock/pda/warehouse-movements-exec-inventary-locations/:warehouseMovementId",
    component: InventaryLocationsExec,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  //Warhouse Movment inventary reference exec
  {
    path: "/stock/pda/warehouse-movements-exec-inventary-materials/:warehouseMovementId",
    component: InventaryReferencesExec,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
  {
    path: "/stock/pda/warehouse-movements-exec-traspase/:warehouseMovementId",
    component: TraspaseExec,
    label: "stock.routes.pda.dashboard",
    hidden: true,
  },
];

export default dashboardRoutes;
