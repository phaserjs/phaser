---
name: audio-and-sound
description: "Use this skill when adding audio or sound to a Phaser 4 game. Covers loading audio, playing sounds, music, volume, spatial audio, Web Audio API, and SoundManager. Triggers on: sound, audio, music, volume, mute."
---

# Audio and Sound
> Phaser provides a unified Sound system via `this.sound` (a SoundManager) that abstracts over Web Audio API and HTML5 Audio. It handles loading, playback, volume, panning, looping, markers, audio sprites, spatial audio, and browser autoplay-policy unlocking.

**Key source paths:** `src/sound/BaseSoundManager.js`, `src/sound/BaseSound.js`, `src/sound/webaudio/`, `src/sound/html5/`, `src/sound/SoundManagerCreator.js`, `src/sound/events/`, `src/sound/typedefs/`
**Related skills:** ../loading-assets/SKILL.md, ../game-setup-and-config/SKILL.md

## Quick Start

```js
class GameScene extends Phaser.Scene {
    preload() {
        this.load.audio('bgm', 'assets/music.mp3');
        this.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
    }

    create() {
        // Fire-and-forget (auto-destroys when complete)
        this.sound.play('coin');

        // Retained reference for ongoing control
        this.music = this.sound.add('bgm', { loop: true, volume: 0.5 });
        this.music.play();
    }
}
```

Assets loaded via `this.load.audio()` in `preload()` are ready by the time `create()` runs. Provide an array of URLs for cross-browser format fallback.

## Core Concepts

### WebAudio vs HTML5 Audio

Phaser auto-selects the best backend via `SoundManagerCreator.create()`:

1. If `config.audio.noAudio` is true, or the device supports neither Web Audio nor HTML5 Audio, a **NoAudioSoundManager** is created (all calls are no-ops).
2. If the device supports Web Audio and `config.audio.disableWebAudio` is not true, a **WebAudioSoundManager** is created (preferred).
3. Otherwise, an **HTML5AudioSoundManager** is created as fallback.

**WebAudio** advantages: precise timing, gapless looping, stereo panning (`StereoPannerNode`), spatial audio (`PannerNode`), per-sound gain nodes, `decodeAudio()` for runtime decoding.

**HTML5 Audio** limitations: no spatial audio, no real stereo panning (pan fires events but no audible effect), less precise looping, requires `instances` count at load time for simultaneous playback.

Force HTML5 or disable audio via game config: `audio: { disableWebAudio: true }` or `audio: { noAudio: true }`. Pass `audio: { context: existingAudioContext }` to reuse a WebAudio context in SPAs.

### The SoundManager (`this.sound`)

Accessed via `this.sound` in any Scene. It is a single shared instance across the entire game. Key responsibilities:

- Adding, playing, and removing sound instances
- Global volume, mute, rate, and detune
- Automatic pause/resume when the browser tab loses/gains focus (`pauseOnBlur`, default `true`)
- Audio unlock handling for mobile browsers
- Spatial audio listener position (WebAudio only)

### Sound Instances

Created via `this.sound.add(key, config)`. Each instance has its own playback state, volume, rate, detune, loop, pan, and seek properties. A sound must exist in the audio cache (loaded via the Loader) before it can be added.

State flags: `isPlaying` (boolean), `isPaused` (boolean).

```js
const sfx = this.sound.add('explosion', { volume: 0.8 });
sfx.play();        // returns boolean
sfx.pause();       // only works if isPlaying
sfx.resume();      // only works if isPaused
sfx.stop();        // resets to stopped state
sfx.destroy();     // marks for removal from manager
```

## Common Patterns

### Playing Sounds

**Fire-and-forget** -- `this.sound.play(key, config?)` adds, plays, and auto-destroys the sound on completion:

```js
this.sound.play('explosion');
this.sound.play('powerup', { volume: 0.5, rate: 1.2 });
```

**Retained reference** -- `this.sound.add(key, config?)` then call `play()` on the instance:

```js
const laser = this.sound.add('laser');
laser.play();
// Later: laser.stop(), laser.volume = 0.3, etc.
```

### Volume, Rate, and Detune

