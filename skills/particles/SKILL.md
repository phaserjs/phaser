---
name: particles
description: "Use this skill when creating particle effects in Phaser 4. Covers ParticleEmitter, emission zones, death zones, particle properties, textures, gravity wells, and particle movement. Triggers on: particles, emitter, particle effect, explosion, fire, smoke."
---

# Particle System
> Creating and controlling particle effects in Phaser 4 -- ParticleEmitter creation and configuration, emitter ops (value formats), gravity wells, emission and death zones, flow vs burst modes, following game objects, and particle callbacks.

**Key source paths:** `src/gameobjects/particles/`
**Related skills:** ../sprites-and-images/SKILL.md, ../loading-assets/SKILL.md

## Quick Start

```js
// In a Scene's create() method:

// Basic continuous emitter (flow mode)
const emitter = this.add.particles(400, 300, 'flares', {
    frame: 'red',
    speed: 200,
    lifespan: 2000,
    scale: { start: 1, end: 0 },
    alpha: { start: 1, end: 0 },
    gravityY: 150
});

// One-shot burst (explode mode)
const burst = this.add.particles(400, 300, 'flares', {
    frame: 'blue',
    speed: { min: 100, max: 300 },
    lifespan: 1000,
    scale: { start: 0.5, end: 0 },
    emitting: false   // don't auto-start
});
burst.explode(20);    // emit 20 particles at once
```

## Core Concepts

### ParticleEmitter

`ParticleEmitter` extends `GameObject` and is added directly to the display list. It is both a game object (positionable, scalable, maskable) and the emitter itself. There is no separate manager -- `this.add.particles()` returns a `ParticleEmitter` instance.

**Factory signature:**
```js
this.add.particles(x, y, texture, config);
// x, y: world position (both optional, default 0)
// texture: string key or Texture instance
// config: ParticleEmitterConfig object (optional, can call setConfig later)
```

**Mixins:** AlphaSingle, BlendMode, Depth, Lighting, Mask, RenderNodes, ScrollFactor, Texture, Transform, Visible. So you can call `setPosition()`, `setScale()`, `setDepth()`, `setBlendMode()`, `setMask()`, `setScrollFactor()`, etc.

### Particle

A lightweight object owned by its emitter. Key properties: `x`, `y`, `velocityX/Y`, `accelerationX/Y`, `scaleX/Y`, `alpha`, `angle`, `rotation`, `tint`, `life` (total ms), `lifeCurrent` (remaining ms), `lifeT` (0-1 normalized), `bounce`, `delayCurrent`, `holdCurrent`. Particles are pooled internally -- you never create them manually.

### EmitterOp Value Formats

Most config properties (speed, scale, alpha, angle, x, y, etc.) accept flexible value formats:

```js
x: 400                                        // static value
x: [100, 200, 300, 400]                       // random pick from array
x: { min: 100, max: 700 }                     // random float in range
x: { min: 100, max: 700, int: true }          // random integer
x: { random: [100, 700] }                     // random integer shorthand
scale: { start: 0, end: 1 }                   // ease over lifetime (default linear)
scale: { start: 0, end: 1, ease: 'bounce.out' }  // custom ease
scale: { start: 4, end: 0.5, random: true }   // random start, ease to end
x: { values: [50, 500, 200, 800], interpolation: 'catmull' }  // interpolation
x: { steps: 32, start: 0, end: 576 }          // stepped sequential
x: { steps: 32, start: 0, end: 576, yoyo: true }  // stepped with yoyo
x: {                                           // custom callbacks
    onEmit: (particle, key, t, value) => value,
    onUpdate: (particle, key, t, value) => value
}
x: (particle, key, t, value) => value + 50    // emit-time callback shorthand
```

**Emit-only** (no onUpdate): `angle`, `delay`, `hold`, `lifespan`, `quantity`, `speedX`, `speedY`.
**Emit + Update** (support start/end, onUpdate): `accelerationX/Y`, `alpha`, `bounce`, `maxVelocityX/Y`, `moveToX/Y`, `rotate`, `scaleX/Y`, `tint`, `x`, `y`.

### Flow vs Explode (Burst)

**Flow mode** (`frequency >= 0`): emits `quantity` particles every `frequency` ms. Default is `frequency: 0` (every frame) with `emitting: true`.

**Explode mode** (`frequency = -1`): emits a batch all at once, then stops.

