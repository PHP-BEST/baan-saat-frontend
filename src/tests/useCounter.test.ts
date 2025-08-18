// Testing useCounter.ts

import { renderHook, act } from "@testing-library/react";
import useCounter from "../hooks/useCounter";

describe("useCounter", () => {
  it("should initialize with count 0 and val 1", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
    expect(result.current.val).toBe(1);
  });

  it("should increment count by default val (1)", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should increment count multiple times", () => {
    const { result } = renderHook(() => useCounter());

    const n = 5;

    for (let i = 0; i < n; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.count).toBe(n);
  });

  it("should update val and increment by new val", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.setVal(10);
    });

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(10);
  });

  it("should increment by updated val multiple times", () => {
    const { result } = renderHook(() => useCounter());

    const val = 2;
    const n = 2;

    act(() => {
      result.current.setVal(val);
    });

    for (let i = 0; i < n; i++) {
      act(() => {
        result.current.increment();
      });
    }

    expect(result.current.count).toBe(val * n);
  });

  it("should handle zero val", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.setVal(0);
    });

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(0);
  });
});
