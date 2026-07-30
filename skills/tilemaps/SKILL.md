---
name: tilemaps
description: "Use this skill when working with tilemaps in Phaser 4. Covers loading Tiled JSON maps, creating tilemap layers, tile collision, dynamic tiles, tile properties, and tilemap camera culling. Triggers on: Tilemap, Tiled, tilemap layer, tile collision, tile properties."
---

# Tilemaps
> Phaser Tilemaps render tile-based levels from Tiled JSON, CSV, or raw 2D arrays. A `Tilemap` holds parsed map data and provides methods to add tilesets, create layers, set collision, and query tiles. Layers (`TilemapLayer` or `TilemapGPULayer`) are the Game Objects that actually render tiles. Phaser supports orthogonal, isometric, hexagonal, and staggered maps.

**Key source paths:** `src/tilemaps/Tilemap.js`, `src/tilemaps/TilemapLayer.js`, `src/tilemaps/TilemapGPULayer.js`, `src/tilemaps/TilemapLayerBase.js`, `src/tilemaps/Tile.js`, `src/tilemaps/Tileset.js`, `src/tilemaps/TilemapFactory.js`, `src/tilemaps/components/`, `src/tilemaps/parsers/tiled/`
**Related skills:** ../loading-assets/SKILL.md, ../sprites-and-images/SKILL.md

## Quick Start

```js
class GameScene extends Phaser.Scene {
    preload() {
        // Load the Tiled JSON and the tileset image
        this.load.tilemapTiledJSON('map', 'assets/level1.json');
        this.load.image('tiles', 'assets/tilesheet.png');
    }

    create() {
        // Create the tilemap from cached JSON
        const map = this.add.tilemap('map');

        // Link the tileset image to the tileset name used in Tiled
        const tileset = map.addTilesetImage('tilesheet', 'tiles');

        // Create a layer - layerID must match the layer name in Tiled
        const ground = map.createLayer('Ground', tileset);

        // Enable collision on specific tile indexes
        ground.setCollision([1, 2, 3]);
    }
}
```

The flow is always: load JSON + image, create tilemap, add tileset image, create layer(s), set collision.

## Core Concepts

### Tilemap vs Layer

A `Tilemap` is a data container, not a display object. It stores parsed map data (layers, tilesets, objects) and provides methods that operate on them. A `TilemapLayer` or `TilemapGPULayer` is the actual Game Object added to the display list that renders tiles.

```js
const map = this.add.tilemap('map');    // Data container (not rendered)
const layer = map.createLayer('Ground', tileset);  // Game Object (rendered)
```

`this.add.tilemap(key)` is a factory registered on `GameObjectFactory`. It delegates to `ParseToTilemap` which reads from the cache and returns a `Tilemap` instance.

### Tilesets

A `Tileset` (`src/tilemaps/Tileset.js`) links a tileset name (from Tiled) to a loaded texture. It stores `firstgid`, tile dimensions, margin, and spacing.

```js
// tilesetName: the name in Tiled's tileset panel
// key: the Phaser texture key (defaults to tilesetName if omitted)
const tileset = map.addTilesetImage('tilesetName', 'textureKey');

// Override tile dimensions, margin, and spacing if needed
const tileset = map.addTilesetImage('name', 'key', 16, 16, 1, 2);
```

`addTilesetImage(tilesetName, key, tileWidth, tileHeight, tileMargin, tileSpacing, gid, tileOffset)` - If the tileset name already exists in the parsed map data, it updates the existing Tileset object with the texture. If not (non-Tiled maps), it creates a new Tileset.

**Important:** The Phaser Tiled parser does not support "Collection of Images" tilesets. All tiles must be in a single tileset image per tileset.

### The Tile Class

Each cell in a layer is a `Tile` object (`src/tilemaps/Tile.js`). Key properties:

- `index` - tile index in the tileset (-1 for empty)
- `x`, `y` - tile coordinates (in tiles, not pixels)
- `pixelX`, `pixelY` - pixel position relative to layer origin
- `width`, `height` - tile size in pixels
- `properties` - custom properties from Tiled (object)
- `collideLeft`, `collideRight`, `collideUp`, `collideDown` - per-edge collision flags
- `faceLeft`, `faceRight`, `faceTop`, `faceBottom` - interesting face flags for collision optimization
- `collisionCallback` - per-tile collision callback function
- `tint` - tint color value (default `0xffffff`)
- `tintMode` - tint blend mode (default `TintModes.MULTIPLY`)
- `rotation` - rotation angle
- `physics` - object for physics-engine-specific data (e.g. bodies)
- `alpha`, `visible`, `flipX`, `flipY` - inherited from mixins

