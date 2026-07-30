---
name: data-manager
description: "Use this skill when using the Phaser 4 DataManager to store custom key-value data on game objects, listen for data change events, or manage game state. Triggers on: setData, getData, data events, custom data storage."
---

# DataManager

> Phaser's DataManager provides key-value storage with event-driven change tracking. It operates at three levels: per-GameObject (`sprite.setData`/`getData`), per-Scene (`this.data`), and global (`this.registry`). Every set/change/remove operation emits events, enabling reactive data binding between game systems without tight coupling.

**Key source paths:** `src/data/DataManager.js`, `src/data/DataManagerPlugin.js`, `src/data/events/`, `src/gameobjects/GameObject.js` (setData/getData/incData/toggleData)
**Related skills:** ../scenes/SKILL.md, ../events-system/SKILL.md

## Quick Start

```js
// Per-GameObject data (auto-creates DataManager on first use)
const gem = this.add.sprite(100, 100, 'gem');
gem.setData('value', 50);
gem.setData({ color: 'red', level: 2 });
gem.getData('value');            // 50
gem.getData(['value', 'color']); // [50, 'red']

// Increment / toggle helpers
gem.incData('value', 10);       // value is now 60
gem.incData('value', -5);       // value is now 55 (negative to decrement)
gem.toggleData('active');        // false -> true (starts from false if unset)

// Scene-level data (this.data is a DataManagerPlugin)
this.data.set('score', 0);
this.data.get('score');          // 0
this.data.values.score += 100;   // triggers changedata event

// Global registry (shared across ALL scenes)
this.registry.set('highScore', 9999);
// Any scene can read it:
this.registry.get('highScore');  // 9999
```

## Core Concepts

### DataManager (`Phaser.Data.DataManager`)

The base class that stores key-value pairs in an internal `list` object. It provides:

- **`set(key, value)`** -- stores a value; emits `setdata` (new key) or `changedata` + `changedata-{key}` (existing key). Accepts an object to set multiple keys at once.
- **`get(key)`** -- retrieves a value, or pass an array of keys to get an array of values.
- **`inc(key, amount)`** -- increments a numeric value (defaults to +1). Creates from 0 if key does not exist.
- **`toggle(key)`** -- flips a boolean value. Creates from `false` if key does not exist.
- **`remove(key)`** -- deletes a key; emits `removedata`. Accepts an array of keys.
- **`has(key)`** -- returns `true` if the key exists.
- **`getAll()`** -- returns a shallow copy of all key-value pairs as a plain object.
- **`query(regex)`** -- returns all entries whose keys match the given RegExp.
- **`each(callback, context, ...args)`** -- iterates all entries. Callback signature: `(parent, key, value, ...args)`.
- **`merge(data, overwrite)`** -- bulk-imports from an object. `overwrite` defaults to `true`; set `false` to skip existing keys.
- **`pop(key)`** -- retrieves and deletes a key in one call; emits `removedata`.
- **`reset()`** -- clears all data and unfreezes.
- **`freeze` / `setFreeze(bool)`** -- when frozen, all set/remove/inc/toggle operations silently no-op.
- **`count`** -- read-only property returning the number of stored entries.

The `values` proxy object allows direct property access with event emission:

```js
// After set('gold', 100), you can do:
data.values.gold += 50; // emits changedata and changedata-gold
// But you MUST use set() to create a key first -- direct assignment
// to values for a new key will NOT set up the event proxy.
```

### Scene Data Plugin (`Phaser.Data.DataManagerPlugin`)

Extends DataManager. Registered as the `data` scene plugin, accessible as `this.data` in any Scene. It uses the Scene's event emitter (`scene.sys.events`), so data events fire on the Scene's event bus.

```js
// In a Scene's create():
this.data.set('lives', 3);

// Listen on the scene's event emitter
this.events.on('changedata-lives', (scene, value, previousValue) => {
    console.log('Lives changed from', previousValue, 'to', value);
});
```

The plugin auto-cleans on scene shutdown (removes its shutdown listener) and fully destroys on scene destroy.

### Registry (Global Data Store)

