![Phaser 2.0](http://www.phaser.io/images/phaser2-github.png)

# Phaser 2.0.4

Phaser is a fast, free and fun open source game framework for making desktop and mobile browser HTML5 games. It uses [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) internally for fast 2D Canvas and WebGL rendering.

Version: 2.0.4 "Mos Shirare" - Released: 29th April 2014

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

* View the [Official Website](http://phaser.io)
* Follow on [Twitter](https://twitter.com/photonstorm)
* Join the [Forum](http://www.html5gamedevs.com/forum/14-phaser/)
* Source code for 300+ [Phaser Examples](https://github.com/photonstorm/phaser-examples) or [browse them online](http://examples.phaser.io)
* Read the [documentation online](http://docs.phaser.io)
* Join our [#phaserio IRC channel](http://www.html5gamedevs.com/topic/4470-official-phaserio-irc-channel-phaserio-on-freenode/) on freenode
* Subscribe to the [Phaser Newsletter](https://confirmsubscription.com/h/r/369DE48E3E86AF1E) and we'll email you when new versions are released.

![div](http://phaser.io/images/div4.png)

## Welcome to Phaser and What's new in 2.0.4?

We've had the vast majority of this version ready for a few days now, but held off releasing due to Ludum Dare 48. Ludum Dare contests are always peak times for Phaser, we see an influx of new devs downloading for the first time. So it's not the best day to release a new version :) Now that LD48 has finished we present Phaser 2.0.4. This is the latest version in our bi-weekly sprint release schedule, and the change log is (which you can see in full below) is significant to say the least.

We've made some deep internal changes to how game pause and resume is handled, which means Phaser.Timers now behave themselves properly. Again with this version we've updated to the latet Pixi and P2 releases, bringing new features and enhancements with them. In terms of new features we've overhauled the Color, Point and BitmapData classes, with significant new features for each of them. From HSL palette shifting and color extraction, to Point dot products to proper endianess handling in Color, the new features are powerful additions to the library. We've also marked a bunch of methods as deprecated and will remove them in Phaser 2.1. Most have fully working replacements and you'll see them flagged as such in the API docs.

Thanks to traffic from Ludume Dare and some [great new sites](http://gamemechanicexplorer.com), we've seen Phaser sky rocket on github; now clearing 4325 github stars and 1175 forks. In most cases issues are being resolved fast and we're closing over 97% of all those reported, which we're extremely proud about.

For the 2.0.5 release we're going to be looking carefully at CocoonJS support, there are some known issues with it currently and we want to ensure it works as flawlessly as possible. After this we'll start planning for 2.1.

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

Version 2.0.4 - "Mos Shirare" - 29th April 2014

### Updates

* Updated to [Pixi.js 1.5.3](https://github.com/GoodBoyDigital/pixi.js/releases/tag/v1.5.3)
* Updated to latest [p2.js](https://github.com/schteppe/p2.js/commits/master) - all commits from 0.5.0 to Apr 27th 2014.
* TypeScript definitions fixes and updates (thanks @clark-stevenson @metrofun @killalau)
* Timer has removed all use of local temporary vars in the core update loop.
* The Input.reset `hard` reset parameter is now passed down to the Keyboard and Key reset methods.
* AnimationManager.destroy now iterates through child animations calling destroy on all of them, avoiding a memory leak (thanks stauzs)
* AnimationManager.play will now call Animation.stop on the current animation before switching to the new one (thanks @nihakue, #713)
* ArcadePhysics.Body.phase is checked in postUpdate to prevent it from being called multiple times in a single frame.
* Group.setProperty will now check if the property exists before setting it, this applies to Group.setAll and anything else using setProperty internally.
* QuadTree.retrieve now checks to see if the given Sprite has a body before carrying on.
* ArcadePhysics.collideSpriteVsGroup checks if Sprite has a body before carrying on, now safely skips sub-groups or other non-Sprite group children. 
* Group.remove now checks the child to see if it's a member of the root Group before removing it, otherwise Pixi throws an Error.
* The Emitter no longer checks if minParticleScale = maxParticleScale for the scale check, allowing for fixed scale particles again.
* The PIXI.AbstractFilter is now included in the Phaser Pixi build by default, allowing for easier use of external Pixi Filters.
* All Game Objects have a new property: destroyPhase (boolean) which is true if the object is in the process of being destroyed, otherwise false.
* If Tween.yoyo was true but repeat was 0 then it wouldn't yoyo. Now if yoyo is set, but not repeat, the repeat count gets set to 1 (thanks @hilts-vaughan, fix #744)
* RandomDataGenerator.integerInRange uses a new method of rounding the value to an integer to avoid distribution probability issues (thanks PhaserFan)
* Updated the Device little / big endianess check.
* Time has been updated so that physicsElapsed can never be zero (falls back to 1/60), also fixes p2 elapsed time bug (thanks @georgiee, fix #758)
* Input and Pointer now use the new ArrayList instead of a LinkedList, which resolve list item removable during callback issues.
* Input.reset no longer resets every interactive item it knows of, because they are removed during the destroy phase and can now persist between States if needed.
* Blank Tilemaps no longer create `null` tiles, but instead create Tile objects with an index of -1 which can be replaced and updated like any other tile.
* Tilemap.addTilesetImage will now raise a console.warn if you specify an invalid tileset key and not create the tileset rather than pick the default set.
* Math.smoothstep and Math.smootherstep have been updated to work regardless if a is > or < b (thanks @gre, fix #772)
* Text.updateText now sets the lineCap to `round` to avoid occassional font glitching issues in Chrome.

### New Features

* New Phaser Project Template specifically for requireJS in the `resources/Project Templates` folder (many thanks @ashatch)
* Loader now has an onFileStart event you can listen for (thanks @codevinsky, #705)
* Group.classType allows you to change the type of object that Group.create or createMultiple makes from Phaser.Sprite to your own custom class.
* Timer.clearPendingEvents will purge any events marked for deletion, this is run automatically at the start of the update loop.
* Device.crosswalk detects if your game is running under Intels Crosswalk XDK.
* Keyboard.reset has a new `hard` parameter which controls the severity of the reset. A soft reset doesn't remove any callbacks or event listeners.
* Key.reset has a new `hard` parameter which controls the severity of the reset. A soft reset doesn't remove any callbacks or event listeners.
* InputManager.resetLocked - If the Input Manager has been reset locked then all calls made to InputManager.reset, such as from a State change, are ignored.
* Group.resetCursor will reset the Group cursor back to the start of the group, or to the given index value.
* World.wrap will take a game object and if its x/y coordinates fall outside of the world bounds it will be repositioned on the opposite side, for a wrap-around effect.
* Device.support32bit is a new boolean that sets if the context supports 32bit pixel manipulation using array buffer views or not.
* P2.World now has its own pause and resume methods, so you can pause the physics simulation independent of your game (thanks @georgiee)
* Phaser.ArrayList is a new iterative object, similar in principal to a set data structure, but operating on a single array without modifying the object structure.
* Add scaleMode params to FilterTexture and RenderTexture (pixi.js update by @giraluna)
* Your State can now have a pauseUpdate method, which is called constantly when the game is paused.
* Timer.timeCap is a new setting allowing your Timers to protect against unexpectedly large delta timers (such as raf de-vis or CPU grind).
* Camera.unfollow allows you to easily unfollow a tracked object (thanks @alvinsight, #755)
* Animation.setFrame allows you to set the animation to a specific frame (thanks @adamholdenyall, #706)
* Point.dot - get the dot product of two Point objects.
* Point.cross - get the cross product of two Point objects.
* Point.cross - get the cross product of two Point objects.
* Point.perp - make the Point perpendicular (90 degrees rotation)
* Point.rperp - make the Point perpendicular (-90 degrees rotation)
* Point.normalRightHand - Right-hand normalize (make unit length) a Point.
* Point.angle - Returns the angle between this Point object and another object with public x and y properties.
* Point.angleSq - Returns the angle squared between this Point object and another object with public x and y properties.
* Point.getMagnitudeSq - Calculates the length squared of the Point object.
* Point.project - Project two Points onto another Point.
* Point.projectUnit - Project two Points onto a Point of unit length.
* Point.multiplyAdd - Adds two 2D Points together and multiplies the result by the given scalar.
* Point.negative - Creates a negative Point.
* Point.interpolate - Interpolates the two given Points, based on the `f` value (between 0 and 1) and returns a new Point.
* Color.packPixel packs an rgb component into a single integer.
* Color.unpackPixel unpacks an integer into a color object.
* Color.fromRGBA converts an integer in 0xRRGGBBAA format to a color object.
* Color.toRGBA converts rgba components into a 32-bit integer.
* Color.RGBtoHSL converts an rgb color into hsl (hue, saturation, lightness)
* Color.HSLtoRGB converts hsl values into an rgb color object.
* Color.RGBtoHSV converts an rgb color into hsv (hue, saturation, value)
* Color.HSVtoRGB converts an hsv value into an rgb color object.
* Color.createColor - creates the new light-weight color object used by most Color conversion methods.
* Color.updateColor - updates an existing color object to update the rgba property.
* Color.RGBtoString converts an rgba color into a # or 0x color string.
* Color.HSVColorWheel will return an array with 360 color objects for each segment of an HSV color wheel, you can optionally set the saturation and value amounts.
* Color.HSLColorWheel will return an array with 360 color objects for each segment of an HSL color wheel, you can optionally set the saturation and lightness amounts.
* BitmapData.cls clears the current context.
* BitmapData.fill fills the context with the given color.
* BitmapData.processPixelRGB lets you perform a custom callback on every pixel in the BitmapData by passing the pixels color object to your callback.
* BitmapData.processPixel lets you perform a custom callback on every pixel in the BitmapData by passing the pixels color value to your callback.
* BitmapData.replaceRGB will scan the bitmap for a specific color and replace it with the new given one.
* BitmapData.setHSL sets the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
* BitmapData.shiftHSL shifts the hue, saturation and lightness values on every pixel in the given region, or the whole BitmapData if no region was specified.
* BitmapData.extract scans this BitmapData for all pixels matching the given r,g,b values and then draws them into the given destination BitmapData.
* BitmapData.circle draws a filled Circle to the BitmapData at the given x, y coordinates and radius in size.

### Bug Fixes

* The main Timer loop could incorrectly remove a TimerEvent if a new one was added specifically during an event callback (thanks @garyyeap, fix #710)
* Fixed the use of the destroy parameter in Group.removeAll and related functions (thanks @AnderbergE, fix #717)
* P2.World.convertTilemap now correctly checks the collides parameter of the tiles as it converts them.
* Animation.destroy didn't correctly clear the onStart, onLoop and onComplete signals.
* StateManager.restart incorrectly skipped the first additional parameter after clearCache (thanks @mariusbrn, fix #722)
* Line.angle and Math.angleBetween used Math.atan2 arguments in the wrong order (thanks @jotson, fix #724)
* Group.destroy checks parent before removing (thanks @clark-stevenson, fix #733)
* Fixed typo in P2.World.setMaterial (thanks @OpherV, fix #739)
* InputHandler._setHandCursor private var wasn't properly set, meaning the hand cursor could sometimes remain (during destroy sequence for example)
* Destroying an object with an input handler during its onDown event would throw Signals dispatch errors (thanks @jflowers45, fix #746)
* Circle.distance used an incorrect Math call if you wanted a rounded distance value (thanks @OpherV, fix #745)
* Point.distance used an incorrect Math call if you wanted a rounded distance value (thanks @OpherV, fix #745)
* P2.Body.loadPolygon has been updated to correct center of mass issues (thanks @georgiee, fix #749)
* Game checks if window.console exists before using it (should fix IE9 issues when dev tools are closed), however it is still used deeper in Pixi.
* Masks now work when used in RenderTextures / CacheAsBitmap and Filters (pixi.js update)
* Stroked text sometimes got clipped (pixi.js update)
* Polygon.contains now works for coordinates to the left of the polygon (thanks @vilcans, fix #766)
* Game pause/resume could incorrectly increment paused Timers (thanks @georgiee, fix #759)
* Animations resuming from a pause no longer skip frames (thanks @merixstudio, fix #730)
* Tilemap.fill would throw an error if called on a blank tilemap full of null values (thanks @DrHackenstein, fix #761)
* LoaderParser.bitmapFont updated so xml parsing works properly on IE9 (thanks @georgiee)
* Sounds that had been paused via game code would un-mute if the game paused and resumed.
* CSV Tilemap tiles would incorrectly set the Tile layer reference, causing collision to fail (thanks @Chapelin, fix #692)


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

You can [![clone the Phaser repo in Koding](http://learn.koding.com/btn/clone_d.png)][koding] and then start editing and previewing code right away using their web based VM development system.

![div](http://phaser.io/images/div5.png)

## Bower

If you use bowser you can install phaser with:

`bower install phaser`

Nice and easy :)

![Tanks](http://www.photonstorm.com/wp-content/uploads/2013/10/phaser_tanks-640x480.png)

![div](http://phaser.io/images/div6.png)

## CDNJS

Phaser is now available on [CDNJS](http://cdnjs.com). You can include the following in your html:

`http://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.4/phaser.min.js`

Or if you prefer you can leave the protocol off, so it works via http and https:

`//cdnjs.cloudflare.com/ajax/libs/phaser/2.0.4/phaser.min.js`

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

Ever since we started Phaser we've been growing and expanding our extensive set of Examples. Currently over 270 of them!

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

Beyond version 2.0 here are some of the features planned for the future:

### Version 2.1 ("Shienar")

* Enhance the State Management, so you can perform non-destructive State swaps and persistence.
* A more advanced Particle system, one that can render to a single canvas (rather than spawn hundreds of Sprites), more advanced effects, etc.
* Ability to control DOM elements from the core game and layer them into the game.
* Touch Gestures.
* Support for parallel asset loading.

### Version 2.2 ("Tarabon")

* Comprehensive testing across Firefox OS devices, CocoonJS and Ejecta.
* Integration with third party services like Google Play Game Services and Amazon JS SDK.
* Flash CC HTML5 export integration.
* Massively enhance the audio side of Phaser. Take more advantage of Web Audio: echo effects, positional sound, etc.

### Beyond version 2.2

* Test out packaging with Node-webkit.
* Game parameters stored in Google Docs.
* Look at HiDPI Canvas settings.
* Multiple Camera support.
* DragonBones support.
* Cache to localStorage using If-Modified-Since. [See github request](https://github.com/photonstorm/phaser/issues/495)
* Allow for complex assets like Bitmap Fonts to be stored within a texture atlas.
* Look at XDomainRequest for IE9 CORs issues.

![div](http://phaser.io/images/div1.png)

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
[koding]: https://koding.com/Teamwork?import=https://github.com/photonstorm/phaser/archive/master.zip&c=git1

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)