Each property can be set per-sound or globally on the manager. Global and per-sound values combine (for rate/detune, they multiply via `calculateRate()`).

```js
// Per-sound
sound.volume = 0.5;          // 0 to 1
sound.setVolume(0.5);        // chainable alternative
sound.rate = 1.5;            // 0.5 = half speed, 2.0 = double speed
sound.setRate(1.5);
sound.detune = 200;          // cents, -1200 to 1200
sound.setDetune(200);

// Global (affects all sounds)
this.sound.volume = 0.8;
this.sound.setVolume(0.8);
this.sound.rate = 1.0;
this.sound.setRate(1.0);
this.sound.detune = 0;
this.sound.setDetune(0);
```

The effective playback rate is: `sound.rate * manager.rate * detuneRate` where `detuneRate = Math.pow(1.0005777895065548, sound.detune + manager.detune)`.

### Looping

```js
// Via config at creation
const bgm = this.sound.add('music', { loop: true });
bgm.play();

// Toggle during playback
bgm.loop = false;
bgm.setLoop(false);  // chainable
```

The `LOOPED` event fires each time the sound loops back to the start. The `LOOP` event fires when the loop property changes.

### Seeking

```js
sound.seek = 5.0;        // jump to 5 seconds in
sound.setSeek(5.0);      // chainable
console.log(sound.seek);  // current playback position in seconds
```

Setting seek on a stopped sound has no effect.

### Stereo Panning

```js
sound.pan = -1;   // full left
sound.pan = 0;    // center
sound.pan = 1;    // full right
sound.setPan(0.5); // chainable
```

Uses `StereoPannerNode`, if it exists, on WebAudio. On HTML5 Audio, the pan property fires events but has no audible effect.

### Audio Sprites and Markers

Audio sprites combine multiple sounds into a single audio file with a JSON config (generated by the `audiosprite` tool). The JSON must be loaded separately.

```js
// In preload
this.load.audioSprite('sfx', 'assets/sfx.json', ['assets/sfx.ogg', 'assets/sfx.mp3']);

// In create
this.sound.playAudioSprite('sfx', 'explosion');
this.sound.playAudioSprite('sfx', 'coin', { volume: 0.5 });

// Or add for retained control
const sprite = this.sound.addAudioSprite('sfx');
sprite.play('explosion');
```

The JSON `spritemap` entries are automatically converted to markers with `name`, `start`, `duration`, and optional `loop`.

**Manual markers** -- you can also add markers to any sound:

```js
const sound = this.sound.add('longtrack');

sound.addMarker({ name: 'intro', start: 0, duration: 5 });
sound.addMarker({ name: 'loop', start: 5, duration: 20, config: { loop: true } });
sound.addMarker({ name: 'outro', start: 25, duration: 3 });

sound.play('intro');
// Later
sound.play('loop');
```

Marker API on BaseSound: `addMarker(marker)`, `updateMarker(marker)`, `removeMarker(markerName)`.

### Background Music Pattern

```js
this.bgm = this.sound.add('theme', { loop: true, volume: 0.4 });
this.bgm.play();
// Stop on scene shutdown: this.bgm.stop();
```

The manager's `pauseOnBlur` (default `true`) automatically pauses all sounds when the tab loses focus.

### Spatial Audio (WebAudio Only)

Spatial audio uses the Web Audio `PannerNode` to position sounds in 2D/3D space relative to a listener.

```js
// Set the listener position (typically your camera or player)
this.sound.setListenerPosition(400, 300);
// Or update directly: this.sound.listenerPosition.set(x, y);

// Create a spatialized sound with a source config
const enemy = this.sound.add('roar', {
    source: {
        x: 800,
        y: 300,
        refDistance: 50,
        maxDistance: 2000,
        rolloffFactor: 1,
        distanceModel: 'inverse',
        panningModel: 'equalpower',
        follow: enemySprite  // auto-track a Game Object's x/y
    }
});
enemy.play();
```

You can set `sound.x` and `sound.y` directly on a WebAudioSound to reposition it at any time. If `follow` is set to an object with `x`/`y` properties, the spatial position updates automatically each frame.

`setListenerPosition()` defaults to the center of the game canvas if called with no arguments.

