---
name: physics-arcade
description: "Use this skill when using Arcade Physics in Phaser 4. Covers enabling physics, velocity, acceleration, gravity, collisions, overlap, world bounds, physics groups, static bodies, and collision categories. Triggers on: physics, arcade, velocity, gravity, collide, overlap, bounce, physics body."
---

# Arcade Physics
> Setting up and using Arcade Physics in Phaser 4 -- enabling physics in GameConfig, creating physics-enabled sprites/images/groups, velocity, acceleration, gravity, collisions (collide/overlap), world bounds, body properties, and collision categories.

**Key source paths:** `src/physics/arcade/ArcadePhysics.js`, `src/physics/arcade/World.js`, `src/physics/arcade/Body.js`, `src/physics/arcade/StaticBody.js`, `src/physics/arcade/Factory.js`, `src/physics/arcade/components/`, `src/physics/arcade/events/`
**Related skills:** ../game-setup-and-config/SKILL.md, ../sprites-and-images/SKILL.md, ../tilemaps/SKILL.md, ../groups-and-containers/SKILL.md

## Quick Start

```js
class GameScene extends Phaser.Scene {
    create() {
        // Physics sprite (dynamic body, affected by gravity)
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // Static group (immovable platforms)
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // Register a persistent collider (checked every frame automatically)
        this.physics.add.collider(this.player, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }
    }
}

// Enable Arcade Physics in game config
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: GameScene
};

const game = new Phaser.Game(config);
```

## Core Concepts

### World (`this.physics.world`)

The `Phaser.Physics.Arcade.World` manages all bodies in the simulation. Accessed via `this.physics.world` in a Scene.

- **gravity** -- `Vector2` applied to all dynamic bodies each step. Set via config or `this.physics.world.gravity.y = 300`.
- **bounds** -- `Rectangle` defining the world boundary. Defaults to game canvas size.
- **bodies** -- `Set` of all dynamic `Body` instances.
- **staticBodies** -- `Set` of all `StaticBody` instances.
- **colliders** -- `ProcessQueue` of registered `Collider` objects (from `this.physics.add.collider` / `this.physics.add.overlap`).
- **fps** -- Physics steps per second (default 60). Read-only; change via `world.setFPS(120)`.
- **fixedStep** -- `true` (default) uses fixed timestep; `false` syncs to render fps.
- **timeScale** -- Scaling factor: 1.0 = normal, 2.0 = half speed, 0.5 = double speed.
- **isPaused** -- When true, no bodies update and no colliders run. Toggle via `world.pause()` / `world.resume()`.
- **useTree** -- `true` (default) uses RTree spatial index for dynamic bodies. Disable for 5000+ bodies.
- **drawDebug** -- Enables debug rendering when `true`. Set via config `debug: true`.

### Bodies (`Body`)

A dynamic body is created automatically when you use `this.physics.add.sprite()` or `this.physics.add.image()`. Access it via `gameObject.body`.

Key properties (all on `Body`):
- **velocity** -- `Vector2`, pixels/sec
- **acceleration** -- `Vector2`, pixels/sec^2
- **drag** -- `Vector2`, deceleration (applied only when acceleration is zero)
- **gravity** -- `Vector2`, per-body gravity added to world gravity
- **bounce** -- `Vector2`, rebound factor relative to 1
- **friction** -- `Vector2`, default `(1, 0)` -- velocity imparted by immovable body to riding body
- **maxVelocity** -- `Vector2`, default `(10000, 10000)` | **maxSpeed** -- scalar cap, default `-1` (none)
- **mass** -- default `1`, affects collision momentum exchange
- **immovable** -- `false`; if `true`, never moved by collisions
- **pushable** -- `true`; if `false`, reflects velocity to colliding body
- **moves** -- `true`; if `false`, position/rotation not updated by physics
- **enable** -- `true`; `false` removes from simulation
- **useDamping** -- `false`; when `true`, drag is a multiplier (0-1) instead of linear
- **collideWorldBounds** -- `false`; **onWorldBounds/onCollide/onOverlap** -- `false`, set `true` to emit events