### TilemapGPULayer (v4.0.0)

`TilemapGPULayer` is a high-performance WebGL-only alternative to `TilemapLayer`. It renders the entire layer as a single quad using a shader, making it almost entirely GPU-bound.

```js
// Pass gpu: true as the 5th argument to createLayer
const layer = map.createLayer('Ground', tileset, 0, 0, true);
```

**Capabilities:**
- Single tileset per layer only (no multi-tileset)
- Max tilemap size: 4096x4096 tiles
- Max unique tile IDs: 2^23 (8,388,608)
- Supports tile flip and tile animation
- Orthographic maps only (no iso/hex/staggered)
- Smooth tile borders with LINEAR filtering (no seams)
- Sharp pixels with NEAREST filtering

**Restrictions:**
- Layer edits do not display automatically. Call `generateLayerDataTexture()` after modifying tiles.
- WebGL renderer only (no Canvas fallback)
- Cannot use multiple tilesets on a single layer

```js
// If you edit tiles on a GPU layer, regenerate the data texture:
gpuLayer.putTileAt(5, 10, 10);
gpuLayer.generateLayerDataTexture();
```

### TilemapLayerBase

Both `TilemapLayer` and `TilemapGPULayer` extend `TilemapLayerBase` (`src/tilemaps/TilemapLayerBase.js`), which extends `GameObject`. The base class provides all tile query, manipulation, and collision methods. It includes these component mixins: Alpha, BlendMode, ComputedSize, Depth, ElapseTimer, Flip, GetBounds, Lighting, Mask, Origin, RenderNodes, Transform, Visible, ScrollFactor, and Arcade Physics Collision.

## Common Patterns

### Creating from Tiled JSON

```js
preload() {
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.image('tiles', 'assets/tileset.png');
}

create() {
    const map = this.add.tilemap('map');
    const tileset = map.addTilesetImage('TilesetNameInTiled', 'tiles');
    const layer = map.createLayer('LayerNameInTiled', tileset);
}
```

The `layerID` passed to `createLayer` must match the layer name in Tiled exactly. Group layer children are flattened with a `'ParentGroup/Layer'` naming convention.

### Multiple Layers

```js
const map = this.add.tilemap('map');
const tileset = map.addTilesetImage('terrain', 'terrain-img');

const background = map.createLayer('Background', tileset);
const ground = map.createLayer('Ground', tileset);
const foreground = map.createLayer('Foreground', tileset);

// Layers are rendered in creation order. Use depth for finer control:
foreground.setDepth(10);
```

A layer can use multiple tilesets (CPU layer only):

```js
const tiles1 = map.addTilesetImage('terrain', 'terrain-img');
const tiles2 = map.addTilesetImage('objects', 'objects-img');
const layer = map.createLayer('Ground', [tiles1, tiles2]);
```

### Creating a Blank Layer

```js
const map = this.add.tilemap('map');
const tileset = map.addTilesetImage('terrain', 'terrain-img');

// createBlankLayer(name, tileset, x, y, width, height, tileWidth, tileHeight)
const layer = map.createBlankLayer('dynamic', tileset, 0, 0, 50, 50, 32, 32);

// Fill it with tiles
layer.fill(1);  // Fill entire layer with tile index 1
layer.putTileAt(5, 10, 10);  // Place tile index 5 at tile coord (10, 10)
```

### Collision Setup

There are several ways to enable tile collision for Arcade Physics:

```js
// By specific tile indexes
layer.setCollision([1, 2, 3]);

// By range (inclusive)
layer.setCollisionBetween(1, 50);

// By tile property (set in Tiled's tileset editor)
layer.setCollisionByProperty({ collides: true });
// Supports arrays: { type: ['stone', 'lava'] }

// By exclusion - collide on ALL tiles except these
layer.setCollisionByExclusion([-1, 0]);  // -1 is empty, 0 is often background

// From Tiled collision editor shapes
layer.setCollisionFromCollisionGroup();
```

