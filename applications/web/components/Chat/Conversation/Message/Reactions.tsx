import React, { useContext } from "react";
import ChatContext from "../../ChatContext";

interface ReactionsProps {
  isSender: boolean;
  reactions: { [key: string]: string[] };
  removeReactions: (reactions: { emoji: string }) => void;
}

export const Reactions: React.FC<ReactionsProps> = ({
  isSender,
  reactions,
  removeReactions,
}) => {
  const { email } = useContext(ChatContext);

  return (
    <div
      className="reactionsContainer animate__animated animate__fadeInUp"
      style={{
        justifyContent: isSender ? "flex-end" : "flex-start",
      }}
    >
      <div className="reactions">
        {Object.keys(reactions).map((key) =>
          Object.values(reactions[key]).map((emoji: string, idx: number) => (
            <span
              onClick={() => {
                if (key === email) {
                  removeReactions({ emoji });
                }
              }}
              key={idx}
              style={{ cursor: "pointer" }}
            >
              {emoji}
            </span>
          )),
        )}
      </div>
    </div>
  );
};