Shape: **isCircle** (set via `setCircle`), **width/height**, **offset** (`Vector2`), **center** (read-only midpoint).

Collision state (read-only, reset each step): **touching** / **blocked** / **wasTouching** -- `{ none, up, down, left, right }`. **embedded** -- both overlapping with zero velocity.

Angular: **angularVelocity** (deg/sec), **angularAcceleration**, **angularDrag**, **maxAngular** (default 1000), **allowRotation** (default true).

### Static Bodies (`StaticBody`)

A static body never moves and is not affected by gravity or velocity. It uses an optimized RTree for fast spatial lookups.

- Created via `this.physics.add.staticSprite()`, `this.physics.add.staticImage()`, or `this.physics.add.staticGroup()`.
- After changing the parent Game Object's position or scale, call `body.reset()` or `gameObject.refreshBody()` to sync.
- Has `collisionCategory` and `collisionMask` like dynamic bodies.
- Does not have velocity, acceleration, drag, or gravity properties.

## Common Patterns

### Enabling Physics on Existing Game Objects

```js
// Add a physics body to any existing Game Object
this.physics.add.existing(mySprite);           // dynamic body
this.physics.add.existing(mySprite, true);     // static body

// Or enable via the world directly
this.physics.world.enable(mySprite);           // dynamic
this.physics.world.enable(mySprite, Phaser.Physics.Arcade.STATIC_BODY);
```

### Creating Physics Sprites and Images

```js
// Via the physics factory (this.physics.add)
const player = this.physics.add.sprite(100, 200, 'player');     // dynamic body
const coin = this.physics.add.image(300, 100, 'coin');          // dynamic body
const wall = this.physics.add.staticImage(400, 300, 'wall');    // static body
const platform = this.physics.add.staticSprite(400, 500, 'plat'); // static body

// Standalone bodies (no Game Object)
const sensor = this.physics.add.body(200, 200, 32, 32);        // dynamic Body
const zone = this.physics.add.staticBody(100, 100, 64, 64);    // static Body
```

### Velocity and Gravity

```js
// Direct velocity
player.setVelocity(200, -300);          // x=200 px/s, y=-300 px/s (upward)
player.setVelocityX(200);
player.body.velocity.set(200, -300);    // equivalent via Vector2

// Acceleration + max velocity
player.setAcceleration(100, 0);
player.setMaxVelocity(300, 600);

// Per-body gravity (added to world gravity)
player.body.gravity.y = 200;
player.body.allowGravity = false;       // exempt from world gravity

// Drag (applied only when acceleration is zero)
player.setDrag(300);                    // linear deceleration
player.body.useDamping = true;
player.setDrag(0.05);                   // damping mode: keeps 5% velocity/sec

// Bounce
player.setBounce(0.5);                  // both axes
player.setBounceY(1);                   // full vertical bounce
```

### Collide and Overlap

Two approaches: **persistent Colliders** (checked every frame automatically) or **one-shot checks** (called in `update()`).

```js
// --- Persistent Colliders (preferred) ---
// Created via this.physics.add.collider / this.physics.add.overlap
// Automatically checked every physics step

const collider = this.physics.add.collider(player, platforms);
const overlap = this.physics.add.overlap(player, coins, collectCoin, null, this);

function collectCoin (player, coin) {
    coin.disableBody(true, true); // disable physics and hide
}

// Collider management
collider.active = false;   // temporarily disable
collider.destroy();        // remove permanently

// With processCallback (must return boolean to allow collision)
this.physics.add.collider(player, enemies, onHit, canCollide, this);
function canCollide (player, enemy) {
    return !player.getData('invincible');
}

// --- One-shot checks (in update) ---
// Called manually each frame; no Collider object created

this.physics.collide(player, platforms);
this.physics.overlap(player, coins, collectCoin, null, this);

// Self-collision within a single group
this.physics.add.collider(enemies, enemies);
```

