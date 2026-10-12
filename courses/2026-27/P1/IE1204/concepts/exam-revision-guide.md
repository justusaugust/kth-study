---
id: 'concept:ie1204:exam-revision-guide'
courseId: 'course:ie1204'
slug: exam-revision-guide
title: 'IE1204 exam study guide'
summary: 'Revise digital design from binary representation to combinational circuits, clocked state, arithmetic and memory, with a paper-first checklist and direct study links.'
centralInsight: 'Use independent problem solving to choose what to revisit; reading fluency alone is not evidence that you can carry out a method.'
outcomeIds: []
lectureIds: []
evidenceStatus: supplemental
sourceIds: ['source:ie1204:weekly-planner-2026', 'source:ie1204:lecture-1-introduction', 'source:ie1204:exam-updates-october-12', 'source:ie1204:practice-exam-2026-27', 'source:ie1204:lecture-15-memory']
lastChecked: '2026-10-12'
confidence: supported
relationships: []
---

## Begin with five paper tasks

Without notes, convert a signed binary number; minimise a four-variable function; trace a flip-flop circuit through several clock edges; derive an FSM's next-state equations; and perform a fixed-width addition with flags. Allow about 40 minutes. Record the first step you could not justify.

[Open IE1204 practice](/practice?course=ie1204). These are course self-checks, not an official mock exam. Use the official exercise sets and past examination material for a realistic rehearsal. Revision priorities below cover the taught topics; they are not a claim about which questions will appear.

## Representation, gates and electrical behaviour · Lectures 1–3

