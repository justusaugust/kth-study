# KTH Study

KTH Study turns the first-year TCOMK curriculum at KTH into an interactive study hub. It combines course and lecture pages, concise concept explanations, worked examples, self-checks, searchable definitions, and a visual atlas. The same validated curriculum graph powers the web app and the `kth-study` Codex/ChatGPT integration.

The current public corpus covers the 2026 autumn start of:

- SF1690 — Basic Course in Mathematics
- IE1204 — Digital Design
- II1308 — Introduction to Programming

Later TCOMK courses are represented as course records and will gain lecture material as the programme progresses.

## Run locally

```bash
pnpm install
pnpm validate:content -- --root .
pnpm index:content -- --root .
pnpm dev
```

`pnpm dev` starts the web app on `http://127.0.0.1:4173` and the validated local service on `http://127.0.0.1:4318`. A production build is also served by the local service, so plugin links to port 4318 resolve to the same stable study pages.

Set `VITE_CHATGPT_APP_URL` to the public KTH Study app URL after its ChatGPT launch. Until then, the web handoff says that the link is not yet available.

## What is included

- the React/Vite Study Hub
- the typed, file-backed curriculum graph
- authored course, lecture, concept, definition, example, question, and visual records
- the KTH Study MCP server, widget, and Codex plugin
- content validation, unit tests, and browser tests

## Course-material boundary

The repository contains authored study material and links to its sources. Downloaded Canvas files, recordings, textbook archives, raw classroom photographs, personal administration, and local study state are deliberately excluded. KTH and third-party course material remains subject to its owners' access and copyright terms.

Dates and course status can change. Verify consequential deadlines, examinations, registrations, and room information in the current KTH source before relying on them.

Content validation also fails when a past session marked as a lecture has no authored `lectureId`, preventing published lecture coverage from silently falling behind the schedule.

## Verification

```bash
pnpm test
pnpm test:e2e
pnpm build
pnpm build:plugin
```

The browser story covers visual search → explainer → concept → course. The plugin smoke test spawns the generated MCP server over stdio and reads the self-contained explainer widget.

## Lecture ingestion

Prepare a local JSON file, then run:

```bash
pnpm exec tsx scripts/ingest-lecture.ts \
  --root . \
  --course SF1690 \
  --input /absolute/path/to/ingest.json
```

The input shape is:

```json
{
  "lectureId": "lecture:sf1690:2026-08-24-01",
  "sourceFiles": ["/absolute/path/to/original.pdf"],
  "extractedTextFiles": ["/absolute/path/to/extracted.txt"],
  "entities": [
    {
      "entityType": "lecture",
      "id": "lecture:sf1690:2026-08-24-01",
      "courseId": "course:sf1690",
      "slug": "2026-08-24-01"
    }
  ]
}
```

Each entity must include every field required by its domain schema. `entityType` selects the destination schema; the entity's own `kind` remains available for sources and explainers. Ingestion copies originals and extracted text into a staged course tree, validates the complete candidate corpus and search index, then swaps directories atomically. A failed candidate leaves the canonical course tree unchanged.

## Codex plugin

Plugin source is under `plugins/kth-study/`. From a local checkout:

```bash
pnpm build:plugin
python3 ~/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/kth-study
codex plugin marketplace add "$(pwd)"
codex plugin add kth-study@kth-study --json
```

After changing installed plugin source, use the supported cachebuster flow before reinstalling:

```bash
python3 ~/.codex/skills/.system/plugin-creator/scripts/update_plugin_cachebuster.py plugins/kth-study
pnpm build:plugin
codex plugin add kth-study@kth-study --json
```

Start a new Codex task after reinstalling so the updated tools and skill are loaded.

## License

Code and original study material in this repository are available under the [MIT License](LICENSE). Referenced third-party material is not included and retains its original terms.
