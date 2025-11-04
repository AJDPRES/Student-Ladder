import type { ReactNode } from "react";

type FixedWidthProps = {
  children: ReactNode;
  width?: number;
  className?: string;
};

export default function FixedWidth({ children, width = 740, className }: FixedWidthProps) {
  const classes = ["box-content flex-none", `w-[${width}px]`, className]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
