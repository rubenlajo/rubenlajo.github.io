import React from "react";

import Link from "amiga-core/components/router/link";
import { Icon } from "lib-frontsga";
import "./styles.css";

const BreadcrumbSeparator = ({ children, ...props }) => (
  <li className="breadcrumb__separator" {...props}>
    <Icon icon="sga-icon-caret-filled-right" size="size-xs" />
  </li>
);

const BreadcrumbItem = ({ children, ...props }) => (
  <li {...props}>
    {props.to ? 
    <Link className="breadcrumb__item" key={props.to} to={props.to}>
      {props.label}
    </Link> : props.label}
  </li>
);

function Breadcrumbs(props) {
  const items = props.items.map((item, index) => {
    if (item.type && item.type === "component") {
      return <li key={index}>{item.label}</li>;
    }
    if (item.type && item.type === "separator") {
      return <BreadcrumbSeparator key={`breadcrumb__separator${index}`} />;
    }
    return (
      <BreadcrumbItem key={`breadcrumb__item${index}`} to={item.to} label={item.label}>
        {item}
      </BreadcrumbItem>
    );
  });

  return <ol className="breadcrumb">{items}</ol>;
}

export default Breadcrumbs;