### Groups

```js
// Dynamic physics group -- members get dynamic bodies automatically
const bullets = this.physics.add.group({
    classType: Phaser.Physics.Arcade.Sprite,  // default: ArcadeSprite
    maxSize: 20,
    collideWorldBounds: true,
    bounceX: 1,
    bounceY: 1,
    velocityX: 200,
    velocityY: 0,
    allowGravity: false,
    immovable: false
});

// Static physics group -- members get static bodies
const platforms = this.physics.add.staticGroup();
platforms.create(400, 568, 'ground');
platforms.create(600, 400, 'ground');

// After modifying a static group member's transform, refresh:
platforms.create(400, 568, 'ground').setScale(2).refreshBody();

// Group velocity helpers
bullets.setVelocity(200, 0);       // all members
bullets.setVelocityX(200);
bullets.setVelocityY(0, 10);       // with step increment per member
```

PhysicsGroup config keys (applied as defaults to new members): `collideWorldBounds`, `bounceX/Y`, `accelerationX/Y`, `dragX/Y`, `gravityX/Y`, `frictionX/Y`, `velocityX/Y`, `angularVelocity`, `angularAcceleration`, `angularDrag`, `maxVelocityX/Y`, `maxSpeed`, `mass`, `immovable`, `allowDrag`, `allowGravity`, `allowRotation`, `useDamping`, `enable`.

### World Bounds

```js
// Set bounds size and which edges collide (left, right, up, down)
this.physics.world.setBounds(0, 0, 1600, 1200, true, true, false, true);
this.physics.world.setBoundsCollision(true, true, false, true); // edges only

// Per-body world bounds
player.setCollideWorldBounds(true);
player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(100, 100, 600, 400));
player.body.worldBounce = new Phaser.Math.Vector2(0.5, 0.5);

// Detect world bounds hit via event (requires opt-in)
player.body.onWorldBounds = true;
this.physics.world.on('worldbounds', (body, up, down, left, right) => {
    console.log('Hit edge:', { up, down, left, right });
});
```

### Body Properties

```js
// Size and shape
player.body.setSize(24, 32, true);     // width, height, re-center on GO
player.body.setOffset(4, 0);           // offset from GO position
player.body.setCircle(16);             // circular body, radius 16
player.body.setCircle(16, 4, 4);       // circular with offset

// Collision behavior
player.body.setImmovable(true);        // not moved by collisions
player.body.setPushable(false);        // reflects velocity to collider
player.body.slideFactor.set(0, 0);     // Sokoban-style: stops after push
player.body.setMass(2);               // affects momentum exchange

// Enable / disable
player.disableBody(true, true);        // disable body + hide Game Object
player.enableBody(true, x, y, true, true); // re-enable at position + show

// Per-direction collision check
player.body.checkCollision.up = false; // don't collide from above
player.body.syncBounds = true;         // auto-sync size to texture
```

### Collision Categories

Collision categories let you filter which bodies can collide with each other using bitmask values. Maximum 32 categories.

```js
// Get unique category values from the physics plugin
const CAT_PLAYER = this.physics.nextCategory();   // 0x0002
const CAT_ENEMY  = this.physics.nextCategory();   // 0x0004
const CAT_BULLET = this.physics.nextCategory();   // 0x0008

// Assign categories to bodies or groups
player.setCollisionCategory(CAT_PLAYER);
enemy.setCollisionCategory(CAT_ENEMY);
bullet.setCollisionCategory(CAT_BULLET);

// Set what each body collides with
player.setCollidesWith([CAT_ENEMY]);              // player hits enemies only
enemy.setCollidesWith([CAT_PLAYER, CAT_BULLET]);  // enemies hit player + bullets
bullet.setCollidesWith([CAT_ENEMY]);              // bullets hit enemies only

// Add/remove individual categories from existing mask
player.addCollidesWith(CAT_BULLET);
player.removeCollidesWith(CAT_ENEMY);

// Check if a body will collide with a category
player.willCollideWith(CAT_ENEMY); // returns boolean

// Reset to default (collides with everything)
player.resetCollisionCategory();

// Works on Groups too
enemies.setCollisionCategory(CAT_ENEMY);
enemies.setCollidesWith([CAT_PLAYER, CAT_BULLET]);
```

