---
courseId: "course:ie1204"
sourceIds: ["source:ie1204:lecture-7-karnaugh-maps"]
lastChecked: "2026-09-09"
confidence: "supported"
relationships: []
id: "question:ie1204:karnaugh-invalid-group"
slug: "karnaugh-invalid-group"
title: "Can four 1s always form a group?"
conceptIds: ["concept:ie1204:karnaugh-grouping"]
answer: "No. In input order ABC, m0, m2, m3 and m4 do not form a complete rectangle, even across the boundary. All three inputs change, so a single term containing all four would also include other input rows. Use smaller valid groups instead."
hints: ["Power-of-two size is necessary, but the rectangle must be complete."]
---

A three-input map has 1s at $m_0,m_2,m_3,m_4$. Can you circle all four as a single group just because four is a power of two?
