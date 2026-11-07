import "server-only";

export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  ms: number,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch (error) {
    if (ctrl.signal.aborted) throw new Error(`Request timed out after ${ms}ms`);
    throw error;
  } finally {
    clearTimeout(t);
  }
}
