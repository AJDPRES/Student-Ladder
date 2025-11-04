"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type RegistryEntry = { close: () => void };

const registry = new Set<RegistryEntry>();

export function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const entryRef = useRef<RegistryEntry>({ close });
  entryRef.current.close = close;

  useEffect(() => {
    const entry = entryRef.current;
    registry.add(entry);
    return () => {
      registry.delete(entry);
    };
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) {
        registry.forEach((entry) => {
          if (entry !== entryRef.current) {
            entry.close();
          }
        });
        return true;
      }
      return false;
    });
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [close]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return { open, toggle, close, ref };
}
