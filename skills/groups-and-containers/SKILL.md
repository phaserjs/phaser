---
name: groups-and-containers
description: "Use this skill when using Groups or Containers in Phaser 4. Covers organizing game objects, object pooling, batch operations, and nested transforms with Containers. Triggers on: Group, Container, object pool, getFirstDead, children."
---

# Groups and Containers
> Logical grouping (Group), visual grouping with transform inheritance (Container), render-layer grouping (Layer), object pooling, and when to use each in Phaser 4.

**Key source paths:** `src/gameobjects/group/`, `src/gameobjects/container/`, `src/gameobjects/layer/`
**Related skills:** ../sprites-and-images/SKILL.md, ../physics-arcade/SKILL.md

## Quick Start

```js
// In a Scene's create() method:

// --- Group: logical collection, no transform, great for pooling ---
const enemies = this.add.group();
enemies.create(100, 200, 'enemy');       // creates Sprite at (100,200)
enemies.create(300, 200, 'enemy');

// --- Container: visual parent with inherited transform ---
const hud = this.add.container(10, 10);
const icon = this.add.image(0, 0, 'heart');
const label = this.add.text(20, 0, 'x3');
hud.add([icon, label]);                  // children move/scale/rotate with hud

// --- Layer: render-ordering bucket, no position/scale ---
const bgLayer = this.add.layer();
const fgLayer = this.add.layer();
bgLayer.add(this.add.image(400, 300, 'sky'));
fgLayer.add(this.add.sprite(400, 300, 'player'));
```

## Core Concepts

### Group vs Container vs Layer

| Feature | Group | Container | Layer |
|---|---|---|---|
| **Purpose** | Logical collection / pool | Visual parent with transform | Render-order bucket |
| **On display list** | No (children are) | Yes (renders children) | Yes (renders children) |
| **Position/rotation/scale** | No | Yes (children inherit) | No |
| **Children storage** | `children` (Set) | `list` (Array) | List (Structs.List) |
| **Physics** | Via physics.add.group() | Limited (offsets if not at 0,0) | No |
| **Input** | No (children can) | Yes (needs hit area shape) | No |
| **Object pooling** | Yes (getFirstDead, kill) | No | No |
| **Masks** | No | Yes (not per-child in Canvas) | Yes |
| **Alpha/blend/visible** | No (batch via setVisible) | Yes | Yes |
| **Nesting** | N/A | Container in Container | Cannot go in Container |
| **Extends** | EventEmitter | GameObject | List |
| **Factory** | `this.add.group()` | `this.add.container(x, y)` | `this.add.layer()` |

### When to Use Each

**Group:** Managing collections of similar objects (enemies, bullets, coins), object pooling with active/inactive lifecycle, physics group collisions. No shared visual transform. Members can belong to multiple Groups simultaneously.

**Container:** Children inherit position, rotation, scale, alpha. Composite UI elements (health bars, inventory slots), moving/rotating clusters as one unit, nested transforms. By default exclusive -- a child can only belong to one Container (use `setExclusive(false)` to override).

**Layer:** Controlling render order of object batches, applying shared alpha/blend/mask. No position/scale/rotation. Lightweight render bucketing.

### Container vs Group at a Glance

- **Container has position, rotation, scale, alpha** -- Group does not. If you need children to move/rotate as a unit, use Container.
- **Container is exclusive by default** -- adding a child removes it from its previous Container. Group is non-exclusive; a game object can be in many Groups.
- **Container is on the display list** -- it renders its children. Group is not on the display list; its children render individually on the Scene.
- **Group supports object pooling** -- getFirstDead, kill, killAndHide. Container does not.
- **Container has performance cost** -- each child requires matrix math per frame. Deeper nesting = more cost. Prefer Group or Layer when transforms are not needed.

## Common Patterns

### Creating and Populating Groups

```js
// Empty group, add existing objects
const gems = this.add.group();
gems.add(existingSprite);
gems.addMultiple([sprite1, sprite2, sprite3]);

// Group with config -- creates children automatically
const coins = this.add.group({
    classType: Phaser.GameObjects.Sprite,
    key: 'coin',
    quantity: 10,           // overrides frameQuantity
    setXY: { x: 50, y: 300, stepX: 60 },
    setScale: { x: 0.5, y: 0.5 }
});

// Custom class type with pool limit
const bullets = this.add.group({
    classType: Bullet,       // must accept (scene, x, y, key, frame)
    maxSize: 30,
    defaultKey: 'bullet',
    runChildUpdate: true     // calls child.update() each frame
});
```

