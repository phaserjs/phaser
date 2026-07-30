---
name: physics-matter
description: "Use this skill when using Matter.js physics in Phaser 4. Covers rigid bodies, constraints, composite bodies, sensors, collision filtering, world configuration, and advanced physics shapes. Triggers on: Matter, matter physics, constraint, joint, rigid body, sensor."
---

# Matter.js Physics
> Setting up and using Matter.js physics in Phaser 4 -- full-body physics with rigid bodies, compound bodies, constraints, composites, sensors, collision filtering, pointer dragging, tilemap integration, and debug rendering.

**Key source paths:** `src/physics/matter-js/MatterPhysics.js`, `src/physics/matter-js/World.js`, `src/physics/matter-js/Factory.js`, `src/physics/matter-js/MatterSprite.js`, `src/physics/matter-js/MatterImage.js`, `src/physics/matter-js/MatterGameObject.js`, `src/physics/matter-js/PointerConstraint.js`, `src/physics/matter-js/MatterTileBody.js`, `src/physics/matter-js/components/`, `src/physics/matter-js/events/`, `src/physics/matter-js/typedefs/`
**Related skills:** ../game-setup-and-config/SKILL.md, ../sprites-and-images/SKILL.md, ../physics-arcade/SKILL.md, ../tilemaps/SKILL.md

## Quick Start

```js
class GameScene extends Phaser.Scene {
    create() {
        // Matter sprite (dynamic, has animation support)
        this.player = this.matter.add.sprite(400, 200, 'player');
        this.player.setBounce(0.5);
        this.player.setFriction(0.05);

        // Matter image (dynamic, no animation)
        const box = this.matter.add.image(300, 100, 'crate');

        // Static body from raw shape
        this.matter.add.rectangle(400, 580, 800, 40, { isStatic: true });

        // Enable pointer dragging on all bodies
        this.matter.add.mouseSpring();

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-5);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(5);
        }
        if (this.cursors.up.isDown && this.player.body.velocity.y > -0.1) {
            this.player.setVelocityY(-10);
        }
    }
}

// Enable Matter physics in game config
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            enableSleeping: true,
            debug: true,
            setBounds: true    // walls around canvas edges
        }
    },
    scene: GameScene
};

const game = new Phaser.Game(config);
```

## Core Concepts

### Scene Plugin (`this.matter`)

The `MatterPhysics` class is the scene-level plugin. Key properties:

- **`this.matter.add`** -- `Factory` for creating bodies, constraints, Game Objects (auto-added to world).
- **`this.matter.world`** -- `World` instance managing the engine, bounds, debug rendering. Extends `EventEmitter`.
- **`this.matter.body`** / **`bodies`** / **`composite`** / **`composites`** / **`constraint`** -- Direct references to Matter.js modules for low-level use.
- **`this.matter.bodyBounds`** -- Helper for aligning bodies by visual bounds.

### World (`this.matter.world`)

- **`engine`** -- The `MatterJS.Engine` instance.
- **`localWorld`** -- The `MatterJS.World` composite containing all bodies and constraints.
- **`enabled`** -- Boolean; `false` pauses simulation.  **`autoUpdate`** -- `true` = engine updates each game step.
- **`walls`** -- `{ left, right, top, bottom }` boundary wall bodies (or null).

### World Config (`MatterWorldConfig`)

Passed under `physics.matter` in game or scene config:

| Property | Default | Purpose |
|---|---|---|
| `gravity` | `{ x: 0, y: 1 }` | Gravity vector. Set `false` to disable |
| `setBounds` | `false` | `true` or `{ x, y, width, height, thickness, left, right, top, bottom }` |
| `enableSleeping` | `false` | Allow bodies to sleep when at rest |
| `positionIterations` | `6` | Position solving accuracy |
| `velocityIterations` | `4` | Velocity solving accuracy |
| `constraintIterations` | `2` | Constraint stability |
| `timing.timeScale` | `1` | `0` freezes, `0.5` slow-motion |
| `autoUpdate` | `true` | Auto-step each game frame |
| `debug` | `false` | `true` or `MatterDebugConfig` object |
| `runner` | `{}` | Use `runner.fps` for fixed timestep |

### Matter Game Objects

Phaser provides two physics-aware Game Object classes and a function to add physics to any Game Object:

