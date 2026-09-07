---
id: 'question:ie1204:diagnose-unsafe-wiring'
courseId: 'course:ie1204'
slug: diagnose-unsafe-wiring
hints:
  - 'Keep power disconnected. Check each reported problem against three rules: defined inputs, no output contention, and the documented IC pinout.'
  - 'Before power-up, trace VCC and ground through the actual breadboard groups and split rails, and check for an unintended supply short.'
title: Diagnose the wiring before power-up
conceptIds:
  - 'concept:ie1204:breadboard-and-safe-wiring'
answer: 'Do not apply power. First remove the output-to-output connection, orient the IC from its pin-one mark, connect VCC and ground, and tie the unused input to a valid logic level. Then verify that the split breadboard rails are bridged only where intended and check for a 5 V-to-ground short.'
sourceIds:
  - 'source:ie1204:lecture-4-lab-introduction'
lastChecked: '2026-09-03'
confidence: verified
relationships: []
---
A breadboard has one unused CMOS input floating, two gate outputs connected together, and an IC whose notch was ignored. What must be corrected and checked before applying power?
