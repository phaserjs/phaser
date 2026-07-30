---
name: loading-assets
description: "Use this skill when loading assets in Phaser 4. Covers the Loader plugin, loading images, spritesheets, atlases, audio, JSON, tilemaps, bitmap fonts, and tracking load progress. Triggers on: preload, this.load, asset loading, spritesheet, atlas, load progress."
---

# Loading Assets
> The Phaser Loader (`this.load`) handles fetching all external content: images, audio, JSON, tilemaps, atlases, fonts, scripts, and more. Assets are queued in `preload()`, loaded in parallel, and placed into global caches accessible by every Scene.

**Key source paths:** `src/loader/LoaderPlugin.js`, `src/loader/File.js`, `src/loader/filetypes/`, `src/loader/events/`
**Related skills:** ../game-setup-and-config/SKILL.md, ../scenes/SKILL.md, ../sprites-and-images/SKILL.md

## Quick Start

```js
class GameScene extends Phaser.Scene {
    preload() {
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        this.add.image(400, 300, 'logo');
    }
}
```

Assets loaded in `preload()` are guaranteed to be ready when `create()` runs. The Loader starts automatically during the preload phase.

## Core Concepts

### The Preload Pattern

Every Scene can define a `preload()` method. The Loader automatically starts when `preload()` completes and waits for all queued files to finish before calling `create()`.

```js
preload() {
    // Queue files - they don't load immediately
    this.load.image('sky', 'assets/sky.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('jump', 'assets/jump.mp3');
}

create() {
    // All assets above are now available
    this.add.image(400, 300, 'sky');
    this.add.sprite(100, 450, 'dude');
    this.sound.play('jump');
}
```

### Loading Outside of Preload

If you call `this.load` methods outside of `preload()` (for example, in `create()` or in response to a user action), you must manually start the Loader:

```js
create() {
    this.load.image('extra', 'assets/extra.png');
    this.load.once('complete', () => {
        this.add.image(400, 300, 'extra');
    });
    this.load.start();
}
```

### URL Resolution: baseURL, path, and prefix

The final URL for a file is resolved as: `baseURL + path + filename`. These can be set via the game config or at runtime.

```js
preload() {
    // Set base URL (prepended to all relative paths)
    this.load.setBaseURL('https://cdn.example.com/');

    // Set path (prepended after baseURL, before filename)
    this.load.setPath('assets/images/');

    // Set key prefix (prepended to the cache key, not the URL)
    this.load.setPrefix('LEVEL1.');

    // Loads from: https://cdn.example.com/assets/images/hero.png
    // Cached with key: LEVEL1.hero
    this.load.image('hero', 'hero.png');

    // Absolute URLs bypass the path/baseURL
    this.load.image('cloud', 'https://other-server.com/cloud.png');
}
```

These can also be set in the game config:

```js
const config = {
    loader: {
        baseURL: 'https://cdn.example.com/',
        path: 'assets/',
        prefix: '',
        maxParallelDownloads: 32,
        crossOrigin: 'anonymous',
        responseType: '',
        async: true,
        timeout: 0,
        maxRetries: 2,
        imageLoadType: 'XHR' // or 'HTMLImageElement'
    }
};
```

### Global Caches

Assets are stored in global game-level caches, not per-Scene. An image loaded in one Scene is available in every other Scene. Textures go into `game.textures` (the Texture Manager). Other data goes into `game.cache` sub-caches (e.g., `game.cache.json`, `game.cache.audio`, `game.cache.xml`).

### Load Events

The Loader emits events throughout the loading lifecycle. Use these for progress bars and loading screens.

```js
preload() {
    this.load.on('progress', (value) => {
        // value is 0 to 1
        console.log(`Loading: ${Math.round(value * 100)}%`);
    });

    this.load.on('complete', () => {
        console.log('All assets loaded');
    });

    this.load.on('loaderror', (file) => {
        console.warn('Failed to load:', file.key);
    });

    this.load.image('bg', 'assets/bg.png');
}
```

