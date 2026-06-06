import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is narrower than `breakpoint` (default 768px).
 * Starts at false on the server and the initial client render so SSR and
 * hydration agree; updates after mount via a resize listener.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
