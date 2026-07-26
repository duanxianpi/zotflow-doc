---
sidebar_position: 14
---

# Troubleshooting (By Symptom)

This page gives you the quickest diagnostic path based on the symptom you're experiencing.

## Symptom 1: API Key Verification Fails

Check in order:

1. Whether the key was copied in full.
2. Whether your Zotero account is signed in and accessible.
3. Whether the key includes permissions for the relevant library.
4. Whether the network can reach the Zotero API.

If it's a group library issue, recreate the key and explicitly authorize that group.

## Symptom 2: Can Sync but Can't Edit

Common root causes:

1. The library mode is Read Only.
2. The API Key lacks write permission.
3. Missing notes permission, which disables child note operations.

Resolution:

1. Confirm library mode in Sync settings.
2. Recreate a key with write/notes permissions.
3. Run Verify + Sync again.

## Symptom 3: Annotations Not Written Back to Zotero

Check in order:

1. Whether the attachment comes from the Library Reader (not Local Reader).
2. Whether the library is Bidirectional.
3. Whether a sync task has been executed.

Note: Local Reader annotations are written to `.zf.json` and are never written back to Zotero.

## Symptom 4: Source Note Content "Reverted"

Root cause:

- You edited a template-owned area, and it was regenerated on re-render.

Suggestions:

1. Free-form notes about the source → write inside a **persist region** (template-declared, local-only, survives every re-render).
2. Thoughts that should reach Zotero → write in the **Item Note** region (synced back).
3. Structured fields (rating, status) → custom frontmatter keys (never touched).
4. Cross-paper synthesis → standalone notes linked back to Source Notes.

See the [ownership model](concepts.md#-distill--content-ownership-inside-a-source-note).

## Symptom 5: Citation Insertion Issues

### Case A: Trigger Character Doesn't Open Popup

1. Check the trigger character setting.
2. Check whether the current editor supports suggestion popups.

### Case B: Output Format Not as Expected

1. Check the default citation format.
2. Check whether a modifier key was pressed, overriding the default.
3. Check whether template customization is overriding built-in behavior.

### Case C: Wikilink Jump Fails

1. The target Source Note may not exist.
2. Trigger Source Note creation for that item first.

## Symptom 6: Local Attachments Won't Open or Missing Images

1. If using WebDAV, check the server URL and credentials.
2. If using Linked Attachments, check the base directory path.
3. If using cache, make sure the cache hasn't been purged and has sufficient capacity.

## Self-Check Checklist (Before Filing a Bug Report)

1. ZotFlow version.
2. Obsidian version and platform.
3. Sync mode and permission configuration screenshots.
4. Reproducible steps (minimal steps).
5. Relevant log excerpts.

## Related Pages

- [Quick Start & Setup](getting-started.md)
- [Working Model Overview](concepts.md)
- [Settings Reference](settings-reference.md)
