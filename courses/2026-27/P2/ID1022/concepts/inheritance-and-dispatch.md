---
{
  "id": "concept:id1022:inheritance-and-dispatch",
  "courseId": "course:id1022",
  "slug": "inheritance-and-dispatch",
  "title": "Classes and inheritance",
  "lastChecked": "2026-11-22",
  "confidence": "supported",
  "relationships": [],
  "summary": "Trace inherited methods, overrides, and abstract classes.",
  "centralInsight": "The caller sees the declared type, while an overridden method runs according to the actual object.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-18-11"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-plan",
    "source:id1022:lecture-11-slides"
  ]
}
---

## Inherit shared behaviour
A subclass can inherit a base class method unchanged or replace it with an override. In the Pyking examples, use the override marker when replacing an inherited method. An inherited method can call another method on the same receiver, and that call dispatches to the receiver's implementation.

Consider a base class Employee with a label method that uses role(). An Engineer overrides role(). Calling label on an Engineer uses the inherited label body, but its call to role runs Engineer's override.

## Abstract classes
An abstract class can specify a method that concrete subclasses must implement and still provide ordinary methods with bodies. Code can accept the abstract base type and work with different concrete subclasses. Instantiate a concrete subclass that fulfils the required methods.

## Trace two questions separately
First ask which methods the declared type exposes. Then, for a valid call to an overridden method, ask which object is actually receiving it. A method introduced only in a subclass need not be callable through a base-typed reference.
