![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses a custom build of [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and desktop apps via 3rd party tools like Cocoon, Cordova and Electron.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on GitHub.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)
* **Learn:** [API Documentation](http://phaser.io/docs), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)
* **Code:** 700+ [Source Examples](http://phaser.io/examples) (also available in this [git repo][examples])
* **Read:** Subscribe to the weekly [Phaser World Newsletter](http://phaser.io/community/newsletter)
* **Chat:** [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) or our [Slack Channel](http://phaser.io/news/2015/08/phaser-slack-channel)
* **Extend:** With [Phaser Plugins](http://phaser.io/shop/plugins)
* **Be awesome:** Support the future of Phaser on [Patreon](https://www.patreon.com/photonstorm) or by buying our [books](http://phaser.io/shop/books)

![div](http://www.phaser.io/images/github/div.png)

## Index

- [What's New?](#whats-new)
- [Support Phaser](#patreon)
- [Phaser World](#phaserworld)
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
## What's new in Phaser 2.4.7

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

> 22nd April 2016

We're pleased to announce the release of Phaser 2.4.7. This version encompasses another raft of fixes, updates and new features. Many hours of hard work were put in to diligently working through the GitHub issues list, and fixing and closing down as many issues as we possibly could.

My thanks to all those who contributed to this release, either by way of telling us about an issue, providing a fix, or just testing out the release candidate.

There are a few internal changes in 2.4.7, nothing that breaks the public-facing API, but if you do some deep-dive work in Phasers guts then you may want to check out the change log, and commit history, to be sure it doesn't impact your own code.

We are now splitting our time between development of Lazer, and Phaser 2.5. We decided, after much discussion with the community, that we owed it to Phaser to go out on a high, so 2.5 will be the version in which we do just that. After this Phaser will enter the LTS (long-term support) stage of its life. 

This is when we impose a feature freeze, locking the API down and responding only to bugs. This is a necessary step to allow us to focus on Lazer while still ensuring Phaser is given the support it deserves.

As always, keep you eyes on the Phaser web site, our weekly newsletter, or follow me on [Twitter](https://twitter.com/photonstorm) for the latest updates.

We'd be extremely grateful if you could get involved with our [Phaser Patreon campaign](https://www.patreon.com/photonstorm). The uptake so far has been fantastic. Thank you to everyone who now supports Phaser development and shares our belief in the future of HTML5 gaming, and Phasers role in that.

Happy coding everyone! See you on the forums.

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github/div.png)

<a name="patreon"></a>
## Support Phaser on Patreon

![patreon](http://www.phaser.io/images/patreon.png)

Please help support the future development of Phaser / Lazer through our [Patreon campaign](https://www.patreon.com/photonstorm). We've some exciting plans and there's so much we'd like to do.

### Phaser Sponsors

Phaser is [sponsored](https://www.patreon.com/photonstorm) by the following great companies:

![qici](http://www.phaser.io/images/sponsors/qici-100.png)

QICI Engine: [A powerful one-stop integrated Phaser game editor](http://www.qiciengine.com/)

![zenva](http://www.phaser.io/images/sponsors/zenva-100.png)

Zenva Academy: [Online courses on Phaser, HTML5 and native app development](https://academy.zenva.com/?zva_src=phaserpatreon)

![abra](http://www.phaser.io/images/sponsors/abra-100.png)

Abra: [Complete browser based game development](https://aurifexlabs.com/)

![div](http://www.phaser.io/images/github/div.png)

<a name="phaserworld"></a>
## Phaser World

<div align="center"><img src="http://phaser.io/images/github/phaser-world.png"></div>

Every Friday we publish our newsletter: [Phaser World](http://phaser.io/community/newsletter). It's packed full of the latest Phaser games, tutorials, videos, meet-ups, conference talks and more. We also post regular development updates, and occasionally special offers.

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

Using Browserify? Please [read this](#browserify).

### CDN

[jsDelivr](http://www.jsdelivr.com/#!phaser) is a "super-fast CDN for developers". Include the following in your html:

`<script src="//cdn.jsdelivr.net/phaser/2.4.7/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.4.7/phaser.min.js"></script>`

[cdnjs.com](https://cdnjs.com/libraries/phaser) also offers a free CDN service. They have all versions of Phaser and even the custom builds:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.7/phaser.js"></script>`

### Phaser Sandbox

If you'd like to try coding in Phaser right now, with nothing more than your web browser, then you can head over to the [Phaser Sandbox](http://phaser.io/sandbox). You'll find Quick Start templates and a user-friendly editor filled with handy code-completion features.

### Koding

Want to try Phaser without downloading anything? The site [Koding](https://koding.com) offer a complete browser-based virtual machine to work in, allowing you to clone the Phaser repo and start work immediately.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![div](http://www.phaser.io/images/github/div.png)

<a name="getting-started"></a>
## Getting Started

<img src="http://phaser.io/images/github/learn.jpg" align="right">

We have a [Getting Started Guide](http://phaser.io/tutorials/getting-started) which covers all you need to begin developing games with Phaser. From setting up a web server, to picking an IDE and coding your first game. Please start here no matter what your game-dev experience, before diving in to the API.

The single biggest Phaser resource is the [Phaser web site](http://phaser.io/news). It has hundreds of tutorials listed and fresh ones are added every week. Keep coming back to see what's new!

Using Phaser with **TypeScript**? Check out this great series of [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) tutorials.

Prefer **videos** to reading? Lynda.com have published a video based course: [HTML5 Game Development with Phaser](http://www.lynda.com/Phaser-tutorials/HTML5-Game-Development-Phaser/163641-2.html) (requires subscription)

### Source Code Examples

Ever since we started Phaser we've been growing and expanding our extensive set of source code examples. Currently there are over 700 of them!

Browse the [Phaser Examples](http://phaser.io/examples) or clone the [examples repo][examples] and eat your heart out!

### Interphase

<div align="center"><img src="http://phaser.io/content/interphase/1/images/editorial/pages.jpg"></div>

[Interphase](http://phaser.io/interphase) is a new book for Phaser developers of all skill levels.

With 400 pages of content you'll find detailed articles, game development "Making Of" guides and tutorials. All were written using the latest version of Phaser, so you won't be learning any out-dated tricks here.

As well as the book you get all the source code, graphics and assets to go with it, and lots of extras too.

[Read More](http://phaser.io/interphase)

### Phaser Editor - A complete Phaser Editor

[Phaser Editor](http://phasereditor.boniatillo.com/) is a brand new Eclipse based editor that offers lots of built-in tools specifically for Phaser developers. Handy features include Smart code auto-completion, built-in web server, documentation search, asset management, texture atlas creator, audio sprite creator, asset previews and lots more.

### Game Mechanic Explorer

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

### Mighty Editor - Visual Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![div](http://www.phaser.io/images/github/div.png)

<a name="using-phaser"></a>
## Using Phaser

Phaser is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development and the minified version for production.

### Custom Builds

Phaser includes a grunt based build system which allows you to strip out lots of additional features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then you can now exclude the entire sound system. Don't need Keyboard support? That can be stripped out too.

As a result of this work the minimum build size of Phaser is now just 80KB minified and gzipped.

See the [Creating a Custom Phaser Build](http://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

<a name="browserify"></a>
### Browserify / CJS

Phaser was never written to be modular. Everything exists under one single global namespace, and you cannot `require` selected parts of it into your builds. It expects 3 global vars to exist in order to work properly: `Phaser`, `PIXI` and `p2`. The following is one way of doing this:

```
window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')
```

If you build a custom version of Phaser (see above) it will split the 3 core libs out into their own files, allowing you to require them as above.

We appreciate this is just a band-aid and not a proper use of modules, but please understand it was never built to be used this way. You're trying to fit a square peg in a round browserify-shaped hole, so compromises have to be made. Please don't open GitHub issues about it. We've no intention of changing Phaser at this stage of its life. Full module based development is being undertaken in Lazer.

### Webpack

Starting from Phaser 2.4.5 we now include a custom build for Webpack.

You need to add `p2` as a dependency.

##### Webpack Config

```
var path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
    ...
    module: {
        loaders: [
            { test: /pixi.js/, loader: "script" },
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    }
    ...
}
```

##### Main js file

```
require('pixi.js');
require('p2');
require('phaser');
```

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

While Phaser does its best to ensure a consistent cross-platform experience, always be aware of browser and device limitations. This is especially important with regard to memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### IE9

If you need to support IE9 / Android 2.x **and** use P2 physics then you must use the polyfill in the `resources/IE9 Polyfill` folder. If you don't use P2 (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code and were careful not to impose a strict structure upon you. You won't find Phaser split into modules, requiring a build step, or making you use a class / inheritance OOP approach. That doesn't mean you can't do so, it just means we don't *force* you to. It's your choice.

If you code with [TypeScript](http://www.typescriptlang.org/) there are comprehensive definition files in the `typescript` folder. They are for TypeScript 1.4+.

![div](http://www.phaser.io/images/github/div.png)

<a name="road-map"></a>
## Road Map

The majority of Phaser development is now taking place on the Lazer (Phaser 3) project. The Phaser 2 branch will still be supported and issues fixed, but roadmap features have been migrated over.

<a name="phaser3"></a>
## Lazer (Phaser 3)

Lazer is the new name for Phaser 3.

Lazer is the next generation of the Phaser game framework. Using a completely ES6 base it is renderer agnostic, allowing for DOM, SVG, Canvas and WebGL rendering, across desktop and mobile web browsers.

You can read all about the philosophy behind Lazer [here](http://phaser.io/news/2016/01/phaser-in-2015-and-beyond) or join the Google Groups [mailing list](https://groups.google.com/d/forum/phaser3-dev) where progress reports are posted on a regular basis.

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

## Version 2.4.7 - "Hinderstap" - 22nd April 2016

### New Features

* Added P2.Body.thrustLeft which will move the Body to the left by the speed given (thanks James Pryor)
* Added P2.Body.thrustRight which will move the Body to the right by the speed given (thanks James Pryor)
* Polygon now takes an array of arrays as a new type when constructing it: `[[x1, y1], [x2, y2]]` (thanks @ShimShamSam #2360)
* Text has a new property `maxLines` which is the maximum number of lines to be shown for wrapped text. If set to 0 (the default) there is limit. This prevents wrapped text from overflowing on a fixed layout (thanks @slashman #2410)
* `outOfCameraBoundsKill` is a new boolean property that all Game Objects with the `InWorld` component has. If `autoCull` and this property are both `true` then the Object will be automatically killed if it leaves the camera bounds (thanks @jakewilson #2402)
* Group.getByName searches the Group for the first instance of a child with the `name` property matching the given argument. Should more than one child have the same name only the first instance is returned.
* BitmapData has a new property `frameData` which is a Phaser.FrameData container instance. It contains a single Frame by default, matching the dimensions of the entire BitmapData, but can be populated with additional frames should you wish to create animations from dynamic BitmapData textures.
* FrameData.destroy will nullify the local arrays used to contain Frame instances.
* SoundManager.muteOnPause is a new boolean that allows you to control if the Sound system gets muted automatically when a Phaser game pauses, such as when it loses focus. You may need to set this to `false` if you wish to control the audio system from outside of your Phaser game, i.e. from DOM buttons or similar (#2382)
* You can now pass a TilemapLayer as a Texture to a TileSprite. A limitation of this is that if you pass it to a TileSprite it will make a fill pattern from the TilemapLayer at that instant it's passed, and it won't keep track of the layer in future should it update (thanks @jdnichollsc #1989)
* Camera has a new property: `lerp`. This is a Point object, that allows you to control the amount of horizontal and vertical smoothing to be applied to the camera when it tracks a Sprite. It works both with and without deadzones, and is turned off by default. Set it to low values such as 0.1 for really smooth motion tracking (thanks to @WombatTurkey for the idea of adding this)
* Camera.shake is a new function that creates a camera shake effect. You can specify the intensity, duration and direction of the effect. You can also set if it should shake the camera out of bounds or not.
* Camera.flash is a new function that makes the camera 'flash' over the top of your game. It works by filling the game with the solid fill color specified, and then fading it away to alpha 0 over the duration given. This is great for things like hit effects. You can listen for the Camera.onflashComplete Signal.
* Camera.fade is a new function that makes the camera fade to the color given, over the course of the duration specified. This is great for things like transitioning from one State to another. You can listen for the Camera.onFadeComplete Signal.
* Camera.resetFX resets any active FX, such as a fade or flash and immediately clears it. Useful for calling after a fade in order to remove the fade from the Stage.
* Phaser.Camera.ENABLE_FX is a const that controls if the Camera FX are available or not. It's `true` by default, but if you set it to `false` before boot then it won't create the Graphics object required to process the effects.
* The Arcade Physics Body has two new properties: `left` and `top`. These are the same as `Body.x` and `Body.y` but allow you to pass the Body to geometry level functions such as Circle.contains.
* World.separate has been optimized to cut down on the number of calls to `intersect` from 3 calls per Game Object collision check, to 2. So if you were colliding 50 sprites it will reduce the call count from 150 to 100 per frame. It also reduces the calls made to `seperateX` and `seperateY` by the same factor.
* Two immovable bodies would never set their overlap data, even if an overlap only check was being made. As this is useful data to have this has been changed. Two immovable bodies will still never separate from each other, but they _will_ have their `overlapX` and `overlapY` properties calculated now.
* P2.Body.offset is now used and applied to the Sprite position during rendering. The values given are normal pixel values, and offset the P2 Body from the center of the Sprite (thanks @Mourtz #2430)

### Updates

* TypeScript definitions fixes and updates (thanks @jamesgroat @kiswa)
* Docs typo fixes (thanks @thiagojobson @hayesmaker @EJanuszewski)
* Removed a `console.log` from the TilingSprite generator.
* Sound.position can no longer become negative, meaning calls to AudioContextNode.start with negative position offsets will no longer throw errors (thanks @Weedshaker #2351 #2368)
* The default state of the internal property `_boundDispatch` in Phaser.Signal is now `false`, which allows for use of boundDispatches (thanks @alvinlao #2346)
* The Tiled parser only supports uncompressed layer data. Previously it would silently fail, now it detects if layer compression is used and displays a console warning instead (thanks @MannyC #2413)
* The Tiled parser now removes the `encoding` parameter so that a subsequent process doesn't try to decode the data again (thanks @MannyC #2412)
* Ensure a parent container is a Group before removing from its hash (thanks @rblopes #2397)
* The Game Object Input Handler now checks to see if the Object was destroyed during the `onInputDown` phase, and bails out early if so (thanks @zeterain #2394)
* The Destroy component will now call TweenManager.removeFrom, removing any active tweens from the TweenManager upon the Game Objects destructions (thanks @PokemonAshLovesMyTurkeyAndILikeYouTwo #2408)
* Tween.update will now return `false` (flagging the Tween for destruction) should the Tween.target property every become falsey. This can happen if the object the Tween was tracking is destroyed, nulled or generally removed.
* TweenData.repeatTotal is a new property that keeps track of the total number of times the Tween should repeat. If TweenData.start is called, as a result of the Tween repeatCount being > 0 then the child tween resets its total before re-starting.
* The Debug canvas now listens for the ScaleManager.onSizeChange signal and resizes itself accordingly when running under WebGL. This means if your game size changes the Debug canvas won't be clipped off (thanks @francisberesford #1919)
* Camera.follow now uses the Targets `world` property to seed the camera coordinates from, rather than its local position. This means Sprites that are members of offset Groups, or transformed display lists, should now be followed more accurately (thanks @rbozan #2106)
* PluginManager.destroy is now called by Game.destroy.
* Game.forceSingleUpdate is now `true` by default.
* Video now uses MediaStreamTrack.stop() instead of MediaStream.stop() where possible, as the later is now deprecated in some browsers (thanks @stoneman1 #2371)
* The Physics Manager will now throw a console warning if you try to enable a physics body using an unknown physics engine type (thanks @jakewilson #2415)
* The Tileset class will tell you the name of the tileset image throwing the uneven size error (thanks @jakewilson #2415)
* Emitter.start when used with a false `explode` parameter would cumulatively add particles to the current total. With quantity 10 the first call would emit 10 particles, the next 20, and so on. Calls to start will now reset the quantity each time. This is a behavior change from earlier versions, so if you relied on the old way please account for it in your code (thanks @BdR76 #2187)
* You can now pass in your own Canvas element to Phaser and it will use that instead of creating one itself. To do so you must pass a Game Configuration object to Phaser when you instantiate it, and set the `canvas` property of the config object to be the DOM element you wish to use, i.e.: `{ canvas: document.getElementById('yourCanvas') }` (thanks @Friksel #2311)
* When loading Video with the `asBlob` argument set it now uses a 'blob' type for the XHR loader, and doesn't cast the resulting file as a Blob upon load. This fixes loading videos as blobs on Chrome for Android (thanks @JuCarr #2433)
* When the Loader loads audio via the Audio tag, instead of Web Audio, it used to use `Phaser.GAMES[_this.game.id].load` as the callback handler, which would stop it from working if you had multiple Loaders set-up within Phaser. It now uses a local reference to `_this` instead (thanks @SBCGames #2435)

### Bug Fixes

* The `mouseoutglobal` event listener wasn't removed when the game was destroyed (thanks @stoneman1 #2345 #2344 #2342)
* Fixed issue with IE crashing on this.context.close in the Sound Manager (thanks @stoneman1 #2349)
* Phaser.World.centerX and Phaser.World.centerY only worked if the bounds had an origin of 0, 0. They now take into account the actual origin (thanks @fillmoreb #2353)
* SoundManager.destroy now validates that context.close is a valid function before calling it (thanks @brianbunch #2355)
* SoundManager.destroy doesn't close the context if it's being stored in PhaserGlobal (thanks @brianbunch #2356)
* Fix typo in p2 BodyDebug.componentToHex that made most debug bodies appear reddish in color (thanks @englercj #2381)
* Previously when a sprite was tinted and a new texture was loaded then the tint did not apply to the texture and the old tinted texture was used (thanks @CptSelewin #2383)
* Negative lineSpacing in Text objects will no longer crop the bottom pixels off lines of text (thanks @gaelenh #2379 #2374)
* BitmapData.copy, and by extension draw, drawFull, drawGroup, etc, would incorrectly handle drawing a tinted Sprite if it was using a frame from a texture atlas (thanks @PhaserDebugger #2405)
* Text that used fonts which had numbers in their names wouldn't be correctly rendered unless you explicitly set the font property after creation. You can now pass font names with numbers in them as the font style object correctly (thanks @And-0 #2390)
* Tween.update wouldn't dispatch an `onLoop` signal for Tweens with just one child, such as those created via Tween.to with -1 as the repeat value (thanks @ForgeableSum #2407)
* Arcade.Body's speed property was only set when the body moved, it now updates regardless (thanks @mark-henry #2417)
* Camera.position would return the view rectangles centerX/Y coordinates, instead of view.x/y (which is what Camera.x/y returns), so it has been updated to return view.x/y instead (thanks @kamparR #2120)
* Passing a BitmapData to a TileSprite as a texture would fail if the BitmapData had not been previously added to the cache. It now uses the new frameData property (thanks @mzamateo @lucap86 #2380)
* When setting a global volume for the SoundManager it would previously incorrectly calculate the volumes of AudioTag based Sound objects that were not played at volume 1. The new approach uses Sound.updateGlobalVolume which adjusts the Sound volume to be a percentage of the global volume. So if the global volume is 0.5 and the Sound volume is 0.5, the Sound will play with an actual volume of 0.25 (thanks @VitaZheltyakov #2325)
* Sound.play when using an AudioTag would ignore the muted state of the SoundManager and play regardless. It now checks the SoundManager.mute state on play, and sets the volume accordingly (thanks @brianbunch #2139)
* Graphics objects can now have a Physics Body directly attached to them, where-as before it would throw an error due to a lack of anchor property (thanks @NLilley #2400)
* A Game Object with `fixedToCamera = true` that was then set for Input, and enabled for dragging from its center (`input.enableDrag(true)`) would throw an error upon being dragged (thanks @solusipse #2367)
* P2.World.updateBoundsCollisionGroup wouldn't use the `boundsCollisionGroup` mask if you passed `true` as the argument, only if it was left undefined.
* P2.World.updateBoundsCollisionGroup didn't set the `_boundsOwnGroup` private var, meaning the `World.setBounds` method wasn't able to restore previously set collision masks automatically (thanks @jmp909 #2183)
* P2.World.setBounds has been re-written completely. If the World is resized it no longer removes the P2 body instances and re-creates them. Instead it checks to see which walls are required and then just moves the position of the shapes instead, or updates them, or creates or destroys them as required. This is far more efficient, especially in a game which sees a lot of world bounds changes (i.e. resizes responsively in browser)
* BitmapText would throw an error if you passed in a number as the text property to the constructor. It worked if you used the text accessor directly because it cast the value to a string, but the constructor missed out this step (thanks @lewispollard #2429)
* Dragging a Sprite while the camera was moving would slowly cause the Sprite position to become out of sync the further the camera moved. A Sprite being dragged now tracks the camera position during the drag update and adjusts accordingly (thanks @jeroenverfallie #1044)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* DisplayObjectContainer.getLocalBounds destroys the worldTransforms on children until the next `stage.updateTransform()` call. This can make a number of things break including mouse input if width, height or getLocalBounds methods are called inside of an update or preUpdate method. This is now fixed in our Pixi build (thanks @st0nerhat #2357)
* PIXI.CanvasRenderer.resize now applies the `renderSession.smoothProperty` to the Canvas context when it resizes. This should help with unwanted canvas smoothing (thanks @sergey7c4 #2395 #2317)

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

The Phaser logo and characters are &copy; 2016 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.4.7/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.4.7/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.4.7.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.4.7.tar.gz
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
