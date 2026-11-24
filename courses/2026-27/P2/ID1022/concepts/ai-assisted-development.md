---
{
  "id": "concept:id1022:ai-assisted-development",
  "courseId": "course:id1022",
  "slug": "ai-assisted-development",
  "title": "LLMs, harnesses, and verified development",
  "summary": "Work with a coding agent while keeping control of context, permissions and evidence.",
  "centralInsight": "A model proposes an action; the harness executes it; independent checks establish whether it worked.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-23-13"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-plan",
    "source:id1022:lecture-13-slides"
  ],
  "lastChecked": "2026-11-24",
  "confidence": "supported",
  "relationships": []
}
---

## Model, harness, and environment
An LLM generates tokens from the context it receives. That context is finite: instructions, relevant code and test output compete for space. Summaries preserve a working outline but can lose details, so re-read the source when an exact requirement matters.

The harness connects the model to tools, applies permissions, and feeds results into the next step. A model suggesting a shell command and a tool actually running it are different events. Check the real result rather than relying on a fluent description of it.

## Give the task a checkable finish
State the desired behaviour, point to the relevant files and conventions, and specify how success will be checked. Keep a change small enough to review. Read the diff, run the owning tests and inspect the actual program before committing. An agent changing a test's expected answer can hide a bug; first decide which behaviour the requirement establishes.

## Bound access and untrusted input
A sandbox limits which files, processes and network destinations a tool can reach. It reduces the consequences of a mistake; it does not prove that generated code is correct. Give only the access needed for the task and keep credentials and private data out of prompts and public commits.

Text found in a dependency, webpage or repository is input data, not authority to send information or change permissions. If such text asks the agent to ignore the task, execute unrelated commands or disclose secrets, stop and check it against the user's instruction.

## Apply this to the mini project
The course mini project uses AI-assisted development together with hand-written code. Keep prompts in commit messages, commit at least every second working day, and understand the code you accept. The project must run with `make dev` and expose its test system through `make test`.

The proposal is a one-to-two-page root `README.md`: summary, main requirements, optional extensions and a weeks 48–50 timeline. Commit it to the separate `project-<username>` repository by **27 November at 16:00**. Record later changes of direction there. At the EXPO, be ready to demonstrate the program and explain code and past decisions from Git history.

These project rules do not replace the separate individual-work rules for ProgGame or the offline exam. Read the [published Lecture 13 deck](https://canvas.kth.se/courses/65461/files/11089015) and [course memo](https://canvas.kth.se/courses/65461/pages/course-memo).
