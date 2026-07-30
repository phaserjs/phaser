# Phaser 3 Change Log

## Version 3.10.0 - Hayashi - 13th June 2018

### Input System New Features + Updates

* All Input classes are now covered 100% by JSDocs.
* The Input Manager and Input Plugin have been updated to support multiple simultaneous Pointers. Before, only one active pointer (mouse or touch) was supported. Now, you can have as many active pointers as you need, allowing for complex multi-touch games. These are stored in the Input Manager `pointers` array.
* `addPointer` allows you to add one, or more, new pointers to the Input Manager. There is no hard-coded limit to the amount you can have, although realistically you should never need more than 10. This method is available on both the Input Manager and Plugin, allowing you to use `this.input.addPointer` from within your game code.
* InputManager `pointersTotal` contains the total number of active pointers, which can be set in the Game Config using the `input.activePointers` property. Phaser will create 2 pointers on start unless a different value is given in the config, or you can add them at run-time.
* `mousePointer` is a new property that is specifically allocated for mouse use only. This is perfect for desktop only games but should be ignored if you're creating a mouse + touch game (use activePointer instead).
* `activePointer` will now reflect the most recently active pointer on the game, which is considered as being the pointer to have interacted with the game canvas most recently.
* The InputManager and InputPlugin have three new methods: `addUpCallback`, `addDownCallback` and `addMoveCallback`. These methods allow you to add callbacks to be invoked whenever native DOM mouse or touch events are received. Callbacks passed to this method are invoked _immediately_ when the DOM event happens, within the scope of the DOM event handler. Therefore, they are considered as 'native' from the perspective of the browser. This means they can be used for tasks such as opening new browser windows, or anything which explicitly requires user input to activate. However, as a result of this, they come with their own risks, and as such should not be used for general game input, but instead be reserved for special circumstances. The callbacks can be set as `isOnce` so you can control if the callback is called once then removed, or every time the DOM event occurs.
* Pointer has two new properties `worldX` and `worldY` which contain the  position of the Pointer, translated into the coordinate space of the most recent Camera it interacted with.
* When checking to see if a Pointer has interacted with any objects it will now iterate through the Camera list. Previously, it would only check against the top-most Camera in the list, but now if the top-most camera doesn't return anything, it will move to the next camera and so on. This also addresses #3631 (thanks @samid737)
* `InputManager.dirty` is a new internal property that reflects if any of the Pointers have updated this frame.
* `InputManager.update` now uses constants internally for the event type checking, rather than string-based like before.
* `InputManager.startPointer` is a new internal method, called automatically by the update loop, that handles touch start events.
* `InputManager.updatePointer` is a new internal method, called automatically by the update loop, that handles touch move events.
* `InputManager.stopPointer` is a new internal method, called automatically by the update loop, that handles touch end events.
* `InputManager.hitTest` has had its arguments changed. It no longer takes x/y properties as the first two arguments, but instead takes a Pointer object (from which the x/y coordinates are extracted).
* `TouchManager.handler` has been removed as it's no longer used internally.
* `TouchManager.onTouchStart`, `onTouchMove` and `onTouchEnd` are the new DOM Touch Event handlers. They pass the events on to the InputManagers `queueTouchStart`, `queueTouchMove` and `queueTouchEnd` methods respectively.
* `MouseManager.handler` has been removed as it's no longer used internally.
* `MouseManager.onMouseDown`, `onMouseMove` and `onMouseUp` are the new DOM Mouse Event handlers. They pass the events on to the InputManagers `queueMouseDown`, `queueMouseMove` and `queueMouseUp` methods respectively.
* Setting `enabled` to false on either the TouchManager, MouseManager or KeyboardManager will prevent it from handling any native DOM events until you set it back again.
* InputPlugin has the following new read-only properties: `mousePointer`, `pointer1`, `pointer2`, `pointer3`, `pointer4`, `pointer5`, `pointer6`, `pointer7`, `pointer8`, `pointer9` and `pointer10`. Most of these will be undefined unless you call `addPointer` first, or set the active pointers quantity in your Game Config.
* InputManager has a new method `transformPointer` which will set the transformed x and y properties of a Pointer in one call, rather than the 2 calls it took before. This is now used by all Pointer event handlers.
* InputPlugin has a new method `makePixelPerfect` which allows you to specify a texture-based Game Object as being pixel perfect when performing all input checks against it. You use it like this: `this.add.sprite(x, y, key).setInteractive(this.input.makePixelPerfect())`, or the easier: `setInteractive({ pixelPerfect: true })` - you can also pass or set an optional alpha tolerance level. See the method docs for full details and the new examples to see it in action. Note that as a pointer interacts with the Game Object it will constantly poll the texture, extracting a single pixel from the given coordinates and checking its color values. This is an expensive process, so should only be enabled on Game Objects that really need it.