### Muting

```js
// Per-sound
sound.mute = true;
sound.setMute(true);

// Global
this.sound.mute = true;
this.sound.setMute(true);
```

### Querying Sounds

```js
this.sound.get('coin');          // first sound with key, or null
this.sound.getAll('coin');       // all sounds with key
this.sound.getAll();             // every sound in the manager
this.sound.getAllPlaying();      // all currently playing sounds
this.sound.isPlaying('coin');    // true if any 'coin' sound is playing
this.sound.isPlaying();          // true if any sound is playing
```

### Removing and Stopping

```js
this.sound.stopAll();            // stop all sounds, fires STOP_ALL
this.sound.stopByKey('coin');    // stop all sounds with key, returns count
this.sound.pauseAll();           // pause all, fires PAUSE_ALL
this.sound.resumeAll();          // resume all, fires RESUME_ALL

this.sound.remove(soundInstance);  // destroy + remove specific sound
this.sound.removeByKey('coin');    // destroy + remove all with key, returns count
this.sound.removeAll();            // destroy + remove everything
```

### Decoding Audio at Runtime (WebAudio Only)

```js
this.sound.decodeAudio('key', base64StringOrArrayBuffer);
// Or batch: this.sound.decodeAudio([{ key: 'sfx1', data: buf1 }, { key: 'sfx2', data: buf2 }]);
this.sound.on('decoded', (key) => { /* one done */ });
this.sound.on('decodedall', () => { /* all done */ });
```

## Configuration Reference

### SoundConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mute` | boolean | `false` | Whether the sound is muted |
| `volume` | number | `1` | Volume, 0 (silence) to 1 (full) |
| `rate` | number | `1` | Playback speed (0.5 = half, 2.0 = double) |
| `detune` | number | `0` | Detuning in cents (-1200 to 1200) |
| `seek` | number | `0` | Start playback position in seconds |
| `loop` | boolean | `false` | Whether the sound should loop |
| `delay` | number | `0` | Delay before playback starts, in seconds |
| `pan` | number | `0` | Stereo pan, -1 (left) to 1 (right) |
| `source` | SpatialSoundConfig | `null` | Spatial audio configuration (WebAudio only) |

### SpatialSoundConfig

Position: `x` (0), `y` (0), `z` (0) -- source position in world space.
Orientation: `orientationX` (0), `orientationY` (0), `orientationZ` (-1) -- source direction vector.
Models: `panningModel` (`'equalpower'` or `'HRTF'`), `distanceModel` (`'linear'`, `'inverse'`, `'exponential'`).
Distance: `refDistance` (1), `maxDistance` (10000), `rolloffFactor` (1).
Cone: `coneInnerAngle` (360), `coneOuterAngle` (0), `coneOuterGain` (0).
Tracking: `follow` (null) -- a Vector2Like object whose x/y is auto-tracked each frame.

### SoundMarker

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | (required) | Unique identifier for the marker |
| `start` | number | `0` | Start position in seconds |
| `duration` | number | (remaining) | Playback duration in seconds |
| `config` | SoundConfig | `{}` | Default settings for this marker |

## Events

### Sound Instance Events (emitted on a Sound object)

| Event Constant | String Value | Callback Args | When |
|---------------|-------------|---------------|------|
| `Events.PLAY` | `'play'` | `(sound)` | Sound starts playing |
| `Events.PAUSE` | `'pause'` | `(sound)` | Sound is paused |
| `Events.RESUME` | `'resume'` | `(sound)` | Sound resumes from pause |
| `Events.STOP` | `'stop'` | `(sound)` | Sound is stopped |
| `Events.COMPLETE` | `'complete'` | `(sound)` | Sound finishes (non-looping) |
| `Events.LOOPED` | `'looped'` | `(sound)` | Sound loops back to start |
| `Events.LOOP` | `'loop'` | `(sound, value)` | Loop property changes |
| `Events.MUTE` | `'mute'` | `(sound, value)` | Mute state changes |
| `Events.VOLUME` | `'volume'` | `(sound, value)` | Volume changes |
| `Events.RATE` | `'rate'` | `(sound, value)` | Rate changes |
| `Events.DETUNE` | `'detune'` | `(sound, value)` | Detune changes |
| `Events.SEEK` | `'seek'` | `(sound, value)` | Seek position changes |
| `Events.PAN` | `'pan'` | `(sound, value)` | Pan value changes |
| `Events.DESTROY` | `'destroy'` | `(sound)` | Sound is destroyed |

