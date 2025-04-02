import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { AdminItem } from "./AdminItem";
import { ChatContext } from "../../ChatContext";

const mockHandleDelete = vi.fn();
const mockHandleEdit = vi.fn();

const mockAdmin = { id: "123", name: "John Doe", email: "john@example.com" };
const mockUser = { id: "456" };

const renderComponent = (admin = mockAdmin, user = mockUser) =>
  render(
    <ChatContext.Provider value={{ user }}>
      <AdminItem admin={admin} handleDelete={mockHandleDelete} handleEdit={mockHandleEdit} />
    </ChatContext.Provider>
  );

describe("AdminItem Component", () => {
  it("renders admin details correctly", () => {
    renderComponent();
    expect(screen.getByTestId("admin-name-123")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("admin-email-123")).toHaveTextContent("john@example.com");
  });

  it("triggers handleEdit when edit button is clicked", () => {
    renderComponent();
    const editButton = screen.getByTestId("edit-button-123");
    fireEvent.click(editButton);
    expect(mockHandleEdit).toHaveBeenCalledWith("123");
  });

  it("triggers handleDelete when delete button is clicked", () => {
    renderComponent();
    const deleteButton = screen.getByTestId("delete-button-123");
    fireEvent.click(deleteButton);
    expect(mockHandleDelete).toHaveBeenCalledWith("123");
  });

  it("does not render delete button if admin is the current user", () => {
    renderComponent(mockAdmin, { id: "123" });
    expect(screen.queryByTestId("delete-button-123")).not.toBeInTheDocument();
  });
});
