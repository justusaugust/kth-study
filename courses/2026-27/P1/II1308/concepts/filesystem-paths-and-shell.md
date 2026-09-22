---
id: 'concept:ii1308:filesystem-paths-and-shell'
courseId: 'course:ii1308'
slug: filesystem-paths-and-shell
title: Paths and the command shell
summary: Locate files relative to a working directory, distinguish storage locations, and run commands without confusing paths with program names.
outcomeIds: ['outcome:ii1308:command-line']
lectureIds: []
evidenceStatus: curriculum
sourceIds: ['source:ii1308:filesystems-2026']
lastChecked: '2026-09-21'
confidence: supported
relationships: []
---

## Start with the working directory

A filesystem arranges files inside directories. A running program has a current working directory; a relative filename is resolved from there, not automatically from the directory containing the program's source code.

An absolute path starts from a filesystem root. A relative path starts from the current directory. The component `.` means the current directory and `..` means its parent. A filename extension is a naming convention: renaming a PDF to end in `.txt` does not convert its contents.

## Read before changing

On macOS/Linux, `pwd` shows the working directory, `ls` lists entries, and `cd` changes directory. Quote paths containing spaces, for example `cd "practice notes"`. Windows PowerShell provides similar commands but Windows paths normally use drive letters and backslashes.

If your current directory is `/study/week3`, then `../data/readings.txt` identifies `/study/data/readings.txt`. The same relative path from another working directory can identify a different file.

A network home directory and a local disk are different storage locations. A file saved locally does not automatically appear on another computer; check where it was actually saved.

## Programs and files are different

The shell interprets a command and its arguments. Running `python3 analysis.py` starts Python and gives it the script path. Python code belongs in the script or a Python interpreter, not directly in the shell.

Commands such as `cp`, `mv` and `rm` change files. Confirm the working directory and exact target first; do not experiment on your only copy. Use a disposable practice directory for file operations.

Case sensitivity depends on the filesystem: Linux is typically case-sensitive; Windows and common macOS installations are often case-insensitive. Do not depend on that difference—match filenames exactly.
