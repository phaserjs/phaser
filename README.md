![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS and Android apps via 3rd party tools.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on Github.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)
* **Learn:** [API Documentation](http://phaser.io/docs), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)
* **Code:** 700+ [Source Examples](http://phaser.io/examples) (also available in this [git repo][examples])
* **Read:** Subscribe to the [Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and grab our [Phaser Books](http://phaser.io/shop)
* **Chat:** [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) or our [Slack Channel](http://phaser.io/news/2015/08/phaser-slack-channel)
* **Extend:** With [Phaser Plugins](http://phaser.io/shop/plugins)
* **Be awesome:** Support the future of Phaser on [Patreon](https://www.patreon.com/photonstorm) or by buying our [books](http://phaser.io/shop/books)

![div](http://www.phaser.io/images/github/div.png)

## Index

- [What's New?](#whats-new)
- [Support Phaser](#patreon)
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
## What's new in Phaser 2.4.4

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

> 15th October 2015

The release of Phaser 2.4.4 continues our work with bug fixes, new features and optimizations. As with the previous version it's a point-release, making it a safe upgrade for anyone using an earlier 2.4 build.

Internally here at Phaser HQ we have been busy with several new projects. 

First we released [Interphase](http://phaser.io/interphase/), a new 400-page publication for Phaser developers. Packed full of exclusive content including 8 complete games, tutorials and a deep dive into the Phaser State Manager. It's been a blast to write and we have been really encouraged by the response from readers. We're planning on releasing Interphase 2 before the end of the year.

We've also released [Particle Storm](http://phaser.io/shop/plugins/particlestorm). An advanced particle system allowing you to easily create stunning special effects in your games with just a few lines of code. Our primary design goal was to create a particle system that was extremely flexible. It was important that you should be able to easily integrate the effects into your games. Particles are constructed through easy-to-understand JavaScript objects with multiple properties and options to let you quickly put together complex visuals with minimum effort.

As we close in towards the end of 2015 there are still a couple of new releases on the horizon, as well as Phaser 2.4.5. We're also getting very close to a fully working build of Phaser 2 using our new renderer. As always, keep you eyes on the Phaser web site or [Twitter](https://twitter.com/photonstorm) for the latest news.

Finally we'd be extremely grateful if you could get involved with our [Phaser Patreon campaign](https://www.patreon.com/photonstorm). The uptake so far has been fantastic. Thank you to everyone who now supports Phaser development and shares our belief in the future of HTML5 gaming and Phasers role in that.

Happy coding everyone! See you on the forums.

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github/div.png)

<a name="patreon"></a>
## Support Phaser on Patreon

![patreon](http://www.phaser.io/images/patreon.png)

Please help support the future development of Phaser through our [Patreon campaign](https://www.patreon.com/photonstorm). We've some exciting plans and there's so much we'd like to do. Let's see if we can all work together to make this possible.

### Phaser Sponsors

Phaser is [sponsored](https://www.patreon.com/photonstorm) by the following great companies:

![qici](http://www.phaser.io/images/sponsors/qici-100.png)

QICI Engine: [A powerful one-stop integrated Phaser game editor](http://www.qiciengine.com/)

![zenva](http://www.phaser.io/images/sponsors/zenva-100.png)

Zenva Academy: [Online courses on Phaser, HTML5 and native app development](https://academy.zenva.com/?zva_src=phaserpatreon)

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

`<script src="//cdn.jsdelivr.net/phaser/2.4.4/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.4.4/phaser.min.js"></script>`

[cdnjs.com](https://cdnjs.com/libraries/phaser) also offers a free CDN service. They have all versions of Phaser and even the custom builds:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.4/phaser.js"></script>`

### Phaser Sandbox

If you'd like to try coding in Phaser right now, with nothing more than your web browser then you can head over to the [Phaser Sandbox](http://phaser.io/sandbox). You'll find Quick Start templates and a user-friendly editor filled with handy code-completion features.

### Koding

Want to try Phaser without downloading anything? The site [Koding](https://koding.com) offer a complete browser-based virtual machine to work in, allowing you to clone the Phaser repo and start work immediately.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![div](http://www.phaser.io/images/github/div.png)

<a name="getting-started"></a>
## Getting Started

<img src="http://phaser.io/images/github/learn.jpg" align="right">

We have a [Getting Started Guide](http://phaser.io/tutorials/getting-started) which covers all you need to begin developing games with Phaser. From setting up a web server, to picking an IDE and coding your first game.

Prefer **videos** to reading? Lynda.com have published a free course: [HTML5 Game Development with Phaser](http://www.lynda.com/Phaser-tutorials/HTML5-Game-Development-Phaser/163641-2.html)

The single biggest Phaser resource is the new [Phaser web site](http://phaser.io/news). It has hundreds of tutorials listed and fresh ones are added every week, so keep coming back to see what's new!

Using Phaser with **TypeScript**? Check out this great series of [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) tutorials.

### Source Code Examples

Ever since we started Phaser we've been growing and expanding our extensive set of source code examples. Currently there are over 700 of them!

Browse the [Phaser Examples](http://phaser.io/examples) or clone the [examples repo][examples] and eat your heart out!

### Interphase

<div align="center"><img src="http://phaser.io/content/interphase/1/images/editorial/pages.jpg"></div>

[Interphase](http://phaser.io/interphase) is a new book for Phaser developers of all skill levels.

With 400 pages of content you'll find detailed articles, game development "Making Of" guides and tutorials. All were written using the latest version of Phaser, so you won't be learning any out-dated tricks here.

As well as the book you get all the source code, graphics and assets to go with it, as well as lots of extras too.

[Read More](http://phaser.io/interphase)

### Game Mechanic Explorer

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

### Mighty Editor - Visual Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![div](http://www.phaser.io/images/github/div.png)

<a name="using-phaser"></a>
## Using Phaser

Phaser is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development and the minified version for production.

### Custom Builds

Starting from Phaser 2.3.0 we now include a brand new build system which allows you to strip out lots of additional features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then you can now exclude the entire sound system. Don't need Keyboard support? That can be stripped out too.

As a result of this work the minimum build size of Phaser is now just 80KB minified and gzipped.

See the [Creating a Custom Phaser Build](http://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

### Building from source

Should you wish to build Phaser from source you can take advantage of the provided [Grunt](http://gruntjs.com/) scripts. Ensure you have the required packages by running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

![div](http://www.phaser.io/images/github/div.png)

<a name="games"></a>
## Games made with Phaser

Thousands of games have been made in Phaser. From game jam entries to titles by some of the largest entertainment brands in the world. Here is a tiny sample:

[![Game](http://phaser.io/images/github/241/bubble-academy.png)][game10]
[![Game](http://phaser.io/images/github/241/woodventure.png)][game11]
[![Game](http://phaser.io/images/github/241/hopsop.png)][game12]
[![Game](http://phaser.io/images/github/241/banana-mania.png)][game13]
[![Game](http://phaser.io/images/github/241/salazar.png)][game14]
[![Game](http://phaser.io/images/github/241/phaser-shmup.png)][game15]
[![Game](http://phaser.io/images/github/241/trappy-trap.png)][game16]
[![Game](http://phaser.io/images/github/241/runaway-ruins.png)][game17]
[![Game](http://phaser.io/images/github/241/ananias.png)][game18]
[![Game](http://phaser.io/images/github/shot1a.jpg)][game1]
[![Game](http://phaser.io/images/github/shot2a.jpg)][game2]
[![Game](http://phaser.io/images/github/shot3a.jpg)][game3]
[![Game](http://phaser.io/images/github/shot4a.jpg)][game4]
[![Game](http://phaser.io/images/github/shot5b.jpg)][game5]
[![Game](http://phaser.io/images/github/shot6b.jpg)][game6]
[![Game](http://phaser.io/images/github/shot7b.jpg)][game7]
[![Game](http://phaser.io/images/github/shot8.jpg)][game8]
[![Game](http://phaser.io/images/github/shot9.jpg)][game9]

Artwork copyright their respective owners.

We add [new games](http://phaser.io/news/category/game) to the Phaser site weekly, so be sure to send us yours when it's finished!

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

The majority of Phaser development is now taking place on the Phaser 3 project. The Phaser 2 branch will still be supported and issues fixed, but roadmap features have been migrated over to Phaser 3.

<a name="phaser3"></a>
## Phaser 3

We're now a good way in to development of Phaser 3. We've been working hard on creating a brand new and extremely powerful renderer. Progress reports are posted to the [web site](http://phaser.io/labs) and [Phaser 3 repo](https://github.com/photonstorm/phaser3).

There is still plenty of time to add your suggestions and feedback in [this forum thread](http://www.html5gamedevs.com/topic/7949-the-phaser-3-wishlist-thread/).

If you are an exceptional JavaScript developer and would like to join the Phaser 3 development team then let us know. We have a limited budget available to pay towards your time.

## Phaser Nano

[Phaser Nano](https://github.com/photonstorm/phaser-nano) is a cut-down and optimized build of Phaser designed specifically for super low file-size environments such as banner ads and interstitials. It still uses the same friendly API as Phaser but in a much smaller footprint. The current release being just 8.3KB.

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

## Version 2.4.4 - "Amador" - 15th October 2015

### New Features

* Emitter.emitParticle now has 4 new optional arguments: `x`, `y`, `key` and `frame`. These allow you to override whatever the Emitter default values may be and emit the particle from the given coordinates and with a new texture.
* Group.resetChild is a new method that allows you to call both `child.reset` and/or `child.loadTexture` on the given child object. This is used internally by `getFirstDead` and similar, but is made public so you can use it as a group iteration callback. Note that the child must have public `reset` and `loadTexture` methods to be valid for the call.
* Group.getFirstDead, Group.getFirstAlive and Group.getFirstExists all have new optional arguments: `createIfNull`, `x`, `y`, `key` and `frame`. If the method you call cannot find a matching child (i.e. getFirstDead cannot find any dead children) then the optional `createIfNull` allows you to instantly create a new child in the group using the position and texture arguments to do so. This allows you to always get a child back from the Group and remove the need to do null checks and Group inserts from your game code. The same arguments can also be used in a different way: if `createIfNull` is false AND you provide the extra arguments AND a child is found then it will be passed to the new `Group.resetChild` method. This allows you to retrieve a child from the Group and have it reset and instantly ready for use in your game without any extra code.
* P2.Body.removeCollisionGroup allows you to remove the given CollisionGroup, or array of CollisionGroups, from the list of groups that a body will collide with and updates the collision masks (thanks @Garbanas #2047)
* Filter.addToWorld allows you to quickly create a Phaser.Image object at the given position and size, with the Filter ready applied to it. This can eliminate lots of duplicate code.
* Tiled 0.13.0 added support for layer data compression when exporting as JSON. This means that any .tmx stored using base64 encoding will start exporting layer data as a base64 encoded string rather than a native array. This update adds in automatic support for this as long as the data isn't compressed. For IE9 support you'll need to use the new polyfill found in the resources folder (thanks @noidexe #2084)
* You can now load single layer Pyxel Edit TileMaps as an atlas (thanks @joshpmcghee #2050)
* Canvas.getSmoothingPrefix will return the vendor prefixed smoothing enabled value from the context if set, otherwise null.
* The Random Number Generator can now get and set its state via rnd.state. This allows you to do things like saving the state of the generator to a string that can be part of a save-game file and load it back in again (thanks @luckylooke #2056 #1900)
* Device.iOSVersion now contains the major version number of iOS.
* The new `PointerMode` enumeration value has been added for better simple input discrimination in the future, between active pointers such as touch screens and passive pointers, such as mouse cursors (thanks @pnstickne #2062)
* Button.justReleasedPreventsOver controls if a just-release event
on a pointer prevents it from being able to trigger an over event.
* Button.forceOut expanded to accept a PointerMode value such that it
can be controlled per-input mode.
* Phaser.KeyCode is a new pseudo-type used by the Keyboard class (and your code) to allow for separation of all the Keyboard constants to their own file. This stops the JSDocs from becoming 'polluted' and allows for easier future expansion (thanks @pnstickne #2118 #2031)

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @milkey-mouse @timotei @qdrj @Garbanas @cloakedninjas)
* Docs typo fixes (thanks @rwrountree @yeluoqiuzhi @pnstickne @fonsecas72 @JackMorganNZ @caryanne)
* Math.average has been optimized (thanks @rwrountree #2025)
* When calling GameObject.revive the `heal` method is called to apply the health value, allowing it to take into consideration a `maxHealth` value if set (thanks @bsparks #2027)
* Change splice.call(arguments, ..) to use slice instead (thanks @pnstickne #2034 #2032)
* BitmapData.move, moveH and moveV have a new optional `wrap` argument allowing you to control if the contents of the BitmapData are wrapped around the edges (true) or simply scrolled off (false).
* Time.desiredFps has moved to a getter / setter.
* Time.physicsElapsed and Time.physicsElapsedMS are no longer calculated every frame, but only when the desiredFps is changed.
* Time.update has been streamlined and the `updateSetTimeout` and `updateRAF` methods merged and duplicate code removed.
* Time.desiredFpsMult is a pre-calculated multiplier used in Game.update.
* Time.refresh updates the `Time.time` and `Time.elapsedMS` values and is called automatically by Game.update.
* DeviceButton was setting a `duration` property on itself, which went against the read only getter of duration (thanks @winstonwolff)
* Added Node.js v4 stable to Travis config (thanks @phillipalexander #2070)
* Optimised Canvas.getSmoothingEnabled, Canvas.setSmoothingEnabled and Canvas.setImageRenderingCrisp.
* The Physics Editor Exporter (found in the resources folder of the repo) has had an option to prefix shape names and optimize JSON output added to it (thanks @Garbanas #2093)
* Touch.addTouchLockCallback has a new argument `onEnd` which allows the callback to fire either on a touchstart or a touchend event.
* The SoundManager now detects if the browser is running under iOS9 and uses a touchend callback to unlock the audio subsystem. Previous versions of iOS (and Android) still use touchstart. This fixes Apple's screw-up with regard to changing the way Web Audio should be triggered in Mobile Safari. Thanks Apple (thanks @MyCatCarlos for the heads-up #2095)
* InputHandler.validForInput now checks if the game object has `input.enabled` set to `false` and doesn't validate it for input if that's the case.
* The default Button.onOverMouseOnly value has changed from `false` to `true`. If you used this in your touch enabled games then please be aware of this change (#2083)
* BitmapData.clear now automatically calls BitmapData.update at the end of it.
* New Color stub added for the custom build process. Contains just the bare minimum of functions that Phaser needs to work. Cuts file size from 48.7KB to 7.4KB. Note: Do not stub this out if using BitmapData objects.
* New DOM stub added for the custom build process. Contains just the bare minimum of functions that Phaser needs to work. Cuts file size from 14.8KB to 2.4KB. Note: Do not stub this out if using the full Scale Manager.
* New Scale Manager stub added. Removes all Scale Manager handling from Phaser! But saves 75KB in the process. If you know you don't need to scale the Phaser canvas, or are handling that externally, then you can safely stub it out in a custom build.
* Added the PIXI.PolyK, PIXI.WebGLGraphics and PIXI.CanvasGraphics files to the Graphics custom build option. They weren't used anyway and this removes an extra 40.2KB from the build size.
* Phaser.Create no longer automatically creates a BitmapData object when it starts. It now only does it when you first make a texture or grid.
* New Create stub added for the custom build process. Cuts file size by 8KB.
* You can now exclude the FlexGrid from custom builds, saving 15KB.
* The ScaleManager no longer creates a Phaser.FlexGrid if the class isn't available (i.e. excluded via a custom build)
* Time.suggestedFps is now defaulted to `Time.desiredFps` for the first few frames until things have settled down (previously it was `null`) (thanks @noidexe #2130)
* Text with anchor 0.5 and word wrap would have an extra space added to its width calculations, this is now adjusted for (thanks @nickryall #2052 #1990)
* ScaleManager.getParentBounds now checks if `parentNode` has an `offsetParent` before calling `getBoundingClientRect` on it (thanks @McFarts #2134)

### Bug Fixes

* Loader.bitmapFont wouldn't automatically set the `atlasURL` value if just the key was given.
* The Loader would put the baseURL and/or path in front of `data:` and `blob` URLs (thanks @rblopes #2044)
* When the Text width was being calculated it would add the `strokeThickness` value twice, causing an alignment offset (thanks @nickryall #2039)
* Sound.onEndedHandler has a fix for AudioBufferSourceNode listener memory leak (thanks @Pappa #2069)
* Game.update could call `updateLogic` multiple times in a single frame when catching up with slow device frame rates. This would cause Tweens to advance at twice the speed they should have done (thanks @mkristo)
* Added useCapture flags to removeEventListener in MSPointer class (thanks @pmcmonagle #2055)
* Under setTimeOut (or when `forceSetTimeOut` was true) the Time was incorrectly setting `Time.timeExpected` causing game updates to lag (thanks @satan6 #2087)
* Fixes edge case when TilingSprite is removed before render (thanks @pnstickne #2097 #2092)
* Camera.setBoundsToWorld only adjusts the bounds if it exists (thanks @prudolfs #2099)
* Keyboard.addCallbacks didn't check to see if the arguments were `null`, only if they were `undefined` making the jsdocs misleading.
* ScaleManager.getParentBounds now takes any transforms into account to get the correct parent bounds (thanks @jdnichollsc #2111 #2098)
* Cache.addBitmapFont now applies a default value for the x and y spacing if the arguments are omitted (thanks @nlotz #2128)
* Removed use of the `tilePosition` property in the Phaser.Rope class as it isn't implemented and caused calls to `Rope.reset` to crash (thanks @spayton #2135)
* ScaleMin and ScaleMax stopped working in Phaser 2.3.0 due to an incorrect transform callback scope (thanks @brianbunch #2132)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* CanvasRenderer.mapBlendModes optimised to cut down on file size.
* PIXI.WebGLRenderer.updateTexture now returns a boolean depending on if the texture was successfully bound to the gl context or not.
* PIXI.WebGLSpriteBatch.renderBatch would still try and render a texture even if `updateTexture` failed to bind it. It now checks the return value from `updateTexture` and ignores failed binds.
* WebGLRenderer.mapBlendModes optimised to cut down on file size.
* Sprite.getBounds would report an inaccurate value if the sprite was negatively scaled (causing things like generateTexture to be cut off) (thanks @DavidAPC #2108)
* Removed DisplayObject.transformCallback as it's a Game Object component.
* BaseTexture.skipRender is a new boolean that can be set to skip the rendering phase in the WebGL Sprite Batch. You may want to do this if you have a parent Sprite with no visible texture (i.e. uses the internal `__default` texture) that has children that you do want to render, without causing a batch flush in the process.

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

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.4.4/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.4.4/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.4.4.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.4.4.tar.gz
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
[game2]: http://www.bbc.co.uk/cbbc/games/deadly-defenders-game
[game3]: http://www.defiantfew.com/
[game4]: http://www.pawpatrol.com/fun.php
[game5]: http://www.fyretale.com/
[game6]: http://www.pocoyo.com/juegos-ninos/caramelos
[game7]: http://www.html5gamedevs.com/topic/11179-phaser-cocoonjs-tap-tap-submarine/
[game8]: http://www.gamepix.com/project/footchinko/
[game9]: http://orcattack.thehobbit.com
[game10]: http://phaser.io/news/2015/06/bubble-academy
[game11]: http://phaser.io/news/2015/07/woodventure
[game12]: http://phaser.io/news/2015/04/hopsop-journey-to-the-top
[game13]: http://phaser.io/news/2015/05/banana-mania
[game14]: http://phaser.io/news/2015/06/salazar-the-alchemist
[game15]: http://phaser.io/news/2015/05/phaser-shmup
[game16]: http://phaser.io/news/2015/05/trappy-trap
[game17]: http://phaser.io/news/2015/04/runaway-ruins
[game18]: http://phaser.io/news/2015/04/ananias