### Input - Custom Cursors

* You can now set a custom cursor for your game via `this.input.setDefaultCursor()`. This will take any valid CSS cursor string, including URLs to cursor image files.
* You can now set a custom cursor for specific Game Objects. This will take any valid CSS cursor string, including URLs to cursor image files, and is used when-ever a pointer is over that Game Object. For example, to have a hand cursor appear when over a button Sprite, you can do: `button.input.cursor = 'pointer'`, or to have a help cursor appear: `button.input.cursor = 'help'`, or to have a custom image: `button.input.cursor = 'url(assets/cursors/sword.cur), pointer'`.
* You can also set a custom cursor in the new Input Configuration Object. To use the `pointer` (hand cursor) there is a new short-cut: `setInteractive({ useHandCursor: true })`. To use anything else: `setInteractive({ cursor: CSSString })` where `CSSString` is any valid CSS for setting a cursor.
* Please be aware of limitations when it comes to image based cursors between browsers. It's up to you to find a suitable format and size that fits the browsers you wish to support (note: virtually all modern browsers no longer support animated CSS cursors.)

### Input - Configuration Objects

* The `setInteractive` method can now take an Input Configuration object as its only argument. This allows you to set multiple input related properties in a single call, i.e.: `setInteractive({ draggable: true, pixelPerfect: true })`. The available properties are:
* `hitArea` - The object / shape to use as the Hit Area. If not given it will try to create a Rectangle based on the texture frame.
* `hitAreaCallback` - The callback that determines if the pointer is within the Hit Area shape or not.
* `draggable` - If `true` the Interactive Object will be set to be draggable and emit drag events.
* `dropZone` - If `true` the Interactive Object will be set to be a drop zone for draggable objects.
* `useHandCursor` - If `true` the Interactive Object will set the `pointer` hand cursor when a pointer is over it. This is a short-cut for setting `cursor: 'pointer'`.
* `cursor` - The CSS string to be used when the cursor is over this Interactive Object.
* `pixelPerfect` - If `true` the a pixel perfect function will be set for the hit area callback. Only works with texture based Game Objects.
* `alphaTolerance` - If `pixelPerfect` is set, this is the alpha tolerance threshold value used in the callback.

### Input - Keyboard Manager Updates

