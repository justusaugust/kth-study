---
id: 'question:ie1204:latch-polarity-check'
courseId: 'course:ie1204'
slug: latch-polarity-check
title: Which levels hold a stored bit?
conceptIds: ['concept:ie1204:feedback-and-latches']
sourceIds: ['source:ie1204:lecture-9-latches-and-flip-flops']
lastChecked: '2026-09-20'
confidence: supported
relationships: []
hints: ['For a NAND latch, zero asserts a control. Both controls must be inactive to hold.']
answer: '01 sets Q to 1; 11 then holds Q at 1. The forbidden NAND input is 00, which forces both outputs high. Releasing both controls together does not guarantee which state follows. For a NOR latch, hold is 00 and the forbidden input is 11.'
---

A NAND SR latch starts at $Q=0$. Its active-low inputs $\overline S,\overline R$ first become 01, then 11. What is $Q$ after each step? Which input pair is forbidden, and why is its simultaneous release not a valid way to initialise the latch? Give the hold and forbidden pairs for a NOR SR latch too.
