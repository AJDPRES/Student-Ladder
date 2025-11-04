"use client";

import { ReactNode, useCallback } from "react";

import { useDropdown } from "./useDropdown";

type DropdownProps = {
  id: string;
  label: string;
  children: ReactNode;
};

export default function Dropdown({ id, label, children }: DropdownProps) {
  const dropdownId = `menu-${id}`;
  const { open, toggle, close, ref } = useDropdown();

  const handlePanelClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('a, button')) {
        close();
      }
    },
    [close],
  );

  return (
    <div className="site-nav__dropdown" ref={ref}>
      <button
        type="button"
        className="site-nav__dropdown-trigger"
        aria-expanded={open}
        aria-controls={dropdownId}
        aria-haspopup="menu"
        onClick={toggle}
      >
        {label}
        <span aria-hidden="true">▾</span>
      </button>
      <div
        id={dropdownId}
        className="site-nav__dropdown-panel"
        role="menu"
        hidden={!open}
        onClick={handlePanelClick}
      >
        {children}
      </div>
    </div>
  );
}
