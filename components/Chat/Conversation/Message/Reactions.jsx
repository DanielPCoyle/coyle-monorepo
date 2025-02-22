import React from "react";

export const Reactions = ({ reactions, removeReaction }) => {
    return <div className="reactionsContainer">
        <div className="reactions">
            {Object.values(reactions).map((emoji, idx) => (
                <span
                    onClick={() => removeReaction({ emoji })}
                    key={idx} style={{ cursor: "pointer" }}>{emoji}</span>
            ))}
        </div>
    </div>;
};
