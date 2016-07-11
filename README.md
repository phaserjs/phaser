# Phaser - HTML5 Game Framework

<img src="http://phaser.io/images/github/arcade-cab.png" align="right">

Phaser is a fast, free, and fun open source HTML5 game framework. It uses a custom build of [Pixi.js](https://github.com/GoodBoyDigital/pixi.js/) for WebGL and Canvas rendering, and supports desktop and mobile web browsers. Games can be compiled to iOS, Android and native desktop apps via 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/showcases/javascript-game-engines) game frameworks on GitHub.

Thousands of developers worldwide use Phaser. From indies and multi-national digital agencies, to schools and Universities. Each creating their own incredible [games](http://phaser.io/games/).

**Visit:** The [Phaser website](http://phaser.io) and follow on [Twitter](https://twitter.com/photonstorm) (#phaserjs)<br />
**Learn:** [API Docs](http://phaser.io/docs), [Support Forum][forum] and [StackOverflow](http://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 700+ [Examples](http://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** Weekly [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](http://phaser.io/community/slack) and [IRC](http://phaser.io/community/irc)<br />
**Extend:** With [Phaser Plugins](http://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join in the fun!

## Contents

- [What's New?](#whats-new)
- [Support Phaser](#support)
- [Phaser World Newsletter](#newsletter)
- [Download Phaser](#download)
- [Getting Started](#getting-started)
- [Building Phaser](#building-phaser)
- [Games made with Phaser](#games)
- [Requirements](#requirements)
- [Road Map](#road-map)
- [Change Log](#change-log)
- [Lazer](#lazer)
- [Contributing](#contributing)

<a name="whats-new"></a>
![What's New](http://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="http://phaser.io/images/github/news.jpg"></div>

> 11th July 2016

Welcome to Phaser 2.6.1. Our eighth release this year, and another leap forwards since 2.5.0 less than a month ago. This version includes the work undertaken with adding circular body support into Arcade Physics, allowing you to now define physics bodies as being circles instead of rectangles, something that was previously only available in P2 Physics.

Keeping with Arcade Physics for a moment there are now new events you can listen for, including Body.onWorldBounds, Body.onCollide and Body.onOverlap. Phaser.Groups have also been given a shot in the arm. You can now position them, and all of their children, using the new bounds commands such as left, centerX and bottom. They've also gained the alignTo and alignIn methods from the 2.5 release.

In this release we've undertaken a large amount of work refactoring Pixi. You will find lots of Pixi related methods, that were redundant, removed from the build (such as fromImage). All references to the Pixi Texture and Base Texture caches have also been removed, helping close-off some straggling issues, and free-up lingering resources. Please see the Pixi section of the Change Log for complete details. This will not effect you if you're just using Phaser, but if you had any Pixi specific mods or plugins, they may need checking over.

I've also been working hard on the documentation. Tidying-up functions that didn't have parameter descriptions, adding lots more details to areas such as the Game Object events, and starting the huge task of rewriting all of the Pixi documentation into a more friendly and comprehensive format. This is an on-going task, and will be merged into releases from here-on.

Check the [Change Log](#change-log) to see the complete list of what's new in this release.

As always, keep you eyes on the Phaser web site, and subscribe to our weekly [newsletter](#newsletter). You can also follow me on [Twitter](https://twitter.com/photonstorm) or chat to me in the Phaser [Slack](http://phaser.io/community/slack) channel.

There are also now more ways than before to help [support](#support) the development of Phaser. The uptake so far has been fantastic, but this is an on-going mission. Thank you to everyone who supports our development. Who shares our belief in the future of HTML5 gaming, and Phasers role in that.

Happy coding everyone! See you on the forums.

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](http://www.phaser.io/images/spacedancer.gif)

<a name="support"></a>
![Support Phaser](http://phaser.io/images/github/div-support-phaser.png "Support Phaser")

Developing Phaser takes a lot of time, effort, and money. There are monthly running costs; such as the forum and site, which we maintain 100% ad-free. As well as countless hours of development time, community support, and assistance resolving issues. We do this out of our love for Phaser of course, but at the end of the day there are real tangible costs involved.

If you have found Phaser useful in your development life. Or have made income as a result of using it, and are in a position to support us financially, without causing any detriment to yourself, then please do. There are a number of ways:

* A monthly contribution via [Patreon](https://www.patreon.com/photonstorm). 
* A [one-off donation](http://phaser.io/community/donate) via PayPal.
* Purchase any of our [plugins or books](http://phaser.io/shop).
* Companies can sponsor a release of Phaser, or an issue of our newsletter.
 
It all helps cover our running costs, and genuinely contributes towards future development.

If you would like to sponsor Phaser then please [get in touch](mailto:support@phaser.io). We have sponsorship options available on our GitHub repo, web site, and newsletter. All of which receive tens of thousands of eyeballs per day.

![Weekly Newsletter](http://phaser.io/images/github/div-newsletter.png "Weekly Newsletter")
<a name="newsletter"></a>

<div align="center"><img src="http://phaser.io/images/github/phaser-world.png"></div>

Every Friday we publish the [Phaser World](http://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. It also contains our weekly Development Progress updates.

Previous editions can found on our [Back Issues](http://phaser.io/community/backissues) page.

![Download Phaser](http://phaser.io/images/github/div-download.png "Download Phaser")
<a name="download"></a>

Phaser is [hosted on Github][phaser]. There are a number of ways to download it:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip][get-zip] or [tar.gz][get-tgz]
* Download just the build files: [phaser.js][get-js] and [phaser.min.js][get-minjs]
* Checkout with [svn][clone-svn]

### Bower / npm

Install via [bower](http://bower.io)

`bower install phaser`

Install via [npm](https://www.npmjs.com)

`npm install phaser`

Using Browserify? Please [read this](#browserify).

### CDN

[jsDelivr](http://www.jsdelivr.com/#!phaser) is a "super-fast CDN for developers". Include the following in your html:

`<script src="//cdn.jsdelivr.net/phaser/2.6.1/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.6.1/phaser.min.js"></script>`

[cdnjs.com](https://cdnjs.com/libraries/phaser) also offers a free CDN service. They have all versions of Phaser and even the custom builds:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.6.1/phaser.js"></script>`

### Phaser Sandbox

If you'd like to try coding in Phaser right now, with nothing more than your web browser, then head over to the [Phaser Sandbox](http://phaser.io/sandbox). You'll find Quick Start templates, and a user-friendly editor filled with handy code-completion features.

### License

Phaser is released under the [MIT License](http://opensource.org/licenses/MIT).

![Getting Started](http://phaser.io/images/github/div-getting-started.png "Getting Started")
<a name="getting-started"></a>

<img src="http://phaser.io/images/github/learn.jpg" align="right">

Our [Getting Started Guide](http://phaser.io/tutorials/getting-started) will get you up to speed quickly. From setting up a web server, to picking an IDE. After which read our [Making your first Game](http://phaser.io/tutorials/making-your-first-phaser-game) tutorial. Please work through this, no matter what your development experience, to learn how Phaser approaches things.

The single biggest Phaser resource is the [Phaser web site](http://phaser.io/news). You'll find hundreds of tutorials, with new ones added every week. Subscribe to the [Phaser World](http://phaser.io/community/newsletter) newsletter for a weekly links round-up.

Using **TypeScript**? [Game From Scratch](http://www.gamefromscratch.com/page/Adventures-in-Phaser-with-TypeScript-tutorial-series.aspx) has a great series of tutorials covering that.

Prefer **videos**? Zenva have an excellent [Phaser video course](https://academy.zenva.com/product/the-complete-mobile-game-development-course-platinum-edition/?a=13), with hours of great material.

### Source Code Examples

Ever since we started Phaser we've been growing and expanding our extensive set of examples. Currently there are over 700 of them, with the full source code and assets available.

Browse the [Phaser Examples](http://phaser.io/examples), or clone the [examples repo][examples], and eat your heart out!

### Interphase

<div align="center"><img src="http://phaser.io/content/interphase/1/images/editorial/pages.jpg"></div>

[Interphase](http://phaser.io/interphase) is a programming book for Phaser developers of all skill levels.

With 400 pages of content you'll find detailed articles, game development "Making Of" guides and tutorials. All were written using the latest version of Phaser, so you won't be learning any out-dated tricks.

As well as the [book](http://phaser.io/interphase) you get all the source code, graphics and assets to go with it, and lots of extras too.

### Phaser Editor - A complete Phaser Editor

[Phaser Editor](http://phasereditor.boniatillo.com/) is a brand new Eclipse based editor that offers lots of built-in tools specifically for Phaser developers. Handy features include Smart code auto-completion, built-in web server, documentation search, asset management, texture atlas creator, audio sprite creator, asset previews and lots more.

### Game Mechanic Explorer

The [Game Mechanic Explorer](http://gamemechanicexplorer.com) is a great interactive way to learn how to develop specific game mechanics in Phaser. Well worth exploring once you've got your dev environment set-up.

### Mighty Editor - Visual Game Editor

[MightyEditor](http://mightyfingers.com/) is a browser-based visual Phaser game editor. Create your maps with ease, position objects and share them in seconds. It also exports to native Phaser code. Excellent for quickly setting-up levels and scenes.

![Building Phaser](http://phaser.io/images/github/div-building-phaser.png "Building Phaser")
<a name="building-phaser"></a>

Phaser is provided ready compiled in the `build` folder of the repository. There are both plain and minified versions. The plain version is for use during development, and the minified version for production. You can also create your own builds.

### Custom Builds

Phaser includes a grunt based build system, which allows you to strip out  features you may not require, saving hundreds of KB in the process. Don't use any Sound in your game? Then exclude the entire sound system. Don't need Keyboard support? That can be excluded too.

As a result of this work the minimum build size of Phaser is now just 80KB minified and gzipped.

See the [Creating a Custom Phaser Build](http://phaser.io/tutorials/creating-custom-phaser-builds) tutorial for details.

<a name="browserify"></a>
### Browserify / CJS

Phaser was never written to be modular. Everything exists under one single global namespace, and you cannot `require` selected parts of it into your builds. It expects 3 global vars to exist in order to work properly: `Phaser`, `PIXI` and `p2`. The following is one way of doing this:

```
window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')
```

If you build a custom version of Phaser it will split the 3 core libs out into their own files, allowing you to require them as above.

We appreciate this is just a band-aid, and not a proper use of modules, but please understand it was never built to be used this way. You're trying to fit a square peg in a round browserify-shaped hole, so compromises have to be made. Please don't open GitHub issues about it as we've no intention of changing Phaser at this stage of its life. Full module based development is being undertaken in Lazer, the next iteration of the Phaser framework.

### Webpack

Starting from Phaser 2.4.5 we now include a custom build for Webpack.

You need to add `p2` as a dependency.

##### Webpack Config

```
var path = require('path');
var webpack = require('webpack');

var phaserModule = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
    ...
    module: {
        loaders: [
            { test: /pixi.js/, loader: "script" },
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi.js': pixi,
            'p2': p2,
        }
    }
    ...
}
```

##### Main js file

```
require('pixi.js');
require('p2');
require('phaser');
```

### Building from source

Should you wish to build Phaser from source you can take advantage of the provided [Grunt](http://gruntjs.com/) scripts. Ensure you have the required packages by running `npm install` first.

Run `grunt` to perform a default build to the `dist` folder.

![Made With Phaser](http://phaser.io/images/github/div-made-with.png "Made With Phaser")
<a name="games"></a>

Thousands of [games](http://phaser.io/news/category/game) have been made in Phaser. From game jam entries, to titles by some of the largest entertainment brands in the world. Here is a tiny sample. You can find hundreds more on our web site.

[![Game](http://phaser.io/images/github/241/bubble-academy.png)][game10]
[![Game](http://phaser.io/images/github/241/woodventure.png)][game11]
[![Game](http://phaser.io/images/github/241/hopsop.png)][game12]
[![Game](http://phaser.io/images/github/241/banana-mania.png)][game13]
[![Game](http://phaser.io/images/github/241/salazar.png)][game14]
[![Game](http://phaser.io/images/github/241/phaser-shmup.png)][game15]
[![Game](http://phaser.io/images/github/241/trappy-trap.png)][game16]
[![Game](http://phaser.io/images/github/241/runaway-ruins.png)][game17]
[![Game](http://phaser.io/images/github/241/ananias.png)][game18]
[![Game](http://phaser.io/images/github/shot1a.jpg)][game1]
[![Game](http://phaser.io/images/github/shot2a.jpg)][game2]
[![Game](http://phaser.io/images/github/shot3a.jpg)][game3]
[![Game](http://phaser.io/images/github/shot4a.jpg)][game4]
[![Game](http://phaser.io/images/github/shot5b.jpg)][game5]
[![Game](http://phaser.io/images/github/shot6b.jpg)][game6]
[![Game](http://phaser.io/images/github/shot7b.jpg)][game7]
[![Game](http://phaser.io/images/github/shot8.jpg)][game8]
[![Game](http://phaser.io/images/github/shot9.jpg)][game9]

Artwork copyright their respective owners.

We add [new games](http://phaser.io/news/category/game) to the Phaser site weekly, so be sure to send us yours when it's finished!

![Requirements](http://phaser.io/images/github/div-requirements.png "Requirements")
<a name="requirements"></a>

Phaser requires a web browser that supports the [canvas tag](http://caniuse.com/#feat=canvas). This includes Internet Explorer 9+, Firefox, Chrome, Safari and Opera on desktop. iOS Safari, Android Browser and Chrome for Android are supported on mobile.

While Phaser does its best to ensure a consistent cross-platform experience, always be aware of browser and device limitations. This is especially important with memory and GPU limitations on mobile, and legacy browser HTML5 compatibility.

### IE9

If you need to support IE9 / Android 2.x _and_ use P2 physics, then you must use the polyfill in the `resources/IE9 Polyfill` folder. If you don't use P2 (or don't care about IE9!) you can skip this.

### JavaScript and TypeScript

Phaser is developed in ES5 JavaScript. We've made no assumptions about how you like to code, and were careful not to impose a strict structure upon you. You won't find Phaser split into modules, requiring a build step, or making you use a class / inheritance OOP approach. That doesn't mean you can't do so, it just means we don't _force_ you to. It's your choice.

If you code with [TypeScript](http://www.typescriptlang.org/) there are comprehensive definition files in the `typescript` folder. They are for TypeScript 1.4+.

![Road Map](http://phaser.io/images/github/div-roadmap.png "Road Map")
<a name="road-map"></a>

The majority of Phaser development is now taking place within the [Lazer](https://github.com/photonstorm/lazer) project. Lazer is the name for Phaser version 3. The Phaser 2 branch will still be supported, and issues fixed, but most roadmap features have been migrated over.

<a name="lazer"></a>
## Lazer

[Lazer](https://github.com/photonstorm/lazer) is the next generation of the Phaser game framework, and was previously called Phaser 3. Using a completely ES6 base it is renderer agnostic, allowing for DOM, SVG, Canvas and WebGL rendering, across desktop and mobile web browsers.

**Lazer is in active development, but is not yet ready for production use.**

You can read all about the philosophy behind Lazer [here](http://phaser.io/news/2016/01/phaser-in-2015-and-beyond) or join the Google Group [mailing list](https://groups.google.com/d/forum/phaser3-dev) where progress reports are posted. You can also follow progress in the [Phaser World](#newsletter) newsletter.

![Change Log](http://phaser.io/images/github/div-change-log.png "Change Log")
<a name="change-log"></a>

## Version 2.6.1 - "Caemlyn" - 11th July 2016

### Bug Fixes

* Fixed `Uncaught TypeError: Cannot set property 'x' of undefined` in Body.js (thanks @ErwanErwan #2607)

## Version 2.6.0 - "Fal Moran" - 8th July 2016

### New Features

* The Loader has a new property `headers`. This is an object checked by XHR Requests, used to set the Request Header of certain file types. JSON and XML are pre-configured, but you can add to, or modify this property as required (thanks @stoneman1 #2585 #2485)
* Phaser now has support for Typings, the TypeScript Definition Manager. See the `typescript/readme.md` file for installation instructions (thanks @monagames #2576)
* Phaser.Utils.reverseString will take the given string, reverse it, and then return it.
* Phaser.ArrayUtils.rotateRight is the opposite of ArrayUtils.rotate. It takes an array, removes the element from the end of the array, and inserts it at the start, shifting everything else 1 space in the process.
* Phaser.ArrayUtils.rotateLeft is the new name for Phaser.ArrayUtils.rotate. The old method is now deprecated (but still available in this release)
* Phaser.Color.toABGR converts RGBA components to a 32 bit integer in AABBGGRR format.
* ArcadePhysics.Body.setCircle is a new method that allows you to define an Arcade Physics Body as being a circle instead of a rectangle. You can control the radius of the body and the offset from the parent sprite.
* ArcadePhysics.World.separateCircle is a new method that handles all circular body collisions internally within Arcade Physics (thanks @VitaZheltyakov)
* All of the Arcade Physics internal methods, such as `collideGroupVsSelf`, `collideSpriteVsSprite` and so on, have been updated to work with circular body shapes (thanks @VitaZheltyakov)
* ArcadePhysics.Body.onWorldBounds is a new Signal that is dispatched whenever the Body collides with the world bounds, something that was previously difficult to detect. Due to the potentially high volume of signals this could create it is disabled by default. To use this feature set this property to a Phaser.Signal: `sprite.body.onWorldBounds = new Phaser.Signal()` and it will be called when a collision happens, passing five arguments: the sprite on which it occurred, and 4 booleans mapping to up, down, left and right, indicating on which side of the world the collision occurred.
* ArcadePhysics.Body.onCollide is a new Signal that is dispatched whenever the Body collides with another Body. Due to the potentially high volume of signals this could create it is disabled by default. To use this feature set this property to a Phaser.Signal: `sprite.body.onCollide = new Phaser.Signal()` and it will be called when a collision happens, passing two arguments: the sprites which collided.
* ArcadePhysics.Body.onOverlap is a new Signal that is dispatched whenever the Body overlaps with another Body. Due to the potentially high volume of signals this could create it is disabled by default. To use this feature set this property to a Phaser.Signal: `sprite.body.onOverlap = new Phaser.Signal()` and it will be called when an overlap happens, passing two arguments: the sprites which collided.
* Groups now have the following properties, which are getters and setters: `centerX`, `centerY`, `left`, `right`, `top` and `bottom`. These calculate the bounds of the Group, based on all visible children, and then allow you to apply positioning based on that. This means you can, for example, now get the horizontal center of a Group by called `Group.centerX`. These properties are also setters, so you can position the Groups, and it will take scale and rotation into consideration.
* Groups have a new method `alignIn`. It allows you to align the Group within another Game Object, or a Rectangle. You can specify one of 9 positions which are the new position constants such as: `Phaser.TOP_LEFT` or `Phaser.CENTER` (see docs for the complete list). The Groups are positioned based on their child bounds, which takes rotation and scaling into consideration. You can easily place Groups into the corners of the screen, or game world, or align them within other Sprites, using this method.
* Groups have a new method `alignTo`. It allows you to align a Group to the side of another Game Object, or a Rectangle. You can specify one of 11 positions which are the new position constants such as: `Phaser.TOP_LEFT` or `Phaser.LEFT_BOTTOM` (see docs for the complete list). The Groups are positioned based on their child bounds, which takes rotation and scaling into consideration. You can easily align Groups next to other Sprites using this method.

### Updates

* TypeScript definitions fixes and updates (thanks @monagames)
* Docs typo fixes (thanks @drhayes)
* The TilemapParser will now add more data when importing Image object types from Tiled. The extra data available is: image width, image height, and flags to see if the image is flipped either horizontally, vertically or diagonally (thanks @gotenxds #2564 #2554)
* TilemapLayer.renderRegion has had an assignment to the obsolete `tileColor` property removed (thanks @cryptographer #2583)
* Group.getFurthestFrom and Group.getClosestTo has a new optional argument: `callback`. This allows you to apply your own additional filtering to the distance checks, ultimately influencing the selected child (thanks @LoneStranger #2577)
* Text.setText has a new optional argument `immediate` which will re-create the texture immediately upon call, rather than wait for the next render pass to do so (thanks @Scraft #2594)
* Phaser.Utils.pad now calls `toString` on the input given, which means you can pass in common data types, such as numbers, and have them padded and returned as strings.
* The canvas created by Phaser.Debug for use when displaying debug data is no longer stored in the CanvasPool, and is instead a stand-alone canvas, free from ever being re-used by another game object.
* BitmapData has a new, optional, fifth argument: `skipPool`. By default BitmapData objects will ask for the first free canvas found in the CanvasPool, but this behavior can now be customized on a per object basis.
* Phaser.ArrayUtils.rotate is now deprecated. Please use Phaser.ArrayUtils.rotateLeft instead.
* Phaser.Text.fontPropertiesCanvas used to be taken from the CanvasPool, but as it's constantly needed it is now generated directly from the document.
* The default image texture, for when none is supplied, is now available under `Phaser.Cache.DEFAULT`.
* The missing image texture, for when an image has failed to load, is now available under `Phaser.Cache.MISSING`.
* Phaser.Cache.addImage will now check the key given, and if `__default` or `__missing` it will update the new consts `Phaser.Cache.DEFAULT` and `Phaser.Cache.MISSING` accordingly, allowing you to replace the default or missing image textures used by Phaser.
* Phaser.Cache.getPixiTexture has now been removed, as the Pixi Cache isn't used internally anywhere any longer.
* Phaser.Cache.getPixiBaseTexture has now been removed, as the Pixi Cache isn't used internally anywhere any longer.
* The second argument to Phaser.Cache.removeImage has been renamed from `removeFromPixi` to `destroyBaseTexture`, as that is fundamentally what the argument always did.
* AnimationManager.refreshFrame has been removed as it never actually did anything internally.
* Sound.stop will check to see if `gainNode` exists before trying to disconnect from it (#2597)

### Bug Fixes

* Fixed issue in Group.align where the cell wouldn't increase if `rows` was great than -1
* Sound.volume was accidentally repeated twice in the source (thanks @LoneStranger #2569)
* Animation.setFrame wouldn't work correctly if the `useLocalFrameIndex` argument was true, and the frame ID was a number (thanks @uboot #2571)
* Polygon.contains would only work with non-flattened Polygon objects. It now works with both flat and non-flat Polygons.
* Graphics objects enabled for input would fail to do anything if a Phaser Polygon was given to the Graphics object (which it was in nearly all cases), as it wouldn't detect input correctly with flattened polygons (thanks @symbiane #2591)
* P2.World.clear will now clear out the World.walls property, resetting all of the wall bounds to `null`. This allows the walls to be re-created accurately when the P2 World is reset, which happens on a State change or restart (thanks @ewpolly1 @codermua #2574)

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* Removed `_renderWebGL`, `_renderCanvas`, `getLocalBounds` and `getBounds` from PIXI.DisplayObject, as they were only there to pass ancient jshint rules.
* All Pixi.Graphics methods that change the Graphics, i.e. `drawShape`, `lineTo`, `arc`, etc will now all automatically call `Graphics.updateLocalBounds`. This is so that the bounds of the Graphics object are kept updated, allowing you to scale and rotate the Graphics object and still obtain correct dimensions from it (thanks @kelu-smiley #2573)
* PIXI.CanvasPool no longer _just_ checks for `null` parent comparisons. It will check for all falsey parents, helping free-up canvases when the parent objects have been removed elsewhere.
* PIXI.CanvasPool.remove and `removeByCanvas` both now set the removed canvas width and height to 1.
* PIXI.Texture.fromImage, PIXI.BaseTexture.fromImage and PIXI.Sprite.fromImage have all been removed. They should never have actually been used, as they bypass the Phaser Loader, and don't factor in CORs or any other advanced loader settings.
* The PIXI.BaseTexture.imageUrl property has been removed, as it was never actually populated.
* The PIXI.BaseTexture._UID property has been removed, as it was never actually used internally.
* All references to PIXI.BaseTextureCache have been removed (primarily from BaseTexture.destroy and Texture.destroy), as the BaseTextureCache was never used internally by Phaser, or by our custom version of Pixi.
* PIXI.TextureCache has been removed. It was only ever used by the __default and __missing images that Phaser generates on start-up. It wasn't used internally by Phaser anywhere else, and the only references Pixi has to it have all been removed. If you need it in your own game, please refactor it to avoid it, or re-create the object on the PIXI global object.
* Canvases created by `BaseTexture.fromCanvas` no longer have the `_pixiId` property attached to them, as this was never used internally by Phaser or Pixi.
* PIXI.BaseTexture.updateSourceImage is now deprecated. Please use `Sprite.loadTexture` instead.
* The property PIXI.BaseTextureCacheIdGenerator has been removed, as it is no longer used internally by Phaser or Pixi.
* PIXI.Texture.addTextureToCache has been removed. The PIXI Texture Cache was never actually used by Phaser, and was leading to complications internally.
* PIXI.Texture.removeTextureFromCache has been removed. The PIXI Texture Cache was never actually used by Phaser, and was leading to complications internally.
* PIXI.Texture.fromFrame and PIXI.Sprite.fromFrame have been removed. They relied on the PIXI Texture Cache, which was never actually used by Phaser, and was never used internally by Pixi either.
* The property PIXI.TextureCacheIdGenerator has been removed, as it was not used internally.
* The property PIXI.FrameCache has been removed, as it was not used internally.
* PIXI.DisplayObjectContainer calls `updateTransform` at the start of `getBounds` to help avoid the bounds being out of date.

Thanks to Corin Wilkins at Aardman Digital, for lots of the investigation work, leading to the Pixi changes listed above.

For changes in previous releases please see the extensive [Version History](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md).

![Contributing](http://phaser.io/images/github/div-contributing.png "Contributing")
<a name="contributing"></a>

The [Contributors Guide][contribute] contains full details on how to help with Phaser development. The main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample.

- Pull Requests should only be made against the `dev` branch. *Never* against `master`.

- Before submitting a Pull Request run your code through [JSHint](http://www.jshint.com/) using our [config](https://github.com/photonstorm/phaser/blob/master/.jshintrc).

- Before contributing read the [code of conduct](https://github.com/photonstorm/phaser/blob/master/CODE_OF_CONDUCT.md).

Written something cool in Phaser? Please tell us about it in the [forum][forum], or email support@phaser.io

![Created by](http://phaser.io/images/github/div-created-by.png "Created by")

Phaser is a [Photon Storm](http://www.photonstorm.com) production.

![storm](http://www.phaser.io/images/github/photonstorm-x2.png)

Created by [Richard Davey](mailto:rich@photonstorm.com). Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2016 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[![Analytics](https://ga-beacon.appspot.com/UA-44006568-2/phaser/index)](https://github.com/igrigorik/ga-beacon)

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.6.1/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.6.1/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.6.1.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.6.1.tar.gz
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-svn]: https://github.com/photonstorm/phaser
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/14-phaser/

[game1]: https://www.prodigygame.com/Fun-Math-Games/
[game2]: http://www.bbc.co.uk/cbbc/games/deadly-defenders-game
[game3]: http://www.defiantfew.com/
[game4]: http://www.pawpatrol.com/fun.php
[game5]: http://www.fyretale.com/
[game6]: http://www.pocoyo.com/juegos-ninos/caramelos
[game7]: http://www.html5gamedevs.com/topic/11179-phaser-cocoonjs-tap-tap-submarine/
[game8]: http://www.gamepix.com/project/footchinko/
[game9]: http://orcattack.thehobbit.com
[game10]: http://phaser.io/news/2015/06/bubble-academy
[game11]: http://phaser.io/news/2015/07/woodventure
[game12]: http://phaser.io/news/2015/04/hopsop-journey-to-the-top
[game13]: http://phaser.io/news/2015/05/banana-mania
[game14]: http://phaser.io/news/2015/06/salazar-the-alchemist
[game15]: http://phaser.io/news/2015/05/phaser-shmup
[game16]: http://phaser.io/news/2015/05/trappy-trap
[game17]: http://phaser.io/news/2015/04/runaway-ruins
[game18]: http://phaser.io/news/2015/04/ananias