* The `KeyboardManager` class has been removed. It has been replaced with `KeyboardPlugin` which is now an Input level plugin, that registers itself with the new `InputPluginCache`. The Input Plugin class (which belongs to a Scene) will now automatically inject registered plugins into itself on boot. Every Scene has its own instance of the Input Plugin (if enabled in the scene plugins), which in turn has its own instance of the KeyboardPlugin. The `InputManager` no longer has any reference to the Keyboard class at all. The benefits of this are two-fold: First, it allows you to now entirely exclude all of the keyboard classes from a custom build, saving a lot of space if not required. Secondly, it means that the Scenes themselves are now responsible for keyboard events, where-as before they were entirely global. This means a Scene can be paused and stop processing keyboard events, and stop having its Key objects updated, while another Scene can still carry on doing this. It also prevents key related callbacks in sleeping Scenes from being fired (which resolves issue #3733, thanks @JoeMoov2)
* `KeyboardManager.handler` has been renamed to `onKeyHandler`.
* The `KeyboardManager.captures` property has been removed as it can be more effectively handled by polling the `keys` object instead.
* The Keyboard Manager will no longer process key down or up events if its `enabled` property is set to false, or if the Scene to which it belongs is not active.
* The Keyboard Manager will now call `event.preventDefault` on the native DOM event as long as the Key exists in the keys array and has its `preventDefault` property set to `true` (which is the default). This means you can now control specifically which key prevents default on the browser, where-as before every key added did so.
* KeyboardManager `addKeyCapture` and `removeKeyCapture` have been removed as you now control which keys prevent capture by using the `addKey` or `addKeys` methods (see entry above). The act of creating a Key is now enough to enable capture of it and can be toggled (at run-time) on a per-Key basis.
* `KeyboardManager.addKeys` can now take either an object, or key codes, or a comma-separated string as its input. This means you can now do: `keyboard.addKeys('W,S,A,D')` and get an object back with the properties WSAD mapped to the relevant Key objects.
* `KeyboardManager.addKey` can now take either a Key object, a string, such as `A` or `SPACE`, or a key code value.
* `KeyboardManager.removeKey` can now take either a Key object, a string, such as `A` or `SPACE`, or a key code value.

### Input - Gamepad Manager Updates

* The `GamepadManager` class has been removed. It has been replaced with `GamepadPlugin` which is now an Input level plugin, that registers itself with the new `InputPluginCache`. The Input Plugin class (which belongs to a Scene) will now automatically inject the registered plugins into itself on boot. Every Scene has its own instance of the Input Plugin (if enabled in the scene plugins), which in turn has its own instance of the GamepadPlugin. The `InputManager` no longer has any reference to the Gamepad class at all. The benefits of this are two-fold: First, it allows you to now entirely exclude all of the gamepad classes from a custom build, saving a lot of space if not required. Secondly, it means that the Scenes themselves are now responsible for gamepad events, where-as before they were entirely global. This means a Scene can be paused and stop processing gamepad events, and stop having its Gamepad objects updated, while another Scene can still carry on doing this. It also prevents gamepad related callbacks in sleeping Scenes from being fired.
* The Gamepad Plugin has been rewritten from scratch. It now offers a lot more features and far easier access to the Gamepads and their properties. You can now access the first 4 gamepads connected to the browser via the `pad1` to `pad4` properties, meaning you can do: `this.input.gamepad.pad1` for direct access to a pad once it's connected.
* The Gamepad class has also been rewritten from scratch. It will no longer create Buttons or Axes dynamically, instead doing so on instantiation.
* The Gamepad class now has a bunch of new properties for easy access to the various standard mapping buttons. These include `left`, `right`, `up`, `down` for directions, `A`, `Y`, `X` and `B` for buttons, `L1`, `L2`, `R1` and `R2` for shoulder buttons, and `leftStick` and `rightStick` for the axis sticks. You can still use `Gamepad.getButtonValue()` to get the value from a button and `Gamepad.getButtonTotal()` to get the total number of buttons available on the pad.
* `Gamepad.getAxisTotal` and `Gamepad.getAxisValue` will return the total number of axis, and an axis value, accordingly.
* `Gamepad.setAxisThreshold` will now let you set the threshold across all axis of a Gamepad in one call.
* The Gamepad `Button` objects will now emit 2 events, one from the button itself and another from the Gamepad. This means you can listen for button events in 3 ways: 1) By directly polling the button value in an update loop, 2) Listening for events on the Gamepad Plugin: `this.input.gamepad.on('down')`, or 3) By listening for events on the Gamepad itself: `gamepadReference.on('down')`.

### Arcade Physics New Features + Updates

