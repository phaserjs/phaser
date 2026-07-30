---
name: events-system
description: "Use this skill when working with the Phaser 4 event system. Covers EventEmitter, scene events, game events, custom events, and event-driven communication. Triggers on: events, on, emit, EventEmitter, scene events, listeners."
---

# Events System

> Phaser uses the EventEmitter pattern (via eventemitter3) throughout the entire framework. Every major system -- Game, Scene, Input, Loader, Cameras, Sound, Tweens, Physics, Textures, Animations -- is an EventEmitter or contains one. Events use lowercase string keys. Phaser provides named constants for all built-in events to avoid typos and enable IDE autocomplete.

**Key source paths:** `src/events/EventEmitter.js`, `src/scene/events/`, `src/core/events/`, `src/input/events/`, `src/loader/events/`, `src/animations/events/`, `src/cameras/2d/events/`, `src/sound/events/`, `src/tweens/events/`, `src/physics/arcade/events/`, `src/textures/events/`, `src/gameobjects/events/`, `src/time/events/`
**Related skills:** ../scenes/SKILL.md, ../input-keyboard-mouse-touch/SKILL.md

## Quick Start

```js
// on — listen for an event (persists until removed)
this.input.on('pointerdown', (pointer) => {
    console.log('clicked at', pointer.x, pointer.y);
});

// once — listen for an event, auto-removes after first fire
this.events.once('shutdown', () => {
    console.log('scene shutting down');
});

// off — remove a specific listener (must pass same function reference)
const handler = (pointer) => { /* ... */ };
this.input.on('pointerdown', handler);
this.input.off('pointerdown', handler);

// emit — fire a custom event with arguments
this.events.emit('player-died', this.player, this.score);

// removeAllListeners — remove all listeners for an event (or all events)
this.events.removeAllListeners('player-died');
this.events.removeAllListeners(); // all events
```

### Using Named Constants (Preferred)

```js
// Always prefer constants over raw strings to prevent typos
this.events.on(Phaser.Scenes.Events.UPDATE, (time, delta) => {
    // runs every frame
});

this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
    // pointer pressed
});

this.game.events.on(Phaser.Core.Events.BLUR, () => {
    // browser tab lost focus
});
```

## Core Concepts

### EventEmitter Base Class

`Phaser.Events.EventEmitter` extends eventemitter3. It adds `shutdown()` and `destroy()` methods that both call `removeAllListeners()`.

**Full API (inherited from eventemitter3):**

| Method | Description |
|---|---|
| `on(event, fn, context?)` | Add persistent listener. Returns `this` for chaining |
| `addListener(event, fn, context?)` | Alias for `on` |
| `once(event, fn, context?)` | Add one-time listener; auto-removed after first fire |
| `off(event, fn?, context?, once?)` | Remove listener(s). Must pass same `fn` reference to remove specific listener |
| `removeListener(event, fn?, context?, once?)` | Alias for `off` |
| `removeAllListeners(event?)` | Remove all listeners for event, or all events if no arg |
| `emit(event, ...args)` | Fire event. Returns `true` if it had listeners |
| `listeners(event)` | Return array of listener functions for an event |
| `listenerCount(event)` | Return number of listeners for an event |
| `eventNames()` | Return array of event names that have listeners |
| `shutdown()` | Calls `removeAllListeners()` |
| `destroy()` | Calls `removeAllListeners()` |

### Event Strings vs Constants

Every built-in event is a lowercase string exported as a constant. The constant name maps predictably to the string:

```js
Phaser.Scenes.Events.UPDATE        // 'update'
Phaser.Scenes.Events.PRE_UPDATE    // 'preupdate'
Phaser.Scenes.Events.SHUTDOWN      // 'shutdown'
Phaser.Core.Events.BOOT            // 'boot'
Phaser.Input.Events.POINTER_DOWN   // 'pointerdown'
```

Some events use a key-suffix pattern for per-key listening:

```js
// Loader: listen for a specific file completing
this.load.on(Phaser.Loader.Events.FILE_KEY_COMPLETE + 'image-logo', (key, type, data) => {});
// String value: 'filecomplete-image-logo'

// Animations: listen for a specific animation completing on a sprite
sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'walk', () => {});
// String value: 'animationcomplete-walk'

// Textures: listen for a specific texture being added
this.textures.on(Phaser.Textures.Events.ADD_KEY + 'myTexture', () => {});
// String value: 'addtexture-myTexture'
```

