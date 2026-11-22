---
{
  "id": "concept:id1022:interfaces-and-subtyping",
  "courseId": "course:id1022",
  "slug": "interfaces-and-subtyping",
  "title": "Interfaces and subtyping polymorphism",
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": [],
  "summary": "Use one interface to work with objects of several classes.",
  "centralInsight": "An interface constrains which operations callers may use and allows each implementation to choose how they work.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-20-12"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-plan",
    "source:id1022:lecture-12-slides"
  ]
}
---

## A shared type for different implementations
An interface states the methods a caller can rely on. A class implements it by supplying those methods. A variable typed as the interface can hold a value of an implementing class. Calling an interface method runs the implementation belonging to the actual object.

For example, a Shift and a Meeting can both implement Schedulable with a duration method. A function that sums durations needs only that method. It can loop over a list of Schedulable values without asking whether each item is a Shift or a Meeting.

## Distinguish three kinds of polymorphism
Subtyping lets several implementations stand in for one declared type, with overridden methods chosen dynamically. Parametric polymorphism uses type variables so one implementation works across element types. Ad hoc polymorphism gives a shared operation name several type-specific implementations, as with an overloaded operator.

## Check the boundary
An interface-typed caller cannot assume an extra method merely because one implementation provides it. Contrast an interface for a shared capability with an abstract class that can also provide reusable behaviour.
