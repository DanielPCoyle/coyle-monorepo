import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { SideBar } from '..';
import '@testing-library/jest-dom';

// Mock the imported components
vi.mock('../ConversationList', () => ({ ConversationList: () => <div>ConversationList</div> }));
vi.mock('../Settings/index', () => ({ Settings: () => <div>Settings</div> }));

// Mock the SVG components
vi.mock('../../../assets/svg/CogSvg', () => ({ CogSvg: () => <div>CogSvg</div> }));
vi.mock('../../../assets/svg/BackArrow', () => ({ BackArrow: () => <div>BackArrow</div> }));

describe('SideBar', () => {
  it('should render ConversationList by default', () => {
    const { getByText } = render(<SideBar />);
    expect(getByText('ConversationList')).toBeInTheDocument();
  });

  it('should switch to Settings view when CogSvg button is clicked', () => {
    const { getByText } = render(<SideBar />);
    fireEvent.click(getByText('CogSvg'));
    expect(getByText('Settings')).toBeInTheDocument();
  });

  it('should switch back to ConversationList view when BackArrow button is clicked', () => {
    const { getByText } = render(<SideBar />);
    fireEvent.click(getByText('CogSvg'));
    fireEvent.click(getByText('BackArrow'));
    expect(getByText('ConversationList')).toBeInTheDocument();
  });
});