"use client";

import type { ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

/**
 * Brand chip — pill-shaped toggle used in the FilterBar's specialty row.
 * Active: iris fill, white text. Inactive: transparent, ink text, paper hover.
 */
export function Chip({ children, active = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer whitespace-nowrap rounded-full border px-[15px] py-2 font-[family-name:var(--font-display)] text-xs font-medium uppercase tracking-[.08em] transition-all duration-150 ${
        active
          ? "border-iris bg-iris text-white"
          : "border-[color:var(--border-strong)] bg-transparent text-ink hover:bg-mist"
      }`}
    >
      {children}
    </button>
  );
}
