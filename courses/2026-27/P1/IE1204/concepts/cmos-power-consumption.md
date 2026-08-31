---
id: 'concept:ie1204:cmos-power-consumption'
courseId: 'course:ie1204'
slug: cmos-power-consumption
title: CMOS power consumption
summary: >-
  CMOS power combines the energy used to charge capacitances while signals
  switch with leakage power that remains when the circuit is idle.
centralInsight: >-
  Dynamic power grows linearly with capacitance and switching frequency but
  quadratically with supply voltage, so reducing voltage has an unusually
  strong effect.
commonMistake: >-
  Treating static and dynamic power as alternatives. They add, and their
  relative importance depends on the circuit and operating point.
verifyPrompt: >-
  Calculate dynamic, static, and total power for C = 20 nF, VDD = 1.2 V,
  f = 1 GHz, and leakage current 20 mA.
outcomeIds:
  - 'outcome:ie1204:analyse-circuits'
  - 'outcome:ie1204:design-digital-systems'
lectureIds:
  - 'lecture:ie1204:2026-08-31-03'
evidenceStatus: lecture
sourceIds:
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships:
  - type: requires
    from: 'concept:ie1204:cmos-power-consumption'
    to: 'concept:ie1204:cmos-transistor-networks'
  - type: appears_in
    from: 'concept:ie1204:cmos-power-consumption'
    to: 'lecture:ie1204:2026-08-31-03'
---
## Charging and leakage

Charging a capacitance $C$ to $V_{\mathrm{DD}}$ requires the energy

$$E_{\mathrm{switch}} = \frac{1}{2} C \left(V_{\mathrm{DD}}\right)^2.$$

If the effective capacitance switches at frequency $f$, the dynamic contribution is

$$P_{\mathrm{dynamic}} = \frac{1}{2} C \left(V_{\mathrm{DD}}\right)^2 f.$$

Even without switching, transistors draw leakage current. The static contribution is

$$P_{\mathrm{static}} = I_{\mathrm{leak}} V_{\mathrm{DD}}.$$

The total in this simplified model is their sum. Capacitance and frequency enter linearly; voltage is squared in the dynamic term. This is why voltage scaling saves power, although lower supplies also shrink the electrical room available for reliable logic levels.