* Arcade Physics now uses a fixed time-step for all internal calculations. There is a new `fps` config value and property (defaults to 60fps), which you can change at run-time using the `setFPS` method. The core update loop has been recoded so that it steps based entirely on the given frame rate, and not the wall-clock or game step delta. This fixed time step allows for a straightforward implementation of a deterministic game state. Meaning you can now set the fps rate to a high value such as 240, regardless of the browser update speed (it will simply perform more physics steps per game step). This is handy if you want to increase the accuracy of the simulation in certain cases.
* You can also optionally call the `step` function directly, to manually advance the simulation.
* There is a new property `timeScale` which will scale all time-step calculations at run-time, allowing you to speed-up or slow-down your simulation at will, without adjusting the frame rate.
* You can now disable the use of the RTree for dynamic bodies via the config property `useTree`. In certain situations, i.e. densely packed worlds, this may give better performance. Static bodies will always use an RTree.
* `collideSpriteVsGroup` has been rewritten. If you are using an RTree it now uses the results directly from the tree search, instead of iterating all children in the Group, which dramatically reduces the work it does. If you have disabled the RTree it performs a brute-force O(N2) Sprite vs. Group iteration sweep. We tested multiple axis sorting variants but the cost of the array allocation and/or sorting, with large amounts of bodies (10,000+), far outweighed the simple math involved in the separation logic.
* `Body.useDamping` is a new boolean property that allows you to use a damping effect for drag, rather than the default linear deceleration. This gives much better results if you need smooth deceleration across both axis, such as the way the ship slows down in the game Asteroids, without the tell-tale axis drift associated with linear drag.
* `GetOverlapX` and `GetOverlapY` now use the calculated delta values, not the deltaX/Y methods.
* `collideSpriteVsGroup` aborts early if the Sprite body has been disabled.
* `updateMotion` has a new argument `delta` which should typically be a fixed-time delta value.
* `intersects` has been restructured to prioritize rect vs. rect checks.
* Body `update` and `postUpdate` have been recoded to handle the new fixed time-step system in place. `update` now takes a new argument, delta, which is used internally for calculations.
* `Body.dirty` has been removed as a property as it's no longer used internally.
* `Body.deltaAbsX` and `deltaAbsY` now return the cached absolute delta value from the previous update, and no longer calculate it during the actual call.
* `World.enable` has been recoded to remove all the `hasOwnProperty` checks and streamline the internal flow.
* `World.disable` has been recoded to remove all the `hasOwnProperty` checks and streamline the internal flow.
* `World.add` is a new method that adds an existing body to the simulation and `enableBody` now passes its newly created bodies to this method.
* `World.disableGameObjectBody` has been removed as it duplicated what the `disable` method did.
* There is a new internal flow with regard to the creation and disabling of bodies. Calling `World.enable` will pass the objects to `enableBody`, which will create a new Body object, if required, and finally pass it to `add`. `World.disable` does the same, but removes the bodies from the simulation. It passes the bodies to `disableBody`, which in turn passes it to `remove`. Both of these work for single objects, an array of objects, Groups or even arrays of Groups.
* `World.computeAngularVelocity` is a new method that specifically calculates the angular velocity of a Body.
* `World.computeVelocity` has had its signature changed. Rather than taking a bunch of arguments all it now takes is a Body and a delta value. Internally it now calculates both the x and y velocity components together in the same single call, where-as before it was split into two calls and multiple assignments.
* `World.computeVelocity` no longer returns the new velocities, they are now set directly on the body within the method.
* `World.computeVelocity` has been recoded to use Fuzzy Greater Than and Less Than calls when applying drag to a previously accelerated body. Using a fuzzy epsilon allows us to mitigate the ping-pong issue, where a decelerating body would constantly flip between a small negative and positive velocity value and never come to an actual rest.
* `World.computeVelocity` now checks the `Body.useDamping` property to perform either linear deceleration or damping on the Body.
* `World.updateMotion` has changed to call the new `computeAngularVelocity` and `computeVelocity` methods.
* Bodies set to bounce would eventually run out of velocity and stop. This has been fixed as part of the refactoring of the time step and compute velocity updates. Fix #3593 (thanks @helmi77)
* If a Body collides with a Static Body it will now set the `blocked` properties accordingly (before it only set the `touching` properties.) This means you can now use checks like `Body.onFloor()` when traversing static bodies (thanks @fariazz)

