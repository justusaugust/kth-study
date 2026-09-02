import { expect, test } from "@playwright/test";

test("the home search icon is optically centred inside its input", async ({
  page,
}) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const icon = await page.locator(".home-search .search-field-icon").boundingBox();
    const input = await page.locator(".home-search .global-search").boundingBox();
    expect(icon).not.toBeNull();
    expect(input).not.toBeNull();

    const iconCentre = icon!.y + icon!.height / 2;
    const inputCentre = input!.y + input!.height / 2;
    expect(Math.abs(iconCentre - inputCentre)).toBeLessThanOrEqual(1);
  }
});

test("the full search taxonomy stays on one desktop row", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/search?type=example");

  const filters = page.locator(".search-page .search-filter-row button");
  await expect(filters).toHaveCount(8);
  const tops = await filters.evaluateAll((buttons) =>
    buttons.map((button) => Math.round(button.getBoundingClientRect().top)),
  );

  expect(new Set(tops).size).toBe(1);
});

test("numbered section markers stay vertically centred with their headings", async ({
  page,
}) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/courses/sf1690/concepts/absolute-value");
    await expect(
      page.getByRole("heading", { name: "Key definitions" }),
    ).toBeVisible();

    const centreDeltas = await page.locator(".registered").evaluateAll((sections) =>
      sections.flatMap((section) => {
        const marker = section.querySelector(":scope > .section-marker");
        const heading = section.querySelector(":scope > h2");
        if (!marker || !heading) return [];
        const markerBox = marker.getBoundingClientRect();
        const headingBox = heading.getBoundingClientRect();
        return [
          Math.abs(
            markerBox.y + markerBox.height / 2 -
              (headingBox.y + headingBox.height / 2),
          ),
        ];
      }),
    );

    expect(centreDeltas.length).toBeGreaterThan(0);
    expect(Math.max(...centreDeltas)).toBeLessThanOrEqual(1);
  }
});

