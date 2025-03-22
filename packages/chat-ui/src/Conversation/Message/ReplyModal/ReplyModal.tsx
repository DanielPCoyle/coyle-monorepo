import React, { useEffect, useRef } from "react";
import type { Message as MessageType } from "../../../../types";
import { ChatControls } from "../../../ChatControls";
import MessageContent from "../MessageContent";
import { ReactionPicker } from "../Reactions/ReactionPicker";
import { SubMessage } from "./SubMessage/SubMessage";
import { MessageContext } from "../MessageContext";
import { useContext } from "react";
import { ChatContext } from "../../../ChatContext";
import { CloseIcon } from "../../../assets/svg/CloseIcon";
import { useTranslation } from "react-i18next";

export const ReplyModal: React.FC = () => {
  const {
    showReplyModal,
    setShowReplyModal,
    message,
  } = useContext(MessageContext);
  const { t } = useTranslation();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showReplyModal) {
      // Focus the modal when it opens
      modalRef.current?.focus();
    }
  }, [showReplyModal]);

  if (Boolean(showReplyModal) === false) return null;

  return (
    <div
      className="modalWrapper"
      onClick={(e) => {
        if ((e.target as HTMLElement).classList.contains("modalWrapper")) {
          setShowReplyModal(false);
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reply-modal-title"
      aria-describedby="reply-modal-description"
    >
      <div className="coyleChat modal">
        <div
          className="replyModal animate__animated animate__fadeIn"
          tabIndex={-1}
          ref={modalRef}
        >
          <div>
            <h3 id="reply-modal-title">{t("replyingTo")}...</h3>
            <button
              className="closeModal"
              role="button"
              data-testid="close-modal"
              onClick={() => setShowReplyModal(false)}
              aria-label={t("closeModal")}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="replies" id="reply-modal-description">
            <MessageContent />
            {message.replies && (
              <div>
                {message.replies.map((reply: MessageType, index: number) => (
                  <div key={index}>
                    <SubMessage reply={reply as any} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <hr />
          <div>
            <div className="animate__animated animate__faster animate__slideInDown">
              <ChatControls replyId={message.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
