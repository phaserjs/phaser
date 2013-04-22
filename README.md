Phaser
======

Version 0.9.3

21st April 2013

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

Phaser is a 2D JavaScript/TypeScript HTML5 Game Framework based heavily on [Flixel](http://www.flixel.org).

Follow us on [twitter](https://twitter.com/photonstorm) and our [blog](http://www.photonstorm.com) for development updates.

For support post to the Phaser board on the [HTML5 Game Devs forum](http://www.html5gamedevs.com/forum/14-phaser/)

![Phaser Cameras](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_cams.png)

Change Log
----------

V0.9.3

* Fixed issues with Group not adding reference to Game to newly created objects.
* Added more robust frame checking into AnimationManager
* Re-built Tilemap handling from scratch to allow for proper layered maps (as exported from Tiled / Mappy)
* Tilemap no longer requires a buffer per Camera (in prep for WebGL support)
* Added shiftSinTable and shiftCosTable to the GameMath class to allow for quick iteration through the data tables.
* Added the new ScrollZone game object. Endlessly useful but especially for scrolling backdrops. Created several example tests.
* Removed the need for DynamicTextures to require a key property and updated test cases.


V0.9.2

* Fixed issue with create not being called if there was an empty init method.
* Added ability to flip a sprite (Sprite.flipped = true) + a test case for it.
* Added ability to restart a sprite animation.
* Sprite animations don't restart if you call play on them when they are already running.
* Added Stage.disablePauseScreen. Set to true to stop your game pausing when the tab loses focus.

V0.9.1

* Added the new align property to GameObjects that controls placement when rendering.
* Added an align example to the Sprites test group (click the mouse to change alignment position)
* Added a new MicroPoint class. Same as Point but much smaller / less functions, updated GameObject to use it.
* Completely rebuilt the Rectangle class to use MicroPoints and store the values of the 9 points around the edges, to be used
for new collision system.
* Game.Input now has 2 signals you can subscribe to for down/up events, see the Sprite align example for use.
* Updated the States examples to bring in-line with 0.9 release.

V0.9

* Large refactoring. Everything now lives inside the Phaser module, so all code and all tests have been updated to reflect this. Makes coding a tiny bit more verbose but stops the framework from globbing up the global namespace. Also should make code-insight work in WebStorm and similar editors.
* Added the new GeomSprite object. This is a sprite that uses a geometry class for display (Circle, Rectangle, Point, Line). It's extremely flexible!
* Added Geometry intersection results objects.
* Added new Collision class and moved some functions there. Contains all the Game Object and Geometry Intersection methods.
* Can now create a sprite animation based on frame names rather than indexes. Useful when you've an animation inside a texture atlas. Added test to show.
* Added addKeyCapture(), removeKeyCapture() and clearCaptures() to Input.Keyboard. Calls event.preventDefault() on any keycode set to capture, allowing you to avoid page scrolling when using the cursor keys in a game for example.
* Added new Motion class which contains lots of handy functions like 'moveTowardsObject', 'velocityFromAngle' and more.
* Tween Manager added. You can now create tweens via Game.createTween (or for more control game.tweens). All the usual suspects are here: Bounce, * Elastic, Quintic, etc and it's hooked into the core game clock, so if your game pauses and resumes your tweens adjust accordingly.

V0.8

* Added ability to set Sprite frame by name (sprite.frameName), useful when you've loaded a Texture Atlas with filename values set rather than using frame indexes.
* Updated texture atlas 4 demo to show this.
* Fixed a bug that would cause a run-time error if you tried to create a sprite using an invalid texture key.
* Added in DynamicTexture support and a test case for it.

V0.7

* Renamed FullScreen to StageScaleMode as it's much more fitting. Tested across Android and iOS with the various scale modes.
* Added in world x/y coordinates to the input class, and the ability to get world x/y input coordinates from any Camera.
* Added the RandomDataGenerator for seeded random number generation.
* Setting the game world size now resizes the default camera (optional bool flag)

V0.6

* Added in Touch support for mobile devices (and desktops that enable it) and populated x/y coords in Input with common values from touch and mouse.
* Added new Circle geometry class (used by Touch) and moved them into a Geom folder.
* Added in Device class for device inspection.
* Added FullScreen class to enable full-screen support on mobile devices (scrolls URL bar out of the way on iOS and Android)

V0.5

* Initial release

Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/). We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

Phaser is 147KB minified and just 30KB gzipped (sizes accurate as of version 0.7)

Features
--------

Phaser was born from a cross-polination of the AS3 Flixel game library and our own internal HTML5 game framework. The objective was to allow you to make games _really_ quickly and remove some of the speed barriers HTML5 puts in your way.

Phaser fully or partially supports the following features. This list is growing constantly and we are aware there are still a number of essential features missing:

*	Asset Loading<br />

	Images, Sprite Sheets, Texture Packer Data, JSON, Text Files, Audio File.

*	Cameras<br />

	Multiple world cameras, camera scale, zoom, rotation, deadzones and Sprite following.

*	Sprites<br />

	All sprites have physics properties including velocity, acceleration, bounce and drag.
	ScrollFactor allows them to re-act to cameras at different rates.

*	Groups<br />

	Group sprites together for collision checks, visibility toggling and function iteration.

*	Animation<br />

	Sprites can be animated by a sprite sheet or Texture Atlas (JSON Array format supported).
	Animation playback controls, looping, fps based timer and custom frames.

*	Collision<br />

	A QuadTree based Sprite to Sprite, Sprite to Group or Group to Group collision system.

*	Particles<br />

	An Emitter can emit Sprites in a burst or at a constant rate, setting physics properties.

*	Input<br />

	Keyboard, Mouse and Touch handling supported (MSPointer events coming soon)

*	Stage<br />

	Easily change properties about your game via the stage, such as background color, position, size and scale.

*	World<br />

	The game world can be any size and Sprites and collision happens within it.

*	Sound<br />

	Currently uses WebAudio for playback. A lot more work needs to be done in this area.

*	State Management<br />

	For larger games it's useful to break your game down into States, i.e. MainMenu, Level1, GameOver, etc.
	The state manager makes swapping states easy, but the use of a state is completely optional.

*	Cache<br />

	All loaded resources are stored in an easy to access cache, which can be cleared between State changes
	or persist through-out the whole game.

*	Tilemaps<br />

	Support for CSV and Tiled JSON format tile maps	is implemented but currently limited.

*	Game Scaling<br />

	Game scaling under your control. Removes URL/status bar on mobile (iOS and Android) and allows proportional scaling, fixed size and orientation checks.

![Phaser Particles](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_particles.png)

Work in Progress
----------------

We've a number of features that we know Phaser is lacking, here is our current priority list:

*	Tilemap collision and layers
*	Better sound controls
*	MSPointer support
*	Text Rendering
*	Buttons

Beyond this there are lots of other things we plan to add such as WebGL support, Spline animation format support, sloped collision tiles, path finding and support for custom plugins. But the list above are more priority items and is by no means exhaustive either! However we do feel that the core structure of Phaser is now pretty locked down, so safe to use for small scale production games.

Test Suite
----------

Phaser comes with an ever growing Test Suite. Personally we learn better by looking at small refined code examples, so we create lots of them to test each new feature we add. Inside the Tests folder you'll find the current set. If you write a particuarly good test then please send it to us.

The tests need running through a local web server (to avoid file access permission errors from your browser).

Make sure you can browse to the Tests folder via your web server. If you've got php installed then launch:

    Tests/index.php

Right now the Test Suite requires PHP, but we will remove this requirement soon.

Contributing
------------

Phaser is in early stages and although we've still got a lot to add to it, we wanted to just get it out there and share it with the world.

If you find a bug (highly likely!) then please report it on github.

If you have a feature request, or have written a small game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you.

You can do this on the Phased board on the [HTML5 Game Devs forum](http://www.html5gamedevs.com/forum/14-phaser/) or email: rich@photonstorm.com

Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap.png)

License
-------

Copyright 2013 Richard Davey, Photon Storm Ltd. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY RICHARD DAVEY ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL RICHARD DAVEY OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed

[1]: https://github.com/photonstorm/phaser/issues
[phaser]: https://github.com/photonstorm/phaser