All collision methods on `TilemapLayerBase` mirror methods on `Tilemap` but don't require a `layer` parameter. On the `Tilemap`, you can pass a layer reference or use the "current layer":

```js
map.setLayer('Ground');
map.setCollision([1, 2, 3]);  // Applies to current layer
// Or specify a layer explicitly:
map.setCollision([1, 2, 3], true, true, 'Ground');
```

### Physics Integration (Arcade)

```js
// Enable collisions between a sprite and a tilemap layer
this.physics.add.collider(player, groundLayer);

// With a callback
this.physics.add.collider(player, groundLayer, (sprite, tile) => {
    if (tile.index === 5) {
        // Hit a special tile
    }
});

// Overlap detection instead of collision
this.physics.add.overlap(player, groundLayer, (sprite, tile) => {
    // Player is overlapping this tile
});
```

The layer must have collision set on its tiles (via `setCollision*` methods) for physics to detect them. The layer itself has `collisionCategory` and `collisionMask` properties for collision filtering.

### Tile Properties

Tiles can have custom properties set in Tiled's tileset editor:

```js
// Access tile properties
const tile = layer.getTileAt(10, 5);
console.log(tile.properties.damage);    // Custom property from Tiled
console.log(tile.properties.type);      // Custom property from Tiled

// Set collision based on custom properties
layer.setCollisionByProperty({ collides: true });
layer.setCollisionByProperty({ type: ['wall', 'rock'] });
```

### Tile Callbacks

```js
// Callback by tile index - fires when physics body overlaps these tiles
map.setTileIndexCallback([5, 6, 7], (sprite, tile) => {
    // Called for tiles with index 5, 6, or 7
    console.log('Hit tile', tile.index, 'at', tile.x, tile.y);
}, this);

// Callback by tile location - fires for tiles in a rectangular area
map.setTileLocationCallback(10, 10, 5, 5, (sprite, tile) => {
    // Called for any tile in the 5x5 region starting at (10, 10)
}, this);

// Per-tile callback
const tile = layer.getTileAt(10, 5);
tile.collisionCallback = (sprite, tile) => {
    // Custom logic for this specific tile
};
```

Tile callbacks require an active physics collider/overlap between the body and the layer.

### Querying Tiles

```js
const tile = layer.getTileAt(10, 5);               // By tile coords (or null)
const tile = layer.getTileAt(10, 5, true);          // nonNull: Tile with index -1 instead of null
const tile = layer.getTileAtWorldXY(worldX, worldY); // By world coords
const exists = layer.hasTileAt(10, 5);              // Boolean check

// Region queries
const tiles = layer.getTilesWithin(0, 0, 10, 10);            // Tile coord region
const tiles = layer.getTilesWithinWorldXY(x, y, w, h);       // World coord region
const tiles = layer.getTilesWithinShape(circle);              // Shape overlap

// Functional queries
const water = layer.filterTiles(t => t.properties.type === 'water');
const spawn = layer.findTile(t => t.properties.isSpawn);
layer.forEachTile(t => { /* iterate all tiles */ });
```

### Modifying Tiles at Runtime

```js
layer.putTileAt(5, 10, 10);                      // Place tile index 5 at (10, 10)
layer.putTileAtWorldXY(5, worldX, worldY);        // Place by world coords
layer.putTilesAt([[1, 2], [3, 4]], 10, 10);       // Place a 2x2 grid
layer.removeTileAt(10, 10);                       // Remove tile
layer.fill(1, 0, 0, 10, 10);                     // Fill 10x10 region with index 1
layer.replaceByIndex(5, 10);                      // Replace all index-5 with index-10
layer.copy(0, 0, 5, 5, 20, 20);                  // Copy 5x5 from (0,0) to (20,20)
layer.randomize(0, 0, 10, 10, [1, 2, 3, 4]);     // Random tiles in region
layer.weightedRandomize([{ index: 1, weight: 4 }, { index: 2, weight: 1 }], 0, 0, 10, 10);
layer.shuffle(0, 0, 10, 10);                     // Shuffle tiles in region
```

### Coordinate Conversion

