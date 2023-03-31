import React from "react";

import { Icon } from "lib-frontsga";
import Image from "shared/components/image/";
import NoImageIcon from "@/assets/images/no-image-icon.svg";

function IconThumbnail({ type, url, alt, onClick }) {
  switch (type) {
    case "JPG":
    case "PNG":
    case "BMP":
    case "GIF":
    case "JPEG":
      return (
        <picture onClick={onClick}>
          <Image src={url} altText={alt} altSrc={NoImageIcon} />
        </picture>
      );
    case "PDF":
      return (
        <div className="icon-thumbnail" onClick={onClick}>
          <Icon icon="sga-icon-file-pdf " />
        </div>
      );
    case "DOCX":
    case "DOC":
    case "ODT":
      return (
        <div className="icon-thumbnail" onClick={onClick}>
          <Icon icon="sga-icon-file-word" />
        </div>
      );
    case "TXT":
      return (
        <div className="icon-thumbnail" onClick={onClick}>
          <Icon icon="sga-icon-file-alt" />
        </div>
      );

    case "XLS":
    case "XLSX":
      return (
        <div className="icon-thumbnail" onClick={onClick}>
          <Icon icon="sga-icon-file-excel" />
        </div>
      );
    case "CSS":
    case "JS":
    case "HTML":
      return (
        <div className="icon-thumbnail" onClick={onClick}>
          <Icon icon="sga-icon-file-code " />
        </div>
      );

    case "CSV":
      return (
        <div className="icon-thumbnail" onClick={onClick}>
          <Icon icon="sga-icon-file-csv" />
        </div>
      );

    default:
      return (
        <div className="icon-thumbnail" onClick={onClick}>
          <Icon icon="sga-icon-file-alt" />
        </div>
      );
  }
}

export default IconThumbnail;