- **`Phaser.Physics.Matter.Sprite`** -- Extends `Sprite` with all Matter components. Created via `this.matter.add.sprite(x, y, key, frame, options)`. Supports animations.
- **`Phaser.Physics.Matter.Image`** -- Extends `Image` with all Matter components. Created via `this.matter.add.image(x, y, key, frame, options)`. No animation support, lighter weight.
- **`MatterGameObject(world, gameObject, options)`** -- Injects all Matter components into any existing Game Object. Created via `this.matter.add.gameObject(mySprite, options)`.

Both `MatterSprite` and `MatterImage` default to a rectangle body matching the texture size. Pass `options.shape` to override.

### Matter Components (Mixins)

All Matter Game Objects have these component methods mixed in:

| Component | Key Methods |
|---|---|
| **Velocity** | `setVelocity(x, y)`, `setVelocityX(x)`, `setVelocityY(y)`, `getVelocity()`, `setAngularVelocity(v)`, `getAngularVelocity()`, `setAngularSpeed(s)`, `getAngularSpeed()` |
| **Force** | `applyForce(vec2)`, `applyForceFrom(position, force)`, `thrust(speed)`, `thrustLeft(speed)`, `thrustRight(speed)`, `thrustBack(speed)` |
| **Bounce** | `setBounce(value)` -- restitution, 0 to 1 |
| **Friction** | `setFriction(value, air?, fstatic?)`, `setFrictionAir(value)`, `setFrictionStatic(value)` |
| **Mass** | `setMass(value)`, `setDensity(value)`, `centerOfMass` (getter) |
| **Gravity** | `setIgnoreGravity(bool)` |
| **Sensor** | `setSensor(bool)`, `isSensor()` |
| **Static** | `setStatic(bool)`, `isStatic()` |
| **Sleep** | `setToSleep()`, `setAwake()`, `setSleepThreshold(n)`, `setSleepEvents(start, end)` |
| **Collision** | `setCollisionCategory(cat)`, `setCollisionGroup(group)`, `setCollidesWith(cats)`, `setOnCollide(cb)`, `setOnCollideEnd(cb)`, `setOnCollideActive(cb)`, `setOnCollideWith(body, cb)` |
| **SetBody** | `setRectangle(w, h, opts)`, `setCircle(r, opts)`, `setPolygon(r, sides, opts)`, `setTrapezoid(w, h, slope, opts)`, `setBody(config, opts)`, `setExistingBody(body)` |
| **Transform** | Position sync between Matter body and Game Object |

## Common Patterns

### Setup and World Configuration

```js
// Runtime gravity and bounds
this.matter.world.setGravity(0, 2);          // x, y, scale (default 0.001)
this.matter.world.disableGravity();
this.matter.world.setBounds(0, 0, 1600, 1200, 64, true, true, true, true);

this.matter.set60Hz();                        // fixed timestep
this.matter.world.autoUpdate = false;         // then manual: this.matter.step(16.666);
this.matter.pause();                          // pause/resume
this.matter.resume();
```

### Creating Matter Sprites and Images

```js
const player = this.matter.add.sprite(200, 300, 'hero');  // default rect body matching texture

// Custom body shapes via options.shape
const ball = this.matter.add.image(400, 100, 'ball', null, { shape: { type: 'circle', radius: 24 } });
const hex = this.matter.add.sprite(300, 100, 'hex', null, { shape: { type: 'polygon', sides: 6, radius: 32 } });
const ship = this.matter.add.sprite(400, 200, 'ship', null, {
    shape: { type: 'fromVerts', verts: '0 0 40 0 40 40 20 60 0 40' }
});

// PhysicsEditor shape data
const shapes = this.cache.json.get('shapes');
const enemy = this.matter.add.sprite(500, 200, 'enemy', null, { shape: shapes.enemy });

// Add Matter physics to an existing Game Object
const existingSprite = this.add.sprite(100, 100, 'box');
this.matter.add.gameObject(existingSprite, { restitution: 0.8 });
// existingSprite now has setVelocity, setBounce, etc.
```

### Body Configuration Options (`MatterBodyConfig`)

Pass as the `options` parameter to any factory method or as the options for a Matter Game Object:

