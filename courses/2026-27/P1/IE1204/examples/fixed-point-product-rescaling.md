---
id: 'example:ie1204:fixed-point-product-rescaling'
courseId: 'course:ie1204'
slug: fixed-point-product-rescaling
title: 'Multiply scaled integers without losing the binary point'
conceptIds: ['concept:ie1204:fixed-and-floating-point', 'concept:ie1204:shift-registers-and-shifters']
sourceIds: ['source:ie1204:lecture-14-arithmetic']
lastChecked: '2026-10-12'
confidence: supported
relationships: []
---

Use signed eight-bit words with three fractional bits. Let A=00001100 and B=11111100.

The integer encodings are 12 and $-4$, so the represented values are $12/8=1.5$ and $-4/8=-0.5$. Multiply the encodings in a wide signed intermediate: $12(-4)=-48$. The product has six fractional bits, so its value is $-48/64=-0.75$.

To return to three fractional bits, divide the integer encoding by $2^3$: $-48/8=-6$. No rounding is needed because the division is exact. The eight-bit two's-complement encoding of $-6$ is 11111010, which decodes to $-6/8=-0.75$.

Do not interpret the raw product with the original three-bit scale: that would give $-6$, a factor-of-eight error. Do not truncate the multiplication to eight bits before checking the intermediate range. When division is not exact, arithmetic right shift supplies floor rounding; a different rounding policy needs explicit handling.
