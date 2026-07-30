---
name: scenes
description: "Use this skill when working with Phaser 4 scenes. Covers scene lifecycle methods, scene transitions, parallel scenes, scene communication, sleeping, pausing, restarting, and the SceneManager. Triggers on: Scene, scene lifecycle, preload, create, update, scene transition, SceneManager."
---

# Scenes

> Scenes are the organizational backbone of a Phaser game. Each Scene has its own lifecycle (init, preload, create, update), its own set of injected systems (this.add, this.input, this.cameras, etc.), and can be started, stopped, paused, slept, or run in parallel with other Scenes. The ScenePlugin (`this.scene`) controls all multi-scene orchestration.

**Key source paths:** `src/scene/Scene.js`, `src/scene/Systems.js`, `src/scene/SceneManager.js`, `src/scene/ScenePlugin.js`, `src/scene/Settings.js`, `src/scene/const.js`, `src/scene/events/`, `src/scene/InjectionMap.js`
**Related skills:** ../game-setup-and-config/SKILL.md, ../loading-assets/SKILL.md, ../events-system/SKILL.md

## Quick Start

```js
// Minimal scene with all lifecycle methods
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        // Called first. Receives data passed from other scenes.
        // 'data' is whatever was passed via scene.start('GameScene', { level: 1 })
        this.level = data.level || 1;
    }

    preload() {
        // Called after init. Load assets here.
        this.load.image('logo', 'assets/logo.png');
    }

    create(data) {
        // Called after preload completes. Set up game objects.
        // 'data' is the same object passed to init.
        this.add.image(400, 300, 'logo');
    }

    update(time, delta) {
        // Called every frame while scene is RUNNING.
        // time: current time (ms), delta: ms since last frame (smoothed)
    }
}

const config = {
    width: 800,
    height: 600,
    scene: [GameScene]
};

const game = new Phaser.Game(config);
```

## Core Concepts

### Scene Lifecycle

The lifecycle is driven by `SceneManager.bootScene()` and `SceneManager.create()`:

1. **PENDING (0)** - Scene is registered but not yet started.
2. **INIT (1)** - `scene.init(data)` is called if defined. Data comes from `settings.data`.
3. **START (2)** - `Systems.start()` fires. Events `start` and `ready` are emitted.
4. **LOADING (3)** - `scene.preload()` is called if defined. Loader runs. On completion, proceeds to create.
5. **CREATING (4)** - `scene.create(data)` is called if defined. Same `data` as init.
6. **RUNNING (5)** - `scene.update(time, delta)` called every frame. Scene renders.
7. **PAUSED (6)** - No update, but still renders.
8. **SLEEPING (7)** - No update, no render. State preserved in memory.
9. **SHUTDOWN (8)** - Scene is shut down, systems emit `shutdown`. Can be restarted.
10. **DESTROYED (9)** - Scene is fully destroyed. Cannot be restarted.

State constants are on `Phaser.Scenes`: `Phaser.Scenes.PENDING`, `Phaser.Scenes.RUNNING`, etc.

**Flow when no preload exists:** `init()` -> `create()` -> `update()` loop (preload is skipped entirely).

**Flow with preload:** `init()` -> `preload()` -> loader runs -> `create()` -> `update()` loop.

### Scene-Injected Properties

These properties are injected into every Scene instance via the InjectionMap (`src/scene/InjectionMap.js`). The left side is the Systems key, the right is the Scene property name.

#### Global Managers (shared across all scenes)

| Scene Property | Type | Description |
|---|---|---|
| `this.game` | `Phaser.Game` | The Game instance |
| `this.renderer` | `CanvasRenderer \| WebGLRenderer` | The active renderer |
| `this.anims` | `Phaser.Animations.AnimationManager` | Global animation manager |
| `this.cache` | `Phaser.Cache.CacheManager` | Global cache for non-image assets |
| `this.plugins` | `Phaser.Plugins.PluginManager` | Global plugin manager |
| `this.registry` | `Phaser.Data.DataManager` | Global data manager (shared between scenes) |
| `this.scale` | `Phaser.Scale.ScaleManager` | Global scale manager |
| `this.sound` | `NoAudio \| HTML5Audio \| WebAudioSoundManager` | Sound manager |
| `this.textures` | `Phaser.Textures.TextureManager` | Global texture manager |

#### Scene-Specific Systems (unique per scene)