test("Fig. 09 is adjustable directly in the visual atlas", async ({ page }) => {
  await page.goto("/visuals?q=quadratic");

  const result = page
    .getByRole("link", { name: "How coefficients move a parabola" })
    .locator("xpath=ancestor::li");
  await expect(result.getByText("Fig. 09")).toBeVisible();
  const coefficientA = result.getByRole("slider", { name: "Coefficient a" });

  await expect(coefficientA).toHaveValue("1");
  await coefficientA.focus();
  await page.keyboard.press("ArrowRight");
  await expect(coefficientA).toHaveValue("1.25");
  await expect(result.locator(".coefficient-controls output").first()).toHaveText(
    "1.25",
  );

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/visuals?q=quadratic");
  await expect(
    page.getByRole("slider", { name: "Coefficient a" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBe(0);
});

test("visual-atlas tab indicators finish with rounded ends", async ({ page }) => {
  await page.goto("/visuals?q=execution");

  const activeTab = page.getByRole("tab", { name: "Sequence" });
  await expect(activeTab).toBeVisible();

  const indicator = await activeTab.evaluate((element) => {
    const style = getComputedStyle(element, "::after");
    return {
      borderRadius: style.borderRadius,
      height: style.height,
    };
  });

  expect(indicator).toEqual({ borderRadius: "999px", height: "3px" });
});

test("visual search reaches the explainer, concept, and course", async ({
  page,
}) => {
  await page.goto("/visuals?q=quadratic");
  await page.getByRole("link", { name: "How coefficients move a parabola" }).click();
  await expect(page).toHaveURL(/\/visuals\/quadratic-coefficients$/);
  await expect(
    page.getByRole("heading", { name: "How coefficients move a parabola" }),
  ).toBeVisible();

  const coefficientA = page.getByRole("slider", { name: "Coefficient a" });
  await expect(coefficientA).toHaveValue("1");
  await coefficientA.focus();
  await page.keyboard.press("ArrowRight");
  await expect(coefficientA).toHaveValue("1.25");

  await page.getByRole("link", { name: "Read Quadratic functions" }).click();
  await expect(page).toHaveURL(
    /\/courses\/sf1690\/concepts\/quadratic-functions$/,
  );
  await page.getByRole("link", { name: "SF1690" }).first().click();
  await expect(page).toHaveURL(/\/courses\/sf1690$/);
});

test("visual atlas filters preserve figure identity and semantic focus labels", async ({
  page,
}) => {
  await page.goto("/visuals");
  await expect(page.locator(".atlas-register > li")).toHaveCount(22);
  await expect(page.locator(".atlas-count")).toHaveCount(0);
  const toolbar = await page.locator(".atlas-toolbar").boundingBox();
  expect(toolbar).not.toBeNull();
  expect(Math.round(toolbar!.height)).toBeLessThanOrEqual(104);

  await page.getByRole("combobox", { name: /^Course/ }).click();
  const optionHeights = await page.getByRole("option").evaluateAll((options) =>
    options.map((option) => Math.round(option.getBoundingClientRect().height)),
  );
  expect(new Set(optionHeights).size).toBe(1);
  expect(optionHeights[0]).toBeGreaterThanOrEqual(52);
  const optionGaps = await page.getByRole("option").evaluateAll((options) =>
    options.slice(1).map((option, index) => {
      const previous = options[index].getBoundingClientRect();
      const current = option.getBoundingClientRect();
      return Math.round(current.top - previous.bottom);
    }),
  );
  expect(Math.min(...optionGaps)).toBeGreaterThanOrEqual(4);
  await page
    .getByRole("option", { name: /SF1690.*Basic Course in Mathematics/ })
    .click();
  await expect(page.locator(".atlas-register > li")).toHaveCount(13);
  await expect(page.locator(".atlas-register > li").first()).toContainText("Fig. 05");

  const focus = page.getByRole("img", { name: /Focus F₁ at/ }).first();
  await focus.focus();
  await expect(page.locator(".conic-stage > .diagram-hover-label.is-visible").first()).toHaveCSS(
    "opacity",
    "1",
  );
});

test("quick search suggestions open their lecture routes", async ({ page }) => {
  await page.goto("/courses/ie1204");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("searchbox", { name: "Search all courses" }).fill("IE1204");
  const lecture = page.getByRole("option", {
    name: /Lecture 3 — logic levels, CMOS gates, and power/i,
  });

  await expect(lecture).toHaveAttribute(
    "href",
    "/courses/ie1204/lectures/2026-08-31-03",
  );
  await lecture.click();
  await expect(page).toHaveURL(/\/courses\/ie1204\/lectures\/2026-08-31-03$/);
});

test("today's IE1204 lecture connects Boolean forms to the assigned work", async ({
  page,
}) => {
  await page.goto("/courses/ie1204/lectures/2026-09-01-05");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Lecture 5 — truth tables and Boolean algebra",
    }),
  ).toBeVisible();
  await expect(page.locator("details.lecture-concept")).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: "Open Exercise 2 submission in Canvas" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download Exercise 2 worksheet" }),
  ).toBeVisible();

  const booleanSection = page.locator("details.lecture-concept").filter({
    hasText: "Boolean equations and algebra",
  });
  await booleanSection.locator("summary").click();
  await booleanSection.getByRole("button", { name: /A 1, B 1, output 1/i }).click();
  await expect(page.locator(".boolean-equations__result strong")).toHaveText("A ⊕ B");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBe(0);
});

test("mobile navigation stays available without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/visuals/quadratic-coefficients");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Visual atlas" })).toBeVisible();
  await expect(page.getByRole("link", { name: "SF1690" }).first()).toBeVisible();

  const search = page.getByRole("button", { name: "Search" });
  await search.click();
  const searchbox = page.getByRole("searchbox", {
    name: "Search all courses",
  });
  await expect(searchbox).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Primary" })).not.toBeVisible();
  expect(
    await page.locator(".header-search-mode").evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        position: getComputedStyle(element).position,
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      };
    }),
  ).toEqual({ position: "fixed", width: 375, height: 812 });
  expect(
    await searchbox.evaluate((element) =>
      parseFloat(getComputedStyle(element).fontSize),
    ),
  ).toBeGreaterThanOrEqual(16);
  await page.keyboard.press("Escape");
  await expect(search).toBeFocused();

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(horizontalOverflow).toBe(0);
});

