---
id: 'example:ie1204:nested-demorgan'
courseId: 'course:ie1204'
slug: nested-demorgan
title: Complement a nested expression
conceptIds: ['concept:ie1204:demorgan-and-universal-gates']
sourceIds: ['source:ie1204:lecture-6-gate-implementations']
lastChecked: '2026-09-08'
confidence: supported
relationships: []
---
Take $F=\overline{(A+BC)D}$. Apply De Morgan to the **outermost** product first:

$$
F=\overline{A+BC}+\overline{D}
=\overline{A}\,\overline{BC}+\overline{D}
=\overline{A}(\overline{B}+\overline{C})+\overline{D}.
$$

Do not distribute the outer overline into every symbol in one step. Keep parentheses until the gate operation they represent has been transformed. For $D=0$, both the original and final expressions are always one.
