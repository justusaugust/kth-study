---
id: 'question:ii1308:file-modes-and-eof'
courseId: 'course:ii1308'
slug: file-modes-and-eof
title: Avoid truncation and false end-of-file checks
conceptIds: ['concept:ii1308:text-files-and-standard-streams']
hints: ['Append mode and read/write mode are different. A blank line still contains a newline character.']
answer: 'Use a to append; w+ would truncate the existing file. A readline result of \\n is a blank line, not EOF; the empty string indicates EOF.'
sourceIds: ['source:ii1308:python-files-2026', 'source:ii1308:python-file-modes']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

You want to add text without erasing an existing file. Choose `a` or `w+`. Does `readline()` returning `"\\n"` mean end of file?