test("mobile number-line diagrams use the full figure width", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/courses/sf1690/concepts/absolute-value");

  const frame = await page.locator(".figure-frame").boundingBox();
  const stage = await page.locator(".diagram-stage--number-line").boundingBox();
  expect(frame).not.toBeNull();
  expect(stage).not.toBeNull();
  expect(stage!.width).toBeGreaterThanOrEqual(frame!.width - 1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBe(0);

  await page.goto("/visuals/absolute-value-distance");
  const visualFrame = await page.locator(".visual-page > .concept-diagram").boundingBox();
  const visualStage = await page.locator(".diagram-stage--number-line").boundingBox();
  expect(visualFrame).not.toBeNull();
  expect(visualStage).not.toBeNull();
  expect(visualStage!.width).toBeGreaterThanOrEqual(visualFrame!.width - 1);
});

test("Lecture 1 diagrams respond to dragging, keyboard input, and reset", async ({
  page,
}) => {
  await page.goto("/visuals/cartesian-distance-circle");

  const readout = page.locator(".diagram-readout");
  const initialReadout = await readout.textContent();
  const hitTarget = page.locator(".diagram-hit").first();
  await hitTarget.scrollIntoViewIfNeeded();
  const box = await hitTarget.boundingBox();
  expect(box).not.toBeNull();

  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 + 60, box!.y + box!.height / 2 - 24, {
    steps: 8,
  });
  await page.mouse.up();
  expect(await readout.textContent()).not.toBe(initialReadout);

  await page.getByRole("button", { name: "Reset values" }).click();
  expect(await readout.textContent()).toBe(initialReadout);

  const pointX = page.getByRole("slider", { name: "P x-coordinate" });
  await pointX.focus();
  await page.keyboard.press("ArrowRight");
  await expect(pointX).toHaveValue("-0.5");

  await page.goto("/visuals/real-number-intervals");
  await page.getByRole("button", { name: "Include endpoint a" }).click();
  await expect(page.locator(".diagram-readout strong")).toHaveText("[-2, 3]");
});

