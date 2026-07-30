---
name: tweens
description: "Use this skill when animating properties over time in Phaser 4. Covers tweens, tween chains, easing functions, stagger, yoyo, repeat, callbacks, number tweens, and the TweenManager. Triggers on: tween, ease, animate, this.tweens.add, tween chain, stagger."
---

# Tweens
> Animating properties over time in Phaser 4 -- TweenManager, creating tweens, tween config, easing functions, tween chains, stagger, yoyo, repeat, callbacks, and tween targets.

**Key source paths:** `src/tweens/TweenManager.js`, `src/tweens/tween/Tween.js`, `src/tweens/tween/TweenChain.js`, `src/tweens/tween/BaseTween.js`, `src/tweens/builders/`, `src/tweens/typedefs/`, `src/tweens/events/`, `src/math/easing/`
**Related skills:** ../sprites-and-images/SKILL.md, ../animations/SKILL.md

## Quick Start

```js
// In a Scene's create() method:

const logo = this.add.image(100, 300, 'logo');

// Basic tween -- move the logo to x:600 over 2 seconds
this.tweens.add({
    targets: logo,
    x: 600,
    duration: 2000,
    ease: 'Power2'
});
```

`this.tweens` is the scene's `TweenManager` instance, available in every Scene. The `add()` method creates a tween, adds it to the manager, and starts playback immediately.

## Core Concepts

### Tween Lifecycle

Created -> Active (`onActive`) -> Start Delayed (`delay`) -> Playing (`onStart`, `onUpdate` per frame) -> Yoyo/Repeat (`onYoyo`, `onRepeat`) -> Loop (`onLoop`) -> Complete (`onComplete`, then auto-destroyed unless `persist: true`).

### Fire-and-Forget Design

Tweens auto-destroy after completion. You do not need to store a reference unless you want to control them later. Set `persist: true` in the config to keep a tween alive after completion for replay via `tween.play()` or `tween.restart()`. You must manually call `tween.destroy()` on persisted tweens when done.

### Targets

The `targets` property accepts a single object, an array of objects, or a function that returns either. Targets are typically Game Objects but can be any JavaScript object with numeric properties. A tween will not manipulate any property that begins with an underscore.

```js
// Single target
this.tweens.add({ targets: sprite, alpha: 0, duration: 500 });

// Multiple targets
this.tweens.add({ targets: [sprite1, sprite2, sprite3], y: 100, duration: 1000 });
```

### Property Values

```js
this.tweens.add({
    targets: sprite,
    x: 400,                  // absolute value
    y: '-=100',              // relative (subtract 100 from current)
    rotation: '+=3.14',      // relative (add to current)
    alpha: { value: 0, duration: 300, ease: 'Cubic.easeIn' },  // per-property config
    scale: [0.5, 1.5, 1],   // array: interpolates through values over duration
    angle: function (target, key, value, targetIndex, totalTargets, tween) {
        return targetIndex * 90;   // function: called once per target
    },
    duration: 1000
});
```

Array values use linear interpolation by default; override with the `interpolation` config (`'linear'`, `'bezier'`, `'catmull'`).

## Common Patterns

### Basic Tween

```js
this.tweens.add({
    targets: this.player,
    x: 500,
    y: 300,
    duration: 1000,
    ease: 'Sine.easeInOut'
});
```

### Multiple Properties with Per-Property Config

```js
this.tweens.add({
    targets: this.enemy,
    x: { value: 600, duration: 1500, ease: 'Bounce.easeOut' },
    y: { value: 200, duration: 1000, ease: 'Power2' },
    alpha: { value: 0.5, duration: 500, delay: 1000 }
});
```

### Yoyo and Repeat

```js
this.tweens.add({
    targets: this.coin,
    y: '-=50',
    duration: 600,
    ease: 'Sine.easeInOut',
    yoyo: true,         // returns to start value after reaching end
    hold: 200,          // pause 200ms at the end value before yoyo-ing back
    repeat: -1,         // -1 = infinite, 0 = play once, 1 = play twice, etc.
    repeatDelay: 300     // pause 300ms before each repeat
});
```

