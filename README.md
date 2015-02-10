![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS and Android apps via 3rd party tools.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on Github.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)
* **Learn:** [API Documentation](http://docs.phaser.io), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)
* **Code:** 400+ [Source Examples](http://examples.phaser.io) (also available in this [git repo][examples])
* **Read:** Subscribe to the [Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and grab our [Phaser Books](https://leanpub.com/u/photonstorm)
* **Chat:** [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* **Extend:** With [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* **Be awesome:** Support our work via [Gratipay](https://gratipay.com/photonstorm/)

![div](http://www.phaser.io/images/github/div.png)

## Index

- [What's New?](#whats-new)
- [Change Log](#change-log)
- [Download Phaser](#download)
- [Getting Started](#getting-started)
- [Using Phaser](#using-phaser)
- [Games made with Phaser](#games)
- [Requirements](#requirements)
- [Road Map](#road-map)
- [Contributing](#contributing)

![div](http://www.phaser.io/images/github/div.png)

<a name="whats-new"></a>
## What's new in 2.2.2?

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

Happy New Year! Welcome to the first release of Phaser in 2015.

We're kicking off the year with the 2.2.2 release. This is mostly a maintenance release and fixes a few crucial issues such as tilemap rendering in Safari and physics performance. But a few small yet super-useful features sneaked in too, my favourite being that the Loader now supports BLOB urls for audio files.

We're hard at work on Phaser 3. Development on the brand new renderer began in earnest last year and we're already seeing exceptional results from it. You can follow our development in the forum and public repo. Even though we're working on taking Phaser 3 into ES6 and the next generation of web browsers, we haven't stopped with the 2.x branch.

If you take a peek at the [2.3 milestones](https://github.com/photonstorm/phaser/milestones/2.3.0) you'll see we've got some great features in build. Included is a refactoring of all the Game Object classes, a new parallel asset loader and more consistent Text style handling.

After the runaway success Phaser enjoyed in 2014 we're really excited to see what this year will bring, and hope you'll join us for the ride.

Happy coding everyone! See you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

Version 2.3.0 - "Tarabon" - in dev

### Significant Update: Phaser.Loader

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

### Updates

* TypeScript definitions fixes and updates (thanks @Phaiax @Bilge @clark-stevenson @TimvdEijnden @belohlavek @ivw @vulvulune)
* There is a new TypeScript defs file (phaser.comments.d.ts) which now has all of the jsdocs included! (thanks @vulvulune #1559)
* Sound.fadeTween is now used for Sound.fadeIn and Sound.fadeOut audio tweens.
* Sound.stop and Sound.destroy now halt a fade tween if in effect.
* Arcade Physics `computeVelocity` now allows a max velocity of 0 allowing movement to be constrained to a single axis (thanks @zekoff #1594)
* Added missing properties to the InputHandler prototype, reducing hidden class modifications.
* Updated docstrap-master toc.js to fix nav scrolling (thanks @abderrahmane-tj @vulvulune #1589)
* Added missing plugins member in Phaser.Game class (thanks @Bilge #1568)
* Lots of JSDocs fixes (thanks @vulvulune @micahjohnston @Marchys)
* TilemapLayer.getTiles now returns a copy of the Tiles found by the method, rather than references to the original Tile objects, so you're free to modify them without corrupting the source (thanks @Leekao #1585)
* Sprite.events.onDragStart has 2 new parameters `x` and `y` which is the position of the Sprite before the drag was started. The full list of parameters is: `(sprite, pointer, x, y)`. This allows you to retain the position of the Sprite prior to dragging should `dragFromCenter` have been enabled (thanks @vulvulune #1583)
* Body.reset now resets the Body.speed value to zero.
* Device.touch checks if `window.navigator.maxTouchPoints` is `>= 1` rather than > 1, which now allows touch events to work properly in Chrome mobile emulation.
* Loader.XDomainRequest wasn't used for atlas json loading. It has now been moved to the `xhrLoad` method to ensure it's used for all request if required (thanks @draconisNoctis #1601)
* Loader.reset has a new optional 2nd parameter `clearEvents` which if set to `true` (the default is false) will reset all event listeners bound to the Loader.
* If `Body.customSeparateX` or `customSeparateY` is `true` then the Body will no longer be automatically separated from a **Tilemap** collision or exchange any velocity. The amount of pixels that the Body has intersected the tile is available in `Body.overlapX` and `overlapY`, so you can use these values to perform your own separation in your collision callback (#992)

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

For changes in previous releases please see the extensive [Version History](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md).

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

### Koding

Want to try Phaser without downloading anything? [Clone Phaser in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and start working right away in their web based development system.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![div](http://www.phaser.io/images/github/div.png)

<a name="getting-started"></a>
## Getting Started

<img src="http://phaser.io/images/github/learn.jpg" align="right">

We have a [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server, to picking an IDE and coding your first game.

Prefer **videos** to reading? Lynda.com have published a free course: [HTML5 Game Development with Phaser](http://www.lynda.com/Phaser-tutorials/HTML5-Game-Development-Phaser/163641-2.html)

Use the [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide we wrote for GameDevTuts. It covers finding tutorials, examples and getting support.

Although currently a bit of a "wall of text" we urge you to keep an eye on the **News** section of the [Phaser web site](http://phaser.io). We post fresh links there *daily*.

Using Phaser with **TypeScript**? Check out this great series of [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) tutorials.

### Source Code Examples

Ever since we started Phaser we've been growing and expanding our extensive set of source code examples. Currently there are over 400 of them!

Browse the [Phaser Examples](http://examples.phaser.io) or clone the [examples repo][examples] and eat your heart out!

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

This current release of Phaser is 153 KB *gzipped and minified* with both **Arcade Physics** and **P2 Physics** included. We also provide smaller custom builds.

### Custom Builds

The custom builds of Phaser are in the `build\custom` folder.

Phaser comes with two physics systems: Arcade Physics and [P2.js](https://schteppe.github.io/p2.js/). Arcade Physics is perfect for arcade style games and provides an AABB (bounding box) based collision system. P2 is a full body physics system, complete with springs, materials, constraints and lots more.

If you don't require P2 then use the custom build: `phaser-arcade-physics.js`. This will save nearly 200 KB from the *minified* file size.

If you don't need physics at all, or are implementing your own, there is an even smaller build: `phaser-no-physics.js`. This doesn't include Tilemaps or Particle Emitter support either, as both rely on Arcade Physics, but is even smaller as a result.

Finally there is `phaser-no-libs.js` which is Phaser without any physics support *or* Pixi.js. Phaser requires Pixi.js to work, but this build allows you to use your own version of Pixi instead of the one Phaser provides.

Want to create your own custom builds? Take a look at the manifests files in the `tasks` folder.

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

Find lots more on the [HTML5 Game Devs Forum](http://www.html5gamedevs.com/forum/8-game-showcase/).

![div](http://www.phaser.io/images/github/div.png)

<a name="requirements"></a>
## Requirements

Phaser requires a web browser that supports the [canvas tag](http://caniuse.com/#feat=canvas). This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera on desktop. iOS Safari, Android Browser and Chrome for Android are supported on mobile.

While Phaser does its best to ensure a consistent cross-platform experience always be aware of browser and device limitations. This is especially important with regard to memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### IE9

If you need to support IE9 / Android 2.x **and** use P2 physics then you must use the polyfill in the `resources/IE9 Polyfill` folder. If you don't use P2 (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code and were careful not to impose a strict structure upon you. You won't find Phaser split into modules, requiring a build step, or making you use a class / inheritance OOP approach. That doesn't mean you can't do so, it just means we don't *force* you to. It's your choice.

If you code with [TypeScript](http://www.typescriptlang.org/) there are comprehensive definition files in the `typescript` folder. They are for TypeScript 1.4+ only.

We don't officially support any version of TypeScript before 1.4, however you can use any of our defs files from January 2015 or before, although they will not be fully feature complete. If using a very early version of TypeScript (i.e. 0.9.5) you will need to include [WebGL definitions](https://github.com/piersh/WebGL.ts) into your project first.

![div](http://www.phaser.io/images/github/div.png)

<a name="road-map"></a>
## Road Map

Here are some of the features planned for future releases. Not all are promised to be delivered and no timescale is given. But they serve as a good indication of the direction Phaser is heading in.

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

![div](http://www.phaser.io/images/github/div.png)

<a name="phaser3"></a>
## Phaser 3

Development has begun on Phaser 3. At the moment it's still in the very early stages. We are asking for suggestions and feedback in [this forum thread](http://www.html5gamedevs.com/topic/7949-the-phaser-3-wishlist-thread/) so be sure to add your voice.

We are currently experimenting with an ES6 based module system and we're keen for Phaser 3 to use as many native ES6 features as possible. It will be a significant refactoring of the code base, but never at the expense of features or ease-of-use.

We don't anticipate a release until Summer 2015 and will support Phaser 2 fully in the meantime.

If you are an exceptional JavaScript developer and would like to join the Phaser 3 development team then let us know. We have a limited budget available to pay towards your time.

![div](http://www.phaser.io/images/github/div.png)

<a name="contributing"></a>
## Contributing

Please read the [Contributors Guide][contribute] for full details on helping with Phaser, but the main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample.

- Pull Requests should only be made against the `dev` branch. *Never* against `master`.

- Before submitting a Pull Request run your code through [JSHint](http://www.jshint.com/) using our [config](https://github.com/photonstorm/phaser/blob/master/.jshintrc).

- Before contributing please read the [code of conduct](https://github.com/photonstorm/phaser/blob/master/CODE_OF_CONDUCT.md).

Written something cool that shows Phaser in use? Please tell us about it in our [forum][forum] or email: rich@photonstorm.com

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