### Data Manager New Features and Updates

* You can now access anything set in the DataManager using the new `values` property. For example, if you set a new value such as this: `data.set('gold', 50)` you can now access it via: `data.values.gold`, where it is treated as a normal property, allowing you to use it in conditional evaluations `if (data.values.level === 2)`, or modify it: `data.values.gold += 50`.
* Each time a value is updated it emits a `changedata` event, regardless if it is changed via the `set` method, or the new `values` approach.
* Each time a value is updated it emits a new event named after the value. For example, if the value was called `PlayerLives`, it will emit the event `changedata_PlayerLives`. This happens regardless if it is changed via the `set` method, or the new `values` approach.
* The `set` method can now take an object containing key value pairs as the first argument. This means you can now set a bunch of values all at once, i.e: `data.set({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 })`.
* The `get` method can now take an array of keys, and will return an array of matching values. This is handy for array destructuring in ES6.
* The `remove` method can now take an array of keys, and will remove all matching values, emitting the `removedata` event for each.
* The order of events has been updated. When a value is first set, and doesn't already exist in the Data Manager, it will emit a `setdata` event. If a value is set that already exists, it instead emits a `changedata` and related `changedata_key` event. Setting a new value no longer emits both events.
* The `resetFunction` function has been removed from the `changedata` event arguments. Previously this was used to allow you to stop a value being updated by calling the reset function instead. However, it created brand new anonymous functions every single time a value was updated. As you can now access stored data via the `values` property you can use this for much easier conditional checks and sets.
* The `blockSet` property has been removed as it's no longer used internally.

### Loader and Scene Updates

* Internally, the Loader has changed slightly. Rather than have each file cause the new batch to load, an `update` method is polled every frame, which does the same job instead. This avoids load-time race conditions where pre-populated files would trigger loads part way during an existing load, fixing #3705 in the process (thanks @the-simian)
* The Scene Manager has been updated so that it will call Scene.Systems.step during the `init`, `preload` and `create` phase of your Scene. This means that any plugins, or custom code, written to use the Scene Systems `preupdate`, `update` or `postupdate` events will need to be aware that these are now fired from `init` onwards, not just once `create` has finished.
* As a result of these two changes, there is a new Systems property called `sceneUpdate`, which is a reference that maps to your `Scene.update` function. During `init`, `preload` and `create` this is always mapped to NOOP. Once `create` has finished it gets re-mapped to your Scene's update function. If your Scene doesn't have one, it remains mapped to NOOP. In practise, this means nothing has changed from before. `Scene.update` never ran until `create` was completed, and it still doesn't. However, because the internal Scene systems are now updating right from `init`, it means that things like the update list and physics systems are fully operational _during_ your Preloader. This allows you to create far more elaborate preloaders than ever before. Although, with great power comes great responsibility, as the onus is now on you to be careful which events you consume (especially input events) during your preloader.
* Another side-effect of these changes is that Scenes no longer need an 'update' function at all. Previously, if they were missing one, the Scene Manager would inject one into them automatically. It no longer does this.

### New Features

