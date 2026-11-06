---
{
  "id": "concept:id1022:graphics-layout-and-grids",
  "courseId": "course:id1022",
  "slug": "graphics-layout-and-grids",
  "title": "Proportions, grids and staggered rows",
  "summary": "Derive repeated geometry, including integer rounding, checkerboards and brick patterns.",
  "centralInsight": "Define dimensions and invariants once, then derive every position from them.",
  "outcomeIds": [],
  "lectureIds": [],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:id1022:proggame-canvas",
    "source:id1022:proggame-bridge"
  ],
  "lastChecked": "2026-11-06",
  "confidence": "supported",
  "relationships": []
}
---

## Scale from proportions

For a design with ratio width:height = 3:2, choose width $W$ and derive height $H=2W/3$. Positions measured as fractions of the height should then use the actual computed $H$. If integer division truncated $H$, recomputing a vertical position directly from $W$ can disagree by a pixel.

Use integer arithmetic only when whole pixels are intended. Test small sizes and sizes not divisible by the design's denominator. Record whether an unused remainder becomes a border, is distributed, or is intentionally left at the edge.

## Repeated objects

For object width $w$, gap $g$ and left inset $x_0$, object $i$ starts at $x_i=x_0+i(w+g)$. For $n$ objects, the occupied width is $nw+(n-1)g$. Adding a gap after the last object changes that width.

For a gray ramp with $n>1$ samples including both endpoints, sample $i$ has channel value $255i/(n-1)$ for $i=0,\ldots,n-1$. Dividing by $n$ would miss white. Choose how a single-sample ramp should behave before using the formula at $n=1$.

## Nested loops and checkerboards

In a square grid, row $r$ and column $c$ give position $(x_0+cs, y_0+rs)$ for cell size $s$. Choose the light or dark image from `(r + c) % 2`; parity changes across both rows and columns. An outer row loop and inner column loop draw left to right, then top to bottom.

If an integer-width canvas is not divisible by its column count, `width / columns` may leave a remainder. Either preserve the specified integer cell size or derive shared cell boundaries consistently; do not silently assume that every grid fills its canvas exactly.

A Pyking conditional can produce a value for a binding:

```text
shade =
if row % 2 == 0:
    color.white
else:
    color.black
```

Both branches must produce an appropriate value. Inside another block, shift the whole construction to that block's indentation level. Selecting an image identifier this way does not load or draw it by itself.

## Staggered brick rows

Let a full brick have width $b$ and the mortar gap have width $m$. The pitch is $b+m$. An odd row shifts the full-brick pattern by half a pitch; this is different from using half a brick for an edge piece.

For a row of $n$ full bricks, its inner span is $nb+(n-1)m$. If the staggered row has two small edge bricks of width $h$, $n-1$ full bricks and $n$ gaps, matching the same span gives $2h=b-m$. Thus $h=(b-m)/2$. Check that $b>m$ and that the chosen integer dimensions can express that width.

For a new example, $b=26$ and $m=4$ gives edge width 11 and pitch 30. Making the edges 13 would widen the row. An outer mortar border of width $m$ adds $2m$ to the inner width and height.

Draw the background and mortar first, then the bricks. Trace each row's left and right boundary before running the nested loops. This explains the geometry without reproducing the game's bridge solution.