The registry is a plain `DataManager` instance on the `Game` object (`game.registry`). It has its own dedicated `EventEmitter` (not shared with any scene). Every scene gets a reference as `this.registry` via the injection map.

```js
// Scene A sets global data
this.registry.set('currentLevel', 1);

// Scene B reads it
const level = this.registry.get('currentLevel');

// Listen for registry changes (note: events fire on registry.events, NOT this.events)
this.registry.events.on('changedata-currentLevel', (game, value, previousValue) => {
    console.log('Level changed to', value);
});
```

The registry persists for the lifetime of the Game. It is never automatically cleared on scene restart or shutdown.

### Per-GameObject Data

GameObjects do NOT have a DataManager by default. It is created lazily on first call to `setData()`, `getData()`, `incData()`, or `toggleData()`. You can also explicitly call `setDataEnabled()`.

The DataManager's event emitter is the GameObject itself (which extends EventEmitter), so data events fire directly on the GameObject:

```js
const player = this.add.sprite(0, 0, 'player');
player.setData('hp', 100);

// Listen directly on the game object
player.on('changedata-hp', (gameObject, value, previousValue) => {
    if (value <= 0) {
        gameObject.destroy();
    }
});
```

## Common Patterns

### Setting and Getting Data

```js
// Single key
sprite.setData('speed', 200);
sprite.getData('speed'); // 200

// Multiple keys at once (object form)
sprite.setData({ speed: 200, direction: 'left', hp: 100 });

// Batch get with destructuring
const [speed, hp] = sprite.getData(['speed', 'hp']);

// Direct values access (read and write after initial set)
sprite.data.values.speed = 300; // emits changedata event
const s = sprite.data.values.speed; // 300
```

### Listening for Changes

```js
// Listen for ANY data change on a game object
sprite.on('changedata', (gameObject, key, value, previousValue) => {
    console.log(key, 'changed to', value);
});

// Listen for a SPECIFIC key change (preferred -- more efficient)
sprite.on('changedata-hp', (gameObject, value, previousValue) => {
    this.hpBar.setValue(value);
});

// Listen for new data being set (first time only)
sprite.on('setdata', (gameObject, key, value) => {
    console.log('New data key:', key);
});

// Listen for data removal
sprite.on('removedata', (gameObject, key, value) => {
    console.log('Removed:', key, 'was', value);
});
```

### Global Registry for Cross-Scene State

```js
// HUD scene watches for score changes set by the Game scene
// In HUDScene.create():
this.registry.events.on('changedata-score', (game, value) => {
    this.scoreText.setText('Score: ' + value);
});
this.events.once('shutdown', () => {
    this.registry.events.off('changedata-score');
});

// In GameScene.update():
this.registry.set('score', this.score);
```

### Complex Data and Objects

```js
// You can store any value type: numbers, strings, booleans, objects, arrays
sprite.setData('inventory', ['sword', 'shield']);
sprite.setData('stats', { str: 10, dex: 8, int: 12 });

// CAUTION: mutating a stored object/array does NOT trigger changedata
const inv = sprite.getData('inventory');
inv.push('potion');
// No event fired! The reference didn't change.

// To trigger the event, re-set the key:
sprite.setData('inventory', [...inv]); // new array reference triggers changedata
```

### Merging Data

```js
// Merge defaults -- only sets keys that don't already exist
sprite.data.merge({ hp: 100, speed: 200, armor: 0 }, false);

// Merge and overwrite existing values
sprite.data.merge(savedState, true);
```

### Querying Data by Pattern

```js
// Find all keys matching a regex
this.data.set('enemy_1_hp', 50);
this.data.set('enemy_2_hp', 80);
this.data.set('player_hp', 100);

const enemyData = this.data.query(/^enemy_/);
// { enemy_1_hp: 50, enemy_2_hp: 80 }
```

### Freezing Data

```js
// Prevent all modifications (set, remove, inc, toggle all become no-ops)
sprite.data.freeze = true;
sprite.setData('hp', 0); // silently ignored
sprite.data.freeze = false;
sprite.setData('hp', 0); // works again

// Also available as a chainable method
sprite.data.setFreeze(true);
```

### Data Persistence Pattern

