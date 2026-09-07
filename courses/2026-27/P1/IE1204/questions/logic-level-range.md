---
id: 'question:ie1204:logic-level-range'
courseId: 'course:ie1204'
slug: logic-level-range
hints:
  - 'Work out the disturbed voltage, then compare it with both ends of the accepted HIGH interval.'
  - 'If the noise direction is unspecified, check both $0.90+0.02$ and $0.90-0.02$ rather than assuming one direction.'
title: 'Read a voltage through the digital abstraction'
conceptIds:
  - 'concept:ie1204:digital-abstraction'
answer: >-
  The 0.02 V disturbance keeps the signal inside the HIGH input range, so the
  bit remains 1. A digital receiver classifies a range, not one exact voltage.
sourceIds:
  - 'source:ie1204:lecture-1-digital-design'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: assesses
    from: 'question:ie1204:logic-level-range'
    to: 'concept:ie1204:digital-abstraction'
---
A receiver accepts every input from $0.70\text{ V}$ to $1.00\text{ V}$ as HIGH. A nominal $0.90\text{ V}$ signal picks up $0.02\text{ V}$ of noise. What bit does the receiver see, and why?
