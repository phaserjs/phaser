# Input Keyboard Mouse Touch — Reference

> Detailed configuration, API tables, and source file maps for the input-keyboard-mouse-touch skill.

## Events (input events with callback signatures)

### Keyboard Events (on `this.input.keyboard`)

| Event String | Callback Signature | Description |
|---|---|---|
| `'keydown'` | `(event: KeyboardEvent)` | Any key pressed |
| `'keyup'` | `(event: KeyboardEvent)` | Any key released |
| `'keydown-KEY'` | `(event: KeyboardEvent)` | Specific key pressed (e.g. `'keydown-SPACE'`, `'keydown-A'`) |
| `'keyup-KEY'` | `(event: KeyboardEvent)` | Specific key released |
| `'keycombomatch'` | `(keyCombo: KeyCombo, event: KeyboardEvent)` | A key combo was matched |

### Key Object Events (on a Key instance)

| Event String | Callback Signature | Description |
|---|---|---|
| `'down'` | `(key: Key, event: KeyboardEvent)` | This key was pressed |
| `'up'` | `(key: Key, event: KeyboardEvent)` | This key was released |

### Pointer Events (on `this.input`)

| Event String | Callback Signature | Description |
|---|---|---|
| `'pointerdown'` | `(pointer, currentlyOver: GameObject[])` | Pointer pressed anywhere |
| `'pointerup'` | `(pointer, currentlyOver: GameObject[])` | Pointer released anywhere |
| `'pointermove'` | `(pointer, currentlyOver: GameObject[])` | Pointer moved anywhere |
| `'pointerdownoutside'` | `(pointer)` | Pointer pressed outside the game canvas |
| `'pointerupoutside'` | `(pointer)` | Pointer released outside the game canvas |
| `'wheel'` | `(pointer, currentlyOver: GameObject[], deltaX, deltaY, deltaZ)` | Mouse wheel scrolled |
| `'gameout'` | `(event)` | Pointer left the game canvas |
| `'gameover'` | `(event)` | Pointer entered the game canvas |
| `'pointerlockchange'` | `(event, locked: boolean)` | Pointer lock state changed |

### Game Object Pointer Events (on an interactive Game Object)

| Event String | Callback Signature | Description |
|---|---|---|
| `'pointerdown'` | `(pointer, localX, localY, event)` | Pointer pressed on this object |
| `'pointerup'` | `(pointer, localX, localY, event)` | Pointer released on this object |
| `'pointermove'` | `(pointer, localX, localY, event)` | Pointer moved over this object |
| `'pointerover'` | `(pointer, localX, localY, event)` | Pointer entered this object |
| `'pointerout'` | `(pointer, event)` | Pointer left this object |
| `'wheel'` | `(pointer, deltaX, deltaY, deltaZ, event)` | Mouse wheel over this object |

All Game Object events provide `event.stopPropagation()` to halt further event flow.

### Scene Per-Object Pointer Events (on `this.input`, Level 2)

| Event String | Callback Signature | Description |
|---|---|---|
| `'gameobjectdown'` | `(pointer, gameObject, event)` | Pointer pressed on any interactive object |
| `'gameobjectup'` | `(pointer, gameObject, event)` | Pointer released on any interactive object |
| `'gameobjectmove'` | `(pointer, gameObject, event)` | Pointer moved over any interactive object |
| `'gameobjectover'` | `(pointer, gameObject, event)` | Pointer entered any interactive object |
| `'gameobjectout'` | `(pointer, gameObject, event)` | Pointer left any interactive object |
| `'gameobjectwheel'` | `(pointer, gameObject, dx, dy, dz, event)` | Mouse wheel over any interactive object |

### Game Object Drag Events (on an interactive, draggable Game Object)

| Event String | Callback Signature | Description |
|---|---|---|
| `'dragstart'` | `(pointer, dragX, dragY)` | Drag started on this object |
| `'drag'` | `(pointer, dragX, dragY)` | Object is being dragged |
| `'dragend'` | `(pointer, dragX, dragY, dropped)` | Drag ended (`dropped` is boolean) |
| `'drop'` | `(pointer, target)` | Dropped on a drop zone |
| `'dragenter'` | `(pointer, target)` | Dragged into a drop zone |
| `'dragleave'` | `(pointer, target)` | Dragged out of a drop zone |

### Drag Events (on `this.input`)

| Event String | Callback Signature |
|---|---|
| `'dragstart'` | `(pointer, gameObject)` |
| `'drag'` | `(pointer, gameObject, dragX, dragY)` |
| `'dragend'` | `(pointer, gameObject)` |
| `'dragenter'` | `(pointer, gameObject, dropZone)` |
| `'dragleave'` | `(pointer, gameObject, dropZone)` |
| `'dragover'` | `(pointer, gameObject, dropZone)` |
| `'drop'` | `(pointer, gameObject, target)` |