[Open the lecture archive](/courses/ie1204#course-lectures) and review number systems, two's complement, logic levels, noise margins, CMOS pull-up/pull-down networks and power.

State the width and signedness before interpreting bits. Unsigned carry and signed overflow answer different questions. Compute high and low noise margins from the guaranteed output levels and required input levels, not typical voltages. For CMOS, test whether a conducting path reaches power or ground for each input combination.

**Paper check:** interpret one word both unsigned and signed, calculate both noise margins, and derive the truth table of a small CMOS network.

## Boolean logic and combinational design · Lectures 5–8

Practise converting between truth tables, canonical SOP/POS, Boolean equations and gate implementations. Use Karnaugh-map adjacency correctly: edges wrap, but diagonal cells are not adjacent. Group powers of two, cover the required cells, and use don't-cares only where the specification permits.

Review multiplexers, decoders, encoders and timing. A combinational output depends on current inputs after propagation delay. A decoder selects an output; it does not store a word. Show the mapping between an input combination and the selected line before replacing an equation with a multiplexer.

**Paper check:** derive both canonical forms from one table, minimise one form, implement it with the required gate family, and calculate the longest propagation path.

## Registers, FSMs and counters · Lectures 9–12

Distinguish a level-sensitive latch from an edge-triggered flip-flop. Derive a circuit's next-state equations before stepping through its waveform. Every flip-flop samples the old state at the same active edge; do not update one register and feed its new value into another during that same edge.

For a design task: define the behaviour, draw the state diagram, choose an encoding, construct the transition/output table, derive equations, and check reset and unused states. Separate Moore outputs from Mealy outputs. For counters, state the modulus, transition sequence, load/enable priority and recovery behaviour.

**Paper check:** trace a short input sequence, design a small sequence detector, and inspect a counter's terminal-state reset. Check setup/hold constraints and the critical register-to-register path where timing data are provided.

## Arithmetic circuits, ALU and flags · Lecture 13

[Read the arithmetic lecture](/courses/ie1204/lectures/2026-10-06-13). Build a full adder from its truth table, trace carry through a multibit adder, and explain why carry-lookahead trades hardware for speed. Subtraction uses inversion of the second operand and an initial carry of one.

Always keep the truncated result separate from the carry bit. For signed addition, overflow occurs when equal-sign operands produce a result of the opposite sign; carry-out alone does not detect it. Know what an ALU control selects and how N, Z, C and V are obtained under the stated convention.

**Paper check:** perform one four-bit addition that has signed overflow without unsigned carry, then one with unsigned carry without signed overflow. Explain both rather than memorising a flag pattern.

## Shifts, fixed point and sequential building blocks · Lecture 14

[Read the shifts and fixed-point lecture](/courses/ie1204/lectures/2026-10-08-14). Distinguish logical right shift, arithmetic right shift and rotation. State the width, what enters the vacated positions, and which bits are discarded. A clocked shift register stores state; a combinational shifter computes a shifted result without advancing time.

For fixed point, decode the signed or unsigned integer word and scale by the weight of the least significant bit. Multiplication by a power of two can overflow a fixed-width word. An arithmetic right shift of a negative odd integer rounds toward negative infinity, not toward zero.

**Paper check:** apply three kinds of shift to the same word, trace parallel-load versus serial-shift control, and decode a signed fixed-point word with three fractional bits.

## Memory and interfaces · Lecture 15

[Read memory arrays and stored outputs](/courses/ie1204/lectures/2026-10-01-15). Calculate depth, word width and capacity. Distinguish address bits from data bits, bits from bytes, and storage capacity from the number of ports.

Explain ROM as a stored truth table and compare SRAM, DRAM and nonvolatile memory. Check active-low selection and output polarity in a decoder–ROM–display chain. The lab can help you picture the blocks, but laboratory assessment and the written examination are separate components.

**Paper check:** size an array, select a stored word from an address, and explain the clocked and combinational parts of a small display sequencer.

## How to use the remaining week

Use the [official 2026/27 practice paper](https://canvas.kth.se/courses/69070/files/10788107), its [answer form](https://canvas.kth.se/courses/69070/files/10788109), and then the [solutions](https://canvas.kth.se/courses/69070/files/10788108). Keep the solutions closed during your first attempt.

The practice paper has 16 short one-point questions and four longer design/analysis questions, for 32 points. Its pass conditions require both at least eight points in Part 1 and at least 16 overall. Do not sacrifice the short-question foundation to chase a single long design. Its instructions permit only a ruler/protractor. Confirm the final paper's instructions on exam day.

Use its questions as a revision map: 1–4 representation and arithmetic; 5–6 CMOS; 7–9 Boolean logic and decoding; 10–12 storage and timing; 13–14 fractional representations; 15–16 counters and ROM; 17 combinational design; 18 adder/subtractor design; 19–20 FSM design, analysis and timing. These are the practice paper's topics, not a prediction of the final questions.

1. **Diagnostic and repair:** choose two weak topics and solve fresh small examples with full working.
2. **Combinational session:** do one complete design from a specification, including minimisation and timing.
3. **Sequential session:** do one complete FSM design and one waveform/counter analysis.
4. **Arithmetic and memory session:** practise flags, shifts, fixed-point scaling and array capacity.
5. **Timed rehearsal:** use an official past paper for four hours under its stated aid rules. Mark it afterwards and re-solve every missed method.
6. **Final review:** check conventions, reset/unused states, units and signedness. Confirm the official room and registration.

For every circuit answer, label signals and state your conventions. For every numerical answer, retain the original width. For every simplification, preserve the required behaviour, not just the shortest expression.

## Exam facts and final checks

The lecturer's announcement, rechecked **12 October**, confirms **Monday 19 October 2026, 08:00–12:00**, now in **Kista**. It lists Ka-204, Ka-205, Ka-208, Ka-210 and Sal A (Östen Mäkitalo) as possible rooms; these are alternatives, not your assigned seat. Students using Funka support have a separate main-campus arrangement. Check your own seating allocation.

All four labs and a report covering all four are compulsory for the separate 3.5-credit laboratory component. Completing both before midnight **12 October** earns a lab bonus point usable only on the 19 October exam. Labs can be completed later, with period-2 support, but without that bonus. This is a course requirement, not a claim about your completion.

[Read the Kista relocation announcement](https://canvas.kth.se/courses/63848/discussion_topics/577463) and [compulsory lab announcement](https://canvas.kth.se/courses/63848/discussion_topics/578553). Confirm registration and your assigned building and room before planning travel. This guide does not assume attendance, lab completion or bonus eligibility.
