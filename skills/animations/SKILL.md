---
name: animations
description: "Use this skill when creating or controlling sprite animations in Phaser 4. Covers spritesheets, atlases, AnimationManager, AnimationState, play/stop/chain, frame callbacks, and animation events. Triggers on: sprite animation, spritesheet, play animation, animation frames."
---

# Phaser 4 -- Sprite Animations

> AnimationManager (global), AnimationState (per-sprite), creating animations from spritesheets and atlases, playing/pausing/chaining, animation events, frame callbacks.

**Related skills:** ../sprites-and-images/SKILL.md, ../loading-assets/SKILL.md

---

## Quick Start

```js
// In preload -- load a spritesheet
this.load.spritesheet('explosion', 'explosion.png', {
    frameWidth: 64,
    frameHeight: 64
});

// In create -- define a global animation
this.anims.create({
    key: 'explode',
    frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
    frameRate: 24,
    repeat: 0
});

// Play it on a sprite
const sprite = this.add.sprite(400, 300, 'explosion');
sprite.play('explode');
```

---

## Core Concepts

### AnimationManager vs AnimationState

Phaser has two distinct animation objects:

| Aspect | AnimationManager | AnimationState |
|---|---|---|
| Access | `this.anims` (in a Scene) or `this.game.anims` | `sprite.anims` |
| Scope | Global -- shared across all scenes | Per-sprite instance |
| Purpose | Create/store animation definitions | Control playback on one Game Object |
| Class | `Phaser.Animations.AnimationManager` | `Phaser.Animations.AnimationState` |

The AnimationManager is a singleton owned by the Game. Animations registered there are available in every Scene. The AnimationState lives on each Sprite and handles playback for that specific object.

An `Animation` is a sequence of `AnimationFrame` objects plus timing data. Created via `this.anims.create(config)` (global) or `sprite.anims.create(config)` (local to one sprite).

### Local vs Global Animations

When `sprite.anims.play(key)` is called, it first checks for a local animation with that key, then falls back to the global AnimationManager. Use local for sprite-specific animations; use global when shared across sprites.

```js
// Global animation -- available to all sprites
this.anims.create({ key: 'walk', frames: 'player_walk', frameRate: 12, repeat: -1 });

// Local animation -- only on this sprite
sprite.anims.create({ key: 'walk', frames: 'npc_walk', frameRate: 10, repeat: -1 });

// This plays the LOCAL version because local takes priority
sprite.play('walk');
```

---

## Common Patterns

### Spritesheet Animation

Use `generateFrameNumbers` for spritesheets (numeric frame indices).

```js
this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 });

// All frames
this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
});

// Custom frame sequence
this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('dude', { frames: [0, 1, 2, 1] }),
    frameRate: 6,
    repeat: -1
});
```

`generateFrameNumbers` config:
- `start` (default `0`) -- first frame index
- `end` (default `-1`, meaning last frame) -- final frame index
- `first` -- a single frame to prepend before the range
- `frames` -- explicit array of frame indices (overrides start/end)

### Atlas Animation

Use `generateFrameNames` for texture atlases (string-based frame names).

```js
this.load.atlas('gems', 'gems.png', 'gems.json');

this.anims.create({
    key: 'ruby_sparkle',
    frames: this.anims.generateFrameNames('gems', {
        prefix: 'ruby_',
        start: 1,
        end: 6,
        zeroPad: 4   // produces ruby_0001 through ruby_0006
    }),
    frameRate: 12,
    repeat: -1
});
```

`generateFrameNames` config:
- `prefix` -- prepended to each frame number
- `suffix` -- appended after each frame number
- `start`, `end` -- numeric range
- `zeroPad` -- left-pad numbers to this length with zeros
- `frames` -- explicit array of frame numbers (overrides start/end)

If you call `generateFrameNames(key)` with no config, it returns all frames from the atlas.

### String as Frames

Pass a texture key string as `frames` to use all frames from that texture, sorted numerically by default. Set `sortFrames: false` to disable sorting.

```js
this.anims.create({ key: 'walk', frames: 'player_walk', frameRate: 12, repeat: -1 });
```

### Yoyo and Repeat

```js
this.anims.create({
    key: 'pulse',
    frames: this.anims.generateFrameNumbers('orb', { start: 0, end: 5 }),
    frameRate: 10,
    yoyo: true,       // plays forward then backward
    repeat: -1,       // -1 = forever
    repeatDelay: 500   // ms pause between each repeat cycle
});
```

