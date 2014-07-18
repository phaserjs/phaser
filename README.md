![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

# Phaser 2.0.7

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.0.7 "Amadicia" - Released: 18th July 2014

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* StackOverflow tag: [phaser-framework](http://stackoverflow.com/questions/tagged/phaser-framework)
* Source code for 320+ [Phaser Examples](https://github.com/photonstorm/phaser-examples) or [browse them online](http://examples.phaser.io)
* View the growing list of [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* Read the [documentation online](http://docs.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* Subscribe to the [Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and we'll email you when new versions are released.
* Please help support our work via [Gittip](https://www.gittip.com/photonstorm/)

![div](http://phaser.io/images/div4.png)

## Welcome to Phaser and What's new in 2.0.7?

We're pleased to announce the release of Phaser 2.0.7. This release comes just a week after 2.0.6 but includes some important fixes. Internally we've updated to Pixi 1.6.1 as lots of the fixes come directly from that upgrade, which in turns restores functionality of things like RenderTextures and Retro Fonts.

There's also a vastly improved SpriteBatch included, which has seen batching speed increases of up to 400% in some cases, which is extremely fun to play with (note: batching is a WebGL feature). Plus we've continued to roll in pull requests from the community and fix issues as quickly as we can. You'll notice a number of input related updates in this release, tidying up the handling of Priority IDs and optimising when pixel perfect checks are run. So if you now use a combination of IDs and pixel perfect checks you can easily speed-up the input loop dramatically.

Again thanks to everyone who helped work on this release. The community for reporting issues and pull requests, the team at Goodboy for responding to major Pixi issues quickly and the team here for rolling out another important upgrade.

Hopefully we can now focus on the 2.1 release and enjoying some of this warm weather outside :) But until then happy coding everyone! And we hope to see you on the forums.

![boogie](http://www.phaser.io/images/spacedancer.gif)

![div](http://phaser.io/images/div1.png)

## Getting Started Guides

We have a [Getting Started Guide](http://phaser.io/getting-started-js.php) which covers all you need to begin developing games with Phaser. From setting up a web server to picking an IDE. If you're new to HTML5 game development, or are coming from another language like AS3, then we recommend starting there.

We wrote a comprehensive [How to Learn Phaser](http://gamedevelopment.tutsplus.com/articles/how-to-learn-the-phaser-html5-game-engine--gamedev-13643) guide for GameDevTuts+  which covers finding tutorials, examples and support.

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

Finally the list of [community authored Phaser Tutorials](http://www.lessmilk.com/phaser-tutorial/) is growing fast!

![Phaser Logo](http://www.photonstorm.com/wp-content/uploads/2013/09/phaser_10_release.jpg)

![div](http://phaser.io/images/div2.png)

## Change Log

Version 2.0.7 - "Amadicia" - 18th July 2014

### Updates

* Updated to Pixi.js 1.6.1 which fixes various issues such as IE9 Float32 defs and RenderTexture resizing and rendering.
* TypeScript definitions fixes and updates (thanks @clark-stevenson and @alvinsight)
* GameObjectFactory.spriteBatch now lets you specify `null` as a parameter for the parent and automatically adds the batch to `game.world` as a result. Also fixed jsdocs issues (@petarov #1000)
* Rebuilt the way items are polled for Pointer events (drag, click, move). Now faster and more efficient, especially when some items in the stack require pixel perfect checks.
* InputHandler.checkPointerOver now has a new `fastTest` parameter that forces a skips a pixel perfect check even if enabled.
* InputHandler.checkPointerDown now has a new `fastTest` parameter that forces a skips a pixel perfect check even if enabled.
* The key is now reported when failing to parse a Sprite Sheet (thanks @lucbloom #1026)
* An editorconfig has been added to the core repo. See http://editorconfig.org (thanks @codevinksy #1027)
* Keyboard.processKeyPress now checks if the Keyboard Input handler is disabled or not before processing the key callbacks.
* Physics.bounds now correctly matches World.bounds on system start (thanks @Dumtard #1028)
* Game._codePaused is now set if the Game is manually paused. See discussion: http://www.html5gamedevs.com/topic/6719-codepaused-property/ (thanks @devinb83 #1017)

### New Features

* ArrayList.setAll - sets the property to the given value on all members of the list.
* Sprite.loadTexture has a new optional `stopAnimation` boolean parameter which will halt the currently running animation (if any) after changing the texture (based on #1029).
* Animation.updateFrameData allows you to load a new FrameData object into an existing animation, even if currently running (based on #1029)
* AnimationManager.loadFrameData will now update all existing Animations to use the newly loaded FrameData (based on #1029)
* Sprite.loadTexture will store the `smoothed` property of the Sprite and re-apply it once the new texture is loaded.
* Group.checkAll allows you to check if the same property exists across all children of the Group and is set to the given value (thanks @codevinsky #1013)
* Group.checkProperty allows you to check if the property exists on the given child of the Group and is set to the value specified (thanks @codevinsky #1013)
* Phaser.Utils.setProperty will set an Objects property regardless of depth (thanks @codevinsky #1013)
* Phaser.Utils.setProperty will set an Objects property regardless of depth (thanks @codevinsky #1013)
* Phaser.Utils.getProperty will get an Objects property regardless of depth (thanks @codevinsky #1013)

### Bug Fixes

* Fixed pixel perfect dragging (thanks @jeroenverfallie #996)
* Debug.preUpdate was still being called in the Game Loop even if enableDebug was set to false (thanks @qdrj #995)
* Phaser.Physics.P2.Body.addPolygon didn't work with a flat array of numbers for the coordinates (thanks @petarov, fix #883)
* Added missing Loader.onPackComplete Signal (thanks @mjeffery #1007)
* QuadTree leveling - Rather than level++ which changes the current nodes level, the subnodes should get the current nodes level+1 (thanks @devinb83 #1018)
* Prevented objects with pixel perfect checks from over-riding other higher priority ID items (#983)
* Group.create was not creating with p2 debug flag (thanks @Dumtard #1014)
* World.wrap when using the bounds of the object wouldn't adjust the bounds correctly, meaning wrapping outside the camera failed (thanks @jackrugile #1020)
* Pixi updated worldTransform from an Array to an Object and Phaser Image, BitmapText, Text and Graphics were still using array access to populate the world property, giving it incorrect results (thanks @alvinsight)
* If you add a Tween to the TweenManager and then immediately stop it, it will still exist in the TweenManager (thanks @gilangcp #1032)
* AnimationManager does not update currentFrame on play until second frame (thanks @Dumtard #1041)
* Animation now guards against _frameData being null (thanks @lucbloom #1033)
* Tilemap.swap now accurately swaps from A to B and from B to A (thanks @noidexe #1034)
* BitmapData.resize fixed to update the crop property too, resolves issues with images getting cut off with BitmapData.load.
* OrientationSprite fix as it's not using PIXI.TextureCache anymore (thanks @DarkDev- #1036)


### Migration Guide

There is an extensive [Migration Guide](https://github.com/photonstorm/phaser/blob/master/resources/Migration%20Guide.md) available for those converting from Phaser 1.x to 2.x. In the guide we detail the API breaking changes and approach to our new physics system.

The full Change Log is at https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md

![div](http://phaser.io/images/div3.png)

## How to Build

We provide a fully compiled version of Phaser in the `build` folder, in both plain and minified formats.

You will also find custom builds in the `build\custom` folder, that split phaser up into components.

We also provide a Grunt script that will build Phaser from source.

Run `grunt` to perform a default build to the `dist` folder.

If you replace Pixi or p2 then run `grunt replace` to patch their UMD strings so they work properly with Phaser and requireJS.

Note: Some of you may not be aware, but the `phaser.min.js` file in the build folder contains all 3 physics systems bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180KB from the minified file size.

![div](http://phaser.io/images/div4.png)

## Koding

You can [clone the Phaser repo in Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1) and then start editing and previewing code right away using their web based VM development system.

![div](http://phaser.io/images/div5.png)

## Bower

If you use bower you can install phaser with:

`bower install phaser-official`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

![div](http://phaser.io/images/div6.png)

## CDNJS

Phaser is now available on [CDNJS](http://cdnjs.com). You can include the following in your html:

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.1.0/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.1.0/phaser.min.js`

![div](http://phaser.io/images/div1.png)

## Requirements

Games created with Phaser require a modern web browser that supports the canvas tag. This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera. It also works on mobile web browsers including stock Android 2.x browser and above and iOS5 Mobile Safari and above. But as always be aware of browser limitations. Not all features of Phaser work on all browsers.

### IE9

If you need to support IE9 or Android 2.x and want to use P2 physics then you must use the polyfill found in the `resources/IE9 Polyfill` folder. If you don't require P2 Physics (or don't care about IE9!) then you don't need this polyfill.

### JavaScript and TypeScript

Phaser is developed in JavaScript. We've made no assumptions about how you like to code your games, and were careful not to impose any form of class / inheritance / structure upon you. So you won't find it split into require modules or pull in 3rd party npm packages for example. That doesn't mean you can't, it just means we don't force you to do so. If you're a requireJS user you'll find a new template in the `resources\Project Templates` folder just for you.

If you code with [TypeScript](https://typescript.codeplex.com/) you'll find a comprehensive definitions file inside the `build` folder and tutorials on getting started.

Phaser is 128 KB gzipped (576 KB minified) when including all 3 physics engines. Without the physics engines its 67 KB gzipped (311 KB minified)

Note: The `phaser.min.js` file in the build folder contains all 3 physics systems bundled in. If you only need Arcade Physics then you can use `build\custom\phaser-arcade-physics.min.js` instead. This will save you 180 KB from the minified file size.

![div](http://phaser.io/images/div3.png)

## Learn By Example

Ever since we started Phaser we've been growing and expanding our extensive set of Examples. Currently over 320 of them!

They used to be bundled in the main Phaser repo, but because they got so large and in order to help with versioning we've moved them to their own repo.

So please checkout https://github.com/photonstorm/phaser-examples

Here you'll find an ever growing suite of Examples. Personally I feel that developers tend to learn better by looking at small refined code examples, so we created hundreds of them, and create new ones to test new features and updates. Inside the `examples` repo you'll find the current set. If you write a particularly good example then please send it to us.

The examples need to be run through a local web server (in order to avoid file access permission errors from your browser). You can use your own web server, or start the included web server using grunt.

Using a locally installed web server browse to the examples folder:

    examples/index.html

Alternatively in order to start the included web server, after you've cloned the repo, run `npm install` to install all dependencies, then `grunt connect` to start a local server. After running this command you should be able to access your local webserver at `http://127.0.0.1:8000`. Then browse to the examples folder: `http://127.0.0.1:8000/examples/index.html`

There is a 'Side View' example viewer as well. This loads all the examples into a left-hand frame for faster navigation. And if you've got php installed into your web server you may want to try `debug.php`, which provides a minimal examples list and debug interface.

You can also browse all [Phaser Examples](http://examples.phaser.io) online.

![div](http://phaser.io/images/div4.png)

## Features

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

![div](http://phaser.io/images/div6.png)

## Road Map

Here are some of the features planned for future releases:

### Version 2.2 ("Tarabon")

* Adjust how Pointers and Interactive Objects work. Allow an IO to be flagged as "on click only", so it doesn't ever get processed during normal Pointer move events (unless being dragged)
* Allow multiple drag items - no longer bind just 1 to a Pointer
* Allow Groups to have Priority IDs too and input disable entire Groups and all children (let it flow down the chain)
* Allow Groups to be InputEnabled? Dragging a Group would be really useful.
* Scene Manager - json scene parser.
* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Optimised global Animation manager to cut down on object creation.
* Swapping to using a RenderTexture for the Tilemaps and implementing Tilemap slicing.
* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Support for parallel asset loading.

### Version 2.3 ("Illian")

* Look carefully at the internal structure of Phaser to avoid method repetition (such as Sprite.crop and Image.crop), investigate using mixins to help reduce overall codebase size.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.

### Beyond version 2.3

* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Look at HiDPI Canvas settings.
* Multiple Camera support.
* DragonBones support.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.

![div](http://phaser.io/images/div1.png)

## MightyEditor - A Visual Phaser Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

## Nadion

[Nadion](https://github.com/jcd-as/nadion) is a set of powerful enhancements for Phaser that makes level building even easier. It includes features such as Trigger, Area, Alarms and Emitters, debug panels, state machines, parallax layer scrolling, 'developer mode' short-cuts and more.

![div](http://phaser.io/images/div2.png)

## Contributing

We now have a full [Contributors Guide][contribute] which goes into the process in more detail, but here are the headlines:

- If you find a bug then please report it on [GitHub Issues][issues] or our [Support Forum][forum].

- If you have a feature request, or have written a game or demo that shows Phaser in use, then please get in touch. We'd love to hear from you! Either post to our [forum][forum] or email: rich@photonstorm.com

- If you issue a Pull Request for Phaser, please only do so againt the `dev` branch and *not* against the `master` branch.

- Before submitting a Pull Request please run your code through [JSHint](http://www.jshint.com/) to check for stylistic or formatting errors. To use JSHint, run `grunt jshint`. This isn't a strict requirement and we are happy to receive Pull Requests that haven't been JSHinted, so don't let it put you off contributing, but do know that we'll reformat your source before going live with it.

[![Build Status](https://travis-ci.org/photonstorm/phaser.png?branch=dev)](https://travis-ci.org/photonstorm/phaser)

![div](http://phaser.io/images/div3.png)

## Bugs?

Please add them to the [Issue Tracker][issues] with as much info as possible, especially source code demonstrating the issue.

![Phaser Tilemap](http://www.photonstorm.com/wp-content/uploads/2013/04/phaser_tilemap_collision.png)

"Being negative is not how we make progress" - Larry Page, Google

![div](http://phaser.io/images/div4.png)

## License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

[issues]: https://github.com/photonstorm/phaser/issues
[contribute]: https://github.com/photonstorm/phaser/blob/master/CONTRIBUTING.md
[phaser]: https://github.com/photonstorm/phaser
[forum]: http://www.html5gamedevs.com/forum/14-phaser/

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)
