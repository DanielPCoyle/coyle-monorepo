import React from "react";
import { BoldSvg } from "../assets/svg/BoldSvg";
import { ItalicSvg } from "../assets/svg/ItalicSvg";
import { StrikeThroughSvg } from "../assets/svg/StrikeThroughSvg";
import { UnorderedListSvg } from "../assets/svg/UnorderedListSvg";
import { FormattingBarProps } from "../../types";
import { useTranslation } from "react-i18next";

export const FormattingBar: React.FC<FormattingBarProps> = ({
  toggleInlineStyle,
  toggleBlockType,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className="formattingBar"
      role="toolbar"
      aria-label={t("formattingOptions")}
    >
      <button
        onClick={() => toggleInlineStyle("BOLD")}
        className="formatButton"
        data-testid="bold-button"
        aria-label={t("bold")}
      >
        <BoldSvg />
      </button>
      <button
        onClick={() => toggleInlineStyle("ITALIC")}
        className="formatButton"
        data-testid="italic-button"
        aria-label={t("italic")}
      >
        <ItalicSvg />
      </button>
      <button
        onClick={() => toggleInlineStyle("STRIKETHROUGH")}
        className="formatButton"
        data-testid="strikethrough-button"
        aria-label={t("strikethrough")}
      >
        <StrikeThroughSvg />
      </button>
      <button
        onClick={() => toggleBlockType("unordered-list-item")}
        className="formatButton"
        data-testid="unorderedlist-button"
        aria-label={t("unorderedList")}
      >
        <UnorderedListSvg />
      </button>
    </div>
  );
};

export default FormattingBar;
