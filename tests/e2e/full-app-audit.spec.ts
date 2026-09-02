import { expect, test } from "@playwright/test";

test("every current Study Hub route renders without runtime or layout failures", async ({
  page,
  request,
}) => {
  test.setTimeout(120_000);

  const routeSet = new Set(["/", "/search", "/visuals"]);
  for (const code of ["sf1690", "ie1204", "ii1308"]) {
    const response = await request.get(`/api/courses/${code}`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    routeSet.add(`/courses/${code}`);
    for (const lecture of data.lectures) {
      routeSet.add(`/courses/${code}/lectures/${lecture.slug}`);
    }
    for (const concept of data.concepts) {
      routeSet.add(`/courses/${code}/concepts/${concept.slug}`);
    }
  }

  const atlasResponse = await request.get("/api/visuals");
  expect(atlasResponse.ok()).toBe(true);
  const atlas = await atlasResponse.json();
  for (const item of atlas.items) routeSet.add(`/visuals/${item.explainer.slug}`);
  for (const type of [
    "course",
    "lecture",
    "concept",
    "definition",
    "example",
    "question",
  ]) {
    routeSet.add(`/search?q=domain&type=${type}`);
  }

  const pageErrors: string[] = [];
  const failedResponses: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of routeSet) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main").getByRole("alert")).toHaveCount(0);

    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      emptyLinks: [...document.querySelectorAll<HTMLAnchorElement>("a")]
        .filter((link) => !link.getAttribute("href"))
        .map((link) => link.textContent?.trim() ?? ""),
      failedImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    }));

    expect(layout.overflow, route).toBe(0);
    expect(layout.emptyLinks, route).toEqual([]);
    expect(layout.failedImages, route).toEqual([]);
  }

  expect(pageErrors).toEqual([]);
  expect(failedResponses).toEqual([]);
});
