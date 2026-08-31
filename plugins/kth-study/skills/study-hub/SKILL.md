---
name: study-hub
description: Search, explain, visualise, quiz, or ingest material in the local KTH curriculum study engine.
---

# KTH Study Hub

Use the `kthStudy` MCP tools for the typed local curriculum corpus. Prefer stable entity IDs and structured filters over free-form file searches.

- Start with `search_study_hub` when the entity ID is unknown.
- Use `explain_concept`, `show_visual`, `show_prerequisites`, or `quiz_me` for read-only study work.
- Use `open_in_study_hub` to return the corresponding local page.
- `ingest_lecture` accepts only a path to an already prepared local ingestion JSON transaction. Inspect the proposed files and evidence boundary before calling it.

Source inspection is read-only. Complete KTH course and Canvas material may be retained locally but is not part of the public corpus. Never submit coursework, acknowledge completion, send messages, register or drop courses, or change KTH account state without a separate explicit user instruction.