### Object Pooling with getFirstDead

The core pooling pattern: deactivate objects instead of destroying them, then reuse inactive ones.

```js
// Setup pool
const bullets = this.add.group({
    classType: Phaser.GameObjects.Sprite,
    defaultKey: 'bullet',
    maxSize: 30
});

// Fire a bullet -- get() finds first inactive member or creates one
function fireBullet(x, y) {
    const bullet = bullets.get(x, y);

    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -300;   // if physics enabled
    }
}

// Deactivate when off-screen or on hit
function killBullet(bullet) {
    bullets.killAndHide(bullet);         // sets active=false, visible=false
    // If using physics, also reset the body:
    // bullet.body.stop();
}

// Alternative: manual getFirst
const inactive = bullets.getFirst(false);     // first where active===false
const active = bullets.getFirstAlive();       // first where active===true
const dead = bullets.getFirstDead(true, x, y); // first inactive, create if null
```

**Pool helper methods on Group:**

| Method | Description |
|---|---|
| `get(x, y, key, frame)` | Shortcut: `getFirst(false, true, ...)` -- finds inactive or creates |
| `getFirst(state, createIfNull, x, y, key, frame)` | First member matching active `state` |
| `getFirstAlive(createIfNull, x, y, key, frame)` | First member where `active===true` |
| `getFirstDead(createIfNull, x, y, key, frame)` | First member where `active===false` |
| `getLast(state, createIfNull, x, y, key, frame)` | Like getFirst but searches back-to-front |
| `kill(gameObject)` | Sets `active=false` on a member |
| `killAndHide(gameObject)` | Sets `active=false` and `visible=false` |
| `countActive(value)` | Count members where `active===value` (default true) |
| `getTotalUsed()` | Count of active members |
| `getTotalFree()` | `maxSize - active count` (remaining pool capacity) |
| `isFull()` | True if `children.size >= maxSize` |

### Physics Groups

Physics groups extend Group with automatic body assignment. See ../physics-arcade/SKILL.md for full details.

```js
// Arcade Physics group -- every member gets a dynamic body
const enemies = this.physics.add.group({
    key: 'enemy',
    quantity: 5,
    setXY: { x: 100, y: 100, stepX: 80 }
});

// Static physics group -- immovable bodies
const platforms = this.physics.add.staticGroup();
platforms.create(400, 568, 'ground');

// Collide physics groups with each other
this.physics.add.collider(player, platforms);
this.physics.add.overlap(bullets, enemies, onHit);
```

### Containers with Nested Transforms

```js
// HUD that follows camera
const hud = this.add.container(10, 10);
hud.setScrollFactor(0);     // pinned to camera

const healthBar = this.add.rectangle(0, 0, 200, 20, 0x00ff00);
const healthText = this.add.text(210, -5, '100 HP');
hud.add([healthBar, healthText]);

// Move everything at once
hud.setPosition(50, 50);

// Scale and rotate propagate to children
hud.setScale(1.5);
hud.setRotation(0.1);

// Alpha affects all children
hud.setAlpha(0.8);

// Nested containers
const inventory = this.add.container(300, 500);
for (let i = 0; i < 5; i++) {
    const slot = this.add.container(i * 55, 0);
    slot.add([
        this.add.rectangle(0, 0, 48, 48, 0x333333),
        this.add.image(0, 0, `item-${i}`)
    ]);
    inventory.add(slot);    // Container inside Container
}
```

**Key Container methods:**

| Method | Description |
|---|---|
| `add(child)` / `addAt(child, index)` | Add Game Object(s); removes from display list |
| `remove(child, destroyChild)` | Remove; optionally destroy |
| `getAt(index)` / `getIndex(child)` | Access by index |
| `getByName(name)` / `getFirst(prop, val)` | Query children |
| `getAll(prop, val)` / `count(prop, val)` | Filtered access and counting |
| `sort(property)` / `swap(a, b)` / `moveTo(child, idx)` | Ordering |
| `each(cb, ctx)` / `iterate(cb, ctx)` | Iteration (iterate passes index) |
| `setScrollFactor(x, y, updateChildren)` | Pass true to also apply to children |
| `getBounds(output)` | Bounding rect of all children |
| `pointToContainer(source, output)` | World point to local space |
| `setExclusive(value)` | When false, children can exist in multiple places |
| `replace(oldChild, newChild)` | Swap one child for another |
| `setSize(width, height)` | Set hit area size (required for input) |
| `length` | Read-only child count |