### Gamepad Events (on `this.input.gamepad`)

| Event String | Callback Signature |
|---|---|
| `'connected'` | `(pad: Gamepad, event: Event)` |
| `'disconnected'` | `(pad: Gamepad, event: Event)` |
| `'down'` | `(pad: Gamepad, button: Button, value: number)` |
| `'up'` | `(pad: Gamepad, button: Button, value: number)` |

### Event Dispatch Order (pointer events)

For down/up/move events, the dispatch order is:
1. `GAMEOBJECT_POINTER_DOWN` (on the Game Object itself)
2. `GAMEOBJECT_DOWN` (on `this.input` with Game Object as param)
3. `POINTER_DOWN` (on `this.input`, scene-wide)

Higher-priority handlers can call `event.stopPropagation()` to prevent lower ones from firing.

## API Quick Reference

### InputPlugin (this.input)

| Method / Property | Signature | Returns |
|---|---|---|
| `on(event, fn, context)` | Event listener | this |
| `addPointer(quantity)` | `(number)` | Pointer[] |
| `setDraggable(gameObjects, value)` | `(GameObject[], boolean)` | this |
| `makePixelPerfect(alphaTolerance)` | `(number)` | Function |
| `setHitArea(gameObjects, hitArea, callback)` | `(GameObject[], any, Function)` | this |
| `setHitAreaCircle(go, x, y, r, cb)` | | this |
| `setHitAreaRectangle(go, x, y, w, h, cb)` | | this |
| `setHitAreaFromTexture(go, cb)` | | this |
| `activePointer` | | Pointer |
| `mousePointer` | | Pointer |
| `keyboard` | | KeyboardPlugin |
| `gamepad` | | GamepadPlugin |

### KeyboardPlugin (this.input.keyboard)

| Method / Property | Signature | Returns |
|---|---|---|
| `createCursorKeys()` | | CursorKeys (`{up, down, left, right, space, shift}`) |
| `addKey(key, capture, emitOnRepeat)` | `(Key\|string\|number, boolean?, boolean?)` | Key |
| `addKeys(keys, capture, emitOnRepeat)` | `(object\|string, boolean?, boolean?)` | object |
| `removeKey(key, destroy)` | `(Key\|string\|number, boolean?)` | this |
| `createCombo(keys, config)` | `(string\|number[]\|object[], object?)` | KeyCombo |
| `checkDown(key, duration)` | `(Key, number?)` | boolean |
| `addCapture(keycode)` | `(string\|number\|number[])` | this |
| `removeCapture(keycode)` | `(string\|number\|number[])` | this |
| `enabled` | boolean | |

### Keyboard Utility Functions

| Function | Signature | Returns |
|---|---|---|
| `Phaser.Input.Keyboard.JustDown(key)` | `(Key)` | boolean (true once per press) |
| `Phaser.Input.Keyboard.JustUp(key)` | `(Key)` | boolean (true once per release) |

### Pointer

| Property | Type | Description |
|---|---|---|
| `x`, `y` | number | Screen-space position |
| `worldX`, `worldY` | number | Camera-translated position |
| `isDown` | boolean | Any button held |
| `primaryDown` | boolean | Primary button held |
| `button` | number | Button that triggered last event |
| `wasTouch` | boolean | Last event was touch |
| `velocity` | Vector2 | Smoothed movement velocity |
| `deltaX/Y/Z` | number | Wheel scroll amounts |

| Method | Returns | Description |
|---|---|---|
| `leftButtonDown()` | boolean | Left button held |
| `rightButtonDown()` | boolean | Right button held |
| `getDistance()` | number | Distance from down to current/up |
| `getDuration()` | number | Ms from down to current/up |
| `updateWorldPoint(camera)` | this | Recalculate world coords |

### Gamepad

| Property | Type | Description |
|---|---|---|
| `leftStick` | Vector2 | Left analog stick (x,y from -1 to 1) |
| `rightStick` | Vector2 | Right analog stick |
| `A`, `B`, `X`, `Y` | boolean | Face buttons |
| `up`, `down`, `left`, `right` | boolean | D-pad |
| `L1`, `L2`, `R1`, `R2` | number | Shoulder buttons (0-1) |
| `id` | string | Controller identifier string |
| `connected` | boolean | Connection state |

## Three Levels of Pointer Events

Phaser dispatches pointer events at three levels, in this order:

**Level 1 — Game Object events** (most specific, require `setInteractive()`):