When `yoyo` is true, the animation plays forward then reverses. The full cycle counts as one play.

### Chaining Animations

```js
sprite.play('attack');
sprite.chain('idle');                        // play idle after attack completes
sprite.chain(['fall', 'land', 'idle']);       // chain multiple
sprite.anims.chain();                        // clear the chain queue
```

Chaining is per-sprite. Chained animations start after `animationcomplete` or `animationstop`. An animation with `repeat: -1` never completes -- call `stop()` to trigger the chain.

### Playing in Reverse

```js
// Play an animation from last frame to first
sprite.playReverse('walk');

// Reverse direction mid-playback
sprite.anims.reverse();
```

`playReverse` sets `forward = false` and `inReverse = true`. The `reverse()` method toggles direction mid-playback.

### Play Variants

```js
sprite.play('walk', true);                   // ignoreIfPlaying = true
sprite.anims.playAfterDelay('walk', 1000);   // play after 1s delay
sprite.anims.playAfterRepeat('walk', 2);     // play after current anim repeats 2x
```

### Animation Mixing

Adds a transition delay between two specific animations, set globally on the AnimationManager.

```js
this.anims.addMix('idle', 'walk', 200);
this.anims.addMix('walk', 'idle', 300);

sprite.play('idle');
sprite.play('walk');   // 200ms mix delay applied automatically

this.anims.removeMix('idle', 'walk');   // remove specific pair
this.anims.removeMix('idle');           // remove all mixes for 'idle'
```

Mix delays only apply with `sprite.play()`, not `playAfterDelay` or `playAfterRepeat`.

### Pause, Resume, and Stop

```js
sprite.anims.pause();                 // pause per-sprite
sprite.anims.resume();                // resume per-sprite
this.anims.pauseAll();                // global pause
this.anims.resumeAll();               // global resume

sprite.anims.stop();                  // stop immediately
sprite.anims.stopAfterDelay(2000);    // stop after 2 seconds
sprite.anims.stopAfterRepeat(1);      // stop after 1 more repeat
sprite.anims.stopOnFrame(frame);      // stop when a specific frame is reached
```

All stop methods fire `animationstop` (not `animationcomplete`). Chained animations trigger after stop.

### Animation Events

```js
sprite.on('animationcomplete', (anim, frame, gameObject, frameKey) => {
    console.log('completed:', anim.key);
});

// Key-specific complete -- only fires for the named animation
sprite.on('animationcomplete-explode', (anim, frame, gameObject, frameKey) => {
    gameObject.destroy();
});
```

Available events: `animationstart`, `animationcomplete`, `animationcomplete-{key}`, `animationupdate`, `animationstop`, `animationrepeat`, `animationrestart`. All share the same callback signature: `(animation, frame, gameObject, frameKey)`.

### Frame-Level Callbacks via animationupdate

```js
sprite.on('animationupdate', (anim, frame, gameObject, frameKey) => {
    if (anim.key === 'attack' && frame.index === 4) {
        this.checkHit(gameObject);
    }
});
```

### Per-Frame Duration

Individual frames can have a `duration` (ms) that is added to the base msPerFrame.

```js
this.anims.create({
    key: 'combo',
    frames: [
        { key: 'fighter', frame: 'punch1', duration: 50 },
        { key: 'fighter', frame: 'kick', duration: 200 },   // hold longer
        { key: 'fighter', frame: 'recover', duration: 100 }
    ],
    frameRate: 24
});
```

### Visibility, Random Start, and TimeScale

```js
// Visibility control
this.anims.create({
    key: 'appear', frames: 'sparkle', frameRate: 12,
    showOnStart: true,      // sprite.visible = true when anim starts (after delay)
    hideOnComplete: true,   // sprite.visible = false when anim completes
    showBeforeDelay: true   // show first frame immediately even during delay
});

// Random start frame -- each sprite begins on a different frame
this.anims.create({
    key: 'ambient', frames: 'fire', frameRate: 10, repeat: -1,
    randomFrame: true
});

// TimeScale -- per-sprite or global speed control
sprite.anims.timeScale = 2;                         // 2x speed
sprite.play({ key: 'walk', timeScale: 0.5 });       // half speed via config
this.anims.globalTimeScale = 0.5;                    // affects ALL animations
```

### Staggered Playback

