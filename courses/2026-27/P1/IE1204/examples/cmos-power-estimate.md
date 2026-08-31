---
id: 'example:ie1204:cmos-power-estimate'
courseId: 'course:ie1204'
slug: cmos-power-estimate
title: Estimate total CMOS power
conceptIds:
  - 'concept:ie1204:cmos-power-consumption'
sourceIds:
  - 'source:ie1204:lecture-3-cmos-logic'
lastChecked: '2026-08-31'
confidence: verified
relationships: []
---
Take $C=20\,\mathrm{nF}$, $V_{DD}=1.2\,\mathrm{V}$, $f=1\,\mathrm{GHz}$, and $I_{leak}=20\,\mathrm{mA}$. Then

$$P_{dynamic}=\frac12(20\times10^{-9})(1.2)^2(10^9)=14.4\,\mathrm{W},$$

$$P_{static}=(20\times10^{-3})(1.2)=0.024\,\mathrm{W}.$$

The simplified total is $14.424\,\mathrm{W}$, approximately $14.4\,\mathrm{W}$. In this operating point, the dynamic term dominates.
