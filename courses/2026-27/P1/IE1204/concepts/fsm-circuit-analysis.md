---
id: 'concept:ie1204:fsm-circuit-analysis'
courseId: 'course:ie1204'
slug: fsm-circuit-analysis
title: 'Read an FSM from its circuit'
summary: 'Recover state transitions and output behaviour from flip-flop inputs, then check reachability and unused codes.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-24-11']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-11-fsm-analysis-and-timing']
lastChecked: '2026-09-27'
confidence: supported
relationships: []
---

## Separate what is stored from what is calculated

Synthesis goes from behaviour to gates. Analysis reverses that direction. Identify the flip-flops first: their Q outputs are the present state bits, and their D inputs specify the next values at the active clock edge. Identify clock edge, reset polarity and reset destination before interpreting a trace.

Name the current bits $q_1,q_0$, next bits $q_1^+,q_0^+$ and external input $x$. Derive a Boolean expression for each D input from the connected gates. Then derive the output expression independently. An output depending only on Q bits is Moore; an input-dependent output is Mealy even if the state changes only at clock edges.

Do not guess the function from the visual layout or from a suggestive state name. Inversion bubbles and the choice of Q versus its complement can change the circuit completely.

## Enumerate, then interpret

For every current-state code and every input combination, evaluate all D expressions using the same old state. Assemble those results into the next code. Evaluate the output using its specified dependencies. This produces an encoded transition table, which can then be drawn as a state diagram.

A Karnaugh map may help organise the evaluations, but pay attention to its Gray-code ordering: 00, 01, 11, 10 is not binary counting order. Always read the labels rather than copying entries by position.

Starting at reset, follow transitions to discover which states can actually be reached. Give the states meaningful names only when the paths explain what they remember. Finally test the interpretation against several sequences, including resets, held inputs and inputs that interrupt the expected pattern.

## Inspect every physical code

A register with $k$ bits has $2^k$ possible codes, even when the design intends to use fewer states. In circuit analysis the gates already determine what happens from every code. An “unused” row is therefore something to calculate, not permission to leave the analysis blank.

A self-loop in an unintended state can trap the machine. A transition to a valid state may provide recovery, but inspect the output during that recovery too: reaching safety one edge later does not make the current output harmless. If recovery depends on an input, say which input is needed.

Distinguish three claims: the state is unreachable from reset in the ideal model; the state recovers after an abnormal entry; and its outputs remain acceptable during recovery. Proving one does not establish the other two.
