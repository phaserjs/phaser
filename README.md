![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

Phaser 1.1.4-dev
================

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 1.1.4 "Kandor" - Released: -in development-

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

View the [Official Website](http://phaser.io)<br />
Follow on [Twitter](https://twitter.com/photonstorm)<br />
Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)<br />
Try out 200+ [Phaser Examples](http://gametest.mobi/phaser/examples/)<br />
Read the [documentation online](http://docs.phaser.io)

[Subscribe to our new Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E). We'll email you when new versions are released as well as send you our regular Phaser game making magazine.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/photonstorm/phaser/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


Welcome to Phaser
-----------------

Over 1000 github stars! Wow! The latest release of Phaser represents another hard months work by the development team and the community at large. We've had some great contributions and have not let-up the pace of innovating and pushing Phaser forward. As we march towards the end of 2013 we do so knowing that with every passing month more and more developers are using Phaser, and more games are being made. All while it is getting stronger with each release.

Our plan is to end 2013 with one final point release (1.1.4 - "Kandor") and then we'll start planning out the features we wish to see in version 1.2 in the New Year.

As always we offer a heart-felt "Thank you!" to everyone who has encouraged us along the way. To those of you who worked with Phaser during its various incarnations, and who released full games with it despite there being zero API documentation available back then: you are our heroes. It's your kind words and enthusiasm that has kept us going.

Phaser is everything we ever wanted from an HTML5 game framework. It powers all of our client work in build today and remains our single most important product, and we've only just scratched the surface of what we have planned for it.

![MiniCybernoid](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser-cybernoid-640x480.png)


Getting Started Guides
----------------------

We have a new [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

There is a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide on the GameDevTuts+ site which is a great place to learn where to find tutorials, examples and support.

There is also an [un-official Getting Started Guide](http://www.antonoffplus.com/coding-an-html5-game-for-30-minutes-or-an-introduction-to-the-phaser-framework).


Change Log
----------

Version 1.1.4 - "Kandor" - In development

Significant API changes:

* Loader.tileset has been removed as it's no longer required, this was as part of the Tilemap system overhaul.
* TilemapLayers are now created via the Tilemap object itself: map.createLayer(x, y, width, height, tileset, layer, group) and no longer via the GameObjectFactory.
* Tilemap.createFromObjects can now turn a bunch of Tiled objects into Sprites in one single call, and copies across all properties as well.
* Tween.onStartCallback and onCompleteCallback have been removed to avoid confusion. You should use the onStart, onLoop and onComplete events instead.
* Button.forceOut default value has changed from true to false, so Buttons will revert to an Up state (if set) when pressed and released.
* Body.drag has been removed. Please use the new Body.friction value instead (which is a number value, not a Point object)
* The way the collision process callback works has changed significantly and now works as originally intended.
* The World level quadtree is no longer created, they are now built and ripped down each time you collide a Group, this helps collision accuracy.
* Bodies are no longer added to a world quadtree, so have had all of their quadtree properties removed such as skipQuadtree, quadTreeIndex, etc.


New features:

* Phaser.Timer is now feature complete and fully documented. You can create Phaser.TimerEvents on a Timer and lots of new examples have been provided.
* Gamepad API support has been added with lots of new examples (thanks Karl Macklin)
* Phaser.Game constructor can now be passed a single object containing all of your game settings + Stage settings. Useful for advanced configurations.
* The width/height given to Phaser.Game can now be percentages, i.e. "100%" will set the width to the maximum window innerWidth.
* Added a stage.fullScreenScaleMode property to determine scaling when fullscreen (thanks oysterCrusher)
* Added support for margin and spacing around a frame in Loader.spritesheet.
* Added Device.vibration to check if the Vibration API is available or not.
* Added Device.trident and Device.tridentVersion for testing IE11.
* Added Device.silk for detecting a Kindle Fire and updated desktop OS check to exclude Kindles (thanks LuckieLordie)
* TilemapLayers now have debug and debugAlpha values, this turns on the drawing of the collision edges (very handy for debugging, as the name implies!)
* Tweens have a new event: onLoop.
* You can now load any binary file via the Loader: game.load.binary(key, url, callback) - the optional callback allows for post-load processing before entering the Cache.
* Group.set will let you deep set a new propery on a single child of the Group.
* Stage.display property added. A direct reference to the root Pixi Stage object (very useful for RenderTexture manipulation)
* Added Ejecta detection to Device (thanks endel)
* Tweens can now work with relative + and - values. You can do: `tween(sprite).to( { x: '+400' })` and it will add 400 to the current sprite.x value, or '-400'.
* Buttons now properly use their upFrame if set.
* InputHandler now has snapOffsetX and snapOffsetY properties so your snap grid doesn't have to be 0,0 aligned (thanks srmeier)
* Loader.progressFloat contains the actual non-rounded progress value, where-as Loader.progress contains a rounded value. Use progressFloat if you've > 100 files to load.
* Groups can now be added to other Groups as children via group.add() and group.addAt()
* Groups now have an 'alive' property, which can be useful when iterating through child groups with functions like forEachAlive.
* Added a new Project Template "Full Screen Mobile" which you can find in the resources folder. Contains html / css / layout needed for a deployed Phaser game.
* Body.speed - the current speed of the body.
* Body.friction - This now replaces Body.drag and provides for a much smoother friction experience.
* Body.minBounceVelocity - If a Body has bounce set, this threshold controls if it should rebound or not. Use it to stop 'jittering' on bounds/tiles with super-low velocities.
* QuadTree.populate - you can pass it a Group and it'll automatically insert all of the children ready for inspection.
* Input.setMoveCallback allows you to set a callback that will be fired each time the activePointer receives a DOM move event.
* Math.distancePow(x1,y1,x2,y2,power) returns the distance between two coordinates at the given power.
* Physics.collideArray(obj, array) for when you want to collide an object against a number of sprites that aren't all in the same Group.
* Math.reverseAngle - reverses an angle (in radians).
* Math.normalizeAngle - normalises an angle, now in radians only.
* Math.normalizeLatitude - Normalizes a latitude to the [-90,90] range.
* Math.normalizeLongitude - Normalizes a longitude to the [-180,180] range.


New Examples:

* Physics - Bounce by Patrick OReilly.
* Physics - Bounce with gravity by Patrick OReilly.
* Physics - Bounce accelerator (use the keyboard) by Patrick OReilly.
* Physics - Bounce knock (use the keyboard) by Patrick OReilly.
* Physics - Snake (use the keyboard to control the snake like creature) by Patrick OReilly and Richard Davey.
* Physics - Launcher - Angry Birds style ball launcher demo by Patrick OReilly.
* Physics - Launcher Follow - throw the sprite anywhere in the world by Patrick OReilly.
* Physics - Launcher Follow World - an advanced version of the Launcher Follow example by Patrick OReilly.
* Input - Touch Joystick example showing how to use the clay.io virtual game controller (thanks gabehollombe)
* Games - Matching Pairs by Patrick OReilly.
* Games - Simon Says by Patrick OReilly.
* Games - Wabbits by Patrick OReilly.
* Tweens - Example showing how to use the tween events, onStart, onLoop and onComplete.
* Display - Pixi Render Texture. A Phaser conversion of the Pixi.js Render Texture example.
* Input - 5 new examples showing how to use the Gamepad API (thanks Karl Macklin)
* Animation - Group Creation, showing how to create animations across all Group children in one call.
* Particles - Rain by Jens Anders Bakke.
* Particles - Snow by Jens Anders Bakke.
* Groups - Nested Groups - showing how to embed one Group into another Group.
* Time - Lots of new examples showing how to use the updated Phaser.Timer class.


Updates:

* Updated to latest Pixi.js dev branch build (pre 1.4 release)
* When a Sprite is destroyed any active filters are removed at the same time.
* Updated Pixi.js so that removing filters now works correctly without breaking the display list.
* Phaser.Canvas.create updated so it can be given an ID as the 3rd parameter (can also be set via new Game configuration object).
* Updated display/fullscreen example to reflect new full screen change.
* Loads of updates to the TypeScript definitions files - games fully compile now and lots of missing classes added :) (thanks Niondir)
* Removed 'null parent' check from Group constructor. Will parent to game.world only if parent value is undefined.
* The tutorials have now been translated into Spanish - thanks feiss :)
* separateY updated to re-implement the 'riding platforms' special condition (thanks cocoademon)
* SoundManager.onSoundDecode now dispatches the key followed by the sound object, also now dispatched by the Cache when doing an auto-decode on load.
* Switch method of using trimmed sprites to support scaling and rotation (thanks cocoademon)
* Most of the GameObjectFactory functions now have a group parameter, so you can do: game.add.sprite(x, y, frame, frameName, group) rather than defaulting to the World group.
* Group.countLiving and countDead used to return -1 if the Group was empty, but now return 0.
* Text can now be fixedToCamera, updated world/fixed to camera example to show this.
* ArcadePhysics.overlap and collide now recognise TileSprites in the collision checks.
* Lots of documentation fixes in the Tween class.
* Tweens fire an onLoop event if they are set to repeat. onComplete is now only fired for the final repeat (or never if the repeat is infinite)
* Pointer used to un-pause a paused game every time it was clicked/touched (this avoided some rogue browser plugins). Now only happens if Stage.disableVisibilityChange is true.
* Input doesn't set the cursor to default if it's already set to none.
* You can now collide a group against itself, to have all children collide, and bodies won't check against themselves (thanks cocoademon)
* RenderTexture.render / renderXY has a new parameter: renderHidden, a boolean which will allow you to render Sprites even if their visible is set to false.
* Added in prototype.constructor definitions to every class (thanks darkoverlordofdata)
* Group.destroy has a new parameter: destroyChildren (boolean) which will optionally call the destroy method of all Group children.
* Button.clearFrames method has been added.
* Device.quirksMode is a boolean that informs you if the page is in strict (false) or quirks (true) mode.
* Canvas.getOffset now runs a strict/quirks check and uses document.documentElement when calculating scrollTop and scrollLeft to avoid Chrome console warnings.
* The Time class now has its own Phaser.Timer which you can access through game.time.events. See the new Timer examples to show how to use them.
* Added StateManager.getCurrentState to return the currently running State object (thanks Niondir)
* Removed the console.log redirect from Utils as it was messing with Firefox.
* Body.acceleration is now much smoother and less eratic at high speeds.
* Removed ArcadePhysics binding to the QuadTree, so it can now be used independantly of the physics system.
* Removed ArcadePhysics.preUpdate and postUpdate as neither are needed any more.
* Body.bottom and Body.right are no longer rounded, so will give accurate sub-pixel values.


Bug Fixes:

* Cache.getImageKeys returned __missing in the array, now excluded.
* Fixed Group.scale so you can now scale a Group directly.
* Removed World.scale as it was preventing Group.scale from working - you can still scale the world, but you'll need to factor in Input changes yourself.
* Moved 'dirty' flag for Tilemap to a per-layer flag. Fixes #242
* Group.length now returns the number of children in the Group regardless of their exists/alive state, or 0 if the Group has no children.
* Switch Camera.setBoundsToWorld to match world.bounds instead of world (thanks cocoademon)
* Fixed an issue where passing null as the Group parent wouldn't set it to game.world as it should have (thanks tito100)
* Fixed Pixi bug (#425) incorrect width property for multi-line BitmapText (thanks jcd-as)
* Tween.onStart is now called when the tween starts AFTER the delay value, if given (thanks stevenbouma)
* Sprites that are fixedToCamera can now be input dragged regardless of world position (thanks RafaelOliveira)
* RenderTexture now displays correctly in Canvas games.
* Canvas.addToDOM is now more robust when applying the overflowHidden style.
* Fixed Pixi.StripShader which should stop the weird TileSprite GPU issues some were reporting (thanks GoodboyDigital)
* Patched desyrel.xml so it doesn't contain any zero width/height characters, as they broke Firefox 25.
* Cache.addSound now implements a locked attribute (thanks haden)
* Sound now checks for CocoonJS during playback to avoid readyState clash (thanks haden)
* Buttons now clear previously set frames correctly if you call setFrames.
* Sounds will now loop correctly if they are paused and resumed (thanks haden)
* InputHandler.checkBoundsRect and checkBoundsSprite now take into account if the Sprite is fixedToCamera or not.
* Removed the frame property from TileSprites as it cannot use them, it tiles the whole image only, not just a section of it.
* Fixed WebGLRenderer updateGraphics bug (thanks theadam)


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

Although Phaser 1.0 is a brand new release it is born from years of experience building some of the biggest mobile HTML5 games out there. We're not saying it is 100% bug free, but we use it for our client work every day, so issues get resolved <em>fast</em> and we stay on-top of the changing browser landscape.

![FruitParty](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_fruit_particles-640x480.png)


Road Map
--------

The 1.1 release was a massive under-taking, but we're really happy with how Phaser is progressing. It's becoming more solid and versatile with each iteration. Here is what's on our road map:

Version 1.2 ("Saldaea")

* Update to Pixi 1.4 - this newly released build has lots of internal changes and new features we want to take advantage of.

Version 1.3 ("Shienar")

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
