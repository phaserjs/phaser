![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

# Phaser 2.0.5

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.0.5 "Tanchico" - Released: 20th May 2014

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* Source code for 320+ [Phaser Examples](https://github.com/photonstorm/phaser-examples) or [browse them online](http://examples.phaser.io)
* View the growing list of [Phaser Plugins](https://github.com/photonstorm/phaser-plugins)
* Read the [documentation online](http://docs.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* Subscribe to the [Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and we'll email you when new versions are released.

![div](http://phaser.io/images/div4.png)

## Welcome to Phaser and What's new in 2.0.5?

2.0.5 is our latest point release in our on-going series of updates to the core Phaser framework. As usual the full change log can be found below and you'll notice a raft of updates, new features and bug fixes. Most of the updates are to do with enhancing already existing features to make them more powerful, for example being able to pass a Rectangle object to the QuadTree class now. Or allowing you to control when a tilemap collision recalculation happens. It's small tweaks like this, the vast majority of which are based on community feedback, that help us go from strength to strength.

Another important change is that we've removed all of the Phaser Plugins from this repository. They now live in[their own repository](https://github.com/photonstorm/phaser-plugins) which makes it much easier for us and contributors to manage. You'll find some awesome new plugins in there too, so take a look :)

The number of issues being reported is starting to drop as we squash more and more bugs. To that end we're going to do one last minor point release: 2.0.6 in approximately 2 weeks time. After this we'll wrap-up our current bi-weekly sprint schedule and focus on 2.1. We are aware there are some significant updates incoming on both the Pixi.js and p2.js fronts. GoodBoy Digital have been hard at work putting some incredible new features in Pixi (and restoring some long-lost ones such as Rope and Strip), so as soon as they leave dev we'll merge with Phaser.

We're also very close to releasing the brand new Phaser web site. The current single-page site has done us well for now, but it was only ever meant to be temporary while the full site was built. This is nearly done and we've got some exciting content to share and plenty of room for growth! Be sure to [subscribe to our monthly newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) to be notified as soon as it's out.

Until then happy coding everyone! And we hope to see you on the forums.

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

Version 2.0.5 - "Tanchico" - 20th May 2014

### Updates

* TypeScript definitions fixes and updates (thanks @luispedrofonseca @clark-stevenson @Anahkiasen @adamholdenyall @luispedrofonseca @WillHuxtable)
* Input.getPointerFromIdentifier docs update to reflect where the identifier comes from. Pointer properties now set to give it fixed defaults (thanks @JirkaDellOro, #793)
* Pointer.pointerId added which is set by the DOM event (if present in the browser). Note that browsers can and do recycle pointer IDs.
* Pointer.type and Pointer.exists properties added.
* QuadTree.retrieve can now accept either a Sprite with a physics body or a Phaser.Rectangle as its parameter.
* PluginManager.add now accepts additional parameters and if given a function it will pass them all to the Plugin constructor.
* Tilemap.getTile has a new nonNull parameter. If true it won't return `null` for empty tiles, but will return the actual Tile in that location.
* Math.interpolateAngles and Math.nearestAngleBetween have been removed for the time being. They threw run-time errors previously.
* PIXI.InteractionManager is no longer over-written if the object already exists (thanks @georgiee, #818)
* Key.justPressed and justReleased incorrectly set the delay value to 2500ms. Now defaults to 50ms (thanks @draklaw, fix #797)
* Stage.backgroundColor can now accept short-code hex values: `#222`, `#334`, etc.
* Pointer.withinGame is now accurate based on game scale and updated as the Pointer moves.
* Stage.bounds is now updated if the game canvas offset changes position. Note that it contains the un-scaled game dimensions.

### New Features

* New `force` parameter added to Group.set, setAll, setAllChildren, setProperty which controls if a property is created even if it doesn't exist.
* Group.hasProperty will check a child for the given property and return true if it exists, otherwise false.
* Phaser.Tween.from allows you to set tween properties that will end up where the current object is (thanks @codevinsky, #792)
* Input.getPointerFromId will return a pointer with a matching pointerId value, if any. pointerId is a value set by the browser in the DOM event.
* ArcadePhysics.getObjectsUnderPointer will return all children from a Group that overlap with the given Pointer.
* InputManager.minPriorityID lets you set the minimum priority level an object needs to be to be checked by a Pointer. Useful for UI layer stacking.
* New consts: Phaser.Tilemap.NORTH, SOUTH, EAST and WEST to use with plugins and generally just handy to have.
* BitmapData.processPixelRGB added undefined check (thanks @muclemente, fix #808)
* Phaser.Utils.transposeArray will transpose the given array and return it.
* Phaser.Utils.rotateArray will rotate the given array by 90 or 180 degrees in either direction and return it.
* BitmapData.rect provides a quick way to draw a Rectangle to a BitmapData.
* Button.onOverMouseOnly is a boolean that causes onOver events to fire only if the pointer was a mouse (i.e. stops onOver sounds triggering on touch)
* Tilemap.setCollision has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionBetween has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionByExclusion has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Tilemap.setCollisionByIndex has a new boolean parameter 'recalculate' which lets you control recalculation of collision faces (thanks @max-m, #819)
* Graphics.drawTriangles will draw an array of vertices to the Graphics object (thanks @codevinsky, #795)
* Polygon.area will calculate the area of the Polygon (thanks @codevinsky, #795)
* The Tiled JSON parser will now include Tiled polygons, ellipse and rectangle geometry objects in the resulting map data (thanks @tigermonkey, #791)
* Input.addMoveCallback allows you to bind as many callbacks as you like to the DOM move events (Input.setMoveCallback is now flagged as deprecated)
* Input.deleteMoveCallback will remove a previously set movement event callback.
* Mouse will now check if it's over the game canvas or not and set Pointer.withinGame accordingly.
* Mouse.mouseOutCallback callback added for when the mouse is no longer over the game canvas.
* Mouse.stopOnGameOut boolean controls if Pointer.stop will be called if the mouse leaves the game canvas (defaults to false)
* Tilemap.searchTileIndex allows you to search for the first tile matching the given index, with optional skip and reverse parameters.
* Tilemap.layer is a getter/setter to the current layer object (which can be changed with Tilemap.setLayer)
* Cache.checkKey added - allows you to pass in a Cache type and a key and return a boolean.
* Cache.checkCanvasKey(key) - Check if a Canvas key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTextureKey(key) - Check if a Texture key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkSoundKey(key) - Check if a Sound key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTextKey(key) - Check if a Text key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkPhysicsKey(key) - Check if a Physics key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkTilemapKey(key) - Check if a Tilemap key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBinaryKey(key) - Check if a Binary key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBitmapDataKey(key) - Check if a BitmapData key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkBitmapFontKey(key) - Check if a BitmapFont key exists in the cache (thanks to @delta11 for the proposal)
* Cache.checkJSONKey(key) - Check if a JSON key exists in the cache (thanks to @delta11 for the proposal)
* New movement data added for a Pointer Locked mouse (Pointer.movementX/Y) (thanks @woutercommandeur, #831)
* ScaleManager.bounds is a Rectangle object that holds the exact size of the game canvas, taking DOM offset and game scale into account.

### Plugins

The Plugins have now all moved to [their own repository](https://github.com/photonstorm/phaser-plugins)

### Bug Fixes

* Line.pointOnLine corrected algorithm (thanks @woutercommandeur, fix #784)
* Line segment collision fails under certain cicumstances (thanks @woutercommandeur, fix #760)
* The P2 DistanceConstraint method signature has changed. Updated Phaser so maxForce is now passed as object (fix #788)
* Moved the this._reversed flag outside of the property loop in Tween (as per tween.js issue 115)
* Emitter.makeParticles updated to use Array.isArray() check on the key/frame values, so non-string objects can be passed in (thanks @AnderbergE, fix #786)
* Tilemap.createFromObjects will now force the creation of the property again even if it doesn't exist (regression fix from 2.0.4)
* Phaser.Line.intersectsPoints fixed by properly checking the boundaries (thanks @woutercommandeur, fix #790)
* Group.set and setAll were changed in 2.0.4 to not create the property unless it existed. This broke backwards compatibility, so has been fixed.
* Sound.play now returns the Sound object (thanks @AnderbergE, fix #802)
* Device Silk UA test updated to avoid Safari conflict (thanks @jflowers45, fix #810)
* Sound.stop on Samsung S4 would randomly throw a DOM error. Wrapped the audio stop in a try/catch (thanks FSDaniel)
* RandomDataGenerator.integerInRange would return a non-integer value if you passed in a float.
* Timer class updated so that code-resumed pauses don't mess up the internal _pausedTotal value (thanks @joelrobichaud, fix #814)
* Timer class when paused by code after a game-level pause wouldn't set the codepaused flag (thanks @joelrobichaud, fix #814)
* Stage.backgroundColor now properly accepts hex #RRGGBB and color values 0xRRGGBB again (fix #785)
* Color.getRGB would return incorrect color components if a color value without alpha was given, now works with both 0xRRGGBB and 0xAARRGGBB.
* Color.getWebRGB now works regardless if you give an 0xRRGGBB or 0xAARRGGBB color value.
* If an object was drag enabled with bringToTop, the onDragStop event wouldn't fire until the mouse was next moved (thanks @alpera, fix #813)
* RetroFont.text would throw WebGL errors due to an issue with Pixi.RenderTexture. Fixed in Phaser and submitted code to Pixi.
* RenderTexture.resize would throw WebGL errors due to an issue with Pixi.RenderTexture. Fixed in Phaser and submitted code to Pixi.
* Group.hasProperty fixed to not use hasOwnProperty, but a series of `in` checks (thanks @mgiuffrida for the idea, #829)
* Tilemap.removeTile sets tiles to null but should set to index of -1 (thanks @draklaw, fix #835)

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

![Koding](https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1)

You can [clone the Phaser repo in Koding](http://learn.koding.com/btn/clone_d.png) and then start editing and previewing code right away using their web based VM development system.

![div](http://phaser.io/images/div5.png)

## Bower

If you use bowser you can install phaser with:

`bower install phaser`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

![div](http://phaser.io/images/div6.png)

## CDNJS

Phaser is now available on [CDNJS](http://cdnjs.com). You can include the following in your html:

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.5/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.0.5/phaser.min.js`

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

### Version 2.1 ("Shienar")

* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.

### Version 2.2 ("Tarabon")

* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* Support for parallel asset loading.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.

### Beyond version 2.2

* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Look at HiDPI Canvas settings.
* Multiple Camera support.
* DragonBones support.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.
* Look at XDomainRequest for IE9 CORs issues.

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
