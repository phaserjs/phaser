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
# Phaser 2.1.3

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.1.3 "Ravinda" - Released: 23rd October 2014

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
## Welcome to Phaser and What's new in 2.1.3?

![Pixi 2.0](http://www.phaser.io/images/pixi-v2.png)

Over at Goodboy Digital they've been working away on Pixi v2 for some time now. As Phaser is built on-top of Pixi we've a vested interest in what is happening in Pixi land and it's implications for Phaser. And Pixi v2 is their latest, freshest release.

There's a detailed [blog post](http://www.goodboydigital.com/pixi-js-version-2-now-read/) explaining all about it, but the headliners include full High DPI canvas support, iOS8 WebGL fixes, improved rendering performance, significant updates to the Graphics class and sprite level shaders.

There have been a few API changes to accommodate all of this, but we've been able to blend all of those into Phaser so that the Phaser API hasn't had to change for you at all. Instead you get to reap the benefits :)

As well as Pixi v2 there are also more updates and fixes in this release and you can see the change log below for full details.

## Premium Phaser Plugins

We're pleased to announce that we have 3 new premium plugins gearing up for launch. They are:

Phaser Box2D - Adds complete Box2D support directly into Phaser, with lots of help methods, over 50 examples and 5 demo games.

Phaser Path Manager - Create complex motion paths for Sprites with a lovely visual editor and this new plugin. No longer rely on tweens for motion :) Instead draw a path, with full branch support, path orientation, segment speeds, path events and more.

Advanced Particle System - The particles included with Phaser are flexible and can create attractive effects. But Advanced Particles is a complete replacement offering professional level particle effects for your games. From multiple render targets, to bitmap caching to all kinds of events, emitters and properties.

Each plugin will come in a range of versions to suit all budgets and there are more on the way. Please visit the [launch page](http://phaserplugins.launchrock.com) to sign-up for notification as soon as they're ready.

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

Version 2.1.3 - "Ravinda" - 23rd October 2014

### New Features

* Updated to Pixi v2.0.0 (see change list below)
* Happily removed the IE11 WebGL lock as Pixi now fully supports it :)
* Time.prevTime is a new property that contains the raw value of the game timer from the previous update.
* Sound.fadeTo allows you to fade the Sound to the given volume over the duration specified (thanks @nickryall #1225)
* BitmapData.getFirstPixel will scan the BitmapData and return the color and location of the first non-transparent pixel encountered. You can specify one of 4 scan directions: top to bottom, bottom to top, left to right and right to left.
* BitmapData.getBounds will return a `Rectangle` object that encompasses the full extent of the non-transparent pixels in the BitmapData. This can be useful if you wish to trim away transparent pixels from the sides of a BitmapData down to size before saving.
* Rectangle.scale allows you to scale the width and height of a Rectangle.
* RenderTexture has a new optional parameter: `resolution`

### Updates

* TypeScript definitions fixes and updates (thanks @clark-stevenson)
* Changed the Animation constructor parameter `delay` to `frameRate` as it's a more accurate term of what it should be. Internally nothing changed.
* Circle.getBounds added.
* Ellipse.getBounds added.
* Device.canPlayAudio now supports `opus` files directly, as well as `opus` encoded audio stored in ogg containers (#1232)
* PIXI.AbstractFilter is now bundled by default to support the new `sprite.shader` feature in Pixi v2.
* Changed all typeof comparisons from == to === (thanks @bobbywilson0 #1230)
* JSDoc fixes in the Rope class (thanks @Rovanion)
* Filter.update now caches the previous pointer position to avoid flooding the uniform. Also the mouse uniform is now a value between 0 and 1 depending on the position within the game view.

### Bug Fixes

* Fixed a reference error to the Loader.baseURL in Cache._resolveUrl method. This stops the error where Safari would show lots of file load errors but then still load the files (thanks @neurofuzzy #1235)
* Fixed the Filter mouse uniform value population.
* Fixed an issue where audio files with query strings after them would fail the `canPlayAudio` checks (thanks Vithar)
* Input.hitTest now accurately detects hits on the extreme edges of a display object (thanks InsaneHero)
* Button.setSounds now works if given an AudioSprite as the sound source.

### Pixi v2 Specific New Features

* Sprites can now have a custom shader applied to them. Much better performance than filters.
* Renderers now have a resolution. Ideal for working with different pixel density.
* Big refactor of the webGLRenderer and WebGLSpriteBatch renderer.
* Refactor of CanvasRenderer.
* DisplayObject.updateTransform function rewritten with for better performance.
* New Events Class.
* New Constructor for all renderers (including autoDetect)
* Massive Refactor of Graphics (WebGL and Canvas)
* Graphics objects can now be interactive.
* Made removeChild no longer returns error.
* Lots of new functions added to the Matrix class.
* RenderTexture refactored. Now accepts Matrix in the render function.
* AsciiFilter, NoiseFilter and TiltShiftFilter.
* added getChildIndex and setChildIndex methods to DisplayObjectContainer.
* Bug Fixes.

### Pixi v2 Specific Bug Fixes

* iOS8 alpha bug fixed.
* set default padding to 0 for graphics objects.
* PIXI.Graphics initial width and height is 0.
* Fixed Graphics getBounds.
* fix cacheAsBitmap alpha issue for canvas.
* Fixed minY calculation in updateBounds.
* Fixed Bezier issue on Graphics.
* Added 0 width check to DisplayObjectContainer.

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

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.1.3/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.1.3/phaser.min.js`

![div](http://phaser.io/images/div1.png)

<a name="requirements"></a>
## Requirements

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above. But as always be aware of browser limitations. Not all features of Phaser work on all browsers.

### IE9

If you need to support IE9 or Android 2.x and want to use P2 physics then you must use the polyfill found in the `resources/IE9 Polyfill` folder. If you don't require P2 Physics (or don't care about IE9!) then you don't need this polyfill.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code your games, and were careful not to impose any form of class / inheritance / structure upon you. So you won't find it split into require modules or pull in 3rd party npm packages for example. That doesn't mean you can't, it just means we don't force you to do so. If you're a requireJS user you'll find a new template in the `resources\Project Templates` folder just for you.

If you code with [TypeScript](http://www.typescriptlang.org/) you'll find a comprehensive definitions file inside the `build` folder and tutorials on getting started.

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
