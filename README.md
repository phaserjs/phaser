![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

# Index

- [About](#about)
- [What's New?](#whats-new)
- [Getting Started](#getting-started)
- [Change Log](#change-log)
- [How to Build](#how-to-build)
- [Koding](#koding)
- [Bower](#bower)
- [CDNJS](#cdnjs)
- [Requirements](#requirements)
- [Learn By Example](#example)
- [Features](#features)
- [Road Map](#road-map)
- [Nadion](#nadion)
- [Contributing](#contributing)
- [Bugs?](#bugs)
- [License](#license)


# Phaser 2.1.0-dev <a name="about"></a>

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.1.0 "Cairhien" - Released: -in development-

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

## Welcome to Phaser and What's new in 2.1.0? <a name="whats-new"></a>

Until then happy coding everyone! And we hope to see you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://phaser.io/images/div1.png)

## Getting Started Guides <a name="getting-started"></a>

We have a [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

We wrote a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide for GameDevTuts+  which covers finding tutorials, examples and support.

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

Finally the list of [community authored Phaser Tutorials](http://www.lessmilk.com/phaser-tutorial/) is growing fast!

![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

![div](http://phaser.io/images/div2.png)

## Change Log <a name="change-log"></a>

Version 2.1.0 - "Cairhien" - -in development-

### New Features

* Updated to [p2.js 0.6.0](https://github.com/schteppe/p2.js/commit/d1c7a340c42e4d5d1d939fba5fd13c5e49d6abd2) - this was an API breaking change, so please see the p2.js section of this change log specifically if you're using p2 in your game.
* Ninja Physics is no longer included in the build files by default. Not enough people were using it, and not enough contributions were coming in to help polish it up, so we've saved the space and removed it. It's still available in the grunt build files if you require it, but we're deprecating it from the core library at this time. It will make a return in Phaser3 when we move to a modular class system.
* Device will now detect for Kindle and PS Vita (thanks @lucbloom)
* Device will now detect for Cordova (thanks @videlais #1102)
* Arcade Physics Body.skipQuadTree is a new boolean that if set to `true` when you collide the Sprite against a Group it will tell Phaser to skip using a QuadTree for that collision. This is handy if this Body is especially large.
* Arcade Physics World.skipQuadTree will disable the use of all QuadTrees in collision methods, which can help performance in tightly packed scenes.
* Cordova 'deviceready' event check added (thanks @videlais #1120)
* Loader.useXDomainRequest boolean added. If `true` (the default is `false`, unless the browser is detected as being IE9 specifically) it will use XDomainRequest when loading JSON files instead of xhr. In rare IE edge-cases this may be required. You'll know if you need it (#1131 #1116)
* Added support for Tiled objects type field (thanks @rex64 #1111)
* Tile properties are now copied from the Tiled JSON data to the Phaser.Tile objects when parsed (thanks @beeglebug #1126)
* All Images now have a frameData value, even if it's only one frame. This removes lots of engine code needed to check if images are sprite sheets or not, and simplifies game code too (thanks @lucbloom #1059)
* Added a new Phaser.Rope object. This allows for a series of 'chained' Sprites and extends the Rope support built into Pixi. Access it via game.add.rope (thanks @codevinsky #1030)
* Phaser.Device.isAndroidStockBrowser will inform you if your game is running in a stock Android browser (rather than Chrome) where you may wish to scale down effects, disable WebGL, etc (thanks @lucbloom #989)
* Phaser.Camera has a new property `position` which is a Point object that allows you to get or set the camera position without having to read both the x and y values (thanks @Zielak #1015)
* TileSprite now has the `alive` property, which should help with some Group operations (thanks @jonkelling #1085)
* Events.onDestroy is a new signal that is dispatched whenever the parent is being destroyed. It's dispatched at the start of the destroy process, allowing you to perform any additional house cleaning needed (thanks @jonkelling #1084)
* Group.onDestroy is a new signal that is dispatched whenever the Group is being destroyed. It's dispatched at the start of the destroy process, allowing you to perform any additional house cleaning needed (thanks @jonkelling #1084)
* ScaleManager.destroy now removes the window and document event listeners, which are no longer created anonymously (thanks @eguneys #1092)
* Input.Gamepad.destroy now destroys all connected SinglePads and clears event listeners.
* SinglePad.destroy now clears all associated GamepadButton objects and signals.
* Device.node and Device.nodeWebKit are two new properties (thanks @videlais #1129)
* P2.PointProxy.mx and my values are get and set in meters with no pixel conversion taking place.
* P2.InversePointProxy.mx and my values are get and set in meters with no pixel conversion taking place.
* Pointer.dirty is a new boolean that is set by the InputHandler. It tells the Pointer to re-check all interactive objects it may be over on the next update, regardless if it has moved position or not. This helps solve issues where you may have a Button that on click generates a pop-up window that now obscures the Button (thanks @jflowers45 #882)
* SoundManager.destroy is a new method that will destroy all current sounds and reset any callbacks.
* StateManager.clearCurrentState now handles the process of clearing down the current state and is now called if the Game is destroyed.
* Game.destroy now clears the current state, activating its shutdown callback if it had one. It also now destroys the SoundManager, stopping any currently running sounds (#1092)
* Animation.onUpdate is a new event that is dispatched each time the animation frame changes. Due to its intensive nature it is disabled by default. Enable it with `Animation.enableUpdate = true` (#902)

### Updates

* TypeScript definition updates to help fix for the `noimplicitany` option (thanks @Waog #1088)
* TypeScript definitions fixes and updates (thanks @clark-stevenson @englercj and @rhmoller)
* All of the Pixi geom classes have been removed from the build file as they aren't needed (the Phaser.Geom classes overwrite them), saving some space in the process.
* Improved consistency of clone methods on geometry classes (thanks @beeglebug #1130)
* Removed Cache.isSpriteSheet method as no longer required (see #1059)
* Added Cache.getFrameCount to return the number of frames in a FrameData.
* Input.setMoveCallback has been removed due to deprecation.
* BitmapData.refreshBuffer has been removed and replaced with BitmapData.update.
* BitmapData.drawSprite has been removed due to deprecation. Use BitmapData.draw instead.
* Pointer.moveCallback has been removed due to deprecation.
* SinglePad.addButton has been removed due to deprecation.
* P2.Body.loadData has been removed due to deprecation.
* P2.World.defaultFriction and defaultRestitution have been removed due to deprecation.
* Canvas.create noCocoon parameter has been removed due to deprecation.
* Color.getColorInfo, RGBtoHexstring, RGBtoWebstring and colorToHexstring has been removed due to deprecation.
* P2.PointProxy.x and y values are now returned in pixels (previously they were returned in meters). See PointProxy.mx/my for meter values.
* P2.InversePointProxy.x and y values are now returned in pixels (previously they were returned in meters). See PointProxy.mx/my for meter values.
* Arcade.overlap and collide are now more consistent about allowing a Group vs. Group or Group vs. Array of Groups set (thanks @pyromanfo #877 #1147)
* The Pointer move callbacks are now sent an extra parameter: `fromClick` allowing your callbacks to distinguish between the Pointer just moving, or moving as a result of being pressed down (thanks @iforce2d #1055)

### Bug Fixes

* Remove escaping backslashes from RetroFont text set documentation (thanks @jackrugile #1051)
* Phaser.Loader was incorrectly getting the responseText from _xhr instead of _ajax on IE9 xDomainRequests (thanks @lardratboy #1050)
* Phaser.Physics.P2.addPolygon now takes a nested array again (thanks @wayfu #1060)
* Fix for previous PR #1028 where the P2.setBoundsToWorld call was overriding setBoundsToWorld in the P2 constructor (thanks @Dumtard #1028)
* Fix for scale issues in CocoonJS using webgl renderer and screencanvas (thanks @txusinho #1064)
* Resolves issue with pixel perfect click / over detection on Sprites that used trimmed image atlases for animations or frames > 0.
* Group.swap() updates the Z index values properly (thanks @Blank101 #1090)
* Device now recognises ChromeOS as a desktop (thanks @alvinsight @hilts-vaughan #1091)
* Fixed Point.rotate bug (thanks @gamedolphin #1107)
* InputHandler.checkBoundsRect was incorrectly assigning a property in Sprites fixed to the camera being dragged left (thanks @CraigBeswetherick #1093)
* Swapped argument order of Rectangle.containsRect (thanks @beeglebug #1095 #1125)
* The Game configuration object "renderer" property was being wrongly assigned to Game.renderer instead of renderType (thanks @FedeOmoto #1127)
* Fixed Group.removeBetweens default endIndex (thanks @darfux #1142)
* Debug.cameraInfo no longer crashes if the camera bounds are nulled (thanks @wayfu #1143)
* Camera.setBoundsToWorld no longer crashes if the camera bounds are nulled (thanks @wayfu #1143)
* Fixed the resolution uniform type in the SampleFilter (thanks @VictoryRice #1137)
* Calling P2.Body.destroy or ArcadePhysics.Body.destroy wouldn't null the parent sprite body, causing it to error in the next update (thanks @jonathanhooker #1077)
* BitmapFonts are now correctly added to the Cache._bitmapFont array and returned via Cache.getBitmapFont (thanks @prudolfs #1076)
* InputHandler docs updated to avoid Pointer data-type confusion (#1097)
* If you used a single Game configuration object and didn't specify the enableDebug property it would crash on Debug.preUpdate (thanks @luizbills #1053)
* The P2.World.postBroadphaseHandler now checks if the returned pairs array is empty or not before processing it (thanks @wayfu #934)
* Tilemap.hasTile now checks the Tile.index value and will return false if the index is -1 (i.e. a non-active tile) (thanks @elgansayer #859)
* Sound.restart used to cause the Sound to double-up if it was already playing when called. Now correctly stops the sound before restarting it (thanks @wombatbuddy #1136)

### p2.js 0.6.0 Changes and New Features

* DistanceConstraint signature changed to take the new localAnchors.
* RevoluteConstraint signature changed to include worldPivot.
* P2.Body now uses the new Body.type value instead of Body.motionState, however as P2.Body already have a property called `type` we have left the `motionState` getter/setter in for now.
* World.enableBodySleeping has been removed and replaced with World.sleepMode.
* Phaser P2.Springs are now LinearSprings by default.
* World.createRotationalSpring will now let you create rotational springs.

#### Breaking changes

* Renamed property .motionState to .type in class Body.
* Changed constructor of RevoluteConstraint. Now the local pivots are passed as options instead of direct arguments. See the constraints demo.
* Removed World.prototype.toJSON and .fromJSON.
* Removed properties .enableBodySleeping and .enableIslandSleeping from World instances. The enum .sleepMode can be used instead. See the sleep demo.
* Converted Spring to a base class for the new LinearSpring and RotationalSpring classes. LinearSpring can be used as the old Spring.
* Utils.ARRAY_TYPE can now be overridden by injecting a global called P2_ARRAY_TYPE. Support for GLMAT_ARRAY_TYPE has been removed.

#### Other changes

* Added flag .enableFrictionReduction to Narrowphase.
* Added RevoluteConstraint.prototype.setLimits.
* Added PrismaticConstraint.prototype.setLimits.
* LockConstraint, DistanceConstraint, and GearConstraint can now be constructed from current body transforms.
* RevoluteConstraint can now be constructed from the current body transforms and a world point.
* Material id can now be passed via constructor.
* ContactMaterial instances now have a property .contactSkinSize.
* Added method Body.prototype.getAABB.
* Limits for DistanceConstraint. See the DistanceConstraint demo.
* Added Body.prototype.overlaps.
* Added class OverlapKeeper.
* If substepping is used in World.prototype.step, the substeps are aborted if slower than real time.
* Added Heightfield/Convex and Heightfield/Circle collision support.
* Added property .overlapKeeper to World.
* EventEmitter.prototype.has can now check if any listeners were added to a given topic.
* Added Utils.defaults.

The full Change Log is at https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md

![div](http://phaser.io/images/div3.png)

## How to Build <a name="how-to-build"></a>

We provide a fully compiled version of Phaser in the `build` folder, in both plain and minified formats.

You will also find custom builds in the `build\custom` folder, that split phaser up into components.

We also provide a Grunt script that will build Phaser from source.

Run `grunt` to perform a default build to the `dist` folder.

If you replace Pixi or p2 then run `grunt replace` to patch their UMD strings so they work properly with Phaser and requireJS.

Note: Some of you may not be aware, but the `phaser.min.js` file in the build folder contains all 3 physics systems bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180KB from the minified file size.

![div](http://phaser.io/images/div4.png)

## Koding

You can [clone the Phaser repo in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and then start editing and previewing code right away using their web based VM development system.

![div](http://phaser.io/images/div5.png)

## Bower

If you use bower you can install phaser with:

`bower install phaser`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

![div](http://phaser.io/images/div6.png)

## CDNJS

Phaser is now available on [CDNJS](http://cdnjs.com). You can include the following in your html:

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.1.0/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.1.0/phaser.min.js`

![div](http://phaser.io/images/div1.png)

## Requirements

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above. But as always be aware of browser limitations. Not all features of Phaser work on all browsers.

### IE9

If you need to support IE9 or Android 2.x and want to use P2 physics then you must use the polyfill found in the `resources/IE9 Polyfill` folder. If you don't require P2 Physics (or don't care about IE9!) then you don't need this polyfill.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code your games, and were careful not to impose any form of class / inheritance / structure upon you. So you won't find it split into require modules or pull in 3rd party npm packages for example. That doesn't mean you can't, it just means we don't force you to do so. If you're a requireJS user you'll find a new template in the `resources\Project Templates` folder just for you.

If you code with [TypeScript](https://typescript.codeplex.com/) you'll find a comprehensive definitions file inside the `build` folder and tutorials on getting started.

Phaser is 128 KB gzipped (576 KB minified) when including all 3 physics engines. Without the physics engines its 67 KB gzipped (311 KB minified)

Note: The `phaser.min.js` file in the build folder contains all 3 physics systems bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180 KB from the minified file size.

![div](http://phaser.io/images/div3.png)

## Learn By Example <a name="example"></a>

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

## Road Map

Here are some of the features planned for future releases:

### Version 2.2 ("Tarabon")

* Adjust how Pointers and Interactive Objects work. Allow an IO to be flagged as "on click only", so it doesn't ever get processed during normal Pointer move events (unless being dragged)
* Allow multiple drag items - no longer bind just 1 to a Pointer
* Allow Groups to have Priority IDs too and input disable entire Groups and all children (let it flow down the chain)
* Allow Groups to be InputEnabled? Dragging a Group would be really useful.
* Scene Manager - json scene parser.
* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Optimised global Animation manager to cut down on object creation.
* Swapping to using a RenderTexture for the Tilemaps and implementing Tilemap slicing.
* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Support for parallel asset loading.

### Version 2.3 ("Illian")

* Look carefully at the internal structure of Phaser to avoid method repetition (such as Sprite.crop and Image.crop), investigate using mixins to help reduce overall codebase size.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.

### Beyond version 2.3

* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Look at HiDPI Canvas settings.
* Multiple Camera support.
* DragonBones support.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.

![div](http://phaser.io/images/div1.png)

## MightyEditor - A Visual Phaser Game Editor <a name="mighty-editor"></a>

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

## Nadion

[Nadion](https://github.com/jcd-as/nadion) is a set of powerful enhancements for Phaser that makes level building even easier. It includes features such as Trigger, Area, Alarms and Emitters, debug panels, state machines, parallax layer scrolling, 'developer mode' short-cuts and more.

![div](http://phaser.io/images/div2.png)

## Contributing

We now have a full [Contributors Guide][contribute] which goes into the process in more detail, but here are the headlines:

- If you find a bug then please report it on [GitHub Issues][issues] or our [Support Forum][forum].

- If you have a feature request, or have written a game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you! Either post to our [forum][forum] or email: rich@photonstorm.com

- If you issue a Pull Request for Phaser, please only do so againt the `dev` branch and *not* against the `master` branch.

- Before submitting a Pull Request please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, run `grunt jshint`. This isn't a strict requirement and we are happy to receive Pull Requests that haven't been JSHinted, so don't let it put you off contributing, but do know that we'll reformat your source before going live with it.

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

![div](http://phaser.io/images/div3.png)

## Bugs?

Please add them to the [Issue Tracker][issues] with as much info as possible, especially source code demonstrating the issue.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

"Being negative is not how we make progress" - Larry Page, Google

![div](http://phaser.io/images/div4.png)

## License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

[issues]: https://github.com/photonstorm/phaser/issues
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[phaser]: https://github.com/photonstorm/phaser
[forum]: http://www.html5gamedevs.com/forum/14-phaser/

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)
