# Phaser Compact Texture Atlas Format

## Specification v1.0

The PCT (Phaser Compact Texture) format is a compact text-based descriptor for texture atlases. It replaces verbose JSON atlas descriptors with a line-oriented format that is typically 90-95% smaller while remaining trivially parsable at runtime.

This document describes the data file structure in full, providing everything needed to implement a loader/parser.

---

## Overview

A `.pct` file is a plain UTF-8 text file. Each line is a record. Lines are parsed top to bottom in a single pass. There are eight record types, each identified by a prefix character or pattern:

| Prefix | Record type | Purpose |
|--------|------------|---------|
| `PCT:` | Version header | File identifier and format version (always first line) |
| `P:` | Page header | Declares a texture image and its dimensions |
| `F:` | Folder entry | Declares a folder name in the folder dictionary |
| `#` | Page selector | Switches subsequent frames to a different page |
| `B:` | Block header | Declares a grid block of same-sized sprites |
| `A:` | Alias | Maps duplicate sprites to an existing frame |
| `name\|` | Individual frame | A single sprite with explicit position |
| `names,...` | Block names | Comma-separated names for the preceding block |

Records must appear in this order: the `PCT:` version header on line 1, then all `P:` headers, then all `F:` entries, then frame data (which may contain `#`, `B:`, block names, and individual frame lines interleaved), followed finally by any `A:` alias records. Aliases are listed last because they reference frames by name and the loader resolves them by copying from entries that must already exist.

---

## Record Types

### Version Header (`PCT:`)

Must be the first line of every PCT file. Acts as both a file identifier (magic string) and a format version declaration.

```
PCT:1.0
```

The version uses `major.minor` semver-style numbering:

| Component | Meaning |
|-----------|---------|
| Major | Breaking changes. A v2 file cannot be loaded by a v1 parser. |
| Minor | Additive features. A v1.2 file loads in a v1.0 parser — unknown features are safely ignored. |

**Loader validation:**

```javascript
const firstLine = lines[0];
if (!firstLine.startsWith('PCT:')) {
    throw new Error('Not a PCT file');
}
const [major, minor] = firstLine.slice(4).split('.').map(Number);
if (major > 1) {
    throw new Error('Unsupported PCT version ' + major);
}
// Minor features can be checked as needed:
// const hasRotation = minor >= 1;
```

The loader should reject files with an unrecognised major version but accept unrecognised minor versions. Unknown line prefixes introduced in future minor versions should be silently skipped — the prefix-driven parser already supports this.

**Version history:**

| Version | Changes |
|---------|---------|
| 1.0 | Initial release. Blocks, folders, ranges, extensions, aliases, multi-page. |


### Page Header (`P:`)

Declares a texture atlas page. Multi-atlas files have multiple `P:` lines. Single-atlas files have one.

```
P:atlas_0.png,RGBA8888,2048,512,2
```

Fields (comma-separated):

| Position | Field | Type | Description |
|----------|-------|------|-------------|
| 0 | filename | string | The texture image filename |
| 1 | format | string | Pixel format (always `RGBA8888` currently) |
| 2 | width | int | Atlas width in pixels |
| 3 | height | int | Atlas height in pixels |
| 4 | padding | int | Shape padding value used during packing |

The padding value is informational — it tells the loader what inter-sprite gap was used. Frame coordinates already account for padding, so the loader does not need to apply it.

All `P:` lines appear at the top of the file before any other record type. Pages are indexed in order of appearance, starting at 0.


### Folder Entry (`F:`)

Declares a folder name in the folder dictionary. Folder entries appear after all `P:` headers and before any frame data.

```
F:warrior
F:knight/idle
F:effects
```

Each `F:` line adds one entry to the folder dictionary, indexed from 0 in order of appearance. Frame names reference folders by this numeric index rather than repeating the full folder string.

If there are no folders (all sprites are at root level), there are no `F:` lines.


### Page Selector (`#`)

Switches subsequent frame data to a different atlas page. Only present when there are multiple pages.

```
#0
#1
```

The number after `#` is the zero-based page index corresponding to the `P:` header order. All frames, blocks, and individuals following a `#N` line belong to page N until the next `#` line or end of file.

If there is only one page, no `#` lines appear and all frame data implicitly belongs to page 0.


### Block Header (`B:`)

Declares a grid block — a rectangular region of same-sized sprites arranged in a grid. The next line after a `B:` header is always the block's names line.

Untrimmed block:
```
B:2,2,8,64,64
```

