import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { AddNewUserScreen } from "../AddNewUserScreen";
import SettingsContext from "../SettingsContext";
import "@testing-library/jest-dom";

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("AddNewUserScreen", () => {
  let setViewMock;

  beforeEach(() => {
    setViewMock = vi.fn();
    render(
      <SettingsContext.Provider value={{ setView: setViewMock }}>
        <AddNewUserScreen />
      </SettingsContext.Provider>
    );
  });

  it("renders the component correctly", () => {
    expect(screen.getByTestId("title")).toHaveTextContent("Add Chat Administrator");
    expect(screen.getByTestId("admin-name-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("role-select")).toBeInTheDocument();
    expect(screen.getByTestId("add-user-button")).toBeInTheDocument();
  });

  it("allows input fields to be changed", () => {
    const nameInput = screen.getByTestId("admin-name-input");
    const emailInput = screen.getByTestId("email-input");
    const roleSelect = screen.getByTestId("role-select");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(roleSelect, { target: { value: "moderator" } });

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(roleSelect).toHaveValue("moderator");
  });

  it("calls the API and updates the view on submit", async () => {
    const addButton = screen.getByTestId("add-user-button");
    fireEvent.click(addButton);

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(fetch).toHaveBeenCalledWith(process.env.REACT_APP_API_BASE_URL+"/api/auth/register", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({
        name: "",
        email: "",
        role: "admin",
      }),
    }));

    expect(setViewMock).toHaveBeenCalledWith("adminUsers");
  });
});
