import { TextArea, FileUploader, Button } from "lib-frontsga";
import { intl } from "amiga-core/components/i18n";
import React, { useState } from "react";
import { applyPathParams, getEndpoint, post } from "@/utils";
import { Visible } from "amiga-core/components/auth";
import { isAuthorized } from "@/utils/permissions";
import PERMISSIONS from "@/PERMISSIONS.json";

function CommentActivityEditCard(props) {
  const {
    documents,
    commentText,
    centerId,
    workOrderId,
    setShowEditMenu,
    setShowComments,
    setShowDetailsPanel,
    changeWorkOrderActivityComment,
    workOrderActivity,
    commentId,
    setUpdateComments,
    user,
  } = props;
  const [editCommentText, setEditCommentText] = useState(commentText);
  const [editDocuments, setEditDocuments] = useState(documents !== undefined ? documents : []);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  const uploadDocumentsEndpoint = applyPathParams(getEndpoint("centerDocuments"), { centerId });

  const fileRemoved = file => {
    const auxList = [];
    editDocuments.forEach(document => {
      if (document.uuid && document.uuid != file.id) {
        auxList.push(document);
      } else if (file.uploadInfo && document.documentId != file.uploadInfo.documentId) {
        auxList.push(document);
      }
    });
    setEditDocuments(auxList);
    setSaveButtonEnabled(auxList.length > 0 || editCommentText ? true : false);
  };

  const uploadInfo = (file, res) => {
    const document = {
      uuid: file.id,
      documentId: res.documentId,
    };
    editDocuments.push(document);
    setSaveButtonEnabled(editDocuments.length > 0 || editCommentText ? true : false);
    return file;
  };

  const files = [];
  editDocuments?.forEach(document => {
    files.push({
      name: document.documentName,
      uploadInfo: document,
      size: document.size,
    });
  });
  return (
    <>
      <div className='comments-activity-card'>
        <div className='comment-textarea'>
          <TextArea
            label={`${intl.formatMessage({ id: "comment" })}`}
            onChange={text => {
              setEditCommentText(text.slice(0, 250));
              setSaveButtonEnabled(editDocuments.length > 0 || editCommentText ? true : false);
            }}
            value={editCommentText}
          />
        </div>

        <FileUploader
          defaultFiles={files}
          endpoint={uploadDocumentsEndpoint}
          post={post}
          uploadInfo={uploadInfo}
          onRemove={fileRemoved}
        />
      </div>
      <div className='edit-form-buttons'>
        <Visible
          onlyIf={() =>
            isAuthorized(user.roles, [
              PERMISSIONS.WORKORDER_MANAGER_WRITE,
              PERMISSIONS.WORKORDER_TECHNICIAN_WRITE,
            ])
          }
        >
          <Button
            kind='primary'
            disabled={!saveButtonEnabled}
            label={`${intl.formatMessage({ id: "comments-activity-form-edit-save" })}`}
            onClick={() => {
              const data = {
                comment: editCommentText,
                documents: editDocuments !== undefined ? editDocuments : [],
              };

              changeWorkOrderActivityComment(
                centerId,
                workOrderId,
                workOrderActivity.activity.activityId,
                commentId,
                data
              );
              if (setUpdateComments != undefined) {
                setUpdateComments(true);
              }

              setShowEditMenu(false);
              if (setShowComments != undefined) {
                setShowComments(false);
              }
              if (setShowDetailsPanel != undefined) {
                setShowDetailsPanel(false);
              }
            }}
          />
        </Visible>
        <Visible
          onlyIf={() =>
            isAuthorized(user.roles, [
              PERMISSIONS.WORKORDER_MANAGER_WRITE,
              PERMISSIONS.WORKORDER_TECHNICIAN_WRITE,
            ])
          }
        >
          <Button
            kind='tertiary'
            label={`${intl.formatMessage({ id: "comments-activity-form-edit-cancel" })}`}
            onClick={() => {
              if (setShowEditMenu != undefined) {
                setShowEditMenu(false);
              }
              if (setShowDetailsPanel != undefined) {
                setShowDetailsPanel(false);
              }
            }}
          />
        </Visible>
      </div>
    </>
  );
}

export default CommentActivityEditCard;
