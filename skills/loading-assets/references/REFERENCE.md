# Loading Assets - Reference

Extended reference tables for the loading-assets skill. See `../SKILL.md` for usage patterns and examples.

## All File Types - Full Parameter Table

Every method below is called on `this.load` within a Scene.

| Method | Registered Name | Parameters | Description |
|---|---|---|---|
| `image(key, url, xhrSettings)` | `image` | key: string/config, url: string/string[], xhr | Loads an image. URL array `[texture, normalMap]` for normal maps. Default ext: `.png` |
| `spritesheet(key, url, frameConfig, xhrSettings)` | `spritesheet` | key, url, frameConfig: `{ frameWidth, frameHeight, startFrame, endFrame, margin, spacing }`, xhr | Loads a fixed-frame sprite sheet image |
| `atlas(key, textureURL, atlasURL, textureXhr, atlasXhr)` | `atlas` | key, textureURL, atlasURL, xhr, xhr | JSON texture atlas (TexturePacker JSON Hash/Array) |
| `atlasXML(key, textureURL, atlasURL, textureXhr, atlasXhr)` | `atlasXML` | key, textureURL, atlasURL, xhr, xhr | XML texture atlas (Starling/Sparrow format) |
| `multiatlas(key, atlasURL, path, baseURL, atlasXhr)` | `multiatlas` | key, atlasURL, path, baseURL, xhr | Multi-texture atlas (single JSON, multiple images) |
| `unityAtlas(key, textureURL, atlasURL, textureXhr, atlasXhr)` | `unityAtlas` | key, textureURL, atlasURL, xhr, xhr | Unity texture atlas format |
| `aseprite(key, textureURL, atlasURL, textureXhr, atlasXhr)` | `aseprite` | key, textureURL, atlasURL, xhr, xhr | Aseprite animation atlas |
| `audio(key, urls, config, xhrSettings)` | `audio` | key, urls (string/string[]), config `{ instances }`, xhr | Audio file(s). Provide array for format fallback |
| `audioSprite(key, jsonURL, audioURL, audioConfig, audioXhr, jsonXhr)` | `audioSprite` | key, jsonURL, audioURL, audioConfig, xhr, xhr | Audio sprite: single audio file + JSON marker data |
| `video(key, urls, noAudio)` | `video` | key, urls (string/string[]), noAudio: bool | Video file. Set `noAudio: true` to skip audio track |
| `json(key, url, dataKey, xhrSettings)` | `json` | key, url, dataKey: string, xhr | JSON data. `dataKey` extracts a sub-property |
| `xml(key, url, xhrSettings)` | `xml` | key, url, xhr | XML document |
| `text(key, url, xhrSettings)` | `text` | key, url, xhr | Plain text file |
| `binary(key, url, dataType, xhrSettings)` | `binary` | key, url, dataType: typed array constructor, xhr | Binary/ArrayBuffer data |
| `html(key, url, xhrSettings)` | `html` | key, url, xhr | HTML content as string |
| `htmlTexture(key, url, width, height, xhrSettings)` | `htmlTexture` | key, url, width, height, xhr | HTML content rendered to a texture |
| `css(key, url, xhrSettings)` | `css` | key, url, xhr | CSS file (injected into DOM) |
| `glsl(key, url, xhrSettings)` | `glsl` | key, url, xhr | GLSL shader source file |
| `svg(key, url, svgConfig, xhrSettings)` | `svg` | key, url, svgConfig: `{ width, height, scale }`, xhr | SVG rasterized to a texture |
| `bitmapFont(key, textureURL, fontDataURL, textureXhr, fontDataXhr)` | `bitmapFont` | key, textureURL, fontDataURL, xhr, xhr | Bitmap font (texture + XML/JSON font data) |
| `font(key, url, format, descriptors, xhrSettings)` | `font` | key, url, format (default `'truetype'`), descriptors: object, xhr | Web font file (ttf/otf/woff/woff2) via FontFace API |
| `tilemapTiledJSON(key, url, xhrSettings)` | `tilemapTiledJSON` | key, url, xhr | Tiled JSON tilemap |
| `tilemapCSV(key, url, xhrSettings)` | `tilemapCSV` | key, url, xhr | CSV tilemap |
| `tilemapImpact(key, url, xhrSettings)` | `tilemapImpact` | key, url, xhr | Impact.js tilemap |
| `animation(key, url, dataKey, xhrSettings)` | `animation` | key, url, dataKey, xhr | Animation JSON data (auto-added to AnimationManager) |
| `pack(key, url, dataKey, xhrSettings)` | `pack` | key, url, dataKey, xhr | Pack file (JSON manifest of other files to load) |
| `script(key, url, type, xhrSettings)` | `script` | key, url, type (DOM element type attr), xhr | JavaScript file (injected as script tag) |
| `scripts(key, url, xhrSettings)` | `scripts` | key, url (string[]), xhr | Multiple scripts loaded in order |
| `plugin(key, url, start, mapping, xhrSettings)` | `plugin` | key, url, start: bool, mapping: string, xhr | Phaser plugin JS file |
| `scenePlugin(key, url, systemKey, sceneKey, xhrSettings)` | `scenePlugin` | key, url, systemKey, sceneKey, xhr | Phaser scene plugin JS file |
| `sceneFile(key, url, xhrSettings)` | `sceneFile` | key, url, xhr | External Scene JS file |
| `texture(key, url, xhrSettings)` | `texture` | key, url (compressed texture config), xhr | Compressed texture with format fallbacks (since 3.60) |

All methods accept either positional arguments or a single config object as the first argument. All methods also accept an array of config objects as the first argument to batch-load multiple files of the same type.

## Cache API

