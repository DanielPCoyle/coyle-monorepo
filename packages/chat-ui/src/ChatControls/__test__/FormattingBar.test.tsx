import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FormattingBar } from "../FormattingBar";

// Mock SVG components
vi.mock("../../svg/BoldSvg", () => ({ BoldSvg: () => <svg data-testid="bold-icon" /> }));
vi.mock("../../svg/ItalicSvg", () => ({ ItalicSvg: () => <svg data-testid="italic-icon" /> }));
vi.mock("../../svg/StrikeThroughSvg", () => ({ StrikeThroughSvg: () => <svg data-testid="strikethrough-icon" /> }));
vi.mock("../../svg/UnorderedListSvg", () => ({ UnorderedListSvg: () => <svg data-testid="unorderedlist-icon" /> }));

describe("FormattingBar", () => {
  let toggleInlineStyleMock: vi.Mock;
  let toggleBlockTypeMock: vi.Mock;

  beforeEach(() => {
    toggleInlineStyleMock = vi.fn();
    toggleBlockTypeMock = vi.fn();

    render(
      <FormattingBar 
        toggleInlineStyle={toggleInlineStyleMock} 
        toggleBlockType={toggleBlockTypeMock} 
      />
    );
  });

  it("renders all formatting buttons", () => {
    expect(screen.getByTestId("bold-button")).toBeInTheDocument();
    expect(screen.getByTestId("italic-button")).toBeInTheDocument();
    expect(screen.getByTestId("strikethrough-button")).toBeInTheDocument();
    expect(screen.getByTestId("unorderedlist-button")).toBeInTheDocument();
  });

  it("fires toggleInlineStyle when bold, italic, and strikethrough buttons are clicked", () => {
    fireEvent.click(screen.getByTestId("bold-button"));
    fireEvent.click(screen.getByTestId("italic-button"));
    fireEvent.click(screen.getByTestId("strikethrough-button"));

    expect(toggleInlineStyleMock).toHaveBeenCalledTimes(3);
    expect(toggleInlineStyleMock).toHaveBeenCalledWith("BOLD");
    expect(toggleInlineStyleMock).toHaveBeenCalledWith("ITALIC");
    expect(toggleInlineStyleMock).toHaveBeenCalledWith("STRIKETHROUGH");
  });

  it("fires toggleBlockType when unordered list button is clicked", () => {
    fireEvent.click(screen.getByTestId("unorderedlist-button"));

    expect(toggleBlockTypeMock).toHaveBeenCalledTimes(1);
    expect(toggleBlockTypeMock).toHaveBeenCalledWith("unordered-list-item");
  });

  it("does not trigger any function when no buttons are clicked", () => {
    expect(toggleInlineStyleMock).not.toHaveBeenCalled();
    expect(toggleBlockTypeMock).not.toHaveBeenCalled();
  });
});