- `label`, `isStatic`, `isSensor`, `angle` (radians), `timeScale`, `ignoreGravity`, `ignorePointer`
- `density` (0.001 default, auto-calculates mass), `mass`, `restitution` (bounce 0-1)
- `friction` (0-1), `frictionAir` (air resistance), `frictionStatic` (stickiness when still)
- `slop` (overlap tolerance), `chamfer` (`{ radius: 5 }` for rounded corners)
- `collisionFilter: { category: 0x0001, mask: 0xFFFFFFFF, group: 0 }`
- `onCollideCallback`, `onCollideEndCallback`, `onCollideActiveCallback`
- `shape` (for Game Objects): `{ type: 'circle', radius: 24 }` or PhysicsEditor data

### Velocity, Forces, and Thrust

```js
sprite.setVelocity(3, -5);          // units per step, not pixels/sec
sprite.setVelocityX(-3);
sprite.setAngularVelocity(0.05);
const vel = sprite.getVelocity();   // { x, y }

// Forces use very small values (0.01 - 0.1)
sprite.applyForce({ x: 0.05, y: 0 });
sprite.applyForceFrom(position, { x: 0.02, y: -0.02 });

// Directional thrust relative to body angle
sprite.thrust(0.05);       // forward
sprite.thrustBack(0.05);   // backward
sprite.thrustLeft(0.03);   // strafe left
sprite.thrustRight(0.03);  // strafe right

// Batch operations via this.matter
this.matter.setVelocity(arrayOfBodies, 2, -3);
this.matter.applyForce(arrayOfBodies, { x: 0.01, y: 0 });
```

### Constraints (Joints and Springs)

```js
// constraint(bodyA, bodyB, length?, stiffness?, options?) -- aliases: joint, spring
const rigid = this.matter.add.constraint(bodyA, bodyB, 100, 1);        // rigid joint
const spring = this.matter.add.constraint(bodyA, bodyB, 200, 0.02, { damping: 0.05 });
const pin = this.matter.add.constraint(bodyA, bodyB, 0, 0.9);          // pin joint

// World constraint (one body pinned to world point)
this.matter.add.worldConstraint(body, 50, 0.5, { pointA: { x: 400, y: 100 } });

// Offset attachment points
this.matter.add.constraint(bodyA, bodyB, 80, 1, {
    pointA: { x: 20, y: 0 },   // offset from bodyA center
    pointB: { x: -20, y: 0 }   // offset from bodyB center
});

this.matter.getConstraintLength(constraint);      // distance between anchor points
this.matter.world.removeConstraint(constraint);   // remove from world
```

### Composites (Stacks, Chains, Soft Bodies)

```js
// Stack of bodies in a grid
const stack = this.matter.add.stack(100, 100, 5, 4, 10, 10, (x, y) => {
    return this.matter.bodies.rectangle(x, y, 40, 40);
});

// Image stack (grid of Matter Images)
const imageStack = this.matter.add.imageStack('crate', null, 100, 100, 5, 4, 5, 5);

// Chain bodies in a composite together
this.matter.add.chain(stack, 0.5, 0, -0.5, 0, { stiffness: 0.7 });

// Mesh (grid with constraints, optional cross braces)
this.matter.add.mesh(stack, 5, 4, true, { stiffness: 0.5 });

// Soft body (cols, rows, gaps, crossBrace, particleRadius, bodyOpts, constraintOpts)
this.matter.add.softBody(200, 100, 5, 5, 0, 0, true, 10, { friction: 0.1 }, { stiffness: 0.5 });

// Pre-built composites: newtonsCradle, car, pyramid
this.matter.add.newtonsCradle(300, 50, 5, 20, 200);
this.matter.add.car(400, 300, 120, 30, 25);
```

### Compound Bodies

Combine multiple shapes into a single body. The first part is the parent.

```js
const partA = this.matter.bodies.rectangle(0, 0, 60, 20);
const partB = this.matter.bodies.circle(0, -30, 15);
const compoundBody = this.matter.body.create({ parts: [partA, partB] });

// Attach to a Game Object
const player = this.matter.add.sprite(400, 200, 'hero');
player.setExistingBody(compoundBody);
```

Parts share position, angle, and velocity. Constraints must target the parent body, not parts.

### Sleep System

Bodies at rest can sleep to skip simulation. Requires `enableSleeping: true` in config.

```js
if (body.isSleeping) { /* body is at rest */ }
sprite.setSleepThreshold(30);      // lower = falls asleep faster (default 60)
sprite.setToSleep();               // force sleep
sprite.setAwake();                 // force wake
sprite.setSleepEvents(true, true); // enable sleepstart/sleepend events

this.matter.world.on('sleepstart', (event, body) => { /* body slept */ });
this.matter.world.on('sleepend', (event, body) => { /* body woke */ });
```

