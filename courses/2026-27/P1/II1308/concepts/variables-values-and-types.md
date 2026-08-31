---
id: 'concept:ii1308:variables-values-and-types'
courseId: 'course:ii1308'
slug: variables-values-and-types
title: 'Variables, values, and data types'
summary: >-
  In Python a variable name refers to a value object, and the value—not the
  name—carries its data type.
centralInsight: >-
  Assignment changes a binding: after x = expression, the name x refers to the
  value produced by that expression.
commonMistake: >-
  Imagining a Python variable as a typed box, or forgetting that input always
  returns text and must be converted before numerical arithmetic.
verifyPrompt: >-
  Trace three assignments to the same name and state the referenced value and
  its type after each line.
outcomeIds:
  - 'outcome:ii1308:programming-concepts'
  - 'outcome:ii1308:simple-programs'
lectureIds:
  - 'lecture:ii1308:2026-08-25-01'
evidenceStatus: lecture
sourceIds:
  - 'source:ii1308:python-variables'
lastChecked: '2026-08-26'
confidence: supported
relationships:
  - type: appears_in
    from: 'concept:ii1308:variables-values-and-types'
    to: 'lecture:ii1308:2026-08-25-01'
  - type: requires
    from: 'concept:ii1308:variables-values-and-types'
    to: 'concept:ii1308:sequence-selection-iteration'
  - type: continues_to
    from: 'concept:ii1308:variables-values-and-types'
    to: 'concept:ii1308:characters-and-strings'
---
## Names point to values

In Python, `x = 5` binds the name `x` to an integer value. The data type belongs to the value. A later assignment may bind the same name to a value of another type:

```python
x = 5          # int
x = 0.7071     # float
x = "KTH"      # str
```

Only the last binding is current. Python is dynamically typed because a name is not permanently restricted to one data type.

## The first basic types

- `int`: whole numbers such as `5` and `-12`
- `float`: floating-point numbers such as `3.14`
- `bool`: the logical values `True` and `False`
- `str`: sequences of text characters

## Expressions produce values

An expression specifies a computation. Assignment evaluates the right-hand side first, then binds the left-hand name to the result:

```python
width = 8
area = width * width
```

After these lines, `area` refers to the integer value `64`.

## Input is text until converted

`input()` always returns a string. If the program needs a number, convert explicitly:

```python
age_text = input("Age: ")
age = int(age_text)
```

`int()`, `float()`, and `str()` construct values of the requested type when conversion is possible.
