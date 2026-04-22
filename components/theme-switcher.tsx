"use client";

import { useEffect, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("local-theme-change", callback);
  return () => window.removeEventListener("local-theme-change", callback);
}

function getSnapshot(): "cool" | "gold" {
  return (localStorage.getItem("preferred-theme") as "cool" | "gold") ?? "cool";
}

function getServerSnapshot(): "cool" | "gold" {
  return "cool";
}

export function ThemeSwitcher() {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (theme === "gold") {
      document.documentElement.setAttribute("data-theme", "gold");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [theme]);

  function toggleTheme() {
    const newTheme = theme === "cool" ? "gold" : "cool";
    localStorage.setItem("preferred-theme", newTheme);
    window.dispatchEvent(new Event("local-theme-change"));
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:bg-white/14 shrink-0"
      title={!hydrated ? "Theme Switcher" : theme === "cool" ? "Switch to Warm Gold Theme" : "Switch to Cool Navy Theme"}
      suppressHydrationWarning
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      </svg>
    </button>
  );
}