Assets are stored in global game-level caches (not per-Scene). Textures go into the Texture Manager; other data goes into typed sub-caches.

### Cache Sub-Types

Access via `this.cache.<type>` within any Scene:

| Sub-Cache | Access | Stores |
|---|---|---|
| `this.cache.json` | JSON data | `this.load.json()` results |
| `this.cache.text` | Text data | `this.load.text()` results |
| `this.cache.xml` | XML documents | `this.load.xml()` results |
| `this.cache.audio` | Audio data | `this.load.audio()` decoded data |
| `this.cache.binary` | Binary/ArrayBuffer | `this.load.binary()` results |
| `this.cache.shader` | GLSL shaders | `this.load.glsl()` results |
| `this.cache.html` | HTML strings | `this.load.html()` results |
| `this.cache.tilemap` | Tilemap data | `this.load.tilemapTiledJSON()` etc. |
| `this.textures` | Texture Manager | All image/atlas/spritesheet textures |

### BaseCache Methods

Each `this.cache.<type>` sub-cache exposes these methods:

| Method | Description |
|---|---|
| `get(key)` | Returns the cached item for the given key |
| `add(key, data)` | Manually adds an item to the cache |
| `remove(key)` | Removes an item from the cache |
| `exists(key)` / `has(key)` | Returns `true` if the key exists in the cache |
| `getKeys()` | Returns an array of all keys in the cache |
| `destroy()` | Clears the entire sub-cache |

### Cache Events

Each sub-cache has an `events` property that emits events:

```js
// Listen for items being added to the JSON cache
this.cache.json.events.on('add', (cache, key, item) => {
    console.log('JSON added:', key);
});

// Listen for removals
this.cache.json.events.on('remove', (cache, key, item) => {
    console.log('JSON removed:', key);
});
```

### Texture Manager Methods

The Texture Manager (`this.textures`) provides texture-specific operations:

| Method | Description |
|---|---|
| `exists(key)` | Returns `true` if a texture with this key exists |
| `get(key)` | Returns the Texture object |
| `remove(key)` | Removes a texture and frees its WebGL resources |
| `getTextureKeys()` | Returns array of all texture keys |
| `on('addtexture', (key) => {})` | Fires when any texture is added |
| `on('addtexture-KEY', (texture) => {})` | Fires when a specific texture key is added (cross-scene notification) |
| `on('removetexture', (key) => {})` | Fires when any texture is removed |

## Source File Map

| File | Purpose |
|---|---|
| `src/loader/LoaderPlugin.js` | Main Loader class, accessed as `this.load`. Manages queue, parallel downloads, events |
| `src/loader/File.js` | Base File class. All file types extend this |
| `src/loader/filetypes/ImageFile.js` | `this.load.image()` |
| `src/loader/filetypes/SpriteSheetFile.js` | `this.load.spritesheet()` |
| `src/loader/filetypes/AtlasJSONFile.js` | `this.load.atlas()` |
| `src/loader/filetypes/AtlasXMLFile.js` | `this.load.atlasXML()` |
| `src/loader/filetypes/MultiAtlasFile.js` | `this.load.multiatlas()` |
| `src/loader/filetypes/UnityAtlasFile.js` | `this.load.unityAtlas()` |
| `src/loader/filetypes/AsepriteFile.js` | `this.load.aseprite()` |
| `src/loader/filetypes/AudioFile.js` | `this.load.audio()` |
| `src/loader/filetypes/AudioSpriteFile.js` | `this.load.audioSprite()` |
| `src/loader/filetypes/VideoFile.js` | `this.load.video()` |
| `src/loader/filetypes/JSONFile.js` | `this.load.json()` |
| `src/loader/filetypes/XMLFile.js` | `this.load.xml()` |
| `src/loader/filetypes/TextFile.js` | `this.load.text()` |
| `src/loader/filetypes/BinaryFile.js` | `this.load.binary()` |
| `src/loader/filetypes/HTMLFile.js` | `this.load.html()` |
| `src/loader/filetypes/HTMLTextureFile.js` | `this.load.htmlTexture()` |
| `src/loader/filetypes/CSSFile.js` | `this.load.css()` |
| `src/loader/filetypes/GLSLFile.js` | `this.load.glsl()` |
| `src/loader/filetypes/SVGFile.js` | `this.load.svg()` |
| `src/loader/filetypes/BitmapFontFile.js` | `this.load.bitmapFont()` |
| `src/loader/filetypes/FontFile.js` | `this.load.font()` |
| `src/loader/filetypes/TilemapJSONFile.js` | `this.load.tilemapTiledJSON()` |
| `src/loader/filetypes/TilemapCSVFile.js` | `this.load.tilemapCSV()` |
| `src/loader/filetypes/TilemapImpactFile.js` | `this.load.tilemapImpact()` |
| `src/loader/filetypes/AnimationJSONFile.js` | `this.load.animation()` |
| `src/loader/filetypes/PackFile.js` | `this.load.pack()` |
| `src/loader/filetypes/ScriptFile.js` | `this.load.script()` |
| `src/loader/filetypes/MultiScriptFile.js` | `this.load.scripts()` |
| `src/loader/filetypes/PluginFile.js` | `this.load.plugin()` |
| `src/loader/filetypes/ScenePluginFile.js` | `this.load.scenePlugin()` |
| `src/loader/filetypes/SceneFile.js` | `this.load.sceneFile()` |
| `src/loader/filetypes/CompressedTextureFile.js` | `this.load.texture()` |
| `src/loader/filetypes/HTML5AudioFile.js` | Internal: HTML5 Audio element loading (used by AudioFile) |
| `src/loader/events/` | All loader event constants |
