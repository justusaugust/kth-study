---
id: 'concept:ie1204:fixed-and-floating-point'
courseId: 'course:ie1204'
slug: fixed-and-floating-point
title: 'Fixed-point and floating-point representation'
summary: 'Separate a stored word from its scale and distinguish precision, range and rounding in fractional representations.'
centralInsight: 'The integer encoding and its scale together determine the represented value.'
outcomeIds: ['outcome:ie1204:analyse-circuits', 'outcome:ie1204:number-systems']
lectureIds: ['lecture:ie1204:2026-10-08-14']
evidenceStatus: lecture
sourceIds: ['source:ie1204:lecture-14-arithmetic']
lastChecked: '2026-10-12'
confidence: supported
relationships: []
---

## Fixed point attaches a scale to an integer

With $f$ fractional bits, decode the stored integer $I$ using the declared signedness, then compute $x=I\,2^{-f}$. Resolution is $2^{-f}$. For $N$ signed two's-complement bits, the range is $-2^{N-f-1}$ through $2^{N-f-1}-2^{-f}$.

For eight signed bits with three fractional bits, 11110100 is integer $-12$, hence value $-1.5$. The representable range is $-16$ through $15.875$, in steps of $0.125$. The binary point is a convention, not an extra stored bit.

Add only after aligning scales. Multiplying two integer encodings with $f_1$ and $f_2$ fractional bits creates a product with $f_1+f_2$ fractional bits. Rescaling discards precision unless the removed bits are all zero; choose and state the rounding policy. Widen intermediates to avoid overflow before rescaling.

## Floating point changes the scale

A normal IEEE binary32 value uses one sign bit, eight exponent bits and 23 fraction bits. For exponent field $E$ between 1 and 254 and fraction integer $F$, its value is $(-1)^s(1+F/2^{23})2^{E-127}$. The leading one is implicit for normal values.

Exponent field zero is reserved for signed zero and subnormal values: the implicit leading bit is zero, with exponent $-126$. Exponent field 255 represents infinities when the fraction is zero and NaNs otherwise. Do not apply the normal formula to these encodings.

## Range and precision are different

Floating point covers a wider magnitude range, but neighbouring representable values are farther apart at larger magnitudes. A long decimal expansion may not be representable exactly in binary. During addition, align exponents, combine significands, normalize and round. A sufficiently small addend can disappear when rounded to the larger operand's precision.

For multiplication, multiply significands, add unbiased exponents, normalize and round. For division, divide significands and subtract unbiased exponents. Overflow, underflow and rounding are properties of the representation, not evidence that the corresponding real-number arithmetic has stopped making sense.
