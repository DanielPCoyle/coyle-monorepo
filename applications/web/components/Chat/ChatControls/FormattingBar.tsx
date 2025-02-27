import React from 'react';
import { BoldSvg } from '../../svg/BoldSvg';
import { ItalicSvg } from '../../svg/ItalicSvg';
import { LinkSvg } from '../../svg/LinkSvg';
import { StrikeThroughSvg } from '../../svg/StrikeThroughSvg';
import { UnorderedListSvg } from '../../svg/UnorderedListSvg';

interface FormattingBarProps {
  toggleInlineStyle: (style: string) => void;
  toggleBlockType: (type: string) => void;
}

export const FormattingBar: React.FC<FormattingBarProps> = ({ toggleInlineStyle, toggleBlockType }) => {
  const insertAtCursor = (text: string) => {
    // Implement the function to insert text at the cursor position
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginTop: '10px' }}>
      <button onClick={() => toggleInlineStyle('BOLD')} className="formatButton">
        <BoldSvg />
      </button>
      <button onClick={() => toggleInlineStyle('ITALIC')} className="formatButton">
        <ItalicSvg />
      </button>
      <button onClick={() => insertAtCursor('[link text](url)')} className="formatButton">
        <LinkSvg />
      </button>
      <button onClick={() => toggleInlineStyle('STRIKETHROUGH')} className="formatButton">
        <StrikeThroughSvg />
      </button>
      <button onClick={() => toggleBlockType('unordered-list-item')} className="formatButton">
        <UnorderedListSvg />
      </button>
    </div>
  );
};

export default FormattingBar;
