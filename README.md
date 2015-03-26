![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS and Android apps via 3rd party tools.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on Github.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)
* **Learn:** [API Documentation](http://phaser.io/docs), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)
* **Code:** 500+ [Source Examples](http://phaser.io/examples) (also available in this [git repo][examples])
* **Read:** Subscribe to the [Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and grab our [Phaser Books](http://phaser.io/shop)
* **Chat:** [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* **Extend:** With [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* **Be awesome:** Support our work via [Gratipay](https://gratipay.com/photonstorm/)

![div](http://www.phaser.io/images/github/div.png)

## Index

- [What's New?](#whats-new)
- [Download Phaser](#download)
- [Getting Started](#getting-started)
- [Using Phaser](#using-phaser)
- [Games made with Phaser](#games)
- [Requirements](#requirements)
- [Road Map](#road-map)
- [Change Log](#change-log)
- [Contributing](#contributing)

![div](http://www.phaser.io/images/github/div.png)

<a name="whats-new"></a>
## What's new in 2.3.0?

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

Phaser 2.3.0 marks the second release in 2015 and easily one of our most significant for a while. In terms of API changes they're actually quite minimal, but under the hood we've taken Phaser for a serious workout.

We've traditionally had something of a 'kitchen sink' issue with Phaser - in that as we thought of great new features to give you, they all added to the overall file size and it just kept on growing as a result.

So one of the biggest changes 2.3.0 has is an internal shift to using Game Object components, and allowing Phaser to be broken up into modules. We've provided a new build system which lets you selective exclude modules from being bundled in. For example if your game doesn't need Gamepad or Keyboard support you can now tell Phaser to skip those parts entirely.

[This tutorial](http://phaser.io/tutorials/creating-custom-phaser-builds) explains the process in detail. But the end result is that thanks to these changes we've managed to shave thousands of lines of code out and put Phaser on a diet. The minimum build size is now just 83KB minified and gzipped (and that's still including both the WebGL and Canvas renderers).

Even though we've been cutting down on size we still managed to pack a whole load of great new features in. For example the new spacial sorting added to Arcade Physics allows for incredible speed increases when dealing with densely populated game worlds. The Loader has received a complete overhaul - now offering full parallel asset loading, sync points and more! The Tilemap system was upgraded to support new Tiled 0.11 editor features. Audio has been also been enhanced, with better marker and loop handling. You can see the full change log for yourself - literally hundreds of improvements across the whole framework.

Your games will run faster, have a smaller footprint and load faster than ever.

But it's not just Phaser that has been updated - we also finally released the [new Phaser web site](http://phaser.io)! For the past few years it had been a huge "wall of text", with hundreds of links filling up the single page site. Now it's all changed! With a much more attractive layout and structure - we've got a healthy and daily-updating news section, all of the examples are online to play with, lots of tutorials and even a great new Sandbox to play in.

It was a lot of hard work but we're super-happy with the result - and judging by our page hits which are going off the charts, you are too :) We'll be sure to keep enhancing it over the coming months, especially as Phaser 3 development ramps up.

That's all for now. I hope you enjoy Phaser 2.3.0, the new site, the new features and the New Year! Happy coding everyone! See you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github/div.png)

<a name="download"></a>
## Download Phaser

Phaser is [hosted on Github][phaser]. There are a number of ways to download it:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Download just the build files: [phaser.js][get-js] and [phaser.min.js][get-minjs]
* Checkout with [svn][clone-svn]

### Bower / npm

Install via [bower](http://bower.io)

`bower install phaser`

Install via [npm](https://www.npmjs.com)

`npm install phaser`

### CDN

[jsDelivr](http://www.jsdelivr.com/#!phaser) is a "super-fast CDN for developers". Include the following in your html:

`<script src="//cdn.jsdelivr.net/phaser/2.3.0/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.3.0/phaser.min.js"></script>`

### Phaser Sandbox

If you'd like to try coding in Phaser right now, with nothing more than your web browser then you can head over to the [Phaser Sandbox](http://phaser.io/sandbox). You'll find Quick Start templates and a user-friendly editor filled with handy code-completion features.

### Koding

Want to try Phaser without downloading anything? [Clone Phaser in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and start working right away in their web based development system.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![div](http://www.phaser.io/images/github/div.png)

<a name="getting-started"></a>
## Getting Started

<img src="http://phaser.io/images/github/learn.jpg" align="right">

We have a [Getting Started Guide](http://phaser.io/tutorials/getting-started) which covers all you need to begin developing games with Phaser. From setting up a web server, to picking an IDE and coding your first game.

Prefer **videos** to reading? Lynda.com have published a free course: [HTML5 Game Development with Phaser](http://www.lynda.com/Phaser-tutorials/HTML5-Game-Development-Phaser/163641-2.html)

The single biggest Phaser tutorial resource is the new [Phaser web site](http://phaser.io/news). It has hundreds of tutorials listed and fresh ones are added every week, so keep coming back to see what's new!

Using Phaser with **TypeScript**? Check out this great series of [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) tutorials.

### Source Code Examples

Ever since we started Phaser we've been growing and expanding our extensive set of source code examples. Currently there are over 400 of them!

Browse the [Phaser Examples](http://phaser.io/examples) or clone the [examples repo][examples] and eat your heart out!

### Phaser Books

<div align="center"><img src="http://phaser.io/images/github/books.jpg"></div>

We've been busy writing books about Phaser. Available now:

* [A Guide to the Phaser Tween Manager](https://leanpub.com/phasertweenmanager) Book + Code Bundle
* [A Guide to the Phaser Scale Manager](https://leanpub.com/phaserscalemanager)

With more on the way. [Vote on the next title](http://www.html5gamedevs.com/topic/10962-which-phaser-book-would-you-like-to-see-next/) to be written.

### Game Mechanic Explorer

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

### Mighty Editor - Visual Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![div](http://www.phaser.io/images/github/div.png)

<a name="using-phaser"></a>
## Using Phaser

Phaser is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development and the minified version for production.

This current release of Phaser is 153 KB *gzipped and minified* with both **Arcade Physics** and **P2 Physics** included.

### Custom Builds

As of Phaser 2.3.0 we now include a brand new build system which allows you to strip out lots of additional features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then you can now exclude the entire sound system. Don't need Keyboard support? That can be stripped out too.

As a result of this work the minimum build size of Phaser is now just 83KB minified and gzipped.

See the [Creating a Custom Phaser Build](http://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

### Building from source

Should you wish to build Phaser from source you can take advantage of the provided [Grunt](http://gruntjs.com/) scripts. Ensure you have the required packages by running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

If you change either Pixi.js or P2 then use the Grunt tasks `replace:pixi` and `replace:p2` respectively. These tasks patch their UMD strings so they work properly with Phaser under requireJS.

![div](http://www.phaser.io/images/github/div.png)

<a name="games"></a>
## Games made with Phaser

Thousands of games have been made in Phaser. From game jam entries to titles for some of the largest entertainment brands in the world. This is just a tiny sample.

[![Game](http://phaser.io/images/github/shot1a.jpg)][game1]
[![Game](http://phaser.io/images/github/shot2a.jpg)][game2]
[![Game](http://phaser.io/images/github/shot3a.jpg)][game3]
[![Game](http://phaser.io/images/github/shot4a.jpg)][game4]
[![Game](http://phaser.io/images/github/shot5b.jpg)][game5]
[![Game](http://phaser.io/images/github/shot6b.jpg)][game6]
[![Game](http://phaser.io/images/github/shot7b.jpg)][game7]
[![Game](http://phaser.io/images/github/shot8.jpg)][game8]
[![Game](http://phaser.io/images/github/shot9.jpg)][game9]
[![Game](http://phaser.io/images/github/shot10.jpg)][game10]
[![Game](http://phaser.io/images/github/shot11.jpg)][game11]
[![Game](http://phaser.io/images/github/shot12.jpg)][game12]
[![Game](http://phaser.io/images/github/shot13.jpg)][game13]
[![Game](http://phaser.io/images/github/shot14.jpg)][game14]

Artwork copyright their respective owners.

We add [new games](http://phaser.io/news/category/game) to the Phaser site regularly, be sure to send us yours when it's finished!

![div](http://www.phaser.io/images/github/div.png)

<a name="requirements"></a>
## Requirements

Phaser requires a web browser that supports the [canvas tag](http://caniuse.com/#feat=canvas). This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera on desktop. iOS Safari, Android Browser and Chrome for Android are supported on mobile.

While Phaser does its best to ensure a consistent cross-platform experience always be aware of browser and device limitations. This is especially important with regard to memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### IE9

If you need to support IE9 / Android 2.x **and** use P2 physics then you must use the polyfill in the `resources/IE9 Polyfill` folder. If you don't use P2 (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code and were careful not to impose a strict structure upon you. You won't find Phaser split into modules, requiring a build step, or making you use a class / inheritance OOP approach. That doesn't mean you can't do so, it just means we don't *force* you to. It's your choice.

If you code with [TypeScript](http://www.typescriptlang.org/) there are comprehensive definition files in the `typescript` folder. They are for TypeScript 1.4+.

![div](http://www.phaser.io/images/github/div.png)

<a name="road-map"></a>
## Road Map

All Phaser development is now taking place on the Phaser 3 project. The Phaser 2 branch will still be supported and issues fixed, but roadmap features have been migrated over to Phaser 3.

<a name="phaser3"></a>
## Phaser 3

We're now several months in to development of Phaser 3. We've been working hard on creating a brand new and extremely powerful renderer. Progress reports are posted to the Phaser web site and you the [Phaser 3 repo](https://github.com/photonstorm/phaser3).

There is still plenty of time to add your suggestions and feedback in [this forum thread](http://www.html5gamedevs.com/topic/7949-the-phaser-3-wishlist-thread/).

If you are an exceptional JavaScript developer and would like to join the Phaser 3 development team then let us know. We have a limited budget available to pay towards your time.

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

Version 2.3.0 - "Tarabon" - 26th March 2015

### Significant Updates

#### Game Objects and Components

All of the core Game Objects have received an important internal restructuring. We have moved all of the common functions to a new set of Component classes. They cover functionality such as 'Crop', 'Physics Body', 'InCamera' and more. You can find the source code to each component in the `src/gameobjects/components` folder of the repo.

All of the Game Object classes have been restructured to use the new component approach. This puts an end to the "God classes" structure we had before and removes literally hundreds of lines of duplicate code. It also allowed us to add features to Game Objects; for example Bitmap Text objects are now full-class citizens with regard to physics capabilities.

Although this was a big internal shift from an API point of view not much changed - you still access the same methods and properties in the same way as before. Phaser is just a lot leaner under the hood now.

It's worth mentioning that from a JavaScript perspective components are  mixins applied to the core game objects when Phaser is instantiated. They are not added at run-time or are dynamic (they never get removed from an object once added for example). Please understand that this is by design.

You can create your own custom Phaser classes, with your own set of active components by copying any of the pre-existing Game Objects and modifying them.

#### Custom Builds

As a result of the shift to components we went through the entire source base and optimised everything we could. Redundant paths were removed, debug flags removed and new stub classes and hooks were created. What this means is that it's now easier than ever to "disable" parts of Phaser and build your own custom version.

We have always included a couple of extra custom builds with Phaser. For example a build without P2 Physics included. But now you can strip out lots of additional features you may not require, saving hundreds of KB from your build file in the process. Don't use any Sound in your game? Then you can now exclude the entire sound system. Don't need Keyboard support? That can be stripped out too.

As a result of this work the minimum build size of Phaser is now just 83KB (minified and gzipped).

Please see the README instructions on how to create custom builds.

#### Arcade Physics

We've updated the core of Arcade Physics in a number of significant ways. 

First we've dropped lots of internal private vars and moved to using non-cached local vars. Array lengths are no longer cached and we've implemented `physicsType` properties on Game Objects to speed-up the core World collideHandler. All of these small changes have lead to a nice improvement in speed as a result, and also allows us to now offer things like physics enabled BitmapText objects.

More importantly we're now using a spacial pre-sort for all Sprite vs. Group and Group vs. Group collisions. You can define the direction the sort will prioritize via the new `sortDirection` property. By default it is set to `Phaser.Physics.Arcade.LEFT_RIGHT`. For example if you are making a horizontally scrolling game, where the player starts on the left of the world and moves to the right, then this sort order will allow the physics system to quickly eliminate any objects to the right of the player bounds. This cuts down on the sheer volume of actual collision checks needing to be made. In a densely populated level it can improve the fps rate *dramatically*.

There are 3 other directions available (`RIGHT_LEFT`, `TOP_BOTTOM` and `BOTTOM_TOP`) and which one you need will depend on your game type. If you were making a vertically scrolling shoot-em-up then you'd pick `BOTTOM_TOP` so it sorts all objects above and can bail out quickly. There is also `SORT_NONE` if you would like to pre-sort the Groups yourself or disable this feature.

Another handy feature is that you can switch the `sortDirection` at run-time with no loss of performance. Just make sure you do it *before* running any collision checks. So if you had a large 8-way scrolling world you could set the `sortDirection` to match the direction the player was moving in and adjust it in real-time, getting the benefits as you go. My thanks to Aaron Lahman for inspiring this update.

#### Phaser.Loader

The Phaser.Loader has been updated to support parallel downloads which is now enabled by default (you can toggle it via the `Loader.enableParallel` flag) as well as adding future extensibility points with a pack/file unified filelist and an inflight queue.

There are no *known* incompatibilities with the previous Loader. Be aware that with parallel downloading enabled the order of the Loader events may vary (as can be seen in the "Load Events" example).

The parallel file concurrency limit is available in `Loader.maxParallelDownloads` and is set to 4 by default. Under simulated slower network connections parallel loading was a good bit faster than sequential loading. Even under a direct localhost connection parallel loading was never slower, but benefited most when loading many small assets (large assets are more limited by bandwidth); both results are fairly expected.

The Loader now supports synchronization points. An asset marked as a synchronization point must be loaded (or fail to load) before any *subsequent* assets can be loaded. This is enabled by using the `withSyncPoint` and `addSyncPoint` methods. Packs ('packfile' files) and Scripts ('script' files) are treated as synchronization points by default. This allows parallel downloads in general while allowing synchronization of select resources if required (packs, and potentially other assets in the future, can load-around synchronization points if they are written to delay final 'loading').

Additional error handling / guards have been added, and the reported error message has been made more consistent. Invalid XML (when loading) no longer throws an exception but fails the particular file/asset that was being loaded. 

Some public methods/properties have been marked as protected, but no (except in case of a should-have-been-private-method) public-facing interfaces have been removed. Some private methods have been renamed and/or removed.

A new XHR object is created for each relevant asset (as there must be a different XHR for each asset loaded in parallel). Online searches indicated that there was no relevant benefit of XHR (as a particular use-case) re-use; and time will be dominated with the resource fetch. With the new flight queue an XHR cache could be re-added, at the cost of some complexity.

The URL is always transformed through transformUrl, which can make adding some one-off special cases like #1355 easier to deal with.

This also incorporates the fast-cache path for Images tags that can greatly speed up the responsiveness of image loading.

Loader.resetLocked is a boolean that allows you to control what happens when the loader is reset, *which happens automatically on a State change*. If you set `resetLocked` to `true` it allows you to populate the loader queue in one State, then swap to another State without having the queue erased, and start the load going from there. After the load has completed you could then disable the lock again as needed.

Thanks to @pnstickne for vast majority of this update.

#### Pixi v2

We are now using our own custom build of Pixi v2. The Pixi project has moved all development resources over to Pixi v3, but it wasn't ready in time for the release of Phaser 2.3 so we've started applying our own fixes to the version of Pixi that Phaser uses.

As a result we have removed all files from the `src/pixi` folder that Phaser doesn't use, in order to make this distinction clearer. This includes `EventTarget`, so if you were relying on that in your game you'll need to add it back in to your local build.

We've also removed functions and properties from Pixi classes that Phaser doesn't require: such as the Interaction Manager, Stage.dirty, etc. This has helped us cut down the source code size and make the docs less confusing, as they no longer show properties for things that weren't even enabled.

We've rolled our own fixes into our version of Pixi, ensuring we keep it as bug-free as possible.

### New Features

* `Physics.Arcade.isPaused` allows you to toggle Arcade Physics processing on and off. If `true` the `Body.preUpdate` method will be skipped, halting all motion for all bodies. Note that other methods such as `collide` will still work, so be careful not to call them on paused bodies.
* `Arcade.Body.friction` allows you to have more fine-grained control over the amount of velocity passed between bodies on collision.
* BitmapData.text will render the given string to the BitmapData, with optional font, color and shadow settings.
* MSPointer.capture allows you to optionally event.preventDefault the pointer events (was previously always on)
* MSPointer.event now stores the most recent pointer event.
* MSPointer.pointerDownCallback, pointerMoveCallback and pointerUpCallback all allow you to set your own event based callbacks.
* MSPointer.button now records which button was pressed down (if any)
* Phaser now supports rotated and flipped tiles in tilemaps, as exported from the Tiled map editor (thanks @nkholski #1608)
* TilemapParser now supports Tiled 0.11 version maps which includes the `rotation` property on all Object types.
* Tilemap.createFromObjects now checks for a `rotation` property on the Object and if present will set it as the Sprite.angle (#1433)
* If for whatever reason you wish to hide the Phaser banner in the console.log you can set `window.PhaserGlobal.hideBanner` to `true` and it will skip the output. Honestly I'd rather if you didn't, but the option is now there.
* TilemapLayer.setScale will allow you to apply scaling to a specific Tilemap layer, i.e. `layer.setScale(2)` would double the size of the layer. The way the Camera responds to the layer is adjusted accordingly based on the scale, as is Arcade collision (thanks @mickez #1605)
* SoundManager.setDecodedCallback lets you specify a list of Sound files, or keys, and a callback. Once all of the Sound files have finished decoding the callback will be invoked. The amount of time spent decoding depends on the codec used and file size. If all of the files given have already decoded the callback is triggered immediately.
* Sound.loopFull is a new method that will start playback of the Sound and set it to loop in its entirety.
* left, right, top and bottom are new properties that contain the totals of the Game Objects position and dimensions, adjusted for the anchor. These are available on any Game Object with the Bounds Component.
* Sprite.offsetX and Sprite.offsetY contain the offsets from the Sprite.x/y coordinates to the top-left of the Sprite, taking anchor into consideration.
* Emitter.flow now works in a slightly different (and more useful!) way. You can now specify a `quantity` and a `total`. The `quantity` controls how many particles are emitted every time the flow frequency is met. The `total` controls how many particles will be emitted in total. You can set `total` to be -1 and it will carry on emitting at the given frequency forever (also fixes #1598 thanks @brianbunch)
* ArraySet.removeAll allows you to remove all members of an ArraySet and optionally call `destroy` on them as well.
* GameObject.input.dragStartPoint now stores the coordinates the object was at when the drag started. This value is populated when the drag starts. It can be used to return an object to its pre-drag position, for example if it was dropped in an invalid place in-game.
* Text.padding specifies a padding value which is added to the line width and height when calculating the Text size. Allows you to add extra spacing if Phaser is unable to accurately determine the true font dimensions (#1561 #1518)
* P2 Capsule Shapes now support BodyDebug drawing (thanks @englercj #1686)
* Game Objects now have a new `physicsType` property. This maps to a Phaser const such as `SPRITE` or `GROUP` and allows Phaser to sort out pairings for collision checks in the core World collide handler much quicker than before.
* BitmapText objects can now have physics enabled on them. When the physics body is first created it will use the dimensions of the BitmapText at the time you enable it. If you update the text it will adjust the body width and height as well, however any applied offset will be retained.
* BitmapText objects now have an `anchor` property. This works in a similar way to Sprite.anchor except that it offsets the position of each letter of the BitmapText by the given amount, based on the overall BitmapText width - whereas Sprite.anchor offsets the position the texture is drawn at.

### Updates

* TypeScript definitions fixes and updates (thanks @Phaiax @Bilge @clark-stevenson @TimvdEijnden @belohlavek @ivw @vulvulune @zeh @englercj)
* There is a new TypeScript defs file (phaser.comments.d.ts) which now has all of the jsdocs included! (thanks @vulvulune #1559)
* Sound.fadeTween is now used for Sound.fadeIn and Sound.fadeOut audio tweens.
* Sound.stop and Sound.destroy now halt a fade tween if in effect.
* Arcade Physics `computeVelocity` now allows a max velocity of 0 allowing movement to be constrained to a single axis (thanks @zekoff #1594)
* Added missing properties to the InputHandler prototype, reducing hidden class modifications.
* Updated docstrap-master toc.js to fix nav scrolling (thanks @abderrahmane-tj @vulvulune #1589)
* Added missing plugins member in Phaser.Game class (thanks @Bilge #1568)
* Lots of JSDocs fixes (thanks @vulvulune @micahjohnston @Marchys @JesseAldridge)
* TilemapLayer.getTiles now returns a copy of the Tiles found by the method, rather than references to the original Tile objects, so you're free to modify them without corrupting the source (thanks @Leekao #1585)
* Sprite.events.onDragStart has 2 new parameters `x` and `y` which is the position of the Sprite *before* the drag was started. The full list of parameters is: `(sprite, pointer, x, y)`. This allows you to retain the position of the Sprite prior to dragging should `dragFromCenter` have been enabled (thanks @vulvulune #1583)
* Body.reset now resets the Body.speed value to zero.
* Device.touch checks if `window.navigator.maxTouchPoints` is `>= 1` rather than `> 1`, which allows touch events to work properly in Chrome mobile emulation.
* Loader.XDomainRequest wasn't used for atlas json loading. It has now been moved to the `xhrLoad` method to ensure it's used for all request if required (thanks @draconisNoctis #1601)
* Loader.reset has a new optional 2nd parameter `clearEvents` which if set to `true` (the default is false) will reset all event listeners bound to the Loader.
* If `Body.customSeparateX` or `customSeparateY` is `true` then the Body will no longer be automatically separated from a **Tilemap** collision or exchange any velocity. The amount of pixels that the Body has intersected the tile is available in `Body.overlapX` and `overlapY`, so you can use these values to perform your own separation in your collision callback (#992)
* TilemapParser will now set the `.type` property for ObjectLayer Objects (thanks @mikaturunen #1609)
* The Loader now directly calls StateManager.loadComplete rather than the StateManager listening for the loadComplete event, because Loader.reset unbinds this event (and it's easy to accidentally remove it too)
* Loader.onLoadComplete is dispatched *before* the Loader is reset. If you have a `create` method in your State please note that the Loader will have been reset before this method is called. This allows you to immediately re-use the Loader without having to first reset it manually.
* World.setBounds will now adjust the World.x/y values to match those given (#1555)
* ArcadePhysics.distanceToPointer now calculates the distance in world space values.
* Sound.fadeIn now supports fading from a marker, as well as the entire audio clip, so now works with audio sprites (thanks @vorrin #1413)
* Text font components can now be specified as part of "style". There is a breaking change in that the `fontWeight` now only handles the CSS font-weight component. The `fontStyle` property handles 'italic', 'oblique', values from font-style. This makes the overall consistency cleaner but some code may need to be updated. This does not affect font-weight/font-style as with setStyle({font:..}). Also fixes overwrite font/size/weight oddities - which may result in different behavior for code that was relying on such. All of the text examples appear to work and modification using the new features (while respecting the change in previous behavior) work better (thanks @pnstickne #1375 #1370)
* Loader.audiosprite has a new `jsonData` parameter. It allows you to pass a pre-existing JSON object (or a string which will be parsed as JSON) to use as the audiosprite data, instead of specifying a URL to a JSON file on the server (thanks @jounii #1447)
* Loader.audiosprite has a new `autoDecode` parameter. If `true` the audio file will be decoded immediately upon load.
* Tile.properties is now unique to that specific Tile, and not a reference to the Tileset index bound properties object. Tile.properties can now be modified freely without impacting other tiles sharing the same id (#1254)
* PIXI.TextureSilentFail is a boolean that defaults to `false`. If `true` then `PIXI.Texture.setFrame` will no longer throw an error if the texture dimensions are incorrect. Instead `Texture.valid` will be set to `false` (#1556)
* InputHandler.enableDrag with a boundsRect set now takes into account the Sprites anchor when limiting the drag (thanks @unindented #1593)
* InputHandler.enableDrag with a boundsSprite set now takes into account both the Sprites anchor and the boundsSprite anchor when limiting the drag.
* Sound in Web Audio now uses AudioContext.onended to trigger when it will stop playing instead of using a time based value. This is only used if the sound doesn't loop and isn't an audio sprite, but will give a much more accurate `Sound.onStop` event. It also prevents short audio files from being cut off during playback (#1471) and accounts for time spent decoding.
* If you load an image and provide a key that was already in-use in the Cache, then the old image is now destroyed (via `Cache.removeImage`) and the new image takes its place.
* BitmapText has a new `maxWidth` property that will attempt to wrap the text if it exceeds the width specified.
* Group.cursorIndex is the index of the item the Group cursor points to. This replaces Group._cache[8].
* Tween.updateTweenData allows you to set a property to the given value across one or all of the current tweens. All of the Tween methods like Tween.delay and Tween.repeat have been updated to use this.
* Tween.repeat has a new parameter `repeatDelay` which allows you to set the delay (in ms) before a tween will repeat itself.
* Tween.yoyo has a new parameter `yoyoDelay` which allows you to set the delay (in ms) before a tween will start a yoyo.
* Tween.interpolation has a new parameter `context` which allows you to define the context in which the interpolation function will run.
* ArraySet.getByKey gets an item from the set based on the property strictly equaling the value given.
* A State swap now sets the Loader.reset `hard` parameter to `true` by default. This will null any Loader.preloadSprite that may have been set.
* You can now set a `resolution` property in your Game Configuration object. This will be read when the Pixi renderer instance is created and used to set the resolution within that (#1621)
* Text style has a new optional property: `backgroundColor` which is a Canvas fill style that is set behind all Text in the Text object. It allows you to set a background color without having to use an additional Graphics object.
* The Physics Manager now has a new `reset` method which will reset the active physics systems. This is called automatically on a State swap (thanks @englercj #1691)
* When a State is started and linked to Phaser it has a new property created on it: `key`, which is the string identifier used by the State.
* When the Game first boots it will now call `window.focus()`. This allows keyboard events to work properly in IE when the game is running inside an iframe. You can stop this from happening by setting `window.PhaserGlobal.stopFocus = true` (thanks @webholics #1681)
* When an Animation completes playback and isn't set to loop it would change the `currentFrame` property to be the first frame in the set after the `onComplete` callback had fired. This meant if you set a Sprite to a new frame within an Animation onComplete callback then your change would have been overwritten by the animation itself. This is now no longer the case.
* When an Emitter is destroyed via Emitter.destroy it now removes itself from the Phaser Particle Manager, freeing it up for garbage collection and stopping it from being processed.

### Bug Fixes

* SoundManager.unlock checks for audio `start` support and falls back to `noteOn` if not found.
* Sprite.frame and AnimationManager.frame wouldn't return the correct index if a sprite sheet was being used unless it had first been set via the setter.
* Error in diffX and diffY calculation in Tilemap.paste (thanks @amelia410 #1446)
* Fixed issue in PIXI.canUseNewCanvasBlendModes which would create false positives in browsers that supported `multiply` in Canvas path/fill ops, but not for `drawImage` (Samsung S5 for example). Now uses more accurate magenta / yellow mix test.
* Fixed FrameData.getFrame index out of bound error (thanks @jromer94 #1581 #1547)
* In P2.Body calling adjust mass would desync the debug graphics from the real position of the body (thanks @tomlarkworthy #1549)
* Fix CORS loading of BitmapFonts with IE9 (thanks @jeppester #1565)
* TileSprites were not detecting Pointer up events correctly because of a branching condition (thanks @integricho #1580 #1551)
* TileSprites weren't destroying WebGL textures, leading to eventual out of memory errors (thanks @chacal #1563)
* P2.Body.clearCollision default values were incorrectly set to `false` if no parameters were provided, even though the docs said they were `true` (thanks @brianbunch #1597)
* BitmapText.font wouldn't update an internal Pixi property (fontName) causing the text to fail to change font (thanks @starnut #1602)
* Fixed issue in PIXI.Text where it was using the wrong string for descender text measurements.
* Sprite.loadTexture and Image.loadTexture now no longer call `updateTexture` if the texture given is a RenderTexture. This fixes issues with RetroFonts in IE11 WebGL as well as other RenderTexture related IE11 problems (#1310 #1381 #1523)
* You can now tint animated Sprites in Canvas mode. Or change the texture atlas frame of a tinted Sprite or Image. Please note that this is pretty expensive (depending in the browser), as the tint is re-applied every time the *frame changes*. The Pixi tint cache has also been removed to allow for subtle tint color shifts and to avoid blowing up memory. So use this feature sparingly! But at least it does now work (#1070)
* ArcadePhysics.moveToPointer no longer goes crazy if the maxTime parameter is given and the Sprite is positioned in a larger game world (thanks @AnderbergE #1472)
* Sound.loop even when set for WebAudio wouldn't use the AudioContext loop property because Sound.start was being invoked with an offset and duration. Now if `loop` is true and no marker is being used it will use the native Web Audio loop support (#1431)
* Timer.update was calling the TimerEvent callback even if `TimerEvent.pendingDelete` was already set to `true`, causing timer events to stack-up in cases where a new TimerEvent was generated in the callback (thanks @clowerweb  #838)
* Pointer.stop would call `event.preventDefault` if `Pointer._stateReset` was `true`, which is always `true` after a State has changed and before Pointer.start has been called. However this broken interacting with DOM elements in the case where the State changes and you immediately try to use the DOM element without first having clicked on the Phaser game. An additional guard was added so `preventDefault` will now only be called if both `_stateReste` and `Pointer.withinGame` are true (thanks @satan6 #1509)
* Group.forEach (and many other Group methods) now uses the `children.length` value directly instead of caching it, which both helps performance and stops the loop from breaking should you remove a Group child in the invoked callback.
* Phaser.Ellipse.contains is now working again (thanks @spayton #1524)
* PIXI.WebGLRenderer.destroy has been fixed to decrement the `glContextId` and remove it from the PIXI.instances global. `Game.destroy` now hooks into this. This now means that you can now delete and create your Phaser game over and over without it crashing WebGL after the 4th attempt (#1260)
* World.setBounds if called after you had already started P2 Physics would incorrectly create a new collision group for the wall objects. P2.World now remembers the settings you provide for each wall and the collision group, and re-applies these settings should the world dimensions ever change (thanks @nextht #1455)
* InputHandler was using the wrong property in `checkBoundsSprite` when fixedToCamera (thanks @yig #1613)
* Tween.to now correctly accepts arrays are destination values, which makes the Tween interpolate through each value specified in the array using the defined Tween.interpolation method (see new example, thanks @FridayMarch26th #1619)
* Tween.interpolationFunction was using the incorrect context to invoke the function. This is now defined in `TweenData.interpolationContext` and defaults to `Phaser.Math`. If you provide your own interpolation function then please adjust the context accordingly (thanks @FridayMarch26th #1618)
* Graphics.drawEllipse method was missing (thanks @jackrugile #1574)
* A TweenData wouldn't take into account the `repeatDelay` property when repeating the tween, but now does. A TweenData also has a new property `yoyoDelay` which controls the delay before the yoyo will start, allowing you to set both independently (thanks @DreadKnight #1469)
* Animation.update skips ahead frames when the system is lagging, however it failed to set the animation to the final frame in the sequence if the animation skipped ahead too far (thanks @richpixel #1628)
* Loader.preloadSprite had an extra guard added to ensure it didn't try to updateCrop a non-existent sprite (thanks @noidexe #1636)
* The `TilemapParser` has had its row / column calculations updated to account for margins and and spacing on all sides of the tileset (thanks @zekoff #1642)
* Any Tile set with alpha !== 1 would cause the whole layer to render incorrectly (thanks @nkholski #1666)
* P2 Debug Body class: The shape check in draw() needed to check for Convex last, since other shapes (like Rectangle) inherit from Convex (thanks @englercj #1674)
* P2 Debug Body class: The updateSpriteTransform() function needed to be called from the ctor. Otherwise bodies with no sprite (so no postUpdate call) would never be moved to draw in the correct position (thanks @englercj #1674)
* Animations are now guarded allowing Sprites with animations to be destroyed from within onUpdate, onLoop or onComplete events (thanks @pnstickne #1685 #1679)
* Text.lineSpacing can now accept negative values without cutting the bottom of the Text object off. The value can never be less than the height of a single line of text (thanks @anthonysapp #1690)
* Text.lineSpacing is no longer applied to the first line of Text, which prevents text from being cut off further down the Text object.
* If you paused a Sound object that is using audio markers and then resumed it, it wouldn't correctly calculate the resume duration - causing the sound to sometimes play into the marker that followed it (thanks @AnderbergE #1669)
* Animation.play wouldn't correctly set the play state on the Game Objects AnimationManager causing the animation to fail to start (calling AnimationManager.play did work however), now they're both consistently working.
* Graphics.drawArc would fail to draw any subsequent arcs if you set `beginFill` on it after drawing the first arc.
* Graphics.drawArc would only move to the center position of the first arc created and ignore any subsequent arcs.
* Graphics.drawArc now correctly renders multiple arcs across both WebGL and Canvas. You no longer need to specifically call moveTo to move into the correct place to draw the arc.
* Graphics.drawArc now bails out if the startAngle = the endAngle and/or the sweep is invalid *before* adjusting any points.
* Graphics.drawArc now correctly handles the fill on the CanvasRenderer if the arc is a subsequent arc and no line style is set.

### Pixi 2.2.8 Bug Fixes

* SpriteBatch added fix to handle batch context loss on change.
* RenderTexture resolution fix.
* WebGL Filter Resolution fix.
* TilingSprite fixes when masked in canvas mode.
* TilingSprite.destroy fixed if TilingSprite hasn't ever been rendered.

For changes in previous releases please see the extensive [Version History](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md).

![div](http://www.phaser.io/images/github/div.png)

<a name="contributing"></a>
## Contributing

Please read the [Contributors Guide][contribute] for full details on helping with Phaser, but the main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample.

- Pull Requests should only be made against the `dev` branch. *Never* against `master`.

- Before submitting a Pull Request run your code through [JSHint](http://www.jshint.com/) using our [config](https://github.com/photonstorm/phaser/blob/master/.jshintrc).

- Before contributing please read the [code of conduct](https://github.com/photonstorm/phaser/blob/master/CODE_OF_CONDUCT.md).

Written something cool that shows Phaser in use? Please tell us about it in our [forum][forum] or email: support@phaser.io

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

![div](http://www.phaser.io/images/github/div.png)

![storm](http://www.phaser.io/images/github/photonstorm-x2.png)

Phaser is a [Photon Storm](http://www.photonstorm.com) production.

Created by [Richard Davey](mailto:rich@photonstorm.com). Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2015 Photon Storm Limited.

All rights reserved.

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.3.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.3.0/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.3.0.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.3.0.tar.gz
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-svn]: https://github.com/photonstorm/phaser
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/14-phaser/

[game1]: https://www.prodigygame.com/Fun-Math-Games/
[game2]: http://www.bbc.co.uk/cbbc/games/deadly-defenders
[game3]: http://www.defiantfew.com/
[game4]: http://www.pawpatrol.com/fun.php
[game5]: http://www.fyretale.com/
[game6]: http://www.pocoyo.com/juegos-ninos/caramelos
[game7]: http://www.html5gamedevs.com/topic/11179-phaser-cocoonjs-tap-tap-submarine/
[game8]: http://www.gamepix.com/project/footchinko/
[game9]: http://orcattack.thehobbit.com
[game10]: http://runsheldon.com/
[game11]: http://www.tempalabs.com/works/moon-rocket/
[game12]: http://www.tempalabs.com/works/master-of-arms-sword-staff-spear/
[game13]: http://m.silvergames.com/en/pocahontas-slots
[game14]: http://www.tempalabs.com/works/gattai/
