---
id: 'concept:ie1204:digital-abstraction'
courseId: 'course:ie1204'
slug: digital-abstraction
title: 'Digital abstraction and logic levels'
summary: >-
  Digital design maps ranges of continuous physical voltages to two symbolic
  states, allowing circuits to process stable binary values.
centralInsight: >-
  A bit is symbolic; a real circuit earns the symbol 0 or 1 by placing a
  measured voltage inside an agreed range.
commonMistake: >-
  Treating HIGH as one exact voltage or assuming every voltage must already be
  either 0 or 1. The gap between valid ranges is intentional.
verifyPrompt: >-
  Explain why a range of voltages can represent one bit value and how that
  improves resistance to small disturbances.
outcomeIds:
  - 'outcome:ie1204:analyse-circuits'
lectureIds:
  - 'lecture:ie1204:2026-08-25-01'
  - 'lecture:ie1204:2026-08-31-03'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-1-digital-design'
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships:
  - type: appears_in
    from: 'concept:ie1204:digital-abstraction'
    to: 'lecture:ie1204:2026-08-25-01'
  - type: continues_to
    from: 'concept:ie1204:digital-abstraction'
    to: 'concept:ie1204:positional-number-systems'
  - type: appears_in
    from: 'concept:ie1204:digital-abstraction'
    to: 'lecture:ie1204:2026-08-31-03'
---
## Why digital design starts with a restriction

Voltage, position, and frequency vary continuously in the physical world. A digital system intentionally ignores most of that detail. It assigns useful **symbolic states** to selected regions of the physical quantity and reasons with those symbols instead.

That restriction is a discipline: fewer allowed states make each building block simpler, so many blocks can be combined into a much more sophisticated system.

## From voltage to bit

The symbols are usually written as

$$0\equiv\text{FALSE}\equiv\text{LOW},\qquad 1\equiv\text{TRUE}\equiv\text{HIGH}.$$

A **bit** is one binary digit. It does not prescribe one universal voltage. A particular circuit technology defines which input voltages count as LOW and which count as HIGH.

## Why ranges matter

If HIGH were exactly one voltage, even tiny electrical noise could destroy the meaning. A range allows the signal to move slightly while preserving the same interpretation. Voltages between the guaranteed LOW and HIGH ranges are not a third logical state; they are an invalid or uncertain input region that the designer should avoid.

This is the first abstraction boundary in the course:

$$\text{physical voltage}\longrightarrow\text{logic level}\longrightarrow\text{bit}.$$

## Noise margins connect gates safely

A driver guarantees output limits $V_{OL}$ and $V_{OH}$; a receiving gate accepts inputs below $V_{IL}$ as LOW and above $V_{IH}$ as HIGH. The unused voltage between those guarantees is the room available for degradation:

$$NM_L=V_{IL}-V_{OL},\qquad NM_H=V_{OH}-V_{IH}.$$

Positive noise margins mean a valid output can suffer some resistance loss, supply noise, or coupling before the next gate can misread it. Chips from different logic families are compatible only when the driver's output guarantees satisfy the receiver's input requirements.