```js
// Save to localStorage
function saveGame(scene) {
    const state = scene.data.getAll();
    localStorage.setItem('saveData', JSON.stringify(state));
}

// Restore from localStorage
function loadGame(scene) {
    const raw = localStorage.getItem('saveData');
    if (raw) {
        scene.data.merge(JSON.parse(raw), true);
    }
}
```

## Events

All data events are defined in `Phaser.Data.Events`. The emitter depends on context: for GameObjects it is the GameObject itself; for scene data it is `scene.sys.events`; for the registry it is `registry.events`.

| Constant | String | Fired When | Callback Args |
|---|---|---|---|
| `SET_DATA` | `'setdata'` | A new key is created | `(parent, key, value)` |
| `CHANGE_DATA` | `'changedata'` | An existing key's value changes | `(parent, key, value, previousValue)` |
| `CHANGE_DATA_KEY` | `'changedata-'` | Specific key changes (append key name) | `(parent, value, previousValue)` |
| `REMOVE_DATA` | `'removedata'` | A key is removed | `(parent, key, value)` |
| `DESTROY` | `'destroy'` | DataManager's parent is destroyed | (none) |

The `parent` argument is the owner of the DataManager (the GameObject, Scene, or Game instance).

Note: `CHANGE_DATA_KEY` is a prefix. The actual event string is `'changedata-'` + the key name. For example, setting a key called `score` emits `'changedata-score'`.

## API Quick Reference

### GameObject Convenience Methods

| Method | Returns | Description |
|---|---|---|
| `setDataEnabled()` | `this` | Explicitly creates the DataManager (normally auto-created) |
| `setData(key, value)` | `this` | Set one key or pass an object for multiple |
| `getData(key)` | `*` | Get one value or pass an array for multiple |
| `incData(key, amount?)` | `this` | Increment numeric value (default +1, negative to decrement) |
| `toggleData(key)` | `this` | Toggle boolean value |

### DataManager Methods

| Method | Returns | Description |
|---|---|---|
| `set(key, value)` | `this` | Set single key or object of key-value pairs |
| `get(key)` | `*` | Get value(s) -- string or array of strings |
| `getAll()` | `object` | Shallow copy of all entries |
| `query(regex)` | `object` | All entries with keys matching the RegExp |
| `each(cb, ctx, ...args)` | `this` | Iterate all entries |
| `merge(data, overwrite?)` | `this` | Bulk import; overwrite defaults to `true` |
| `remove(key)` | `this` | Delete key(s) -- string or array |
| `pop(key)` | `*` | Get and delete in one call |
| `has(key)` | `boolean` | Check if key exists |
| `inc(key, amount?)` | `this` | Increment (default +1) |
| `toggle(key)` | `this` | Toggle boolean |
| `setFreeze(bool)` | `this` | Freeze/unfreeze modifications |
| `reset()` | `this` | Clear all data and unfreeze |
| `count` | `number` | Read-only entry count |
| `freeze` | `boolean` | Get/set frozen state |
| `values` | `object` | Proxy object for direct property access |

## `get()` vs `values` -- Copies vs Live References

Understanding the difference between `get()` and `values` is critical for correct data updates:

```js
// get() returns a copy for primitives -- modifying the local variable does NOT update the DataManager
let score = this.data.get('score');
score += 10;  // local copy only, DataManager still has the old value

// values provides a live proxy -- assignment triggers CHANGE_DATA event
this.data.values.score += 10;  // updates the DataManager AND emits changedata-score

// For objects, get() returns the stored reference (not a deep copy)
const stats = this.data.get('stats');
stats.hp -= 10; // mutates the stored object but does NOT trigger events
this.data.set('stats', { ...stats }); // re-set with new reference to trigger event
```

## Event Emitter Routing

Data events emit on different targets depending on where the DataManager lives:

| DataManager Owner | Events Emit On | Example Listener |
|---|---|---|
| GameObject | The GameObject itself | `sprite.on('changedata-hp', ...)` |
| Scene (`this.data`) | Scene event bus (`this.events`) | `this.events.on('changedata-score', ...)` |
| Registry (`this.registry`) | Registry's own emitter | `this.registry.events.on('changedata-score', ...)` |

