import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { ExplainerSpec } from "../../domain/schemas";
import type { VisualAtlasResponse } from "../../domain/api";
import { getVisualAtlas } from "../api";
import { AtlasSelect, type AtlasSelectOption } from "../components/AtlasSelect";
import { ExplainerRenderer } from "../components/ExplainerRenderer";
import { StudyIcon } from "../components/StudyMark";

type VisualKind = ExplainerSpec["kind"];

const visualKinds: ReadonlyArray<{ value: VisualKind; label: string }> = [
  { value: "function-plot", label: "Function plots" },
  { value: "number-line", label: "Number lines" },
  { value: "coordinate-plane", label: "Coordinate planes" },
  { value: "systems-diagram", label: "Systems diagrams" },
  { value: "conic-section", label: "Conic sections" },
];

const kindOptions: AtlasSelectOption[] = [
  { value: "", label: "All forms" },
  ...visualKinds.map((item) => ({ value: item.value, label: item.label })),
];

function kindLabel(kind: VisualKind) {
  return visualKinds.find((item) => item.value === kind)?.label ?? kind;
}

export function VisualAtlasPage() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState<VisualAtlasResponse>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [visibleCount, setVisibleCount] = useState(10);
  const query = params.get("q") ?? "";
  const course = params.get("course") ?? "";
  const kind = params.get("kind") ?? "";

  useEffect(() => {
    let active = true;
    getVisualAtlas()
      .then((response) => {
        if (!active) return;
        setData(response);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  const courses = useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of data?.items ?? []) seen.set(item.courseCode, item.courseTitle);
    return [...seen].map(([code, title]) => ({ code, title }));
  }, [data]);

  const courseOptions = useMemo<AtlasSelectOption[]>(
    () => [
      { value: "", label: "All courses" },
      ...courses.map((item) => ({
        value: item.code,
        label: item.code,
        detail: item.title,
      })),
    ],
    [courses],
  );

  useEffect(() => {
    if (status !== "ready") return;
    const validCourse = !course || courses.some((item) => item.code === course);
    const validKind = !kind || visualKinds.some((item) => item.value === kind);
    if (validCourse && validKind) return;
    const next = new URLSearchParams(params);
    if (!validCourse) next.delete("course");
    if (!validKind) next.delete("kind");
    setParams(next, { replace: true });
  }, [course, courses, kind, params, setParams, status]);

  const items = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return (data?.items ?? []).filter((item) => {
      if (course && item.courseCode !== course) return false;
      if (kind && item.explainer.kind !== kind) return false;
      if (!needle) return true;
      return [
        item.explainer.title,
        item.explainer.caption,
        item.explainer.accessibleSummary,
        item.courseCode,
        item.courseTitle,
      ].some((value) => value.toLocaleLowerCase().includes(needle));
    });
  }, [course, data, kind, query]);

  useEffect(() => setVisibleCount(10), [course, kind, query]);

  function updateParam(name: "q" | "course" | "kind", value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next, { replace: true });
  }

  return (
    <section className="visual-atlas-page page-column" aria-labelledby="visual-atlas-title">
      <header className="atlas-intro">
        <p className="search-eyebrow">Interactive figures</p>
        <h1 id="visual-atlas-title">Visual atlas</h1>
        <p className="lead">
          Interactive models for the spatial, structural, and procedural ideas in the curriculum.
        </p>
      </header>

      <div className="atlas-toolbar" aria-label="Visual atlas filters">
        <label className="atlas-query">
          <span>Find a visual</span>
          <span className="atlas-input-shell">
            <StudyIcon kind="search" />
            <input
              type="search"
              value={query}
              placeholder="Try “distance”, “binary”, or “parabola”"
              onChange={(event) => updateParam("q", event.target.value)}
            />
          </span>
        </label>
        <AtlasSelect
          label="Course"
          value={course}
          options={courseOptions}
          onChange={(next) => updateParam("course", next)}
        />
        <AtlasSelect
          label="Visual form"
          value={kind}
          options={kindOptions}
          onChange={(next) => updateParam("kind", next)}
        />
      </div>

      {status === "loading" ? <p className="loading">Opening the atlas…</p> : null}
      {status === "error" ? <p role="alert">Unable to load the visual atlas. Try again in a moment.</p> : null}
      {status === "ready" && items.length === 0 ? (
        <p className="empty-state">No visuals match these filters. Clear a filter or try another search.</p>
      ) : null}
      {status === "ready" && items.length ? <p className="atlas-count">{items.length} {items.length === 1 ? "visual" : "visuals"}</p> : null}

      <ol className="atlas-register">
        {items.slice(0, visibleCount).map((item) => (
          <li key={item.explainer.id} data-figure={item.figureNumber}>
            <header className="atlas-entry-heading">
              <span className="atlas-figure-code">Fig. {String(item.figureNumber).padStart(2, "0")}</span>
              <div>
                <p>{item.courseCode} · {kindLabel(item.explainer.kind)}</p>
                <h2>
                  <Link to={`/visuals/${item.explainer.slug}`}>{item.explainer.title}</Link>
                </h2>
              </div>
            </header>
            <p className="atlas-entry-summary">{item.explainer.accessibleSummary}</p>
            <div className="atlas-entry-preview">
              <ExplainerRenderer spec={item.explainer} mode="preview" />
            </div>
            <Link className="atlas-entry-open" to={`/visuals/${item.explainer.slug}`}>Open interactive visual</Link>
          </li>
        ))}
      </ol>
      {visibleCount < items.length ? (
        <button className="show-more" type="button" onClick={() => setVisibleCount((count) => count + 10)}>Show 10 more</button>
      ) : null}
    </section>
  );
}