Trimmed block:
```
B:2,2,6,120,108|134,120,4,6
```

Fields before the `|` (always present):

| Position | Field | Type | Description |
|----------|-------|------|-------------|
| 0 | x | int | Block origin X in the atlas (top-left of first cell) |
| 1 | y | int | Block origin Y in the atlas |
| 2 | cols | int | Number of columns in the grid |
| 3 | frameW | int | Width of each frame (the trimmed/packed size) |
| 4 | frameH | int | Height of each frame |

Fields after the `|` (only present if trimmed):

| Position | Field | Type | Description |
|----------|-------|------|-------------|
| 0 | sourceW | int | Original source image width before trimming |
| 1 | sourceH | int | Original source image height before trimming |
| 2 | trimX | int | X offset of the trimmed region within the source |
| 3 | trimY | int | Y offset of the trimmed region within the source |

For trimmed blocks, `spriteSourceSize.w` and `spriteSourceSize.h` equal `frameW` and `frameH` respectively — they are not stored separately.

The number of rows is derived: `rows = ceil(spriteCount / cols)`.


### Block Names Line

Immediately follows a `B:` header. Contains the names of all sprites in the block, which may use range compression, folder indices, and extension indices.

```
0/idle#01-24
```

This line is parsed to produce an ordered list of sprite names. Each name maps to a grid cell: sprite at index `i` occupies the cell at column `i % cols`, row `floor(i / cols)`.

The position of each sprite is derived:

```
cellW = frameW + padding * 2
cellH = frameH + padding * 2
sprite[i].x = blockX + (i % cols) * cellW + padding
sprite[i].y = blockY + floor(i / cols) * cellH + padding
```

Where `padding` is the shape padding value from the page header.

See the **Name Encoding** section below for full parsing rules.


### Individual Frame

A single sprite with explicit position and dimensions. Used for sprites that don't belong to any block group.

Untrimmed:
```
sword|0|726,2,86,42
```

Trimmed:
```
shield|2|726,48,72,68|80,80,4,6
```

Fields (separated by `|`):

| Segment | Fields | Description |
|---------|--------|-------------|
| 0 | name | Sprite name (may include folder index and extension index) |
| 1 | flags | Bit flags: bit 0 = rotated, bit 1 = trimmed |
| 2 | x,y,w,h | Frame rectangle in the atlas |
| 3 | sw,sh,sx,sy | Source size and trim offset within source (only if trimmed) |

When present, segment 3 packs all four trim values into a single comma-separated field, mirroring the layout used by the `|`-separated trim block in the `B:` block header. Trimmed individual frames therefore have exactly four `|`-separated segments total; untrimmed individual frames have three.

For untrimmed frames (flags bit 1 = 0):
- `sourceSize` = `{ w: w, h: h }`
- `spriteSourceSize` = `{ x: 0, y: 0, w: w, h: h }`

For trimmed frames (flags bit 1 = 1):
- `sourceSize` = `{ w: sw, h: sh }`
- `spriteSourceSize` = `{ x: sx, y: sy, w: w, h: h }`

The rotation flag (bit 0) is reserved for future use. Currently all frames are packed without rotation.


### Alias (`A:`)

Maps duplicate sprites (pixel-identical frames detected during packing) to an original that is present in the texture. Alias lines appear after all frame data.

```
A:0/idle_01=0/idle_12,0/idle_18
```

Format: `A:originalName=duplicateName1,duplicateName2,...`

The duplicate names list may use range compression (see below).

The loader should create frame entries for each duplicate name that copy all properties (position, dimensions, trim data) from the original frame. The duplicate names are not present in the texture image — they share the original's atlas region.

---

## Name Encoding

Sprite names in the PCT format may include three layers of encoding: folder indices, extension indices, and sequential range compression. These are applied in the following order during decoding.


### Folder Index

Names may be prefixed with a numeric folder index followed by `/`:

```
0/idle_01       → folder[0] + "/" + "idle_01"
2/spark_05      → folder[2] + "/" + "spark_05"
sword           → no folder (root level)
```

If the name starts with a digit followed by `/`, the digits before the slash are the folder dictionary index. The folder name is looked up from the `F:` entries and prepended with a `/` separator to form the full key.

Names without a `/` prefix are root-level sprites.


### Extension Index

Names may end with `~N` where N is a hardcoded extension dictionary index:

| Index | Extension |
|-------|-----------|
| 1 | .png |
| 2 | .webp |
| 3 | .jpg |
| 4 | .jpeg |
| 5 | .gif |

