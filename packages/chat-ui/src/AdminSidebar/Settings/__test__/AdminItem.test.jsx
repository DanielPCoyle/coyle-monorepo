import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AdminItem } from "../AdminItem";
import "@testing-library/jest-dom";

const mockAdmin = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
};

describe("AdminItem Component", () => {
  it("renders admin details correctly", () => {
    render(<AdminItem admin={mockAdmin} handleDelete={() => {}} handleEdit={() => {}} />);

    expect(screen.getByTestId("admin-name-1")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("admin-email-1")).toHaveTextContent("john.doe@example.com");
  });

  it("calls handleEdit when edit button is clicked", () => {
    const handleEdit = vi.fn();
    render(<AdminItem admin={mockAdmin} handleDelete={() => {}} handleEdit={handleEdit} />);

    fireEvent.click(screen.getByTestId("edit-button-1"));
    expect(handleEdit).toHaveBeenCalledWith("1");
  });

  it("calls handleDelete when delete button is clicked", () => {
    const handleDelete = vi.fn();
    render(<AdminItem admin={mockAdmin} handleDelete={handleDelete} handleEdit={() => {}} />);

    fireEvent.click(screen.getByTestId("delete-button-1"));
    expect(handleDelete).toHaveBeenCalledWith("1");
  });
});