### SoundManager Events (emitted on `this.sound`)

| Event Constant | String Value | Callback Args | When |
|---------------|-------------|---------------|------|
| `Events.PAUSE_ALL` | `'pauseall'` | `(manager)` | `pauseAll()` called |
| `Events.RESUME_ALL` | `'resumeall'` | `(manager)` | `resumeAll()` called |
| `Events.STOP_ALL` | `'stopall'` | `(manager)` | `stopAll()` called |
| `Events.GLOBAL_MUTE` | `'globalmute'` | `(manager, value)` | Global mute changes |
| `Events.GLOBAL_VOLUME` | `'globalvolume'` | `(manager, value)` | Global volume changes |
| `Events.GLOBAL_RATE` | `'globalrate'` | `(manager, value)` | Global rate changes |
| `Events.GLOBAL_DETUNE` | `'globaldetune'` | `(manager, value)` | Global detune changes |
| `Events.UNLOCKED` | `'unlocked'` | `(manager)` | Audio system unlocked after user interaction |
| `Events.DECODED` | `'decoded'` | `(key)` | Single audio key decoded (WebAudio) |
| `Events.DECODED_ALL` | `'decodedall'` | `()` | All queued audio decoded (WebAudio) |

```js
// Example: listen for completion
const sfx = this.sound.add('bang');
sfx.on('complete', (sound) => {
    console.log(sound.key, 'finished');
});
sfx.play();
```

## API Quick Reference

### BaseSoundManager (`this.sound`)

Methods: `add(key, config?)`, `addAudioSprite(key, config?)`, `play(key, extra?)`, `playAudioSprite(key, spriteName, config?)`, `get(key)`, `getAll(key?)`, `getAllPlaying()`, `isPlaying(key?)`, `remove(sound)`, `removeByKey(key)`, `removeAll()`, `stopAll()`, `stopByKey(key)`, `pauseAll()`, `resumeAll()`, `setListenerPosition(x?, y?)`, `setMute(value)`, `setVolume(value)`, `setRate(value)`, `setDetune(value)`.

Properties: `volume` (0-1), `mute` (boolean), `rate` (number), `detune` (-1200 to 1200), `pauseOnBlur` (boolean, default true), `locked` (boolean, read-only), `listenerPosition` (Vector2), `sounds` (array, private).

### BaseSound (sound instance)

Methods: `play(markerName?, config?)`, `pause()`, `resume()`, `stop()`, `destroy()`, `addMarker(marker)`, `updateMarker(marker)`, `removeMarker(name)`, `setMute(value)`, `setVolume(value)`, `setRate(value)`, `setDetune(value)`, `setSeek(value)`, `setLoop(value)`, `setPan(value)`.

Properties: `volume` (0-1), `mute` (boolean), `rate` (number), `detune` (number), `seek` (seconds), `loop` (boolean), `pan` (-1 to 1), `isPlaying` (read-only), `isPaused` (read-only), `duration` (seconds), `totalDuration` (seconds), `key` (string), `x` / `y` (spatial position, WebAudio only).

All `set*` methods return `this` for chaining.

## Gotchas

### Browser Autoplay Policy

Browsers block audio until user interaction. Phaser handles this automatically:

- **WebAudio**: `AudioContext` starts suspended. Phaser listens for touchstart/touchend/mousedown/mouseup/keydown on `document.body` to call `context.resume()`. The `locked` property is true until unlocked; `UNLOCKED` event fires once resolved.
- **HTML5 Audio**: Locked audio tags queue all actions until the first touch replays them.

You do **not** need to handle unlocking manually. To know when ready, listen for `UNLOCKED`:

```js
if (this.sound.locked) {
    this.sound.once('unlocked', () => {
        this.sound.play('bgm');
    });
} else {
    this.sound.play('bgm');
}
```

### Audio Format Support