```
sword~1         → "sword.png"
frame1~3        → "frame1.jpg"
0/idle_01~2     → folder[0] + "/idle_01.webp"
heightmap.tga   → "heightmap.tga" (unknown ext stored raw)
```

If the name ends with `~` followed by a single digit 1-5, strip the suffix and append the corresponding extension.

If the name contains a `.` but no `~`, it contains a raw extension that was not in the dictionary — use as-is.

If neither `~` nor `.` is present, the name has no extension (it was stripped during packing).


### Range Compression

In block name lines, sequential names may be compressed into range notation:

```
frame#1-23          → frame1, frame2, frame3, ..., frame23
walk_#01-08         → walk_01, walk_02, ..., walk_08
idle#000-059        → idle000, idle001, ..., idle059
```

Format: `prefix#start-end`

Decoding rules:

1. Split the names line on `,` to get segments
2. For each segment, check if it contains `#`
3. If yes: split on `#` to get `prefix` and `range`
4. Split `range` on `-` to get `startStr` and `endStr`
5. Parse both as integers: `start` and `end`
6. If `startStr` has leading zeros (length > 1 and first char is `0`), all generated numbers are zero-padded to `startStr.length`
7. Generate names: for `i` from `start` to `end` inclusive, emit `prefix + pad(i)`
8. If no `#`, the segment is a literal name

Ranges, literal names, and folder/extension indices all compose:

```
0/frame#1-23~1
```

This expands to folder `0`, frames `frame1.png` through `frame23.png`.

Decoding order for this combined form:

1. Split on `,` to get segments
2. Expand any `#` ranges to individual name strings
3. For each name: resolve folder index (strip `N/` prefix)
4. For each name: resolve extension index (strip `~N` suffix)


### Range Compression with Extension Suffix

When a block names line has an extension suffix, it appears once at the end of the entire line, after all names and ranges:

```
0/frame#1-23~1
```

The `~1` applies to all names in the line. The decoder should:

1. Check if the line ends with `~N` (where N is 1-5)
2. If so, strip it and note the extension
3. Parse the remaining string for ranges and names
4. Apply the extension to every generated name


---

## Complete Decoding Algorithm

```
function decodePCT(text):
    lines = text.split('\n')
    pages = []
    folders = []
    currentPage = 0
    frames = {}           // key → frame data
    
    // Extension dictionary
    EXT = { 1:'.png', 2:'.webp', 3:'.jpg', 4:'.jpeg', 5:'.gif' }
    
    pendingBlock = null
    
    for line in lines:
        if line is empty: continue
        
        // A pending block ALWAYS consumes the next non-empty line as its names
        // line, regardless of what prefix character that line happens to start
        // with. This must be checked before any prefix-based dispatch below.
        if pendingBlock is not null:
            // This line is the names for the pending block
            block = pendingBlock
            pendingBlock = null
            padding = pages[block.page].padding
            cellW = block.frameW + padding * 2
            cellH = block.frameH + padding * 2
            names = expandNames(line, folders, EXT)
            
            for i, name in enumerate(names):
                col = i % block.cols
                row = floor(i / block.cols)
                frame = {
                    key: name,
                    page: block.page,
                    x: block.x + col * cellW + padding,
                    y: block.y + row * cellH + padding,
                    w: block.frameW,
                    h: block.frameH,
                    trimmed: block.trimmed,
                    rotated: false
                }
                if block.trimmed:
                    frame.sourceW = block.sourceW
                    frame.sourceH = block.sourceH
                    frame.trimX = block.trimX
                    frame.trimY = block.trimY
                else:
                    frame.sourceW = block.frameW
                    frame.sourceH = block.frameH
                    frame.trimX = 0
                    frame.trimY = 0
                frames[name] = frame
            continue
        
        if line starts with 'P:':
            parts = line[2:].split(',')
            pages.push({
                filename: parts[0],
                format: parts[1],
                width: int(parts[2]),
                height: int(parts[3]),
                padding: int(parts[4])
            })
        
        else if line starts with 'F:':
            folders.push(line[2:])
        
        else if line starts with '#':
            currentPage = int(line[1:])
        
        else if line starts with 'B:':
            // Parse block header
            trimParts = line[2:].split('|')
            main = trimParts[0].split(',')
            block = {
                page: currentPage,
                x: int(main[0]),
                y: int(main[1]),
                cols: int(main[2]),
                frameW: int(main[3]),
                frameH: int(main[4]),
                trimmed: trimParts.length > 1
            }
            if block.trimmed:
                trim = trimParts[1].split(',')
                block.sourceW = int(trim[0])
                block.sourceH = int(trim[1])
                block.trimX = int(trim[2])
                block.trimY = int(trim[3])
            pendingBlock = block
        
        else if line starts with 'A:':
            // Parse alias
            eqIdx = line.indexOf('=', 2)
            originalName = resolveFullName(line[2:eqIdx], folders, EXT, '')
            dupNames = expandNames(line[eqIdx+1:], folders, EXT)
            for name in dupNames:
                frames[name] = copy(frames[originalName])
                frames[name].key = name
        
        else:
            // Individual frame line
            parts = line.split('|')
            name = resolveFullName(parts[0], folders, EXT, '')
            flags = int(parts[1])
            trimmed = (flags & 2) != 0
            fv = parts[2].split(',')
            frame = {
                key: name,
                page: currentPage,
                x: int(fv[0]),
                y: int(fv[1]),
                w: int(fv[2]),
                h: int(fv[3]),
                trimmed: trimmed,
                rotated: (flags & 1) != 0
            }
            if trimmed:
                tv = parts[3].split(',')
                frame.sourceW = int(tv[0])
                frame.sourceH = int(tv[1])
                frame.trimX = int(tv[2])
                frame.trimY = int(tv[3])
            else:
                frame.sourceW = frame.w
                frame.sourceH = frame.h
                frame.trimX = 0
                frame.trimY = 0
            frames[name] = frame
    
    return { pages, folders, frames }
```