### Sensors

Sensors detect collisions but do not physically react. Useful for trigger zones, pickups, detection areas.

```js
const trigger = this.matter.add.rectangle(400, 300, 100, 100, { isSensor: true, isStatic: true });
sprite.setSensor(true);    // toggle on Game Object
sprite.isSensor();         // check state

// Sensors fire normal collision events -- use collisionstart/end to detect entry/exit
```

### Collision Categories and Filtering

Matter uses bitmasks: `category` (which group this body belongs to, power of 2), `mask` (which categories it collides with), and `group` (shortcut: same positive = always collide, same negative = never collide, 0 = use category/mask).

```js
const PLAYER = this.matter.world.nextCategory();  // 0x0002 (32 max)
const ENEMY = this.matter.world.nextCategory();    // 0x0004
const GROUND = this.matter.world.nextCategory();   // 0x0008

player.setCollisionCategory(PLAYER);
player.setCollidesWith([ENEMY, GROUND]);

bullet.setCollisionCategory(0x0010);
bullet.setCollidesWith([ENEMY, GROUND]);  // bullets skip player

// Collision groups: same negative = never collide with each other
const noCollide = this.matter.world.nextGroup(true);
spriteA.setCollisionGroup(noCollide);
spriteB.setCollisionGroup(noCollide);

// Via body config: collisionFilter: { category, mask, group }
// Batch: this.matter.setCollisionCategory([bodyA, bodyB], ENEMY);
```

### Collision Callbacks

```js
// Per-body callbacks (on Matter Game Objects)
player.setOnCollide((pair) => { /* pair.bodyA, pair.bodyB */ });
player.setOnCollideEnd((pair) => { /* collision ended */ });
player.setOnCollideActive((pair) => { /* still colliding */ });
player.setOnCollideWith(enemy, (body, pair) => { /* hit specific body */ });

// Game Object-level events (emitted on the Game Object itself)
player.on('collide', (bodyA, bodyB, pair) => {});
player.on('collideEnd', (bodyA, bodyB, pair) => {});
```

### Tilemap Integration

```js
const map = this.make.tilemap({ key: 'level' });
const tileset = map.addTilesetImage('tiles', 'tiles-img');
const layer = map.createLayer('Ground', tileset, 0, 0);

layer.setCollisionByProperty({ collides: true });  // MUST set collision first
this.matter.world.convertTilemapLayer(layer);       // creates MatterTileBody per colliding tile

// Uses Tiled collision shapes (rect, circle, polygon) if defined, otherwise tile bounds.
// Access: tile.physics.matterBody
// Individual tile: this.matter.add.tileBody(tile, { isStatic: true, friction: 0.5 });
// After map changes: this.matter.world.convertTiles([tile1, tile2]);
```

### Friction Types

Matter.js has three independent friction values:

```js
sprite.setFriction(0.1);          // dynamic: resistance during motion (0-1)
sprite.setFrictionStatic(0.5);    // static: resistance before motion starts
sprite.setFrictionAir(0.05);      // air: environmental drag (default 0.01)
sprite.setFriction(0.1, 0.02, 0.3);  // set all three: dynamic, air, static
```

### Complex Shapes from Vertices

```js
// Create body from vertex string (concave shapes auto-decomposed)
const body = this.matter.add.fromVertices(400, 300, '0 0 40 0 40 40 20 60 0 40');

// Multiple vertex sets for complex shapes
const vertexSets = [
    [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 40, y: 40 }],
    [{ x: 40, y: 40 }, { x: 20, y: 60 }, { x: 0, y: 40 }]
];
this.matter.add.fromVertices(300, 200, vertexSets);
```

### Pointer Constraint (Mouse/Touch Dragging)

```js
// Enable click-and-drag on all Matter bodies
const pc = this.matter.add.mouseSpring({ stiffness: 0.2, damping: 0.1 });

pc.active = false;           // disable temporarily
body.ignorePointer = true;   // prevent specific body from being dragged
pc.stopDrag();               // release current drag programmatically
pc.destroy();                // remove entirely

// Drag events on the world
this.matter.world.on('dragstart', (body, part, constraint) => {});
this.matter.world.on('drag', (body, constraint) => {});
this.matter.world.on('dragend', (body, constraint) => {});
```

