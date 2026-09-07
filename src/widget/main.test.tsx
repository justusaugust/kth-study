import { act, fireEvent, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, it, vi } from "vitest";
import spec from "../../tests/fixtures/corpus/courses/2026-27/P1/SF1690/explainers/quadratic-coefficients.json";

const bridge = vi.hoisted(() => ({ ontoolresult: (_result: unknown) => {}, getHostContext: () => ({}) }));
vi.mock("@modelcontextprotocol/ext-apps/react", () => ({
  useApp: ({ onAppCreated }: { onAppCreated: (app: typeof bridge) => void }) => {
    onAppCreated(bridge);
    return { app: bridge };
  },
  useHostStyles: () => {},
}));
vi.mock("../web/components/ExplainerRenderer", () => ({
  ExplainerRenderer: () => {
    const [value, setValue] = useState(1);
    return <button onClick={() => setValue(value + 1)}>Coefficient {value}</button>;
  },
}));

it("retains the bridge visual on unrelated host globals and resets controls for a different visual", async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await act(async () => { await import("./main"); });
  const content = { id: spec.id, url: "/visuals/quadratic-coefficients", explainer: spec };
  act(() => bridge.ontoolresult({ structuredContent: content }));
  fireEvent.click(screen.getByRole("button", { name: "Coefficient 1" }));
  act(() => window.dispatchEvent(new Event("openai:set_globals")));
  expect(screen.getByRole("heading", { name: spec.title })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Coefficient 2" })).toBeInTheDocument();
  act(() => bridge.ontoolresult({ structuredContent: { ...content, id: "explainer:sf1690:another-visual" } }));
  expect(screen.getByRole("button", { name: "Coefficient 1" })).toBeInTheDocument();
});