Default: all bodies have category `0x0001` and collisionMask `1`. Everything still collides with everything because `(1 & 1) !== 0`. PhysicsGroup defaults to mask `2147483647` (all bits). Call `resetCollisionCategory()` to set the mask to all bits after changing categories.

## Configuration Reference

`ArcadeWorldConfig` -- passed via `physics.arcade` in GameConfig or SceneConfig:

| Property | Default | Description |
|---|---|---|
| `fps` | `60` | Physics steps per second |
| `fixedStep` | `true` | Use fixed timestep vs render sync |
| `timeScale` | `1` | Simulation speed multiplier |
| `gravity` | `{ x: 0, y: 0 }` | World gravity in px/sec |
| `x`, `y` | `0` | World bounds origin |
| `width`, `height` | game size | World bounds dimensions |
| `checkCollision` | all `true` | `{ up, down, left, right }` edge collision |
| `overlapBias` | `4` | Overlap threshold for separation |
| `tileBias` | `16` | Tile overlap threshold |
| `forceX` | `false` | Separate horizontally first |
| `isPaused` | `false` | Start simulation paused |
| `debug` | `false` | Enable debug rendering |
| `debugShowBody` / `debugShowStaticBody` / `debugShowVelocity` | `true` | Debug display toggles |
| `debugBodyColor` / `debugStaticBodyColor` / `debugVelocityColor` | `0xff00ff` / `0x0000ff` / `0x00ff00` | Debug colors |
| `maxEntries` | `16` | RTree items per node |
| `useTree` | `true` | Use RTree for dynamic bodies |
| `customUpdate` | `false` | If true, call `world.update()` yourself |

Scene-level config overrides game-level config (merged).

## Events

All events are emitted on `this.physics.world`:

| Event | String | Condition | Callback Args |
|---|---|---|---|
| `COLLIDE` | `'collide'` | Two bodies collide and at least one has `onCollide = true` | `(gameObject1, gameObject2, body1, body2)` |
| `OVERLAP` | `'overlap'` | Two bodies overlap and at least one has `onOverlap = true` | `(gameObject1, gameObject2, body1, body2)` |
| `WORLD_BOUNDS` | `'worldbounds'` | Body hits world edge and has `onWorldBounds = true` | `(body, up, down, left, right)` |
| `TILE_COLLIDE` | `'tilecollide'` | Body collides with a tile | `(gameObject, tile, body)` |
| `TILE_OVERLAP` | `'tileoverlap'` | Body overlaps a tile | `(gameObject, tile, body)` |
| `WORLD_STEP` | `'worldstep'` | After each physics step | `(delta)` |
| `PAUSE` | `'pause'` | World paused | none |
| `RESUME` | `'resume'` | World resumed | none |

Events require opt-in per body: set `body.onCollide`, `body.onOverlap`, or `body.onWorldBounds` to `true`.

## API Quick Reference

### Scene Plugin (`this.physics`)

