---
name: time-and-timers
description: "Use this skill when using timers and time-based events in Phaser 4. Covers TimerEvent, delayed calls, looping timers, the Clock plugin, and time scaling. Triggers on: timer, delay, delayedCall, TimerEvent, Clock, time event."
---

# Time and Timers
> Clock plugin, TimerEvent, delays, loops, Timeline event sequencing, pausing time, time scale, and delta time in Phaser 4.

**Key source paths:** `src/time/Clock.js`, `src/time/TimerEvent.js`, `src/time/Timeline.js`, `src/time/typedefs/`, `src/time/events/`
**Related skills:** ../scenes/SKILL.md, ../tweens/SKILL.md

## Quick Start

```js
// In a Scene's create() method:

// One-shot delayed call (fires once after 1 second)
this.time.delayedCall(1000, () => {
    console.log('One second later');
});

// Repeating timer (fires 5 times, once every 500ms)
this.time.addEvent({
    delay: 500,
    callback: () => { console.log('tick'); },
    repeat: 4   // 4 repeats = 5 total fires
});

// Infinite loop timer
this.time.addEvent({
    delay: 1000,
    callback: this.spawnEnemy,
    callbackScope: this,
    loop: true
});
```

`this.time` is the scene's `Clock` instance (registered as the `'Clock'` plugin under the key `time`). It creates and manages `TimerEvent` objects that fire callbacks based on game time.

## Core Concepts

### Clock (this.time)

The Clock is a Scene-level plugin that tracks game time and updates all of its TimerEvents each frame. Key properties:

- **`now`** -- current time in ms (equivalent to `time` passed to the scene `update` method).
- **`startTime`** -- timestamp when the scene started.
- **`timeScale`** -- multiplier applied to delta time. Default `1`. Values above 1 speed up all timers; below 1 slow them down; `0` freezes time.
- **`paused`** -- when `true`, no TimerEvents are updated.

The Clock listens to `PRE_UPDATE` (to flush pending additions/removals) and `UPDATE` (to tick active events). It is automatically shut down and destroyed with the scene.

### TimerEvent

A TimerEvent accumulates elapsed time each frame: `elapsed += delta * clock.timeScale * event.timeScale`. When `elapsed >= delay`, the callback fires. After all repeats are exhausted the event is removed from the Clock on the next frame.

Key properties set via config: `delay`, `repeat`, `loop`, `callback`, `callbackScope`, `args`, `timeScale`, `startAt`, `paused`.

### Timeline (this.add.timeline)

A Timeline is a sequencer for scheduling actions at specific points in time. Unlike the Clock (which manages independent timers), a Timeline runs a linear sequence of events keyed by absolute or relative timestamps.

```js
const timeline = this.add.timeline([
    { at: 0,    run: () => { /* immediate */ } },
    { at: 1000, run: () => { /* at 1s */ } },
    { at: 2500, tween: { targets: sprite, alpha: 0, duration: 500 } }
]);
timeline.play();
```

Timelines always start **paused**. You must call `play()` to start them. They are created via the GameObjectFactory and destroyed automatically when the scene shuts down.

## Common Patterns

### Delayed Call

```js
// Shorthand -- fires once, no repeat
this.time.delayedCall(2000, () => {
    this.scene.start('GameOver');
});
```

### Repeating Timer with Finite Count

```js
// repeat: 9 means 10 total fires (1 initial + 9 repeats)
const timer = this.time.addEvent({
    delay: 200,
    callback: this.fireBullet,
    callbackScope: this,
    repeat: 9
});

// Check progress
timer.getRepeatCount();       // repeats remaining
timer.getOverallProgress();   // 0..1 across all repeats
```

### Infinite Loop

```js
const spawner = this.time.addEvent({
    delay: 3000,
    callback: this.spawnWave,
    callbackScope: this,
    loop: true
});

// Stop it later
spawner.remove();  // or spawner.paused = true to pause
```

Setting `repeat: -1` is equivalent to `loop: true`.

### First-Fire Shortcut with startAt

```js
// First fire happens quickly (after 100ms), then every 2s
this.time.addEvent({
    delay: 2000,
    callback: this.heartbeat,
    callbackScope: this,
    loop: true,
    startAt: 1900  // pre-fill elapsed so first fire is at 100ms
});
```

### Stopping and Removing Timers

```js
const timer = this.time.addEvent({ delay: 1000, loop: true, callback: fn });

// Option 1: Remove from clock (schedules removal next frame)
timer.remove();            // silently expires
timer.remove(true);        // fires callback one last time, then expires

// Option 2: Remove via Clock
this.time.removeEvent(timer);

// Option 3: Remove all timers
this.time.removeAllEvents();
```

