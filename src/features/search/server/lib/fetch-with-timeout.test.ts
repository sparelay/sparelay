import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithTimeout } from "./fetch-with-timeout";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("fetchWithTimeout", () => {
  it("returns the response when it completes in time", async () => {
    const response = new Response("ok");
    const fetchMock = vi.fn(async () => response);
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchWithTimeout("https://example.com", {}, 1000)).resolves.toBe(response);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("aborts the request after the timeout", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const pending = fetchWithTimeout("https://example.com", {}, 100);
    const assertion = expect(pending).rejects.toThrow("Request timed out after 100ms");
    await vi.advanceTimersByTimeAsync(100);
    await assertion;
  });
});
