import type { CSSProperties } from "react";

type LiquidRangeStyle = CSSProperties & {
  "--range-progress": string;
};

export function liquidRangeStyle(
  value: number,
  min: number,
  max: number,
): LiquidRangeStyle {
  const span = max - min;
  const raw = span > 0 ? ((value - min) / span) * 100 : 0;
  const progress = Math.min(100, Math.max(0, raw));
  return {
    "--range-progress": `${Number(progress.toFixed(3))}%`,
  };
}
