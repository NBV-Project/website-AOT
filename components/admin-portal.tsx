"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function AdminPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => {
      clearTimeout(timeout);
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
