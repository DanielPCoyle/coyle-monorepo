import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminLogin } from "../AdminLogin";
import '@testing-library/jest-dom';

describe("AdminLogin Component", () => {
  it("renders email and password inputs and login button", () => {
    render(<AdminLogin email="" setEmail={vi.fn()} password="" setPassword={vi.fn()} />);

    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("updates email input when typed into", () => {
    const setEmailMock = vi.fn();
    render(<AdminLogin email="" setEmail={setEmailMock} password="" setPassword={vi.fn()} />);
    
    const emailInput = screen.getByLabelText(/Email:/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    
    expect(setEmailMock).toHaveBeenCalledWith("test@example.com");
  });

  it("updates password input when typed into", () => {
    const setPasswordMock = vi.fn();
    render(<AdminLogin email="" setEmail={vi.fn()} password="" setPassword={setPasswordMock} />);
    
    const passwordInput = screen.getByLabelText(/Password:/i);
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    
    expect(setPasswordMock).toHaveBeenCalledWith("password123");
  });
});
