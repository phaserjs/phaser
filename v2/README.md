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

> 26th August 2016

Summer is nearly over, the nights are drawing in, and the Phaser releases continue. After enjoying a short break in August, we're back with Phaser 2.6.2. This is mostly a maintenance release, with a lot of attention paid to clearing bugs, and improving features. There's also some significant updates to our fork of Pixi, setting the scene for the next iteration of Phaser.

Check the [Change Log](#change-log) for the complete list of what's new and updated.

With 2.6.2 out, we'll now turn our attention to merging in all of the renderer updates we've built over the past few months. They are going to form the basis of the Phaser 3.0 release. The bump in version number due to the dramatic internal changes we're making. Follow our progress in the Phaser World newsletter for details. It's going to be an exciting September for sure :)

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

`<script src="//cdn.jsdelivr.net/phaser/2.6.2/phaser.js"></script>`

or the minified version:

`<script src="//cdn.jsdelivr.net/phaser/2.6.2/phaser.min.js"></script>`

[cdnjs.com](https://cdnjs.com/libraries/phaser) also offers a free CDN service. They have all versions of Phaser and even the custom builds:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/phaser/2.6.2/phaser.js"></script>`

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

[Phaser Editor](http://phaser.io/shop/apps/phaser-editor) is a brand new Eclipse based editor that offers lots of built-in tools specifically for Phaser developers. Handy features include Smart code auto-completion, built-in web server, documentation search, asset management, texture atlas creator, audio sprite creator, asset previews and lots more.

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

## Version 2.6.2 - "Kore Springs" - 26th August 2016

### New Features

* Group.getRandomExists will return a random child from the Group that has exists set to true.
* Group.getAll will return all children in the Group, or a section of the Group, with the optional ability to test if the child has a property matching the given value or not.
* Group.iterate has a new `returnType`: `RETURN_ALL`. This allows you to return all children that pass the iteration test in an array.
* The property `checkCollision.none` in the ArcadePhysics.Body class was available, but never used internally. It is now used and checked by the `separate` method. By setting `checkCollision.none = true` you can disable all collision and overlap checks on a Body, but still retain its motion updates (thanks @samme #2661)
* Math.rotateToAngle takes two angles (in radians), and an interpolation value, and returns a new angle, based on the shortest rotational distance between the two.
* Math.getShortestAngle will return the shortest angle between the two given angles. Angles are in the range -180 to 180, which is what `Sprite.angle` uses. So you can happily feed this method two sprite angles, and get the shortest angle back between them (#2494)

### Updates

* TypeScript definitions fixes and updates (thanks @calvindavis @AlvaroBarua)
* Docs typo fixes (thanks @rroylance @Owumaro @boniatillo-com @samme @kjav)
* The InputHandler.flagged property has been removed. It was never used internally, or exposed via the API, so was just overhead.
* The src/system folder has been removed and all files relocated to the src/utils folder. This doesn't change anything from an API point of view, but did change the grunt build scripts slightly.
* BitmapData.shadow and BitmapData.text now both `return this` keeping them in-line with the docs (thanks @greeny #2634)
* Group.align has had its arguments changed so that it's now `(width, height, ...)` instead of `(rows, columns, ...)` (thanks @deargle #2643)
* Group.align now returns `true` if the Group was aligned, or `false` if not.
* The Loader.headers object has a new property `requestedWith`. By default this is set to `false`, but it can be used to set the `X-Requested-With` header to `XMLHttpRequest` (or any other value you need). To enable this do `this.load.headers.requestedWith = 'XMLHttpRequest'` before adding anything to the Loader.
* ScaleManager.hasPhaserSetFullScreen is a new boolean that identifies if the browser is in full screen mode or not, and if Phaser was the one that requested it. As it's possible to enter full screen mode outside of Phaser, and it then gets confused about what bounding parent to use.
* Phaser.Tileset has a new property `lastgid` which is populated automatically by the TilemapParser when importing Tiled map data, or can be set manually if building your own tileset.
* Stage will now check if `document.hidden` is available first, and if it is then never even check for the prefixed versions. This stops warnings like "mozHidden and mozVisibilityState are deprecated" in newer versions of browsers and retain backward compatibility (thanks @leopoldobrines7 #2656)
* As a result of changes in #2573 Graphics objects were calling `updateLocalBounds` on any shape change, which could cause dramatic performances drops in Graphics heavy situations (#2618). Graphics objects now have a new flag `_boundsDirty` which is used to detect if the bounds have been invalidated, i.e. by a Graphics being cleared or drawn to. If this is set to true then `updateLocalBounds` is called once in the `postUpdate` method (thanks @pengchuan #2618)
* Phaser.Image now has the ScaleMinMax component.
* Animations now allow for speeds greater than 0, rather than forcing them to be greater than 1. This allows you to have animation speeds slower than 1 frame per second (thanks @jayrobin #2664)
* Weapon.fire and all related methods (fireAtXY, fireAtPointer, fireAtSprite) now all return the instance of the Phaser.Bullet that was fired, or `null` if nothing was fired. Previously it would return a boolean, but this change allows you to perform additional processing on the Bullet as required (thanks @JTronLabs #2696)
* Sound.loopFull now returns the Sound instance that was looped (thanks @hilts-vaughan #2697)
* ArcadePhysics Body.rotation now reads its initial value from sprite.angle instead of sprite.rotation. The property was immediately replaced with the correct value in Body.preUpdate regardless, but it keeps it consistent (thanks @samme #2708)
* Weapon.fire now tracks rotation properly, when using an offset and tracking a sprite (thanks @bobonthenet #2672)

### Bug Fixes

* A Group with `inputEnableChildren` set would re-start the Input Handler on a Sprite, even if that handler had been disabled previously.
* Weapon.autofire wouldn't fire after the first bullet, or until `fire` was called, neither of which are requirements. If you now set this boolean the Weapon will fire continuously until you toggle it back to false (thanks @alverLopez #2647)
* ArcadePhysics.World.angleBetweenCenters now uses `centerX` and `centerY` properties to check for the angle between, instead of `center.x/y` as that property no longer exists (thanks @leopoldobrines7 #2654)
* The Emitter.makeParticles `collide` argument didn't work, as a result of #2661, but is now properly respected thanks to that change (thanks @samme #2662)
* Sound.play would throw the error "Uncaught DOMException: Failed to execute 'disconnect' on 'AudioNode': the given destination is not connected." in Chrome, if you tried to play an audio marker that didn't exist, while a valid marker was already playing.
* Text bounds would incorrectly displace if the Text resolution was greater than 1 (thanks @valent-novem #2685)
* TilemapParser would calculate widthInPixels and heightInPixels were being read incorrectly from JSON data (capitalisation of properties) (thanks @hexus #2691)
* A tinted Texture in Canvas mode wouldn't be updated properly if it was also cropped, beyond the initial crop. Now a cropped texture will re-tint itself every time the crop is updated, and has changed (thanks @phoenixyjll #2688)
* The Weapon.fireRateVariance property was never taken into account internally. It's now applied to the firing rate correctly (thanks @noseglid #2715)
* Text.updateText now sets `Text.dirty = false`, which stops Text objects from having `updateText` called twice on them after creation.

### Pixi Updates

Please note that Phaser uses a custom build of Pixi and always has done. The following changes have been made to our custom build, not to Pixi in general.

* This version contains significant fixes for `DisplayObject.getBounds` and `DisplayObjectContainer.getBounds`. The methods can now accept an optional argument `targetCoordinateSpace` which makes it much more flexible, allowing you to check the bounds against any target, not just local and global ones. If the `targetCoordinateSpace` is a valid DisplayObject:

    - If it's a parent of the caller at some level it will return the bounds
    relative to it.
    - if it's not parenting the caller at all, it will get the global bounds of
    it, and the caller and will calculate the x and y bounds of the caller
    relative to the targetCoordinateSpace DisplayObject.

As a result this also fixes how empty Groups are treated when they have no other children except Groups. So now calculations are correct.
* DisplayObjectContainer.contains(child) is a new method which determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance itself. This method is used in the new getBounds function.
* Corrected DisplayObjects default `_bounds` rect from (0, 0, 1, 1) to (0, 0, 0, 0).
* Thanks to @fmflame for his hard work on the above (#2639 #2627)
* The methods `setStageReference` and `removeStageReference` have been removed from all Pixi classes. Objects no longer have `stage` properties, or references to the Stage object. This is because no reference to the Stage is required for any calculations, and Phaser can only have 1 Stage, so adding and removing references to it were superfluous actions.
* The file pixi/utils/Polyk.js has been removed, as it was no longer used with Pixi or Phaser (we replaced it with EarCut a while ago)

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v2.6.2/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v2.6.2/phaser.min.js
[get-zip]: https://github.com/photonstorm/phaser/archive/v2.6.2.zip
[get-tgz]: https://github.com/photonstorm/phaser/archive/v2.6.2.tar.gz
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
