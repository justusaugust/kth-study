---
{
  "id": "concept:id1022:rhythm-and-timing",
  "courseId": "course:id1022",
  "slug": "rhythm-and-timing",
  "title": "Audio effects and rhythm timing",
  "summary": "Convert BPM to seconds and distinguish event times from pauses.",
  "centralInsight": "Place events on a timeline first; delays are the gaps between events.",
  "outcomeIds": [],
  "lectureIds": [],
  "evidenceStatus": "curriculum",
  "sourceIds": [
    "source:id1022:proggame-control-flow",
    "source:id1022:proggame-loops"
  ],
  "lastChecked": "2026-11-06",
  "confidence": "supported",
  "relationships": []
}
---

## Turn tempo into a duration

At tempo $b$ beats per minute, one beat lasts $60/b$ seconds and a half-beat lasts $30/b$ seconds. Tempo must be positive; zero would make the conversion undefined and a negative tempo has no useful meaning here.

At 90 BPM, one beat is $2/3$ second and a half-beat is $1/3$ second. A four-beat bar lasts $8/3$ seconds. Sketch the bar before writing any playback calls.

## Separate events from elapsed time

TinyWeb loads a sound with `tw.load_sample(...)`, plays it with `tw.play(...)`, and pauses with `tw.sdelay(seconds)`. Load reusable samples once before a repeating loop. A sample name must exist in the current environment; lesson assets are not automatically available in every playground.

Several sounds can belong to the same time position. Play those sounds before inserting the next delay. If two sounds are simultaneous, adding a delay between them changes the rhythm.

For an independent three-event example at times 0, 0.4 and 1.0 seconds, the gaps are 0.4 and 0.6 seconds. A finite sequence ending with the third event needs no trailing pause unless the specification asks for a total duration.

## Finite and repeating patterns differ

A repeating bar needs the gap from its final event to the first event of the next bar. Without that gap, the next bar begins too early. Conversely, adding that wrap-around gap to a finite one-shot sequence may add an unwanted final effect.

Silent subdivisions do not require separate delay calls when one delay can express the full gap. Judge equivalence against the actual specification: some exercises check the sequence of effect calls as well as the audible result.

## Combine conditions with a schedule

The schedule answers when an instrument could play; the input condition answers whether it is enabled. Keep those decisions separate. An instrument being disabled should not accidentally remove time from a fixed-duration pattern.

Use [immutable loops](/courses/id1022/concepts/immutable-loops-and-state) to trace the repeating state, and [functions and effects](/courses/id1022/concepts/functions-and-effects) to distinguish a returned value from playback.
