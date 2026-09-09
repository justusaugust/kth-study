import { useEffect, useState } from "react";

export interface SvgTooltipData {
  x: number;
  y: number;
  label: string;
  detail: string;
  width?: number;
  height?: number;
}

export function SvgTooltip({ data }: { data?: SvgTooltipData }) {
  const [previous, setPrevious] = useState(data);
  useEffect(() => { if (data) setPrevious(data); }, [data]);
  const content = data ?? previous;
  return (
    <foreignObject
      className={`diagram-hover-label${data ? " is-visible" : ""}`}
      x={content?.x ?? 0}
      y={content?.y ?? 0}
      width={content?.width ?? 210}
      height={content?.height ?? 70}
      aria-hidden="true"
    >
      <span className="diagram-tooltip">
        <strong>{content?.label}</strong>
        <span>{content?.detail}</span>
      </span>
    </foreignObject>
  );
}
