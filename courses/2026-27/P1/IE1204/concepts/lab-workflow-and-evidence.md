---
id: 'concept:ie1204:lab-workflow-and-evidence'
courseId: 'course:ie1204'
slug: lab-workflow-and-evidence
title: From schematic to lab evidence
summary: >-
  A lab result is more than a working breadboard: the logic, simulation,
  physical build, measurements, demonstration, and report must tell the same
  technical story.
centralInsight: >-
  Build and document in the same order: specify the behaviour, draw the complete
  circuit, simulate it, wire it, test every relevant case, and record the result.
commonMistake: >-
  Drawing a conceptual gate diagram after the build and omitting IC pin numbers,
  power connections, reused inverters, or the evidence needed to reproduce it.
verifyPrompt: >-
  Given a completed breadboard experiment, list the minimum evidence needed to
  demonstrate and report it clearly.
outcomeIds:
  - 'outcome:ie1204:analyse-circuits'
  - 'outcome:ie1204:design-digital-systems'
lectureIds:
  - 'lecture:ie1204:2026-09-03-04'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-4-lab-introduction'
lastChecked: '2026-09-03'
confidence: verified
relationships:
  - type: requires
    from: 'concept:ie1204:lab-workflow-and-evidence'
    to: 'concept:ie1204:breadboard-and-safe-wiring'
  - type: appears_in
    from: 'concept:ie1204:lab-workflow-and-evidence'
    to: 'lecture:ie1204:2026-09-03-04'
---
## Specify and simulate first

Start from the required input-output behaviour. Express it as a truth table or Boolean function, simplify it when appropriate, and draw a complete schematic with actual gate packages, pin numbers, VCC, ground, and any shared inverters. Logisim can check that the schematic matches the intended behaviour before physical wiring adds another source of errors.

## Build and test systematically

Translate the schematic one connection at a time. Use switches to create defined input levels and test the relevant input combinations. If the result is wrong, compare the physical node under test with the same node in the schematic instead of changing several wires at once.

## Preserve evidence

The individual lab report uses truth tables, Karnaugh maps, circuit diagrams, and breadboard photographs. One completed lab per module is demonstrated to a lab assistant. A short session recap should therefore record what was built, what was tested, and any failure or correction worth remembering.
