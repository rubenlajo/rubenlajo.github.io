import React, { useState } from "react";
import { intl } from "amiga-core/components/i18n";
import { moment } from "amiga-core/application/i18n/moment";
import injectUser from "application/connectors/injectUser";

import AvatarWrapper from "shared/components/avatar-wrapper/";
import Gallery from "shared/components/gallery/";
import GalleryPreview from "shared/components/gallery-preview";
import injectWarehouse from "application/connectors/injectWarehouse";
import Slider from "shared/components/slider";

import { getEndpoint, applyPathParams, getNameFromUserNames } from "@/utils/";
import { dateFormat, dateFormatEN, formatISO8601 } from "@/generalConfig";
import useWindowSize from "@/customHooks/useWindowSize";
import CommentEditCard from "./CommentEditCard";
import { Button } from "lib-frontsga";
import MobileSlidePanel from "shared/components/mobile-slide-panel/";
import SidePanel from "shared/components/side-panel";

import { Visible } from "amiga-core/components/auth";
import { isAuthorized } from "@/utils/permissions";
import PERMISSIONS from "@/PERMISSIONS.json";

import FullImage from "../gallery/components/full-image";

import "./styles.css";

function CommentCard(props) {
  const {
    documents,
    commentText,
    modificationDate,
    creationDate,
    creationUser,
    activityDetail,
    centerSelected,
    physicalElements,
    avatarSize,
    commentUserStyle,
    workOrderId,
    changeWorkOrderComment,
    commentId,
    user,
    editDisabled,
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
          <div className='comment-content'>{commentText}</div>
          <div className='comment-date'>
            {modificationDate || creationDate ? createdDate : null}
          </div>
          <div className='comment-user' style={commentUserStyle ? commentUserStyle : null}>
            <AvatarWrapper
              users={creationUser ? [{ name: creationUserName, login: creationUser?.login }] : []}
              size={avatarSize}
            />
          </div>
        </div>
      </div>
    ) : null,
  });

  const items = documents ? documents.map(mapDocumentsToGallery) : null;

  const renderEditComment = () => {
    return (
      <div key='work-order-comment-edit' className='work-order-comments-container'>
        <CommentEditCard
          documents={documents}
          commentText={commentText}
          centerId={centerSelected.centerId}
          workOrderId={workOrderId}
          changeWorkOrderComment={changeWorkOrderComment}
          setShowEditMenu={setShowEditMenu}
          commentId={commentId}
          user={user}
        />
      </div>
    );
  };

  const physicalElementsShown = physicalElements
    ? physicalElements.map((pe, index) => (
        <p className='physical-elements' key={index}>
          {`${pe.genericCode}`}{" "}
        </p>
      ))
    : activityDetail?.comments?.map((pe, index) =>
        index === pe.physicalElements?.length - 1 ? (
          <p className='physical-elements' key={index}>
            {`${pe.physicalElements[0]?.genericCode}`}{" "}
          </p>
        ) : (
          pe.physicalElements.map((gc, index) =>
            index === gc.genericCode?.length - 1 ? (
              <p className='physical-elements' key={index}>{`${gc.genericCode}, `}</p>
            ) : (
              <p className='physical-elements' key={index}>{`${gc.genericCode}`}</p>
            )
          )
        )
      );

  return (
    <div className='comments-card'>
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
                {items.map(item => (
                  <div className='comment-slider-slide'>
                    <FullImage url={item.image} type={item.format} alt={item.title} />
                    {item.caption}
                  </div>
                ))}
              </Slider>
            )
          )}
        </>
      ) : null}
      <div className='physical-elements-shown'>{physicalElementsShown}</div>
      <div className='comment-content'>{commentText}</div>
      <div className='comment-bottom'>
        <div className='comment-bottom-left-columns'>
          <div className='comment-bottom-left'>
            {activityDetail?.activity?.activityId &&
              intl.formatMessage(
                { id: "workOrder.detail.workOrderDetailPage.activity" },
                { activity: activityDetail?.activity?.activityId }
              ) + " | "}
            {modificationDate || creationDate ? createdDate : null}
          </div>

          {creationUser.login === user.login && !physicalElements && !editDisabled && (
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
            {renderEditComment()}
          </MobileSlidePanel>
        ) : (
          <SidePanel
            title={`${intl.formatMessage({ id: "comments-activity-form-edit" })}`}
            visible={showEditMenu}
            className='work-order-detail-comments-panel'
            setVisible={() => setShowEditMenu(false)}
          >
            {renderEditComment()}
          </SidePanel>
        )}
      </div>
    </div>
  );
}

export default injectWarehouse(injectUser(CommentCard));