| Method | Description |
|---|---|
| `this.physics.add.sprite(x, y, key, frame)` | Create sprite with dynamic body |
| `this.physics.add.image(x, y, key, frame)` | Create image with dynamic body |
| `this.physics.add.staticSprite(x, y, key, frame)` | Sprite with static body |
| `this.physics.add.staticImage(x, y, key, frame)` | Image with static body |
| `this.physics.add.group(config)` | Dynamic physics group |
| `this.physics.add.staticGroup(config)` | Static physics group |
| `this.physics.add.existing(go, isStatic?)` | Add body to existing Game Object |
| `this.physics.add.body(x, y, w?, h?)` | Standalone dynamic Body (no GO) |
| `this.physics.add.staticBody(x, y, w?, h?)` | Standalone static Body (no GO) |
| `this.physics.add.collider(a, b, cb?, proc?, ctx?)` | Persistent collider |
| `this.physics.add.overlap(a, b, cb?, proc?, ctx?)` | Persistent overlap |
| `this.physics.collide(a, b, cb?, proc?, ctx?)` | One-shot collision check |
| `this.physics.overlap(a, b, cb?, proc?, ctx?)` | One-shot overlap check |
| `this.physics.nextCategory()` | Next collision category bitmask |
| `this.physics.pause()` / `resume()` | Pause/resume simulation |
| `this.physics.accelerateTo(go, x, y, spd?, maxX?, maxY?)` | Accelerate toward point |
| `this.physics.moveTo(go, x, y, spd?, maxTime?)` | Move toward point at speed |
| `this.physics.velocityFromAngle(angle, speed?, vec2?)` | Angle (deg) to velocity |
| `this.physics.velocityFromRotation(rot, speed?, vec2?)` | Rotation (rad) to velocity |
| `this.physics.closest(source, targets?)` | Find nearest body |
| `this.physics.furthest(source, targets?)` | Find farthest body |
| `this.physics.overlapRect(x, y, w, h, dyn?, static?)` | Query bodies in rectangle |
| `this.physics.overlapCirc(x, y, r, dyn?, static?)` | Query bodies in circle |

Also: `accelerateToObject`, `moveToObject`, `collideTiles`, `overlapTiles`, `enableUpdate`, `disableUpdate`.

### World (`this.physics.world`)

| Method | Description |
|---|---|
| `setBounds(x, y, w, h, left?, right?, up?, down?)` | Set boundary + edge checks |
| `setBoundsCollision(left?, right?, up?, down?)` | Set which edges collide |
| `setFPS(framerate)` | Change physics step rate |
| `enable(object, bodyType?)` | Enable physics on object/group/array |
| `disable(object)` | Disable physics on object/group/array |
| `add(body)` / `remove(body)` | Add/remove Body from simulation |
| `addCollider` / `addOverlap` | Create Collider (same args as factory) |
| `removeCollider(collider)` | Remove Collider |
| `pause()` / `resume()` | Pause/resume simulation |
| `createDebugGraphic()` | Create debug rendering graphic |

### Body Methods

| Method | Description |
|---|---|
| `setVelocity(x, y)` / `setVelocityX` / `setVelocityY` | Set velocity |
| `setAcceleration(x, y)` / `setAccelerationX` / `Y` | Set acceleration |
| `setMaxVelocity(x, y)` / `setMaxSpeed(speed)` | Velocity caps |
| `setBounce(x, y)` / `setDrag(x, y)` | Bounce and drag |
| `setDamping(bool)` | Enable damping mode |
| `setFriction(x, y)` / `setGravity(x, y)` | Friction and per-body gravity |
| `setMass(val)` / `setImmovable(bool)` / `setPushable(bool)` | Mass and collision behavior |
| `setSize(w, h, center?)` / `setOffset(x, y)` | Resize/offset body |
| `setCircle(radius, offX?, offY?)` | Switch to circular body |
| `setCollideWorldBounds(val, bX?, bY?)` | World bounds collision |
| `setBoundsRectangle(rect)` | Custom bounds rectangle |
| `setAllowGravity` / `setAllowDrag` / `setAllowRotation` | Toggle physics features |
| `setEnable(val)` | Enable/disable body |
| `setCollisionCategory` / `setCollidesWith` / `addCollidesWith` / `removeCollidesWith` | Category filtering |
| `resetCollisionCategory()` | Reset to default (all) |
| `reset(x, y)` / `stop()` | Reset position or zero velocity |

## Gotchas

1. **`debug: true` in production** -- Debug rendering is expensive. Always disable for release builds.

