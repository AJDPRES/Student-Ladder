"use client";

import type { SVGProps } from "react";

type SearchIconProps = SVGProps<SVGSVGElement>;

export default function SearchIcon({ className, ...rest }: SearchIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      className={className}
      {...rest}
    >
      <path
        d="M11.1 3C15.5712 3 19.2 6.6288 19.2 11.1C19.2 15.5712 15.5712 19.2 11.1 19.2C6.6288 19.2 3 15.5712 3 11.1C3 6.6288 6.6288 3 11.1 3ZM11.1 17.4C14.5803 17.4 17.4 14.5803 17.4 11.1C17.4 7.6188 14.5803 4.8 11.1 4.8C7.6188 4.8 4.8 7.6188 4.8 11.1C4.8 14.5803 7.6188 17.4 11.1 17.4ZM18.7365 17.4639L21.2826 20.0091L20.0091 21.2826L17.4639 18.7365L18.7365 17.4639Z"
        fill="currentColor"
      />
    </svg>
  );
}