`repeat` controls how many extra times each property plays. A `repeat` of 1 means the tween plays twice total. The `loop` property (on `BaseTween`) restarts the entire tween from scratch, including all properties. Use `repeat` for property-level looping and `loop` for tween-level looping.

### Stagger

Stagger offsets a value across multiple targets via `this.tweens.stagger()`:

```js
// 100ms delay between each target
delay: this.tweens.stagger(100)

// From center outward
delay: this.tweens.stagger(200, { from: 'center' })

// Range: distribute 0-1000ms across targets
delay: this.tweens.stagger([0, 1000])

// Grid stagger with easing
delay: this.tweens.stagger(500, { grid: [10, 6], from: 'center', ease: 'Cubic.easeOut' })
```

**StaggerConfig:** `start` (offset), `ease` (string/function), `from` (`'first'`/`'center'`/`'last'`/index), `grid` ([w, h]).

### Tween Chain

A `TweenChain` plays tweens in sequence. Each tween in the chain starts after the previous one completes:

```js
this.tweens.chain({
    targets: this.player,
    tweens: [
        { x: 300, duration: 1000, ease: 'Power2' },
        { y: 500, duration: 800, ease: 'Bounce.easeOut' },
        { scale: 2, duration: 500 },
        { alpha: 0, duration: 400 }
    ],
    loop: 1,          // loop the entire chain once (plays twice total)
    loopDelay: 500,
    onComplete: function () {
        console.log('Chain finished');
    }
});
```

Each entry in `tweens` is a standard `TweenBuilderConfig`. Chain-level config supports `loop`, `loopDelay`, `completeDelay`, `paused`, `persist`, and chain-level callbacks. Per-tween callbacks (`onUpdate`, `onRepeat`, `onYoyo`) belong on individual entries. Use `chain.add(tweenConfigs)` to append dynamically.

### Relative Values

```js
this.tweens.add({
    targets: sprite,
    x: '+=200',    // add 200 to current x
    y: '-=50',     // subtract 50 from current y
    angle: '+=180',
    duration: 1000
});
```

### Callbacks and Events

```js
this.tweens.add({
    targets: sprite,
    x: 600,
    duration: 2000,

    // All callbacks receive (tween, targets, ...params)
    onStart: function (tween, targets) { },
    onUpdate: function (tween, targets) { },     // per-property, per-target, per-frame
    onYoyo: function (tween, targets) { },
    onRepeat: function (tween, targets) { },
    onLoop: function (tween, targets) { },
    onComplete: function (tween, targets) { },

    onCompleteParams: ['extra', 'args'],
    callbackScope: this
});

// Set callback after creation
tween.setCallback('onComplete', function (tween, targets) { }, []);

// Event emitter style (tweens extend EventEmitter)
tween.on('complete', function (tween, targets) { });
```

### Number Tweens

A Number Tween has no target object. It tweens between two numeric values:

```js
const counter = this.tweens.addCounter({
    from: 0,
    to: 100,
    duration: 2000,
    ease: 'Linear',
    onUpdate: function (tween) {
        const value = tween.getValue();
        console.log(value);   // 0 ... 100
    }
});
```

### Controlling and Killing Tweens

```js
const tween = this.tweens.add({ targets: sprite, x: 600, duration: 2000, persist: true });

// Playback control
tween.pause();                  tween.resume();
tween.stop();                   // flags for removal; fires onStop
tween.restart();                // reset and replay from beginning
tween.seek(1000);               // seek to 1000ms (suppresses events by default)
tween.complete();               // immediately complete; fires onComplete
tween.completeAfterLoop(0);     // finish after current loop
tween.forward(500);             tween.rewind(500);
tween.setTimeScale(0.5);       // per-tween speed
tween.updateTo('x', 800);      // change end value mid-tween

// Manager-level control
this.tweens.killAll();                     // destroy all tweens
this.tweens.killTweensOf(sprite);          // destroy tweens on target
this.tweens.isTweening(sprite);            // boolean check
this.tweens.pauseAll();                    this.tweens.resumeAll();
this.tweens.setGlobalTimeScale(0.5);       // global speed
```