* `RenderTexture.resize` will allow you to resize the underlying Render Texture to the new dimensions given. Doing this also clears the Render Texture at the same time (thanks @saqsun).
* `Rectangle.RandomOutside` is a new function that takes two Rectangles, `outer` and `inner`, and returns a random point that falls within the outer rectangle but is always outside of the inner rectangle.
* The Update List has a new read-only property `length`, making it consistent with the Display List (thanks @samme)
* The 2D Camera class has two new read-only properties `centerX` and `centerY` which return the coordinates of the center of the viewport, relative to the canvas (thanks @samme)
* Camera has a new property `visible`. An invisible Camera will skip rendering and input tests of everything it can see. This allows you to create say a mini-cam and then toggle it on and off without needing to re-create it each time.
* Camera has a new method `setVisible` which toggles its visible property.
* `CameraManager.fromJSON` will now set the visible property is defined in the config.
* `ScenePlugin.run` is a new method that will run the given Scene and not change the state of the current Scene at all. If the scene is asleep, it will be woken. If it's paused, it will be resumed. If not running at all, it will be started.
* `TextureManager.getPixelAlpha` is a new method that will return the alpha value of a pixel from the given texture and frame. It will return `null` if the coordinates were out of bounds, otherwise a value between 0 and 255.
* `Game.isOver` is a new read-only boolean property that indicates if the mouse pointer is currently over the game canvas or not. It is set by the VisibilityHandler and is only reliable on desktop systems.
* A new event `Game.mouseout` is dispatched if the mouse leaves the game canvas. You can listen to it from `this.sys.game.events.on('mouseout')` from within a Scene.
* A new event `Game.mouseover` is dispatched if the mouse enters the game canvas, having previously been outside of it. You can listen to it from `this.sys.game.events.on('mouseover')` from within a Scene.
* You can now use PhysicsEditor (https://www.codeandweb.com/physicseditor) to create complex Matter.js bodies. Load them as normal JSON and then just pass it to the Matter Sprite as a shape property: `this.matter.add.sprite(x, y, texture, frame, { shape: shapes.banana })` (where `shapes.banana` is one of the exported PhysicsEditor shapes in the JSON you loaded). See the 'physics/matterjs/advanced shape creation.js' example for more details.

### Updates

* The `ForwardDiffuseLightPipeline`, used by the Lights system, now sets a flag if the Scene doesn't contain any lights. All of the Game Objects now check this flag and don't even bother adding themselves to the batch if there are no lights in the Scene, as they'd never render anyway. This also avoids the ghost-image problem if you swap Scenes to a new Scene with the Light Manager enabled, but no actual lights defined. Fix #3707 (thanks @samvieten).
* `CameraManager.getCameraBelowPointer` has been renamed to `getCamerasBelowPointer` and it now returns an array of all the cameras below the given pointer, not just the top-most one. The array is sorted so that the top-most camera is at the start of the array.
* In `TimeStep.step` the `rawDelta` and `delta` values are checked to make sure they are non-negative, which can happen in Chrome when the delta is reset and out of sync with the value passed to Request Animation Frame. Fix #3088 (thanks @Antriel)
* `Cameras.Controls.Fixed` has been removed. It's was deprecated a few versions ago. Please use `FixedKeyControl` instead.
* `Cameras.Controls.Smoothed` has been removed. It's was deprecated a few versions ago. Please use `SmoothedKeyControl` instead.

### Bug Fixes

* The Canvas `RenderTexture.drawImage` method incorrectly set the values of the frame, causing them to appear wrongly scaled in the canvas renderer. Fix #3710 (thanks @saqsun).
* Fixed `Math.Matrix4.makeRotationAxis()` (thanks @hexus)
* Fixed an incorrect usage of `Math.abs()` in `Math.Quaternion.calculateW()` (thanks @qxzkjp).
* Particle Emitter Managers can now be added to Containers (thanks @TadejZupancic)
* Fixed a method signature issue with the Animation component's `remove()` handler when `Animation`s are removed from the `AnimationManager`. This prevented removed animations from stopping correctly.
* If you set Phaser to use a pre-existing Canvas element it is no longer re-added to the DOM (thanks @NQNStudios)
* The `TweenManager.getTweensOf` method has been fixed to remove a potential endless loop should multiple targets be passed in to it (thanks @cyantree)
* Interactive Objects inside of Containers would still fire their input events even if the Container (or any ancestor) was set to be invisible. Objects now check their ancestor tree during the input cull and now properly skip input events if not visible. Fix #3620 (thanks @NemoStein)
* Fixed Device.os incorrectly reporting Linux as OS on Android devices (thanks @AleBles)

### Examples, Documentation and TypeScript

Thanks to the work of @hexus we have now documented all of the Math namespace and made good progress on the Game Objects.

I personally have also documented the entire Input system, which was 328 classes, properties and methods to describe, as well as lots of other areas.
