![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

Phaser 1.1.4-dev
================

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 1.1.4 "Kandor" - Released: -in development-

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

View the [Official Website](http://phaser.io)<br />
Follow on [Twitter](https://twitter.com/photonstorm)<br />
Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)<br />
Try out 170+ [Phaser Examples](http://gametest.mobi/phaser/examples/)

[Subscribe to our new Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E). We'll email you when new versions are released as well as send you our regular Phaser game making magazine.


Welcome to Phaser
-----------------

Over 1000 github stars! Wow! The latest release of Phaser represents another hard months work by the development team and the community at large. We've had some great contributions and have not let-up the pace of innovating and pushing Phaser forward. As we march towards the end of 2013 we do so knowing that with every passing month more and more developers are using Phaser, and more games are being made. All while it is getting stronger with each release.

Our plan is to end 2013 with one final point release (1.1.4 - "Kandor") and then we'll start planning out the features we wish to see in version 1.2 in the New Year.

As always we offer a heart-felt "Thank you!" to everyone who has encouraged us along the way. To those of you who worked with Phaser during its various incarnations, and who released full games with it despite there being zero API documentation available back then: you are our heroes. It's your kind words and enthusiasm that has kept us going.

Phaser is everything we ever wanted from an HTML5 game framework. It powers all of our client work in build today and remains our single most important product, and we've only just scratched the surface of what we have planned for it.

![MiniCybernoid](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser-cybernoid-640x480.png)


Getting Started Guides
----------------------

We have a new [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development (or are coming from another language like AS3) then we recommend starting there.

There is also this great [Un-official Getting Started Guide](http://www.antonoffplus.com/coding-an-html5-game-for-30-minutes-or-an-introduction-to-the-phaser-framework) which is well worth running through as well.


Change Log
----------

Version 1.1.4 - "Kandor" - In development

Significant API changes:

* Loader.tileset has a new method signature. Please use the new format: load.tileset(key, url, tileWidth, tileHeight, tileMargin, tileSpacing, rows, columns, total).


New features:

* Added a stage.fullScreenScaleMode property to determine scaling when fullscreen (thanks oysterCrusher)
* Added support for margin and spacing around a frame in Loader.spritesheet.
* Added Device.vibration to check if the Vibration API is available or not.
* Added Device.trident and Device.tridentVersion for testing IE11.
* Added Device.silk for detecting a Kindle Fire and updated desktop OS check to exclude Kindles (thanks LuckieLordie)


New Examples:

* Physics - Bounce by Patrick OReilly.
* Physics - Bounce with gravity by Patrick OReilly.
* Physics - Bounce accelerator (use the keyboard) by Patrick OReilly.
* Physics - Bounce knock (use the keyboard) by Patrick OReilly.
* Physics - Snake (use the keyboard to control the snake like creature) by Patrick OReilly and Richard Davey.
* Added touch joystick example showing how to use the clay.io virtual game controller (thanks gabehollombe)
* Games - Matching Pairs by Patrick OReilly.

Updates:

* When a Sprite is destroyed any active filters are removed as well.
* Updated Pixi.js so that removing filters now works correctly without breaking the display list.
* Phaser.Canvas.create updated to it can be given an ID as the 3rd parameter.
* Updated display/fullscreen example to reflect new full screen change.
* Loads of updates to the TypeScript definitions files - games fully compile now and lots of missing classes added :)
* Removed 'null parent' check from Group constructor. Will parent to game.world only if parent value is undefined.
* The tutorials have now been translated into Spanish - thanks feiss :)
* separateY updated to re-implement the 'riding platforms' special condition (thanks cocoademon)
* SoundManager.onSoundDecode now dispatches the key followed by the sound object, also now dispatched by the Cache when doing an auto-decode on load.
* Switch method of using trimmed sprites to support scaling and rotation (thanks cocoademon)
* Most of the GameObjectFactory functions now have a group parameter, so you can do: game.add.sprite(x, y, frame, frameName, group) rather than defaulting to the World group.
* Group.countLiving and countDead used to return -1 if the Group was empty, but now return 0.
* Text can now be fixedToCamera, updated world/fixed to camera example to show this.
* ArcadePhysics.overlap and collide now recognise TileSprites in the collision checks.


Bug Fixes:

* Cache.getImageKeys returned __missing in the array, now excluded.
* Fixed Group.scale so you can now scale a Group directly.
* Removed World.scale as it was preventing Group.scale from working - you can still scale the world, but you'll need to factor in Input changes yourself.
* Moved 'dirty' flag for Tilemap to a per-layer flag. Fixes #242
* Group.length now returns the number of children in the Group regardless of their exists/alive state, or 0 if the Group is has no children.
* Switch Camera.setBoundsToWorld to match world.bounds instead of world (thanks cocoademon)
* Fixed an issue where passing null as the Group parent wouldn't set it to game.world as it should have (thanks tito100)
* Fixed Pixi bug (#425) incorrect width property for multi-line BitmapText (thanks jcd-as)


You can view the Change Log for all previous versions at https://github.com/photonstorm/phaser/changelog.md


How to Build
------------

We provide a fully compiled version of Phaser in the `build` directory, in both plain and minified formats.

We also provide a Grunt script that will build Phaser from source along with all the examples.

Run `grunt` in the phaser folder for a list of command-line options.


Bower
-----

If you use bowser you can install phaser with:

`bower install phaser`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)


Requirements
------------

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above.

For developing with Phaser you can use either a plain-vanilla JavaScript approach or [TypeScript](https://typescript.codeplex.com/) using the provided TypeScript definitions file. We made no assumptions about how you like to code your games, and were careful not to impose any form of class/inheritance/structure upon you.

Phaser is 321 KB minified and 72 KB gzipped.


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

Although Phaser 1.0 is a brand new release it is born from years of experience building some of the biggest HTML5 games out there. We're not saying it is 100% bug free, but we use it for our client work every day, so issues get resolved <em>fast</em> and we stay on-top of the changing browser landscape.

![FruitParty](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_fruit_particles-640x480.png)


Road Map
--------

The 1.1 release was a massive under-taking, but we're really happy with how Phaser is progressing. It's becoming more solid and versatile with each iteration. Here is what's on our road map for future versions:

Version 1.1.4 ("Kandor")

* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* More advanced tile map features. Better support for advanced Tiled features. Proper support for DAME tilemaps.

Versions 1.2 ("Saldaea")

* Integration with the p2.js physics system.

Beyond version 1.2

* Dedicated CocoonJS packaging features (screencanvas, etc)
* The ability to pass in a configuration option on Game boot, containing more advanced configuration features.
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
* Add a d-pad example (http://www.html5gamedevs.com/topic/1574-gameinputondown-question/)
* Create more touch input examples (http://www.html5gamedevs.com/topic/1556-mobile-touch-event/)
* Look at HiDPI Canvas settings.


Learn By Example
----------------

Phaser comes with an ever growing suite of Examples. Personally I feel that we learn better by looking at small refined code examples, so we created over 170 of them and create new ones to test every new feature added. Inside the `examples` folder you'll find the current set. If you write a particularly good example then please send it to us.

The examples need to be run through a local web server (in order to avoid file access permission errors from your browser). You can use your own web server, or start the included web server using grunt.

Using a locally installed web server browse to the examples folder:

    examples/index.html

Alternatively in order to start the included web server, after you've cloned the repo, run `npm install` to install all dependencies, then `grunt connect `to start a local server. After running this command you should be able to access your local webserver at `http://127.0.0.1:8000`. Then browse to the examples folder: `http://127.0.0.1:8000/examples/index.html`

There is a new 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation.

You can also browse all [Phaser Examples](http://gametest.mobi/phaser/) online.


Contributing
------------

If you find a bug (highly likely!) then please report it on github or our forum.

If you have a feature request, or have written a small game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you.

You can do this on the Phaser board that is part of the [HTML5 Game Devs forum](http://www.html5gamedevs.com/forum/14-phaser/) or email: rich@photonstorm.com

Before submitting a pull request, please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, first install it by running `npm install jshint`, then test your code by running `jshint src`. This isn't a requirement, we are happy to receive pull requests that haven't been JSHinted, so don't let it put you off contributing - but do know that we'll reformat your source before going live with it.


Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible, especially source code demonstrating the issue.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

"Being negative is not how we make progress" - Larry Page, Google


License
-------

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

[1]: https://github.com/photonstorm/phaser/issues
[phaser]: https://github.com/photonstorm/phaser
