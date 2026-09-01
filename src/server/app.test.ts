import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";
import { createStudyContext } from "./context";

async function fixtureContext() {
  return createStudyContext(path.resolve("tests/fixtures/corpus"));
}

describe("study API", () => {
  it("returns visual-only search results with stable URLs", async () => {
    const app = createApp(await fixtureContext());
    const response = await app.request(
      "/api/search?q=quadratic&type=explainer&visualKind=function-plot&course=SF1690",
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      results: [
        {
          id: "explainer:sf1690:quadratic-coefficients",
          url: "/visuals/quadratic-coefficients",
        },
      ],
    });
  });

  it("returns conic-section visuals through the public search schema", async () => {
    const app = createApp(await fixtureContext());
    const response = await app.request(
      "/api/search?q=focal&type=explainer&visualKind=conic-section&course=SF1690",
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      results: [
        {
          id: "explainer:sf1690:parabola-focus-directrix",
          visualKind: "conic-section",
          url: "/visuals/parabola-focus-directrix",
        },
      ],
    });
  });

  it("returns up to five recent items when the query is empty", async () => {
    const app = createApp(await fixtureContext());
    const response = await app.request("/api/search?type=explainer");

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.results.length).toBeGreaterThan(0);
    expect(payload.results.length).toBeLessThanOrEqual(5);
    expect(payload.results.every((hit: { entityType: string }) => hit.entityType === "explainer")).toBe(true);
  });

  it("returns every visual with stable atlas numbers", async () => {
    const app = createApp(await fixtureContext());
    const response = await app.request("/api/visuals");

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.items).toHaveLength(2);
    expect(payload.items[0]).toMatchObject({
      figureNumber: 1,
      courseCode: "SF1690",
      explainer: {
        id: "explainer:sf1690:quadratic-coefficients",
        atlasOrder: 1,
        },
    });
  });

  it("returns 404 for unknown concepts", async () => {
    const app = createApp(await fixtureContext());
    expect(
      (
        await app.request(
          "/api/concepts/concept%3Asf1690%3Amissing",
        )
      ).status,
    ).toBe(404);
  });

  it("does not serve the study app for discovery metadata", async () => {
    const app = createApp(await fixtureContext());
    const response = await app.request("/.well-known/oauth-protected-resource/mcp");

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe("");
  });

  it("serves the exact OpenAI verification token only in production mode", async () => {
    const app = createApp(await fixtureContext(), undefined, {
      publicOrigin: "https://kth-study.vercel.app",
      verificationToken: "test-challenge-token",
    });

    const response = await app.request("/.well-known/openai-apps-challenge");
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe("test-challenge-token");
    expect((await app.request("/api/asks")).status).toBe(404);
  });

  it("returns worked examples and self-checks for a concept", async () => {
    const app = createApp(await fixtureContext());
    const response = await app.request(
      "/api/concepts/concept%3Asf1690%3Aquadratic-functions",
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      examples: [{ id: "example:sf1690:quadratic-evaluation" }],
      questions: [{ id: "question:sf1690:quadratic-shape" }],
    });
  });

  it("returns course concepts in the declared spine order", async () => {
    const context = await fixtureContext();
    const original = context.corpus.concepts.get(
      "concept:sf1690:quadratic-functions",
    )!;
    const second = {
      ...original,
      id: "concept:sf1690:second",
      slug: "second",
      title: "Second concept",
    };
    context.corpus.concepts.set(second.id, second);
    context.corpus.courses.get("course:sf1690")!.conceptIds = [
      second.id,
      original.id,
    ];

    const app = createApp(context);
    const response = await app.request("/api/courses/SF1690");

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.concepts.map((concept: { id: string }) => concept.id)).toEqual([
      second.id,
      original.id,
    ]);
  });

  it("returns the source-traceable course dossier", async () => {
    const app = createApp(await fixtureContext());
    const response = await app.request("/api/courses/SF1690");

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.course).toMatchObject({ credits: 6, language: "English" });
    expect(payload.assessments).toEqual([
      expect.objectContaining({ id: "assessment:sf1690:ten1" }),
    ]);
    expect(payload.assessments[0]).not.toHaveProperty("date");
    expect(payload.sessions.map((item: { id: string }) => item.id)).toEqual([
      "session:sf1690:lecture-01",
      "session:sf1690:exercise-01",
    ]);
    expect(payload.coursework).toEqual([
      expect.objectContaining({ id: "coursework:sf1690:exercise-01" }),
    ]);
    expect(payload.journey[0]).toMatchObject({ week: 35 });
    expect(payload.sources[0]).not.toHaveProperty("originalPath");
    expect(payload.sources[0]).not.toHaveProperty("extractedTextPath");
    expect(payload.sources[0]).not.toHaveProperty("extractedText");
  });

  it("serves the built study app for stable page routes", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "kth-static-app-"));
    await fs.cp(path.resolve("tests/fixtures/corpus"), root, { recursive: true });
    await fs.mkdir(path.join(root, "dist"));
    await fs.writeFile(
      path.join(root, "dist/index.html"),
      "<!doctype html><title>KTH Study test app</title>",
    );
    const app = createApp(await createStudyContext(root));

    const response = await app.request("/visuals/quadratic-coefficients");
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain("KTH Study test app");
  });
});