## Configuration Reference

### TweenBuilderConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `targets` | any / any[] | (required) | Object(s) to tween. |
| `duration` | number | `1000` | Duration in ms. |
| `delay` | number / function | `0` | Delay before start (ms). Accepts `stagger()`. |
| `ease` | string / function | `'Power0'` | Easing function name or custom function. |
| `easeParams` | array | `null` | Parameters for parameterized easing (e.g. Elastic). |
| `hold` | number | `0` | Hold at end value before yoyo (ms). |
| `repeat` | number | `0` | Per-property repeat count. `-1` = infinite. |
| `repeatDelay` | number | `0` | Delay before each repeat (ms). |
| `yoyo` | boolean | `false` | Reverse back to start after reaching end. |
| `flipX` / `flipY` | boolean | `false` | Toggle flip on yoyo/repeat. |
| `loop` | number | `0` | Tween-level loop count. `-1` = infinite. |
| `loopDelay` | number | `0` | Delay before each loop (ms). |
| `completeDelay` | number | `0` | Delay before `onComplete` fires (ms). |
| `paused` | boolean | `false` | Start paused. Call `play()` to begin. |
| `persist` | boolean | `false` | Keep alive after completion. |
| `props` | object | -- | Explicit property config map (alt to top-level props). |
| `interpolation` | string / function | -- | For array values: `'linear'`, `'bezier'`, `'catmull'`. |
| `callbackScope` | any | tween | `this` context for callbacks. |
| Callbacks | function | -- | `onActive`, `onStart`, `onUpdate`, `onYoyo`, `onRepeat`, `onLoop`, `onComplete`, `onStop`, `onPause`, `onResume`. Each has matching `on<Name>Params` array. |

### TweenChainBuilderConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `targets` | any / any[] | -- | Default targets inherited by child tweens. |
| `tweens` | TweenBuilderConfig[] | (required) | Array of tween configs to play in sequence. |
| `loop` | number | `0` | Times to loop the entire chain. `-1` = infinite. |
| `loopDelay` | number | `0` | Delay before each loop (ms). |
| `completeDelay` | number | `0` | Delay before `onComplete` fires (ms). |
| `paused` | boolean | `false` | Start paused. |
| `persist` | boolean | `false` | Keep alive after completion. |
| Callbacks | function | -- | `onActive`, `onStart`, `onLoop`, `onComplete`, `onStop`, `onPause`, `onResume`. |

### NumberTweenBuilderConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `from` | number | `0` | Start value. |
| `to` | number | `1` | End value. |
| `duration` | number | `1000` | Duration in ms. |
| `ease` | string / function | `'Power0'` | Easing function. |
| All standard timing | -- | -- | `delay`, `hold`, `repeat`, `repeatDelay`, `yoyo`, `loop`, `loopDelay`, `completeDelay`, `paused`, `persist`. |
| All standard callbacks | -- | -- | Same callback set as TweenBuilderConfig. |

### TweenPropConfig (Per-Property Object)

Used when a property value is an object instead of a number/string. Supports: `value`, `getActive`, `getEnd`, `getStart`, `ease`, `delay`, `duration`, `yoyo`, `hold`, `repeat`, `repeatDelay`, `flipX`, `flipY`, `interpolation`. All override the tween-level defaults for that one property.

## Easing Functions

All easing names are case-insensitive. Use the string name in the `ease` config property.

### Power Aliases

| Name | Equivalent |
|---|---|
| `Power0` | `Linear` |
| `Power1` | `Quad.easeOut` (Quadratic Out) |
| `Power2` | `Cubic.easeOut` |
| `Power3` | `Quart.easeOut` (Quartic Out) |
| `Power4` | `Quint.easeOut` (Quintic Out) |