```js
gameObject.on('pointerdown', (pointer, localX, localY, event) => {});
gameObject.on('pointerup', (pointer, localX, localY, event) => {});
gameObject.on('pointermove', (pointer, localX, localY, event) => {});
gameObject.on('pointerover', (pointer, localX, localY, event) => {});
gameObject.on('pointerout', (pointer, event) => {});
gameObject.on('wheel', (pointer, dx, dy, dz, event) => {});
```

**Level 2 — Scene input per-object events** (fires with the Game Object as a parameter):

```js
this.input.on('gameobjectdown', (pointer, gameObject, event) => {});
this.input.on('gameobjectup', (pointer, gameObject, event) => {});
this.input.on('gameobjectmove', (pointer, gameObject, event) => {});
this.input.on('gameobjectover', (pointer, gameObject, event) => {});
this.input.on('gameobjectout', (pointer, gameObject, event) => {});
this.input.on('gameobjectwheel', (pointer, gameObject, dx, dy, dz, event) => {});
```

**Level 3 — Scene input global events** (fires regardless of what is under the pointer):

```js
this.input.on('pointerdown', (pointer, currentlyOver) => {});
this.input.on('pointerup', (pointer, currentlyOver) => {});
this.input.on('pointermove', (pointer, currentlyOver) => {});
this.input.on('wheel', (pointer, currentlyOver, dx, dy, dz, event) => {});
```

At any level, call `event.stopPropagation()` to prevent the event from reaching the next level.

## Hit Area Shapes (All Geometry Types)

```js
// Default (rectangle from texture)
gameObject.setInteractive();

// Circle
gameObject.setInteractive(new Phaser.Geom.Circle(x, y, radius), Phaser.Geom.Circle.Contains);

// Ellipse
gameObject.setInteractive(new Phaser.Geom.Ellipse(x, y, w, h), Phaser.Geom.Ellipse.Contains);

// Rectangle
gameObject.setInteractive(new Phaser.Geom.Rectangle(x, y, w, h), Phaser.Geom.Rectangle.Contains);

// Triangle
gameObject.setInteractive(new Phaser.Geom.Triangle(x1, y1, x2, y2, x3, y3), Phaser.Geom.Triangle.Contains);

// Polygon (array of {x,y} points or flat [x1,y1,x2,y2,...] array)
gameObject.setInteractive(new Phaser.Geom.Polygon(points), Phaser.Geom.Polygon.Contains);

// Pixel-perfect (expensive — only use where needed)
gameObject.setInteractive({ pixelPerfect: true, alphaTolerance: 1 });
```

## Full setInteractive Config Object

```js
gameObject.setInteractive({
    hitArea: shape,              // Geom shape (Circle, Rectangle, etc.)
    hitAreaCallback: callback,   // Contains function for the shape
    draggable: false,            // Enable drag-and-drop
    dropZone: false,             // Mark as a drop zone
    useHandCursor: false,        // Show hand cursor on hover
    cursor: 'pointer',           // CSS cursor string
    pixelPerfect: false,         // Use pixel-perfect hit testing
    alphaTolerance: 1            // Alpha threshold for pixel-perfect (0-255)
});
```

## Input Debug Mode

Visualize hit areas for debugging interactive objects:

```js
// Enable debug overlay (default green outline)
this.input.enableDebug(gameObject);

// Custom color
this.input.enableDebug(gameObject, 0xff00ff);

// Remove debug overlay
this.input.removeDebug(gameObject);
```

## Multi-touch Configuration

By default, Phaser creates 2 pointers (mouse + 1 touch). Configure more at startup or runtime:

```js
// At startup via game config
const config = {
    input: {
        activePointers: 4  // reserve 4 pointer slots
    }
};

// At runtime
this.input.addPointer(3); // add 3 more pointers (up to 10 total)

// Access individual pointers
this.input.pointer1; // first touch pointer
this.input.pointer2; // second touch pointer
// ... through this.input.pointer10
this.input.mousePointer; // the mouse (always pointer index 0)
```

## Keyboard Combos (String Array Form)

```js
// Using key name strings
const combo = this.input.keyboard.createCombo(['UP', 'UP', 'DOWN', 'DOWN'], {
    resetOnWrongKey: true,
    maxKeyDelay: 0,
    resetOnMatch: false
});

this.input.keyboard.on('keycombomatch', (keyCombo, event) => {
    console.log('Combo matched:', keyCombo);
});
```

## Gamepad Additional Methods

```js
// Get all connected gamepads as an array
const pads = this.input.gamepad.getAll();

// Get a specific gamepad by index
const pad = this.input.gamepad.getPad(0);

// Gamepad instance events (different callback signature from plugin-level)
// Plugin-level: (gamepad, button, value)
pad.on('down', (buttonIndex, value, button) => {});
pad.on('up', (buttonIndex, value, button) => {});
```

## Gotchas and Common Mistakes

