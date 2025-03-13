import { render, screen, cleanup } from "@testing-library/react";
import { vi } from "vitest";
import { ThreeJsBackground } from "../ThreeJsBackground";
import * as THREE from "three";
import "@testing-library/jest-dom";

// Mock Three.js WebGLRenderer globally
vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    WebGLRenderer: class {
      domElement = document.createElement("canvas");
      setSize = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
    },
  };
});

describe("ThreeJsBackground Component", () => {
  afterEach(() => {
    cleanup(); // Ensures proper cleanup between tests
  });

  it("renders without crashing", () => {
    render(<ThreeJsBackground />);
    expect(screen.getByTestId("threejs-container")).toBeInTheDocument();
  });

  it("attaches the renderer's canvas to the DOM", () => {
    render(<ThreeJsBackground />);
    const container = screen.getByTestId("threejs-container");

    // Ensure a canvas element is added to the container
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("cleans up on unmount", () => {
    const { unmount } = render(<ThreeJsBackground />);
    const container = screen.getByTestId("threejs-container");

    expect(container.querySelector("canvas")).toBeInTheDocument();

    // Unmount the component and check if the canvas is removed
    unmount();
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });
});