```js
emitter.flow(100, 5);           // 5 particles every 100ms
emitter.flow(100, 5, 50);       // auto-stop after 50 total
emitter.explode(30, 200, 400);  // burst 30 at position
emitter.explode(30);            // burst at emitter position
```

## Common Patterns

### Scale, Alpha, and Color Over Lifetime

```js
// Scale and alpha with custom easing
this.add.particles(400, 300, 'spark', {
    lifespan: 2000,
    speed: 100,
    scale: { start: 1, end: 0, ease: 'power2' },
    alpha: { start: 1, end: 0, ease: 'cubic.in' }
});
```

### Color Interpolation

The `color` property interpolates through an array of colors over particle lifetime (overrides `tint`):

```js
this.add.particles(400, 300, 'spark', {
    lifespan: 2000, speed: 100, scale: { start: 0.5, end: 0 },
    color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404], colorEase: 'quad.out'
});
```

### Tinting Particles

```js
this.add.particles(400, 300, 'spark', { tint: 0xff0000 });                           // static
this.add.particles(400, 300, 'spark', { tint: { start: 0xffffff, end: 0xff0000 } }); // over lifetime
```

### Gravity Wells

A `GravityWell` applies inverse-square gravitational force, pulling (or repelling with negative `power`) particles toward a point.

```js
const emitter = this.add.particles(400, 300, 'spark', {
    speed: 100, lifespan: 4000, scale: { start: 0.4, end: 0 }, quantity: 2
});

const well = emitter.createGravityWell({
    x: 400, y: 300, power: 2, epsilon: 100, gravity: 50
});

// Update at runtime
well.x = 300;
well.power = -1;  // negative = repel

// Or create manually and add
const well2 = new Phaser.GameObjects.Particles.GravityWell(500, 200, 3, 100, 50);
emitter.addParticleProcessor(well2);
emitter.removeParticleProcessor(well2);
```

### Emission Zones (Random)

A `RandomZone` spawns particles at random positions within a shape. The source must have a `getRandomPoint(point)` method -- all Phaser geometry classes (Circle, Ellipse, Rectangle, Triangle, Polygon, Line) support this, or provide a custom source:

```js
// Using built-in geometry
this.add.particles(400, 300, 'spark', {
    speed: 50, lifespan: 2000,
    emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 100) }
});

// Custom source object (any object with getRandomPoint)
emitter.addEmitZone({
    type: 'random',
    source: {
        getRandomPoint: (point) => {
            const a = Math.random() * Math.PI * 2;
            point.x = Math.cos(a) * 100;
            point.y = Math.sin(a) * 50;
            return point;
        }
    }
});
```

### Emission Zones (Edge)

An `EdgeZone` places particles sequentially along shape edges. The source must have a `getPoints(quantity, stepRate)` method. Curves, Paths, and all geometry shapes support this:

```js
this.add.particles(400, 300, 'spark', {
    lifespan: 1500, speed: 20,
    emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Circle(0, 0, 150),
        quantity: 48,     // number of points on edge (use 0 with stepRate instead)
        yoyo: false,      // reverse direction at ends
        seamless: true    // remove duplicate endpoint
    }
});

// Or add post-creation with any source that has getPoints
emitter.addEmitZone({ type: 'edge', source: geom, quantity: 50, yoyo: false, seamless: true });
```

**Multiple emission zones:** Pass an array to `emitZone` or call `addEmitZone()` multiple times. Zones iterate in sequence. The `total` property controls how many particles emit before rotating to the next zone (-1 = never rotate).

```js
this.add.particles(400, 300, 'spark', {
    emitZone: [
        { type: 'random', source: new Phaser.Geom.Circle(0, 0, 50) },
        { type: 'random', source: new Phaser.Geom.Circle(200, 0, 50) }
    ]
});
```

### Death Zones

A `DeathZone` kills particles when they enter (or leave) a region. The source must have a `contains(x, y)` method.

```js
// Kill particles entering a rectangle
this.add.particles(400, 100, 'spark', {
    speed: 200, lifespan: 5000, gravityY: 100,
    deathZone: { type: 'onEnter', source: new Phaser.Geom.Rectangle(300, 400, 200, 50) }
});

// Kill particles leaving a circle (confine to area)
this.add.particles(400, 300, 'spark', {
    speed: 100, lifespan: 5000,
    deathZone: { type: 'onLeave', source: new Phaser.Geom.Circle(400, 300, 150) }
});

// Custom death zone source (any object with contains)
emitter.addDeathZone({
    type: 'onEnter',
    source: { contains: (x, y) => x > 600 && y > 400 }
});
```

