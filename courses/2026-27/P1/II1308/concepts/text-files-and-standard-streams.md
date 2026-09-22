---
id: 'concept:ii1308:text-files-and-standard-streams'
courseId: 'course:ii1308'
slug: text-files-and-standard-streams
title: Text files and standard streams
summary: Read and write text safely, distinguish file modes, and separate input, useful output and diagnostics.
outcomeIds: ['outcome:ii1308:simple-programs']
lectureIds: []
evidenceStatus: curriculum
sourceIds: ['source:ii1308:python-files-2026', 'source:ii1308:python-standard-io-2026', 'source:ii1308:python-file-modes']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

## Text is decoded; binary data is bytes

A text stream gives Python strings; a binary stream gives bytes. Text decoding needs the correct encoding. Use explicit `encoding="utf-8"` for a UTF-8 text file; changing the extension does not change the encoding.

Use `with open(...)` to ensure the file closes when the block ends, including on an exception. The `with` statement does **not** ensure that every line has been read: your loop or read call determines that.

## Choose the mode before opening

- `r`: read an existing file.
- `w`: write, truncating an existing file immediately.
- `a`: append writes at the end.
- `x`: create a new file; fail if it already exists.
- `w+`: read and write, but still truncate on opening.

**Source correction:** the Part 7 slide labels `w+` as append. Python defines append as `a`; `w+` is destructive when the file exists. Check the linked Python documentation before experimenting with write modes.

## Lines, blank lines and end of file

Iterating over a text file yields its lines, usually including their trailing newline. `print(line, end="")` avoids adding a second one. A blank line is commonly `"\\n"`; `readline()` returning `""` means end of file. Do not confuse an empty-looking line with EOF. The last line need not end in a newline.

For numeric input, convert each string explicitly. `int(line)` or `float(line)` can fail on invalid text; decide whether blank lines are allowed rather than silently turning them into zero.

## Input and output are streams

Every ordinary command-line program has standard input, standard output and standard error. `input()` reads a line and returns text; its prompt is written to standard output. `sys.stdin` can instead be processed line by line without prompts, whether it comes from a terminal, file or pipe.

Keep useful results on stdout and diagnostic messages on stderr. This makes a program usable in a pipeline without mixing error text into data. In a POSIX shell, `<` redirects input, `>` redirects output (overwriting the target), and `|` sends one program's stdout to the next program's stdin. Never redirect output to the same file you are trying to read: the shell can truncate it before the program starts.

Process large inputs one line at a time when possible. Reading everything into memory may work for a small example but is unnecessary for counting or filtering lines.