### Helper: `expandNames(line, folders, EXT)`

```
function expandNames(line, folders, EXT):
    // Check for trailing extension suffix: ~N at very end
    extSuffix = ''
    match = line.match(/~([1-5])$/)
    if match:
        extSuffix = EXT[int(match[1])]
        line = line[0:-2]  // strip ~N
    
    results = []
    segments = line.split(',')
    
    for segment in segments:
        if '#' in segment:
            hashIdx = segment.indexOf('#')
            prefix = segment[0:hashIdx]
            range = segment[hashIdx+1:]
            dashIdx = range.indexOf('-')
            startStr = range[0:dashIdx]
            endStr = range[dashIdx+1:]
            start = int(startStr)
            end = int(endStr)
            padLen = startStr.length if (startStr.length > 1 and startStr[0] == '0') else 0
            
            for i from start to end inclusive:
                numStr = padLen > 0 ? zeroPad(i, padLen) : str(i)
                rawName = prefix + numStr
                results.push(resolveFullName(rawName, folders, EXT, extSuffix))
        else:
            results.push(resolveFullName(segment, folders, EXT, extSuffix))
    
    return results
```

### Helper: `resolveFullName(raw, folders, EXT, extSuffix)`

```
function resolveFullName(raw, folders, EXT, extSuffix):
    name = raw
    folder = ''
    
    // Folder index: "N/rest"
    slashIdx = name.indexOf('/')
    if slashIdx > 0 and name[0:slashIdx] is all digits:
        folderIdx = int(name[0:slashIdx])
        folder = folders[folderIdx]
        name = name[slashIdx+1:]
    
    // Extension index: "name~N" (per-name, overrides line-level)
    match = name.match(/~([1-5])$/)
    if match:
        ext = EXT[int(match[1])]
        name = name[0:-2] + ext
    else if extSuffix:
        name = name + extSuffix
    // else: name has no extension or contains a raw one (e.g. ".tga")
    
    if folder:
        return folder + '/' + name
    return name
```

---

## Complete Examples

### Example 1: Simple Block

Eight 64×64 untrimmed sprites packed into a single row.

```
PCT:1.0
P:atlas_0.png,RGBA8888,1024,256,2
B:2,2,8,64,64
frame#1-8
```

This produces 8 frames named `frame1` through `frame8`, each 64×64 pixels, at positions derived from the block grid with 2px padding between cells.

Decoded frame positions:

| Name | X | Y |
|------|---|---|
| frame1 | 4 | 4 |
| frame2 | 72 | 4 |
| frame3 | 140 | 4 |
| frame4 | 208 | 4 |
| frame5 | 276 | 4 |
| frame6 | 344 | 4 |
| frame7 | 412 | 4 |
| frame8 | 480 | 4 |

Cell width = 64 + 2×2 = 68. Position = blockX + col × 68 + 2.


### Example 2: Multi-Page with All Features

Two atlas pages, three folders, trimmed blocks, individual frames, extension indices, range compression, and aliases.

