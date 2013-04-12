Phaser
======

Version 0.5

12th April 2013

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

Phaser is a 2D JavaScript/TypeScript HTML5 Game Framework based heavily on [Flixel](http://www.flixel.org).

Follow us on [twitter](https://twitter.com/photonstorm) and our [blog](http://www.photonstorm.com) for development updates.

Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/). We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

Features
--------

Phaser was born from a cross-polination of the AS3 Flixel game library and our own internal HTML5 game framework. The objective was to allow you to make games _really_ quickly and remove some of the speed barriers HTML5 puts in your way.

Phaser fully or partially supports the following features. This list is growing constantly and we are aware there are still a number of essential features missing:

*	Asset Loading
	Images, Sprite Sheets, Texture Packer Data, JSON, Text Files, Audio File.

*	Cameras
	Multiple world cameras, camera scale, zoom, rotation, deadzones and Sprite following.

*	Sprites
	All sprites have physics properties including velocity, acceleration, bounce and drag.
	ScrollFactor allows them to re-act to cameras at different rates.

*	Groups
	Group sprites together for collision checks, visibility toggling and function iteration.

*	Animation
	Sprites can be animated by a sprite sheet or Texture Atlas (JSON Array format supported).
	Animation playback controls, looping, fps based timer and custom frames.

*	Collision
	A QuadTree based Sprite to Sprite, Sprite to Group or Group to Group collision system.

*	Particles
	An Emitter can emit Sprites in a burst or at a constant rate, setting physics properties.

*	Input
	Keyboard and Mouse handling supported (Touch coming asap)

*	Stage
	Easily change properties about your game via the stage, such as background color, position and size.

*	World
	The game world can be any size and Sprites and collision happens within it.

*	Sound (partial support)
	Currently uses WebAudio for playback. A lot more work needs to be done in this area.

*	State Management
	For larger games it's useful to break your game down into States, i.e. MainMenu, Level1, GameOver, etc.
	The state manager makes swapping states easy, but the use of a state is completely optional.

*	Cache
	All loaded resources are stored in an easy to access cache, which can be cleared between State changes
	or persist through-out the whole game.

*	Tilemaps
	Support for CSV and Tiled JSON format tile maps	is implemented but currently limited.

Work in Progress
----------------

We've a number of features that we know Phaser is lacking, here is our current priority list:

*	Tilemap collision and layers
*	Better sound controls
*	Touch and MSPointer support
*	Game scaling on mobile
*	Text Rendering
*	Buttons

Beyond this there are lots of other things we plan to add such as WebGL support, Spline animation format support, sloped collision tiles, path finding and support for custom plugins. But the list above are more priority items and is by no means exhaustive either! However we do feel that the core structure of Phaser is now pretty locked down, so safe to use for small scale production games.

Test Suite
----------

Phase comes with an ever growing Test Suite. Personally we learn better by looking at small refined code examples, so we create lots of them to test each new feature we add. Inside the Tests folder you'll find the current set. If you write a particuarly good test then please send it to us.

The tests need running through a local web server (to avoid file access permission errors from your browser).

Make sure you can browse to the Tests folder via your web server. If you've got php installed then launch:

    Tests/index.php

Right now the Test Suite requires PHP, but we will remove this requirement soon.

Contributing
------------

Phaser is in early stages and although we've still got a lot to add to it, we wanted to just get it out there and share it with the world.

If you find a bug (highly likely!) then please report it on github.

If you have a feature request, or have written a small game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you.

You can do this on the [HTML5 Game Devs forum](http://www.html5gamedevs.com) or email: rich@photonstorm.com

Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

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