### Following a Game Object

```js
const player = this.add.sprite(100, 100, 'player');
const emitter = this.add.particles(0, 0, 'spark', {
    speed: 50, lifespan: 800, scale: { start: 0.5, end: 0 }
});

emitter.startFollow(player);                       // follow position
emitter.startFollow(player, 10, -20);              // with offset
emitter.startFollow(player, 0, 0, true);           // track visibility too
emitter.stopFollow();

// Or via config:
this.add.particles(0, 0, 'spark', { follow: player, followOffset: { x: 0, y: -20 } });
```

### Particle Callbacks

```js
// Via config
const emitter = this.add.particles(400, 300, 'spark', {
    speed: 100, lifespan: 2000,
    emitCallback: (particle, emitter) => { /* on emit */ },
    deathCallback: (particle) => { /* on death */ }
});

// Or set after creation
emitter.onParticleEmit((particle, emitter) => { /* ... */ });
emitter.onParticleDeath((particle) => { /* ... */ });

// Iterate alive/dead particles
emitter.forEachAlive((particle, emitter) => { /* particle.x, particle.lifeT */ });
```

### Duration, StopAfter, and Advance

```js
// Auto-stop after 3 seconds (alive particles continue until they expire)
this.add.particles(400, 300, 'spark', { speed: 100, duration: 3000 });

// Emit exactly 50 particles then stop
this.add.particles(400, 300, 'spark', { speed: 100, stopAfter: 50 });

// Pre-warm: fast-forward 2 seconds so particles visible on first frame
this.add.particles(400, 300, 'spark', { speed: 100, lifespan: 2000, advance: 2000 });
// Or manually: emitter.fastForward(2000, 50);
```

### Particle Bounds (Bounce)

```js
this.add.particles(400, 300, 'spark', {
    speed: 200, lifespan: 5000, bounce: 0.8,
    bounds: { x: 100, y: 100, width: 600, height: 400 },
    collideLeft: true, collideRight: true, collideTop: true, collideBottom: true
});
// Or: emitter.addParticleBounds(100, 100, 600, 400);
```

### Texture Frames and Animations

```js
// Random frame per particle
this.add.particles(400, 300, 'flares', { frame: ['red', 'green', 'blue'] });

// Sequential frames cycling through with quantity per frame
this.add.particles(400, 300, 'flares', {
    frame: { frames: ['red', 'green', 'blue'], cycle: true, quantity: 4 }
});

// Particle animation (plays anim over particle lifetime)
this.add.particles(400, 300, 'explosion', { anim: 'explode_anim', lifespan: 1000 });

// Multiple anims, randomly assigned
this.add.particles(400, 300, 'sheet', {
    anim: { anims: ['fire', 'smoke'], cycle: false, quantity: 1 }
});
```

### Sorting Particles

```js
this.add.particles(400, 300, 'spark', { sortProperty: 'y', sortOrderAsc: true });
// Or: sortCallback: (a, b) => a.y - b.y
```

### Custom Particle Processor

Extend `ParticleProcessor` to apply custom per-particle logic each frame. Implement `update(particle, delta, step, t)`:

```js
class WindProcessor extends Phaser.GameObjects.Particles.ParticleProcessor {
    constructor (windX, windY) {
        super(0, 0);
        this.windX = windX;
        this.windY = windY;
    }

    update (particle, delta, step, t) {
        particle.velocityX += this.windX * step;
        particle.velocityY += this.windY * step;
    }
}

emitter.addParticleProcessor(new WindProcessor(0.5, 0));
```

### Custom Particle Class

Extend `Particle` and override `update` for per-particle behavior. Set via `particleClass` in config:

```js
class TrailParticle extends Phaser.GameObjects.Particles.Particle {
    update (delta, step, processors) {
        const result = super.update(delta, step, processors);
        this.alpha = this.lifeT;  // custom: alpha matches life progress
        return result;  // must return true if particle is still alive
    }
}

this.add.particles(400, 300, 'spark', {
    particleClass: TrailParticle,
    speed: 100, lifespan: 2000
});
```

## Configuration Reference

