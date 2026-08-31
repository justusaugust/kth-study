export interface SvgTooltipData {
  x: number;
  y: number;
  label: string;
  detail: string;
  width?: number;
  height?: number;
}

export function SvgTooltip({
  x,
  y,
  label,
  detail,
  width = 210,
  height = 70,
}: SvgTooltipData) {
  return (
    <foreignObject
      className="diagram-hover-label is-visible"
      x={x}
      y={y}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <span className="diagram-tooltip">
        <strong>{label}</strong>
        <span>{detail}</span>
      </span>
    </foreignObject>
  );
}
