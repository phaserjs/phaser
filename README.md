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
# Phaser 2.2.0

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.2.0 "Bethal" - Released: -in development-

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* StackOverflow tag: [phaser-framework](http://stackoverflow.com/questions/tagged/phaser-framework)
* Source code for 320+ [Phaser Examples](https://github.com/photonstorm/phaser-examples) or [browse them online](http://examples.phaser.io)
* View the growing list of [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* Read the [documentation online](http://docs.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* Subscribe to the [Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and we'll email you when new versions are released.
* Please help support our work via [Gittip](https://www.gittip.com/photonstorm/)

![div](http://phaser.io/images/div4.png)

<a name="whats-new"></a>
## Welcome to Phaser and What's new in 2.2.0?

![Pixi 2.0](http://www.phaser.io/images/pixi-v2.png)

Until then happy coding everyone! And we hope to see you on the forums.

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

Version 2.2.0 - "Bethal" - in development

### New Features

* Updated to Pixi v2.1.0 - see seprate change log entry below.
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
* It now detects 'spiralling' which happens if a lot of frames are pushed out in succession meaning the CPU can never "catch up". It skips frames instead of trying to catch them up in this case. Note: the time value passed to the logic update functions is always constant regardless of these shenanigans.
* Signals to the game program if there is a problem which might be fixed by lowering the desiredFps
* Time.desiredFps is the new desired frame rate for your game.
* Time.suggestedFps is the suggested frame rate for the game based on system load.
* Time.slowMotion allows you to push the game into a slow motion mode. The default value is 1.0. 2.0 would be half speed, and so on.
* Time.timeCap is no longer used and now deprecated. All timing is now handled by the fixed time-step code we've introduced.
* Time.now can no longer be relied upon to contain a timestamp value. If the browser supports requestAnimationFrame then `Time.now` will contain the high resolution timer value that rAf generates. Otherwise it will contain the value of Date.now. If you require the actual time value (in milliseconds) then please use `Time.time` instead. Note that all Phaser sub-systems that used to rely on `Time.now` have been updated, so if you have any code that extends these please be sure to check it.
* Game.forceSingleUpdate will force just a single logic update, regardless of the delta timer values. You can use this in extremely heavy CPU situations where you know you're about to flood the CPU but don't want Phaser to get stuck in a spiral.
* Tilemap.createFromTiles will convert all tiles matching the given tile index (or an array of indexes) into Sprites. You can optionally then replace these tiles if you wish. This is perfect for games when you want to turn specific tiles into Sprites for extra control. The Sprites have an optional properties object which they can be populated with.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson)
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
    * pointerN are aliases to backed pointers[N-1] array. This simplifies (and increases the efficiency of) looping through all the pointers when applicable; also eliminates pointer-existance checks Removes various hard-coded limits (added MAX_POINTERS); changed maxPointers default
    * Removed some special-casing from cases where it did not matter
    * Removed === false/true, == usage for consistency, changed missing value check to typeof, etc.
    * Updated documentation for specificty; added @public\@protected
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
* AudioSprite - removed an unnecessary if-statement (thanks @DaanHaaz #1312)
* ArcadePhysics.skipQuadTree is now set to `true` by default. A QuadTree is a wonderful thing if the objects in your game are well spaced out. But in tightly packed games, especially those with tilemaps or single-screen games, they are a considerable performance drain and eat up CPU. We've taken the decision to disable the Arcade Physics QuadTree by default. It's all still in there and can be re-enabled via `game.physics.arcade.skipQuadTree = false`, but please only do so if you're sure your game benefits from this.
* Phaser.DOM now houses new DOM functions. Some have been moved over from ScaleManager as appropriate.

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

Note: Some of you may not be aware, but the `phaser.min.js` file in the build folder contains all 3 physics systems bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180KB from the minified file size.

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

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.2.0/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.2.0/phaser.min.js`

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

Phaser is 143 KB gzipped (675 KB minified) when including *both* Arcade Physics and the full P2 Physics engine.

If you don't require P2 you can save yourself nearly 200 KB from the minified size and instead use the `phaser-arcade-physics.min.js` file found inside the `build/custom` folder. This version is only 109 KB gzipped (504 KB minified).

If you don't need any physics system at all, or are implementing your own, there is an even smaller build: `phaser-no-physics.min.js` in the `custom` folder that is only 95 KB gzipped (443 KB minified). Please note that this build doesn't include Tilemaps or Particle Emitter support either, as both rely on Arcade Physics.

You can create your own custom build of Phaser by looking at the grunt options and manifests in the tasks folder.

![div](http://phaser.io/images/div3.png)

<a name="example"></a>
## Learn By Example

Ever since we started Phaser we've been growing and expanding our extensive set of Examples. Currently over 320 of them!

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

Here are some of the features planned for future releases:


### Version 2.2 ("Tarabon")

* Restore Math.interpolateAngles and Math.nearestAngleBetween
* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Scene Manager - json scene parser.
* Adjust how Pointers and Interactive Objects work. Allow an IO to be flagged as "on click only", so it doesn't ever get processed during normal Pointer move events (unless being dragged)
* Allow multiple drag items - no longer bind just 1 to a Pointer
* Allow Groups to have Priority IDs too and input disable entire Groups and all children (let it flow down the chain)
* Allow Groups to be InputEnabled? Dragging a Group would be really useful.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Optimised global Animation manager to cut down on object creation.
* Swapping to using a RenderTexture for the Tilemaps and implementing Tilemap slicing.

### Version 2.3 ("Illian") and Beyond

* Look carefully at the internal structure of Phaser to avoid method repetition (such as Sprite.crop and Image.crop), investigate using mixins to help reduce overall codebase size.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.
* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Support for parallel asset loading.
* DragonBones support.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Multiple Camera support.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.

### Phaser 3

Phaser 3 has entered the planning stages. Development will not begin until early 2015, but we are already asking for suggestions and feedback in [this forum thread](http://www.html5gamedevs.com/topic/7949-the-phaser-3-wishlist-thread/). We are currently experimenting with a fully ES6 based module system and we're keen for Phaser 3 to use as many native ES6 features as possible and where sensible. It will be a significant refactoring of the code base, but not at the expense of features or ease-of-use.

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
