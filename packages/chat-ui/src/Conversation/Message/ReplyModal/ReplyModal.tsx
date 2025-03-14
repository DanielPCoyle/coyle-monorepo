import React from "react";
import Modal from "react-modal";
import type { Message as MessageType } from "../../../../types";
import { ChatControls } from "../../../ChatControls";
import MessageContent from "../MessageContent";
import { ReactionPicker } from "../Reactions/ReactionPicker";
import { SubMessage } from "./SubMessage";
import {MessageContext} from "../MessageContext";
import { useContext } from "react";
import { ChatContext } from "../../../ChatContext";
const customStyles = {
  overlay: {
    insert: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  content: {
    background: "black",
    borderRadius: "10px",
    border: "none",
    width: "50%",
    height: "100%",
    margin: "auto",
  },
};
export const ReplyModal: React.FC = () => {
  const {
    showReplyModal, setShowReplyModal, message, showReactionsPicker, reactionsPickerRef, addReaction
  } = useContext(MessageContext);

  const {user, email, socket} = useContext(ChatContext);
  
  return <Modal
    isOpen={showReplyModal}
    style={customStyles}
    contentLabel="Example Modal"
  >
    <div className="replyModal animate__animated animate__fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Replying to...</h3>
        <button
          className="closeModal"
          onClick={() => setShowReplyModal(false)}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
          </svg>
        </button>
      </div>
      <div className="replies">
        <MessageContent />
        {showReactionsPicker && (
          <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
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
      <div style={{ overflow: "hidden" }}>
        <div className="animate__animated animate__faster animate__slideInDown">
          <ChatControls replyId={message.id} />
        </div>
      </div>
    </div>
  </Modal>;
};
