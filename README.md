![div](http://www.phaser.io/images/github/welcome-div2.png)

# Phaser

<img src="http://phaser.io/images/github/jump.jpg" align="right">

Phaser is a fast, free and fun open source HTML5 game framework. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS and Android apps via 3rd party tools.

Along with the fantastic open source community Phaser is actively developed and maintained by [Photon Storm Limited](http://www.photonstorm.com). As a result of rapid support and a developer friendly API Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on Github.

Thousands of developers worldwide use it. From indies and multi-national digital agencies to schools and Universities. Each creating their own incredible games. Grab the source and join in the fun!

* **Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (feel free to use #phaserjs)
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

We're kicking off the year with the 2.2.2 release. This is mostly a maintenance release and fixes a few crucial issues such as tilemap rendering in Safari and physics performance. But a few small but super-useful features sneaked in too, my favourite being that the Loader now supports BLOB urls for audio files.

We're hard at work on Phaser 3. Development on the brand new renderer began in earnest last year and we're already seeing exceptional results from it. You can follow our development in the forum and public repo. Even though we're working on taking Phaser 3 into ES6 and the next generation of web browsers, we haven't stopped with the 2.x branch either. 

If you take a peek at the [2.3 milestones](https://github.com/photonstorm/phaser/milestones/2.3.0) you'll see we've got some great features in build. Included is a refactoring of all the Game Object classes, a new parallel asset loader and more consistent Text style handling.

After the runaway success Phaser enjoyed in 2014 we're really excited to see what this year will bring, and hope you'll join us for the ride.

Happy coding everyone! See you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github/div.png)

<a name="change-log"></a>
## Change Log

Version 2.2.2 - "Alkindar" - 6th January 2015

### New Features

* Phaser.Loader now supports BLOB urls for audio files (thanks @aressler38 #1462)
* Line.reflect will calculate the reflected, or outgoing angle of two lines. This can be used for Body vs. Line collision responses and rebounds.
* Line.normalAngle gets the angle of the line normal in radians.
* Line.normalX and Line.normalY contain the x and y components of the left-hand normal of the line.
* Line.fromAngle will sets this line to start at the given `x` and `y` coordinates and for the segment to extend at `angle` for the given `length`.
* BitmapData.drawGroup draws the immediate children of a Phaser.Group to a BitmapData. Children are only drawn if they have their `exists` property set to `true`. The children will be drawn at their `x` and `y` world space coordinates. When drawing it will take into account the child's rotation, scale and alpha values. No iteration takes place. Groups nested inside other Groups will not be iterated through.

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson @Schmavery)
* DOM.visualBounds now includes scroll bars (#1429)
* The new fixed time-step code has been more carefully linked to Pixi transform updates. This should finally put a stop to the tunneling issues that were being reported.
* Tween.stop fired a different set of onComplete parameters to Tween.update. Both now dispatch `onComplete(target, tween)`` as the parameters in that order (thanks @P0rnflake #1450)
* Removed redundant `tolerance` parameter from Rectangle.intersects (thanks @toolness #1463)
* Phaser.Graphics.drawCircle now overrides PIXI.drawCircle which means the docs are now correct re: diameter not radius (thanks @ethankaminski #1454)
* Device.webAudio check inversed to avoid throwing a warning in Chrome.
* Mouse.mouseMoveCallback is flagged as deprecated.
* Remove `tw` and `th` init from TilemapLayer (thanks @nextht #1474)
* Particles.Arcade.Emitter.makeParticles now checks the given `quantity` value against `Emitter.maxParticles`. If `quantity` is more than `maxParticles` then the `maxParticles` value is reset to the new `quantity` given (as this is how most devs seem to use it).
* Particles.Arcade.Emitter.emitParticle now returns a boolean depending if a particle was emitted or not.
* Particles.Arcade.Emitter.update only updates `_counter` if a particle was successfully emitted.
* Phaser.Point.angleSq removed. It didn't work so any code relying on it would be broken, and it's unclear what it was meant for (thanks @nextht #1396)
* BitmapData.copy `tx` parameter if `null` and `source` is a Display Object, it will default to `source.x`.
* BitmapData.copy `ty` parameter if `null` and `source` is a Display Object, it will default to `source.y`.

### Bug Fixes

* Fix / double-copy for Safari tilemap bug when rendering with delta scrolling. This fixes tilemaps not appearing to update on Safari OS X and iOS specifically (thanks @pnstickne @neurofuzzy @lastnightsparty #1439 #1498)
* Simplified call to `updateTransform`. This is the unified and verified fix for #1424 #1479 #1490 #1502 and solves issues with physics tunneling and visual glitches under the new time step code.
* Tween.delay, Tween.repeat and Tween.yoyo will no longer throw an error if called before a TweenData object has been created (via Tween.to or Tween.from) (thanks @SomMeri #1419)
* The click trampoline added for IE prevented Chrome for Android from being
able to launch Full Screen mode with the default parameters for
ScaleManger#startFullScreen (the desktop version of Chrome was not
affected.). This is now fixed and additional compatibility settings (clickTrampoline) that can be used to configure when such is used. By default the 'when-not-mouse' mode is only enabled for Desktop browsers, where the
primary input is ubiquitously a mouse. There are no known breaking compatibility changes - the Full Screen should be initiatable in Chrome for Android as it was in 2.1.x. The default Android browser does not support Full Screen (thanks @pnstickne)
* TilemapParser now checks for image collections, avoiding crashes. These would arise with maps exported from the new release of Tiled (thanks @paul-reilly #1440)
* Group.replace could still access `newChild.parent` after it was set to `undefined`. This unifies the approach (thanks @pnstickne #1410 #1417)
* P2.postBroadphaserHandler updated to avoid skipping final 2 pairs.
* The P2 World constructor wouldn't let you use your own config unless you specified both the gravity *and* broadphase. Now allows one or both (thanks @englercj #1412)
* The RandomDataGenerator could be seeded with an array of values. However if the array contained a zero it would stop seeding from that point (thanks @jpcloud @pnstickne #1456)
* Added extra checks to Sound.play to stop it throwing DOM Exception Error 11 if the `sound.readyState` wasn't set or the sound was invalid. Also wrapped `stop()`` call in a `try catch`.
* Time.reset would incorrectly reset the `_started` property, now maps it to `Time.time` (thanks @XekeDeath #1467)
* Fix floating point inaccuracy in Tween easing edge cases (thanks @jounii #1492)
* Phaser.Signal was causing a CSP script-src violations in Cordova and Google Chrome Apps (thanks @elennaro #1494)
* Added Events.onEnterBounds to the destroy method (thanks @legendary-mich #1497)
* AnimationManager.destroy is now more careful about clearing up deep references (thanks @Arturszott #1449)
* Ellipse.right and Ellipse.bottom setters fixed (thanks @nextht #1397)
* Fixed double Ellipse.getBounds definition (thanks @nextht #1397)
* TileSprite.loadTexture crashed when textures were updated in WebGL (thanks @pandavigoureux29 #1495)

### Pixi.js 2.2.0 Updates

* The strip class has now three extra properties, canvasPadding, paddingX, and paddingY : @darionco
* Added mipmap option to to textures.
* Added the ability to use GL_TRIANGLES when rendering Strips @darionco
* Added the ability to tint the Graphics.
* Fixed Y-flipped mask issue on render texture.
* Fixed the issue where you could an alpha that is more than one and it would.
* Fixed text issues when using accents.
* Fixed sprite caching not clearing the previous cached texture : @kambing86
* Fixed arcTo issues.
* Vertex buffer and and vertex shader optimisation and reduced memory footprint on the tint and alpha : @bchevalier
* Applied the new generic updateTransform to spritebatch : @kambing86

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

`<script src="//cdn.jsdelivr.net/phaser/2.2.2/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.2.2/phaser.min.js"></script>`

### Koding

Want to try Phaser without downloading anything? [Clone Phaser in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and start working right away in their web based development system.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![div](http://www.phaser.io/images/github/div.png)

<a name="getting-started"></a>
## Getting Started

<img src="http://phaser.io/images/github/learn.jpg" align="right">

We have a [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE to coding your first game.

Prefer **videos** to reading? Lynda.com have published a free course: [HTML5 Game Development with Phaser](http://www.lynda.com/Phaser-tutorials/HTML5-Game-Development-Phaser/163641-2.html)

Use the [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide we wrote for GameDevTuts+. It covers finding tutorials, examples and support.

Although currently a bit of a "wall of text" we urge you to check out the **News** section of the [Phaser web site](http://phaser.io). You'll find fresh links posted there *daily*.

Using Phaser with **TypeScript**? Then we strongly recommend this great series of [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) tutorials.

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

If you code with [TypeScript](http://www.typescriptlang.org/) there are comprehensive definition files in the `typescript` folder. They are for TypeScript 1.0+. If using an earlier version of TypeScript (i.e. 0.9.5) you will need to include [WebGL definitions](https://github.com/piersh/WebGL.ts) into your project first.

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

Created by Richard Davey. Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2015 Photon Storm Limited.

All rights reserved.

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.2.2/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.2.2/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.2.2.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.2.2.tar.gz
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
