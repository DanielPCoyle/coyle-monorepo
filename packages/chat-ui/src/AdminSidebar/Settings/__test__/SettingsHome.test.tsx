import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, vi } from "vitest";
import React from "react";
import {SettingsHome} from "../SettingsHome";
import SettingsContext from "../SettingsContext";

describe("SettingsHome", () => {
  it("renders the component correctly", () => {
    const setView = vi.fn();

    render(
      <SettingsContext.Provider value={{ setView }}>
        <SettingsHome />
      </SettingsContext.Provider>
    );

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Chat Administrators")).toBeInTheDocument();
  });

  it("calls setView when buttons are clicked", () => {
    const setView = vi.fn();

    render(
      <SettingsContext.Provider value={{ setView }}>
        <SettingsHome />
      </SettingsContext.Provider>
    );

    // Click the Profile button
    fireEvent.click(screen.getByText("Profile"));
    expect(setView).toHaveBeenCalledWith("settings");

    // Click the Chat Administrators button
    fireEvent.click(screen.getByText("Chat Administrators"));
    expect(setView).toHaveBeenCalledWith("adminUsers");
  });
});
