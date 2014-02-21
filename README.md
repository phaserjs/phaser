![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

Phaser 1.2-dev
==============

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 1.2 "Shienar" - Released: -in development-

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* Try out 220+ [Phaser Examples](http://examples.phaser.io)
* Read the [documentation online](http://docs.phaser.io)

[Subscribe to our new Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E). We'll email you when new versions are released as well as send you our regular Phaser game making magazine.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/photonstorm/phaser/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


Welcome to Phaser
-----------------

As you may know we had planned to release 1.1.4 at the end of 2013. For various reasons this didn't quite happen, but we're happy to announce it's finally out! There have been some dramatic changes internally, and if you make use of either the physics systems or tilemaps then you are going to need to update your code. Hopefully only a little bit, but there have been a number of core API changes which we detail below. There are also a host of new features, the headliners being:

* New Physics system. Uses SAT.js internally so physics bodies can now be rectangles, circles or polygons and support rotation.
* New Tilemap system. Brand new collision system for tiles, much more advanced layer handling, tile properties, multiple tilesets of layer and more.
* New Timer. This handy new class lets you create timed events easily.
* Your Game can now be configured from an external configuration object.
* Over 150 new features and updates and over 30 reported bug fixes.

This release also brings the TypeScript definitions file as bang up to date as possible. There are still a few areas that need looking at, but with your help hopefully we can iron those final few bits out and have a 100% accruate defs file on offer.

There is a new Contributors Guide which we'd urge you to follow if you wish to help with Phaser development, and we've updated the doc files and added lots more details into key areas. The Examples have grown too! Now over 220 of them including several great ones from the community.

We're going to settle on this build for a short while as we do some quick iteration bug fixing, so expect to see some small point releases very soon that do nothing but address any issues you may find. But in parallel to this we are also now rebuilding our core to bring it in-line with the latest version of Pixi.js, which has had some dramatic changes under the hood, changes will impact a lot of what Phaser does internally. But the changes are all for the better and once we upgrade Pixi you'll have a significantly faster renderer and a smaller codebase too, as we do away with stacks of linked list code :)

As always we offer a heart-felt "Thank you!" to everyone who has encouraged us along the way. To those of you who worked with Phaser during its various incarnations. The number of games being released that were made with Phaser is staggering and we really love to see how you use it! You are our heroes. It's your kind words and enthusiasm that has keeps us going.

Phaser is everything we ever wanted from an HTML5 game framework. It powers all of our client work in build today and remains our single most important product, and we've still only just scratched the surface of what we have planned for it.

![MiniCybernoid](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser-cybernoid-640x480.png)


Getting Started Guides
----------------------

We have a new [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

There is a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide on the GameDevTuts+ site which is a great place to learn where to find tutorials, examples and support.

There is also an [un-official Getting Started Guide](http://www.antonoffplus.com/coding-an-html5-game-for-30-minutes-or-an-introduction-to-the-phaser-framework).


Change Log
----------

Version 1.2 - "Shienar" - -in development-

Significant API changes:

* Upgraded to Pixi.js 1.5.2
* Group now extends PIXI.DisplayObjectContainer, rather than owning a _container property, which makes life a whole lot easier re: nesting and child iteration.
* Removed Sprite.group property. You can use Sprite.parent for all similar needs now.
* PIXI.Point is now aliased to Phaser.Point - saves on code duplication and works exactly the same.
* PIXI.Rectangle is now aliased to Phaser.Rectangle - saves on code duplication and works exactly the same.
* PIXI.Circle is now aliased to Phaser.Circle - saves on code duplication and works exactly the same.
* Sprite.deltaX and deltaY swapped to functions: Sprite.deltaX() and Sprite.deltaY()
* Sprite.crop() now takes a Phaser.Rectangle instead of explicit parameters.
* PixiPatch no longer needed, all features that it patched are now native in Pixi :)
* Removed: Sprite.offset, center, topLeft, topRight, bottomRight, bottomLeft and bounds, as no longer needed internally. Use Sprite.getBounds() to derive them.
* Button now extends Phaser.Image not Phaser.Sprite, all the same functionality as before remains, just no animations or physics body.
* Text.content has been replaced with Text.text. The Text class has a lot of new methods, check the docs!
* Loader won't set crossOrigin on  Images unless it's set to something. The default is false, it used to be '' and can be any valid string.
* Sprite.input.pixelPerfect has been split into two: Sprite.input.pixelPerfectClick and Sprite.input.pixelPerfectOver (see new features)
* Phaser.Stage now extends PIXI.Stage, rather than containing a _stage object.
* If you set Sprite.exists to false it will also set Sprite.visible to false and remove its body from the physics world (if it has one).
* If you set Sprite.exists to true it will also set Sprite.visible to true and add its body back into the physics world (if it has one).
* Stage.scale has been moved to Game.scale. The same game scaling properties exist as before, but now accessed via Game.scale instead.
* Stage.aspectRatio has been moved to StageScaleMode.sourceAspectRatio (so now game.scale.sourceAspectRatio)
* Stage.scaleMode has been moved to StageScaleMode.scaleMode (so now game.scale.scaleMode)
* Stage.fullScreenScaleMode has been moved to StageScaleMode.fullScreenScaleMode (so now game.scale.fullScreenScaleMode)
* Stage.canvas has been moved to Game.canvas (which used to be a reference to Stage.canvas, but is now the actual object).
* BitmapData.addTo removed and enhanced BitmapData.add so it can accept either a single Sprite/Image or an Array of them.
* BitmapData has had all of the EaselJS functions removed. It was just taking up space and you can do it all via BitmapData.context directly.
* BitmapText has had a bit of an overhaul - the signature for adding a BitmapText has changed to: x, y, font, text, size. See the docs and examples for details.
* World preUpdate, update and postUpdate have all been moved to Stage. So all children are updated regardless where on the display list they live.
* Cache.getImageKeys and similar has been removed, please use Cache.getKeys(Phaser.Cache.IMAGE) instead, this now supports all 10 Cache data types.
* After defining tiles that collide on a Tilemap, you need to call Tilemap.generateCollisionData(layer) to populate the physics world with the data required.
* Phaser.QuadTree has been removed from core and moved to a plugin. It's no longer required, nor works with the physics system.
* Phaser.Animation.frame now returns the frame of the current animation, rather than the global frame from the sprite sheet / atlas.
* When adding a Group if the parent value is `null` the Group won't be added to the World, so you can add it when ready. If parent is `undefined` it's added to World by default.


New features:

* Phaser.Image is a brand new display object perfect for logos, backgrounds, etc. You can scale, rotate, tint, blend an get input events from an Image, but it has no animation, physics body.
* You can now use the hitArea property on Sprites and Image objects. hitArea can be a geometry object (Rectangle, Circle, Polygon, Ellipse) and is used in pointerOver checks.
* InputManager.getLocalPosition(displayObject, pointer, output) will return the local coordinates of the specified displayObject and pointer.
* InputManager.hitTest will test for pointer hits against a Sprite/Image, its hitArea (if set) or any of its children.
* Text has lots of new methods to help style it: Text.fill, Text.align, Text.stroke, etc.
* Text now works happily with font names with spaces in them.
* Text.setShadow applies a drop shadow to the Text being rendered. Control the x, y, color and blur.
* Text.lineSpacing allows you to set additional spacing between each line that is rendered.
* Text.inputEnabled allows you to enable all input events over Text objects: dragging, clicking, etc - anything that works on a Sprite works on Text now too.
* Phaser.Ellipse added. A fully compatible port of the PIXI.Ellipse class, can be used in Sprite/Image hitArea tests.
* Phaser.Polygon added. A fully compatible port of the PIXI.Polygon class, can be used in Sprite/Image hitArea tests.
* InputHandler.pixelPerfectOver - performs a pixel perfect check to see if any pointer is over the current object (warning: very expensive!)
* InputHandler.pixelPerfectClick - performs a pixel perfect check but only when the pointer touches/clicks on the current object.
* TileSprite can now use a frame from a texture atlas or a sprite sheet.
* TileSprites can now be animated. See new example :)
* TileSprites have a new method: autoScroll(x, y) which sets an automatic scroll running (until stopped with TileSprite.stopScroll).
* BitmapText now uses the new XML parser which should work under CocoonJS without clashes.
* BitmapText signature changed so you can support fonts with spaces in their names.
* Loader.bitmapFont now has 2 extra parameters: xSpacing and ySpacing. These allow you to add extra spacing to each letter or line of the font.
* Added the new BitmapFont class. This is for rendering retro style fixed-width bitmap fonts into an Image object. It's a texture you can apply to a Sprite/Image.
* Added Cache.updateFrameData which is really useful for swapping FrameData blocks in the cache.
* Loader.physics now lets you load Lime + Corona JSON Physics data, which can be used with Body.loadPolygon and Body.loadData.
* Cache.addPhysicsData and Cache.getPhysicsData allow you to store parsed JSON physics data in the cache, for sharing between Bodies.
* fixedToCamera now works across all display objects. When enabled it will fix at its current x/y coordinate, but can be changed via cameraOffset.
* fixedToCamrea now works for Groups as well :) You can fix a Group to the camera and it will influence its children.
* Tilemap.createCollisionObjects will parse Tiled data for objectgroups and convert polyline instances into physics objects you can collide with in the world.
* Loader can now load JSON files specifically (game.load.json) and they are parsed and stored in the Game.Cache. Retrieve with game.cache.getJSON(key).


Updates:

* Massive thanks to clark-stevenson for doing an amazing job update the TypeScript definitions file.
* Debug.renderRectangle has a new parameter: filled. If true it renders as with fillRect, if false strokeRect.
* Phaser.AnimationParser now sets the trimmed data directly for Pixi Texture frames. Tested across JSON Hash, JSON Data, Sprite Sheet and XML.
* Game.add.renderTexture now has the addToCache parameter. If set the texture will be stored in Game.Cache and can be retrieved with Cache.getTexture(key).
* Game.add.bitmapData now has the addToCache parameter. If set the texture will be stored in Game.Cache and can be retrieved with Cache.getBitmapData(key).
* The InputManager now sets the canvas style cursor to 'inherit' instead of 'default'.
* World.reset now calls Camera.reset which sends the camera back to 0,0 and un-follows any object it may have been tracking.
* Added hostname: '*' to the grunt-connect in Gruntfile.js (fixes #426)
* Device, Canvas and GamePad classes all updated for better CocoonJS support (thanks Videlais)
* BitmapData.alphaMask will draw the given image onto a BitmapData using an image as an alpha mask.
* The new GameObjectCreator (which you access via game.make or State.make) lets you easily create an object but NOT add it to the display list.
* TilemapParser will now throw a warning if the tileset image isn't the right size for the tile dimensions.
* We now force IE11 into Canvas mode to avoid a Pixi bug with pre-multiplied alpha. Will remove once that is fixed, sorry, but it's better than no game at all, right? :(
* Loader.setPreloadSprite() will now set sprite.visible = true once the crop has been applied. Should help avoid issues (#430) on super-slow connections.


Bug Fixes:

* Explicitly paused Timer continues if you un-focus and focus the browser window (thanks georgiee)
* Added TimerEvent.pendingDelete and checks in Timer.update, so that removing an event in a callback no longer throws an exception (thanks georgiee)
* Fixed TypeScript defs on lines 1741-1748 (thanks wombatbuddy)
* Previously if you used Sprite.crop() it would crop all Sprites that shared the same base image. It now takes a local copy of the texture data and crops just that.
* Tilemap had the wrong @method signatures so most were missing from the docs.
* Fixed bug where changing State would cause the camera to not reset if it was following an object.
* Tile had 2 properties (callback and callbackContext) that were never assigned, updated to use the proper names (thanks ratkingsimon)
* Fixed an error that would occur if you used InputHandler.onInputUp and the Sprite destroys itself during the event.
* IE11 didn't populate the Device.ieVersion value. Now extracted from Trident revision, but still use Device.trident instead for IE11+ checks.
* Fixed bug in Math.angleBetween where it was using the coordinates in the wrong order.
* Previously using a Pixel Perfect check didn't work if the Sprite was rotated or had a non-zero anchor point, now works under all conditions + atlas frames.
* If pixelPerfect Input Sprites overlapped each other the pixel check wasn't taken into consieration in the Pointer move method.
* Updated Input.Mouse to use event.button not event.which, so the const reference from input.mouse.button is correct (thanks grimor)
* Text that was fixedToCamera would 'jitter' if the world scrolled. Now works as expected across all fixed objects.



TO DO:

* If you change the frame name of a pixel precise input Sprite, it will fail all clicks on it after the frame change.



You can view the Change Log for all previous versions at https://github.com/photonstorm/phaser/changelog.md


How to Build
------------

We provide a fully compiled version of Phaser in the `build` directory, in both plain and minified formats.

We also provide a Grunt script that will build Phaser from source along with all the examples.

Run `grunt` in the phaser folder for a list of command-line options.


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

`http://cdnjs.cloudflare.com/ajax/libs/phaser/1.1.3/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/1.1.3/phaser.min.js`


Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/) using the provided TypeScript definitions file. We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

Phaser is 321 KB minified and 72 KB gzipped.


Learn By Example
----------------

Phaser comes with an ever growing suite of Examples. Personally I feel that we learn better by looking at small refined code examples, so we created over 200 of them and create new ones to test every new feature added. Inside the `examples` folder you'll find the current set. If you write a particularly good example then please send it to us.

The examples need to be run through a local web server (in order to avoid file access permission errors from your browser). You can use your own web server, or start the included web server using grunt.

Using a locally installed web server browse to the examples folder:

    examples/index.html

Alternatively in order to start the included web server, after you've cloned the repo, run `npm install` to install all dependencies, then `grunt connect` to start a local server. After running this command you should be able to access your local webserver at `http://127.0.0.1:8000`. Then browse to the examples folder: `http://127.0.0.1:8000/examples/index.html`

There is a new 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation.

You can also browse all [Phaser Examples](http://gametest.mobi/phaser/) online.


Features
--------

**WebGL &amp; Canvas**

Phaser uses both a Canvas and WebGL renderer internally and can automatically swap between them based on browser support. This allows for lightning fast rendering across Desktop and Mobile. When running under WebGL Phaser now supports shaders, allowing for some incredible in-game effects. Phaser uses and contributes towards the excellent Pixi.js library for rendering.

**Preloader**

We've made the loading of assets as simple as one line of code. Images, Sounds, Sprite Sheets, Tilemaps, JSON data, XML and JavaScrtip files - all parsed and handled automatically, ready for use in game and stored in a global Cache for Sprites to share.

**Physics**

Phaser ships with our Arcade Physics system. A SAT based collision and physics library perfect for low-powered devices and fast collision response. Control velocity, acceleration, bounce, damping and full collision and separation control. As of version 1.1.4 we now support rectangles, circles and polygon collision with full rotation.

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

Although Phaser 1.0 is a brand new release it is born from years of experience building some of the biggest mobile HTML5 games out there. We're not saying it is 100% bug free, but we use it for our client work every day, so issues get resolved <em>fast</em> and we stay on-top of the changing browser landscape.

![FruitParty](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_fruit_particles-640x480.png)


Road Map
--------

Here is what's on our road map for the coming months:

Version 1.3 ("Tarabon")

* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Dedicated CocoonJS packaging features (screencanvas, etc)
* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Support for parallel asset loading.
* Fixed width bitmap font support, plus enhanced Bitmap font rendering.

Version 2.0 ("Aes Sedai")

* Integrate p2.js physics system completely.
* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Although it does what it does well, it could do with taking more advantage of Web Audio - echo effects, positional sound, etc.

Beyond version 2.0

* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Look at HiDPI Canvas settings.
* Multiple Camera support.


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