```js
const tileXY = layer.worldToTileXY(worldX, worldY);   // World -> tile coords
const worldXY = layer.tileToWorldXY(tileX, tileY);    // Tile -> world coords

// Reuse a vector to avoid allocation
const vec = new Phaser.Math.Vector2();
layer.worldToTileXY(worldX, worldY, true, vec);  // snapToFloor = true
```

### Object Layers (Tiled)

Tiled object layers define points, rectangles, and sprite placement. Use `createFromObjects` on the `Tilemap`:

```js
// Create sprites from all objects on the 'Enemies' object layer
const enemies = map.createFromObjects('Enemies', {
    gid: 26,          // Match by tile GID
    classType: Enemy   // Custom class extending Sprite
});

// Match by name
const coins = map.createFromObjects('Items', {
    name: 'coin',
    key: 'coin-texture',
    frame: 0
});

// Match by type
const spawns = map.createFromObjects('Spawns', {
    type: 'player-spawn'
});

// Access raw object layer data
const objectLayer = map.getObjectLayer('Enemies');
objectLayer.objects.forEach(obj => {
    console.log(obj.name, obj.x, obj.y, obj.properties);
});
```

`createFromObjects(layerName, config, useTileset)` config options: `id`, `gid`, `name`, `type`, `classType` (default `Sprite`), `scene`, `container`, `key`, `frame`, `ignoreTileset`.

### Animated Tiles

Tile animations are defined in Tiled's tileset editor and parsed automatically. Both `TilemapLayer` and `TilemapGPULayer` support animated tiles. The `TilemapLayerBase` uses `ElapseTimer` to track animation time via `preUpdate`.

### Isometric, Hexagonal, and Staggered Maps

```js
// Isometric map
const map = this.add.tilemap('iso-map');
const tileset = map.addTilesetImage('iso-tiles', 'iso-img');
const layer = map.createLayer('Ground', tileset);

// Get tile at world coords in isometric space
const tile = layer.getIsoTileAtWorldXY(worldX, worldY);

// TilemapGPULayer does NOT support iso/hex/staggered - use TilemapLayer
```

The map `orientation` property is set from Tiled data. Coordinate conversion functions are automatically selected based on orientation.

## API Quick Reference

### Tilemap (data container - not rendered)

| Method | Description |
|--------|-------------|
| `addTilesetImage(name, key, tw, th, margin, spacing, gid, offset)` | Link tileset name to texture |
| `createLayer(layerID, tileset, x, y, gpu)` | Create layer (`gpu=true` for GPU layer) |
| `createBlankLayer(name, tileset, x, y, w, h, tw, th)` | Create empty layer for procedural maps |
| `createFromObjects(layerName, config, useTileset)` | Convert Tiled objects to Sprites |
| `getObjectLayer(name)` | Get raw object layer data |
| `setLayer(layer)` | Set current active layer for shorthand methods |

Most tile query/collision/manipulation methods exist on both `Tilemap` (with extra `layer` param) and `TilemapLayerBase` (without). Prefer calling on the layer directly.

### TilemapLayerBase (rendered layer - CPU and GPU)

**Collision:**
`setCollision(indexes)`, `setCollisionBetween(start, stop)`, `setCollisionByProperty(props)`, `setCollisionByExclusion(indexes)`, `setCollisionFromCollisionGroup()`, `setTileIndexCallback(indexes, cb, ctx)`, `setTileLocationCallback(x, y, w, h, cb, ctx)`

**Tile queries:**
`getTileAt(x, y, nonNull)`, `getTileAtWorldXY(wx, wy, nonNull, cam)`, `getTilesWithin(x, y, w, h, opts)`, `getTilesWithinWorldXY(wx, wy, w, h, opts, cam)`, `getTilesWithinShape(shape, opts, cam)`, `hasTileAt(x, y)`, `hasTileAtWorldXY(wx, wy, cam)`, `filterTiles(cb)`, `findTile(cb)`, `forEachTile(cb)`