### Queries (Raycasting and Hit Testing)

```js
const hits = this.matter.intersectPoint(pointer.x, pointer.y);   // bodies at point
const contains = this.matter.containsPoint(body, x, y);           // point-in-body test
const inRegion = this.matter.intersectRect(100, 100, 200, 200);   // bodies in rect
const rayHits = this.matter.intersectRay(0, 300, 800, 300, 1);    // raycast
const colliding = this.matter.intersectBody(playerBody);           // body overlap

// Overlap with callbacks
this.matter.overlap(playerBody, enemyBodies, (bodyA, bodyB, info) => {
    console.log('Overlapping', bodyA, bodyB);
});
```

### Debug Rendering

```js
// Enable debug with specific options (pass as debug property in matter config)
// Boolean flags: showBody, showStaticBody, showVelocity, showCollisions, showSensors,
//   showJoint, showPositions, showBounds, showAxes, showAngleIndicator, showSleeping,
//   showConvexHulls, showInternalEdges, renderFill, renderLine
// Color/style: lineColor, lineThickness, fillColor, staticLineColor, staticFillColor,
//   sensorLineColor, jointColor, pinColor, springColor, anchorColor, positionColor

// Toggle debug at runtime
this.matter.world.drawDebug = false;
this.matter.world.debugGraphic.visible = false;

// Set render style on individual body or constraint
this.matter.world.setBodyRenderStyle(body, 0xff0000, 1, 2, 0x00ff00, 0.5);
this.matter.world.setConstraintRenderStyle(constraint, 0xffff00, 1, 2);
```

## Events

All events are emitted on `this.matter.world` (which extends `EventEmitter`):

| Event | Callback Signature | When |
|---|---|---|
| `'collisionstart'` | `(event, bodyA, bodyB)` | Two bodies first start colliding |
| `'collisionactive'` | `(event, bodyA, bodyB)` | Two bodies are still colliding |
| `'collisionend'` | `(event, bodyA, bodyB)` | Two bodies stop colliding |
| `'beforeupdate'` | `(event)` | Before engine update step |
| `'afterupdate'` | `(event)` | After engine update step |
| `'beforeadd'` | `(event)` | Before a body/constraint is added |
| `'afteradd'` | `(event)` | After a body/constraint is added |
| `'beforeremove'` | `(event)` | Before a body/constraint is removed |
| `'afterremove'` | `(event)` | After a body/constraint is removed |
| `'dragstart'` | `(body, part, constraint)` | Pointer starts dragging body |
| `'drag'` | `(body, constraint)` | Pointer is dragging body |
| `'dragend'` | `(body, constraint)` | Pointer stops dragging body |
| `'sleepstart'` | `(event, body)` | Body goes to sleep (requires `setSleepEvents`) |
| `'sleepend'` | `(event, body)` | Body wakes up (requires `setSleepEvents`) |
| `'pause'` | none | World paused |
| `'resume'` | none | World resumed |

Collision events include `event.pairs` -- an array of collision pair objects with `bodyA`, `bodyB`, collision depth, and normal.

## API Quick Reference

### `this.matter.add` (Factory)

**Game Objects:** `sprite(x, y, key, frame?, opts?)`, `image(x, y, key, frame?, opts?)`, `gameObject(go, opts?)`, `tileBody(tile, opts?)`
**Body shapes:** `rectangle(x, y, w, h, opts?)`, `circle(x, y, r, opts?)`, `polygon(x, y, sides, r, opts?)`, `trapezoid(x, y, w, h, slope, opts?)`, `fromVertices(x, y, verts, opts?)`, `fromPhysicsEditor(x, y, config, opts?)`, `fromSVG(x, y, xml, scale?, opts?)`, `fromJSON(x, y, config, opts?)`
**Constraints:** `constraint(a, b, len?, stiff?, opts?)` (aliases: `joint`, `spring`), `worldConstraint(body, len?, stiff?, opts?)`, `mouseSpring(opts?)` (alias: `pointerConstraint`)
**Composites:** `stack(x, y, cols, rows, colGap, rowGap, cb)`, `imageStack(key, frame, x, y, cols, rows)`, `pyramid(...)`, `chain(composite, xA, yA, xB, yB, opts?)`, `mesh(composite, cols, rows, cross, opts?)`, `softBody(...)`, `car(x, y, w, h, wheelSize)`, `newtonsCradle(x, y, num, size, len)`

