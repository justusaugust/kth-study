---
{
  "id": "concept:id1022:objects-methods-and-events",
  "courseId": "course:id1022",
  "slug": "objects-methods-and-events",
  "title": "Objects, methods, and events",
  "summary": "Bundle state with methods, understand self, and distinguish immutable updates from mutable event handlers.",
  "centralInsight": "A method operates on a receiver; whether it returns a new object or changes that receiver is a separate decision.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-16-10"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-10-slides"
  ],
  "lastChecked": "2026-11-17",
  "confidence": "supported",
  "relationships": []
}
---

## Objects and receivers

A class describes fields and methods; an object is an instance. In the lecture's Pyking examples, the first method parameter is self. Calling an object's method supplies that receiver implicitly. Two instances can have different state even though they use the same method definition.

## Immutable and mutable updates

An immutable method returns a new instance. If a counter starts at 2 and increment returns a new counter, the original still holds 2 while the returned counter holds 3. Retain the returned value when you want the new version.

A mutable method instead changes a field in the existing object. Two references to that object observe the same updated field. Two separately constructed counters are independent. Encapsulation hides representation behind methods so callers use the supported operations instead of breaking invariants directly.

## Event-driven control flow

Build the interface and register callbacks. The event loop invokes the handler later when a click or key event arrives. Passing a handler differs from invoking it during setup. Trace initialisation separately from each event.

An event handler can update model state, then redraw the view from that state. For a counter with initial value 2, three click events produce 3, 4 and 5. A repaint alone should not increment the model. Avoid scattering competing copies of the same state across labels and objects.

## Study route

Draw the references before two objects interact. Predict an immutable method's old and new values, repeat with a mutable method, then trace two events in order. Review [mutation and aliasing](/courses/id1022/concepts/mutation-and-aliasing) when shared state is surprising.
