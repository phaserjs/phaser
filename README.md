![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

Phaser 2.0.3
============

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.0.3 "Allorallen" - Released: -in development-

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* Source code for 250+ [Phaser Examples](https://github.com/photonstorm/phaser-examples)
* Read the [documentation online](http://docs.phaser.io)
* Browse the [Examples online](http://examples.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode

[Subscribe to our new Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E). We'll email you when new versions are released as well as send you our regular Phaser game making magazine.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/photonstorm/phaser/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


What's new in 2.0.3?
--------------------



Welcome to Phaser
-----------------

6 months ago we released Phaser 1.0 into the world. Suffice to say that since then we've been overwhelmed at the huge surge of developers taking to it! Our github repository is consistently in the top JavaScript lists, we've over 3200 stars at the time of writing, and a wonderful, vibrant and friendly community. Phaser 2 is a natural evolution of what we started. We've focused specifically on performance and expansion with this release. Lots of developers have already reported to us considerably speed increases just by swapping to Phaser 2 (reports of 200% faster speeds on mobile aren't unheard of!). There's also a full-body physics system available now, in the form of the excellent p2.js. The upgrade to Pixi 1.5 under the hood bought lots of new visual effects in, including blend modes and tints.

And we're also really pleased to have closed down over 550 issues reported on github. We literally went through every last bug reported to us, and fixed it. All kinds of little things that as a whole make the library that much more solid. With the 2.0 release we're now freezing the API. Before we have to admit that the API changed somewhat on a whim, and we moved things around and changed things without too much consideration for fellow developers. With 2.0 that stops - we've spent long enough on this release that we're now extremely happy with the organisation of classes and methods, and while we may still need to make small tweaks in the future, none of them will be API breaking without prior community approval first. This means if you're using Phaser to teach in classes, or writing a book / tutorials around it, this is the version to base off.

If you want to port a Phaser 1.x game over to 2 then do read our [Migration Guide](https://github.com/photonstorm/phaser/blob/master/resources/Migration%20Guide.md) first.

So what's next? We have a roadmap (which you can find at the bottom of this document), but we're going to sit back and take stock for a while, building up the tutorials and sample games. We will of course jump on bug fixes quickly, but this is definitely the best release of Phaser ever. The most features, the fastest, the most stable and just generally the most fun to use.

Happy coding everyone! See you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)


Getting Started Guides
----------------------

We have a new [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

There is a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide on the GameDevTuts+ site which is a great place to learn where to find tutorials, examples and support.

There is also an [un-official Getting Started Guide](http://www.antonoffplus.com/coding-an-html5-game-for-30-minutes-or-an-introduction-to-the-phaser-framework).


![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

Change Log
----------

Version 2.0.3 - "Allorallen" - -in development-

Updated

* Updated to [Pixi.js 1.5.2](https://github.com/GoodBoyDigital/pixi.js/releases/tag/v1.5.2)
* Updated to [p2.js 0.5.0](https://github.com/schteppe/p2.js/releases/tag/v0.5.0)
* Return the result of P2.Body.setCircle for further chaining and manipulation (fix #659)
* Updated the PhysicsEditor plugin to maintain position, radius, mask bits, category bits and sensor flags (thanks @georgiee, #674)
* Further TypeScript defs tweaks (thanks @clark-stevenson)
* Lowered the default size of SpriteBatch from 10000 to 2000 as this yields faster results on mobile (pixi.js update)
* Fix for 'jagged' strokes on custom fonts (thanks @nickryall, #677)
* The State.update function (and thus the update of any sub-classed Sprites or other objects) is now called before Stage, Tweens, Sound, Input, etc (#662)
* The Phaser jshint process is now running on Travis (thanks @xtian, #656)
* The Phaser Gruntfile is now split up into option tasks (thanks @xtian, #638)
* Key.reset now clears any callbacks associated with the onDown and onUp events and nulls the onHoldCallback if set. Key.reset is called by Keyboard.reset when changing state.
* If you pass `null` to Tilemap.putTile as the tile parameter it will pass the call over to Tilemap.removeTile.
* TypeScript definitions updated for latest changes (thanks @clark-stevenson)
* Keyboard.stop nulls the function references after removing the event listeners (thanks @bmceldowney, #691)
* Tilemap.hasTile allows for multi-layer type parameter (thanks @Raeven0, #680)
* Grunt update to dev dependencies (thanks @xtian, #695)
* Emitter now emits Phaser.Particle objects instead of Phaser.Sprites, which can be extended as required.
* Emitter has had various local properties removed that were already declared in Phaser.Group which it extends.


New Features

* Added ability to retrieve a single p2 fixture from the cache (thanks @georgiee, #674)
* Timers can now have a start delay value (thanks @georgiee, #660)
* CacheAsBitmap added to Display Object, so works for Sprite, Image, Button. Allows you to cache complex display hierarchies for speed.
* CacheAsBitmap added to Graphics Object. Allows you to cache complex graphics structures hierarchies for speed.
* Added generateTexture function to display objects. Create a texture from the current object display hierarchy for use as a texture elsewhere.
* Added optional FilterArea to display object (for optimisation)
* Graphics chaining functions.
* Added Pointer.positionUp which records the last point at which the pointer left the screen (thanks @Cryszon, #676)
* Phaser.Point.centroid static function added to calculate the centroid or midpoint of an array of points (thanks @lewster32, #675)
* SoundManager.remove(sound) now lets you remove a sound from the SoundManager, destroying it in the process.
* Sound.destroy will remove a sound and all local references it holds, optionally removing itself from the SoundManager as well.
* SoundManager.removeByKey(key) will remove all sounds from the SoundManager that have a key matching the given value.
* ArcadePhysics.Body.hitTest(x, y) will return a boolean based on if the given world coordinate are within the Body or not.
* StateManager.restart allows you to quickly restart the *current* state, optionally clearing the world and cache.
* Tilemap.removeTile(x, y, layer) lets you remove the tile at the given coordinates and updates the collision data.
* Tilemap.removeTileWorldXY lets you remove the tile at the given pixel value coordinates and updates the collision data.
* Key.enabled boolean allows you to toggle if a Key processes its update method or dispatches any events without deleting and re-creating it.
* Emitter now has minParticleAlpha and maxParticleAlpha values for setting a random alpha on emitted particles.
* Emitter.particleAnchor allows you to control the anchor of emitted Particles. Defaults to 0.5 (same as before) but now under your control.


Bug Fixes

* If you inputEnable = false a gameobject you couldn't re-enable it again using inputEnable = true, only directly via the handler (thanks @nickrall, fix #673)
* Fixed setTexture bug with TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed anchor point bug in canvas with TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed positionOffset not begin correct in TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed issue where filters were not being applied to TilingSprite (pixi.js 1.5.2 bug fix)
* Fixed SpriteBatch canvas transform bug (pixi.js 1.5.2 bug fix)
* Fixed Cached textures issue when using base64 encoded images (@cacheflowe) (pixi.js 1.5.2 bug fix)
* Fixed issue where visibility was not being respected in sprite batch (pixi.js 1.5.2 bug fix)
* Fixed bug in gl.bindTexture which tried to use an undefined private var. (@photonstorm) (pixi.js 1.5.2 bug fix)
* Fixed the 'short cut' version of Math.floor in setTransform if roundPixels is true. (@photonstorm) (pixi.js 1.5.2 bug fix)
* SoundManager.boot will check to see if the AudioContext was created before carrying on (thanks @keyle, fix #669)
* Fixed bug where move up and move down method in groups did not work (thanks @jonthulu, fix #684)
* Fixed bug in Group.next when cursor is at the last child (thanks @jonthulu, fix #688)
* Emitter.minParticleScale and maxParticleScale wasn't resetting the Body size correctly.
* Group.removeBetween now properly iterates through the children.


ToDo

* Split P2 world bounds into different bodies to help the broad phase.


p2.js v0.5.0

* Added property .enableIslandSleeping to World.
* Added property .useFrictionGravityOnZeroGravity to World.
* Renamed .useWorldGravityForFrictionApproximation in World to .useWorldGravityAsFrictionGravity to keep things more uniform.
* Sleep improvements.
* Added property .frictionIterations to GSSolver, and removed .skipFrictionIterations.
* Upgraded to gl-matrix 2.1.0.
* Removed QuadTree.
* Removed mat2.
* Added Utils.extend.
* Added methods .setStiffness and .setRelaxation methods to Constraint.
* Removed properties .stiffness, .relaxation and .useGlobalEquationParameters from GSSolver.
* Added methods .setGlobalStiffness, .setGlobalRelaxation, .setGlobalEquationParameters to World.
* Renamed property .eps to .epsilon for Equation.
* Removed property .useBoundingBoxes from NaiveBroadphase in favor of the new property .boundingVolumeType in Broadphase.
* Added methods .getMaxForce and .setMaxForce to LockConstraint.
* Changed property names .bi, .bj, .ni, .ri, .rj to .bodyA, .bodyB, .normalA, .contactPointA, .contactPointB in Equation, ContactEquation and FrictionEquation classes.
* Removed IslandSolver in favor of the new property World.islandSplit.
* Changed constructors of the Constraints so they all take an options object as last parameter.
* Added property .collideConnected to Constraint.
* Added property .islandSplit to World.
* Added methods .disableBodyCollision and .enableBodyCollision to World.
* Added properties .useWorldGravityForFrictionApproximation and .frictionGravity to World.
* Added Heightfield class.
* Removed properties .defaultFriction and .defaultRestitution from World, in favor of .defaultContactMaterial.
* Added property .enabled to Equation.
* Added property .surfaceVelocity to ContactMaterial.
* Added property .sensor to Shape.
* World now emits events 'beginContact', 'endContact' and 'preSolve'.
* Added property .gravityScale to Body.
* Renamed class SAP1DBroadphase to SAPBroadphase.
* Added property .interpolatedPosition to Body`.
* Added method .internalStep to World.
* Added property .applyGravity to World.
* Renamed method .computeC to .computeInvC in Equation, and made it compute the inverse.
* Added static method Utils.splice.
* Added property .world to Body.
* Added property .fixedRotation to Body.
* Added class AABB.
* Added properties .aabb and .aabbNeedsUpdate to Body, as well as a method .updateAABB.
* Added property .useBoundingBoxes to NaiveBroadphase.
* Added static method Broadphase.aabbCheck.
* Added method .computeAABB to Shape.
* Added static method Broadphase.canCollide.
* Body now inherits from EventEmitter, and dispatches events 'sleep','sleepy' and 'wakeup'.
* Added properties .allowSleep, .sleepState, .sleepSpeedLimit, .sleepTimeLimit, .lastTimeSleepy as well as methods .sleep, .wakeUp and .sleepTick to Body.
* Added enums Body.AWAKE, Body.SLEEPY, Body.SLEEPING.
* Added property .enableBodySleeping to World.
* Added options .disableRotationalLock, .lowerLimit, .upperLimit to PrismaticConstraint constructor.
* Added methods .enableMotor, .disableMotor to PrismaticConstraint as well as properties .motorEnabled, .motorSpeed, .motorEquation.


There is an extensive [Migration Guide](https://github.com/photonstorm/phaser/blob/master/resources/Migration%20Guide.md) available for those converting from Phaser 1.x to 2.x. In the guide we detail the API breaking changes and approach to our new physics system.

The full Change Log is at https://github.com/photonstorm/phaser/blob/master/changelog.md


How to Build
------------

We provide a fully compiled version of Phaser in the `build` directory, in both plain and minified formats.

We also provide a Grunt script that will build Phaser from source along with all the examples.

Run `grunt` to perform a default build to the `dist` folder and update the examples.

If you replace Pixi or p2 then run `grunt replace` to patch their UMD strings so they work properly with Phaser and requireJS.


Koding
------

You can [![clone the Phaser repo in Koding](http://learn.koding.com/btn/clone_d.png)][koding] and then start editing and previewing code right away using their web based VM development system.


Bower
-----

If you use bowser you can install phaser with:

`bower install phaser`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)


CDNJS
-----

Thanks to a community member Phaser is now available on [CDNJS](http://cdnjs.com). You can include the following in your html:

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.2/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.0.2/phaser.min.js`


Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

If you need to support IE9 or Android 2.x then you must use a build of Phaser that doesn't include P2 physics. You'll find these in the `build/custom` folder.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/) using the provided TypeScript definitions file. We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

Phaser is 576 KB minified (including all 3 physics engines, 311 KB without) and 128 KB gzipped (67 KB without physics libs).


Learn By Example
----------------

Ever since we started Phaser we've been growing and expanding our extensive set of Examples. Currently over 250 of them!

They used to be bundled in the main Phaser repo, but because they got so large and in order to help with versioning we've moved them to their own repo.

Please go and checkout https://github.com/photonstorm/phaser-examples

Phaser comes with an ever growing suite of Examples. Personally I feel that we learn better by looking at small refined code examples, so we created over 250 of them and create new ones to test every new feature added. Inside the `examples` repo you'll find the current set. If you write a particularly good example then please send it to us.

The examples need to be run through a local web server (in order to avoid file access permission errors from your browser). You can use your own web server, or start the included web server using grunt.

Using a locally installed web server browse to the examples folder:

    examples/index.html

Alternatively in order to start the included web server, after you've cloned the repo, run `npm install` to install all dependencies, then `grunt connect` to start a local server. After running this command you should be able to access your local webserver at `http://127.0.0.1:8000`. Then browse to the examples folder: `http://127.0.0.1:8000/examples/index.html`

There is a new 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation.

You can also browse all [Phaser Examples](http://examples.phaser.io) online.


Features
--------

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


Road Map
--------

Beyond version 2.0 here are some of the features planned for the future:

Version 2.1 ("Shienar")

* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Support for parallel asset loading.

Version 2.2 ("Tarabon")

* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.

Beyond version 2.2

* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Look at HiDPI Canvas settings.
* Multiple Camera support.
* DragonBones support.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.
* Look at XDomainRequest for IE9 CORs issues.


Nadion
------

[Nadion](https://github.com/jcd-as/nadion) is a set of powerful enhancements for Phaser that makes level building even easier. It includes features such as Trigger, Area, Alarms and Emitters, debug panels, state machines, parallax layer scrolling, 'developer mode' short-cuts and more.


Contributing
------------

We now have a full [Contributors Guide][contribute] which goes into the process in more detail, but here are the headlines:

- If you find a bug then please report it on [GitHub Issues][issues] or our [Support Forum][forum].

- If you have a feature request, or have written a game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you! Either post to our [forum][forum] or email: rich@photonstorm.com

- If you issue a Pull Request for Phaser, please only do so againt the `dev` branch and *not* against the `master` branch.

- Before submitting a Pull Request please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, run `grunt jshint`. This isn't a strict requirement and we are happy to receive Pull Requests that haven't been JSHinted, so don't let it put you off contributing, but do know that we'll reformat your source before going live with it.


Bugs?
-----

Please add them to the [Issue Tracker][issues] with as much info as possible, especially source code demonstrating the issue.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

"Being negative is not how we make progress" - Larry Page, Google


License
-------

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

[issues]: https://github.com/photonstorm/phaser/issues
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[phaser]: https://github.com/photonstorm/phaser
[forum]: http://www.html5gamedevs.com/forum/14-phaser/
[koding]: https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)