The key-specific event `'changedata-{key}'` fires only for that exact key, while the generic `'changedata'` fires for every key change. Always prefer key-specific listeners for performance.

## Gotchas

### Keys Are Case-Sensitive

`'gold'` and `'Gold'` are two different keys. Be consistent with naming conventions.

### values Proxy Requires set() First

You must call `set(key, value)` to create a key before modifying it via `data.values.key`. Direct assignment to `values` for a brand-new key will NOT create the event proxy -- it creates a plain property that emits no events.

### Object/Array Mutation Does Not Trigger Events

Mutating a stored object or array in place does not emit `changedata` because the reference has not changed. You must re-set the key with a new reference to trigger the event.

### Registry Listeners Persist Across Scene Restarts

The registry lives on the Game object. Listeners added to `this.registry.events` are NOT cleaned up when a scene restarts. Always remove them on `SHUTDOWN`:

```js
create() {
    const handler = (game, value) => { this.updateHUD(value); };
    this.registry.events.on('changedata-score', handler);
    this.events.once('shutdown', () => {
        this.registry.events.off('changedata-score', handler);
    });
}
```

### Frozen DataManagers Fail Silently

When `freeze` is `true`, all write operations (`set`, `remove`, `inc`, `toggle`, `pop`, `merge`) silently do nothing. No error is thrown and no event is emitted. This can be confusing if you forget you froze the data.

### Scene Data Plugin Shutdown vs Destroy

The `DataManagerPlugin` removes its shutdown listener on shutdown but does NOT clear data on shutdown. Data persists if the scene restarts. It only fully resets on scene destroy. If you need a clean slate on restart, manually reset in a shutdown listener:

```js
this.events.once('shutdown', () => {
    this.data.reset();
});
```

### `inc()` on Non-Numeric Values

`inc()` uses the `+` operator internally. On strings it concatenates rather than adds numerically. On booleans, they coerce to 0 or 1 before incrementing. Only use `inc()` on keys you know hold numbers.

### `reset()` Emits No Events

Calling `reset()` clears all data silently -- no `removedata` events fire for the deleted keys. If you need removal events for each key, iterate and call `remove()` individually instead.

### Freezing Can Interrupt Batch Operations

`setFreeze(true)` takes effect immediately. If you freeze mid-way through a series of `set()` calls, subsequent calls in the batch silently no-op. Always freeze only after all writes are complete.

### `getAll()` Returns a Snapshot

`getAll()` returns a new plain object each time. It is a shallow copy -- primitive values are independent, but object/array values still share references with the DataManager's internal storage.

### First Argument in changedata-key Callbacks

For the generic `changedata` event, the callback receives `(parent, key, value, previousValue)`. For the key-specific `changedata-{key}` event, the `key` argument is omitted: `(parent, value, previousValue)`. This difference is easy to miss.

## Source File Map

| Path | Description |
|---|---|
| `src/data/DataManager.js` | Core DataManager class -- set, get, each, merge, remove, query, freeze, events |
| `src/data/DataManagerPlugin.js` | Scene plugin extending DataManager; registered as `this.data` |
| `src/data/events/index.js` | Event constant exports (CHANGE_DATA, SET_DATA, REMOVE_DATA, CHANGE_DATA_KEY, DESTROY) |
| `src/data/events/SET_DATA_EVENT.js` | `'setdata'` -- emitted when a new key is created |
| `src/data/events/CHANGE_DATA_EVENT.js` | `'changedata'` -- emitted when an existing key's value changes |
| `src/data/events/CHANGE_DATA_KEY_EVENT.js` | `'changedata-'` -- per-key change event prefix |
| `src/data/events/REMOVE_DATA_EVENT.js` | `'removedata'` -- emitted when a key is removed |
| `src/data/events/DESTROY_EVENT.js` | `'destroy'` -- DataManager listens for this from its parent |
| `src/gameobjects/GameObject.js` | setData, getData, incData, toggleData, setDataEnabled convenience methods |
| `src/core/Game.js` | Creates `game.registry` -- the global DataManager instance |
| `src/scene/Scene.js` | Exposes `this.registry` (injected from Game) and `this.data` (DataManagerPlugin) |
