---
id: 'concept:sf1690:trigonometric-graphs-and-equations'
courseId: 'course:sf1690'
slug: trigonometric-graphs-and-equations
title: Trigonometric graphs, identities, and equations
summary: Periodicity and symmetry generate all solutions, while amplitude and horizontal scaling explain how sine and cosine graphs change.
outcomeIds: ['outcome:sf1690:solve-and-present', 'outcome:sf1690:read-mathematics']
lectureIds: ['lecture:sf1690:2026-09-09-06']
evidenceStatus: curriculum
sourceIds: ['source:sf1690:canvas-course-plan-26']
lastChecked: '2026-09-09'
confidence: supported
relationships: []
---

## Period and symmetry

Sine and cosine have domain $\mathbb R$, range $[-1,1]$, and period $2\pi$. Sine is odd, $\sin(-x)=-\sin x$, and cosine is even, $\cos(-x)=\cos x$. Tangent has period $\pi$ but excludes $\pi/2+k\pi$ from its domain.

For $f(x)=A\sin(B(x-h))+D$ with $A\ne0$ and $B\ne0$, the amplitude is $|A|$, the period is $2\pi/|B|$, and the midline is $y=D$. The parameter $h$ is the horizontal shift. In $A\sin(Bx+C)+D$, factor out $B$ first: the shift is $-C/B$, not $C$.

## Useful identities

$$
\sin(u+v)=\sin u\cos v+\cos u\sin v
$$

$$
\cos(u+v)=\cos u\cos v-\sin u\sin v
$$

Setting $v=u$ gives $\sin(2u)=2\sin u\cos u$ and $\cos(2u)=\cos^2u-\sin^2u$. These are identities for every real input, not equations with isolated solutions.

## Find every solution

If $\sin x=\sin\alpha$, then $x=\alpha+2k\pi$ or $x=\pi-\alpha+2k\pi$. If $\cos x=\cos\alpha$, then $x=\pm\alpha+2k\pi$. Here $k$ is an integer.

For a restricted interval, generate the families first, then retain only values in that interval. Endpoints matter: $0$ and $2\pi$ are different real inputs even though they reach the same circle point.

Do not divide an equation by $\sin x$ or $\cos x$ before handling cases where that factor is zero; division may discard valid solutions. Inverse-function theory comes later in the course—special angles and circle symmetry already solve many examples.
