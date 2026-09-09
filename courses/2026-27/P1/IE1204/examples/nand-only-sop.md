---
id: 'example:ie1204:nand-only-sop'
courseId: 'course:ie1204'
slug: nand-only-sop
title: Build a three-NAND circuit
conceptIds: ['concept:ie1204:demorgan-and-universal-gates']
sourceIds: ['source:ie1204:lecture-6-gate-implementations']
lastChecked: '2026-09-08'
confidence: supported
relationships: []
---
For $F=AB+CD$, set $u=\overline{AB}$ and $v=\overline{CD}$, then connect them to a third NAND:

$$F=\overline{uv}=\overline{\overline{AB}\,\overline{CD}}=AB+CD.$$

For $A=B=1,C=D=0$, the intermediate outputs are $u=0,v=1$ and the final output is $1$. If neither product is one, both intermediate outputs are one and the final NAND produces zero. This covers all cases, not just the example input.

An AND applied directly to $u,v$ would compute the complement of the desired function. The final inversion is essential.
