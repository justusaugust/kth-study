---
id: 'example:ie1204:check-setup-hold-skew'
courseId: 'course:ie1204'
slug: check-setup-hold-skew
title: 'A passing setup check can hide a hold failure'
conceptIds: ['concept:ie1204:sequential-setup-hold-and-skew']
sourceIds: ['source:ie1204:lecture-11-fsm-analysis-and-timing']
lastChecked: '2026-09-27'
confidence: supported
relationships: []
---

Use these original path bounds: $t_{\mathrm{pcq}}=60$ ps, $t_{\mathrm{ccq}}=25$ ps, $t_{\mathrm{pd}}=180$ ps, $t_{\mathrm{cd}}=30$ ps, $t_{\mathrm{setup}}=50$ ps and $t_{\mathrm{hold}}=45$ ps. The capture clock arrives 20 ps later, so $\delta=+20$ ps.

For setup:

$$
T_{\min}=60+180+50-20=270\ \mathrm{ps}.
$$

A 300 ps period has 30 ps setup slack. The setup-only frequency limit is approximately 3.70 GHz.

For hold, the earliest new data arrives at $25+30=55$ ps. It must not arrive before $45+20=65$ ps, so hold slack is $55-65=-10$ ps. The path fails despite passing setup. Increasing the period does not change those two arrival times.

Suppose a buffer on this same path adds at least 20 ps and at most 35 ps. The revised combinational bounds are 50 ps minimum and 215 ps maximum. Hold slack becomes $25+50-65=10$ ps, but setup now requires $60+215+50-20=305$ ps. The original 300 ps period fails setup after the repair. At 320 ps, setup slack is 15 ps and hold slack remains 10 ps.

Both constraints now pass for the given bounds. This calculation makes no claim about other paths or unmodelled uncertainty.
