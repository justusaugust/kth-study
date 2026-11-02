---
{
  "id": "concept:id1022:shell-and-git-workflow",
  "courseId": "course:id1022",
  "slug": "shell-and-git-workflow",
  "title": "A small shell and Git workflow",
  "summary": "Know the working directory and inspect the selected snapshot before recording it.",
  "centralInsight": "Staging captures the selected file content now, so a later edit is not automatically part of the next commit.",
  "outcomeIds": [],
  "lectureIds": [
    "lecture:id1022:2026-11-02-04"
  ],
  "evidenceStatus": "lecture",
  "sourceIds": [
    "source:id1022:lecture-plan"
  ],
  "lastChecked": "2026-11-02",
  "confidence": "supported",
  "relationships": [],
  "commonMistake": "Assuming that editing a staged file automatically updates its staged snapshot.",
  "verifyPrompt": "Explain what each of the working tree, staging area, and recorded commit contains."
}
---

## Locate the project

The shell runs commands relative to a working directory. `pwd` shows that directory, `ls` lists entries, and `cd folder` moves into a folder. Quote paths containing spaces. Commands act on their path arguments, not on whichever editor tab is open.

## Review a change

In a disposable repository, make one small text change. Run `git status`, then `git diff`. Stage one file with `git add notes.txt`, and inspect `git diff --staged` before recording a commit with a short message.

`git diff` shows unstaged changes to tracked files. `git diff --staged` shows the proposed snapshot relative to the previous commit. `git status` also identifies new untracked files. A commit records a snapshot locally; it does not upload anything.

## Keep three states distinct

The working tree contains current files. The staging area selects the next snapshot. A commit records that snapshot in history. Editing a file after staging it creates unstaged changes alongside the staged version; review both.

Avoid deletion commands and history rewrites during this practice. Do not put credentials or private account data in a repository. Follow the course's specific repository and assessment instructions for assessed work.
