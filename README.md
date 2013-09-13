Phaser
======

Version: 1.0.0 - Released: September 13th 2013

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It supports Canvas and WebGL rendering.

The [Official Website](http://phaser.io)<br />
Follow on [Twitter](https://twitter.com/photonstorm)<br />
Read the [Development Blog](http://www.photonstorm.com)<br />
Join the [Support Forum](http://www.html5gamedevs.com/forum/14-phaser/)

Try out the [Phaser Test Suite](http://gametest.mobi/phaser/)

"Being negative is not how we make progress" - Larry Page, Google

Latest Update
-------------

September 13th 2013

We're very pleased to have finally shipped the 1.0 release of Phaser. This version represents many months of hard work, feedback and refactoring based on the previous 0.5 through to 0.97 releases. You can see the full gory details in our change log.

Sorry but the jsdocs aren't yet finished, but it is now our priority (along with bug fixing). If you run into problems, or just want to chat about how to best use Phaser then please do join our forums. It's an active and inspiring community.

Now 1.0 is released we'll focus on getting the docs and more examples completed. Both of these will be pushed to the master repo on a regular basis. We will tag new releases of Phaser, but changes to the examples or docs won't be release tagged.

Thank you to everyone who has encouraged us along the way. To those of you who worked with Phaser during its various incarnations, and who released full games with it despite there being zero API documentation available: you are our heroes. It's your kind words and enthusiasm, as well as our commercial need for Phaser that has kept us going. Now we're at 1.0 we will continue releasing rapidly and jumping on patches and bug reports quickly.

Phaser is everything we ever wanted from an HTML5 game framework. It will power all our client work going forward and we look forward to you joining us on this journey.

![Blasteroids](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_blaster.png)

Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/). We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

Phaser is 275 KB minified and 62 KB gzipped.

Features
--------

Phaser was born from a cross-pollination of the AS3 Flixel game library and our own internal HTML5 game framework. The objective was to allow you to make games _really_ quickly and remove some of the speed barriers HTML5 puts in your way.

Phaser fully supports the following features:

*	Easy asset Loading<br />

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

*	Scroll Zones<br />

	Scroll any image seamlessly in any direction. Or create multiple scrolling regions within an image.

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

	Support for CSV and Tiled JSON format tile maps. Supports Layered Tiled maps and layer based collision.

*	Game Scaling<br />

	Game scaling under your control. Removes URL/status bar on mobile (iOS and Android) and allows proportional scaling, fixed size and orientation checks.

![Phaser Particles](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_particles.png)

Known Issues
------------

* The TypeScript definition file isn't yet complete.
* The JSDOCS are not yet complete.

Future Plans
------------

* Ability to layer another DOM object and have it controlled by the game somehow. Can then do stacked canvas effects.
* Add ability to create extra <div>s within the game container, layered above/below the canvas.
* Basic set of GUI components, checkbox, window, etc.
* Tilemap: remove tiles of a certain type, replace tile with sprite, change layer order, Tiled object support.
* Joypad support.
* Gestures input class.
* Integrate Advanced Physics system.
* Integrate Advanced Particles system.
* Better sound controls and effects.
* Google Play Game Services.

Test Suite
----------

Phaser comes with an ever growing Test Suite. Personally we learn better by looking at small refined code examples, so we create lots of them to test each new feature we add. Inside the Tests folder you'll find the current set. If you write a particularly good test then please send it to us.

The tests need running through a local web server (to avoid file access permission errors from your browser).

Make sure you can browse to the Tests folder via your web server. If you've got php installed then launch:

    examples/index.php

Right now the Test Suite requires PHP, but we will remove this requirement soon.

You can also browse the [Phaser Test Suite](http://gametest.mobi/phaser/) online.

Contributing
------------

Phaser is in early stages and although we've still got a lot to add to it, we wanted to just get it out there and share it with the world.

If you find a bug (highly likely!) then please report it on github.

If you have a feature request, or have written a small game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you.

You can do this on the Phaser board that is part of the [HTML5 Game Devs forum](http://www.html5gamedevs.com/forum/14-phaser/) or email: rich@photonstorm.com

Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap.png)

![Phaser Cameras](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_cams.png)

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
