---
id: 'question:ie1204:combine-boolean-terms'
courseId: 'course:ie1204'
slug: combine-boolean-terms
title: Combine two neighbouring minterms
hints:
  - 'Both terms contain $A$. Factor it out before applying a Boolean identity.'
  - 'What does $\overline{B}+B$ equal for either possible value of $B$?'
conceptIds:
  - 'concept:ie1204:boolean-equations-and-algebra'
answer: '$A\overline{B}+AB=A(\overline{B}+B)=A$. The complement law gives $\overline{B}+B=1$, then the identity law gives $A\cdot1=A$.'
sourceIds:
  - 'source:ie1204:lecture-5-boolean-algebra'
lastChecked: '2026-09-01'
confidence: verified
relationships: []
---
Simplify $A\overline{B}+AB$. Name the law used at each step and explain what the result says about dependence on $B$.
