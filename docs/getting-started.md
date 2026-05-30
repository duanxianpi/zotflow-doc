---
sidebar_position: 2
---

# Quick Start & Setup

:::tip
After completing your first sync, we recommend reading the [working model overview](concepts.md).
:::

---

## Step 1: Installation

### Method A — Community Plugins (Recommended)

1. Obsidian → **Settings (⚙️) → Community plugins**
2. Make sure **Restricted mode** is turned off
3. Click **Browse**, search for **ZotFlow**, click **Install**, then **Enable**

Direct link: [https://community.obsidian.md/plugins/zotflow](https://community.obsidian.md/plugins/zotflow)

### Method B — Pre-release (BRAT)

For users who want early access to new features not yet in stable release:

1. **Install BRAT**
   - Obsidian → **Settings → Community plugins**
   - Browse for "BRAT", install and enable

2. **Add ZotFlow Beta**
   - In Community plugins, click **Options** next to BRAT
   - Click **Add Beta plugin**
   - Enter repository URL: `duanxianpi/obsidian-zotflow`
   - Click **Add Plugin**

3. **Enable ZotFlow**
   - Go back to **Settings → Community plugins**, find ZotFlow and turn it on

---

## Step 2: Connect Zotero

### Prerequisite: Zotero Data Sync

ZotFlow fetches library data via the Zotero Web API, so your items must be synced to Zotero cloud first:

1. Open **Zotero Desktop** → **Edit → Settings → Sync** (on macOS: **Zotero → Preferences → Sync**)
2. Sign in with your Zotero account and make sure **Data Syncing** is enabled
3. Click **Sync** (green circular arrow) and wait for it to complete

### Attachment (PDF) Storage Strategy

Zotero syncs item metadata for free, but attachment files require storage space. If your attachment library is large, you have three options:

| Option             | Details                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Zotero Storage** | Built-in, zero config. Free 300 MB. Paid plans from $20/year (2 GB). [View plans →](https://www.zotero.org/storage)                                                                              |
| **WebDAV**         | Self-hosted or third-party (e.g., [Box](https://www.box.com), [pCloud](https://www.pcloud.com), [koofr](https://koofr.eu)). Free tiers available. Configure in Settings → ZotFlow → WebDAV       |
| **Linked files**   | Store PDFs in any local directory (or third-party cloud), referenced by Zotero as links. Set the base directory in Settings → ZotFlow → General → Linked Attachment Base Directory. Desktop-only |

> You can use Source Note, citations, and Tree View normally without attachment sync — those only need metadata. Attachment storage only affects whether you can open PDFs in the ZotFlow reader.

### Create an API Key

1. Open [https://www.zotero.org/settings/keys/new](https://www.zotero.org/settings/keys/new)
2. Give the key a descriptive name (e.g., "ZotFlow")
3. Under **Personal Library**, check **Allow library access** and **Allow write access** (the latter is required for bidirectional sync)
4. If you need to edit Zotero Item Notes, check **Allow notes access**
5. If you use Group Libraries, authorize the target groups as needed
6. Click **Save Key** and copy the generated key

### Enter Key and Verify

1. Open **Settings → ZotFlow → Sync**
2. Paste the API Key into the **API Key** field
3. Click **Verify Key**
   - ZotFlow validates the key, fetches user info, and discovers all accessible libraries
   - On success, a **Verified** badge appears next to the field
4. The **Library Synchronization** table appears, listing all accessible libraries

### Choose a Sync Mode per Library

For each library in the table, select a sync mode:

- **Bidirectional** — Pull + push (recommended for your primary personal library)
- **Read Only** — Pull only (suitable for shared group libraries, review scenarios)
- **Ignored** — Skip entirely during sync

This configuration can be changed at any time.

---

## Step 3: First Sync

1. Click the **ZotFlow icon** in the left ribbon to open **Activity Center**
2. Switch to the **Sync** tab
3. Click **Sync All** to sync all non-Ignored libraries, or click **Sync** on an individual library
4. Monitor progress in the **Tasks** tab
5. Once tasks complete, your Zotero items are locally cached and available offline

---

## Step 4: Browse Your Library

1. Open **Zotero Tree View**:
   - Command palette → `ZotFlow: Open Zotero Tree View`, or
   - Click the Library icon in the left sidebar
2. Expand the Library → Collection → Item → Attachment hierarchy
3. Use the top search bar to filter items
4. **Double-click** an attachment to open it in the reader
5. **Drag** a regular item into any editor to insert a citation

---

## Main UI Panels

ZotFlow has three main interaction panels, which you've already used in the steps above. Here's a quick overview:

### Tree View

Library → Collection → Item → Attachment hierarchy browser (sidebar). Search and filter, drag citations, right-click for batch operations, double-click to open attachments/notes.

### Search Modal

Invoke via `ZotFlow: Search Zotero Library` or the ribbon icon. Real-time search across cached items, press Enter to jump to an attachment.

### Activity Center

Central control panel (opened via ribbon icon), five tabs:

- **Sync** — Trigger full or single-library sync, resolve conflicts
- **Tasks** — Monitor Active / Queued task progress
- **Template** — LiquidJS template sandbox with live preview
- **Repair** — Fix broken Block References caused by re-renders
- **Telemetry** — Runtime logs filterable by level

---

## Step 5: Optional Configuration

### WebDAV (Self-hosted Attachment Storage)

If your attachments are on a WebDAV server rather than Zotero cloud:

1. **Settings → ZotFlow → WebDAV**
2. Enable **WebDAV Sync**
3. Fill in **Server URL**, **Username**, **Password**
4. Click **Verify & Connect**

### Attachment Cache

ZotFlow caches downloaded attachments for faster repeat access:

- **Settings → ZotFlow → Cache → Enable Cache** (on by default)
- Set **Size Limit** (MB, default 500 MB). LRU eviction when the limit is reached
- Click **Purge Cache** to clear all cached files

### Linked Attachment Base Directory

If you use Linked Attachment Base Directory in Zotero (Zotero → Preferences → Advanced → Files and Folders), you need to tell ZotFlow where the files actually live:

1. **Settings → ZotFlow → General → Linked Attachment Base Directory**
2. Enter the **same absolute path** as in Zotero settings (e.g., `D:\Papers` or `/Users/name/Papers`)
3. An attachment stored as `attachments:papers/foo.pdf` will resolve to `D:\Papers\papers\foo.pdf`

Skip this if you don't use linked attachments.

### Local Reader (Vault Files)

To use the ZotFlow reader for any PDF/EPUB/HTML file inside your vault:

1. **Settings → ZotFlow → General → Overwrite PDF/EPUB/HTML Viewer** → Enable
2. **Restart Obsidian**
3. PDF/EPUB/HTML files in your vault are now opened by the ZotFlow reader, with annotations written to a co-located `.zf.json` sidecar file

---

## Common Roadblocks

### Verify Key Fails

- Make sure the key was copied in full
- Check that the Zotero key permissions cover the target libraries
- Check network access to the Zotero API (`api.zotero.org`)

### No Libraries Visible

- Usually means the key's permission scope doesn't include those libraries
- Recreate the key and explicitly authorize the relevant Group Libraries

### Can Read but Not Write

- The library mode may be set to Read Only
- The key may lack write or notes permissions
- Confirm library mode in Sync settings, recreate the key if needed

### Can't Expand Library/Collection in Tree View

- Sync may be incomplete
- Click the Sync tab to check status, wait for completion, then click the Tree View refresh button

---

## Next Steps

Now that you have a working ZotFlow, we recommend exploring in this order:

- **[Working Model Overview](concepts.md)** — Understand the design philosophy and sync boundaries; all subsequent features will make more sense
- **[Reader & Annotations](reading-and-annotating.md)** — Reader features, annotation types, image extraction, drag behavior
- **[Source Note](source-notes.md)** — When Source Notes update, frontmatter merging, version-aware re-rendering
- **[Citation & Writing Flow](citation-guide.md)** — Each citation insertion method, bringing in annotation context
- **[Template System](template-guide.md)** — Complete LiquidJS variable and filter reference
