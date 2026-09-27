---
id: 'concept:ie1204:sequential-setup-hold-and-skew'
courseId: 'course:ie1204'
slug: sequential-setup-hold-and-skew
title: 'Setup, hold and clock skew'
summary: 'Check maximum-delay setup and minimum-delay hold constraints separately, with an explicit clock-skew sign convention.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:design-digital-systems']
lectureIds: ['lecture:ie1204:2026-09-24-11']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-11-fsm-analysis-and-timing']
lastChecked: '2026-09-27'
confidence: supported
relationships: []
---

## A sampling edge has a protected interval

The receiving flip-flop needs D stable for setup time $t_{\mathrm{setup}}$ before its active edge and hold time $t_{\mathrm{hold}}$ afterwards. Their sum is the sampling aperture. Violating that requirement can cause a wrong captured value or metastability; a digital timing diagram cannot promise which outcome occurs.

After a launching edge, Q can first begin changing at its minimum clock-to-Q delay $t_{\mathrm{ccq}}$ and is guaranteed settled by its maximum clock-to-Q delay $t_{\mathrm{pcq}}$. Between registers, $t_{\mathrm{cd}}$ is the minimum combinational delay and $t_{\mathrm{pd}}$ is the maximum. Use bounds for the whole relevant path, not an average gate delay.

## Setup checks whether data arrives soon enough

Assume same-edge-triggered registers, one cycle for the data transfer and no clock skew. Data launched at time zero must settle before the next capture edge at period $T$:

$$
T\ge t_{\mathrm{pcq}}+t_{\mathrm{pd}}+t_{\mathrm{setup}}.
$$

The longest relevant path sets the setup limit. Its reciprocal gives an upper clock-frequency bound, $f_{\max}=1/T_{\min}$, subject to every other path and timing requirement also passing. Increasing the period can repair setup failure; reducing the critical path can also help.

## Hold checks whether new data arrives too soon

The capture register must keep seeing the old data through the hold interval following the current edge. The earliest new data must therefore satisfy:

$$
t_{\mathrm{ccq}}+t_{\mathrm{cd}}\ge t_{\mathrm{hold}}.
$$

The shortest path controls this check. The period is absent: slowing the clock does not repair this same-edge hold violation. Adding delay to the short data path can help, but recheck its maximum delay afterwards. A hold repair must not create a setup failure.

Equality is the ideal boundary in these inequalities, not a practical timing margin. Physical implementation uses specified delay corners and appropriate uncertainty margins.

## State the skew convention before calculating

Let $\delta$ be capture-clock arrival time minus launch-clock arrival time for corresponding edges. Positive $\delta$ means the capture clock arrives later. The setup capture edge is then at $T+\delta$, while the hold window after the corresponding current capture edge ends at $\delta+t_{\mathrm{hold}}$.

$$
T\ge t_{\mathrm{pcq}}+t_{\mathrm{pd}}+t_{\mathrm{setup}}-\delta,
\qquad
t_{\mathrm{ccq}}+t_{\mathrm{cd}}\ge t_{\mathrm{hold}}+\delta.
$$

Later capture helps setup but hurts hold. Earlier capture does the opposite. If only a worst-case skew magnitude $s$ is known, with $-s\le\delta\le s$, use the adverse bound for each check:

$$
T\ge t_{\mathrm{pcq}}+t_{\mathrm{pd}}+t_{\mathrm{setup}}+s,
\qquad
t_{\mathrm{ccq}}+t_{\mathrm{cd}}\ge t_{\mathrm{hold}}+s.
$$

Those two worst cases need not occur simultaneously on the same register pair. They provide conservative bounds when the sign is not fixed. These equations omit additional jitter and uncertainty terms; they are a model for reasoning about the stated delay bounds, not a complete physical sign-off.