### Layers for Render Ordering

```js
const bgLayer = this.add.layer();
const entityLayer = this.add.layer();
const uiLayer = this.add.layer();

// Add objects -- they render in layer order, then by depth within layer
bgLayer.add(this.add.image(400, 300, 'sky'));
entityLayer.add(player);
entityLayer.add(enemy);
uiLayer.add(scoreText);

// Control depth of layers themselves
bgLayer.setDepth(0);
entityLayer.setDepth(1);
uiLayer.setDepth(2);

// Children set depth within their layer
enemy.setDepth(5);   // relative to entityLayer, not the Scene

// Apply shared effects to entire layer
entityLayer.setAlpha(0.5);
entityLayer.setVisible(false);
entityLayer.setBlendMode(Phaser.BlendModes.ADD);
```

### Bulk Creation with createMultiple

```js
// createMultiple accepts a GroupCreateConfig or array of them
const coins = this.add.group();

coins.createMultiple({
    key: 'coin',
    quantity: 20,
    setXY: { x: 50, y: 100, stepX: 40, stepY: 0 },
    setScale: { x: 0.5, y: 0.5 },
    setRotation: { value: 0, step: 0.1 },   // each rotated 0.1 more than previous
    setAlpha: { value: 1 },
    setOrigin: { x: 0.5, y: 0.5 },
    setDepth: { value: 5 },
    gridAlign: {
        width: 5,
        height: 4,
        cellWidth: 48,
        cellHeight: 48,
        x: 100,
        y: 200
    }
});

// Multiple configs at once (creates two different sets)
coins.createMultiple([
    { key: 'gold-coin', quantity: 10, setXY: { x: 50, y: 100, stepX: 30 } },
    { key: 'silver-coin', quantity: 10, setXY: { x: 50, y: 200, stepX: 30 } }
]);
```

### Iterating and Batch Operations on Groups

```js
const enemies = this.add.group();

// Get all children as array
const all = enemies.getChildren();
const active = enemies.getMatching('active', true);

// Batch property operations
enemies.setXY(200, 300);
enemies.incX(5);                    // add 5 to each member's x
enemies.setVisible(false);
enemies.propertyValueSet('tintTopLeft', 0xff0000);
enemies.playAnimation('walk');

// Stepping: apply incremental values across members
enemies.setX(100, 50);             // first at x=100, next at 150, then 200...
enemies.setY(200, 30);             // first at y=200, next at 230, then 260...
enemies.setXY(100, 200, 50, 30);   // combined X and Y stepping
enemies.incXY(10, 5);              // add 10 to each x, 5 to each y
enemies.angle(0, 15);              // first at 0 deg, next at 15, then 30...
enemies.setAlpha(1, -0.1);         // first at 1.0, next at 0.9, then 0.8...
enemies.setScale(1, 0, 0.1, 0);   // scaleX: 1.0, 1.1, 1.2... (stepX=0.1)
enemies.setDepth(0, 1);            // depth 0, 1, 2, 3...
enemies.setOrigin(0.5);
enemies.setBlendMode(Phaser.BlendModes.ADD);
enemies.setTint(0xff0000);
enemies.shuffle();                  // randomize order in the group
```

## API Quick Reference

### Group (Phaser.GameObjects.Group)

```
Factory:  this.add.group(children?, config?)

Config types:
  GroupConfig       -- classType, name, active, maxSize, defaultKey, defaultFrame,
                       runChildUpdate, createCallback, removeCallback
  GroupCreateConfig -- key (required), classType, frame, quantity, visible, active,
                       repeat, yoyo, frameQuantity, max, setXY, setRotation,
                       setScale, setOrigin, setAlpha, setDepth, setScrollFactor,
                       hitArea, gridAlign

Key members:  children (Set), classType, maxSize, defaultKey, defaultFrame,
              active, runChildUpdate
Lifecycle:    create, createMultiple, add, addMultiple, remove, clear, destroy
Queries:      getFirst, getFirstAlive, getFirstDead, getLast, get, getChildren,
              getLength, getMatching, contains, countActive, getTotalUsed,
              getTotalFree, isFull
Pool:         get, getFirstDead, kill, killAndHide
Bulk ops:     setX/Y/XY, incX/Y/XY, setAlpha, setVisible, toggleVisible,
              playAnimation, propertyValueSet, propertyValueInc, setOrigin,
              setDepth, shuffle, setBlendMode, setTint
```