### Context (Third Argument)

The third argument to `on`/`once` sets `this` inside the callback. Defaults to the emitter.

```js
// 'this' inside handler refers to the scene
this.input.on('pointerdown', function (pointer) {
    this.cameras.main.shake(100); // 'this' = scene
}, this);

// Arrow functions ignore the context argument (they capture lexical 'this')
this.input.on('pointerdown', (pointer) => {
    this.cameras.main.shake(100); // 'this' = enclosing scope (scene in create)
});
```

## Common Patterns

### Scene Lifecycle Events

Frame loop order: `preupdate` -> `update` -> `Scene.update()` -> `postupdate` -> `prerender` -> `render`

```js
create() {
    this.events.on(Phaser.Scenes.Events.UPDATE, this.onUpdate, this);
    // CRITICAL: always clean up on shutdown to prevent leaks on scene restart
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.events.off(Phaser.Scenes.Events.UPDATE, this.onUpdate, this);
        this.input.off('pointerdown', this.onPointerDown, this);
    });
}
```

### Game-Level Events

```js
// game.events fires on the Game instance, shared across all scenes
// Access from a scene via this.game.events
this.game.events.on(Phaser.Core.Events.BLUR, this.handleBlur, this);
this.game.events.on(Phaser.Core.Events.VISIBLE, this.handleVisible, this);
```

### Inter-Scene Communication

```js
// METHOD 1: game.events — a global event bus accessible from all scenes
// Scene A emits:
this.game.events.emit('score-changed', this.score);
// Scene B listens:
this.game.events.on('score-changed', (score) => { this.scoreText.setText(score); });

// METHOD 2: this.registry — a shared DataManager across all scenes
// The registry is a Phaser.Data.DataManager on the Game instance.
// Scene A sets data:
this.registry.set('score', 100);
// Scene B listens for changes:
this.registry.events.on('changedata-score', (parent, value, previousValue) => {
    this.scoreText.setText(value);
});

// METHOD 3: Direct scene access via ScenePlugin
this.scene.get('UIScene').events.emit('update-health', hp);
```

### Custom Events

```js
// Emit custom events with arbitrary data arguments
this.events.emit('player-died', this.player, { lives: this.lives });
this.events.on('player-died', (player, data) => {
    console.log('Lives remaining:', data.lives);
});
```

## All Event Namespaces Reference

### Scene Events (`Phaser.Scenes.Events`)

