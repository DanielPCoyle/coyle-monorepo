import React, { useContext } from "react";
import ChatContext from "../../../ChatContext";
import { ReactionsProps } from "../../../../types";

export const Reactions: React.FC<ReactionsProps> = ({
  reactions,
  removeReactions,
}) => {
  const { email } = useContext(ChatContext);

  return (
    <div
      className="reactionsContainer animate__animated animate__fadeInUp"
    >
      <div className="reactions">
        {Object.keys(reactions).map((key) =>
          Object.values(reactions[key]).map((emoji: string, idx: number) => (
            <button
              onClick={() => {
                if (key === email) {
                  removeReactions({ emoji });
                }
              }}
              key={idx}
            >
              {emoji}
            </button>
          )),
        )}
      </div>
    </div>
  );
};

export default Reactions;