### Container (Phaser.GameObjects.Container)

```
Factory:  this.add.container(x?, y?, children?)

Extends:  GameObject
Mixins:   AlphaSingle, BlendMode, ComputedSize, Depth, Mask, Transform, Visible

Key members:  list (Array), exclusive, maxSize, scrollFactorX/Y
Children:     add, addAt, remove, removeAt, removeBetween, removeAll
Queries:      getAt, getIndex, getByName, getFirst, getAll, getRandom, count
Ordering:     sort, swap, moveTo, moveUp, moveDown, sendToBack, bringToTop,
              moveAbove, moveBelow, reverse
Transform:    pointToContainer, getBounds, getBoundsTransformMatrix
Iteration:    each(cb, ctx), iterate(cb, ctx, ...args)
Config:       setExclusive, setScrollFactor(x, y, updateChildren)
Property:     length (read-only child count)
```

### Layer (Phaser.GameObjects.Layer)

```
Factory:  this.add.layer(children?)

Extends:  Phaser.Structs.List
Mixins:   AlphaSingle, BlendMode, Depth, Filters, Mask, RenderSteps, Visible

Key members:  scene, displayList, sortChildrenFlag
Children:     add, remove (inherited from List)
Settings:     setAlpha, setBlendMode, setDepth, setVisible, setMask, setName,
              setActive, setState, setData, getData

No position, rotation, scale, scroll factor, input, or physics.
Cannot be added to a Container. Containers can be added to Layers.
```

## Gotchas

1. **Group is NOT on the display list.** Its children appear on the Scene display list individually. Moving a Group does nothing visually -- use Container for that.

2. **Container has performance overhead.** Every child requires extra matrix math per frame. Deep nesting multiplies this. Avoid Containers when a Group or Layer suffices.

3. **Container origin is always 0,0.** The transform point cannot be changed. Position children relative to (0,0).

4. **Container children lose Scene-level depth control.** A child's `depth` only orders within the Container. The Container's own depth positions it in the Scene.

5. **Physics + Container is problematic.** If a Container is not at (0,0), physics bodies on children will be offset. Avoid physics bodies on Container children.

6. **Container children cannot be individually masked in Canvas rendering.** Only the Container itself can have a mask. Masks do not stack for nested Containers. Masks do stack in WebGL rendering.

7. **Group.get() vs Group.getFirst() differ.** `get(x, y)` is shorthand for `getFirst(false, true, x, y)` -- finds first *inactive* member and creates if none found. `getFirst(state)` defaults to `active===false` without auto-creating.

8. **Layer cannot go inside a Container.** Containers can be added to Layers, but not the reverse.

9. **Group children Set is unordered.** No index-based access. Use `getChildren()` to get an array snapshot.

10. **killAndHide does not remove from the group.** It only sets `active=false` and `visible=false`. The object stays in the group for reuse.

11. **Container.setScrollFactor does not auto-propagate.** Pass `true` as the third argument to also update children: `container.setScrollFactor(0, 0, true)`.

12. **Group.create() adds to the Scene display list.** But `group.add()` does NOT unless you pass `true` as the second argument.

13. **Container needs setSize() for input.** Containers have no implicit size. You must call `container.setSize(width, height)` before `setInteractive()` will work with a hit area.

## Source File Map

| File | Description |
|---|---|
| `src/gameobjects/group/Group.js` | Group class -- pooling, create, getFirst*, kill, batch ops |
| `src/gameobjects/group/GroupFactory.js` | `this.add.group()` factory registration |
| `src/gameobjects/group/typedefs/GroupConfig.js` | GroupConfig typedef (classType, maxSize, callbacks) |
| `src/gameobjects/group/typedefs/GroupCreateConfig.js` | GroupCreateConfig typedef (key, quantity, setXY, etc.) |
| `src/gameobjects/container/Container.js` | Container class -- list management, nested transforms |
| `src/gameobjects/container/ContainerFactory.js` | `this.add.container()` factory registration |
| `src/gameobjects/container/ContainerRender.js` | Container WebGL/Canvas render functions |
| `src/gameobjects/layer/Layer.js` | Layer class -- display list bucket with alpha/blend/mask |
| `src/gameobjects/layer/LayerFactory.js` | `this.add.layer()` factory registration |
| `src/gameobjects/layer/LayerRender.js` | Layer WebGL/Canvas render functions |
| `src/physics/arcade/ArcadePhysics.js` | `this.physics.add.group()` / `staticGroup()` |
