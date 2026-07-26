---
sidebar_position: 7
---

# Markdown Syntax Support

Item Notes live in two places at once: as Markdown in your vault, and as a Zotero
note. Every sync converts between the two.

Zotero's note format is a fixed set of building blocks — paragraphs, headings,
lists, tables, links, a few text styles. Obsidian's Markdown is larger than that,
and Obsidian adds syntax of its own on top. So the conversion has to decide, for
every construct, what to do when one side has no way to express what the other
just said.

This page tells you exactly what those decisions are, so you do not have to
discover them by losing something.

## How to read this page

Everything falls into one of three outcomes:

| Outcome | Meaning |
| --- | --- |
| **Kept** | Comes back exactly as you wrote it. |
| **Reformatted** | Same document, different spelling. Nothing is lost — you may just see a one-time diff. |
| **Not supported** | Changes meaning, or disappears. Listed with what to do instead. |

If you only read one section, read [Not supported](#not-supported).

## Kept

All of the following survive a round trip unchanged.

### Obsidian syntax

| You write | Notes |
| --- | --- |
| `[[Note]]`, `[[Note\|alias]]` | Including `[[Note#Heading]]`, `[[Note#^block-id]]`, `[[#Heading]]` |
| `![[Note]]`, `![[image.png]]` | Including `![[image.png\|400]]`, `![[image.png\|400x260]]`, `![[doc.pdf#page=3]]` |
| `#tag`, `#nested/tag` | At the start of a line or mid-sentence |
| `^block-id` | Block identifiers |
| `==highlight==` | |
| `> [!note]` callouts | Including titles, folding (`[!note]-` / `[!note]+`) and nesting |
| `^[inline footnote]` | May wrap across lines |
| `[^1]` and `[^1]: definition` | |
| `%%comment%%` and `%%` blocks | |

### Standard Markdown

| You write | Notes |
| --- | --- |
| `#` … `######` | |
| `**bold**`, `*italic*`, `~~strike~~` | |
| `` `code` `` and fenced blocks | The **contents** of a fence are never touched — see [Safe by design](#safe-by-design) |
| `> quote` | Including nesting |
| Lists, nested lists | |
| `- [x]` / `- [ ]` tasks | Including nested tasks |
| Tables | Including alignment and escaped pipes (`\|`) |
| `$maths$` and `$$maths$$` | |
| `[text](url)`, bare URLs, `![alt](url)` | |
| `<u>`, `<sub>`, `<sup>` | Nested formatting inside them is kept |
| Emoji, CJK, right-to-left text | Including multi-part emoji such as 👨‍👩‍👧‍👦 |

### Zotero's own content

Citations, highlights, annotations and coloured text created in Zotero are
preserved exactly, including the hidden data that makes them clickable in
Zotero. Editing the surrounding text in Obsidian will not damage them.

## Reformatted

These come back meaning the same thing, spelled differently. You will see a
one-time difference after the first sync and nothing after that.

```md
- item          →   * item            list markers
---             →   ***               horizontal rules
Title           →   # Title           "underline" headings become #
=====
>> quote        →   > > quote         nested quote spacing
<https://x>     →   https://x         plain URLs stay plain
&amp;           →   &                 HTML entities resolve
[a][ref]        →   [a](url)          reference links become direct links
[ref]: url
```

Tables are also padded so the columns line up:

```md
| A | B |          | A              | B      |
| --- | --- |  →   | -------------- | ------ |
| longer | b |     | longer         | b      |
```

:::tip Line breaks
Whether a single newline becomes a visible line break depends on Obsidian's
**Strict line breaks** setting (Settings → Editor). ZotFlow reads that setting
and converts both directions consistently with it, so you do not need to do
anything — but the exact output differs between the two modes.
:::

## Not supported

### Code block languages

```md
you write        ```python          after sync    ```
                 code()                           code()
                 ```                              ```
```

The code itself is safe — only the language name is dropped. Zotero's note
format has no place to store it.

**Most visible consequence:** a ` ```mermaid ` diagram stops rendering as a
diagram and shows its source instead.

**What to do:** if a note contains diagrams you care about, keep it as a
regular vault note rather than an Item Note. Syntax highlighting in Obsidian is
the only other thing you lose.

### YAML frontmatter

```md
you write        ---                after sync    (mangled)
                 title: My note
                 ---
```

Frontmatter belongs to a vault note, not to a Zotero note — Zotero has nowhere
to keep it. Item Notes should not contain it.

**What to do:** put properties on the vault note that links to the item, not in
the Item Note body.

### Custom checkbox statuses

```md
you write        - [x] done         after sync    - [x] done
                 - [/] started                    - \[/] started
```

Standard `- [x]` and `- [ ]` tasks are fine. The extra statuses from the
**Tasks** community plugin (`[/]`, `[?]`, `[-]`, `[>]`, `[!]`, `["]`) come back
with a backslash and stop being recognised as statuses.

Nothing is destroyed — the text is still there and still readable — but the
plugin no longer sees a status.

**What to do:** use standard checkboxes in Item Notes, and keep custom statuses
in ordinary vault notes.

### Unused link definitions

```md
you write        See [the manual][m].     after sync   See [the manual](https://x).
                 [m]: https://x

                 [unused]: https://y                   (line deleted)
```

A definition that is **used** is fine — the link simply becomes a direct one,
pointing at the same place.

A definition that nothing refers to is **deleted**. If you keep a block of link
definitions at the bottom of a note for later use, they will not survive.

**What to do:** write links directly as `[text](url)` in Item Notes.

### Wikilinks containing `*` or backticks

```md
you write        [[my*note*name]]     after sync    \[\[my*note*name]]
```

Markdown reads `*note*` as italics before ZotFlow ever sees the link, so the
link cannot be put back together.

Underscores are **not** affected — `[[snake_case_note]]` is fine, because
Markdown does not treat underscores inside a word as italics.

**What to do:** avoid `*` and backticks in note titles you link to. Almost all
other punctuation is fine, including `&`, `_`, `~`, `(`, `)` and non-Latin
scripts.

### A `|` inside maths inside a table

```md
you write (in Zotero)    | $a|b$ | second |
after sync               the row is split and the last cell is lost
```

This one can only happen to maths written in **Zotero's** editor — Markdown
cannot express it, because the `|` would end the table cell first. In a table,
`|` is a column separator, and maths content cannot be escaped without
corrupting the formula.

**What to do:** if a formula in a table needs a vertical bar, write it as
`\vert` or `\mid`.

## Safe by design

Some things are worth stating because people reasonably worry about them.

**Anything inside a code block or inline code is never touched.** A note that
documents Markdown syntax — wikilinks, callouts, task syntax, embeds, tag
examples — comes back byte for byte:

````md
```markdown
[[wikilink]]        these are examples, not links
![[embed.png]]      and they stay examples
> [!note]
- [x] task
#tag
```
````

**Zotero's citations and annotations are preserved exactly**, including the data
behind them. Editing text around a citation in Obsidian will not break it.

**Non-Latin text, emoji and right-to-left scripts** round-trip unchanged,
including multi-part emoji and rare characters.

**Syncing repeatedly does not accumulate changes.** After the one-time
reformatting described above, a note that is not edited stays byte-identical
across any number of syncs.

## Reporting something else

If you find syntax that changes and is not on this page, that is a bug worth
reporting — the list above is meant to be complete. Please include what you
wrote and what you got back.
