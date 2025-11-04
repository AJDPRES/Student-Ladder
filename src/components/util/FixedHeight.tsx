import type { ReactNode } from "react";

type FixedHeightProps = {
  children: ReactNode;
  h?: number;
  className?: string;
  responsive?: boolean;
};

export default function FixedHeight({
  children,
  h = 740,
  className,
  responsive = true,
}: FixedHeightProps) {
  const base = responsive ? `min-h-[${h}px] md:h-[${h}px]` : `h-[${h}px]`;
  const classes = ["relative", base, "box-border", className]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