test("Lecture 2 conic constructions remain mathematically interactive", async ({
  page,
}) => {
  await page.goto("/visuals/parabola-focus-directrix");
  await page.getByRole("slider", { name: "Focus distance p" }).fill("2");
  await page.getByRole("slider", { name: "Point x-coordinate" }).fill("4");
  await expect(page.getByText("PF = 4")).toBeVisible();
  await expect(page.getByText("PQ = 4")).toBeVisible();

  await page.goto("/visuals/ellipse-distance-sum");
  await page.getByRole("slider", { name: "Semimajor axis a" }).fill("5");
  await page.getByRole("slider", { name: "Semiminor axis b" }).fill("3");
  await page.getByRole("slider", { name: "Point angle" }).fill("90");
  await expect(page.getByText("PF₁ + PF₂ = 10 = 2a")).toBeVisible();
  await expect(page.getByText("PF₁ = 5")).toBeVisible();
  await expect(page.getByText("PF₂ = 5")).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/courses/sf1690/concepts/ellipses-and-hyperbolas");
  await expect(
    page.getByRole("slider", { name: "Semimajor axis a" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBe(0);
});

test("lecture archive entries open a dedicated interactive lecture page", async ({ page }) => {
  await page.goto("/courses/sf1690");

  const lectureLink = page.getByRole("link", {
    name: "Lecture 2 — lines, circles, and conic sections",
  }).first();
  await expect(lectureLink).toHaveAttribute(
    "href",
    "/courses/sf1690/lectures/2026-08-26-02",
  );
  await lectureLink.click();

  await expect(page).toHaveURL(/\/courses\/sf1690\/lectures\/2026-08-26-02$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Lecture 2 — lines, circles, and conic sections",
    }),
  ).toBeVisible();
  const conceptSections = page.locator("details.lecture-concept");
  await expect(conceptSections).toHaveCount(4);
  await expect(conceptSections.first()).toHaveAttribute("open", "");

  const linesSection = conceptSections.filter({ hasText: "Lines and slope" });
  await linesSection.locator("summary").click();
  await expect(linesSection).not.toHaveAttribute("open", "");
  await linesSection.locator("summary").click();
  await expect(linesSection).toHaveAttribute("open", "");

  const parabolaSection = conceptSections.filter({ hasText: "Parabolas and graph shifts" });
  await parabolaSection.locator("summary").click();
  await expect(page.getByRole("slider", { name: "Focus distance p" })).toBeVisible();
  await expect(
    parabolaSection.getByRole("link", { name: "Open the standalone concept guide" }),
  ).toHaveAttribute("href", "/courses/sf1690/concepts/parabolas-and-shifts");

  const firstPractice = page.locator(".practice-prompt").first();
  await firstPractice.getByRole("textbox", { name: "Work it out" }).fill("My attempt");
  await firstPractice.getByRole("button", { name: "Show a hint" }).click();
  await expect(firstPractice.getByText("Hint 01")).toBeVisible();
  await firstPractice.getByRole("button", { name: "Reveal solution" }).click();
  await expect(firstPractice.locator(".practice-prompt__solution")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Assigned exercises" })).toBeVisible();
  await expect(page.getByText(/Exercises 4, 6, 12, 14, 16/)).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload();
  await page.locator("details.lecture-concept").filter({ hasText: "Parabolas and graph shifts" }).locator("summary").click();
  await expect(page.getByRole("slider", { name: "Focus distance p" })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});

test("the SF1690 course spine and Lecture 1 study material stay complete", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/courses/sf1690");

  await expect(page.locator(".course-page .entity-list a")).toHaveText([
    "Real numbers, inequalities, and intervals",
    "Absolute value",
    "Cartesian coordinates, distance, and circles",
    "Lines and slope",
    "Parabolas and graph shifts",
    "Ellipses and hyperbolas",
    "Quadratic functions",
    "Functions, domain, and range",
    "Function graphs and the vertical-line test",
    "Even and odd function symmetry",
    "Function arithmetic and shared domains",
    "Function composition",
    "Piecewise-defined functions",
  ]);

  for (const concept of [
    {
      slug: "real-numbers-and-lines",
      example: "Solve a rational inequality with a sign chart",
      question: "Reverse the inequality",
    },
    {
      slug: "absolute-value",
      example: "Solve an absolute-value equation and inequality",
      additionalExample: "Prove the reverse triangle inequality on the real line",
      question: "Read absolute value as distance",
    },
    {
      slug: "cartesian-distance-circles",
      example: "Read the unit circle as a distance condition",
      question: "Reconstruct the distance proof",
    },
    {
      slug: "lines-and-slopes",
      example: "Find the line through two points",
      question: "Reverse the point order",
    },
  ]) {
    await page.goto(`/courses/sf1690/concepts/${concept.slug}`);
    await expect(page.getByRole("heading", { name: "Worked examples" })).toBeVisible();
    await expect(page.getByText(concept.example)).toBeVisible();
    if (concept.additionalExample) {
      await expect(page.getByText(concept.additionalExample)).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "Self-check" })).toBeVisible();
    await expect(page.getByText(concept.question)).toBeVisible();
    await expect(page.getByText("Lecture 1 chalkboard photographs")).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBe(0);
  }
});

