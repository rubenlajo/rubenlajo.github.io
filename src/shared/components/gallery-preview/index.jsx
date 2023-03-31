import React from "react";

import IconThumbnail from "../IconThumbnail";

import "./styles.css";

function GalleryPreview({ items = [], onClickItem = () => {} }) {
  let classStr = "";
  switch (items.length) {
    case 0:
      classStr = "no-items";
      break;
    case 1:
      classStr = "items-one";
      break;
    case 2:
      classStr = "items-two";
      break;
    case 3:
      classStr = "items-three";
      break;
    case 3:
      classStr = "items-four";
      break;
    default:
      classStr = "items-four";
      break;
  }

  return (
    <div className={`gallery-preview ${classStr}`}>
      {items.map((item, index) => {
        if (index < 4) {
          return (
            <div key={index} className={items.length > 4 ? "more" : ""}>
              <IconThumbnail 
                onClick={() => onClickItem(index)}
                type={item.format}
                url={item.thumbnail}
                alt={item.title}
              />
              {index === 3 && items.length > 4 ? (
                <span className="more-text" onClick={() => onClickItem(3)}>
                  +{items.length - 4}
                </span>
              ) : null}
            </div>
          );
        }
      })}
    </div>
  );
}

export default GalleryPreview;
