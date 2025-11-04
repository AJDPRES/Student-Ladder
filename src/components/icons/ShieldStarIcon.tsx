import type { SVGProps } from "react";

type ShieldStarIconProps = SVGProps<SVGSVGElement>;

export default function ShieldStarIcon(props: ShieldStarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 3L5 5v7.5C5 16.28 8.14 19.35 12 20c3.86-.65 7-3.72 7-7.5V5l-7-2Zm0 14.5C9.24 17 7 14.76 7 12V6.5L12 5l5 1.5V12c0 2.76-2.24 5-5 5.5Zm2.24-8.39L12 8l-2.24 1.11-1.12 2.24 1.12 2.24L12 14.7l2.24-1.11 1.12-2.24-1.12-2.24ZM12 12.88l-.905-.45-.445-.905.445-.905L12 10.175l.905.445.445.905-.445.905-.905.45Z"
        fill="currentColor"
      />
    </svg>
  );
}