test("the 27 August lectures expose their source-bounded interactive visuals", async ({
  page,
}) => {
  await page.goto("/courses/ie1204/lectures/2026-08-27-02");
  await expect(
    page.getByRole("heading", {
      name: "Lecture 2 — signed numbers, overflow, and logic gates",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lecture overview" })).toBeVisible();
  await page.getByRole("button", { name: "Bit 1 with weight 4 is 0" }).click();
  await expect(page.getByText("−3₁₀")).toBeVisible();
  await page.locator("details.lecture-concept").filter({ hasText: "Logic gates and truth tables" }).locator("summary").click();
  await page.getByRole("tab", { name: "XOR" }).click();
  await page.getByRole("button", { name: "Input B is 0" }).click();
  await expect(page.getByText("Y = 0", { exact: true })).toBeVisible();

  await page.goto("/courses/sf1690/lectures/2026-08-27-03");
  await expect(
    page.getByRole("heading", {
      name: "Lecture 3 — functions, domains, and symmetry",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lecture overview" })).toBeVisible();
  await expect(page.getByText(/reconstruct/i)).toHaveCount(0);
  await expect(page.getByText(/authenticated Canvas/i)).toHaveCount(0);
  await page.locator("details.lecture-concept").filter({ hasText: "Function graphs and the vertical-line test" }).locator("summary").click();
  await page.getByRole("tab", { name: "Circle", exact: true }).click();
  await expect(
    page.getByText("Two intersections — not a function of x"),
  ).toBeVisible();
  const testLine = page.getByRole("slider", { name: "Test line x" });
  await testLine.press("End");
  await expect(page.getByText("No intersection at this input")).toBeVisible();
});

test("the SF1690 dossier stays honest and composed across breakpoints and themes", async ({
  page,
}) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/courses/sf1690");

    await expect(
      page.getByRole("heading", { name: "Basic Course in Mathematics" }),
    ).toBeVisible();
    await expect(page.getByText("6 ECTS").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Course map" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Week ledger" })).toBeVisible();
    await expect(page.getByText("29, 40, 42, 44, 45")).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("material/lectures");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBe(0);

    if (width === 375) {
      await expect(page.locator(".week-ledger__weeks")).toHaveCSS(
        "overflow-x",
        "visible",
      );
    }

    await page.getByRole("button", { name: /Switch to (dark|light) theme/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", /dark|light/);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBe(0);
  }
});

test("the two new course dossiers and lecture-one apparatus work across breakpoints", async ({
  page,
}) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });

    await page.goto("/courses/ie1204");
    await expect(page.getByRole("heading", { name: "Digital Design" })).toBeVisible();
    await expect(page.getByText("7.5 ECTS").first()).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Lecture 1 — digital abstraction and number systems",
      }),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: /eight ceramic bit tiles/i })).toBeVisible();

    await page.goto("/courses/ii1308");
    await expect(page.getByRole("heading", { name: "Introduction to Programming" })).toBeVisible();
    await expect(page.getByText("1.5 ECTS").first()).toBeVisible();
    await expect(page.getByText("Module A quiz")).toBeVisible();
    await expect(page.getByRole("img", { name: /blank name tag/i })).toBeVisible();

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBe(0);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/courses/ie1204/concepts/positional-number-systems");
  await expect(page.getByText("90₁₀")).toBeVisible();
  await page.getByRole("button", { name: /weight 1 is 0/i }).click();
  await expect(page.getByText("91₁₀")).toBeVisible();

  await page.goto("/courses/ie1204/concepts/digital-abstraction");
  await page.getByRole("slider", { name: "Input voltage" }).fill("0.5");
  await expect(page.locator(".systems-equation--logic strong")).toHaveText(
    "Undefined",
  );

  await page.goto("/courses/ii1308/concepts/sequence-selection-iteration");
  await page.getByRole("tab", { name: "Iteration" }).click();
  await page.getByRole("button", { name: "Next step" }).click();
  await expect(page.locator(".systems-equation--control strong")).toHaveText("run loop body");

  await page.goto("/courses/ii1308/concepts/variables-values-and-types");
  await page.getByRole("button", { name: 'x = "KTH"' }).click();
  await expect(page.locator(".binding-map__value strong")).toHaveText('"KTH"');
});
