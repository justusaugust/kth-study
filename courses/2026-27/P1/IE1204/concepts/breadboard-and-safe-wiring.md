---
id: 'concept:ie1204:breadboard-and-safe-wiring'
courseId: 'course:ie1204'
slug: breadboard-and-safe-wiring
title: Breadboards and safe digital wiring
summary: >-
  A physical logic circuit is reliable only when its hidden breadboard
  connections, supply rails, IC orientation, input levels, and output loading
  are all deliberate.
centralInsight: >-
  Treat every wire as part of the circuit: verify where it connects, what
  voltage it can carry, and whether any output is being forced against another.
commonMistake: >-
  Assuming an unused input is harmless. CMOS inputs must be tied to a definite
  zero or five volts; a floating input can make the circuit behave unpredictably.
verifyPrompt: >-
  Before applying power, explain how you would verify the rails, IC orientation,
  input states, and output connections.
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
  - type: appears_in
    from: 'concept:ie1204:breadboard-and-safe-wiring'
    to: 'lecture:ie1204:2026-09-03-04'
---
## Know the board before wiring the circuit

Each five-hole breadboard group is internally connected. The long power buses run horizontally and are interrupted at the centre groove, so a rail that looks continuous may not be electrically continuous. Establish the $5\,\mathrm{V}$ and ground rails first, then verify them before inserting logic.

## Make every logic level intentional

Orient an IC from its notch or pin-one mark, then connect its documented VCC and ground pins. Tie unused inputs to a definite logic level. Never short the supply rails, connect two outputs together, or drive a rail directly from an output.

LED indicators also need controlled current. The kit's loose seven-segment display has no built-in resistors and must be driven through the current-limited CD4543B outputs.

## Protect the hardware

Electrostatic discharge can cause immediate or latent damage. Handle components by their package, keep the work area controlled, and remove power before rewiring or correcting orientation.
