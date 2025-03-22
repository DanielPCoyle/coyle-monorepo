import React from "react";
import { useContext } from "react";
import { FilePreview } from "./FilePreview";
import { LinkPreview } from "./LinkPreview";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";
import { ReplySvg } from "../../assets/svg/ReplySvg";
import { ReactionPicker } from "./Reactions/ReactionPicker";
import { Reactions } from "./Reactions/Reactions";
import { useOutsideClick } from "../../hooks/useOutsideClick";
// TODO: fix avatar on messages
export const MessageContent = () => {
  const { message,
     setShowReactionsPicker,
     setShowReplyModal,
     reactions,
     showReactionsPicker,
     index,
     removeReactions,
      } = useContext(MessageContext);
  const { user, userName, language } = useContext(ChatContext);
  const reactionsPickerRef = React.useRef<HTMLDivElement>(null);
  useOutsideClick(reactionsPickerRef, () => setShowReactionsPicker(false));
  const [translation, setTranslation] = React.useState<any | null>(message?.translation || null);
  
      React.useEffect(() => {
        if(Boolean(message?.language) && (message?.language !== language) && !message?.translation){
          fetch(process.env.REACT_APP_API_BASE_URL+"/api/chat/translate" as string, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: message?.message,
              id: message?.id,
            })
          }).then((res) => {
              const data = res.json();
              return data;
          }).then((data) => {
              if(data?.text){
                setTranslation(data);
              }
          }
          ).catch((err) => {
            console.log({err})
          }
          );
        }
      },[message])


  return (
    <div
      className={`messageContent ${message.sender === userName ? "sender" : "receiver"}`}
    >
      <div className="message">
      <div className="senderInfo">
        <div
          className="senderAvatar"
        >
          <img
            src={"/icon.png"}
            alt="avatar"
            className="avatar"
          />
        </div>
        <div
          className="sender"
        >
          {message.sender === user?.name
            ? user?.name + "@PhilaPrints"
            : message.sender}
        </div>
      
      </div>
      <FilePreview message={message} />
      <div
        
        dangerouslySetInnerHTML={{ __html: message.message }}
      />
      {Boolean(translation) && <>
          <div className="translationContainer">
          <hr/>
          <div>Translation:</div>
          <div className="translation" dangerouslySetInnerHTML={{__html:translation.text}}/>
          </div>
          </>}
      <LinkPreview message={message} />
      <div className="messageActions">
        <button
          onClick={() => {
            setShowReactionsPicker(true);
          }}
          className="showreactionsEmojiPicker"
        >
          😊
        </button>
        <button
          onClick={() => {
            setShowReplyModal(true);
          }}
          className="showReply"
        >
          <ReplySvg /> {message?.replies?.length > 0 && message.replies.length}
          {message?.replies?.filter((reply)=>!reply.seen).length > 0 && <span className="unreadReplies animate__animated animate__pulse animate__infinite">&nbsp;</span>}          
        </button>
      </div>
      {showReactionsPicker && (
        <div data-testid={`reaction-picker-${index}`} >
        <ReactionPicker 
          reactionsPickerRef={reactionsPickerRef} 
        />
        </div>
      )}
   {Object.values(reactions).length > 0 && (
        <div data-testid={`reactions-${index}`} className={`${message.sender === user?.name ? "senderReactions" : "receiverReactions"}`}>
        <Reactions
          isSender={message.sender === user}
          reactions={reactions}
          removeReactions={removeReactions}
        />
        </div>
      )}
      </div>
      
    </div>
  );
};

export default MessageContent;