### `this.matter` (MatterPhysics) -- batch and utility

`pause()`, `resume()`, `set60Hz()`, `set30Hz()`, `step(delta?)`, `setVelocity(bodies, x, y)`, `setAngularVelocity(bodies, v)`, `applyForce(bodies, force)`, `applyForceFromAngle(bodies, speed, angle?)`, `containsPoint(body, x, y)`, `intersectPoint(x, y)`, `intersectRect(x, y, w, h, outside?)`, `intersectRay(x1, y1, x2, y2, width?)`, `intersectBody(body)`, `overlap(target, bodies?, cb?)`, `setCollisionCategory(bodies, value)`, `setCollisionGroup(bodies, value)`, `setCollidesWith(bodies, cats)`, `alignBody(body, x, y, align)`

### `this.matter.world` (World)

`setBounds(x?, y?, w?, h?, thickness?, l?, r?, t?, b?)`, `setGravity(x?, y?, scale?)`, `disableGravity()`, `add(object)`, `remove(object, deep?)`, `removeConstraint(constraint)`, `convertTilemapLayer(layer, opts?)`, `convertTiles(tiles, opts?)`, `nextCategory()`, `nextGroup(isNonColliding?)`, `getAllBodies()`, `has(body)`, `pause()`, `resume()`

### Direct Matter.js module references on `this.matter`

`body` (Matter.Body), `bodies` (Matter.Bodies), `composite` (Matter.Composite), `composites` (Matter.Composites), `constraint` (Matter.Constraint), `detector`, `query`, `pair`, `pairs`, `resolver`, `axes`, `bounds`, `svg`, `vector`, `vertices`

## Gotchas

- **Force values are tiny.** Use `0.01`-`0.1` for forces, `1`-`15` for velocity. Not pixel-based.
- **`setBody`/`setRectangle`/etc. resets all properties** -- mass, friction, collision filters, callbacks are wiped. Re-apply after changing shape.
- **Constraints must target parent body**, not compound body `parts`.
- **32 collision categories max.** Each `nextCategory()` uses one bit.
- **`collisionFilter.group` overrides category/mask.** Same positive = always collide; same negative = never collide; zero/different = use category/mask.
- **Sensors still need matching collision filters** to fire events.
- **Matter position is center of mass**, not top-left (unlike Arcade Physics).
- **Sleep events require opt-in:** `sprite.setSleepEvents(true, true)`.
- **Tilemap conversion requires collision set first** via `setCollisionByProperty` etc.
- **Restitution uses `Math.max(bodyA.restitution, bodyB.restitution)`** -- the bouncier value wins.
- **`body.ignorePointer = true`** prevents pointer constraint from dragging that body.

## Source File Map

| Path | Purpose |
|---|---|
| `src/physics/matter-js/MatterPhysics.js` | Scene plugin (`this.matter`), exposes all Matter modules |
| `src/physics/matter-js/World.js` | World management, engine, bounds, debug, events proxy |
| `src/physics/matter-js/Factory.js` | `this.matter.add` -- all creation methods |
| `src/physics/matter-js/MatterSprite.js` | Physics sprite (Sprite + Matter components) |
| `src/physics/matter-js/MatterImage.js` | Physics image (Image + Matter components) |
| `src/physics/matter-js/MatterGameObject.js` | Injects Matter components into any Game Object |
| `src/physics/matter-js/MatterTileBody.js` | Wraps a Tile with a Matter body |
| `src/physics/matter-js/PointerConstraint.js` | Click-and-drag body constraint |
| `src/physics/matter-js/BodyBounds.js` | Body alignment by visual bounds |
| `src/physics/matter-js/PhysicsEditorParser.js` | Parses PhysicsEditor JSON into bodies |
| `src/physics/matter-js/components/` | Mixins: Velocity, Force, Collision, SetBody, Sensor, Bounce, Friction, Mass, Gravity, Static, Sleep, Transform |
| `src/physics/matter-js/events/` | Event constants (COLLISION_START, DRAG_START, SLEEP_START, etc.) |
| `src/physics/matter-js/typedefs/` | TypeDefs: MatterWorldConfig, MatterBodyConfig, MatterCollisionFilter, MatterConstraintConfig, etc. |
| `src/physics/matter-js/lib/` | Bundled Matter.js library modules |