## Common Patterns

### Loading Images and Sprite Sheets

```js
preload() {
    // Single image
    this.load.image('star', 'assets/star.png');

    // Image with normal map (pass URL array: [texture, normalMap])
    this.load.image('brick', ['assets/brick.png', 'assets/brick_n.png']);

    // Sprite sheet (fixed frame sizes)
    this.load.spritesheet('explosion', 'assets/explosion.png', {
        frameWidth: 64,
        frameHeight: 64,
        startFrame: 0,
        endFrame: 23,
        margin: 0,
        spacing: 0
    });

    // SVG (optionally rasterize at a specific size)
    this.load.svg('logo', 'assets/logo.svg', { width: 400, height: 400 });
}
```

### Loading Audio

```js
preload() {
    // Single file
    this.load.audio('bgm', 'assets/music.mp3');

    // Multiple formats for cross-browser support
    this.load.audio('bgm', ['assets/music.ogg', 'assets/music.mp3']);

    // Audio sprite (JSON defines named regions within a single audio file)
    this.load.audioSprite('sfx', 'assets/sfx.json', [
        'assets/sfx.ogg',
        'assets/sfx.mp3'
    ]);
}
```

### Loading JSON and Tilemaps

```js
preload() {
    // JSON data (stored in this.cache.json)
    this.load.json('levelData', 'assets/level1.json');

    // JSON with a dataKey to extract a sub-object
    this.load.json('enemies', 'assets/data.json', 'enemies');

    // Tiled tilemap (JSON format exported from Tiled)
    this.load.tilemapTiledJSON('map', 'assets/map.json');

    // CSV tilemap
    this.load.tilemapCSV('csvmap', 'assets/level.csv');

    // Impact tilemap
    this.load.tilemapImpact('impactmap', 'assets/level.js');
}

create() {
    const data = this.cache.json.get('levelData');
    const map = this.make.tilemap({ key: 'map' });
}
```

### Loading Atlases

```js
preload() {
    // JSON atlas (e.g., TexturePacker JSON Hash/Array)
    this.load.atlas('sprites', 'assets/sprites.png', 'assets/sprites.json');

    // XML atlas (e.g., Starling/Sparrow format)
    this.load.atlasXML('ui', 'assets/ui.png', 'assets/ui.xml');

    // Multi-atlas (atlas split across multiple textures)
    this.load.multiatlas('world', 'assets/world.json', 'assets/');

    // Unity texture atlas format
    this.load.unityAtlas('chars', 'assets/chars.png', 'assets/chars.txt');

    // Aseprite atlas
    this.load.aseprite('knight', 'assets/knight.png', 'assets/knight.json');
}

create() {
    this.add.sprite(400, 300, 'sprites', 'walk_01');
}
```

### Loading Bitmap Fonts

```js
preload() {
    // Requires both a texture and XML/JSON font data file
    this.load.bitmapFont('pixels', 'assets/font.png', 'assets/font.xml');
}

create() {
    this.add.bitmapText(100, 100, 'pixels', 'Hello World', 32);
}
```

### Loading Video

```js
preload() {
    // Load a video file. Third arg: noAudio flag (default false)
    this.load.video('intro', 'assets/intro.mp4');

    // Load without audio track
    this.load.video('bg_loop', 'assets/loop.mp4', true);
}
```

### Loading Web Fonts

```js
preload() {
    // Load a font file (ttf, otf, woff, woff2)
    this.load.font('myFont', 'assets/myfont.ttf', 'truetype');

    // With optional font face descriptors
    this.load.font('boldFont', 'assets/bold.woff2', 'woff2', {
        weight: 'bold',
        style: 'normal'
    });
}
```

### Loading a Pack File

A pack file is a JSON file that describes multiple assets to load at once. Useful for organizing asset manifests.

```js
preload() {
    this.load.pack('pack1', 'assets/pack.json');
}
```

