---
id: 'concept:ie1204:memory-cell-technologies'
courseId: 'course:ie1204'
slug: memory-cell-technologies
title: 'What physically remembers a bit?'
summary: 'Compare SRAM feedback, DRAM charge, nonvolatile storage and memory access ports.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-10-01-15']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-15-memory']
lastChecked: '2026-10-05'
confidence: supported
relationships: []
---

## SRAM stores a stable powered state

A conventional SRAM cell uses cross-coupled inverters to maintain a bit, with access transistors connecting it to bitlines when its wordline is selected. The feedback continually reinforces the stored state while power is present. It needs no periodic refresh, but it is still volatile: switching off the supply loses the data.

The existing latch visual illustrates feedback-based state retention, not the transistor-level SRAM read/write circuit. A memory write must drive the selected cell to the requested state; a read must sense it without accidentally changing it. SRAM is commonly chosen for fast small memories such as caches, where its larger cell area is an acceptable tradeoff.

## DRAM stores charge that must be restored

A conventional DRAM bit uses a capacitor and an access transistor. The capacitor's charge distinguishes the two logical values. Leakage gradually erodes that distinction, so even an idle powered memory needs periodic refresh. Reading shares charge with a bitline and disturbs the stored value; sensing and restoration are part of the read operation.

Refresh and restoration are related but different reasons to rewrite charge: refresh compensates for time passing, while restoration repairs the disturbance caused by reading. A smaller cell enables dense memory, but introduces these support operations and timing constraints. “Dynamic” does not mean the user's data is supposed to change on its own.

## Nonvolatile does not mean freely rewritable

ROM retains its contents without a supply. A fixed diode matrix stores a pattern through physical connections; changing it means changing those connections. Flash is electrically reprogrammable nonvolatile memory, but programming and erasing have constraints, take time and consume finite endurance. Do not treat it as an SRAM replacement with identical write behaviour.

A memory hierarchy uses different technologies because capacity, latency, density, cost and persistence compete. Capacity figures alone do not identify the right memory for a job.

## Ports describe access, not extra copies

A register file can have two read ports and one write port. The two read addresses independently select two words from the same stored array; the write address chooses the destination when write enable is active. A $32\times16$ register file still stores 512 bits, even if it can read two 16-bit words simultaneously.

If a read and write target the same address at the same time, the observed value depends on the circuit's specified timing and read-during-write behaviour. State that contract before predicting old or new data. More ports do not themselves settle that question.