1. **Must call setInteractive() before listening for Game Object events.** Without it, `pointerdown` etc. will never fire on that object.

2. **Containers need a size for hit testing.** Call `container.setSize(w, h)` or pass a shape to `setInteractive()`. Pixel-perfect testing does not work on Containers.

3. **JustDown/JustUp only return true once per check.** They consume the flag on read, so calling `JustDown(key)` twice in the same frame gives true then false. Store the result in a variable if needed in multiple places.

4. **Keyboard captures are global.** Calling `addCapture('SPACE')` in one Scene prevents the browser default for all Scenes, not just the calling Scene.

5. **Browser extensions can interfere with keyboard input.** Extensions like Vimium can intercept keys (e.g. D key). Check extensions when debugging missing key events.

6. **Pointer worldX/worldY are only accurate inside input handlers.** Outside of event callbacks, call `pointer.updateWorldPoint(camera)` first to get correct camera-translated coordinates.

7. **topOnly defaults to true.** Only the top-most interactive Game Object under the pointer receives events. Set `this.input.topOnly = false` to emit to all objects below the pointer.

8. **Gamepad requires SSL in modern browsers.** Chrome and others block the Gamepad API on non-HTTPS pages. The browser may also require a button press before exposing the gamepad.

9. **Gamepad may already be connected.** The `'connected'` event only fires on new connections. Check `this.input.gamepad.total` on Scene start and use `pad1`-`pad4` if already present.

10. **Drag events require both setInteractive and setDraggable.** Just calling `setInteractive()` is not enough; you must also call `this.input.setDraggable(sprite)` or use the `{ draggable: true }` config.

11. **Pointer lock must be requested from a user gesture.** Call `this.input.mouse.requestPointerLock()` from inside a `pointerdown` or `pointerup` handler.

12. **Key.emitOnRepeat defaults to false.** By default, holding a key only emits one `'down'` event. Set `emitOnRepeat` to true in `addKey()` or on the Key to get continuous events.

13. **Pixel-perfect hit testing is expensive.** It checks every pixel under the pointer against the texture alpha. Only use `pixelPerfect: true` where irregular shapes truly require it; prefer geometric hit areas (Circle, Polygon) for performance.

14. **No touch input events during the preload stage.** Touch/pointer events are not dispatched while the Scene is in the `preload` phase. Wait for `create` to set up interactive objects.

15. **In multi-camera scenes, check `pointer.camera`.** When a Scene has multiple cameras, the pointer event includes which camera received it via `pointer.camera`. Use this to determine which camera viewport was clicked.

16. **Gamepad callback signatures differ between plugin and instance.** Plugin-level events use `(gamepad, button, value)` while per-gamepad instance events use `(buttonIndex, value, button)`. Mixing these up is a common source of bugs.

## Source File Map

| File | Purpose |
|---|---|
| `src/input/InputPlugin.js` | Scene input plugin (`this.input`), setInteractive, hit areas, drag |
| `src/input/Pointer.js` | Pointer class (mouse + touch), coordinates, button state |
| `src/input/keyboard/KeyboardPlugin.js` | Keyboard plugin (`this.input.keyboard`), addKey, createCursorKeys, combos |
| `src/input/keyboard/keys/Key.js` | Key object (isDown, isUp, events) |
| `src/input/keyboard/keys/KeyCodes.js` | Enum of all key codes (SPACE, ENTER, A-Z, etc.) |
| `src/input/keyboard/keys/JustDown.js` | `Phaser.Input.Keyboard.JustDown(key)` utility |
| `src/input/keyboard/keys/JustUp.js` | `Phaser.Input.Keyboard.JustUp(key)` utility |
| `src/input/keyboard/combo/KeyCombo.js` | Key combo sequence detection |
| `src/input/keyboard/events/` | Keyboard events: `ANY_KEY_DOWN`, `ANY_KEY_UP`, `KEY_DOWN`, `KEY_UP`, `DOWN`, `UP`, `COMBO_MATCH` |
| `src/input/events/` | Input events: `POINTER_DOWN`, `POINTER_UP`, `POINTER_MOVE`, `POINTER_WHEEL`, `DRAG_*`, `DROP`, `GAMEOBJECT_*` |
| `src/input/gamepad/GamepadPlugin.js` | Gamepad plugin (`this.input.gamepad`), pad1-pad4 |
| `src/input/gamepad/Gamepad.js` | Gamepad class, sticks, buttons, d-pad properties |
| `src/input/gamepad/Axis.js` | Gamepad axis with threshold |
| `src/input/gamepad/Button.js` | Gamepad button (pressed, value) |
| `src/input/gamepad/events/` | Gamepad events: `CONNECTED`, `DISCONNECTED`, `BUTTON_DOWN`, `BUTTON_UP` |
