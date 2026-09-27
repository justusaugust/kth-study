---
id: 'question:ie1204:skew-sign-and-hold-check'
courseId: 'course:ie1204'
slug: skew-sign-and-hold-check
title: 'Which timing constraint does late capture hurt?'
conceptIds: ['concept:ie1204:sequential-setup-hold-and-skew']
sourceIds: ['source:ie1204:lecture-11-fsm-analysis-and-timing']
lastChecked: '2026-09-27'
confidence: supported
relationships: []
hints: ['Use delta=+15 ps for a known late capture; use opposite adverse signs for the two worst-case checks.']
answer: 'Known delta=+15 ps gives minimum period 40+100+30-15=155 ps. Hold slack is 20+25-(35+15)=-5 ps, so hold fails and a 250 ps period cannot repair it. With unknown signed skew bounded by 15 ps, worst-case setup requires 185 ps and worst-case hold slack remains -5 ps.'
---

A path has $t_{\mathrm{pcq}}=40$ ps, $t_{\mathrm{pd}}=100$ ps, $t_{\mathrm{setup}}=30$ ps, $t_{\mathrm{ccq}}=20$ ps, $t_{\mathrm{cd}}=25$ ps and $t_{\mathrm{hold}}=35$ ps. Capture arrives 15 ps later than launch.

Find the minimum period from setup and the hold slack. Can using a 250 ps period repair any hold failure? What setup period and hold slack would result if only a skew bound of $\pm15$ ps were known?
