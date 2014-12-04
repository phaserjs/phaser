![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

# Index

- [About](#about)
- [What's New?](#whats-new)
- [Getting Started](#getting-started)
- [Change Log](#change-log)
- [How to Build](#how-to-build)
- [Koding](#koding)
- [Bower / NPM](#bower)
- [CDNJS](#cdnjs)
- [Requirements](#requirements)
- [Build Files](#build-files)
- [Learn By Example](#example)
- [Features](#features)
- [Road Map](#road-map)
- [Mighty Editor](#mighty-editor)
- [Contributing](#contributing)
- [Bugs?](#bugs)
- [License](#license)

<a name="about"></a>
# Phaser 2.2.1

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.2.1 "Danabar" - Released: 4th December 2014

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* StackOverflow tag: [phaser-framework](http://stackoverflow.com/questions/tagged/phaser-framework)
* Source code for 400+ [Phaser Examples](https://github.com/photonstorm/phaser-examples) or [browse them online](http://examples.phaser.io)
* View the growing list of [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* Read the [documentation online](http://docs.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* Subscribe to the [Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and we'll email you when new versions are released.
* Please help support our work via [Gittip](https://www.gittip.com/photonstorm/)

![div](http://phaser.io/images/div4.png)

<a name="whats-new"></a>
## Welcome to Phaser and What's new in 2.2.1?

One of the nicest and most surprising things about a truly open-source project like Phaser is that you never know who might jump on for the ride. I've been extremely lucky with the support I've received over the years - fellow developers both fixing bugs and reporting issues, all helping to make Phaser  stronger as a result.

But sometimes a single individual can come along and make a substantial difference all on their own. A quick glance at the Change Log for this release will show many different contributors, but one stood out more than any other: [Paul Stickney](https://github.com/pnstickne). Thanks to his contributions alone Phaser is now sporting a powerful new Scale Manager, nicely updated API docs and many other fixes and features across the board. The Scale Manager, a core part of any HTML5 game has had its own book published about it: [A Guide to the Phaser Scale Manager](https://leanpub.com/phaserscalemanager) which is available now.

One of his other major contributions was in updating Signals, the event system used inside Phaser. Before Phaser was creating thousands of Signals in a busy game, most of which sat idle. Now they've gone on a diet in terms of memory consumption and hide behind a proxy causing them to not even be created unless needed. This has cut down on the amount of objects being generated every frame dramatically.

As you may have noticed we've bumped the release version to 2.2 from 2.1. This is because there are some API breaking changes and some core fundamentals have been updated as well. The biggest change here is the move to a proper fixed-step internal game loop. The logic and rendering are now fully decoupled, with both Arcade Physics and Tweens having been updated to use this new system. This is by no means a panacea for overloading low-powered mobile devices. However it will help prevent issues arising from devices running Phaser games at different speeds just because it has a slower processor.

Also given a large update is the Tween Manager. This is now hooked in to the new timestep code, smoothing out tweens when the frame rate drops. New features have been added, including the ability to pause and resume a whole timeline of tweens and tween chaining has vastly improved.

The Change Log is indeed extensive. I would say that if you are *already* working on a Phaser game, and a good way through development, then you should carry on with whatever version you used before. But for all new projects definitely take the leap into 2.2 and I hope you enjoy splashing around in its new features :)

Thank you to everyone who beta tested 2.2 with us in one of its many Release Candidate incarnations. Your feedback helped fix issues that would have been otherwise troublesome to find and it's a process we'll carry on with for future builds.

2014 has been an amazing year for Phaser and I'd like to take this opportunity to thank everyone who has been involved, one way or another. Your support has been fantastic and we've built great things. Here's to 2015.

Happy coding everyone! I hope to see you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://phaser.io/images/div1.png)

<a name="getting-started"></a>
## Getting Started Guides

We have a [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

We wrote a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide for GameDevTuts+  which covers finding tutorials, examples and support.

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

Finally the list of [community authored Phaser Tutorials](http://www.lessmilk.com/phaser-tutorial/) is growing fast!

![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

![div](http://phaser.io/images/div2.png)

<a name="change-log"></a>
## Change Log

Version 2.2.1 - "Danabar" - 4th December 2014

### Bug Fixes

* Fixed Pixi.js issue with `alpha` not working on any display object.
* Fixed TweenManager.isTweening() and .removeFrom() (thanks @jotson #1408)
* Added Game.debug reset method for when the debug manager is disabled (thanks @DanielSitarz #1407)
* Custom Particle classes that used a BitmapData wouldn't work (thanks @hardalias #1402)

## Version 2.2.0 - "Bethal" - 3rd December 2014

### New Features

* Updated to Pixi v2.2.0 - see separate change log entry below.
* Cache.getRenderTexture will retrieve a RenderTexture that is stored in the Phaser Cache. This method replaces Cache.getTexture which is now deprecated.
* Cache.autoResolveURL is a new boolean (default `false`) that automatically builds a cached map of all loaded assets vs. their absolute URLs, for use with Cache.getURL and Cache.checkURL. Note that in 2.1.3 and earlier this was enabled by default, but has since been moved behind this property which needs to be set to `true` *before* you load any assets to enable.
* You can now call Tween.to again on a Tween that has already completed. This will re-use the same tween, on the original object, without having to recreate the Tween again. This allows a single tween instance to be re-used multiple times, providing they are linked to the same object (thanks InsaneHero)
* Phaser.Color.valueToColor converts a value: a "hex" string, a "CSS 'web' string", or a number - into red, green, blue, and alpha components (thanks @pnstickne #1264)
* Stage.backgroundColor now supports CSS 'rgba' values, as well as hex strings and hex numbers (thanks @pnstickne #1234)
* Pointer.addClickTrampoline now adds in support for click trampolines. These  raise pointer events into click events, which are required internally for a few edge cases like IE11 full screen mode support, but are also useful if you know you specifically need a DOM click event from a pointer (thanks @pnstickne #1282)
* Point.floor will Math.floor both the `x` and `y` values of the Point.
* Point.ceil will Math.ceil both the `x` and `y` values of the Point.
* ScaleManager.scaleSprite takes a Sprite or Image object and scales it to fit the given dimensions. Scaling happens proportionally without distortion to the sprites texture. The letterBox parameter controls if scaling will produce a letter-box effect or zoom the sprite until it fills the given values.
* Phaser.DOM.getBounds is a cross-browser element.getBoundingClientRect method with optional cushion.
* Phaser.DOM.calibrate is a private method that calibrates element coordinates for viewport checks.
* Phaser.DOM.aspect gets the viewport aspect ratio (or the aspect ratio of an object or element)
* Phaser.DOM.inViewport tests if the given DOM element is within the viewport, with an optional cushion parameter that allows you to specify a distance.
* Phaser.DOM.viewportWidth returns the viewport width in pixels.
* Phaser.DOM.viewportHeight returns the viewport height in pixels.
* Phaser.DOM.documentWidth returns the document width in pixels.
* Phaser.DOM.documentHeight returns the document height in pixels.
* TilemapLayers have been given a decent performance boost on canvas with map shifting edge-redraw (thanks @pnstickne #1250)
* A large refactor to how the internal game timers and physics calculations has been made. We've now swapped to using a fixed time step internally across Phaser, instead of the variable one we had before that caused glitchse on low-fps systems. Thanks to pjbaron for his help with all of these related changes.
* We have separated the logic and render updates to permit slow motion and time slicing effects. We've fixed time calling to fix physics problems caused by variable time updates (i.e. collisions sometimes missing, objects tunneling, etc)
* Once per frame calling for rendering and tweening to keep things as smooth as possible
* Calculates a `suggestedFps` value (in multiples of 5 fps) based on a 2 second average of actual elapsed time values in the `Time.update` method.  This is recalculated every 2 seconds so it could be used on a level-by-level basis if a game varies dramatically. I.e. if the fps rate consistently drops, you can adjust your game effects accordingly.
* Game loop now tries to "catch up" frames if it is falling behind by iterating the logic update. This will help if the logic is occasionally causing things to run too slow, or if the renderer occasionally pushes the combined frame time over the FPS time. It's not a band-aid for a game that floods a low powered device however, so you still need to code accordingly. But it should help capture issues such as gc spikes or temporarily overloaded CPUs.
* It now detects 'spiraling' which happens if a lot of frames are pushed out in succession meaning the CPU can never "catch up". It skips frames instead of trying to catch them up in this case. Note: the time value passed to the logic update functions is always constant regardless of these shenanigans.
* Signals to the game program if there is a problem which might be fixed by lowering the desiredFps
* Time.desiredFps is the new desired frame rate for your game.
* Time.suggestedFps is the suggested frame rate for the game based on system load.
* Time.slowMotion allows you to push the game into a slow motion mode. The default value is 1.0. 2.0 would be half speed, and so on.
* Time.timeCap is no longer used and now deprecated. All timing is now handled by the fixed time-step code we've introduced.
* Time.now can no longer be relied upon to contain a timestamp value. If the browser supports requestAnimationFrame then `Time.now` will contain the high resolution timer value that rAf generates. Otherwise it will contain the value of Date.now. If you require the actual time value (in milliseconds) then please use `Time.time` instead. Note that all Phaser sub-systems that used to rely on `Time.now` have been updated, so if you have any code that extends these please be sure to check it.
* Game.forceSingleUpdate will force just a single logic update, regardless of the delta timer values. You can use this in extremely heavy CPU situations where you know you're about to flood the CPU but don't want Phaser to get stuck in a spiral.
* Tilemap.createFromTiles will convert all tiles matching the given tile index (or an array of indexes) into Sprites. You can optionally then replace these tiles if you wish. This is perfect for games when you want to turn specific tiles into Sprites for extra control. The Sprites have an optional properties object which they can be populated with.
* Added support for the Wheel Event, which is the DOM3 spec (thanks @pnstickne #1318)
* Wheel Scroll Event (old non-FF) and DOM Mouse Wheel (old FF) are
supported via a non-exported reused wrapper object; WheelEventProxy.
The proxy methods are generated one-time dynamically but only when needed.
* Key.justDown allows you to test if a Key has just been pressed down or not. You can only call justDown once per key press. It will only return `true` once, until the Key is released and pressed down again. This allows you to use it in situations where you want to check if this key is down without using a Signal, such as in a core game loop (thanks @pjbaron #1321)
* Key.justUp allows you to test if a Key has just been released or not. You can only call justUp once per key press. It will only return `true` once, until the Key is pressed down and released again. This allows you to use it in situations where you want to check if this key is up without using a Signal, such as in a core game loop (thanks @pjbaron #1321)
* Device.whenReady is a new signal that you can use to tell when the device is initialized.
* Device.onInitialized is dispatched after device initialization occurs but before any of the ready callbacks have been invoked. Local "patching" for a particular device can/should be done in this event.
* TweenManager.removeFrom method allows you to remove a tween from a game object such as a Sprite (thanks @lewster32 #1279)
* Tweens have been completely rewritten. They're now much more flexible and  efficient than before:
* When specifying the ease in `Tween.to` or `Tween.from` you can now use a string instead of the Function. This makes your code less verbose. For example instead of `Phaser.Easing.Sinusoidal.Out` and you can now just use the string "Sine".The string names match those used by TweenMax and includes: "Linear", "Quad", "Cubic", "Quart", "Quint", "Sine", "Expo", "Circ", "Elastic", "Back", "Bounce", "Power0", "Power1", "Power2", "Power3" and "Power4". You can append ".easeIn", ".easeOut" and "easeInOut" variants. All are supported for each ease types.
* Tweens now create a TweenData object. The Tween object itself acts like more of a timeline, managing multiple TweenData objects. You can now call `Tween.to` and each call will create a new child tween that is added to the timeline, which are played through in sequence.
* Tweens are now bound to the new Time.desiredFps value and update based on the new Game core loop, rather than being bound to time calculations. This means that tweens are now running with the same update logic as physics and the core loop.
* Tween.timeScale allows you to scale the duration of a tween (and any child tweens it may have). A value of 1.0 means it should play at the desiredFps rate. A value of 0.5 will run at half the frame rate, 2 at double and so on. You can even tween the timeScale value for interesting effects!
* Tween.reverse allows you to instantly reverse an active tween. If the Tween has children then it will smoothly reverse through all child tweens as well.
* Tween.repeatAll allows you to control how many times all child tweens will repeat before firing the Tween.onComplete event. You can set the value to -1 to repeat forever.
* Tween.loop now controls the looping of all child tweens.
* Tween.onRepeat is a new signal that is dispatched whenever a Tween repeats. If a Tween has many child tweens its dispatched once the sequence has repeated.
* Tween.onChildComplete is a new signal that is dispatched whenever any child tweens have completed. If a Tween consists of 4 sections you will get 3 onChildComplete events followed by 1 onComplete event as the final tween finishes.
* Chained tweens are now more intelligently handled. Because you can easily create child tweens (by simply calling Tween.to multiple times) chained tweens are now used to kick-off longer sequences. You can pass as many Tween objects to `Tween.chain` as you like as they'll all be played in sequence. As one Tween completes it passes on to the next until the entire chain is finished.
* Tween.stop has a new `complete` parameter that if set will still fire the onComplete event and start the next chained tween, if there is one.
* Tween.delay, Tween.repeat, Tween.yoyo, Tween.easing and Tween.interpolation all have a new `index` parameter. This allows you to target specific child tweens, or if set to -1 it will update all children at once.
* Tween.totalDuration reports the total duration of all child tweens in ms.
* There are new easing aliases:
* * Phaser.Easing.Power0 = Phaser.Easing.Linear.None
* * Phaser.Easing.Power1 = Phaser.Easing.Quadratic.Out
* * Phaser.Easing.Power2 = Phaser.Easing.Cubic.Out
* * Phaser.Easing.Power3 = Phaser.Easing.Quartic.Out
* * Phaser.Easing.Power4 = Phaser.Easing.Quintic.Out
* ScaleManager.windowContraints now allows specifying 'visual' or 'layout' as
the constraint. Using the 'layout' constraint should prevent a mobile
device from trying to resize the game when zooming.

    Including the the new changes the defaults have been changed to

    windowContraints = { right: 'layout', bottom: '' }

    This changes the current scaling behavior as seen in "Game Scaling" (as it
will only scale for the right edge) but also prevents such scaling from
going bonkers in some mobile environments like the newer Android browser.
(Automatic scroll-to-top, albeit configurable, enabled for non-desktop by
default is not a fun situation here.)

    To obtain the current semantics on a desktop the bottom should be changed
to 'layout'; although this will result in different behavior depending on
mobile device. To make the sizing also follow mobile zooming they should
be changed to 'visual'.

    Also added temp Rectangle re-used for various internal calculations.

* Phaser.DOM now also special-cases desktops to align the layout bounds
correctly (this may disagree with CSS breakpoints but it aligns the with
actual CSS width), without applying a window height/width expansion as
required on mobile browsers.
* Signals have been heavily restructured to cut down on the number that are generated in-game. New signal proxies manage the setting and creation as required, cutting down on the volume of run-time object creation significantly. No user code needs to change, however if you did override Phaser.Signal or Sprite.Events then please be aware of the changes by inspecting the source (and commit #1389 by @pnstickne).
* Game.lockRender is a new property. If `false` Phaser will automatically render the display list every update. If `true` the render loop will be skipped. You can toggle this value at run-time to gain exact control over when Phaser renders. This can be useful in certain types of game or application. Please note that if you don't render the display list then none of the game object transforms will be updated, so use this value carefully.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @draconisNoctis)
* The TypeScript definitions have moved to the `typescript` folder in the root of the repository.
* Cache._resolveUrl has been renamed to Cache._resolveURL internally and gained a new parameter. This method is a private internal one.
* Cache.getUrl is deprecated. The same method is now available as Cache.getURL.
* Loader.useXDomainRequest used to be enabled automatically for IE9 but is now always set to `false`. Please enable it only if you know your server set-up / CDN requires it, as some most certainly do, but we're finding them to be less and less used these days, so we feel it's safe to now disable this by default (#1248)
* Game.destroy now destroys either the WebGLRenderer or CanvasRenderer, whichever Pixi was using.
* Particle.Emitter will now automatically set `particle.body.skipQuadTree` to `true` to help with collision speeds within Arcade Physics.
* Particle.Emitter.explode (or `Emitter.start` with the `explode` parameter set to `true`) will immediately emit the required quantity of particles and not delay until the next frame to do so. This means you can re-use a single emitter across multiple places in your game that require explode-style emissions, just by adjusting the `emitter.x` and `emitter.y` properties before calling explode (thanks Insanehero)
* Phaser.Polygon has been refactored to address some Pixi v2 migration issues (thanks @pnstickne for the original implementation #1267)
* Polygon.area is now only calculated when the Polygon points list is modified, rather than on every call.
* Phaser.Polygon can now accept the points list in a variety of formats: Arrays of Points, numbers, objects with public x/y properties or any combination of, or as a parameter list (thanks @pnstickne for the original implementation #1267)
* All of the Input classes now use the more consistent `enabled` property instead of `disabled`. I.e. you can now check `if (input.mouse.enabled)` rather than `if (!input.mouse.disabled)`. The disabled property has been moved to a getter for backwards compatibility but is deprecated and will be removed in a future version (thanks @pnstickne #1257)
* The Input class has been given a minor refactor to tidy things up. Specifically:
    * pointerN are aliases to backed pointers[N-1] array. This simplifies (and increases the efficiency of) looping through all the pointers when applicable; also eliminates pointer-existence checks Removes various hard-coded limits (added MAX_POINTERS); changed maxPointers default
    * Removed some special-casing from cases where it did not matter
    * Removed === false/true, == usage for consistency, changed missing value check to typeof, etc.
    * Updated documentation for specificity; added @public\@protected
    * @deprecated currentPointers due to odd set pattern; totalCurrentPointers is more appropriate.
(thanks @pnstickne #1283)
* Various ScaleManager fixes and updates (thanks @pnstickne):
    * Scale modes can now be set independently
    * Switching between fullscreen and normal correctly restores modes
    * Alignment does not incorrectly offset in fullscreen mode (#1255)
    * Changing scale/alignment promptly refreshes layout
    * `isFullScreen` returns a boolean, as it should
    * Faster parent checks (if required)
    * NO_SCALE should not not scale (vs previous behavior of having no behavior)
    * Correct usage of scaleMode depending on mode
    * Fullscreen Mode always scaling to fill screen in Firefox (#1256)
* AudioSprite - removed an unnecessary if-statement (thanks @DaanHaaz #1312)
* ArcadePhysics.skipQuadTree is now set to `true` by default. A QuadTree is a wonderful thing if the objects in your game are well spaced out. But in tightly packed games, especially those with tilemaps or single-screen games, they are a considerable performance drain and eat up CPU. We've taken the decision to disable the Arcade Physics QuadTree by default. It's all still in there and can be re-enabled via `game.physics.arcade.skipQuadTree = false`, but please only do so if you're sure your game benefits from this.
* Phaser.DOM now houses new DOM functions. Some have been moved over from ScaleManager as appropriate.
* Key.justPressed has bee renamed to Key.downDuration which is a much clearer name for what the method actually does. See Key.justDown for a nice clean alternative.
* Key.justReleased has bee renamed to Key.upDuration which is a much clearer name for what the method actually does. See Key.justUp for a nice clean alternative.
* Keyboard.justPressed has bee renamed to Keyboard.downDuration which is a much clearer name for what the method actually does.
* Keyboard.justReleased has bee renamed to Keyboard.upDuration which is a much clearer name for what the method actually does.
* Keyboard.downDuration, Keyboard.upDuration and Keyboard.isDown now all return `null` if the Key wasn't found in the local keys array.
* The Phaser.Device class has been made into a singleton and removed it's dependency on Phaser.Game (thanks @pnstickne #1328)
* ArrayList has been renamed to `ArraySet` (as it's actually a data set implementation) and moved from the `core` folder to the `utils` folder (thanks @pnstickne)
* If you are reloading a Phaser Game on a page that never properly refreshes (such as in an AngularJS project) then you will quickly run out of AudioContext nodes. If this is the case create a global var called `PhaserGlobal` on the window object before creating the game. The active AudioContext will then be saved to `window.PhaserGlobal.audioContext` when the Phaser game is destroyed, and re-used when it starts again (#1233)
* Camera.screenView is now deprecated. All Camera culling checks are made against Camera.view now instead.
* Various CocoonJS related hacks removed thanks to fixes from Ludei directly in CocoonJS! Woohoo :)
* Phaser.HEADLESS check removed from the core game loop. If you need to disable rendering you can now override the Phaser.Game.updateRender method instead with your own.
* Group.forEach fixed against browser de-optimization (thanks @pnstickne #1357)
* Phaser.Signals have been taken on a diet. They have been updated such that there is significantly less penalty for having many unused signals. The changes include:
* * Changing it so there is no dispatch *closure* created. This is a
potentially breaking change for third party code.
* * In the rare case that code needs to obtain a dispatch-closure, the
`boundDispatch` property can be used to trivially obtain a cached
closure.
* * The properties and default values are moved into the prototype; and the
_bindings array creation is deferred. This change, coupled with the
removal of the automatic closure, results in a very lightweight
~24bytes/object (in Chrome) for unbound signals.
* With this change in place Signals now consume less than 50KB / 50KB (shallow / retained memory) for 200 sprites, where-as before they used 300KB / 600KB (thanks @pnstickne #1359)
* Time.elapsedMS holds the number of milliseconds since the last Game loop, regardless of raF or setTimout being used.
* Incorrectly prepared tilemap images (with dimensions not evenly divisible by the tile dimensions) would render incorrectly when compared to the display seen in Tiled. The Phaser tilemap code has been adjusted to match the way Tiled deals with this, which should help if you're using tileset images that contain extra padding/margin pixels. Additional console warnings have been added. However the fact remains that you should carefully prepare your tilesets before using them. Crop off extra padding, make sure they are the right dimensions (thanks @SoulBeaver for the report and @pnstickne for the fix #1371)
* Text.setShadow has had the default `color` value changed from `rgba(0,0,0,0)` to `rgba(0,0,0,1)` so it appears as a black shadow by default - before the alpha channel made it invisible.
* Math.getRandom will now return `null` if random selection is missing, or array has no entries (thanks @pnstickne #1395)
* Array.transposeArray has had a small off-by-one error fixed. It didn't effect the results but meant returned arrays were 1 element bigger than needed (thanks @nextht #1394)
* State.preRender is now sent two parameters: a reference to the Phaser.Game instance and a new parameter: `elapsedTime` which is the time elapsed since the last update.

### Bug Fixes

* Tilemaps in WebGL wouldn't update after the first frame due to a subtle change in how Pixi uploads new textures to the GPU.
* XML files weren't being added to the URL map.
* Cache._resolveURL was causing a Sound double-load in Firefox and causing errors (thanks @domonyiv #1253)
* Loader.json was using the wrong context in IE9 with XDomainRequest calls (thanks @pnstickne #1258)
* Text.updateText was incorrectly increasing the size of the texture each time it was called (thanks @spayton #1261)
* Polygon.contains now correctly calculates the result  (thanks @pnstickne @BurnedToast #1267)
* Setting Key.enabled = false while it is down did not reset the isDown state (thanks @pnstickne #1190 #1271)
* The Gamepad.addCallbacks context parameter was never actually remembered, causing the callbacks to run in the wrong context (thanks @englercj #1285)
* Animation.setFrame used the wrong frames array if `useLocalFrameIndex` was `false` and a numeric frame ID was given (thanks @Skeptron #1284)
* Fullscreen mode in IE11 now works (thanks @pnstickne)
* Cache.addBitmapData now auto-creates a FrameData (thanks @pnstickne #1294 #1300)
* P2.BodyDebug circles were drawing at half widths (thanks @enriqueto #1288)
* FrameData.clone fixed when cloning data using frame names rather than indexes (thanks pjbaron)
* Lots of the Cache getters (such as `Cache.getbitmapData`) would return `undefined` if the asset couldn't be found. They now all consistently return `null` for missing entries (thanks @Matoking #1305)
* Phaser games should now work again from the CocoonJS Launcher.
* Only one of the mouse wheel events is listened to, newest standard first.
This fixes a bug in FF where it would use the default DOMMouseWheel (thanks @pnstickne #1313)
* Stage.smoothed needed to modify the value of PIXI.scaleMode.DEFAULT instead of PIXI.scaleMode.LINEAR (thanks @pixelpicosean #1322)
* Newly created Groups always had zero z index (thanks @spayton #1291)
* Sprite.autoCull now properly works if the camera moves around the world.
* Sprite.inCamera uses a much faster check if auto culling or world bounds checks are enabled and properly adjusts for camera position.
* Camera.totalInView is a new property that contains the total number of Sprites rendered that have `autoCull` set to true and are within the Cameras view.
* Emitter.setScale fixed minX minY order precedence (thanks spayton)
* Group.iterate can now accept undefined/null as the arguments (thanks @pnstickne #1353 @tasos-ch #1352)
* When you change State the P2 Physics world is no longer fully cleared. All of the bodies, springs, fixtures, materials and constraints are removed - but config settings such as gravity, restitution, the contact solver, etc are all retained. The P2.World object is only created the very first time you call Physics.startSystem. Every subsequent call hits P2.World.reset instead. This fixes "P2.World gravity broken after switching states" (and other related issues) (#1292 #1289 #1176)
* Text.lineSpacing works correctly again. Before no space was added between the lines (thanks @intimidate #1367 and @brejep #1366)
* P2.BodyDebug always lagged behind the position of the Body it was tracking by one frame, which became visible at high speeds. It now syncs its position in the Body.postUpdate which prevents this from happening (thanks @valueerror)
* A State.preRender callback wasn't removed correctly when switching States.

### Pixi 2.1.0 New Features

* unloadFromGPU added to PIXI.BaseTexture
* PIXI.VideoTexture added
* PIXI.RoundedRectangle added
* Ensured all float32arrays use PIXI.Float32Array
* Removed the use of call in updateTransform (as its 10x faster to run the function directly)
* autoResize option added to renderer options (default is false). Pixi no longer automatically changes the style of the canvas.
* PIXI.RenderTexture.getCanvas optimized

### Pixi 2.1.0 Bug Fixes

* Fix destroy method of PIXI.WebGLRenderer
* Fixed Graphics.drawRoundedRectangle 
* Fixed Graphics.arcTo issue
* Fixed Graphics.arc issue
* Fixed Graphics.cacheAsBitmap alpha issue
* Fixed PIXI.Strip alpha issue
* Fixed PIXI.DisplayObject.cacheAsBitmap alpha issue
* Fixed PIXI.RenderTexture Canvas Clear bug
* Fixed PIXI.DisplayObject.updateTransform issue 
* Fixed webGL Shader textures issue
* Fixed PIXI.DisplayObject.getLocalPosition()
* Fixed CocoonJS crashing, when loading destroyed texture
* Fix eventTarget emit bug

For details about changes made in previous versions of Phaser see the full Change Log at https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md

![div](http://phaser.io/images/div3.png)

<a name="how-to-build"></a>
## How to Build

We provide a fully compiled version of Phaser in the `build` folder, in both plain and minified formats.

You will also find custom builds in the `build\custom` folder, that split phaser up into components.

We also provide a Grunt script that will build Phaser from source.

Run `grunt` to perform a default build to the `dist` folder.

If you replace Pixi or p2 then run `grunt replace` to patch their UMD strings so they work properly with Phaser and requireJS.

Note: Some of you may not be aware, but the `phaser.min.js` file in the build folder contains both Arcade Physics and P2 Physics bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180KB from the minified file size.

![div](http://phaser.io/images/div4.png)

<a name="koding"></a>
## Koding

You can [clone the Phaser repo in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and then start editing and previewing code right away using their web based VM development system.

![div](http://phaser.io/images/div5.png)

<a name="bower"></a>
## Bower / NPM

If you use bower you can install phaser with:

`bower install phaser`

If you use NPM you can install phaser with:

`npm install phaser`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

![div](http://phaser.io/images/div6.png)

<a name="cdnjs"></a>
## CDNJS

Phaser is now available on [CDNJS](http://cdnjs.com). You can include the following in your html:

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.2.1/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.2.1/phaser.min.js`

![div](http://phaser.io/images/div1.png)

<a name="requirements"></a>
## Requirements

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above. But as always be aware of browser limitations. Not all features of Phaser work on all browsers.

### IE9

If you need to support IE9 or Android 2.x and want to use P2 physics then you must use the polyfill found in the `resources/IE9 Polyfill` folder. If you don't require P2 Physics (or don't care about IE9!) then you don't need this polyfill.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code your games, and were careful not to impose any form of class / inheritance / structure upon you. So you won't find it split into require modules or pull in 3rd party npm packages for example. That doesn't mean you can't, it just means we don't force you to do so. If you're a requireJS user you'll find a new template in the `resources\Project Templates` folder just for you.

If you code with [TypeScript](http://www.typescriptlang.org/) you'll find a comprehensive definitions file inside the `typescript` folder and tutorials on getting started on our site. This definitions file is for TypeScript 1.0+. If you are using an earlier version of TypeScript (i.e. 0.9.5) you will need to include the WebGL definitions into your project first. This file isn't included with Phaser.

<a name="build-files"></a>
### Build Files and Custom Builds

The `build` folder contains the pre-built packaged versions of Phaser.

Phaser is 153 KB *gzipped and minified* when including *both* Arcade Physics and the full P2 Physics engine.

If you don't require P2 you can save yourself nearly 200 KB from the minified size and instead use the `phaser-arcade-physics.min.js` file found inside the `build/custom` folder. This version is only 115 KB gzipped and minified.

If you don't need any physics system at all, or are implementing your own, there is an even smaller build: `phaser-no-physics.min.js` in the `custom` folder that is only 102 KB gzipped and minified. Please note that this build doesn't include Tilemaps or Particle Emitter support either, as both rely on Arcade Physics.

You can create your own custom build of Phaser by looking at the grunt options and manifests in the tasks folder.

![div](http://phaser.io/images/div3.png)

<a name="example"></a>
## Learn By Example

Ever since we started Phaser we've been growing and expanding our extensive set of Examples. Currently over 400 of them!

They used to be bundled in the main Phaser repo, but because they got so large and in order to help with versioning we've moved them to their own repo.

So please checkout https://github.com/photonstorm/phaser-examples

Here you'll find an ever growing suite of Examples. Personally I feel that developers tend to learn better by looking at small refined code examples, so we created hundreds of them, and create new ones to test new features and updates. Inside the `examples` repo you'll find the current set. If you write a particularly good example then please send it to us.

The examples need to be run through a local web server (in order to avoid file access permission errors from your browser). You can use your own web server, or start the included web server using grunt.

Using a locally installed web server browse to the examples folder:

    examples/index.html

Alternatively in order to start the included web server, after you've cloned the repo, run `npm install` to install all dependencies, then `grunt connect` to start a local server. After running this command you should be able to access your local webserver at `http://127.0.0.1:8000`. Then browse to the examples folder: `http://127.0.0.1:8000/examples/index.html`

There is a 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation. And if you've got php installed into your web server you may want to try `debug.php`, which provides a minimal examples list and debug interface.

You can also browse all [Phaser Examples](http://examples.phaser.io) online.

![div](http://phaser.io/images/div4.png)

<a name="features"></a>
## Features

**WebGL &amp; Canvas**

Phaser uses both a Canvas and WebGL renderer internally and can automatically swap between them based on browser support. This allows for lightning fast rendering across Desktop and Mobile. When running under WebGL Phaser now supports shaders, allowing for some incredible in-game effects. Phaser uses and contributes towards the excellent Pixi.js library for rendering.

**Preloader**

We've made the loading of assets as simple as one line of code. Images, Sounds, Sprite Sheets, Tilemaps, JSON data, XML and JavaScript files - all parsed and handled automatically, ready for use in game and stored in a global Cache for Sprites to share.

**Physics**

Phaser ships with our Arcade Physics system, Ninja Physics and P2.JS - a full body physics system. Arcade Physics is for high-speed AABB collision only. Ninja Physics allows for complex tiles and slopes, perfect for level scenery, and P2.JS is a full-body physics system, with constraints, springs, polygon support and more.

**Sprites**

Sprites are the life-blood of your game. Position them, tween them, rotate them, scale them, animate them, collide them, paint them onto custom textures and so much more!
Sprites also have full Input support: click them, touch them, drag them around, snap them - even pixel perfect click detection if needed.

**Groups**

Group bundles of Sprites together for easy pooling and recycling, avoiding constant object creation. Groups can also be collided: for example a "Bullets" group checking for collision against the "Aliens" group, with a custom collision callback to handle the outcome.

**Animation**

Phaser supports classic Sprite Sheets with a fixed frame size, Texture Packer and Flash CS6/CC JSON files (both Hash and Array formats) and Starling XML files. All of these can be used to easily create animation for Sprites.

**Particles**

An Arcade Particle system is built-in, which allows you to create fun particle effects easily. Create explosions or constant streams for effects like rain or fire. Or attach the Emitter to a Sprite for a jet trail.

**Camera**

Phaser has a built-in Game World. Objects can be placed anywhere within the world and you've got access to a powerful Camera to look into that world. Pan around and follow Sprites with ease.

**Input**

Talk to a Phaser.Pointer and it doesn't matter if the input came from a touch-screen or mouse, it can even change mid-game without dropping a beat. Multi-touch, Mouse, Keyboard and lots of useful functions allow you to code custom gesture recognition.

**Sound**

Phaser supports both Web Audio and legacy HTML Audio. It automatically handles mobile device locking, easy Audio Sprite creation, looping, streaming and volume. We know how much of a pain dealing with audio on mobile is, so we did our best to resolve that!

**Tilemaps**

Phaser can load, render and collide with a tilemap with just a couple of lines of code. We support CSV and Tiled map data formats with multiple tile layers. There are lots of powerful tile manipulation functions: swap tiles, replace them, delete them, add them and update the map in realtime.

**Device Scaling**

Phaser has a built-in Scale Manager which allows you to scale your game to fit any size screen. Control aspect ratios, minimum and maximum scales and full-screen support.

**Plugin system**

We are trying hard to keep the core of Phaser limited to only essential classes, so we built a smart Plugin system to handle everything else. Create your own plugins easily and share them with the community.

**Mobile Browser**

Phaser was built specifically for Mobile web browsers. Of course it works blazingly fast on Desktop too, but unlike lots of frameworks mobile was our main focus. If it doesn't perform well on mobile then we don't add it into the Core.

**Developer Support**

We use Phaser every day on our many client projects. As a result it's constantly evolving and improving and we jump on bugs and pull requests quickly. This is a living, breathing framework maintained by a commercial company with custom feature development and support packages available. We live and breathe HTML5 games.

**Battle Tested**

Phaser has been used to create hundreds of games, which receive millions of plays per month. We're not saying it is 100% bug free, but we use it for our client work every day, so issues get resolved <em>fast</em> and we stay on-top of the changing browser landscape.

![FruitParty](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_fruit_particles-640x480.png)

![div](http://phaser.io/images/div6.png)

<a name="road-map"></a>
## Road Map

Here are some of the features planned for future releases. Not all features are promised to be delivered, and no timescale is put against any of them either.

### Version 2.3 ("Tarabon")

* New parallel asset loader (already started in dev branch)
* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Updated Text handling
* Look carefully at the internal structure of Phaser to avoid method repetition (such as Sprite.crop and Image.crop), investigate using mixins to help reduce overall codebase size.
* Restore Math.interpolateAngles and Math.nearestAngleBetween
* Scene Manager - json scene parser.
* Touch Gestures.
* Adjust how Pointers and Interactive Objects work. Allow an IO to be flagged as "on click only", so it doesn't ever get processed during normal Pointer move events (unless being dragged)
* Allow multiple drag items - no longer bind just 1 to a Pointer
* Allow Groups to have Priority IDs too and input disable entire Groups and all children (let it flow down the chain)
* Allow Groups to be InputEnabled? Dragging a Group would be really useful.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.

### Version 2.4

* Ability to control DOM elements from the core game and layer them into the game.
* Game parameters stored in Google Docs.
* Optimised global Animation manager to cut down on object creation.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.
* DragonBones support.

### Phaser 3

Development has now begun on Phaser 3. At the moment it's still in the very early stages. We are asking for suggestions and feedback in [this forum thread](http://www.html5gamedevs.com/topic/7949-the-phaser-3-wishlist-thread/) so be sure to add your voice.

We are currently experimenting with an ES6 based module system and we're keen for Phaser 3 to use as many native ES6 features as possible. It will be a significant refactoring of the code base, but never at the expense of features or ease-of-use. Development will be made public when the time is right.

We don't anticipate a release until Summer 2015. Phaser 2 still has roadmap features left that we'd like to implement, but after 2.3 it will be in  maintenance mode as we work on Phaser 3.

If you are an exceptional JavaScript developer and would like to join the Phaser 3 development team then let us know. We have a limited budget available to pay towards your time.

![div](http://phaser.io/images/div1.png)

<a name="mighty-editor"></a>
## Mighty Editor - A Visual Phaser Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![div](http://phaser.io/images/div2.png)

<a name="contributing"></a>
## Contributing

We now have a full [Contributors Guide][contribute] which goes into the process in more detail, but here are the headlines:

- If you find a bug then please report it on [GitHub Issues][issues] or our [Support Forum][forum].

- If you have a feature request, or have written a game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you! Either post to our [forum][forum] or email: rich@photonstorm.com

- If you issue a Pull Request for Phaser, please only do so againt the `dev` branch and *not* against the `master` branch.

- Before submitting a Pull Request please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, run `grunt jshint`. This isn't a strict requirement and we are happy to receive Pull Requests that haven't been JSHinted, so don't let it put you off contributing, but do know that we'll reformat your source before going live with it.

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

![div](http://phaser.io/images/div3.png)

<a name="bugs"></a>
## Bugs?

Please add them to the [Issue Tracker][issues] with as much info as possible, especially source code demonstrating the issue.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

"Being negative is not how we make progress" - Larry Page, Google

![div](http://phaser.io/images/div4.png)

<a name="license"></a>
## License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

[issues]: https://github.com/photonstorm/phaser/issues
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[phaser]: https://github.com/photonstorm/phaser
[forum]: http://www.html5gamedevs.com/forum/14-phaser/

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