### Pausing and Resuming

```js
// Pause the entire Clock (all timers freeze)
this.time.paused = true;
this.time.paused = false;

// Pause a single timer
timer.paused = true;
timer.paused = false;
```

### Time Scale (Slow Motion / Fast Forward)

```js
// Slow all timers in this scene to half speed
this.time.timeScale = 0.5;

// Speed up a single timer to 2x
timer.timeScale = 2;

// Combined: effective scale = clock.timeScale * event.timeScale
// So 0.5 * 2 = 1x for that specific timer
```

### Reading Timer State

```js
timer.getProgress();              // 0..1 for current iteration
timer.getOverallProgress();       // 0..1 across all repeats
timer.getElapsed();               // ms elapsed this iteration
timer.getElapsedSeconds();        // seconds elapsed this iteration
timer.getRemaining();             // ms until next fire
timer.getRemainingSeconds();      // seconds until next fire
timer.getOverallRemaining();      // ms until final fire
timer.getOverallRemainingSeconds(); // seconds until final fire
timer.getRepeatCount();           // repeats left
```

### Timeline: Sequencing Events

```js
const timeline = this.add.timeline([
    {
        at: 0,
        run: () => { this.title.setAlpha(1); },
        sound: 'intro'
    },
    {
        at: 2000,
        tween: { targets: this.title, y: 100, duration: 1000 },
        sound: { key: 'whoosh', config: { volume: 0.5 } }
    },
    {
        at: 4000,
        set: { alpha: 0 },
        target: this.title,
        event: 'INTRO_DONE'
    }
]);

timeline.on('INTRO_DONE', (target) => { /* custom event */ });
timeline.on('complete', (tl) => { /* all events ran */ });
timeline.play();
```

### Timeline: Relative Timing with `from` and `in`

```js
const timeline = this.add.timeline([
    { at: 1000, run: stepOne },         // absolute: 1s from start
    { from: 500, run: stepTwo },        // relative: 500ms after previous (1.5s)
    { from: 1000, run: stepThree }      // relative: 1000ms after previous (2.5s)
]);
```

- **`at`** -- absolute ms from timeline start (default 0).
- **`in`** -- offset from current `elapsed` time (useful when adding events to a running timeline).
- **`from`** -- offset from the previous event's start time.

Priority: `from` overrides `in`, which overrides `at`.

### Timeline: Conditional Events

```js
const timeline = this.add.timeline([
    {
        at: 5000,
        if: () => this.player.health > 0,
        run: () => { this.showBonusRound(); }
    }
]);
```

If the `if` callback returns `false`, the event is skipped (marked complete but actions are not executed).

### Timeline: Looping

```js
const timeline = this.add.timeline([
    { at: 0, run: () => console.log('start') },
    { at: 1000, run: () => console.log('end') }
]);

timeline.repeat().play();      // infinite loop
timeline.repeat(3).play();     // loop 3 additional times (4 total runs)
timeline.repeat(false).play(); // no looping
```

The `loop` callback on a TimelineEventConfig fires on repeat iterations (not the first run).

### Timeline: Pause, Resume, Stop, Reset

```js
timeline.pause();      // freezes elapsed counter and pauses spawned tweens
timeline.resume();     // resumes elapsed counter and unpauses spawned tweens
timeline.stop();       // sets paused=true, complete=true
timeline.reset();      // elapsed=0, all events marked incomplete, starts playing
timeline.isPlaying();  // true if not paused and not complete
timeline.getProgress(); // 0..1 based on events completed / total events
```

### Timeline: Time Scale

```js
timeline.timeScale = 2;   // double speed
timeline.timeScale = 0.5; // half speed
```

Note: Timeline `timeScale` does not affect tweens created by the timeline. Set tween timeScale separately.

### Timeline: Full Cutscene Example

Timelines excel at choreographing cutscenes with mixed actions (callbacks, tweens, sounds, property sets, and custom events):

```js
class CutsceneScene extends Phaser.Scene {
    create() {
        const timeline = this.add.timeline([
            {
                at: 0,
                run: () => { console.log('Start!'); }
            },
            {
                at: 1000,
                tween: {
                    targets: this.player,
                    x: 400,
                    duration: 500,
                    ease: 'Power2'
                }
            },
            {
                at: 1500,
                sound: 'doorOpen'
            },
            {
                at: 2000,
                set: { visible: true },
                target: this.door
            },
            {
                from: 500,
                run: () => { console.log('Relative timing'); }
            },
            {
                at: 5000,
                event: 'cutsceneDone',
                stop: true
            }
        ]);

        timeline.on('cutsceneDone', () => {
            this.scene.start('GameScene');
        });

        timeline.play();
    }
}
```