### Full Easing List

Each type supports `.easeIn`, `.easeOut`, `.easeInOut` variants. The bare name defaults to Out.

**Types:** `Quad`, `Cubic`, `Quart`, `Quint`, `Sine`, `Expo`, `Circ`, `Elastic`, `Back`, `Bounce`.

**Usage:** `'Sine.easeInOut'`, `'Bounce.easeIn'`, `'Cubic.easeOut'`, `'Back'` (same as `'Back.easeOut'`).

**Special:** `Linear` (no easing), `Stepped` (discrete steps -- `easeParams: [numSteps]`).

**Custom:** `ease: function (t) { return t * t; }` where `t` is 0 to 1.

## Events

Tweens (and TweenChains) extend `EventEmitter`. You can listen via `.on()`:

| Event String | Constant | Fires When |
|---|---|---|
| `'active'` | `Phaser.Tweens.Events.TWEEN_ACTIVE` | Tween added to manager |
| `'start'` | `Phaser.Tweens.Events.TWEEN_START` | Playback begins (after delay) |
| `'update'` | `Phaser.Tweens.Events.TWEEN_UPDATE` | Property updates each frame |
| `'yoyo'` | `Phaser.Tweens.Events.TWEEN_YOYO` | Property begins yoyo-ing back |
| `'repeat'` | `Phaser.Tweens.Events.TWEEN_REPEAT` | Property repeats |
| `'loop'` | `Phaser.Tweens.Events.TWEEN_LOOP` | Entire tween loops |
| `'complete'` | `Phaser.Tweens.Events.TWEEN_COMPLETE` | Tween finishes |
| `'stop'` | `Phaser.Tweens.Events.TWEEN_STOP` | `tween.stop()` called |
| `'pause'` | `Phaser.Tweens.Events.TWEEN_PAUSE` | `tween.pause()` called |
| `'resume'` | `Phaser.Tweens.Events.TWEEN_RESUME` | `tween.resume()` called |

Event listener signature for Tween events: `function(tween, targets)`. During seeking (`tween.isSeeking === true`), events and callbacks are suppressed by default.

## API Quick Reference

### TweenManager (`this.tweens`)

| Method | Returns | Purpose |
|---|---|---|
| `add(config)` | `Tween` | Create, add, and start a tween. |
| `addMultiple(configs[])` | `Tween[]` | Create multiple tweens at once. |
| `create(config)` | `Tween` | Create without adding. Use `existing()` to add later. |
| `chain(config)` | `TweenChain` | Create and start a sequential chain. |
| `addCounter(config)` | `Tween` | Number tween (no target). |
| `stagger(value, config?)` | `function` | Stagger function for delay/property values. |
| `existing(tween)` | `this` | Add a pre-created tween to the manager. |
| `remove(tween)` | `this` | Remove without destroying. |
| `has(tween)` | `boolean` | Check if tween is in manager. |
| `getTweens()` | `Tween[]` | All active tweens (copy). |
| `getTweensOf(target)` | `Tween[]` | Tweens affecting a target. |
| `isTweening(target)` | `boolean` | Is target being tweened? |
| `killAll()` / `killTweensOf(target)` | `this` | Destroy tweens. |
| `pauseAll()` / `resumeAll()` | `this` | Pause/resume all tweens. |
| `setGlobalTimeScale(v)` / `getGlobalTimeScale()` | `this` / `number` | Global speed. |
| `setFps(fps)` | `this` | Limit tick rate (default 240). |
| `setLagSmooth(limit, skip)` | `this` | Configure lag smoothing. |
| `each(cb, scope)` | `this` | Iterate all tweens. |

### Tween Instance

