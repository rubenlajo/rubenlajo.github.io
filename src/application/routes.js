import { lazy } from "react";

const Redirector = lazy(() => import("./components/redirector"));

export default [{ path: "/", exact: true, component: Redirector }];
