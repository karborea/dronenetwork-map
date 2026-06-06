"use client";

import { useState } from "react";
import { Icon, type IconName } from "../icon";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: IconName;
  type?: string;
  ariaLabel?: string;
}

/**
 * Brand text input with optional leading icon and a 3px iris focus ring.
 */
export function TextInput({
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  ariaLabel,
}: TextInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <div className="relative flex items-center">
      {icon && (
        <span
          aria-hidden="true"
          className="absolute left-[13px] flex"
          style={{ color: "var(--fg3)" }}
        >
          <Icon name={icon} size={16} />
        </span>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={`w-full rounded-lg border bg-white py-3 font-[family-name:var(--font-body)] text-[15px] text-ink outline-none transition-all duration-150 ${
          icon ? "pl-[40px] pr-[14px]" : "px-[14px]"
        } ${
          focus
            ? "border-iris shadow-[0_0_0_3px_var(--color-iris-100)]"
            : "border-[color:var(--border-strong)]"
        }`}
      />
    </div>
  );
}
