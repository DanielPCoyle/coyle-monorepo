import { renderHook } from "@testing-library/react";
import { useOutsideClick } from "../useOutsideClick";
import { vi } from "vitest";
import { act } from "react";

describe("useOutsideClick", () => {
  let callback: () => void;
  let ref: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    callback = vi.fn();
    ref = { current: document.createElement("div") } as React.RefObject<HTMLDivElement>;
    document.body.appendChild(ref.current);
  });

  afterEach(() => {
    document.body.removeChild(ref.current!);
    vi.clearAllMocks();
  });

  it("should call callback when clicking outside the element", () => {
    renderHook(() => useOutsideClick(ref, callback));

    act(() => {
      const outsideClick = new MouseEvent("mousedown", { bubbles: true });
      document.body.dispatchEvent(outsideClick);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should not call callback when clicking inside the element", () => {
    renderHook(() => useOutsideClick(ref, callback));

    act(() => {
      const insideClick = new MouseEvent("mousedown", { bubbles: true });
      ref.current?.dispatchEvent(insideClick);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should remove event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useOutsideClick(ref, callback));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