```js
const enemies = this.add.group({ key: 'enemy', repeat: 9 });
this.anims.staggerPlay('walk', enemies.getChildren(), 100);
// Each sprite starts 100ms after the previous. Pass staggerFirst: false to skip delay on first.
```

### JSON Export and Import

```js
// Export all global animations to JSON
const data = this.anims.toJSON();

// Import animations from JSON (pass true to clear existing animations first)
this.anims.fromJSON(data);
this.anims.fromJSON(data, true);

// Check before creating to avoid duplicate warning
if (!this.anims.exists('walk')) {
    this.anims.create({ key: 'walk', frames: 'player_walk', frameRate: 12, repeat: -1 });
}
```

### Modifying Animation Frames at Runtime

```js
const anim = this.anims.get('walk');

// Add frames to the end
anim.addFrame(this.anims.generateFrameNumbers('player', { start: 8, end: 10 }));

// Insert frames at a specific index
anim.addFrameAt(this.anims.generateFrameNumbers('player', { frames: [5] }), 2);

// Remove a specific frame object
const frame = anim.frames[3];
anim.removeFrame(frame);

// Remove frame at index
anim.removeFrameAt(0);
```

### Aseprite Support

```js
this.load.aseprite('paladin', 'paladin.png', 'paladin.json');
// In create:
this.anims.createFromAseprite('paladin');               // all tags
this.anims.createFromAseprite('paladin', ['walk']);      // specific tags only
sprite.play('walk');                                     // play by tag name
```

---

## Configuration Reference

### AnimationConfig (used with `this.anims.create()`)

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | string | -- | Unique identifier for the animation |
| `frames` | string or AnimationFrame[] | `[]` | Texture key string (uses all frames) or array of frame config objects |
| `sortFrames` | boolean | `true` | Numerically sort frames when using a string key |
| `defaultTextureKey` | string | `null` | Fallback texture key if not set per-frame |
| `frameRate` | number | `24` | Playback rate in frames per second (used if `duration` is null) |
| `duration` | number | `null` | Total animation length in ms (derives frameRate if set) |
| `skipMissedFrames` | boolean | `true` | Skip frames when lagging behind |
| `delay` | number | `0` | Delay before playback starts (ms) |
| `repeat` | number | `0` | Times to repeat after first play (-1 = infinite) |
| `repeatDelay` | number | `0` | Delay before each repeat (ms) |
| `yoyo` | boolean | `false` | Reverse back to start before repeating |
| `showBeforeDelay` | boolean | `false` | Show first frame immediately during delay period |
| `showOnStart` | boolean | `false` | Set visible=true when animation starts |
| `hideOnComplete` | boolean | `false` | Set visible=false when animation completes |
| `randomFrame` | boolean | `false` | Start from a random frame |

### PlayAnimationConfig (used with `sprite.play()`)

All AnimationConfig timing properties are available, plus:

| Property | Type | Default | Description |
|---|---|---|---|
| `key` | string or Animation | -- | Animation key or instance to play |
| `startFrame` | number | `0` | Frame index to begin playback from |
| `timeScale` | number | `1` | Speed multiplier for this playback |

Values in PlayAnimationConfig override the animation definition for this specific playback instance.

### Duration vs FrameRate Priority

- If both `duration` and `frameRate` are null: defaults to 24 fps.
- If only `duration` is set: frameRate is calculated as `totalFrames / (duration / 1000)`.
- If `frameRate` is set (even if duration is also set): frameRate wins, and duration is derived as `(totalFrames / frameRate) * 1000`.

---

## Events

### Sprite Event Flow

1. `animationstart` -- after delay expires, before first update
2. `animationupdate` -- each frame change
3. `animationrepeat` -- each repeat cycle
4. `animationcomplete` -- natural end (finite repeat)
5. `animationcomplete-{key}` -- same, with animation key appended

Stopped manually: `animationstop` fires instead of complete. Restarted mid-play: `animationrestart` fires.

All callbacks: `(animation, frame, gameObject, frameKey)`.

### AnimationManager Events

Fire on `this.anims`: `addanimation`, `removeanimation`, `pauseall`, `resumeall`.

---

## API Quick Reference

### AnimationManager (`this.anims`)

