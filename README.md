![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

Phaser 1.1
==========

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 1.1 - Released: October 25th 2013

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

View the [Official Website](http://phaser.io)<br />
Follow on [Twitter](https://twitter.com/photonstorm)<br />
Read the [Development Blog](http://www.photonstorm.com)<br />
Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)<br />
Try out the [Phaser Test Suite](http://gametest.mobi/phaser/)

[Un-official Getting Started with Phaser](http://www.antonoffplus.com/coding-an-html5-game-for-30-minutes-or-an-introduction-to-the-phaser-framework)

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

Version 1.1

What's New:

* JSDoc is go! We've added jsdoc3 blocks to every property and function, in every file and published the API docs to the docs folder.
* Brand new Example system (no more php!) and over 150 examples to learn from too.
* New TypeScript definitions file generated (in the build folder - thanks to TomTom1229 for manually enhancing this).
* New Grunt based build system added (thanks to Florent Cailhol)
* New: Phaser.Animation.generateFrameNames - really useful when creating animation data from texture atlases using file names, not indexes.
* Added Sprite.play as a handy short-cut to play an animation already loaded onto a Sprite.
* Added Canvas.setUserSelect() to disable touchCallouts and user selections within the canvas.
* Added Keyboard.addKey() which creates a new Phaser.Key object that can be polled for updates, pressed states, etc. See the 2 new examples showing use.
* Added Button.freezeFrames boolean. Stops the frames being set on mouse events if true.
* Extended the Loader 404 error to display the url of the file that didn't load as well as the key.
* New: Direction constants have been added to Sprites and adjust based on body motion.
* Brand new Sprite.update loop handler. Combined with the transform cache fix and further optimisations this is now much quicker to execute.
* Added Keyboard.createCursorKeys() which creates an object with 4 Key objects inside it mapped to up, down, left and right. See the new example in the input folder.
* Added Body.skipQuadTree boolean for more fine-grained control over when a body is added to the World QuadTree.
* Re-implemented Angular Velocity and Angular Acceleration on the Sprite.body and created 2 new examples to show use.
* Added Sprite.fixedToCamera boolean. A Sprite that is fixed to the camera doesn't move with the world, but has its x/y coordinates relative to the top-left of the camera.
* Added Group.createMultiple - useful when you need to create a Group of identical sprites for pooling, such as bullets.
* Added Group.total. Same as Group.length, but more in line with the rest of the Group naming.
* Added Sprite.outOfBoundsKill boolean flag. Will automatically kill a sprite that leaves the game World bounds (off by default).
* Lots of changes and fixes in ArcadePhysics, including:
* Functions with "mouse" in the title have been updated to "pointer" to more accurately reflect what they do.
* New velocity functions: moveToObject, moveToPointer, moveToXY
* New acceleration functions: accelerateToObject, accelerateToPointer, accelerateToXY
* New distance functions: distanceBetween, distanceToXY, distanceToPointer
* New angle functions: angleBetween, angleToXY, angleToPointer
* velocityFromAngle and velocityFromRotation added with examples created.
* Added killOnComplete parameter to Animation.play. Really useful in situations where you want a Sprite to animate once then kill itself on complete, like an explosion effect.
* Added Sprite.loadTexture(key, frame) which allows you to load a new texture set into an existing sprite rather than having to create a new sprite.
* Added Sprite.destroy back in again and made it a lot more robust at cleaning up child objects.
* Added 'return this' to all the core Loader functions so you can chain load calls if you so wish.
* Added Text.destroy() and BitmapText.destroy(), also updated Group.remove to make it more bullet-proof when an element doesn't have any events.
* Added Phaser.Utils.shuffle to shuffle an array.
* Added Graphics.destroy, x, y and updated angle functions.
* Added AnimationManager.refreshFrame - will reset the texture being used for a Sprite (useful after a crop rect clear)
* Added Physics.overlap(sprite1, sprite2) for quick body vs. body overlap tests with no separation performed.
* On a busy page it's possible for the game to boot with an incorrect stage offset x/y which can cause input events to be calculated wrong. A new property has been added to Stage to combat this issue: Stage.checkOffsetInterval. By default it will check the canvas offset every 2500ms and adjust it accordingly. You can set the value to 'false' to disable the check entirely, or set a higher or lower value. We recommend that you get the value quite low during your games preloader, but once the game has fully loaded hopefully the containing page will have settled down, so it's probably safe to disable the check entirely.
* Added Rectangle.floorAll to floor all values in a Rectangle (x, y, width and height).

What's changed:

* Renamed Phaser.Text.text to Phaser.Text.content to avoid conflict and overwrite from Pixi local var.
* Renamed Phaser.Text.style to Phaser.Text.font to avoid conflict and overwrite from Pixi local var.
* Phaser.Button now sets useHandCursor to true by default.
* Change: When you start a new State all active tweens are now purged.
* When the game boots it will now by default disable user-select and touch action events on the game canvas.
* Moved LinkedList.dump to Debug.dumpLinkedList(list)
* Phaser.Animation.Frame is now Phaser.Frame
* Phaser.Animation.FrameData is now Phaser.FrameData
* Phaser.Animation.Parser is now Phaser.AnimationParser (also the file has renamed from Parser.js to AnimationParser.js)
* Phaser.Loader.Parser is now Phaser.LoaderParser (also the file has renamed from Parser.js to LoaderParser.js)
* Change: We've removed the scrollFactor property from all Game Objects. Sorry, but the new Camera system doesn't work with it and it caused all kinds of issues anyway. We will sort out a replacement for it at a later date.
* Change: World now extends Phaser.Group. As a result we've updated GameObjectFactory and other classes that linked to it. If you have anywhere in your code that used to reference world.group you can just remove 'group' from that. So before, world.group.add() is now just world.add().
* Change: The Camera has been completely revamped. Rather than adjusting the position of all display objects (bad) it now just shifts the position of the single world container (good!), this is much quicker and also stops the game objects positions from self-adjusting all the time, allowing for them to be properly nested with other containers.
* Made Sprite.body optional and added in checks, so you can safely null the Sprite body object if using your own physics system and not impact rendering.
* Moved the Camera update checks to World.postUpdate, so all the sprites get the correct adjusted camera position.
* The default Game.antialias value is now 'true', so graphics will be smoothed automatically in canvas. Disable it via the Game constructor or Canvas utils.
* Phaser.Group now automatically calls updateTransform on any child added to it (avoids temp. frame glitches when new objects are rendered on their first frame).

What has been updated:

* Complete overhaul of Physics.Arcade.Body - now significantly more stable and faster too.
* Updated ArcadePhysics.separateX/Y to use new body system - much better results now.
* Added World.postUpdate - all sprite position changes, as a result of physics, happen here before the render.
* Added Animation.paused - can be set to true/false.
* Added support for Body.maxVelocity (thanks cocoademon)
* InputHandler now creates the _pointerData array on creation and populates with one empty set of values, so pointerOver etc all work before a start call.
* Removed the callbackContext parameter from Group.callAll because it's no longer needed.
* Updated Group.forEach, forEachAlive and forEachDead so you can now pass as many parameters as you want, which will all be given to the callback after the child.
* Updated build script so it can be run from the command-line and includes UMD wrappers (thanks iaincarsberg)
* World.randomX/Y now returns values anywhere in the world.bounds range (if set, otherwise 0), including negative values.
* Updated InputHandler to use Math.round rather than Math.floor when snapping an object during drag.
* If you didn't provide the useNumericIndex parameter then AnimationManager.add will set the value by looking at the datatype of the first element in the frames array.
* Group.create now sets the visible and alive properties of the Sprite to the same value as the 'exists' parameter.
* World.randomX/Y now works with negative World.bounds values.
* Tweens .to will now always return the parent (thanks powerfear)
* You can now pass a PIXI.Texture to Sprite (you also need to pass a Phaser.Frame as the frame parameter) but this is useful for Sprites sharing joint canvases.
* Group.alpha is now exposed publically and changes the Group container object (not the children directly, who can still have their own alpha values)
* Device.webGL uses new inspection code to accurately catch more webGL capable devices.
* Debug.renderSpriteBody updated to use a the new Sprite.Body.screenX/Y properties.
* Additional checks added to AnimationManager.frame/frameName on the given values.
* You can now null a Sprite.crop and it will clear down the crop rect area correctly.
* Phaser.Time physicsElapsed delta timer clamp added. Stops rogue iOS / slow mobile timer errors causing crazy high deltas.
* Animation.generateFrameNames can now work in reverse, so the start/stop values can create frames that increment or decrement respectively.
* Loader updated to use xhr.responseText when loading json, csv or text files. xhr.response is still used for Web Audio binary files (thanks bubba)
* Input.onDown and onUp events now dispatch the original event that triggered them (i.e. a MouseEvent or TouchEvent) as the 2nd parameter, after the Pointer (thanks rezoner)
* Updated Sprite.crop significantly. Values are now cached, stopping constant Texture frame updates and you can do sprite.crop.width++ for example (thanks haden)
* Change: Sprite.crop needs to be enabled with sprite.cropEnabled = true.
* Sprite.loadTexture now works correctly with static images, RenderTextures and Animations.
* Lots of fixes within Sprite.bounds. The bounds is now correct regardless of rotation, anchor or scale of the Sprite or any of its parent objects.

What has been fixed:

* QuadTree bug found in 1.0.5 now fixed. The QuadTree is updated properly now using localTransform values.
* Fixed the Bounce.In and Bounce.InOut tweens (thanks XekeDeath)
* Fixed an issue in Animation.update where if the game was paused it would get an insane delta timer throwing a uuid error.
* Added PixiPatch.js to patch in a few essential features until Pixi is updated.
* Fixed issue in Animation.play where the given frameRate and loop values wouldn't overwrite those set on construction.
* Fixed small bug stopping Tween.pause / resume from resuming correctly when called directly.
* Fixed an issue where Tweens.removeAll wasn't clearing tweens in the addition queue.
* Fixed Particle Emitters when using Emitter width/height (thanks XekeDeath)
* Made animation looping more robust when skipping frames (thanks XekeDeath)
* Fix for incorrect new particle positioning (issue #73) (thanks cottonflop)
* Fixed issue in Sound.play where if you gave a missing marker it would play the whole sound sprite instead.
* Button.setFrames will set the current frame based on the button state immediately.
* Loaded.setPreloadSprite now rounds the width/height values and starts from 1. This fixes canvas draw errors in IE9/10 and Firefox.
* Fixed issue causing Keyboard.justPressed to always fire (thanks stemkoski)
* Fixed bug in LinkedList#remove that could cause first to point to a dead node (thanks onedayitwillmake)
* Fixed Cache.addDefaultImage so the default image works in Canvas as well as WebGL. Updated to a new image (32x32 black square with green outline)
* Fixed a bug in the Sprite transform cache check that caused the skew/scale cache to get constantly invalidated - now only updates as needed, significant performance increase!
* Fixed typo in StageScaleMode so it's not pageAlignVeritcally any longer, but pageAlignVertically.
* Fixed issue in Group.countLiving / countDead where the value was off by one (thanks mjablonski)
* Fixed issue with a jittery Camera if you moved a Sprite via velocity instead of x/y placement.
* Fixed the RandomDataGenerator.sow method so if you give in the same seed you'll now get the same results (thanks Hsaka)
* Fixed Issue #101 (Mouse Button 0 is not recognised, thanks rezoner)
* Fixed an issue where creating an animation with just one frame with an index of zero would cause a UUID error (thanks SYNYST3R1)
* Fixed Rectangle.union (thanks andron77)
* Fixed Sound.resume so it now correctly resumes playback from the point it was paused (fixes issue 51, thanks Yora).
* Fixed issue 105 where a dragged object that was destroyed would cause an Input error (thanks onedayitwillmake)
* Fixed Issue 111 - calling Kill on a Phaser.Graphics instance causes error on undefined events.
* Game.destroy will now stop the raf from running as well as close down all input related event listeners (issue 92, thanks astrism)
* Pixel Perfect click detection now works even if the Sprite is part of a texture atlas.

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

Outstanding Tasks
-----------------

* TODY: Loader conflict if 2 keys are the same even if they are in different packages (i.e. you can't use "title" for both and image and sound file).
* TODO: d-pad example (http://www.html5gamedevs.com/topic/1574-gameinputondown-question/)
* TODO: more touch input examples (http://www.html5gamedevs.com/topic/1556-mobile-touch-event/)
* TODO: Sound.addMarker hh:mm:ss:ms
* TODO: swap state (non-destructive shift)
* TODO: rotation offset
* TODO: Look at HiDPI Canvas settings

How to Build
------------

A Grunt script has been provided that will build Phaser from source as well as the examples. Run `grunt` in the phaser folder for a list of command-line options.

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

Learn By Example
----------------

Phaser comes with an ever growing suite of Examples. Personally I feel that we learn better by looking at small refined code examples, so we created over 150 of them and create new ones to test every new feature added. Inside the `examples` folder you'll find the current set. If you write a particularly good example then please send it to us.

The examples need running through a local web server (to avoid file access permission errors from your browser).

Browse to the examples folder via your web server.

    examples/index.html

There is a new 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation.

You can also browse all [Phaser Examples](http://gametest.mobi/phaser/) online.

Contributing
------------

Phaser is in early stages and although we've still got a lot to add to it, we wanted to get it out there and share it with the world.

If you find a bug (highly likely!) then please report it on github or our forum.

If you have a feature request, or have written a small game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you.

You can do this on the Phaser board that is part of the [HTML5 Game Devs forum](http://www.html5gamedevs.com/forum/14-phaser/) or email: rich@photonstorm.com

Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

License
-------

The MIT License (MIT)

Copyright (c) 2013 Richard Davey, Photon Storm Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: https://github.com/photonstorm/phaser/issues
[phaser]: https://github.com/photonstorm/phaser
