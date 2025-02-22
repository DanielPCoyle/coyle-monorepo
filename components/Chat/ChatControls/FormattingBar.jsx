import React from "react";
import { BoldSvg } from "../../svg/BoldSvg";
import { ItalicSvg } from "../../svg/ItalicSvg";
import { LinkSvg } from "../../svg/LinkSvg";
import { UnorderedListSvg } from "../../svg/UnorderedListSvg";
import { StrikeThroughSvg } from "../../svg/StrikeThroughSvg";

export const FormattingBar = ({ toggleInlineStyle, toggleBlockType }) => {
    return <div style={{ display: "flex", justifyContent: "start", alignItems: "center", marginTop: "10px" }}>
        <button
            onClick={() => toggleInlineStyle("BOLD")}
            className="formatButton"
        >
            <BoldSvg />
        </button>
        <button
            onClick={() => toggleInlineStyle("ITALIC")}
            className="formatButton"
        >
            <ItalicSvg />
        </button>
        <button
            onClick={() => insertAtCursor("[link text](url)")}
            className="formatButton"
        >
            <LinkSvg />
        </button>
        <button
            onClick={() => toggleInlineStyle("STRIKETHROUGH")}
            className="formatButton"
        >
            <StrikeThroughSvg />
        </button>
        <button
            onClick={() => toggleBlockType("unordered-list-item")}
            className="formatButton"
        >
            <UnorderedListSvg />
        </button>
    </div>;
};


