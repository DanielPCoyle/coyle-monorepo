import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LightBox } from "../LightBox";
import { CloseIcon } from "../../assets/svg/CloseIcon";
import "@testing-library/jest-dom";

vi.mock("../assets/svg/CloseIcon", () => ({
  CloseIcon: () => <svg data-testid="close-icon"></svg>,
}));

describe("LightBox Component", () => {
  const mockSetModalSource = vi.fn();
  const modalSource = ["image1.jpg", "image2.jpg"];
  const modalIndex = 0;

  it("renders correctly", () => {
    render(
      <LightBox
        setModalSource={mockSetModalSource}
        modalSource={modalSource}
        modalIndex={modalIndex}
      />,
    );

    const image = screen.getByAltText("file");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", modalSource[modalIndex]);
  });

  it("calls setModalSource when close button is clicked", () => {
    render(
      <LightBox
        setModalSource={mockSetModalSource}
        modalSource={modalSource}
        modalIndex={modalIndex}
      />,
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(mockSetModalSource).toHaveBeenCalledWith(null);
  });
});