```
PCT:1.0
P:atlas_0.png,RGBA8888,2048,512,2
P:atlas_1.png,RGBA8888,2048,256,2
F:warrior
F:knight
F:effects
#0
B:2,2,6,120,108|134,120,4,6
0/idle_#01-24~1
B:2,222,6,120,108|134,120,4,6
1/idle_#01-18~1
sword~1|0|726,2,86,42
shield~1|2|726,48,72,68|80,80,4,6
#1
B:2,2,10,48,48
2/spark_#01-30~1
A:0/idle_01~1=0/idle_12,0/idle_18~1
A:1/idle_01~1=1/idle_09~1
```

Decoded:

**Page headers:**
- Page 0: `atlas_0.png`, 2048×512, padding 2
- Page 1: `atlas_1.png`, 2048×256, padding 2

**Folders:** 0=`warrior`, 1=`knight`, 2=`effects`

**Page 0 frames:**
- Block at (2,2): 6 columns of 120×108 frames, trimmed from 134×120 sources at offset (4,6). Names: `warrior/idle_01.png` through `warrior/idle_24.png` (24 frames, 4 rows × 6 cols)
- Block at (2,222): same dimensions, names: `knight/idle_01.png` through `knight/idle_18.png` (18 frames, 3 rows × 6 cols)
- `sword.png`: untrimmed individual at (726,2), size 86×42, on page 0
- `shield.png`: trimmed individual at (726,48), frame 72×68, source 80×80, trim offset (4,6)

**Page 1 frames:**
- Block at (2,2): 10 columns of 48×48 untrimmed frames. Names: `effects/spark_01.png` through `effects/spark_30.png`

**Aliases:**
- `warrior/idle_12.png` and `warrior/idle_18.png` are pixel-identical to `warrior/idle_01.png` — they share its atlas position
- `knight/idle_09.png` is pixel-identical to `knight/idle_01.png`


### Example 3: Minimal

Single untrimmed sprite, no folders, no blocks.

```
PCT:1.0
P:atlas_0.png,RGBA8888,256,256,1
logo|0|1,1,200,180
```

One frame named `logo` at position (1,1), size 200×180, untrimmed, on a 256×256 atlas with 1px padding.


---

## Frame Data Structure

After decoding, each frame should provide the following fields to the rendering engine:

| Field | Type | Description |
|-------|------|-------------|
| key | string | Unique frame name (with folder path and extension if present) |
| page | int | Which atlas page this frame is on (index into pages array) |
| x | int | X position of the frame in the atlas |
| y | int | Y position of the frame in the atlas |
| w | int | Width of the frame in the atlas |
| h | int | Height of the frame in the atlas |
| sourceW | int | Original source image width |
| sourceH | int | Original source image height |
| trimX | int | X offset of the frame within the original source |
| trimY | int | Y offset of the frame within the original source |
| trimmed | bool | Whether this frame was trimmed from its source |
| rotated | bool | Whether this frame is rotated 90° CW in the atlas (reserved, currently always false) |

For untrimmed frames: `sourceW = w`, `sourceH = h`, `trimX = 0`, `trimY = 0`.

For rendering at the original source dimensions, draw the atlas region `(x, y, w, h)` at the offset `(trimX, trimY)` within a canvas of size `(sourceW, sourceH)`.

---

## Design Notes

### Why text, not binary?

At typical atlas sizes (50-500 frames), a text PCT file is 200-2000 bytes. Gzip compression (standard for HTTP) brings text and binary formats within a few percent of each other. Text provides human readability, easy diffing in version control, trivial parsing with `split()`, and no endianness concerns.

### Block grouping criteria

Sprites are grouped into blocks when 4 or more share the same signature: identical `frameW`, `frameH`, and if trimmed, identical `sourceW`, `sourceH`, `trimX`, `trimY`. This threshold balances data savings against packing efficiency — smaller groups constrain the MaxRects packer without sufficient data-size benefit.

### Group-aware trimming

When multiple sprites share the same source dimensions, trimming computes the union bounding box across all frames rather than trimming each independently. This ensures all frames in an animation sequence have identical trim bounds, preventing visual jitter during playback and enabling block grouping.

### Column strategy

Block column counts are not fixed to maximum width. The packer tests three strategies (square-ish, half-width, full-width) and picks whichever produces the tightest total atlas. A full-width strip wastes space when the last row is partial; a squarer block leaves room for other sprites alongside it.

### Row splitting

If a block would have a partially-filled last row, it is split into a full-rows block and a smaller remainder block. This prevents wasted cells from consuming atlas space that other sprites could fill.
