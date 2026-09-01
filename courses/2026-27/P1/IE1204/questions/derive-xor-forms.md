---
id: 'question:ie1204:derive-xor-forms'
courseId: 'course:ie1204'
slug: derive-xor-forms
title: Derive both canonical forms for XOR
conceptIds:
  - 'concept:ie1204:boolean-equations-and-algebra'
answer: 'The one-rows are $01$ and $10$, so SOP is $\bar A B+A\bar B=\sum m(1,2)$. The zero-rows are $00$ and $11$, so POS is $(A+B)(\bar A+\bar B)=\prod M(0,3)$. Both produce $0,1,1,0$.'
sourceIds:
  - 'source:ie1204:lecture-5-boolean-algebra'
lastChecked: '2026-09-01'
confidence: verified
relationships: []
---
XOR has output vector $0,1,1,0$ in row order $00,01,10,11$. Write its canonical SOP and POS and identify the rows used by each form.
