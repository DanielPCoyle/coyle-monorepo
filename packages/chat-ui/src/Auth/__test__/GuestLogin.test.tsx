import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GuestLogin } from "../GuestLogin";
import '@testing-library/jest-dom';


describe("GuestLogin Component", () => {
  it("renders the input fields and button", () => {
    render(<GuestLogin userName="" setUserName={vi.fn()} email="" setEmail={vi.fn()} />);

    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Chat Now/i })).toBeInTheDocument();
  });

  it("updates the username input field when typing", () => {
    const setUserNameMock = vi.fn();
    render(<GuestLogin userName="" setUserName={setUserNameMock} email="" setEmail={vi.fn()} />);

    const nameInput = screen.getByLabelText(/Name:/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    expect(setUserNameMock).toHaveBeenCalledWith("John Doe");
  });

  it("updates the email input field when typing", () => {
    const setEmailMock = vi.fn();
    render(<GuestLogin userName="" setUserName={vi.fn()} email="" setEmail={setEmailMock} />);

    const emailInput = screen.getByLabelText(/Email:/i);
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    expect(setEmailMock).toHaveBeenCalledWith("john@example.com");
  });
});
