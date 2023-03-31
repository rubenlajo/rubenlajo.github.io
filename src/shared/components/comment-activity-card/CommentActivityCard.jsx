import React, { useState } from "react";
import { intl } from "amiga-core/components/i18n";
import { moment } from "amiga-core/application/i18n/moment";
import injectWarehouse from "application/connectors/injectWarehouse";
import injectUser from "../../../application/connectors/injectUser";
import Slider from "shared/components/slider";
import Gallery from "shared/components/gallery/";
import GalleryPreview from "shared/components/gallery-preview";
import FullImage from "../gallery/components/full-image";
import AvatarWrapper from "shared/components/avatar-wrapper/";
import useWindowSize from "@/customHooks/useWindowSize";
import { getEndpoint, applyPathParams, getNameFromUserNames } from "@/utils/";
import CommentActivityEditCard from "./CommentActivityEditCard";
import MobileSlidePanel from "shared/components/mobile-slide-panel/";
import SidePanel from "shared/components/side-panel";

import { dateFormat, dateFormatEN, formatISO8601 } from "@/generalConfig";
import { Visible } from "amiga-core/components/auth";
import { isAuthorized } from "@/utils/permissions";
import PERMISSIONS from "@/PERMISSIONS.json";

import "./styles.css";
import { Button } from "lib-frontsga";

