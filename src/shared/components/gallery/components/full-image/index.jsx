import React, { useState, useEffect } from "react";
import { T, intl } from "amiga-core/components/i18n";

import { Icon, Button } from "lib-frontsga";

import Image from "shared/components/image/";
import NoImageIcon from "@/assets/images/no-image-icon.svg";

import "./styles.css";

function FullImage({ type, url, alt, onClick }) {
  const [hasError, setHasError] = useState(false);

  const DownloadFile = ({ url }) => {
    return (
      <div className="download-file">
        <h4>
          <T id="full-image.not-preview" />
        </h4>
        <p>
          <Button
            kind="primary"
            className="download-button"
            label={intl.formatMessage({ id: "full-image.download-file" })}
            onClick={() => {
              var downloadLink = document.createElement("a");
              downloadLink.href = url;
              downloadLink.download = `${alt}.${type.toLowerCase()}`;

              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }}
          />
        </p>
      </div>
    );
  };

  useEffect(() => {
    setHasError(false);
  }, [url]);

  switch (type) {
    case "JPG":
    case "PNG":
    case "BMP":
    case "GIF":
    case "JPEG":
      return (
        <div className={hasError ? "error-picture" : "full-picture" }>
          <picture onClick={onClick}>
            <Image
              src={url}
              altText={alt}
              altSrc={NoImageIcon}
              onError={() => setHasError(true)}
            />
          </picture>
          {hasError ? (
            <>
              <h4>
                <T id="full-image.download-error.title" />
              </h4>
              <p>
                <T id="full-image.download-error.msg1" />
              </p>
              <p>
                <T id="full-image.download-error.msg2" />
              </p>
            </>
          ) : null}
        </div>
      );
    case "PDF":
      return (
        <div className="full-image" onClick={onClick}>
          <Icon icon="sga-icon-file-pdf" />
          <DownloadFile url={url} />
        </div>
      );
    case "DOCX":
    case "DOC":
    case "ODT":
      return (
        <div className="full-image" onClick={onClick}>
          <Icon icon="sga-icon-file-word" />
          <DownloadFile url={url} />
        </div>
      );
    case "TXT":
      return (
        <div className="full-image" onClick={onClick}>
          <Icon icon="sga-icon-file-alt" />
          <DownloadFile url={url} />
        </div>
      );

    case "XLS":
    case "XLSX":
      return (
        <div className="full-image" onClick={onClick}>
          <Icon icon="sga-icon-file-excel" />
          <DownloadFile url={url} />
        </div>
      );
    case "CSS":
    case "JS":
    case "HTML":
      return (
        <div className="full-image" onClick={onClick}>
          <Icon icon="sga-icon-file-code " />
          <DownloadFile url={url} />
        </div>
      );

    case "CSV":
      return (
        <div className="full-image" onClick={onClick}>
          <Icon icon="sga-icon-file-csv" />
          <DownloadFile url={url} />
        </div>
      );

    default:
      return (
        <div className="full-image" onClick={onClick}>
          <Icon icon="sga-icon-file-alt" />
          <DownloadFile url={url} />
        </div>
      );
  }
}

export default FullImage;