| Method | Purpose |
|---|---|
| `play()` / `pause()` / `resume()` | Playback control. |
| `stop()` | Stop and flag for removal. Fires `onStop`. |
| `restart()` | Reset and replay. |
| `complete(delay?)` | Immediately complete. |
| `completeAfterLoop(loops?)` | Complete after N more loops. |
| `seek(ms, delta?, emit?)` | Seek to ms offset. |
| `forward(ms)` / `rewind(ms)` | Step forward/back. |
| `setTimeScale(v)` / `getTimeScale()` | Per-tween speed. |
| `setCallback(type, fn, params?)` | Set callback after creation. |
| `getValue(index?)` | Current TweenData value. |
| `updateTo(key, value, startToCurrent?)` | Change end value mid-tween. |
| `hasTarget(target)` / `isPlaying()` / `isPaused()` | State checks. |
| `remove()` / `destroy()` | Cleanup. |

Key properties: `targets`, `duration`, `elapsed`, `progress` (0-1), `totalProgress` (0-1 including loops), `totalDuration`, `timeScale`, `paused`, `persist`, `data` (TweenData[]), `isInfinite`, `isNumberTween`.

### TweenChain Instance

Extends `BaseTween`. Has all tween playback methods (`play`, `pause`, `resume`, `stop`, `restart`, `complete`, etc.) plus `add(tweenConfigs)` to append tweens dynamically. Properties: `currentTween`, `currentIndex`.

## Gotchas

- **Underscore properties are ignored.** A tween will skip any property whose name starts with `_`.
- **Tweens auto-destroy.** If you store a reference to a tween and try to use it after completion, it may be destroyed. Set `persist: true` to keep it alive, but you must `destroy()` it yourself when done.
- **`repeat` vs `loop`.** `repeat` is per-property (on TweenData). `loop` restarts the entire tween. A `repeat` of 1 means the property plays twice total.
- **`loop: -1` means `onComplete` never fires.** An infinitely looping tween never completes. Use `completeAfterLoop()` to end it gracefully.
- **Seeking suppresses events.** When calling `tween.seek()`, events and callbacks are not dispatched unless you pass `true` as the third argument.
- **Stagger only works with multiple targets.** Using `this.tweens.stagger()` on a single-target tween has no visible stagger effect.
- **Destroyed targets.** A tween completes early if its target has `isDestroyed` set to `true`. Always clean up tweens before destroying the objects they reference, or rely on this auto-check.
- **TweenManager.timeScale multiplies with Tween.timeScale.** The effective speed is `managerTimeScale * tweenTimeScale`. Setting either to 0 freezes the tween.
- **Duration cannot be zero.** Internally clamped to a minimum of 0.01ms.
- **TweenChain `targets` are inherited.** If you set `targets` at the chain level, individual tweens in the chain inherit them unless they specify their own.

## Source File Map

| File | Purpose |
|---|---|
| `src/tweens/TweenManager.js` | Scene plugin. `add`, `chain`, `stagger`, `killAll`, etc. |
| `src/tweens/tween/Tween.js` | Individual tween. Targets, TweenData array, seeking, update. |
| `src/tweens/tween/TweenChain.js` | Sequential tween playback via ordered child Tweens. |
| `src/tweens/tween/BaseTween.js` | Shared base. EventEmitter, callbacks, state machine. |
| `src/tweens/tween/BaseTweenData.js` | Per-property state: duration, delay, yoyo, repeat, progress. |
| `src/tweens/tween/TweenData.js` | Numeric property tweening (extends BaseTweenData). |
| `src/tweens/tween/TweenFrameData.js` | Texture frame tweening (extends BaseTweenData). |
| `src/tweens/builders/TweenBuilder.js` | Parses config into Tween instance. |
| `src/tweens/builders/TweenChainBuilder.js` | Parses config into TweenChain instance. |
| `src/tweens/builders/NumberTweenBuilder.js` | Builds target-less number tweens. |
| `src/tweens/builders/StaggerBuilder.js` | Creates stagger functions. |
| `src/tweens/events/` | Event constants (`TWEEN_ACTIVE`, `TWEEN_START`, etc.). |
| `src/tweens/typedefs/` | JSDoc typedefs for all config objects. |
| `src/math/easing/EaseMap.js` | Maps ease string names to functions. |
