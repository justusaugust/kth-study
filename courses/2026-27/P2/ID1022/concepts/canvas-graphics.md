---
{
  "id": "concept:id1022:canvas-graphics",
  "courseId": "course:id1022",
  "slug": "canvas-graphics",
  "title": "Canvas coordinates, color and layers",
  "summary": "Draw predictable shapes and images with TinyWeb.",
  "centralInsight": "A canvas is a coordinate system plus an ordered sequence of drawing effects.",
  "outcomeIds": [],
  "lectureIds": [],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:id1022:proggame-canvas"
  ],
  "lastChecked": "2026-11-06",
  "confidence": "supported",
  "relationships": []
}
---

## Choose the coordinate system

`tw.canvas(width, height)` creates a canvas identifier. Pass it to drawing operations. The origin is the upper-left corner: x increases to the right and y increases downward. A rectangle uses its upper-left corner and dimensions; a circle uses its center and radius.

```text
import tinyweb as tw
import tinyweb.color as color

canvas = tw.canvas(240, 160)
tw.clear(canvas, color.white)
tw.rect(canvas, 20, 30, 80, 40, color.blue)
tw.circle(canvas, 100, 70, 18, color.red)
```

The rectangle spans x = 20 to 100 and y = 30 to 70. The circle is centered on its lower-right corner. Later drawing covers earlier drawing wherever their shapes overlap in normal blend mode. The code is an independent illustration, not an assessed game solution.

## RGB is additive color

`color.rgb(red, green, blue)` uses components from 0 through 255. Equal components produce gray: `(0, 0, 0)` is black and `(255, 255, 255)` is white. Unequal components produce color. Clamp or validate calculated components before passing values outside that range.

In additive blending, colored light combines differently from ordinary overpainting. `tw.blend(canvas, "add")` changes subsequent drawing on that canvas. Restore `tw.blend(canvas, "normal")` before drawing content that should use normal compositing. A previous blend setting can affect text too.

## Immutable names can call stateful libraries

An immutable binding does not make the canvas immutable. Drawing calls change the canvas, and blend mode persists across calls. Distinguish the value bound to a name from effects performed through a library.

`tw.text(canvas, x, y, "Label", size=24)` illustrates a named argument. Keep text legible and away from shape boundaries; changing blend mode can make otherwise correct labels hard to see.

## Load once, draw repeatedly

`tw.load_image(path)` loads an available image and returns its identifier. `tw.image(canvas, image, x, y, width, height)` places a scaled copy. Load images outside a repeated drawing loop and reuse their identifiers. Loading a file and drawing it are separate operations.

Continue with [proportions, grids and staggered rows](/courses/id1022/concepts/graphics-layout-and-grids) to derive positions rather than guessing coordinates.