Emitter: `this.events` (the Scene's Systems EventEmitter)

| Constant | String | When |
|---|---|---|
| `BOOT` | `'boot'` | Scene Systems boot (for plugins) |
| `READY` | `'ready'` | Scene Systems fully ready |
| `START` | `'start'` | Scene starts running |
| `CREATE` | `'create'` | After Scene.create() completes |
| `PRE_UPDATE` | `'preupdate'` | Before update each frame |
| `UPDATE` | `'update'` | Main update each frame |
| `POST_UPDATE` | `'postupdate'` | After update each frame |
| `PRE_RENDER` | `'prerender'` | Before render each frame |
| `RENDER` | `'render'` | During render each frame |
| `PAUSE` | `'pause'` | Scene paused |
| `RESUME` | `'resume'` | Scene resumed from pause |
| `SLEEP` | `'sleep'` | Scene put to sleep |
| `WAKE` | `'wake'` | Scene woken from sleep |
| `SHUTDOWN` | `'shutdown'` | Scene shutting down (may restart) |
| `DESTROY` | `'destroy'` | Scene permanently destroyed |
| `ADDED_TO_SCENE` | `'addedtoscene'` | GameObject added to scene |
| `REMOVED_FROM_SCENE` | `'removedfromscene'` | GameObject removed from scene |
| `TRANSITION_INIT` | `'transitioninit'` | Transition initialized (target scene) |
| `TRANSITION_START` | `'transitionstart'` | Transition started (target scene) |
| `TRANSITION_OUT` | `'transitionout'` | Transition out (source scene) |
| `TRANSITION_COMPLETE` | `'transitioncomplete'` | Transition finished |
| `TRANSITION_WAKE` | `'transitionwake'` | Transition wakes target scene |

### Game Events (`Phaser.Core.Events`)

Emitter: `this.game.events` or `game.events`

| Constant | String | When |
|---|---|---|
| `BOOT` | `'boot'` | Game instance finished booting |
| `READY` | `'ready'` | Game ready to start running |
| `SYSTEM_READY` | `'systemready'` | All global systems ready |
| `PRE_STEP` | `'prestep'` | Before game loop step |
| `STEP` | `'step'` | Main game loop step |
| `POST_STEP` | `'poststep'` | After game loop step |
| `PRE_RENDER` | `'prerender'` | Before rendering all scenes |
| `POST_RENDER` | `'postrender'` | After rendering all scenes |
| `PAUSE` | `'pause'` | Game paused |
| `RESUME` | `'resume'` | Game resumed |
| `BLUR` | `'blur'` | Browser tab lost focus |
| `FOCUS` | `'focus'` | Browser tab gained focus |
| `HIDDEN` | `'hidden'` | Page Visibility API: hidden |
| `VISIBLE` | `'visible'` | Page Visibility API: visible |
| `CONTEXT_LOST` | `'contextlost'` | WebGL context lost |
| `DESTROY` | `'destroy'` | Game being destroyed |

### Input Events (`Phaser.Input.Events`)

Emitter: `this.input` (scene-level) or individual GameObjects. Events exist at three levels: scene-level (`this.input`), scene-level with gameobject prefix, and directly on interactive GameObjects. See ../input-keyboard-mouse-touch/SKILL.md for full usage.

**Scene-level pointer events (on `this.input`):**
`POINTER_DOWN` `'pointerdown'` | `POINTER_UP` `'pointerup'` | `POINTER_MOVE` `'pointermove'` | `POINTER_OVER` `'pointerover'` | `POINTER_OUT` `'pointerout'` | `POINTER_WHEEL` `'wheel'` | `POINTER_DOWN_OUTSIDE` `'pointerdownoutside'` | `POINTER_UP_OUTSIDE` `'pointerupoutside'`

**Scene-level gameobject events (on `this.input`):**
`GAMEOBJECT_DOWN` `'gameobjectdown'` | `GAMEOBJECT_UP` `'gameobjectup'` | `GAMEOBJECT_MOVE` `'gameobjectmove'` | `GAMEOBJECT_OVER` `'gameobjectover'` | `GAMEOBJECT_OUT` `'gameobjectout'` | `GAMEOBJECT_WHEEL` `'gameobjectwheel'`

**Per-GameObject events (emitted on the GameObject itself, requires `setInteractive()`):**
`GAMEOBJECT_POINTER_DOWN` `'pointerdown'` | `GAMEOBJECT_POINTER_UP` `'pointerup'` | `GAMEOBJECT_POINTER_MOVE` `'pointermove'` | `GAMEOBJECT_POINTER_OVER` `'pointerover'` | `GAMEOBJECT_POINTER_OUT` `'pointerout'` | `GAMEOBJECT_POINTER_WHEEL` `'wheel'`

**Drag events (on `this.input` and on GameObjects with same string):**
`DRAG_START`/`GAMEOBJECT_DRAG_START` `'dragstart'` | `DRAG`/`GAMEOBJECT_DRAG` `'drag'` | `DRAG_END`/`GAMEOBJECT_DRAG_END` `'dragend'` | `DRAG_ENTER`/`GAMEOBJECT_DRAG_ENTER` `'dragenter'` | `DRAG_OVER`/`GAMEOBJECT_DRAG_OVER` `'dragover'` | `DRAG_LEAVE`/`GAMEOBJECT_DRAG_LEAVE` `'dragleave'` | `DROP`/`GAMEOBJECT_DROP` `'drop'`

**Other:** `GAME_OUT` `'gameout'` | `GAME_OVER` `'gameover'` | `POINTERLOCK_CHANGE` `'pointerlockchange'`

### Loader Events (`Phaser.Loader.Events`)

Emitter: `this.load`

| Constant | String | When |
|---|---|---|
| `ADD` | `'addfile'` | File added to load queue |
| `START` | `'start'` | Loader starts |
| `PROGRESS` | `'progress'` | Overall progress updated (0-1) |
| `FILE_LOAD` | `'load'` | Individual file loaded |
| `FILE_PROGRESS` | `'fileprogress'` | Individual file progress |
| `FILE_COMPLETE` | `'filecomplete'` | Individual file completed processing |
| `FILE_KEY_COMPLETE` | `'filecomplete-'` | Specific file completed (append `type-key`) |
| `FILE_LOAD_ERROR` | `'loaderror'` | File failed to load |
| `POST_PROCESS` | `'postprocess'` | All files loaded, post-processing |
| `COMPLETE` | `'complete'` | All loading complete |

### Animation Events (`Phaser.Animations.Events`)

Emitter: individual sprites (per-sprite) or `this.anims` (global AnimationManager)

| Constant | String | When |
|---|---|---|
| `ADD_ANIMATION` | `'add'` | Animation added to manager |
| `REMOVE_ANIMATION` | `'remove'` | Animation removed from manager |
| `PAUSE_ALL` | `'pauseall'` | All animations paused |
| `RESUME_ALL` | `'resumeall'` | All animations resumed |
| `ANIMATION_START` | `'animationstart'` | Animation starts playing on a sprite |
| `ANIMATION_RESTART` | `'animationrestart'` | Animation restarts on a sprite |
| `ANIMATION_REPEAT` | `'animationrepeat'` | Animation repeats on a sprite |
| `ANIMATION_UPDATE` | `'animationupdate'` | Animation frame changes on a sprite |
| `ANIMATION_COMPLETE` | `'animationcomplete'` | Animation finishes on a sprite |
| `ANIMATION_COMPLETE_KEY` | `'animationcomplete-'` | Specific animation finishes (append key) |
| `ANIMATION_STOP` | `'animationstop'` | Animation stopped on a sprite |

### Camera Events (`Phaser.Cameras.Scene2D.Events`)

Emitter: individual camera instance (e.g. `this.cameras.main`). Each camera effect has a START and COMPLETE pair.

`DESTROY` `'cameradestroy'` | `FADE_IN_START` `'camerafadeinstart'` | `FADE_IN_COMPLETE` `'camerafadeincomplete'` | `FADE_OUT_START` `'camerafadeoutstart'` | `FADE_OUT_COMPLETE` `'camerafadeoutcomplete'` | `FLASH_START` `'cameraflashstart'` | `FLASH_COMPLETE` `'cameraflashcomplete'` | `PAN_START` `'camerapanstart'` | `PAN_COMPLETE` `'camerapancomplete'` | `ROTATE_START` `'camerarotatestart'` | `ROTATE_COMPLETE` `'camerarotatecomplete'` | `SHAKE_START` `'camerashakestart'` | `SHAKE_COMPLETE` `'camerashakecomplete'` | `ZOOM_START` `'camerazoomstart'` | `ZOOM_COMPLETE` `'camerazoomcomplete'` | `FOLLOW_UPDATE` `'followupdate'` | `PRE_RENDER` `'prerender'` | `POST_RENDER` `'postrender'`

### Sound Events (`Phaser.Sound.Events`)

Emitter: individual sound instances or `this.sound` (SoundManager)

**Per-sound instance events:**
`PLAY` `'play'` | `PAUSE` `'pause'` | `RESUME` `'resume'` | `STOP` `'stop'` | `COMPLETE` `'complete'` | `LOOP` `'loop'` | `LOOPED` `'looped'` | `SEEK` `'seek'` | `MUTE` `'mute'` | `VOLUME` `'volume'` | `RATE` `'rate'` | `DETUNE` `'detune'` | `PAN` `'pan'` | `DECODED` `'decoded'` | `DESTROY` `'destroy'`

**SoundManager-level events (on `this.sound`):**
`GLOBAL_MUTE` `'mute'` | `GLOBAL_VOLUME` `'volume'` | `GLOBAL_RATE` `'rate'` | `GLOBAL_DETUNE` `'detune'` | `PAUSE_ALL` `'pauseall'` | `RESUME_ALL` `'resumeall'` | `STOP_ALL` `'stopall'` | `DECODED_ALL` `'decodedall'` | `UNLOCKED` `'unlocked'`

### Tween Events (`Phaser.Tweens.Events`)

Emitter: individual tween instances

| Constant | String | When |
|---|---|---|
| `TWEEN_ACTIVE` | `'active'` | Tween becomes active |
| `TWEEN_START` | `'start'` | Tween starts first play |
| `TWEEN_UPDATE` | `'update'` | Tween updates a value |
| `TWEEN_YOYO` | `'yoyo'` | Tween yoyos (reverses direction) |
| `TWEEN_REPEAT` | `'repeat'` | Tween repeats |
| `TWEEN_LOOP` | `'loop'` | Tween loops |
| `TWEEN_PAUSE` | `'pause'` | Tween paused |
| `TWEEN_RESUME` | `'resume'` | Tween resumed |
| `TWEEN_COMPLETE` | `'complete'` | Tween finishes |
| `TWEEN_STOP` | `'stop'` | Tween stopped manually |

### Arcade Physics Events (`Phaser.Physics.Arcade.Events`)

Emitter: `this.physics.world`

| Constant | String | When |
|---|---|---|
| `COLLIDE` | `'collide'` | Two bodies collide |
| `OVERLAP` | `'overlap'` | Two bodies overlap |
| `TILE_COLLIDE` | `'tilecollide'` | Body collides with a tile |
| `TILE_OVERLAP` | `'tileoverlap'` | Body overlaps with a tile |
| `WORLD_BOUNDS` | `'worldbounds'` | Body hits world boundary |
| `WORLD_STEP` | `'worldstep'` | Physics world completes a step |
| `PAUSE` | `'pause'` | Physics world paused |
| `RESUME` | `'resume'` | Physics world resumed |

### Texture Events (`Phaser.Textures.Events`)

Emitter: `this.textures` (TextureManager)

| Constant | String | When |
|---|---|---|
| `ADD` | `'addtexture'` | Any texture added |
| `ADD_KEY` | `'addtexture-'` | Specific texture added (append key) |
| `REMOVE` | `'removetexture'` | Any texture removed |
| `REMOVE_KEY` | `'removetexture-'` | Specific texture removed (append key) |
| `LOAD` | `'onload'` | Texture source loaded |
| `ERROR` | `'onerror'` | Texture source load error |
| `READY` | `'ready'` | Texture manager ready |

### GameObject Events (`Phaser.GameObjects.Events`)

Emitter: individual GameObjects

| Constant | String | When |
|---|---|---|
| `ADDED_TO_SCENE` | `'addedtoscene'` | GameObject added to a scene |
| `REMOVED_FROM_SCENE` | `'removedfromscene'` | GameObject removed from scene |
| `DESTROY` | `'destroy'` | GameObject destroyed |

**Video GameObject events (on Video GameObjects):**
`VIDEO_PLAY` `'play'` | `VIDEO_PLAYING` `'playing'` | `VIDEO_COMPLETE` `'complete'` | `VIDEO_LOOP` `'loop'` | `VIDEO_STOP` `'stop'` | `VIDEO_CREATED` `'created'` | `VIDEO_ERROR` `'error'` | `VIDEO_LOCKED` `'locked'` | `VIDEO_UNLOCKED` `'unlocked'` | `VIDEO_METADATA` `'metadata'` | `VIDEO_SEEKED` `'seeked'` | `VIDEO_SEEKING` `'seeking'` | `VIDEO_STALLED` `'stalled'` | `VIDEO_TEXTURE` `'textureready'` | `VIDEO_UNSUPPORTED` `'unsupported'`

### Time Events (`Phaser.Time.Events`)

Emitter: `Phaser.Time.TimerEvent` instances

| Constant | String | When |
|---|---|---|
| `COMPLETE` | `'complete'` | TimerEvent finishes all repeats |

### Event Removal Safety

You must pass the SAME function reference AND the same context/scope to `off()` that you used with `on()`. Anonymous or inline arrow functions cannot be removed.

```js
// BAD: arrow function cannot be removed later
this.events.on('update', () => { this.doStuff(); });

// GOOD: named method can be removed
this.events.on('update', this.onUpdate, this);
this.events.off('update', this.onUpdate, this);
```

### once() Auto-Removes

`once()` automatically removes the listener after first fire. No manual cleanup needed.

```js
this.events.once(Phaser.Scenes.Events.CREATE, this.onFirstCreate, this);
```

### Utility Methods

```js
emitter.listenerCount('update');          // number of listeners for an event
emitter.eventNames();                      // ['update', 'player-died'] -- all registered event names
emitter.removeAllListeners('player-died'); // remove all listeners for one event
emitter.removeAllListeners();              // remove ALL listeners for ALL events
```

### Creating a Standalone EventEmitter

```js
const bus = new Phaser.Events.EventEmitter();
bus.on('inventory-changed', (items) => { console.log(items.length); });
bus.emit('inventory-changed', this.inventory);
```

### Scene Events vs Game Events

- `this.events` -- Scene-specific. Fires scene lifecycle events. Cleaned up when scene is destroyed.
- `this.game.events` -- Global. Fires game-level events (blur, focus, pause, resume). Persists across scene restarts -- clean up on SHUTDOWN.

```js
create() {
    this.events.on(Phaser.Scenes.Events.UPDATE, this.onUpdate, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.onBlur, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.game.events.off(Phaser.Core.Events.BLUR, this.onBlur, this);
    });
}
```

## Gotchas

### Memory Leaks from Unremoved Listeners

The most common source of bugs. If a scene uses `on()` and the scene restarts via `scene.restart()`, old listeners persist because `on()` does not auto-remove. Each restart adds duplicate listeners.

```js
// BAD: leaks listeners on every scene restart
create() {
    this.input.on('pointerdown', this.shoot, this);
}

// GOOD: clean up in shutdown
create() {
    this.input.on('pointerdown', this.shoot, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.input.off('pointerdown', this.shoot, this);
    });
}

// ALSO GOOD: use once() for events you only need fired once
create() {
    this.events.once(Phaser.Scenes.Events.CREATE, this.onFirstCreate, this);
}
```

### shutdown vs destroy

- `SHUTDOWN` fires when a scene stops but can restart later. Clean up listeners here.
- `DESTROY` fires when a scene is permanently removed. Use for final cleanup.
- A scene restart fires `SHUTDOWN` then `START` then `CREATE`. It does NOT fire `DESTROY`.

### Context Binding

The third argument to `on`/`once` sets `this` inside the callback. Without it, `this` defaults to the emitter, not the scene. Use `this` as the third argument with regular functions, or use arrow functions (which capture lexical `this`).

### off() Requires Exact References

`off()` only works if you pass the exact same function reference (and context) used with `on()`. Anonymous functions or arrow literals cannot be removed -- store a reference or use a class method.

### Input Event Hierarchy

Input events fire in order: (1) `GAMEOBJECT_POINTER_DOWN` on the GameObject, (2) `GAMEOBJECT_DOWN` on `this.input`, (3) `POINTER_DOWN` on `this.input`. Higher handlers can stop propagation.

### Game Events vs Scene Events

`this.game.events` and `this.events` are different emitters. Game events fire once per game loop tick across all scenes. Scene events fire per-scene. Listeners on `game.events` persist across scene restarts -- always clean them up on SHUTDOWN:

```js
create() {
    this.game.events.on(Phaser.Core.Events.BLUR, this.onBlur, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.game.events.off(Phaser.Core.Events.BLUR, this.onBlur, this);
    });
}
```

## Source File Map

| Path | Description |
|---|---|
| `src/events/EventEmitter.js` | Base EventEmitter class (wraps eventemitter3) |
| `src/scene/events/` | Scene lifecycle events (22 events) |
| `src/core/events/` | Game-level events (16 events) |
| `src/input/events/` | Input/pointer/drag events (48 events) |
| `src/loader/events/` | Asset loading events (10 events) |
| `src/animations/events/` | Animation playback events (11 events) |
| `src/cameras/2d/events/` | Camera effect events (18 events) |
| `src/sound/events/` | Sound playback events (24 events) |
| `src/tweens/events/` | Tween lifecycle events (10 events) |
| `src/physics/arcade/events/` | Arcade physics events (8 events) |
| `src/textures/events/` | Texture manager events (7 events) |
| `src/gameobjects/events/` | GameObject lifecycle + Video events (18 events) |
| `src/time/events/` | TimerEvent events (1 event) |
