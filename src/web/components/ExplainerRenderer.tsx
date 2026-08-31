import type { ComponentType } from "react";
import type {
  ExplainerSpec,
  FunctionPlotExplainer,
} from "../../domain/schemas";
import {
  FunctionPlot,
  type RendererProps,
} from "../renderers/FunctionPlot";
import { ConceptDiagram } from "./ConceptDiagram";
import { ConicDiagram } from "./ConicDiagram";
import { SystemsDiagram } from "./SystemsDiagram";

const renderers = {
  "function-plot": FunctionPlot,
} satisfies Partial<Record<ExplainerSpec["kind"], ComponentType<RendererProps<FunctionPlotExplainer>>>>;

interface Props {
  spec: ExplainerSpec;
  mode: "preview" | "full";
}

export function ExplainerRenderer({ spec, mode }: Props) {
  if (spec.kind === "number-line") {
    return <ConceptDiagram mode={mode} slug={spec.variant === "interval" ? "real-numbers-and-lines" : "absolute-value"} />;
  }
  if (spec.kind === "coordinate-plane") {
    return <ConceptDiagram mode={mode} slug={spec.variant === "distance-circle" ? "cartesian-distance-circles" : "lines-and-slopes"} />;
  }
  if (spec.kind === "systems-diagram") {
    return <SystemsDiagram mode={mode} variant={spec.variant} />;
  }
  if (spec.kind === "conic-section") {
    return <ConicDiagram mode={mode} variant={spec.variant} />;
  }
  const Renderer = (
    renderers as Partial<
      Record<string, ComponentType<RendererProps<FunctionPlotExplainer>>>
    >
  )[spec.kind];

  if (!Renderer) {
    return (
      <figure className="explainer-fallback">
        <p>{spec.accessibleSummary}</p>
        <figcaption>{spec.caption}</figcaption>
      </figure>
    );
  }
  return <Renderer spec={spec} mode={mode} />;
}