### ParticleEmitterConfig -- Simple Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `active` | boolean | `true` | False = emitter does not update at all |
| `emitting` | boolean | `true` | False = no new particles (alive ones still update) |
| `blendMode` | string/number | `0` | Blend mode for rendering |
| `frequency` | number | `0` | ms between flow cycles; 0 = every frame; -1 = explode |
| `gravityX`, `gravityY` | number | `0` | Gravity in px/s^2 |
| `maxParticles` | number | `0` | Hard limit on total particle objects (0 = unlimited) |
| `maxAliveParticles` | number | `0` | Max alive particles at once (0 = unlimited) |
| `duration` | number | `0` | Auto-stop after ms (0 = forever) |
| `stopAfter` | number | `0` | Auto-stop after N particles emitted (0 = unlimited) |
| `advance` | number | `0` | Fast-forward on creation (ms) |
| `radial` | boolean | `true` | True = speed+angle; false = speedX/speedY |
| `particleBringToTop` | boolean | `true` | New particles render on top |
| `timeScale` | number | `1` | Time multiplier for updates |
| `follow` | Vector2Like | `null` | Object to follow |
| `followOffset` | Vector2Like | | Offset from follow target |
| `trackVisible` | boolean | `false` | Match follow target's visibility |
| `reserve` | number | | Pre-allocate particle objects |
| `particleClass` | function | `Particle` | Custom particle class |
| `sortProperty` | string | | Particle property to sort by |
| `sortOrderAsc` | boolean | | Sort ascending if true |

### ParticleEmitterConfig -- EmitterOp Properties

All accept the flexible value formats described above.

| Property | Default | E/U | Description |
|---|---|---|---|
| `x`, `y` | `0` | E+U | Particle offset from emitter |
| `speed` | `0` | E | Radial speed (sets speedX, deactivates speedY) |
| `speedX`, `speedY` | `0` | E | Directional speed (sets radial=false) |
| `angle` | `{min:0,max:360}` | E | Emission angle in degrees |
| `scale` | `1` | E+U | Uniform scale (sets scaleX, deactivates scaleY) |
| `scaleX`, `scaleY` | `1` | E+U | Non-uniform scale |
| `alpha` | `1` | E+U | Alpha transparency |
| `rotate` | `0` | E+U | Rotation in degrees |
| `tint` | `0xffffff` | E+U | Tint color (WebGL) |
| `color` | | E+U | Color array to interpolate (overrides tint) |
| `colorEase` | | | Ease for color interpolation |
| `lifespan` | `1000` | E | Lifetime in ms |
| `delay` | `0` | E | Delay before visible (ms) |
| `hold` | `0` | E | Hold at end of life before dying (ms) |
| `quantity` | `1` | E | Particles per flow cycle |
| `accelerationX/Y` | `0` | E+U | Acceleration (px/s^2) |
| `maxVelocityX/Y` | `10000` | E+U | Max velocity |
| `bounce` | `0` | E+U | Bounce restitution (0-1) |
| `moveToX`, `moveToY` | `0` | E+U | Target position (overrides angle/speed) |

*E = emit-only, E+U = emit + update (supports start/end, onUpdate)*

### Zone Config Properties

| Config Key | Type | Properties |
|---|---|---|
| `emitZone` | object or array | `{ type: 'random', source: <shape> }` |
| | | `{ type: 'edge', source: <shape>, quantity, stepRate, yoyo, seamless, total }` |
| `deathZone` | object or array | `{ type: 'onEnter'\|'onLeave', source: <shape> }` |
| `bounds` | object | `{ x, y, width, height }` or `{ x, y, w, h }` |

## Events

All events are emitted on the `ParticleEmitter` instance itself.

| Event | String | Callback Args | When |
|---|---|---|---|
| `START` | `'start'` | `(emitter)` | `start()` is called and emitter begins emitting |
| `STOP` | `'stop'` | `(emitter)` | `stop()` is called, or duration/stopAfter limit reached |
| `COMPLETE` | `'complete'` | `(emitter)` | Final alive particle dies after emitter has stopped |
| `EXPLODE` | `'explode'` | `(emitter, particle)` | `explode()` is called |
| `DEATH_ZONE` | `'deathzone'` | `(emitter, particle, zone)` | A death zone kills a particle |

```js
emitter.on('stop', (emitter) => { /* stopped emitting */ });
emitter.on('complete', (emitter) => { /* all particles dead */ });
emitter.on('deathzone', (emitter, particle, zone) => { /* ... */ });
```

## API Quick Reference

### ParticleEmitter Key Methods

**Lifecycle:** `start(advance?, duration?)`, `stop(kill?)`, `pause()`, `resume()`, `flow(frequency, count?, stopAfter?)`, `explode(count?, x?, y?)`, `emitParticleAt(x?, y?, count?)`, `emitParticle(count?, x?, y?)`, `fastForward(time, delta?)`.

