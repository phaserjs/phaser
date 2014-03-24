![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

Phaser 2.0.1
============

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.0.1 "Lyrelle" - Released: 24th March 2014

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* Source code for 250+ [Phaser Examples](https://github.com/photonstorm/phaser-examples)
* Read the [documentation online](http://docs.phaser.io)
* Browse the [Examples online](http://examples.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode

[Subscribe to our new Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E). We'll email you when new versions are released as well as send you our regular Phaser game making magazine.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/photonstorm/phaser/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


What's new in 2.0.1?
--------------------

The 2.0.1 release of Phaser is mostly a maintenance release. With 2.0 being such a significant upgrade there were bound to be some issues, and this release addresses them. One of the core things a lot of you kept telling us was that you need Arcade Physics to work pretty much *exactly* as it did in the past. So in 2.0.1 we've taken ArcadePhysics back another iteration, fixed a few of the most common complaints you had with it, and fixed every single physics example as well.

2.0.1 also brings the TypeScript definitions virtually bang up to date, covering P2 and Ninja physics, Arcade updates and more. Our thanks to Clarke for his continued support of these.

There are a few new features as well including a Phaser export script for PhysicsEditor (found in the `resources` folder), updates to the Particle Emitter and device enhancements. As always if you find a bug that you can confirm with a test case, please report it to us via github. If you think you may have found a bug, but aren't quite sure, please post it to the forum first.


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

Version 2.0.1 - "Lyrelle" - 24th March 2014

Bug Fixes

* The Static, Kinematic and Dynamic consts that P2.Body uses were incorrect (fixes #563)
* Sprite.destroy would fail if it had an Arcade Physics body, now added.
* Group.getAt comparison updated (fixes #578)
* Fixed the IE11 version check (fixes #579)
* Ninja world collision to check right and bottom bounds (thanks dreadhorse, fix #571)
* Group enableBody parameter was incorrectly assigned to the debug var (thanks BurnedToast, fix #565)
* Fixed Tile callback check in Arcade Physics (fix #562)
* Removed the examples build script from the Gruntfile (fix #592)
* The P2 World wouldn't clear down fully on a State change, now properly clears out contacts, resets the bitmask, etc.
* Button.onInputUpHandler wouldn't set an upFrame for a frame ID of zero, made the check more strict.
* Fixed the Loader.preloadSprite crop effect on WebGL.
* Fixed Grunt script that stopped the P2 constraint classes from building properly.
* World.destroy incorrectly clashed with the Group.destroy method it over-rode, renamed to World.shutdown and updated StateManager accordingly.
* World.shutdown now removes all children iteratively, calling destroy on each one, ultimately performing a soft reset of the World.
* Objects with a scale.x or y of 0 are no longer considered valid for input (fix #602)
* InputHandler will set the browser pointer back to default if destroyed while over (fix #602)
* ArcadePhysics.separate doesn't pass over to seperateX/Y if overlapOnly is true (fix #604)
* ArcadePhysics.collideSpriteVsSprite checks if both objects have bodies before processing.
* Debug.spriteBounds will now take the position of the camera into consideration when rendering the bounds (fix #603)
* InputHandler.dragFromCenter will now work regardless of the anchor point of the Sprite (fix #600)
* Emitter.friction property removed and replaced with Emitter.particleDrag, which is now correctly applied.
* ArcadePhysics.Body.reset incorrectly set the Body.rotation to Sprite.rotation instead of angle.
* Emitter.emitParticle resets the rotation on the particle to zero before emitting it.
* If no seed was given in the Game config object, the RandomDataGenerator wouldn't be started (thank tylerjhutchison fix #619)
* p2 revolute pivots were wrongly signed (thanks georgiee, fix #621)
* P2.Body.loadPolygon no longer modifies the Cache array (fix #613)
* The volume given in Sound.play now over-rides that set in Sound.addMarker if specified (fix #623)
* BitmapDatas when used as Game Object textures in WebGL now update themselves properly.
* Timer.ms now correctly reports the ms time even if the Timer has been paused (thanks Nambew, fix #624)
* If you added a Tileset to an empty map it would eventually throw an out of memory error.
* Timer objects incorrectly set the first tick value on events if you added the events prior to starting them.


Updated

* Updated Device.isConsoleOpen as it no longer works in Chrome. Revised code and documentation accordingly (fix #593)
* Removed State.destroy empty method and replaced with State.shutdown, as that is what the StateManager expects (fix #586)
* P2.removeBody will check if the body is part of the world before removing, this avoids a TypeError from the p2 layer.
* Tilemap.createFromObjects has a new parameter: adjustY, which is true by default. Because Tiled uses a bottom-left coordinate system Phaser used to set the Sprite anchor to 0,1 to compensate. If adjustY is true it now reduces the y value by the object height instead.
* Swapped the order of the _pollGamepads gamepads check, to stop the Chrome 'webkitGamepads is deprecated' error in the console.
* Lots of TypeScript definitions updates (thanks as always to clark for these)
* Removed Device.patchAndroidClearRectBug as it's no longer used internally.
* Math.wrapAngle now supports radians (thanks Cryszon, #597)
* Group.replace will now return the old child, the one that was replaced in the Group.
* Group.destroy has a new parameter: `soft`. A soft destruction won't remove the Group from its parent or null game references. Default is `false`.
* InputHandler.validForInput is a new method that checks if the handler and its owner should be considered for Pointer input handling or not.
* ArcadePhysics.Body now checks the ArcadePhysics.World bounds, not the game bounds.
* ArcadePhysics.Body has reverted to the 1.1.3 method of preUpdate, so you can now position sprites with x/y, drag them, etc, regardless of the Body.moves flag (issue #606)
* ArcadePhysics.World now has setBounds and setBoundsToWorld methods, which are called automatically on world resizing.
* ArcadePhysics.Body no longer sets the offset to match the anchor.
* The StateManager is now responsible for clearing down input, timers, tweens, physics, camera and the World display list.
* Removed the use of Int16Array from all Game Objects, swapped for standard Array. Phaser now runs on Android 2.x and IE9 again (fix #590)
* When creating a Sprite (via Group.create or directly) with exists = false and a P2 body, the body is not added to the world.
* Every Input class now checks to see if it has already been started. If so it doesn't add the listeners again unless they have been nulled.
* Lots of fixes to the TypeScript definitions file (thanks as always to clark-stevenson for his tireless work on these)
* Emitters now bring the particle they are about to emit to the top of the Group before doing so. Avoids particles hidden behind others.
* ArcadePhysics.Body.setSize corrected to take the parameters as positive, not negative values.
* ArcadePhysics.World.seperate will now check gravity totals to determine separation order. You can set World.forceX to true to always separate on X first and skip this check.
* TileSprites now emit outOfBounds and enterBounds events accordingly.
* You can now create multiple blank layers in a Tilemap.


New Features

* Device.getUserMedia boolean added, useful if you need access to the webcam or microphone.
* Math.removeRandom allows you to remove (and return) a random object from an array.
* ArcadePhysics.World now has a checkCollision object which can be used to toggle collision against the 4 walls of its bounds.
* Sprite.events.onEnterBounds added. This is dispatched if the Sprite leaves the bounds but then returns. The opposite of onOutOfBounds.
* Timer.removeAll will remove and clear down all events, but keeps the Timer running.
* Group.setAllChildren recursively checks if its children are Groups, and if so recursively applies the value to their children as well (feature #589)
* Time.deltaCap lets you set a cap for the delta timer. It defaults to zero (which is disabled). If you use ArcadePhysics it gets set to 0.2, but you can modify as needed.
* ArcadePhysics.Body has a deltaMax object, which allows you to cap the delta applied to the position to +- this value.
* ArcadePhysics.Body now checks the Sprite scale automatically and adjusts the body size accordingly (fix #608)
* Emitter.particleClass can now be set to any object that extends Phaser.Sprite, which will be emitted instead of a regular Sprite.
* There is a brand new PhysicsEditor export script specifically for Phaser (in the resources folder), and new p2 polygon parsing functions thanks to georgiee.


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

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.1/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.0.1/phaser.min.js`


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


Nadion
------

[Nadion](https://github.com/jcd-as/nadion) is a set of powerful enhancements for Phaser that makes level building even easier. It includes features such as Trigger, Area, Alarms and Emitters, debug panels, state machines, parallax layer scrolling, 'developer mode' short-cuts and more.


Contributing
------------

We now have a full [Contributors Guide][contribute] which goes into the process in more detail, but here are the headlines:

- If you find a bug then please report it on [GitHub Issues][issues] or our [Support Forum][forum].

- If you have a feature request, or have written a game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you! Either post to our [forum][forum] or email: rich@photonstorm.com

- If you issue a Pull Request for Phaser, please only do so againt the `dev` branch and *not* against the `master` branch.

- Before submitting a Pull Request please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, first install it by running `npm install jshint`, then test your code by running `jshint src`. This isn't a strict requirement and we are happy to receive Pull Requests that haven't been JSHinted, so don't let it put you off contributing, but do know that we'll reformat your source before going live with it.


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
