import { expect, test } from "@playwright/test";

test("all lecture and exam readers keep math and graphs contained on phones", async ({ page, request }) => {
  test.setTimeout(180_000);
  const routes = ["/courses/sf1690/exam", "/courses/ie1204/exam", "/courses/sf1690/concepts/course-review"];
  for (const code of ["sf1690", "ie1204", "ii1308"]) {
    const response = await request.get(`/api/courses/${code}`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    routes.push(...data.lectures.map((lecture: { slug: string }) => `/courses/${code}/lectures/${lecture.slug}`));
  }
  await page.setViewportSize({ width: 375, height: 900 });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("main h1")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      errors: document.querySelectorAll(".katex-error").length,
      badScripts: [...document.querySelectorAll<HTMLElement>(".katex .sizing.reset-size6.size3")].filter((node) =>
        Math.abs(parseFloat(getComputedStyle(node).fontSize) / parseFloat(getComputedStyle(node.parentElement!).fontSize) - 0.7) > 0.02,
      ).length,
      clippedMath: [...document.querySelectorAll<HTMLElement>(".katex-display")].filter((node) =>
        node.scrollWidth > node.clientWidth + 1 && !["auto", "scroll"].includes(getComputedStyle(node).overflowX),
      ).length,
      wideGraphs: [...document.querySelectorAll<SVGElement>("main svg")].filter((node) => !node.closest(".katex") && node.getBoundingClientRect().right > innerWidth + 1).length,
    }));
    expect(geometry, route).toEqual({ overflow: 0, errors: 0, badScripts: 0, clippedMath: 0, wideGraphs: 0 });
  }
});

test("guide picker and direct links reach sections and open sources", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/courses/sf1690/exam#guide-vector-geometry-lectures-12-15");
  const heading = page.getByRole("heading", { name: "Vector geometry · Lectures 12–15", exact: true });
  await expect(heading).toBeInViewport();
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Sources and dates", exact: true }).click();
  await expect(page.locator("#guide-sources")).toHaveAttribute("open", "");
  await expect(page.locator("#guide-sources")).toBeInViewport();
});
