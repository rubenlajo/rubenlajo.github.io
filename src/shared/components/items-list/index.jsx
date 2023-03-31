import React from "react";

import "./styles.css";

function ItemLine(props) {
  const { item, lineHeaders } = props;

  return (
    <div className="item-line">
      {lineHeaders.map(({ id, ellipsis, name, className, grow }) => {
        const growClass = grow ? "flex-grow" : "";
        const ellipsisClass = ellipsis ? "is-text-ellipsis" : "";
        const textEllipsisClass = ellipsis ? "text-ellipsis" : "";

        if (item[id] !== undefined) {
          return (
            <div key={id} className={`item-property ${className || ""} ${growClass} ${ellipsisClass}`}>
              <div className="label">
                <span>{name}</span>
              </div>
              <div className={textEllipsisClass}>
                <span>{item[id]}</span>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

function ItemsList(props) {
  const { children, lineHeaders } = props;
  return (
    <div className="items-list">
      {children.map((item, key) => (
        <ItemLine key={key} lineHeaders={lineHeaders} item={item} />
      ))}
    </div>
  );
}

ItemsList.defaultProps = {
  lineHeaders: [],
  children: [],
};

export default ItemsList;
