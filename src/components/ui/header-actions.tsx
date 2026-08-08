"use client";

import { PalettePicker } from "./palette-picker";
import { ThemeToggle } from "./theme-toggle";

/** Shared home/gallery header controls: palette preview + light/dark. */
export function HeaderActions() {
  return (
    <div className="flex items-center gap-2.5">
      <PalettePicker />
      <ThemeToggle />
    </div>
  );
}