| Scene Property | Type | Description |
|---|---|---|
| `this.sys` | `Phaser.Scenes.Systems` | Scene systems (never overwrite) |
| `this.events` | `Phaser.Events.EventEmitter` | Scene-specific event emitter |
| `this.cameras` | `Phaser.Cameras.Scene2D.CameraManager` | Scene camera manager |
| `this.add` | `Phaser.GameObjects.GameObjectFactory` | Factory: creates and adds to display list |
| `this.make` | `Phaser.GameObjects.GameObjectCreator` | Creator: creates but does NOT add to display list |
| `this.scene` | `Phaser.Scenes.ScenePlugin` | Scene manager plugin (start/stop/launch) |
| `this.children` | `Phaser.GameObjects.DisplayList` | The scene display list |
| `this.lights` | `Phaser.GameObjects.LightsManager` | Scene lights (plugin) |
| `this.data` | `Phaser.Data.DataManager` | Scene-specific data manager |
| `this.input` | `Phaser.Input.InputPlugin` | Scene input manager (plugin) |
| `this.load` | `Phaser.Loader.LoaderPlugin` | Scene loader (plugin) |
| `this.time` | `Phaser.Time.Clock` | Scene time/clock (plugin) |
| `this.tweens` | `Phaser.Tweens.TweenManager` | Scene tween manager (plugin) |
| `this.physics` | `Phaser.Physics.Arcade.ArcadePhysics` | Arcade physics (if configured) |
| `this.matter` | `Phaser.Physics.Matter.MatterPhysics` | Matter physics (if configured) |

#### Customizing the Injection Map

```js
// Rename injected properties via scene config
const config = {
    key: 'MyScene',
    map: {
        add: 'makeStuff',   // this.makeStuff instead of this.add
        load: 'loader'      // this.loader instead of this.load
    }
};
```

### Scene Manager

The `SceneManager` (`src/scene/SceneManager.js`) is a game-level system. Do not call its methods directly -- use `this.scene` (the ScenePlugin) instead. The SceneManager:

- Maintains an ordered array of scenes (determines render/update order)
- Processes a queue of operations (start, stop, sleep, etc.) at the start of each game step
- All ScenePlugin methods are queued, not immediate (they execute next frame)

## Common Patterns

### Switching Between Scenes

```js
// start() -- shuts down current scene, starts target scene
// Current scene gets SHUTDOWN event; target gets full lifecycle
this.scene.start('LevelTwo', { score: 100 });

// restart() -- shuts down and restarts the same scene
this.scene.restart({ score: 0 });

// switch() -- sleeps current scene, starts/wakes target scene
// Current scene state is preserved in memory
this.scene.switch('PauseMenu', { fromScene: 'GameScene' });

// transition() -- animated transition with duration
this.scene.transition({
    target: 'LevelTwo',
    duration: 1000,
    moveAbove: true,        // render target above this scene
    sleep: false,           // false = stop this scene (default), true = sleep it
    remove: false,          // true = remove this scene from manager after transition
    allowInput: false,      // allow input on this scene during transition
    data: { score: 100 },
    onUpdate: function (progress) {
        // progress: 0 to 1 over duration
    }
});
```

### Running Scenes in Parallel

```js
// launch() -- starts another scene in parallel (does NOT stop current scene)
this.scene.launch('UIScene', { lives: 3 });

// run() -- smart launcher: starts if not running, resumes if paused, wakes if sleeping
this.scene.run('UIScene', { lives: 3 });

// Control render order of parallel scenes
this.scene.bringToTop('UIScene');      // render last (on top)
this.scene.sendToBack('Background');   // render first (behind)
this.scene.moveAbove('GameScene', 'UIScene');  // UIScene renders above GameScene
this.scene.moveBelow('GameScene', 'Background');
this.scene.moveUp('UIScene');          // move one position up
this.scene.moveDown('UIScene');        // move one position down
this.scene.swapPosition('SceneA', 'SceneB');
```

### Passing Data Between Scenes

```js
// Method 1: Pass data via start/launch/restart/switch/wake/run
this.scene.start('LevelScene', { level: 5, score: 1200 });
// In LevelScene:
// init(data) { data.level === 5 }
// create(data) { data.score === 1200 }

// Method 2: Access data later via sys.getData()
// In receiving scene, at any time:
const data = this.sys.getData(); // returns settings.data

// Method 3: Global registry (shared across ALL scenes)
// In Scene A:
this.registry.set('playerHP', 100);
// In Scene B:
const hp = this.registry.get('playerHP'); // 100

// Method 4: Scene-specific data manager
this.data.set('localValue', 42);
this.data.get('localValue'); // 42

// Method 5: Direct scene reference
const otherScene = this.scene.get('OtherScene');
otherScene.somePublicProperty;

// Method 6: Events on the global registry
// In Scene A:
this.registry.events.on('changedata-playerHP', (parent, value, previousValue) => {
    // react to change
});
// In Scene B:
this.registry.set('playerHP', 50); // triggers the event in Scene A
```