### Timer Reset and Reuse

A completed `TimerEvent` can be reset with a new config and re-added to the Clock:

```js
const timer = this.time.addEvent({
    delay: 1000,
    callback: this.phase1,
    callbackScope: this,
    repeat: 2
});

// Later, after it completes, reconfigure and re-add:
timer.reset({
    delay: 500,
    callback: this.phase2,
    callbackScope: this,
    repeat: 4
});
this.time.addEvent(timer);  // must re-add; reset() alone does not schedule it
```

## Configuration Reference

### TimerEventConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `delay` | number | `0` | Delay in ms before the callback fires |
| `repeat` | number | `0` | Times to repeat after first fire. Use `-1` for infinite |
| `loop` | boolean | `false` | If `true`, repeats indefinitely (same as `repeat: -1`) |
| `callback` | function | -- | Function called when the timer fires |
| `callbackScope` | any | TimerEvent | The `this` context for the callback |
| `args` | Array | `[]` | Extra arguments passed to the callback |
| `timeScale` | number | `1` | Per-event time multiplier |
| `startAt` | number | `0` | Pre-fill elapsed time in ms (makes first fire happen sooner) |
| `paused` | boolean | `false` | Start the timer in a paused state |

### TimelineEventConfig

| Property | Type | Default | Description |
|---|---|---|---|
| `at` | number | `0` | Absolute time in ms from timeline start |
| `in` | number | -- | Offset from current elapsed (overrides `at`) |
| `from` | number | -- | Offset from previous event time (overrides `at` and `in`) |
| `run` | function | -- | Callback invoked when event fires |
| `loop` | function | -- | Callback invoked on repeat iterations (not first run) |
| `if` | function | -- | Guard function; return `false` to skip the event |
| `event` | string | -- | Event name emitted on the Timeline instance |
| `target` | any | -- | Scope for `run`/`loop`/`if` and target for `set` |
| `set` | object | -- | Key-value pairs applied to `target` when event fires |
| `tween` | TweenConfig | -- | Tween config or instance created when event fires |
| `sound` | string/object | -- | Sound key or `{ key, config }` to play |
| `once` | boolean | `false` | Remove this event after it fires |
| `stop` | boolean | `false` | Stop the entire timeline when this event fires |

### TimelineEvent (Internal)

The processed event object stored in `timeline.events[]`. Extends config with:

| Property | Type | Description |
|---|---|---|
| `complete` | boolean | Whether this event has fired |
| `time` | number | Resolved absolute time in ms |
| `repeat` | number | How many times this event has repeated |
| `tweenInstance` | Tween/TweenChain | Reference to spawned tween (if any) |

## Events

### Timeline Events

| Event | Constant | Listener Signature | Fired When |
|---|---|---|---|
| `'complete'` | `Phaser.Time.Events.COMPLETE` | `(timeline)` | All timeline events have been run |

Custom events via the `event` property in TimelineEventConfig are also emitted on the Timeline instance with signature `(target)`.

### TimerEvent / Clock

TimerEvent and Clock do not emit EventEmitter events. Timers use the `callback` property directly. The Clock is managed by scene lifecycle events (`PRE_UPDATE`, `UPDATE`, `SHUTDOWN`, `DESTROY`).

## API Quick Reference

### Clock (this.time)

| Method | Signature | Returns | Description |
|---|---|---|---|
| `addEvent` | `(config \| TimerEvent)` | `TimerEvent` | Create and schedule a timer event |
| `delayedCall` | `(delay, callback, args?, scope?)` | `TimerEvent` | Shorthand for a one-shot delayed call |
| `removeEvent` | `(event \| event[])` | `this` | Remove specific timer(s) |
| `removeAllEvents` | `()` | `this` | Schedule removal of all active timers |
| `clearPendingEvents` | `()` | `this` | Clear timers not yet added to active list |

| Property | Type | Description |
|---|---|---|
| `now` | number | Current clock time in ms |
| `startTime` | number | Time the scene started |
| `timeScale` | number | Delta multiplier for all timers |
| `paused` | boolean | Freeze all timers |

### TimerEvent