No single format works everywhere. Provide multiple formats: `this.load.audio('bgm', ['assets/bgm.ogg', 'assets/bgm.mp3'])`. MP3 has broadest support. OGG Vorbis lacks Safari support. AAC/M4A works well on Safari/iOS. WebM/Opus has excellent quality but limited older browser support.

### HTML5 Audio Simultaneous Playback

HTML5 Audio uses a pool of `<audio>` tags. Specify `instances` when loading for simultaneous playback: `this.load.audio('shot', 'assets/shot.mp3', { instances: 4 })`. Default is 1. If all tags are in use and `manager.override` is true (default), the sound with the most progress is hijacked. WebAudio has no such limitation.

### iOS/Safari Specifics

- `StereoPannerNode` not supported on iOS/Safari, so `pan` has no audible effect (events still fire).
- iOS 17/18+ can interrupt audio on background. Phaser handles this via `context.suspend()`/`context.resume()` on the `VISIBLE` game event.
- `setListenerPosition()` and spatial audio are WebAudio-only.

### WebAudio Context Reuse

For SPAs that recreate the game without a full page reload, pass `audio: { context: existingAudioContext }` in the game config. You can also swap contexts at runtime via `this.sound.setAudioContext(newContext)` (WebAudio only).

### Sound Manager is Shared (Global)

There is one SoundManager per game, not per scene. `this.sound` in every scene references the same manager. Sounds are not automatically cleaned up on scene shutdown -- you must stop/remove them yourself if needed. Looping sounds will continue playing across scene changes unless explicitly stopped.

### Fire-and-Forget vs Persistent Sounds

`this.sound.play(key)` creates a sound that auto-destroys on completion -- you cannot control it after calling play. Use `this.sound.add(key)` when you need a persistent reference to pause, stop, adjust volume, or listen for events.

### Spatial Audio is WebAudio Only

The `source` config for spatial audio is silently ignored when using HTML5 Audio. If your game must support HTML5 Audio fallback, do not rely on spatial positioning for gameplay-critical audio cues.

### Web Audio Analyser (WebAudio Only)

Access the underlying `AudioContext` to create an `AnalyserNode` for frequency/waveform visualization:

```js
const analyser = this.sound.context.createAnalyser();
analyser.fftSize = 256;
this.sound.masterVolumeNode.connect(analyser);
analyser.connect(this.sound.context.destination);

const dataArray = new Uint8Array(analyser.frequencyBinCount);

// In update loop
analyser.getByteFrequencyData(dataArray);
// Use dataArray values to drive visual effects
```

This only works with the WebAudioSoundManager. Check `this.sound.context` exists before using.

## Source File Map

| File | Purpose |
|------|---------|
| `src/sound/SoundManagerCreator.js` | Factory: picks WebAudio, HTML5, or NoAudio manager |
| `src/sound/BaseSoundManager.js` | Base manager: add, play, get, stop/pause/resume all, global volume/rate/detune |
| `src/sound/BaseSound.js` | Base sound: play/pause/resume/stop, markers, config, calculateRate |
| `src/sound/webaudio/WebAudioSoundManager.js` | WebAudio manager: AudioContext, gain nodes, unlock, spatial listener, decodeAudio |
| `src/sound/webaudio/WebAudioSound.js` | WebAudio sound: buffer sources, spatial/panner nodes, seek, all properties |
| `src/sound/html5/HTML5AudioSoundManager.js` | HTML5 manager: audio tag pooling, locked queue, override |
| `src/sound/html5/HTML5AudioSound.js` | HTML5 sound: tag-based playback, limited feature set |
| `src/sound/noaudio/NoAudioSoundManager.js` | No-op manager for environments without audio |
| `src/sound/events/` | All sound event constants (PLAY, STOP, COMPLETE, etc.) |
| `src/sound/typedefs/SoundConfig.js` | SoundConfig type definition |
| `src/sound/typedefs/SoundMarker.js` | SoundMarker type definition |
| `src/sound/typedefs/SpatialSoundConfig.js` | SpatialSoundConfig type definition |
| `src/sound/typedefs/AudioSpriteSound.js` | AudioSpriteSound type definition |