Pack file format:

```json
{
    "section1": {
        "baseURL": "assets/",
        "files": [
            { "type": "image", "key": "bg", "url": "bg.png" },
            { "type": "atlas", "key": "chars", "textureURL": "chars.png", "atlasURL": "chars.json" }
        ]
    }
}
```

### Loading with a Progress Bar

```js
preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    this.load.on('progress', (value) => {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {
        progressBar.destroy();
        progressBox.destroy();
    });

    // Queue your assets
    this.load.image('sky', 'assets/sky.png');
    // ... more assets
}
```

## All File Types Reference

All `this.load` methods accept positional arguments or a single config object. They also accept an array of config objects to batch-load multiple files of the same type. See `references/REFERENCE.md` for the complete parameter table.

**Textures:** `image`, `spritesheet`, `atlas`, `atlasXML`, `multiatlas`, `unityAtlas`, `aseprite`, `svg`, `htmlTexture`, `texture` (compressed)
**Audio/Video:** `audio`, `audioSprite`, `video`
**Data:** `json`, `xml`, `text`, `binary`, `html`, `css`, `glsl`
**Fonts:** `bitmapFont`, `font`
**Tilemaps:** `tilemapTiledJSON`, `tilemapCSV`, `tilemapImpact`
**Other:** `animation`, `pack`, `script`, `scripts`, `plugin`, `scenePlugin`, `sceneFile`

## Events

All events are emitted on the Loader instance (`this.load`).

| Event String | Callback Signature | Description |
|---|---|---|
| `'addfile'` | `(key, type, loader, file)` | A file was added to the load queue |
| `'start'` | `(loader)` | Loader has started. Progress is zero |
| `'load'` | `(file)` | A single file finished loading (before processing/caching) |
| `'fileprogress'` | `(file, percentComplete)` | Per-file download progress (0-1). Only fires if browser provides `lengthComputable` |
| `'progress'` | `(value)` | Overall load progress updated (0-1) |
| `'postprocess'` | `(loader)` | All files loaded and processed, before internal cleanup |
| `'filecomplete'` | `(key, type, data)` | Any file finished loading and processing |
| `'filecomplete-{type}-{key}'` | `(key, type, data)` | Specific file finished (e.g., `'filecomplete-image-hero'`) |
| `'loaderror'` | `(file)` | A file failed to load |
| `'complete'` | `(loader, totalComplete, totalFailed)` | All files in the queue are done |

### Event Lifecycle Order

1. `'start'` - Loader begins
2. `'fileprogress'` - Per-file progress (repeats per file, if available)
3. `'load'` - Each file finishes downloading
4. `'filecomplete-{type}-{key}'` - Specific file processed and cached
5. `'filecomplete'` - Generic per-file completion
6. `'progress'` - Overall progress updated
7. `'postprocess'` - All files done, before cleanup
8. `'complete'` - Everything finished

## Gotchas and Common Mistakes

**Keys must be unique within their type.** Loading a second image with the same key as an existing one will log a warning and skip it. Remove the old texture from the Texture Manager first if you need to replace it.

**Sprite sheet is not the same as an atlas.** Use `spritesheet()` for fixed-size grids of frames (referenced by index). Use `atlas()` for packed texture atlases with named frames.

**Forgetting `this.load.start()` outside preload.** If you call load methods in `create()` or later, the Loader does not auto-start. You must call `this.load.start()` manually.

**Path must end with `/`.** If you call `this.load.setPath()` it will append the slash automatically. If you set `this.load.path` directly, you must include the trailing slash yourself.

**Audio format fallbacks.** Always provide multiple audio formats (OGG + MP3 at minimum) for cross-browser support. The Loader picks the first format the browser supports.

**Pack files can override baseURL/path/prefix.** Each section in a pack file can set its own `baseURL`, `path`, and `prefix` values. These apply only to files within that section and are restored after the section is processed.

