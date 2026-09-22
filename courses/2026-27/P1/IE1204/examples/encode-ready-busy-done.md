---
id: 'example:ie1204:encode-ready-busy-done'
courseId: 'course:ie1204'
slug: encode-ready-busy-done
title: 'Encode a small ready-busy-done controller'
conceptIds: ['concept:ie1204:fsm-design-and-state-encoding']
sourceIds: ['source:ie1204:lecture-10-finite-state-machines']
lastChecked: '2026-09-23'
confidence: supported
relationships: []
---

This original controller accepts a start request only while Ready. It spends one cycle Busy, then one cycle Done, then returns to Ready. Requests during Busy and Done are ignored by this specification. Done has output $z=1$; all other states have $z=0$.

Choose Ready=00, Busy=01, Done=10. Require unused code 11 to return to Ready with $z=0$.

- Ready (00): start=0 keeps 00; start=1 selects 01. Output $z=0$.
- Busy (01): either input selects 10. Output $z=0$.
- Done (10): either input selects 00. Output $z=1$.
- Unused (11): either input selects 00. Output $z=0$.

For current bits $q_1,q_0$ and request $s$, these transition rules give:

$$
D_1=\overline{q_1}q_0,\qquad
D_0=\overline{q_1}\,\overline{q_0}s,\qquad
z=q_1\overline{q_0}.
$$

Check code 11 explicitly: both D inputs and the output are zero. Recovery was included in the equations, not assumed after minimisation.

Starting at Ready with $s=1$ held continuously, successive edges enter Busy, Done, Ready, Busy. Thus a held request starts another operation when Ready is sampled again. If the desired behaviour were “one operation per button press,” that would be a different specification requiring a way to remember or detect release.
