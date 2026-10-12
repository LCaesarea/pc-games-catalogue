import { useMemo, useSyncExternalStore } from "react";

const KEY = "pc-games-wishlist";
const EVENT = "wishlist-changed";

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function readServer(): string | null {
  return null;
}

function parse(raw: string | null): string[] | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

// slugs is null on the server and during the first render in the browser.
export function useWishlist() {
  const raw = useSyncExternalStore<string | null>(subscribe, readRaw, readServer);
  const slugs = useMemo(() => parse(raw), [raw]);

  function toggle(slug: string): void {
    const current = parse(readRaw()) ?? [];
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage is unavailable (private mode or blocked), so the save is skipped.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return { slugs, toggle };
}
