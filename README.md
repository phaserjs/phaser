![div](http://www.phaser.io/images/github-divider.png)
![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

# Phaser

Phaser is a fast, free and fun open source HTML5 game framework. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled into native iOS and Android apps via 3rd party tools.

Phaser is currently the highest ranked JavaScript game framework on Github and is used by tens of thousands of developers worldwide. It's actively maintained by the HTML5 game development company [Photon Storm](http://www.photonstorm.com) and the incredible open source community.

* [Website](http://phaser.io)
* [Twitter](https://twitter.com/photonstorm) (hashtag #phaserjs)
* [API Documentationn](http://docs.phaser.io)
* [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* Over 400 [Source Code Examples](http://examples.phaser.io) also available in this [git repo](https://github.com/photonstorm/phaser-examples)
* Subscribe to the [Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E)
* StackOverflow tag: [phaser-framework](http://stackoverflow.com/questions/tagged/phaser-framework)
* [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* [freenode #phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/)
* Please support our work via [Gratipay](https://gratipay.com/photonstorm/)

![div](http://www.phaser.io/images/github-divider.png)

# Index

- [What's New?](#whats-new)
- [Getting Started](#getting-started)
- [Change Log](#change-log)
- [How to Build](#how-to-build)
- [Koding](#koding)
- [Bower / NPM](#bower)
- [jsDelivr](#jsdelivr)
- [Requirements](#requirements)
- [Build Files](#build-files)
- [Learn By Example](#example)
- [Features](#features)
- [Road Map](#road-map)
- [Mighty Editor](#mighty-editor)
- [Contributing](#contributing)
- [Bugs?](#bugs)
- [License](#license)

![div](http://www.phaser.io/images/github-divider.png)

<a name="whats-new"></a>
## What's new in 2.2.2?

Content here :)

Happy coding everyone! I hope to see you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://www.phaser.io/images/github-divider.png)

<a name="change-log"></a>
## Change Log

Version 2.2.2 - "Alkindar" - in development

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

For details about changes made in previous versions of Phaser see the full Change Log at https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md

![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

![div](http://www.phaser.io/images/github-divider.png)

<a name="download"></a>
## Download Phaser

The Phaser project is [hosted on Github][phaser]. Github offers you a number of ways to download the source:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or [Github Desktop][clone-gh].
* Download as a [zip][get-zip] or [tar.gz][get-tgz]
* Download just the release files: [phaser.js][get-js] and [phaser.min.js][get-minjs]
* Checkout with [svn][clone-svn]

### Bower / npm

Install via [bower](http://bower.io/) with:

`bower install phaser`

Install via [npm](https://www.npmjs.com/) with:

`npm install phaser`

### jsDelivr

Phaser is available on [jsDelivr](http://jsdelivr.com) "A super-fast CDN for developers and webmasters". Include the following in your html:

`<script src="//cdn.jsdelivr.net/phaser/2.2.1/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.2.1/phaser.min.js"></script>`

More details on the [jsDelivr Phaser page](http://www.jsdelivr.com/#!phaser).

### Koding

Want to try Phaser without downloading anything? You can [clone the Phaser repo in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and start working right away with their web based development system.

![div](http://www.phaser.io/images/github-divider.png)

<a name="getting-started"></a>
## Getting Started

We have a [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

We wrote a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide for GameDevTuts+  which covers finding tutorials, examples and support.

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

Finally the list of [community authored Phaser Tutorials](http://www.lessmilk.com/phaser-tutorial/) is growing fast!

![div](http://www.phaser.io/images/github-divider.png)

## Using Phaser

Phaser is provided ready compiled in the `build` folder of the repository. There you will find both plain and minified versions. The plain version is meant for development only. The minified version is for production use.

This version of Phaser is 153 KB *gzipped and minified* and contains *both* Arcade Physics **and** P2 Physics. We provide Custom Builds for more streamlined versions.

### Custom Builds

The custom builds of Phaser are in the `build\custom` folder.

Phaser includes two physics systems: Arcade Physics and [P2.js](https://schteppe.github.io/p2.js/). Arcade Physics is perfect for arcade style games and provides an AABB (bounding box) based collision system. P2 however is a full body physics system, complete with springs, materials, constraints and lots more.

If you don't require P2 then use `phaser-arcade-physics.min.js`. It will save  nearly 200 KB from the minified file size.

If you don't need any physics system at all, or are implementing your own, there is an even smaller build: `phaser-no-physics.min.js`. This build doesn't include Tilemaps or the Particle Emitter as both rely on Arcade Physics.

Finally there is `phaser-no-libs.min.js` which is Phaser without any physics support or Pixi.js. You will need Pixi.js in order to use Phaser, but this file allows you to package your own custom build of Pixi instead of using the one Phaser provides.

You can create your own custom build of Phaser by looking at the grunt options and manifests in the tasks folder.

### Building from source

Should you need to build your own version of Phaser from source you can take advantage of the provided [Grunt](http://gruntjs.com/) scripts.

Run `grunt` to perform a default build to the `dist` folder.

If you have replaced Pixi or p2 as part of your changes then make sure you run `grunt replace`. This task will patch their UMD strings so they work properly with Phaser and requireJS.

![div](http://www.phaser.io/images/github-divider.png)

<a name="requirements"></a>
## Requirements

Phaser requires a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile devices including the stock Android browser and iOS5 Mobile Safari and above. Always be aware of browser limitations: not all features of Phaser work on all browsers.

### IE9

If you need to support IE9 or Android 2.x **and** want to use P2 Physics then you must use the polyfill found in the `resources/IE9 Polyfill` folder. If you don't use P2 Physics (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code and were careful not to impose any form of coding structure upon you. You won't find Phaser split into modules or relying on 3rd party npm packages. That doesn't mean you can't do this, it just means we don't force it upon you. If you're a requireJS user you'll find a template in the `resources\Project Templates` folder just for you.

If you code with [TypeScript](http://www.typescriptlang.org/) there is a comprehensive definitions file in the `typescript` folder and tutorials on getting started on our site. This definitions file is for TypeScript 1.0+. If you are using an earlier version of TypeScript (i.e. 0.9.5) you will need to include the WebGL definitions into your project first. This file isn't included with Phaser.

![div](http://www.phaser.io/images/github-divider.png)

<a name="example"></a>
## Learn By Example

Ever since we started Phaser we've been growing and expanding our extensive set of Examples. Currently over 400 of them!

They used to be bundled in the main Phaser repo, but because they got so large and in order to help with versioning we've moved them to their own repo.

So please checkout https://github.com/photonstorm/phaser-examples

You can also browse all [Phaser Examples](http://examples.phaser.io) online.

![div](http://www.phaser.io/images/github-divider.png)

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

![div](http://www.phaser.io/images/github-divider.png)

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

![div](http://www.phaser.io/images/github-divider.png)

<a name="mighty-editor"></a>
## Mighty Editor - A Visual Phaser Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![div](http://www.phaser.io/images/github-divider.png)

<a name="contributing"></a>
## Contributing

We now have a full [Contributors Guide][contribute] which goes into the process in more detail, but here are the headlines:

- If you find a bug then please report it on [GitHub Issues][issues] or our [Support Forum][forum].

- If you have a feature request, or have written a game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you! Either post to our [forum][forum] or email: rich@photonstorm.com

- If you issue a Pull Request for Phaser, please only do so againt the `dev` branch and *not* against the `master` branch.

- Before submitting a Pull Request please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, run `grunt jshint`. This isn't a strict requirement and we are happy to receive Pull Requests that haven't been JSHinted, so don't let it put you off contributing, but do know that we'll reformat your source before going live with it.

- Before contributing, please read the [code of conduct](https://github.com/photonstorm/phaser/blob/master/CODE_OF_CONDUCT.md).

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

![div](http://www.phaser.io/images/github-divider.png)

<a name="bugs"></a>
## Bugs?

Please add them to the [Issue Tracker][issues] with as much info as possible, especially source code demonstrating the issue.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

"Being negative is not how we make progress" - Larry Page, Google

![div](http://www.phaser.io/images/github-divider.png)

<a name="license"></a>
## License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.2.2/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.2.2/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.2.2.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.2.2.tar.gz
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-svn]: https://github.com/photonstorm/phaser
[clone-gh]: github-windows://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/14-phaser/
