import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

// False while the server builds the HTML, true once the browser has the page.
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
