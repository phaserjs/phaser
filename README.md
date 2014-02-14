![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

Phaser 1.1.5
============

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 1.1.5 "Saldaea" - Released: 12th February 2014

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

This 1.1.5 release is released to address issues in 1.1.4 that we didn't want you to have to wait too long for.

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


Help Test 1.2
-------------

You'll notice a new [1.2 branch](https://github.com/photonstorm/phaser/tree/1.2) on github. Please help test out 1.2 as much as you can. It features the brand new Pixi 1.5 internally as well as nearly complete integration with p2.js for all physics (dropping ArcadePhysics entirely). New versions are being pushed several times a day, so be sure to update and pull often. Don't expect to just run old games right under it yet, but please do check out the new tests, experiment and poke it around as much as you can - thank you! There is a new Phaser 1.2 section of our forum set-up for talking, and our new [Phaser Labs](http://labs.phaser.io) site as well.


Getting Started Guides
----------------------

We have a new [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

There is a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide on the GameDevTuts+ site which is a great place to learn where to find tutorials, examples and support.

There is also an [un-official Getting Started Guide](http://www.antonoffplus.com/coding-an-html5-game-for-30-minutes-or-an-introduction-to-the-phaser-framework).


Change Log
----------

Version 1.1.5 - "Saldaea" - 12th February 2014

Bug Fixes:

* Explicitly paused Timer continues if you un-focus and focus the browser window (thanks georgiee)
* Added TimerEvent.pendingDelete and checks in Timer.update, so that removing an event in a callback no longer throws an exception (thanks georgiee)
* Fixed TypeScript defs on lines 1741-1748 (thanks wombatbuddy)
* Added SAT.js to TypeScript definition. Now compiles properly.
* Added missing Line.js to the Grunt file.
* Tilemap#paste diffX and diffY equations changed, fixed issue #393 (thanks brejep)
* Added missing return value in Body.hitLeft and hitRight, fixes issue #398 (thanks ram64).
* Fixed easing tween example case. Issue #379 (thanks wesleywerner)
* Removed SAT.js UMD wrapped, fixes issue #361 (thanks luizbills)
* Removed inContact check from Body.separate.
* Fixed Tilemap docs (wrongly pointed to Tileset methods)


See the full Change Log for all the 1.1.4 updates and API changes (as there were a lot of them!)

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

`http://cdnjs.cloudflare.com/ajax/libs/phaser/1.1.4/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/1.1.4/phaser.min.js`


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

You can also browse all [Phaser Examples](http://examples.phaser.io) online.


Features
--------

**WebGL &amp; Canvas**

Phaser uses both a Canvas and WebGL renderer internally and can automatically swap between them based on browser support. This allows for lightning fast rendering across Desktop and Mobile. When running under WebGL Phaser now supports shaders, allowing for some incredible in-game effects. Phaser uses and contributes towards the excellent Pixi.js library for rendering.

**Preloader**

We've made the loading of assets as simple as one line of code. Images, Sounds, Sprite Sheets, Tilemaps, JSON data, XML and JavaScript files - all parsed and handled automatically, ready for use in game and stored in a global Cache for Sprites to share.

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

Version 1.2 ("Shienar")

* Update to Pixi 1.5 - this newly released build has lots of internal changes and new features we want to take advantage of.

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