### Pausing and Resuming

```js
// Pause: stops update loop, still renders
this.scene.pause();               // pause this scene
this.scene.pause('OtherScene');   // pause another scene

// Resume: restart update loop
this.scene.resume();
this.scene.resume('OtherScene', { message: 'welcome back' });

// Sleep: no update AND no render, but state preserved
this.scene.sleep();
this.scene.sleep('OtherScene');

// Wake: restore from sleep
this.scene.wake();
this.scene.wake('OtherScene', { data: 'here' });

// Stop: full shutdown, clears display list and timers
this.scene.stop();
this.scene.stop('OtherScene');

// Check state
this.scene.isActive('OtherScene');    // boolean
this.scene.isPaused('OtherScene');    // boolean
this.scene.isSleeping('OtherScene');  // boolean
this.scene.isVisible('OtherScene');   // boolean

// Control visibility/activity independently
this.scene.setActive(false);          // pause
this.scene.setActive(true);           // resume
this.scene.setVisible(false);         // hide but still update
this.scene.setVisible(true);          // show
```

### Adding and Removing Scenes at Runtime

```js
// Add a new scene dynamically
this.scene.add('BonusLevel', BonusLevelScene, false, { someData: true });
// args: key, sceneConfig, autoStart, data

// Remove a scene entirely (destroyed, cannot be restarted)
this.scene.remove('BonusLevel');

// Spawn multiple instances from one class
for (let i = 0; i < 5; i++) {
    this.scene.add('Level' + i, new LevelScene('Level' + i), false);
}
```

### Cross-Scene Event Communication

One scene emits custom events; another listens. The emitting scene is decoupled.

```js
// GameScene emits events
class GameScene extends Phaser.Scene {
    collectCoin(coin) {
        coin.destroy();
        this.events.emit('addScore', 10);
    }
}

// UIScene listens (launched in parallel with { active: true })
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true });
    }

    create() {
        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: 0');

        // Listen for events from GameScene
        const gameScene = this.scene.get('GameScene');
        gameScene.events.on('addScore', (points) => {
            this.score += points;
            this.scoreText.setText('Score: ' + this.score);
        });
    }
}
```

### Configuring Plugins Per Scene

Disable all default plugins (only core plugins remain):
```js
super({ key: 'MinimalScene', plugins: [] });
// No this.load, this.tweens, this.time, this.input, this.data, this.lights
```

Include only specific plugins:
```js
super({ key: 'PreloadScene', plugins: ['Loader'] });
// Only this.load is available; this.tweens, this.time, etc. are undefined
```

### Scene Config in Constructor

Pass config to `super()` for per-scene physics, loader, or preloaded files:
```js
class Level1 extends Phaser.Scene {
    constructor() {
        super({
            key: 'Level1',
            physics: { arcade: { debug: true, gravity: { y: 200 } } },
            loader: { path: 'assets/levels/1/' },
            // 'pack' loads files before preload() runs -- good for progress bar assets
            pack: {
                files: [
                    { type: 'image', key: 'bar', url: 'loaderBar.png' }
                ]
            }
        });
    }
}
```

### Safely Restarting Scenes

Reset state in `init()`, not the constructor. The constructor runs once; `init()` runs every start.

```js
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        // BAD: this.gameOver = false; -- only set once, not on restart
    }

    init() {
        // GOOD: reset state every time the scene starts
        this.gameOver = false;
        this.score = 0;
    }

    create() {
        // Clean up on shutdown to avoid stale references
        this.events.once('shutdown', () => {
            // Clear any arrays holding game object references
            this.enemies = [];
        });
    }
}
```

## Events

All events are emitted on `this.events` (the scene-specific EventEmitter) and have string values. Listen via `this.events.on('eventname', callback)`.

### Lifecycle Events

| Event String | Constant | Callback Signature | When |
|---|---|---|---|
| `'boot'` | `Phaser.Scenes.Events.BOOT` | `(sys)` | Once, when scene is first instantiated (for plugins) |
| `'start'` | `Phaser.Scenes.Events.START` | `(sys)` | Scene systems start (for plugins) |
| `'ready'` | `Phaser.Scenes.Events.READY` | `(sys, data)` | After start, for user code |
| `'create'` | `Phaser.Scenes.Events.CREATE` | `(scene)` | After `create()` method runs, scene is now RUNNING |
| `'preupdate'` | `Phaser.Scenes.Events.PRE_UPDATE` | `(time, delta)` | Before update each frame |
| `'update'` | `Phaser.Scenes.Events.UPDATE` | `(time, delta)` | During update each frame |
| `'postupdate'` | `Phaser.Scenes.Events.POST_UPDATE` | `(time, delta)` | After update each frame |
| `'prerender'` | `Phaser.Scenes.Events.PRE_RENDER` | `(renderer)` | Before scene renders |
| `'render'` | `Phaser.Scenes.Events.RENDER` | `(renderer)` | After scene renders |

