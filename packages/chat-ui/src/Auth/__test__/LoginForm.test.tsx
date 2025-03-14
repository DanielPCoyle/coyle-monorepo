import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginForm } from "../LoginForm";
import { ChatContext } from "../../ChatContext";
import { useAuth } from "../../hooks/useAuth";
import { vi } from "vitest";

vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockGetAndSetUser = vi.fn();
useAuth.mockReturnValue({ getAndSetUser: mockGetAndSetUser });

const mockContextValue = {
  id: "12345",
  userName: "",
  setUserName: vi.fn(),
  email: "",
  setEmail: vi.fn(),
  setToken: vi.fn(),
  setIsLoggedIn: vi.fn(),
};

describe("LoginForm", () => {
  it("renders the login form correctly", () => {
    render(
      <ChatContext.Provider value={mockContextValue}>
        <LoginForm />
      </ChatContext.Provider>
    );
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(screen.getByTestId("login-message")).toHaveTextContent(
      "Want to chat with PhilaPrints?"
    );
    expect(screen.getByTestId("lottie-container")).toBeInTheDocument();
  });

  it("toggles between guest and admin login", () => {
    render(
      <ChatContext.Provider value={mockContextValue}>
        <LoginForm />
      </ChatContext.Provider>
    );
    const toggleButton = screen.getByTestId("toggle-login-mode");
    
    expect(screen.getByTestId("guest-login")).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("admin-login")).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("guest-login")).toBeInTheDocument();
  });

  it("calls setUserName and setEmail on input change", () => {
    render(
      <ChatContext.Provider value={mockContextValue}>
        <LoginForm />
      </ChatContext.Provider>
    );
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    expect(mockContextValue.setUserName).toHaveBeenCalledWith("John Doe");
    expect(mockContextValue.setEmail).toHaveBeenCalledWith("john@example.com");
  });

  it("submits the form and calls fetch", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ token: "mocked_jwt_token" }),
      })
    );

    render(
      <ChatContext.Provider value={mockContextValue}>
        <LoginForm />
      </ChatContext.Provider>
    );
    
    fireEvent.submit(screen.getByTestId("login-form"));
    
    expect(global.fetch).toHaveBeenCalled();
  });
});