| Method | Returns | Description |
|---|---|---|
| `getProgress()` | number | 0..1 progress of current iteration |
| `getOverallProgress()` | number | 0..1 progress across all repeats |
| `getElapsed()` | number | Elapsed ms this iteration |
| `getElapsedSeconds()` | number | Elapsed seconds this iteration |
| `getRemaining()` | number | Ms until next fire |
| `getRemainingSeconds()` | number | Seconds until next fire |
| `getOverallRemaining()` | number | Ms until final fire |
| `getOverallRemainingSeconds()` | number | Seconds until final fire |
| `getRepeatCount()` | number | Repeats remaining |
| `remove(dispatchCallback?)` | void | Expire the timer (optionally fire callback) |
| `reset(config)` | TimerEvent | Reinitialize with new config |
| `destroy()` | void | Null out callback references |

### Timeline (this.add.timeline)

| Method | Signature | Returns | Description |
|---|---|---|---|
| `add` | `(config \| config[])` | `this` | Append events to the timeline |
| `play` | `(fromStart?)` | `this` | Start playing (default resets to start) |
| `pause` | `()` | `this` | Pause timeline and spawned tweens |
| `resume` | `()` | `this` | Resume timeline and spawned tweens |
| `stop` | `()` | `this` | Stop (sets paused + complete) |
| `reset` | `(loop?)` | `this` | Reset elapsed and all events to incomplete |
| `repeat` | `(amount?)` | `this` | Set loop count (-1/true=infinite, false=none) |
| `clear` | `()` | `this` | Remove all events, reset elapsed, pause |
| `isPlaying` | `()` | boolean | True if not paused and not complete |
| `getProgress` | `()` | number | 0..1 based on completed event count |

| Property | Type | Description |
|---|---|---|
| `elapsed` | number | Current elapsed time in ms |
| `timeScale` | number | Delta multiplier (does not affect spawned tweens) |
| `paused` | boolean | Whether timeline is paused |
| `complete` | boolean | Whether all events have run |
| `loop` | number | Number of additional loops (0=none, -1=infinite) |
| `iteration` | number | Current loop iteration |
| `totalComplete` | number | Count of events that have fired |
| `events` | TimelineEvent[] | The internal event array |

## Gotchas

1. **repeat vs total fires.** `repeat: 4` means 5 total callback invocations (1 initial + 4 repeats). This is a common off-by-one source.
2. **Zero delay with repeat throws.** A `TimerEvent` with `delay: 0` and any repeat/loop will throw `'TimerEvent infinite loop created via zero delay'`.
3. **Timelines start paused.** You must call `timeline.play()` after creation. Forgetting this is a frequent mistake.
4. **Timeline timeScale does not affect tweens.** Setting `timeline.timeScale` only scales the timeline's own elapsed counter. Tweens created by the timeline run at their own speed. Set tween `timeScale` separately or use the TweenManager.
5. **once events are removed permanently.** Timeline events with `once: true` are spliced out after firing and will not reappear on `reset()` or when looping.
6. **Timer additions are deferred.** `addEvent()` pushes to a pending list processed in `preUpdate`. The timer will not be active until the next frame.
7. **Clock paused vs timeScale 0.** Both freeze timers, but `paused = true` skips the update loop entirely, while `timeScale = 0` still runs the loop with zero delta. Prefer `paused` for a full freeze.
8. **callbackScope default.** If you omit `callbackScope`, the TimerEvent itself becomes `this` inside the callback, not the scene. Use arrow functions or pass `callbackScope: this` explicitly.
9. **Reusing TimerEvent instances.** You can pass a `TimerEvent` object to `addEvent()`, but it must not be in a completed state. The Clock will reset its elapsed and dispatch state.
10. **Timeline `from` chains.** Each `from` offset is relative to the previous event's resolved time, not the previous `from` value. Events are processed in array order.
11. **Scene pause pauses the Timeline.** When a scene is paused (`scene.pause()`), the Timeline's update loop stops too, since Timeline updates are driven by the scene's update step.
12. **`timer.reset()` does not re-add to Clock.** Calling `timer.reset(config)` reinitializes the timer but does not schedule it. You must call `this.time.addEvent(timer)` again after resetting.

## Source File Map

| File | Description |
|---|---|
| `src/time/Clock.js` | Scene Clock plugin -- creates, updates, removes TimerEvents |
| `src/time/TimerEvent.js` | Individual timer -- delay, repeat, loop, progress tracking |
| `src/time/Timeline.js` | Event sequencer -- scheduled actions, tweens, sounds, looping |
| `src/time/typedefs/TimerEventConfig.js` | Config typedef for `addEvent()` |
| `src/time/typedefs/TimelineEventConfig.js` | Config typedef for `timeline.add()` |
| `src/time/typedefs/TimelineEvent.js` | Internal event object typedef |
| `src/time/events/COMPLETE_EVENT.js` | `'complete'` event constant for Timeline |
| `src/time/events/index.js` | Events namespace barrel file |
