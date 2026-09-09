---
id: 'question:ie1204:nested-complement'
courseId: 'course:ie1204'
slug: nested-complement
title: Move an inversion through two levels
conceptIds: ['concept:ie1204:demorgan-and-universal-gates']
answer: '$Y=\overline{A}+\overline{B+C}=\overline{A}+\overline{B}\,\overline{C}$. Change the outer AND to OR, then the inner OR to AND.'
hints: ['Apply De Morgan to the outermost operation before touching the parentheses.']
sourceIds: ['source:ie1204:lecture-6-gate-implementations']
lastChecked: '2026-09-08'
confidence: supported
relationships: []
---
Rewrite $Y=\overline{A(B+C)}$ so that only individual inputs are complemented.