| Method | Description |
|---|---|
| `create(config)` | Create and register a global animation |
| `remove(key)` | Remove a global animation by key |
| `get(key)` | Get an Animation instance by key |
| `exists(key)` | Check if a key is already registered |
| `generateFrameNumbers(key, config)` | Generate frame array from a spritesheet |
| `generateFrameNames(key, config)` | Generate frame array from an atlas |
| `play(key, children)` | Play an animation on an array of Game Objects |
| `staggerPlay(key, children, stagger)` | Staggered play across multiple Game Objects |
| `pauseAll()` / `resumeAll()` | Pause/resume all animations globally |
| `addMix(animA, animB, delay)` | Set transition delay between two animations |
| `removeMix(animA, animB?)` | Remove a mix pairing |
| `getMix(animA, animB)` | Get the mix delay between two animations |
| `createFromAseprite(key, tags?, target?)` | Create animations from Aseprite JSON |
| `toJSON()` | Export all animations as JSON data |
| `fromJSON(data, clear?)` | Load animations from JSON data (pass `true` to clear existing first) |

### AnimationState (`sprite.anims`)

| Method | Description |
|---|---|
| `play(key, ignoreIfPlaying?)` | Play an animation |
| `playReverse(key, ignoreIfPlaying?)` | Play an animation in reverse |
| `playAfterDelay(key, delay)` | Play after a delay in ms |
| `playAfterRepeat(key, repeatCount?)` | Play after current anim repeats N times |
| `chain(key)` | Queue animation(s) to play after current one |
| `stop()` | Stop immediately |
| `stopAfterDelay(delay)` | Stop after a delay in ms |
| `stopAfterRepeat(repeatCount?)` | Stop after N more repeats |
| `stopOnFrame(frame)` | Stop when a specific frame is reached |
| `pause(atFrame?)` | Pause playback |
| `resume(fromFrame?)` | Resume playback |
| `restart(includeDelay?, resetRepeats?)` | Restart from beginning |
| `reverse()` | Reverse direction mid-playback |
| `getName()` | Get the current animation key |
| `getFrameName()` | Get the current frame key |
| `getProgress()` | Get progress 0-1 |
| `setProgress(value)` | Set progress 0-1 |
| `setRepeat(value)` | Change repeat count during playback |
| `getTotalFrames()` | Get total frame count |
| `create(config)` | Create a local animation on this sprite |
| `exists(key)` | Check if a local animation exists |
| `get(key)` | Get a local animation by key |

Key properties: `isPlaying`, `hasStarted`, `currentAnim`, `currentFrame`, `forward`, `inReverse`, `timeScale`.

---

## Gotchas

1. **Animations are global by default.** `this.anims.create()` registers across all Scenes. Do not recreate in every Scene -- it logs a warning and returns the existing one.
2. **`repeat: -1` never fires `animationcomplete`.** Use `stop()` to end infinite animations. Listen for `animationstop` instead.
3. **`frameRate` beats `duration`.** If both are set, frameRate wins. Set only `duration` (leave frameRate null) to control total length.
4. **Per-frame `duration` is additive.** Added on top of base msPerFrame, not a replacement.
5. **`play()` stops the current animation** (fires `animationstop`). Use `play(key, true)` to skip if already playing.
6. **Mix delays only work with `play()`.** `playAfterDelay`/`playAfterRepeat` bypass mixes.
7. **Local animations override global.** Same key on a sprite's local map takes priority.
8. **Sprite shorthand methods.** `sprite.play()`, `sprite.playReverse()`, `sprite.chain()`, `sprite.stop()` wrap `sprite.anims.*`.
9. **Chained anims fire after stop too.** Clear the queue with `sprite.anims.chain()` before stopping if unwanted.
10. **`generateFrameNumbers` end=-1 means last frame.** The `__BASE` frame is excluded automatically.

---

## Source File Map

| File | Purpose |
|---|---|
| `src/animations/AnimationManager.js` | Global singleton -- create, remove, get, generateFrame*, mix, staggerPlay |
| `src/animations/Animation.js` | Animation definition -- frames, timing, yoyo, repeat logic |
| `src/animations/AnimationState.js` | Per-sprite component -- play, stop, pause, chain, events |
| `src/animations/AnimationFrame.js` | Single frame data -- textureKey, textureFrame, duration, progress |
| `src/animations/events/index.js` | All animation event constants |
| `src/animations/typedefs/Animation.js` | AnimationConfig typedef |
| `src/animations/typedefs/PlayAnimationConfig.js` | PlayAnimationConfig typedef |
| `src/animations/typedefs/GenerateFrameNumbers.js` | Config for generateFrameNumbers |
| `src/animations/typedefs/GenerateFrameNames.js` | Config for generateFrameNames |
