---
id: 'example:ii1308:resolve-a-relative-path'
courseId: 'course:ii1308'
slug: resolve-a-relative-path
title: Follow a relative path one component at a time
conceptIds: ['concept:ii1308:filesystem-paths-and-shell']
sourceIds: ['source:ii1308:filesystems-2026']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

The working directory is `/study/week3/code`. The path is `../../data/input.txt`.

The first `..` reaches `/study/week3`; the second reaches `/study`. The remaining components select `/study/data/input.txt`. Moving the script file alone does not change this resolution; changing the running program's working directory does.