function CommentActivityCard(props) {
  const {
    workOrderId,
    documents,
    physicalElements,
    commentText,
    commentId,
    modificationDate,
    creationDate,
    creationUser,
    centerSelected,
    modificationUser,
    setShowComments,
    setShowDetailsPanel,
    user,
    changeWorkOrderActivityComment,
    workOrderActivity,
    setUpdateComments,
    userNames,
  } = props;
  const [showFullWindow, setShowFullWindow] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const windoSize = useWindowSize();

  const now = moment(new Date());
  const createdDate = moment(modificationDate || creationDate, formatISO8601).calendar(now, {
    sameDay: `[${intl.formatMessage({
      id: "shared.component.comment-card.today",
    })}]`,
    lastDay: `[${intl.formatMessage({
      id: "shared.component.comment-card.yesterday",
    })}]`,
    lastWeek: intl.locale === "es" ? dateFormat : dateFormatEN,
    sameElse: intl.locale === "es" ? dateFormat : dateFormatEN,
  });

  const creationUserName = getNameFromUserNames(userNames, creationUser?.login);

  const mapDocumentsToGallery = document => ({
    id: document?.documentId,
    title: document?.documentName,
    format: document?.documentFormat?.documentFormatName,
    image: applyPathParams(getEndpoint("document"), {
      centerId: centerSelected?.centerId,
      documentId: document?.documentId,
    }),
    thumbnail: applyPathParams(getEndpoint("documentThumbnail"), {
      centerId: centerSelected?.centerId,
      documentId: document?.documentId,
    }),
    caption: ["JPG", "PNG", "BMP", "GIF", "JPEG"].some(
      format => format === document?.documentFormat?.documentFormatName
    ) ? (
      <div className='caption'>
        <div className='caption-container'>
          <div className='comment-activity-elements'>
            {physicalElements?.map((physicalElement, index) =>
              index === physicalElements.length - 1
                ? physicalElement.genericCode
                : physicalElement.genericCode + ", "
            )}
          </div>
          <div className='comment-activity-content'>{commentText}</div>
          <div className='comment-activity-date'>
            {intl.formatMessage({ id: "work-order-detail.gallery.activity" })}{" "}
            {workOrderActivity?.activity?.activityCode} |{" "}
            {modificationDate || creationDate ? createdDate : null}
          </div>
          <div className='comment-activity-user'>
            <AvatarWrapper
              users={creationUser ? [{ name: creationUserName, login: creationUser?.login }] : []}
            />
          </div>
        </div>
      </div>
    ) : null,
  });

  const items = documents ? documents.map(mapDocumentsToGallery) : [];

  const renderActivityEditComment = () => {
    return (
      <div key='work-order-comment-edit' className='work-order-comments-container'>
        <CommentActivityEditCard
          documents={documents}
          setShowComments={setShowComments}
          commentText={commentText}
          centerId={centerSelected.centerId}
          workOrderId={workOrderId}
          setShowDetailsPanel={setShowDetailsPanel}
          changeWorkOrderActivityComment={changeWorkOrderActivityComment}
          setShowEditMenu={setShowEditMenu}
          workOrderActivity={workOrderActivity}
          commentId={commentId}
          setUpdateComments={setUpdateComments}
          user={user}
        />
      </div>
    );
  };

  return (
    <div className='comments-activity-card-item'>
      {documents ? (
        <>
          <GalleryPreview
            items={items}
            onClickItem={itemIndex => {
              setActiveSlideIndex(itemIndex);
              setShowFullWindow(true);
            }}
          />
          {windoSize.width > 768 ? (
            <Gallery
              key={showFullWindow}
              visible={showFullWindow}
              items={items}
              onClose={() => {
                setShowFullWindow(false);
                setActiveSlideIndex(0);
              }}
              initialActive={activeSlideIndex}
            />
          ) : (
            showFullWindow && (
              <Slider
                key={showFullWindow}
                className='comment-image-slider'
                dots
                onClose={() => {
                  setShowFullWindow(false);
                  setActiveSlideIndex(0);
                }}
                initialSlide={activeSlideIndex}
              >
                {items?.map((item, index) => (
                  <div key={index} className='comment-slider-slide'>
                    <FullImage url={item.image} type={item.format} alt={item.title} />
                    {item.caption}
                  </div>
                ))}
              </Slider>
            )
          )}
        </>
      ) : null}
      <div className='comment-activity-bottom-left'>
        {physicalElements?.map((physicalElement, index) =>
          index === physicalElements.length - 1
            ? physicalElement.genericCode
            : physicalElement.genericCode + ", "
        )}
      </div>
      <div className='comment-activity-content'>{commentText}</div>
      <div className='comment-activity-bottom'>
        <div className='comment-bottom'>
          <div className='comment-activity-bottom-left'>
            {intl.formatMessage({
              id: "shared.component.comment-activity-card.ot",
            })}
            {workOrderId} | {modificationDate || creationDate ? createdDate : null}
          </div>
          {creationUser?.login === user?.login && (
            <Visible
              onlyIf={() =>
                isAuthorized(user.roles, [
                  PERMISSIONS.WORKORDER_MANAGER_WRITE,
                  PERMISSIONS.WORKORDER_TECHNICIAN_WRITE,
                ])
              }
            >
              <Button
                className='edit-button'
                label={`${intl.formatMessage({ id: "work-order-detail.info-panel.title-edit" })}`}
                onClick={() => {
                  setShowEditMenu(true);
                }}
                kind='tertiary'
              />
            </Visible>
          )}
        </div>
        <div className='comment-bottom-right'>
          <AvatarWrapper
            users={creationUser ? [{ name: creationUserName, login: creationUser?.login }] : []}
          />
        </div>
        {window.innerWidth < 500 ? (
          <MobileSlidePanel
            title={`${intl.formatMessage({ id: "comments-activity-form-edit" })}`}
            visible={showEditMenu}
            className='work-order-detail-comments-panel'
            onClose={() => setShowEditMenu(false)}
          >
            {renderActivityEditComment()}
          </MobileSlidePanel>
        ) : (
          <SidePanel
            title={`${intl.formatMessage({ id: "comments-activity-form-edit" })}`}
            visible={showEditMenu}
            className='work-order-detail-comments-panel'
            setVisible={() => setShowEditMenu(false)}
          >
            {renderActivityEditComment()}
          </SidePanel>
        )}
      </div>
    </div>
  );
}

export default injectWarehouse(injectUser(CommentActivityCard));