**Config:** `setConfig(config)`, `updateConfig(config)`.

**Following:** `startFollow(target, offX?, offY?, trackVisible?)`, `stopFollow()`.

**Zones:** `addEmitZone(config)`, `removeEmitZone(zone)`, `clearEmitZones()`, `addDeathZone(config)`, `removeDeathZone(zone)`, `clearDeathZones()`.

**Processors:** `createGravityWell(config)`, `addParticleProcessor(processor)`, `removeParticleProcessor(processor)`, `getProcessors()`.

**Bounds:** `addParticleBounds(x, y, w, h, collideL?, collideR?, collideT?, collideB?)`.

**Callbacks/Iteration:** `onParticleEmit(cb, ctx?)`, `onParticleDeath(cb, ctx?)`, `killAll()`, `forEachAlive(cb, ctx?)`, `forEachDead(cb, ctx?)`.

**Counts:** `getAliveParticleCount()`, `getDeadParticleCount()`, `getParticleCount()`, `atLimit()`, `reserve(count)`.

**Property setters:** `setParticleSpeed(x, y?)`, `setParticleScale(x, y?)`, `setParticleGravity(x, y)`, `setParticleAlpha(value)`, `setParticleTint(value)`, `setParticleLifespan(value)`, `setEmitterAngle(value)`, `setQuantity(qty)`, `setFrequency(freq, qty?)`, `setRadial(value)`, `setEmitterFrame(frames, random?, qty?)`, `setAnim(anims, random?, qty?)`.

**Sorting:** `setSortProperty(property, ascending?)`, `setSortCallback(callback)`, `depthSort()`.

**Utility:** `getBounds(padding?, advance?, delta?, output?)`, `overlap(target)`.

### GravityWell

| Property/Method | Description |
|---|---|
| `x`, `y` | World position of the well |
| `power` | Force strength (negative to repel) |
| `epsilon` | Min distance for force calc (default 100) |
| `gravity` | Gravitational constant (default 50) |
| `active` | Enable/disable processing (inherited from ParticleProcessor) |

**Constructor:** `new GravityWell(x, y, power, epsilon, gravity)` or `new GravityWell(config)` where config is `{ x, y, power, epsilon, gravity }`.

## Gotchas

- **No ParticleEmitterManager:** Removed in v3.60. `this.add.particles()` returns a `ParticleEmitter` directly.
- **`speed` vs `speedX`/`speedY`:** `speed` sets speedX and deactivates speedY (radial). `speedX`/`speedY` switches to point mode (`radial: false`).
- **`scale` vs `scaleX`/`scaleY`:** `scale` applies to scaleX and deactivates scaleY. Use both for non-uniform scaling.
- **`color` overrides `tint`:** They are mutually exclusive; `color` (array) takes priority.
- **`moveToX`/`moveToY`:** Both must be set to activate. Overrides `angle` and `speed`.
- **`emitting` vs `active`:** `emitting: false` = no new particles but alive ones update. `active: false` = entire emitter frozen.
- **`stop` vs `complete`:** `'stop'` fires when emission stops. `'complete'` fires when the last alive particle dies.
- **`frequency: 0`:** Means emit every frame (max rate), not "never." Use `emitting: false` to prevent emission.
- **`frequency: -1`:** Puts the emitter in explode mode -- it will not flow automatically. Use `explode()` to emit bursts.
- **`hold` freezes particle:** After lifespan expires, `hold` keeps the particle visible and frozen for the specified ms before it dies. Useful for trail/lingering effects.
- **`advance` fast-forwards:** Pre-warms the emitter by simulating the given ms on creation, so particles are already visible on the first frame.
- **`reserve(count)` pre-allocates:** Call `reserve()` or set `reserve` in config to pre-create particle objects upfront, avoiding GC spikes during gameplay from on-demand allocation.
- **Zone source methods:** RandomZone needs `getRandomPoint(point)`. EdgeZone needs `getPoints(quantity, stepRate)`. DeathZone needs `contains(x, y)`.
- **Particle pool:** `maxParticles` limits total objects (not alive count). Use `maxAliveParticles` for visible limit.
- **Texture required:** The emitter needs a valid texture key. Use `frame` config for multi-frame textures.

## Source Files

See `references/REFERENCE.md` for the full source file map. Key entry points: `src/gameobjects/particles/ParticleEmitter.js` (main class), `src/gameobjects/particles/Particle.js` (individual particle), `src/gameobjects/particles/zones/` (zone classes).
