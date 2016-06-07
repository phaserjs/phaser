![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses a custom build of [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and desktop apps via 3rd party tools like Cocoon, Cordova and Electron.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on GitHub.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)
* **Learn:** [API Documentation](http://phaser.io/docs), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)
* **Code:** 700+ [Source Examples](http://phaser.io/examples) (also available in this [git repo][examples])
* **Read:** Subscribe to the weekly [Phaser World Newsletter](#phaserworld)
* **Chat:** Join our [Slack Channel](http://phaser.io/news/2015/08/phaser-slack-channel), or [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/)
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
- [Lazer](#lazer)
- [Contributing](#contributing)

![div](http://www.phaser.io/images/github/div.png)

<a name="whats-new"></a>
## What's new in Phaser 2.4.9

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

> In Development

The release of Phaser 2.4.9 is currently in development. This README will be updated as development continues.

As always, keep you eyes on the Phaser web site and read our weekly [newsletter](#phaserworld). You can also follow me on [Twitter](https://twitter.com/photonstorm) or chat to me in the Phaser [Slack](http://phaser.io/news/2015/08/phaser-slack-channel) channel.

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

`<script src="//cdn.jsdelivr.net/phaser/2.4.9/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.4.9/phaser.min.js"></script>`

[cdnjs.com](https://cdnjs.com/libraries/phaser) also offers a free CDN service. They have all versions of Phaser and even the custom builds:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.4.9/phaser.js"></script>`

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

[Interphase](http://phaser.io/interphase) is a programming book for Phaser developers of all skill levels.

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

The majority of Phaser development is now taking place on the [Lazer](https://github.com/photonstorm/lazer) (Phaser 3) project. The Phaser 2 branch will still be supported and issues fixed, but roadmap features have been migrated over.

<a name="lazer"></a>
## Lazer

[Lazer](https://github.com/photonstorm/lazer) is the next generation of the Phaser game framework, and was previously called Phaser 3. Using a completely ES6 base it is renderer agnostic, allowing for DOM, SVG, Canvas and WebGL rendering, across desktop and mobile web browsers.

**Lazer is in active development but is not yet ready for production use.**

You can read all about the philosophy behind Lazer [here](http://phaser.io/news/2016/01/phaser-in-2015-and-beyond) or join the Google Group [mailing list](https://groups.google.com/d/forum/phaser3-dev) where progress reports are posted. You can also follow progress in the Phaser World newsletter.

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

## Version 2.4.9 - "Four Kings" - In Development

### New Features

* Phaser.Line.intersectsRectangle checks for intersection between a Line and a Rectangle, or any Rectangle-like object such as a Sprite or Body.
* Group.getClosestTo will return the child closest to the given point (thanks @Nuuf #2504)
* Group.getFurthestFrom will return the child farthest away from the given point (thanks @Nuuf #2504)
* Animation.reverse will reverse the currently playing animation direction (thanks @gotenxds #2505)
* Animation.reverseOnce will reverse the animation direction for the current, or next animation only (thanks @gotenxds #2505)
* The way the display list updates and Camera movements are handled has been completely revamped, which should result is significantly smoother motion when the Camera is following tweened or physics controlled sprites. The `Stage.postUpdate` function is now vastly reduced in complexity. It takes control over updating the display list (calling `updateTransform` on itself), rather than letting the Canvas or WebGL renderers do this. Because of this change, the `Camera.updateTarget` function uses the Sprites `worldPosition` property instead, which is now frame accurate (thanks @whig @Upperfoot @Whoisnt @hexus #2482)
* Game Objects including Sprite, Image, Particle, TilemapLayer, Text, BitmapText and TileSprite have a new property called `data`. This is an empty Object that Phaser will never touch internally, but your own code, or Phaser Plugins, can store Game Object specific data within it. This allows you to associate data with a Game Object without having to pollute or change its class shape.
* TilemapLayers will now collide properly when they have a position that isn't set to 0x0. For example if you're stitching together several maps, one after the other, and manually adjust their `scrollX/Y` properties (thanks @Upperfoot #2522)
* There are a bunch of new Phaser consts available to help with setting the angle of a Game Object. They are `Phaser.ANGLE_UP`, `ANGLE_DOWN`, `ANGLE_LEFT`, `ANGLE_RIGHT`, `ANGLE_NORTH_EAST`, `ANGLE_NORTH_WEST`, `ANGLE_SOUTH_EAST` and `ANGLE_SOUTH_WEST`.
* Math.between will return a value between the given `min` and `max` values.
* InputHandler.dragDistanceThreshold gives you more fine control over when a Sprite Drag event will start. It allows you to specify a distance, in pixels, that the pointer must have moved before the drag will begin.
* InputHandler.dragTimeThreshold gives you more fine control over when a Sprite Drag event will start. It allows you to specify a time, in ms that the pointer must have been held down for, before the drag will begin.
* InputHandler.downPoint is a new Point object that contains the coordinates of the Pointer when it was first pressed down on the Sprite.
* There are two new Phaser consts available, for help with orientation of games or Game Objects. They are `Phaser.HORIZONTAL`, `Phaser.VERTICAL`, `Phaser.LANDSCAPE` and `Phaser.PORTRAIT`.
* InputHandler.dragStopBlocksInputUp is a boolean that allows you to control what happens with the input events. If `false` (the default) then both the `onInputUp` and `onDragStop` events will get dispatched when a Sprite stops being dragged. If `true` then only the `onDragStop` event is dispatched, and the `onInputUp` is skipped.

### Updates

* TypeScript definitions fixes and updates (thanks @wingyplus @monagames @marineorganism @obamor @BaroqueEngine)
* Docs typo fixes (thanks @seanirby @johnrees)
* The TypeScript defs ambient declaration has been updated to make it compatible with the SystemJS loader (thanks @monagames)
* You can no longer intersect check a Body against itself (thanks @VitaZheltyakov #2514)
* The mobile template has been updated (thanks @cryptographer #2518)
* Video.onComplete wouldn't fire on iOS if the user hit the 'Done' button before the video had finished playing. It now uses the `webkitendfullscreen` event to detect this, and dispatches the `onComplete` signal should that event fire (thanks @kelu-smiley #2498)
* Sound.addMarker now has a default value for the `duration` argument (1 second) to avoid the DOM Exception 11 error if you accidentally miss it out (thanks @mari8i #2508)
* Removed the `Stage.updateTransform` calls from the main game loop, because it happens automatically as part of `Game.updateLogic` anyway, so was duplicating the workload for no reason.
* TilemapLayer.postUpdate could potentially be called several times per frame (depending on device frame rate), which would cause multiple texture redraws, even though only the last texture is used during rendering. This has now been modified so that the local TilemapLayer canvas is only re-rendered once per frame, during the rendering phase, and not during the logic update phase.
* Stage has had all of its core update loops modified, so they now iterate through the display list forwards, instead of in reverse. Stage.postUpdate is now also a lot smaller, with no conditional branching if there is a Camera Target or not.
* Within RequestAnimationFrame both `updateRAF` and `updateSetTimeout` now only call `game.update` if `isRunning` is true. This should avoid asynchronous Game destroy errors under environments like Angular (thanks @flogvit #2521)
* Group.removeAll has a new argument `destroyTexture` which allows you to optionally destroy the BaseTexture of each child, as it is removed from the Group (thanks @stoneman1 #2487)
* PluginManager.remove has a new argument `destroy` (defaults to `true`) which will let you optionally called the `destroy` method of the Plugin being removed.
* Cache.getJSON used to incorrectly bring back a deep-copy of the Phaser.Utils object, instead of just a clone of the JSON object requested (thanks @drhayes #2524 #2526)

### Bug Fixes

* Arcade Physics Body incorrectly positioned if the Sprite had a negative scale (see http://www.html5gamedevs.com/topic/22695-247-248-body-anchoring-any-migration-tips/) (thanks @SBCGames @icameron @Nuuf @EvolViper #2488 #2490)
* InputHandler.checkPointerDown had an incorrect single pipe character |, instead of an OR check ||, and an `isDown` check, causing Button Over events to fail (thanks @pengchuan #2486)
* BitmapText objects with lines greater than `maxWidth` now handle alignment values correctly, causing them to properly center align (thanks @kevinleedrum  #2499 @crippledcactus #2496)
* Text has a new private method `measureLine` which is used to calculate the final Text line length, after factoring in color stops and other style changes. This should prevent characters from becoming truncated (thanks @TadejZupancic #2519 #2512)
* Sometimes the browser would cause a race condition where any connected Game Pads were being detected before the callback had a chance to be established. Also sometimes the rawPad references would become stale, and are now checked constantly (thanks @cwleonard #2471)
* Sound.isPlaying was set to false when doing an audio loop, but never set back to true if it's a sound not using a marker (thanks @TheJasonReynolds #2529)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

*
*
*

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.4.9/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.4.9/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.4.9.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.4.9.tar.gz
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-svn]: https://github.com/photonstorm/phaser
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
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
