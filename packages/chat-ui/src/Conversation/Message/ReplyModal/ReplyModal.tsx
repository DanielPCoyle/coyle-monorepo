import React from "react";
import Modal from "react-modal";
import type { Message as MessageType } from "../../../../types";
import { ChatControls } from "../../../ChatControls";
import MessageContent from "../MessageContent";
import { ReactionPicker } from "../Reactions/ReactionPicker";
import { SubMessage } from "./SubMessage/SubMessage";
import {MessageContext} from "../MessageContext";
import { useContext } from "react";
import { ChatContext } from "../../../ChatContext";
import { CloseIcon } from "../../../../assets/svg/CloseIcon";

export const ReplyModal: React.FC = () => {
  const {
    showReplyModal, setShowReplyModal, message, showReactionsPicker, reactionsPickerRef, addReaction
  } = useContext(MessageContext);

  
  const {user, email, socket} = useContext(ChatContext);
  if(Boolean(showReplyModal) === false) return null;

  return <div
    className="modalWrapper"
    onClick={(e) => {
      if ((e.target as HTMLElement).classList.contains("modalWrapper")) {
      setShowReplyModal(false);
      }
    }}
  >
    <div className="coyleChat modal">
    <div className="replyModal animate__animated animate__fadeIn">
      <div>
        <h3>Replying to...</h3>
        <button
          className="closeModal"
          role="button"
          data-testid="close-modal"
          onClick={() => setShowReplyModal(false)}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="replies">
        <MessageContent />
        {showReactionsPicker && (
          <div data-testid="reaction-picker">
          <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
          </div>
        )}
        {message.replies && (
          <div>
            {message.replies.map((reply: MessageType, index: number) => (
              <div key={index}>
                <SubMessage
                  reply={reply}
                  user={user}
                  email={email}
                  addReaction={addReaction}
                  socket={socket} />
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
  </div>;
};