### State-Change Events

| Event String | Constant | Callback Signature | When |
|---|---|---|---|
| `'pause'` | `Phaser.Scenes.Events.PAUSE` | `(sys, data)` | Scene is paused |
| `'resume'` | `Phaser.Scenes.Events.RESUME` | `(sys, data)` | Scene is resumed |
| `'sleep'` | `Phaser.Scenes.Events.SLEEP` | `(sys, data)` | Scene is sent to sleep |
| `'wake'` | `Phaser.Scenes.Events.WAKE` | `(sys, data)` | Scene is woken up |
| `'shutdown'` | `Phaser.Scenes.Events.SHUTDOWN` | `(sys, data)` | Scene is shutting down |
| `'destroy'` | `Phaser.Scenes.Events.DESTROY` | `(sys)` | Scene is being destroyed |

### Transition Events

| Event String | Constant | Callback Signature | Emitted On |
|---|---|---|---|
| `'transitionout'` | `TRANSITION_OUT` | `(targetScene, duration)` | Source scene |
| `'transitioninit'` | `TRANSITION_INIT` | `(fromScene, duration)` | Target scene (during init) |
| `'transitionstart'` | `TRANSITION_START` | `(fromScene, duration)` | Target scene (after create) |
| `'transitionwake'` | `TRANSITION_WAKE` | `(fromScene, duration)` | Target scene (if woken from sleep) |
| `'transitioncomplete'` | `TRANSITION_COMPLETE` | `(scene)` | Target scene (when done) |

### Game Object Events

| Event String | Constant | Callback Signature |
|---|---|---|
| `'addedtoscene'` | `ADDED_TO_SCENE` | `(gameObject, scene)` |
| `'removedfromscene'` | `REMOVED_FROM_SCENE` | `(gameObject, scene)` |

For detailed API reference tables and source file maps, see [the reference guide](references/REFERENCE.md).

## Gotchas and Common Mistakes

1. **Operations are queued, not immediate.** Calling `this.scene.start('X')` does not start X synchronously. It happens at the next SceneManager update. Do not rely on the target scene's state within the same frame.

2. **`start()` shuts down the calling scene.** `this.scene.start('X')` stops the current scene and starts X. If you want both running, use `launch()` or `run()`.

3. **`switch()` sleeps, `start()` shuts down.** `switch()` preserves the current scene in memory (sleep), while `start()` triggers a full shutdown. Sleeping scenes still have their events and references live.

4. **Paused scenes still render.** `pause()` only stops the update loop. The scene is still drawn. Use `sleep()` to stop both update and render.

5. **Do not overwrite `this.sys`.** The Scene class JSDoc explicitly warns: overwriting `this.sys` will break everything.

6. **`this.scene.start()` with no key restarts the current scene.** This is equivalent to `this.scene.restart()`.

7. **Data passed to `start()`/`launch()` is available in both `init(data)` and `create(data)`.** It is stored in `settings.data` and accessible later via `this.sys.getData()`.

8. **Sleeping scenes can still receive events from other scenes.** If Scene A is sleeping but Scene B emits on the global registry, Scene A's listeners still fire. Be careful with active listeners on sleeping scenes.

9. **Scene render order = array order.** Scenes later in the array render on top. Use `bringToTop()`, `sendToBack()`, `moveAbove()`, `moveBelow()` to control layering.

10. **`shutdown` vs `destroy`.** Shutdown puts a scene into hibernation (can restart). Destroy permanently removes it. Listen to `'shutdown'` to free resources that should be recreated on restart. Listen to `'destroy'` for final cleanup.

11. **Plugin properties like `this.physics` and `this.matter` are only available if the physics system is configured.** They will be undefined otherwise.

12. **The `create` event fires AFTER the `create()` method returns**, and after the status changes to RUNNING. If you need to do post-create setup, listen for this event.

13. **Reset state in `init()`, not the constructor.** The constructor only runs once when the scene is first instantiated. `init()` runs every time the scene starts/restarts. Place state resets there.

14. **Clean up on `shutdown` to avoid stale references.** Listen for `this.events.once('shutdown', ...)` to clear arrays holding game objects, remove external event listeners, etc. Stale references to destroyed game objects cause errors on restart.

15. **`switch()` restarts a paused scene, never resumes it.** If you need resume behavior, use `run()` instead.

16. **Scenes update in reverse order, render in forward order.** The top scene updates first (gets input priority), but renders last (appears on top). Establish render order in the game config scene array.