**File keys include the prefix.** If you set `this.load.setPrefix('MENU.')` and load an image with key `'bg'`, the actual cache key becomes `'MENU.bg'`. You must use that full key when referencing the asset.

**The `maxRetries` property (default: 2)** controls how many times the Loader retries a failed file before giving up. This is set per-file at creation time based on `this.load.maxRetries`. Adjusting it after files are added has no effect on those files.

**Image load type.** By default images load via XHR (as blobs). Set `imageLoadType: 'HTMLImageElement'` in the loader config to use `<img>` tag loading instead, which can help with CORS issues in some environments.

**Local file schemes.** The Loader recognizes `file://` and `capacitor://` as local schemes by default (via `localSchemes`). Files loaded from local schemes skip CORS headers.

**Cross-origin.** Set `crossOrigin: 'anonymous'` in the loader config (or via `this.load.setCORS('anonymous')`) when loading assets from a different domain, especially if those textures will be used with WebGL.

**Keys are case-sensitive and scoped per type.** `'Player'` and `'player'` are different keys. An image key `'player'` and an audio key `'player'` can coexist without conflict.

**Duplicate keys are silently ignored.** A second `this.load.image('bg', ...)` call does nothing if `'bg'` already exists in the texture cache. Remove the old asset first to replace it.

**Scene `update()` does NOT fire during preload.** While assets are loading, `update()` is paused. However, `preupdate`, `postupdate`, and `render` still fire.

**Progress can decrease.** If new files are added mid-load (e.g., via `filecomplete` chaining), the progress value may drop because the total file count increased.

### Scene Payload (Load Before Preload)

Load files before `preload()` runs by defining a `pack` in the Scene constructor. Useful for loading progress bar assets.

```js
class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'BootScene',
            pack: {
                files: [
                    { type: 'image', key: 'bar', url: 'loaderBar.png' }
                ]
            }
        });
    }
    // 'bar' is already available in preload()
}
```

### Adding Files Mid-Load

Use the per-file completion event to chain dependent loads during an active loading session.

```js
preload() {
    this.load.json('level1', 'level1.json');
    this.load.on('filecomplete-json-level1', (key, type, data) => {
        this.load.image(data.images);
        this.load.spritesheet(data.spritesheets);
    });
}
```

### Inline Pack Manifests

Pack data can be provided inline instead of from a URL.

```js
preload() {
    this.load.pack('manifest', {
        section1: {
            prefix: '',
            path: 'assets/',
            defaultType: 'image',
            files: [
                { type: 'image', key: 'bg', url: 'bg.png' },
                { type: 'spritesheet', key: 'player', url: 'player.png', frameConfig: { frameWidth: 32, frameHeight: 32 } }
            ]
        }
    });
}
```

### Cache System

Loaded assets go into global caches shared across all Scenes. Textures are stored in the Texture Manager (`this.textures`); other asset types go into typed sub-caches under `this.cache`.

```js
// Access cached data
const json = this.cache.json.get('levelData');
const text = this.cache.text.get('dialogue');

// Check existence
this.cache.json.exists('levelData'); // or .has('levelData')
this.textures.exists('hero');

// Remove assets to free memory
this.textures.remove('hero');
this.cache.audio.remove('bgm');

// Listen for cross-scene texture additions
this.textures.on('addtexture-mapKey', (texture) => {
    // Another scene loaded 'mapKey' — now available here
});
```

Cache sub-types: `this.cache.text`, `this.cache.json`, `this.cache.audio`, `this.cache.binary`, `this.cache.shader`, `this.cache.xml`. See `references/REFERENCE.md` for the full Cache API.

## Source File Map

See `references/REFERENCE.md` for the complete source file map and Cache API reference.

Key files: `src/loader/LoaderPlugin.js` (main Loader), `src/loader/File.js` (base File class), `src/loader/filetypes/` (all file type loaders), `src/loader/events/` (event constants).