2. **Static body transform changes** -- After changing position, scale, or origin of a static body's Game Object, you must call `body.reset()` or `gameObject.refreshBody()`. Static bodies do not auto-sync.

3. **`collide` vs `overlap`** -- `collide` performs separation (pushes bodies apart). `overlap` only detects intersection without moving anything. Use `overlap` for triggers like pickups.

4. **Persistent Collider vs one-shot** -- `this.physics.add.collider()` creates a Collider checked every frame automatically. `this.physics.collide()` is a one-shot check that must be called each frame in `update()`. Prefer persistent Colliders.

5. **Events require opt-in** -- World events (`'collide'`, `'overlap'`, `'worldbounds'`) only fire if the relevant body property (`onCollide`, `onOverlap`, `onWorldBounds`) is set to `true`.

6. **Collision categories default** -- By default all bodies have category `0x0001` and mask `1` (PhysicsGroup defaults to mask `2147483647`). Call `this.physics.nextCategory()` to get new category values; max 32 categories total. After changing categories, use `resetCollisionCategory()` to set the mask to all bits.

7. **Group defaults only apply at creation** -- PhysicsGroup `defaults` (like `velocityX`, `bounceY`) are applied when a member is added/created. Changing `defaults` later does not retroactively update existing members.

8. **`customUpdate` config** -- Setting `customUpdate: true` in the arcade config stops the world from auto-updating on the Scene UPDATE event. You must call `this.physics.world.update(time, delta)` manually.

9. **`useDamping` drag values** -- When `useDamping` is `true`, drag values should be small (e.g., `0.05`) as they act as a multiplier. A value of `0.05` means the body keeps 5% of its velocity per second.

10. **Immovable vs pushable** -- `immovable = true` means the body is never moved by collisions at all. `pushable = false` means the body reflects velocity back to the colliding body but can still be separated.

11. **Overlap with TilemapLayer** -- When using `overlapOnly` with a TilemapLayer, every tile is checked regardless of collision settings on individual tiles.

12. **RTree threshold** -- The RTree spatial index (enabled by default) becomes expensive to rebuild with very large numbers of dynamic bodies. Consider setting `useTree: false` for 5000+ dynamic bodies.

## Source File Map

| File | Purpose |
|---|---|
| `src/physics/arcade/ArcadePhysics.js` | Scene plugin (`this.physics`) -- collide, overlap, moveTo, accelerateTo, nextCategory |
| `src/physics/arcade/World.js` | Physics world -- bodies, gravity, bounds, colliders, step loop, setBounds, addCollider |
| `src/physics/arcade/Body.js` | Dynamic body -- velocity, acceleration, bounce, drag, gravity, mass, immovable, pushable |
| `src/physics/arcade/StaticBody.js` | Static body -- immovable, no velocity, optimized RTree lookup |
| `src/physics/arcade/Factory.js` | `this.physics.add` -- sprite, image, group, staticGroup, body, existing, collider, overlap |
| `src/physics/arcade/Collider.js` | Collider object -- persistent collision/overlap check with callbacks |
| `src/physics/arcade/PhysicsGroup.js` | Dynamic physics group with per-member defaults |
| `src/physics/arcade/StaticPhysicsGroup.js` | Static physics group with auto-refresh |
| `src/physics/arcade/components/index.js` | Body component mixins -- Acceleration, Angular, Bounce, Collision, Debug, Drag, Enable, Friction, Gravity, Immovable, Mass, Pushable, Size, Velocity |
| `src/physics/arcade/components/Collision.js` | Collision category/mask methods -- setCollisionCategory, setCollidesWith, addCollidesWith, removeCollidesWith |
| `src/physics/arcade/events/` | Event constants -- COLLIDE, OVERLAP, WORLD_BOUNDS, TILE_COLLIDE, TILE_OVERLAP, WORLD_STEP, PAUSE, RESUME |
| `src/physics/arcade/typedefs/ArcadeWorldConfig.js` | TypeDef for arcade physics config options |
