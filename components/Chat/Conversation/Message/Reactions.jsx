import React from "react";
import ChatContext from "../../ChatContext";
export const Reactions = ({ isSender, reactions, removeReaction }) => {
    const { email } = React.useContext(ChatContext);
    return <div className="reactionsContainer animate__animated animate__fadeInUp"
        style={{
            justifyContent: isSender ? "flex-end" : "flex-start",
        }}
    >
        <div className="reactions">
            {Object.keys(reactions).map((key)=>Object.values(reactions[key]).map((emoji, idx) => (
                <span
                    onClick={() => {
                        if(key === email){
                            removeReaction({ emoji })
                        }
                    }}
                    key={idx} style={{ cursor: "pointer" }}>{emoji}</span>
            )))}
        </div>
    </div>;
};
