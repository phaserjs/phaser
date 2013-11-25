![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

Phaser 1.1
==========

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 1.1.3 - Released: -in development-

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

View the [Official Website](http://phaser.io)<br />
Follow on [Twitter](https://twitter.com/photonstorm)<br />
Read the [Development Blog](http://www.photonstorm.com)<br />
Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)<br />
Try out 150+ [Phaser Examples](http://gametest.mobi/phaser/examples/)

[Un-official Getting Started with Phaser](http://www.antonoffplus.com/coding-an-html5-game-for-30-minutes-or-an-introduction-to-the-phaser-framework)

[Subscribe to our new Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E). We'll email you when new versions are released as well as send you our regular Phaser game making magazine.

"Being negative is not how we make progress" - Larry Page, Google

Welcome to Phaser
-----------------

It's staggering to think just how much has been achieved in the short time Phaser has been alive. We've implemented literally hundreds of bug fixes and updates, thanks to the effort the community puts in to reporting issues they find. Exciting new features have been merged into the core and we revisited old ones and pimped them out. We also completely overhauled the Examples Suite, removed the requirement for PHP, rebuilt it and filled it with over 150 examples to dig in and learn from. And more importantly we've got our first pass at the API docs ready too.

There is still more to be done of course. The API docs, while a good start, are lacking in places and still need to be backed up with a proper comprehensive manual. And we desperately need to write some 'best practises' and 'getting started' tutorials too. But we hope you appreciate the amount of effort that has been put in by the team so far.

There are many exciting new features and tweaks in this build that we felt it warranted a proper point release, hence the shift to version 1.1. Because of several core changes games that were in development in a 1.0.x version of Phaser may need refactoring for 1.1, but we feel those changes have helped the framework grow and mature as a whole.

As before we offer a heart-felt "Thank you!" to everyone who has encouraged us along the way. To those of you who worked with Phaser during its various incarnations, and who released full games with it despite there being zero API documentation available: you are our heroes. It's your kind words and enthusiasm that has kept us going.

Phaser is everything we ever wanted from an HTML5 game framework. It powers all of our client work in build today and remains our single most important product, and we've only just scratched the surface of what we have planned for it.

![MiniCybernoid](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser-cybernoid-640x480.png)

Change Log
----------

Version 1.1.3 - in build

* New: Added a .jshintrc so contributions can be run through JSHint to help retain formatting across the library (thanks kevinthompson)
* New: The entire Phaser library has been updated to match the new JSHint configuration.
* New: Added a new in-built texture. Sprites now use __default if no texture was provided (a 32x32 transparent PNG) or __missing if one was given but not found (a 32x32 black box with a green cross through it)
* New: Added Phaser.Filter. A new way to use the new WebGL shaders/filters that the new version of Pixi supports.
* New: The object returned by Math.sinCosGenerator now contains a length property.
* New: Phaser.BitmapData object. Can be used as a texture for a Sprite or Tiling Sprite. See the new examples and docs for details.
* New: RenderTexture.render now takes a Phaser.Group. Also added renderXY for when you don't want to make a new Point object.
* New: Implementing PluginManager.remove, added PluginManager.removeAll (thanks crazysam)
* New: Added scrollFactorX/scrollFactorY to TilemapLayers (thanks jcd-as)
* New: Phaser.Game parent can now be an HTMLElement or a string (thanks beeglebug)
* New: Updated to use the latest version of Pixi.js - which means you can now use all the sexy new WebGL filters they added :)
* New: Sprite.animations.getAnimation will return an animation instance which was added by name.
* New: Added Mouse.button which is set to the button that was pressed: Phaser.Mouse.LEFT_BUTTON, MIDDLE_BUTTON or RIGHT_BUTTON (thanks wKLV)
* New: Added Mouse.pointerLock signal which you can listen to whenever the browser enters or leaves pointer lock mode.
* New: StageScaleMode.forceOrientation allows you to lock your game to one orientation and display a Sprite (i.e. a "please rotate" screen) when incorrect.
* New: World.visible boolean added, toggles rendering of the world on/off entirely.
* New: Polygon class & drawPolygon method added to Graphics (thanks rjimenezda)
* New: Added Group.iterate, a powerful way to count or return children that match a certain criteria. Refactored Group to use iterate, lots of repeated code cut.
* New: Added Group.sort. You can now sort the Group based on any given numeric property (x, y, health), finally you can do depth-sorting :) Example created to show.
* New: Enhanced renderTexture so it can accept a Phaser.Group object and improved documentation and examples.
* New: Device.littleEndian boolean added. Only safe to use if the browser supports TypedArrays (which IE9 doesn't, but nearly all others do)
* New: You can now call game.sound.play() and simply pass it a key. The sound will play if the audio system is unlocked and optionally destroy itself on complete.
* New: Mouse.capture is a boolean. If set to true then DOM mouse events will have event.preventDefault() applied, if false they will propogate fully.

* Fixed: Lots of fixes to the TypeScript definitions file (many thanks gltovar)
* Fixed: Tilemap commands use specified layer when one given (thanks Izzimach)
* Fixed: Mouse.stop now uses the true useCapture, which means the event listeners stop listening correctly (thanks beeglebug)
* Fixed: Input Keyboard example fix (thanks Atrodilla)
* Fixed: BitmapText.destroy now checks if it has a canvas before calling parentNode on it.
* Fixed: Group.swap had a hellish to find bug that only manifested when B-A upward swaps occured. Hours of debugging later = bug crushed.
* Fixed: Point.rotate asDegrees fixed (thanks BorisKozo)
* Fixed: ArcadePhysics.separateTile wasn't returning the value, so the custom process callback wasn't getting called (thanks flameiguana)
* Fixed: StageScaleMode.forceOrientation now correctly stores the forcePortrait value (thanks haden)
* Fixed: Fixes to Math and Loader (thanks theJare)
* Fixed: Tween - isRunning not reset when non-looped tween completes (thanks crazysam + kevinthompson)
* Fixed: Math.normalizeAngle and Math.wrapAngle (thanks theJare)

* Updated: ArcadePhysics.updateMotion applies the dt to the velocity calculations as well as position now (thanks jcs)
* Updated: RequestAnimationFrame now retains the callbackID which is passed to cancelRequestAnimationFrame.
* Updated: Button now goes back to over state when setFrames used in action (thanks beeglebug)
* Updated: plugins now have a postUpdate callback (thanks cocoademon)
* Updated: Tided up the Graphics object (thanks BorisKozo)
* Updated: If running in Canvas mode and you have a render function it will save the context and reset the transform before running your render function.
* Updated: Sprite will now check the exists property of the Group it is in, if the Group.exists = false the Sprite won't update.
* Updated: Lots of documentation fixes and updates across nearly all files.
* Updated: If you specify 'null' as a Group parent it will now revert to using the World as the parent (before only 'undefined' worked)
* Updated: Skip preupdate/update for PIXI hierarchies in which an ancestor doesn't exist (thanks cocoademon)
* Updated: Loader.audio can now accept either an array of URL strings or a single URL string (thanks crazysam + kevinthompson)
* Updated: MSPointer updated to support IE11 by dropping the prefix from the event listeners.

You can view the complete Change Log for all previous versions at https://github.com/photonstorm/phaser/changelog.md

How to Build
------------

We provide a fully compiled version of Phaser in the `build` directory, in both plain and minified formats.

We also provide a Grunt script that will build Phaser from source along with all the examples.

Run `grunt` in the phaser folder for a list of command-line options.

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/) using the provided TypeScript definitions file. We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

Phaser is 281 KB minified and 66 KB gzipped.

Features
--------

**WebGL &amp; Canvas**

Phaser uses both a Canvas and WebGL renderer internally and can automatically swap between them based on browser support. This allows for lightning fast rendering across Desktop and Mobile. Phaser uses and contributes towards the excellent Pixi.js library for rendering.

**Preloader**

We've made the loading of assets as simple as one line of code. Images, Sounds, Sprite Sheets, Tilemaps, JSON data, XML - all parsed and handled automatically, ready for use in game and stored in a global Cache for Sprites to share.

**Physics**

Phaser ships with our Arcade Physics system. An extremely light-weight AABB physics library perfect for low-powered devices and fast collision response. Control velocity, acceleration, bounce, drag and full collision and separation control.

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

Although Phaser 1.0 is a brand new release it is born from years of experience building some of the biggest HTML5 games out there. We're not saying it is 100% bug free, but we use it for our client work every day, so issues get resolved <em>fast</em> and we stay on-top of the changing browser landscape.

![FruitParty](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_fruit_particles-640x480.png)

Road Map
--------

The 1.1 release was a massive under-taking, but we're really happy with how Phaser is progressing. It's becoming more solid and versatile with each iteration. Here is what's on our road map for future versions:

* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Integration with an advanced physics system. We've been experimenting with p2.js but have yet to conclude our research.
* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Massively enhance the audio side of Phaser. Although it does what it does well, it could do with taking more advantage of Web Audio - echo effects, positional sound, etc.
* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Virtual d-pad support and also support for the Joypad API.
* Test out packaging with Node-webkit.
* Flash CC HTML5 export integration.
* Game parameters stored in Google Docs.
* More advanced tile map features. Better support for advanced Tiled features and also I want to add full support for DAME tilemaps.
* Add a d-pad example (http://www.html5gamedevs.com/topic/1574-gameinputondown-question/)
* Create more touch input examples (http://www.html5gamedevs.com/topic/1556-mobile-touch-event/)
* Look at HiDPI Canvas settings.

Some specific features / issues we will address soon:

* Loader conflict if 2 keys are the same even if they are in different packages (i.e. you can't use "title" for both and image and sound file).
* Sound.addMarker hh:mm:ss:ms.
* Add support for a rotation offset.

Learn By Example
----------------

Phaser comes with an ever growing suite of Examples. Personally I feel that we learn better by looking at small refined code examples, so we created over 150 of them and create new ones to test every new feature added. Inside the `examples` folder you'll find the current set. If you write a particularly good example then please send it to us.

The examples need to be run through a local web server (in order to avoid file access permission errors from your browser). You can use your own web server, or start the included web server using grunt.

Using a locally installed web server browse to the examples folder:

    examples/index.html

Alternatively in order to start the included web server, after you've cloned the repo, run npm install to install all dependencies, then run grunt connect to start a local server. After running this command, you should be able to access your local webserver at `http://127.0.0.1:8000`. Then browse to the examples folder: `http://127.0.0.1:8000/examples/index.html`

There is a new 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation.

You can also browse all [Phaser Examples](http://gametest.mobi/phaser/) online.

Contributing
------------

Phaser is in early stages and although we've still got a lot to add to it, we wanted to get it out there and share it with the world.

If you find a bug (highly likely!) then please report it on github or our forum.

If you have a feature request, or have written a small game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you.

Before submitting a pull request, please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, first install it by running `npm install jshint`, then test your code by running `jshint src`. This isn't a requirement, we are happy to receive pull requests that haven't been JSHinted, so don't let it put you off contributing - but do know that we'll reformat your source before going live with it.

You can do this on the Phaser board that is part of the [HTML5 Game Devs forum](http://www.html5gamedevs.com/forum/14-phaser/) or email: rich@photonstorm.com

Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

License
-------

Phaser is released under the (http://opensource.org/licenses/MIT) MIT License.

[1]: https://github.com/photonstorm/phaser/issues
[phaser]: https://github.com/photonstorm/phaser