**Tile manipulation:**
`putTileAt(tile, x, y)`, `putTileAtWorldXY(tile, wx, wy)`, `putTilesAt(arr, x, y)`, `removeTileAt(x, y)`, `fill(index, x, y, w, h)`, `copy(sx, sy, w, h, dx, dy)`, `randomize(x, y, w, h, indexes)`, `weightedRandomize(weights, x, y, w, h)`, `shuffle(x, y, w, h)`, `swapByIndex(a, b)`, `replaceByIndex(find, replace)`, `createFromTiles(indexes, replacements, config)`

**Coordinates:**
`worldToTileXY(wx, wy, snap, vec, cam)`, `tileToWorldXY(tx, ty, vec, cam)`

### TilemapGPULayer (additional)

| Method | Description |
|--------|-------------|
| `generateLayerDataTexture()` | Regenerate GPU texture after tile edits |

### Tile Properties

`index` (number, -1=empty), `x`/`y` (tile coords), `pixelX`/`pixelY` (pixel pos relative to layer), `width`/`height`, `properties` (object from Tiled), `collideLeft`/`Right`/`Up`/`Down` (boolean), `collisionCallback` (function), `tint` (number), `rotation` (number), `alpha`, `flipX`/`flipY`, `physics` (object for engine data)

## Gotchas

1. **Tileset name must match Tiled exactly.** The first argument to `addTilesetImage` is the tileset name as defined in Tiled, not the Phaser texture key. If they don't match, you get `null` back and a console warning.

2. **Layer name must match Tiled exactly.** `createLayer` takes the layer name from Tiled (or layer index). Group layer children are prefixed with `'GroupName/LayerName'`.

3. **Each layer can only be created once.** Calling `createLayer` with the same layer ID twice returns `null` with a warning. The layer data can only be associated with one layer Game Object.

4. **`setCollision` must be called before physics colliders work.** Without marking tiles as collidable, `this.physics.add.collider()` will pass through all tiles.

5. **TilemapGPULayer is orthographic only.** It does not support isometric, hexagonal, or staggered maps. It also only supports a single tileset per layer.

6. **TilemapGPULayer requires manual texture regeneration.** After calling `putTileAt` or other edit methods, call `generateLayerDataTexture()` or the changes won't appear.

7. **"Collection of Images" tilesets are not supported.** The Tiled parser requires all tiles in a tileset to be in a single image. Embedded tilesets in the exported JSON are required.

8. **Tile index -1 means empty.** Many methods return `null` for empty tiles by default. Pass `nonNull: true` to get a Tile object with `index === -1` instead.

9. **`insertNull` in tilemap factory.** When creating a tilemap, `insertNull: true` stores `null` for empty tiles instead of Tile objects with index -1. Saves memory for large sparse maps but prevents dynamic tile placement in empty cells.

10. **Tile callbacks only fire with active physics.** `setTileIndexCallback` and `setTileLocationCallback` require a physics collider or overlap between the body and the layer to trigger.

11. **Layer position and Tiled offset.** If `x` and `y` are not specified in `createLayer`, they default to the layer offset defined in Tiled, not (0, 0).

## Source File Map

| File | Purpose |
|------|---------|
| `src/tilemaps/Tilemap.js` | Main data container with all map-level methods |
| `src/tilemaps/TilemapFactory.js` | Registers `this.add.tilemap()` on GameObjectFactory |
| `src/tilemaps/TilemapLayerBase.js` | Shared base for CPU and GPU layers (extends GameObject) |
| `src/tilemaps/TilemapLayer.js` | CPU-rendered layer (multi-tileset, all orientations) |
| `src/tilemaps/TilemapGPULayer.js` | GPU-accelerated layer (v4, WebGL, orthographic, single tileset) |
| `src/tilemaps/Tile.js` | Individual tile data (index, position, collision, properties) |
| `src/tilemaps/Tileset.js` | Tileset data (name, firstgid, dimensions, image) |
| `src/tilemaps/components/` | Pure functions: `SetCollision`, `GetTileAt`, `PutTileAt`, `SetTileIndexCallback`, etc. |
| `src/tilemaps/parsers/tiled/` | Tiled JSON parsers: `ParseJSONTiled`, `ParseTileLayers`, `ParseObjectLayers`, `ParseTilesets`, `BuildTilesetIndex` |
| `src/tilemaps/ParseToTilemap.js` | Orchestrates parsing and Tilemap creation |
| `src/tilemaps/mapdata/LayerData.js` | Layer data structure |
