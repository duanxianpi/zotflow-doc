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

### Choose How ZotFlow Opens Attachments

:::important[ZotFlow requires data sync, not attachment file sync]
ZotFlow needs Zotero **Data Sync** so it can retrieve your items, notes, tags,
collections, and attachment metadata through the Web API. Zotero's separate
**File Syncing** option (`Sync attachment files in My Library using`) is
optional. You can disable attachment file syncing and still use ZotFlow's Tree
View, Source Notes, citations, sync, and other metadata-based features. Zotero
also documents that [Data Sync can be used without File Syncing](https://www.zotero.org/support/sync#data_syncing).
:::

Attachment file syncing is useful when you want to open attachments in ZotFlow
on mobile, on a computer without Zotero installed, or on another computer where
Zotero has not downloaded the file. Choose a method based on where you use
ZotFlow:

- **One desktop computer with Zotero installed, with no need for cross-device
  attachment access:** use **Zotero local storage**. This is the recommended
  path because ZotFlow reads Zotero's existing local copy directly. If File
  Syncing is already enabled only for ZotFlow and you use a single computer,
  you may turn it off after ensuring all attachments are saved locally;
  leaving it enabled is also fine.
- **Mobile or another computer without a local Zotero installation:** use
  **Zotero Cloud Storage** or **WebDAV** so ZotFlow can download the attachment
  from a remote service. For additional desktop computers, another option is
  to synchronize a linked-file folder with third-party cloud storage and set
  **Linked Attachment Base Directory** on each computer. Linked files do not
  work on mobile. See [Zotero's linked-files documentation](https://www.zotero.org/support/attaching_files#linked_files)
  and the [setup guide below](#linked-attachment-base-directory).
- **Already using Zotero Cloud Storage, WebDAV, or linked files:** keep your
  existing strategy and configure the matching option in ZotFlow.

| Method | Best fit | Details |
| ------ | -------- | ------- |
| **Zotero local storage** | One desktop computer with Zotero installed; no cross-device attachment access required | Reads Zotero's downloaded copy from its local `storage` directory. Avoids another download and ZotFlow cache copy. Desktop-only |
| **Zotero Cloud Storage** | Mobile, multiple computers, group libraries, or computers without Zotero installed | Zotero's built-in file sync with 300 MB free storage. [View plans →](https://www.zotero.org/storage) |
| **WebDAV** | Mobile or multiple computers using a personal library and an existing WebDAV service | Configure under **Settings → ZotFlow → WebDAV**. Zotero WebDAV file sync does not support group libraries |
| **Linked files** | Existing linked-file workflows or externally synchronized attachment folders | Configure **Linked Attachment Base Directory** under **General → Source Notes → Library Source Note**. Desktop-only |

### Read from Zotero's Local Storage Directory

If Zotero and Obsidian run on the same desktop computer, ZotFlow can read
stored attachments directly from Zotero's local data directory:

1. Make sure Zotero has downloaded the attachment on this computer.
2. Open **Settings → ZotFlow → General → Source Notes → Library Source Note**.
3. Enable **Use Zotero Storage Directory**.
4. Set **Zotero Storage Path** to the complete absolute path of Zotero's
   `storage` directory, for example `C:\Users\name\Zotero\storage`,
   `/Users/name/Zotero/storage`, or `/home/name/Zotero/storage`.

Direct reading applies to stored attachments (`imported_file` and
`imported_url`). ZotFlow reads the file from disk each time before consulting
its attachment cache or configured sync service, and does not add the result
to its cache. Linked files continue to use their own path or **Linked
Attachment Base Directory**. Mobile continues to use Zotero Cloud Storage or
WebDAV.

:::note
This is a local reading method, not an attachment sync service. Zotero must
already have the file on this computer, but Zotero File Syncing does not need
to be enabled. Point ZotFlow to the `storage` directory itself, not its parent
Zotero data directory, and do not use `~`. If the local file is missing,
ZotFlow reports the error instead of silently downloading it; disable the
option to return to the normal sync-service path.
:::

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
6. **Right-click** any item → **Edit tags…** to manage tags directly from Obsidian

---

## Main UI Panels

ZotFlow has three main interaction panels, which you've already used in the steps above. Here's a quick overview:

### Tree View

Library → Collection → Item → Attachment hierarchy browser (sidebar). Search and filter, drag citations, right-click for batch operations, double-click to open attachments/notes.

### Search Modal

Invoke via `ZotFlow: Search Zotero Library` or the ribbon icon. Real-time search across cached items, press Enter to jump to an attachment.

### Activity Center

Central control panel (opened via ribbon icon), six tabs:

- **Sync** — Trigger full or single-library sync, resolve conflicts
- **Tasks** — Monitor Active / Queued task progress
- **Template** — LiquidJS template sandbox with live preview
- **CSL** — Manage citation styles for the `citation` / `bibliography` filters: add styles by id with live preview, custom `.csl` folder, one-click updates. See [CSL Citations](csl-citations.md)
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

> **Note:** The **Server URL must include the `/zotero` folder** — point it directly at the folder where Zotero stores its attachments. This differs from Zotero's own setting: Zotero automatically appends `zotero/` to the URL you give it, but ZotFlow does not, so you must add it yourself. Example: if Zotero is configured with `https://dav.example.com/dav`, enter `https://dav.example.com/dav/zotero` here.

### Attachment Cache

ZotFlow caches downloaded attachments for faster repeat access:

- **Settings → ZotFlow → Cache → Enable Cache** (on by default)
- Set **Size Limit** (MB, default 500 MB). LRU eviction when the limit is reached
- Click **Purge Cache** to clear all cached files

### Linked Attachment Base Directory

If you use Linked Attachment Base Directory in Zotero (Zotero → Preferences → Advanced → Files and Folders), you need to tell ZotFlow where the files actually live:

1. **Settings → ZotFlow → General → Source Notes → Library Source Note → Linked Attachment Base Directory**
2. Enter the **same absolute path** as in Zotero settings (e.g., `D:\Papers` or `/Users/name/Papers`)
3. An attachment stored as `attachments:papers/foo.pdf` will resolve to `D:\Papers\papers\foo.pdf`

Skip this if you don't use linked attachments.

### Local Reader (Vault Files)

To use the ZotFlow reader for any PDF/EPUB/HTML file inside your vault:

1. **Settings → ZotFlow → General → Reader → Overwrite PDF/EPUB/HTML Viewer** → Enable
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
- **[Template Guide](template-guide.md)** — Complete LiquidJS variable and filter reference
