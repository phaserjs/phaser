# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://photonstorm.github.io/phaser3-docs/index.html), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 1700+ [Examples](https://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 22nd November 2019

Welcome to the release of Phaser 3.21. This version continues our efforts to keep Phaser 3 updated and enhanced, including lots of great new features, updates and bug fixes. New in 3.21 is the ability for you to directly set the mipmap filter levels the WebGL Renderer uses when creating textures. Any valid WebGL1 filter is allowed and you can set the filter in your game config, or at runtime, as needed. This gives you far more control over the quality of highly scaled textures.

Also new in 3.21 is the ability to soft-wrap BitmapText objects, based on a fixed pixel width. You can also define the wrapping character to be used. Arcade Physics has updates including `overlapCirc` which allows you to return all bodies (both dynamic and static) that intersect the given circular region. The Tilemap system has been updated  to support Group Layers, which were introduced in a recent update of the Tiled Map Editor. These, along with Infinite Tilemaps, are now parsed correctly.

As usual, there's more: Including lots of new Group features, several new Actions for setting scroll factors, the ability to run at a fixed frame rate under setTimeout, a new method that lets you rebind the Web Audio Context (handy for PWA environments), fixes for drag distances and we even fixed a few IE9 (yes, really!) compatibility issues.

As usual, it doesn't end here. There are plenty more fixes, features and updates across the API. You'll find loads more great new features, updates and fixes. So, as usual, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

It was really great to receive a bunch of quality Pull Requests from the Phaser community, many of which found their way into 3.21. The past few versions have seen a lot of significant improvements, from comprehensive Spine support, to full Video playback, it's been an exciting few months. Things traditionally get a little more quiet around this time of the year but we're planning out 3.22 already and continuing to work through the issues list. During this time, we're also working hard on Phaser 4. You can follow development progress of both on the Phaser Patreon.

As usual, I'd like to send a massive thank-you to everyone who supports Phaser on Patreon (and now even GitHub Sponsors, too!) Your continued backing keeps allowing me to work on Phaser full-time and this great new releases is the very real result of that. If you've ever considered becoming a backer, now is the perfect time!

If you'd like to stay abreast of developments then I publish my [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from the core team and the wider community.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord) channels.

Phaser 3 wouldn't have been possible without the fantastic support of the community and Patreon. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](https://www.phaser.io/images/spacedancer.gif)

![Support Phaser](https://phaser.io/images/github/div-support-phaser.png "Support Phaser")

Because Phaser is an open source project, we cannot charge for it in the same way as traditional retail software. What's more, we don't ever want to. After all, it's built on, and was born from, open web standards. It's part of our manifesto that the core framework will always be free, even if you use it commercially, as many of you do.

**You may not realize it, but because of this, we rely 100% on community backing to fund development.**

Those funds allow Phaser to improve, and when it improves, everyone involved benefits. Your support helps secure a constant cycle of updates, fixes, new features and planning for the future.

There are other benefits to [backing Phaser](https://www.patreon.com/join/photonstorm), too:

![Backers Perks](https://phaser.io/images/github/patreon-perk-chart.png)

We use [Patreon](https://www.patreon.com/photonstorm) to manage the backing and you can [support Phaser](https://www.patreon.com/join/photonstorm?) from $1 per month. The amount you pledge is entirely up to you and can be changed as often as you like. Patreon renews monthly, just like Netflix. You can, of course, cancel at any point. Tears will be shed on this end, but that's not your concern.

Extra special thanks to the following companies who's support makes Phaser possible:

* [Cerebral Fix](https://cerebralfix.com)
* [CrossInstall](https://crossinstall.com)
* [Facebook](https://www.facebook.com)
* [Game Distribution](https://gamedistribution.com)
* [GameCommerce](https://www.gamecommerce.com)
* [Mozilla](https://www.mozilla.org)
* [Texture Packer](https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3?utm_source=ad&utm_medium=banner&utm_campaign=phaser-2018-10-16)
* [Twilio](https://www.twilio.com)
* [Y8 Games](https://www.y8.com)
* [Poki](https://developers.poki.com/)

![Sponsors](https://phaser.io/images/github/sponsors-2019-08.png "Awesome  Sponsors")

![Phaser Newsletter](https://phaser.io/images/github/div-newsletter.png "Phaser Newsletter")

<div align="center"><img src="https://phaser.io/images/github/phaser-world.png"></div>

We publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. The newsletter also contains our weekly Development Progress updates which let you know about the new features we're working on.

Over 140 previous editions can be found on our [Back Issues](https://phaser.io/community/backissues) page.

![Download Phaser](https://phaser.io/images/github/div-download.png "Download Phaser")
<a name="download"></a>

Phaser 3 is available via GitHub, npm and CDNs:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the GitHub [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip](https://github.com/photonstorm/phaser/archive/master.zip)
* Download the build files: [phaser.js][get-js] and [phaser.min.js][get-minjs]

### NPM

Install via [npm](https://www.npmjs.com):

```bash
npm install phaser
```

### CDN

[![](https://data.jsdelivr.com/v1/package/gh/photonstorm/phaser/badge)](https://www.jsdelivr.com/package/gh/photonstorm/phaser)

[Phaser is on jsDelivr](https://www.jsdelivr.com/projects/phaser) which is a "super-fast CDN for developers". Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.21.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.21.0/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online. Use the drop-down menus at the top to navigate the namespaces, classes and Game Objects lists.

Or, if you wish to run the docs locally you can checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

The [TypeScript definitions](https://github.com/photonstorm/phaser/tree/master/types) can be found inside the `types` folder. They are also referenced in the types entry in `package.json`.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"typeRoots": [
    "./node_modules/phaser/types"
],
"types": [
    "Phaser"
]
```

We recently published a new [Phaser 3 TypeScript Project Template](https://github.com/photonstorm/phaser3-typescript-project-template), which you can use to get started with if you like.

The TS defs are automatically generated from the JSDoc comments found in the Phaser source code. If you wish to help refine them then you must edit the Phaser JSDoc blocks directly, not the defs file. You can find more details about the parser we built in the `scripts/tsgen` folder.

### Webpack

We use Webpack to build Phaser and we take advantage of its conditional build flag feature to handle renderer swapping. If you wish to use Webpack with Phaser then please use our [Phaser 3 Project Template](https://github.com/photonstorm/phaser3-project-template) as it's already set-up to handle the build conditions Phaser needs. Recent changes to our build steps mean you should now be able to use any other packager, like Parcel, without any config changes.

### License

Phaser is released under the [MIT License](https://opensource.org/licenses/MIT).

![Getting Started](https://phaser.io/images/github/div-getting-started.png "Getting Started")
<a name="getting-started"></a>

<img src="https://phaser.io/images/github/learn.jpg" align="right">

Tutorials and guides on Phaser 3 development are being published every week.

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* The [Complete Phaser 3 Game Development course](https://academy.zenva.com/product/html5-game-phaser-mini-degree/?a=13) contains over 15 hours of videos covering all kinds of important topics.
* Plus, there are [over 700 Phaser tutorials](http://phaser.io/learn) listed on the official website.

Also, please subscribe to the [Phaser World](https://phaser.io/community/newsletter) newsletter for details about new tutorials as they are published.

### Facebook Instant Games

Phaser 3.13 introduced the new [Facebook Instant Games](http://phaser.io/news/2018/10/facebook-instant-games-phaser-tutorial) Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync.

The plugin offers the following features:

* Easy integration with the Phaser Loader so load events update the Facebook progress circle.
* Events for every plugin method, allowing the async calls of the SDK to be correctly inserted into the Phaser game flow. When SDK calls resolve they will surface naturally as a Phaser event and you'll know you can safely act upon them without potentially doing something mid-way through the game step.
* All Plugin methods check if the call is part of the supported APIs available in the SDK, without needing to launch an async request first.
* Instant access to platform, player and locale data.
* Easily load player photos directly into the Texture Manager, ready for use with a Game Object.
* Subscribe to game bots.
* The plugin has a built-in Data Manager which makes dealing with data stored on Facebook seamless. Just create whatever data properties you need and they are automatically synced.
* Support for FB stats, to retrieve, store and increment stats into cloud storage.
* Save Session data with built-in session length validation.
* Easy context switching, to swap between game instances and session data retrieval.
* Easily open a Facebook share, invite, request or game challenge window and populate the text and image content using any image stored in the Texture cache.
* Full Leaderboard support. Retrieve, scan and update leaderboard entries, as well as player matching.
* Support for in-app purchases, with product catalogs, the ability to handle purchases, get past purchases and consume previously unlocked purchases.
* Easily preload a set of interstitial ads, in both banner and video form, then display the ad at any point in your game, with in-built tracking of ads displayed and inventory available.
* Plus other features, such as logging to FB Analytics, creating short cuts, switching games, etc.

We've 3 tutorials related to Facebook Instant Games and Phaser:

* [Getting Started with Facebook Instant Games](http://phaser.io/news/2018/10/facebook-instant-games-phaser-tutorial)
* [Facebook Instant Games Leaderboards Tutorial](http://phaser.io/news/2018/11/facebook-instant-games-leaderboards-tutorial)
* [Displaying Ads in your Instant Games](http://phaser.io/news/2018/12/facebook-instant-games-ads-tutorial)

A special build of Phaser with the Facebook Instant Games Plugin ready-enabled is [available on jsDelivr](https://www.jsdelivr.com/projects/phaser). Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.21.0/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.21.0/dist/phaser-facebook-instant-games.min.js"></script>
```

The build files are in the git repository in the `dist` folder, and you can also include the plugin in custom builds.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets ready available. These examples are now fully integrated into the [Phaser website](https://phaser.io/examples). You can also browse them on [Phaser 3 Labs](https://labs.phaser.io) via a more advanced interface, or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.21.0/dist/phaser-arcade-physics.min.js"></script> 
</head>
<body>

    <script></script>

</body>
</html>
```

This is a standard empty webpage. You'll notice there's a script tag that is pulling in a build of Phaser 3, but otherwise this webpage doesn't do anything yet. Now let's set-up the game config. Paste the following between the `<script></script>` tags:

```javascript
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};
```

`config` is a pretty standard Phaser 3 Game Configuration object. We tell `config` to use the WebGL renderer if it can, set the canvas to a size of 800x600 pixels, enable Arcade Physics, and finally call the `preload` and `create` functions. `preload` and `create` have not been implemented yet, so if you run this JavaScript code, you will have an error. Add the following after `config`:

```javascript
var game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
}
```

`game` is a Phaser Game instance that uses our configuration object `config`. We also add function definitions for `preload` and `create`. The `preload` function helps you easily load assets into your game. In `preload`, we set the Base URL to be the Phaser server and load 3 PNG files.

The `create` function is empty, so it's time to fill it in:

```javascript
function create ()
{
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
}
```

Here we add a sky image into the game and create a Particle Emitter. The `scale` value means that the particles will initially be large and will shrink to nothing as their lifespan progresses.

After creating the `emitter`, we add a logo image called `logo`. Since `logo` is a Physics Image, `logo` is given a physics body by default. We set some properties for `logo`: velocity, bounce (or restitution), and collision with the world bounds. These properties will make our logo bounce around the screen. Finally, we tell the particle emitter to follow the logo - so as the logo moves, the particles will flow from it.

Run it in your browser and you'll see the following:

![Phaser 3 Demo](https://phaser.io/images/github/300/sample1.png "Phaser 3 Demo")

(Got an error? Here's the [full code](https://gist.github.com/photonstorm/46cb8fb4b19fc7717dcad514cdcec064))

This is a tiny example, and there are hundreds more for you to explore, but hopefully it shows how expressive and quick Phaser is to use. With just a few easily readable lines of code, we've got something pretty impressive up on screen!

Subscribe to our newsletter for further tutorials and examples.

![Building Phaser](https://phaser.io/images/github/div-building-phaser.png "Building Phaser")

There are both plain and minified compiled versions of Phaser in the `dist` folder of the repository. The plain version is for use during development, and the minified version is for production use. You can also create your own builds.

### Custom Builds

Phaser 3 is built using Webpack and we take advantage of the Webpack definePlugin feature to allow for conditional building of the Canvas and WebGL renderers and extra plugins. You can custom the build process to only include the features you require. Doing so can cut the main build file size down to just 70KB.

Read our [comprehensive guide](https://phaser.io/phaser3/devlog/127) on creating Custom Builds of Phaser 3 for full details.

### Building from Source

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install` on your source directory.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

## Version 3.21.0 - Senku - 22nd November 2019

### New Features

* You can now specify the mipmap filter level to be used when creating WebGL textures. This can be set in the Game Config using the new `mipmapFilter` property, which is a string, such as 'NEAREST_MIPMAP_NEAREST'. Or, you can set the new `WebGLRenderer.mipmapFilter` property to a valid GLenum. If you set it on the renderer, it will only impact any textures loaded _after_ it has been set, so do so in your Scene `init` method if you want it to be used for textures you're about to load. By changing the mipmap level you can drastically improve the quality when reducing large textures. Please note, due to WebGL1 limitations, this only works on power-of-two sized textures. It also works on textures created from Canvas, Videos or RenderTextures.
* `BitmapText.setMaxWidth` is a new method that allows you to set a maximum width (in pixels) for the BitmapText to take up when rendering. Lines of text longer than `maxWidth` will be wrapped, based on whitespace, to the next line. This allows you to do word-wrapping on BitmapText objects, something only previously possible on Text objects.
* `BitmapText.wordWrapCharCode` is a new property that works with `setMaxWidth` that allows you to control which character code causes a line-wrap. By default it is 32 (a space character).
* `ArcadePhysics.closest` now has an optional `targets` argument. The targets can be any Arcade Physics Game Object, Body or Static Body and it will return only the closet target from those given (thanks @samme)
* `ArcadePhysics.furthest` now has an optional `targets` argument. The targets can be any Arcade Physics Game Object, Body or Static Body and it will return only the furthest target from those given (thanks @samme)
* `Tilemaps.Parsers.Tiled.CreateGroupLayer` is a new function that parses a Tiled group layer and adds in support for Tiled layer groups (introduced in Tiled 1.2.0). Feature #4099 (thanks @Babeetlebum @Olliebrown)
* The Tilemap system now supports infinite Tilemaps from the Tiled map editor (thanks @Olliebrown)
* `Tilemap.getImageLayerNames` is a new method that returns a list of all valid imagelayer names loaded in the Tilemap (thanks @Olliebrown)
* `Tilemap.getObjectLayerNames` is a new method that returns a list of all valid objectgroup names loaded in the Tilemap (thanks @Olliebrown)
* `Tilemap.getTileLayerNames` is a new method that returns a list of all valid tilelayer names loaded in the Tilemap (thanks @Olliebrown)
* When `forceSetTimeOut` is set to `true` in the Game Config, you can now set the target frame rate by setting the `fps.target` value (thanks @pavels)
* Videos can now be loaded from a data URI, allowing for base64 encoded videos to be used in the Loader instead of file based ones. Although, as with all base64 encoded data, we strongly recommend against this (thanks @apasov)
* `Math.MIN_SAFE_INTEGER` is a new math const that stores the minimum safe integer for browsers that don't provide this, such as IE (thanks @jronn)
* `Math.MAX_SAFE_INTEGER` is a new math const that stores the maximum safe integer for browsers that don't provide this, such as IE (thanks @jronn)
* `KeyCodes.NUMPAD_ADD` has been added to the keycodes list (thanks @Martin-Antonov)
* `KeyCodes.NUMPAD_SUBTRACT` has been added to the keycodes list (thanks @Martin-Antonov)
* `Video.removeVideoElementOnDestroy` is a new boolean property that allows you to control if the Video element is removed from the DOM when the Video Game Object is destroyed.
* `Actions.SetScrollFactor` is a new Action that will set the scroll factor on an array of Game Objects, including stepped incremental changes per item (thanks @rexrainbow)
* `Actions.SetScrollFactorX` is a new Action that will set the horizontal scroll factor on an array of Game Objects, including stepped incremental changes per item (thanks @rexrainbow)
* `Actions.SetScrollFactorY` is a new Action that will set the horizontal scroll factor on an array of Game Objects, including stepped incremental changes per item (thanks @rexrainbow)
* The `Group` config object now supports use of the `setScrollFactor` property to set the value on each child of the Group (thanks @rexrainbow)
* `Group.propertyValueSet` is a new method that sets a given property on each Group member (thanks @rexrainbow)
* `Group.propertyValueInc` is a new method that adds an amount to a given property on each Group member (thanks @rexrainbow)
* `Group.setX` is a new method that sets the x coordinate on each Group member (thanks @rexrainbow)
* `Group.setY` is a new method that sets the y coordinate on each Group member (thanks @rexrainbow)
* `Group.setXY` is a new method that sets the x and y coordinate on each Group member (thanks @rexrainbow)
* `Group.incX` is a new method that increments the x coordinate on each Group member (thanks @rexrainbow)
* `Group.incY` is a new method that increments the y coordinate on each Group member (thanks @rexrainbow)
* `Group.incXY` is a new method that increments the x and y coordinate on each Group member (thanks @rexrainbow)
* `Group.shiftPosition` is a new method that iterates the Group members and shifts the position of each to the previous members position (thanks @rexrainbow)
* `Group.angle` is a new method that sets the angle property on each Group member (thanks @rexrainbow)
* `Group.rotate` is a new method that sets the rotation property on each Group member (thanks @rexrainbow)
* `Group.rotateAround` is a new method that rotates each Group member around the given point, by the given angle (thanks @rexrainbow)
* `Group.rotateAroundDistance` is a new method that rotates each Group member around the given point, by the given angle and distance (thanks @rexrainbow)
* `Group.setAlpha` is a new method that sets the alpha property on each Group member (thanks @rexrainbow)
* `Group.setTint` is a new method that sets the tint property on each Group member (thanks @rexrainbow)
* `Group.setOrigin` is a new method that sets the origin property on each Group member (thanks @rexrainbow)
* `Group.scaleX` is a new method that sets the x scale on each Group member (thanks @rexrainbow)
* `Group.scaleY` is a new method that sets the y scale on each Group member (thanks @rexrainbow)
* `Group.scaleXY` is a new method that sets the x and y scale on each Group member (thanks @rexrainbow)
* `Group.setBlendMode` is a new method that sets the blend mode on each Group member (thanks @rexrainbow)
* `Group.setHitArea` is a new method that passes all Group members to the Input Plugin to enable them for input (thanks @rexrainbow)
* `Group.shuffle` is a new method that shuffles all of the Group members in place (thanks @rexrainbow)
* `Group.setVisible` is a new method that sets the visible state on each Group member (thanks @rexrainbow)
* `WebAudioSoundManager.setAudioContext` is a new method that allows you to set the Sound Manager Audio Context to a different context instance. It will also disconnect and re-create the gain nodes on the new context.
* `Group.type` is a new property that holds a string-based name of the Game Object type, as with other GO's (thanks @samme)
* `Arade.Group.type` is a new property that holds a string-based name of the Game Object type, as with other GO's (thanks @samme)
* `Arcade.StaticGroup.type` is a new property that holds a string-based name of the Game Object type, as with other GO's (thanks @samme)
* `ArcadePhysics.overlapCirc` is a new method that allows you to return an array of all Arcade Physics bodies that overlap with the given circular area of the world. It can return either dynamic or static bodies, or a mixture of both (thanks @samme)

### Updates

* `Curve.getPoints` can now take an optional array as the 3rd parameter in which to store the points results (thanks @rexrainbow)
* `Line.arcLengthDivisions` now overrides the default Curve value and is set to 1 to optimize the amount of points returned for a Line curve (thanks @rexrainbow)
* `ArcadePhysics.closest` will now no longer ever return the source in the target results (thanks @samme)
* `ArcadePhysics.furthest` will now no longer ever return the source in the target results (thanks @samme)
* `RequestAnimationFrame.target` is a new property that controls the fps rate (in ms) when setTimeout is used (thanks @pavels)
* The `WebAudioSoundManager.unlock` method will now listen for `keydown` events in order to unlock the Audio Context, as well as touch and pointer events, making it more accessible (thanks Nick Tipping)
* The `requestAnimationFrame` polyfill no longer expects a Browserify environment and uses `window` through-out, it also no longer adds in the same as performance.now does.
* `BitmapText.getTextBounds` didn't reset the dirty flag, causing the `GetBitmapTextSize` function to be called every time the Bitmap Text was rendered. With enough text objects on-screen this could negatively impact performance. The flag is now reset every time the bounds are recalculated.

### Bug Fixes

* The Spine Plugin was not clearing down the resize event listener in WebGL, causing it to still fire even if the Scene was closed. Fix #4808 (thanks @RollinSafary)
* When a game is created with the HEADLESS renderer, `Game.destroy()` had no effect and the game kept on running. Now it destroys itself properly. Fix #4804 (thanks @samme)
* `DOM.GetScreenOrientation` was returning the wrong consts from the Scale Manager (thanks @jcyuan)
* When using `Input.enableDebug` on Game Objects it would not render the debug graphic correctly if the hit area had been offset. It now adjusts the debug correctly for all common hit-area geometry types. Fix #4722 (thanks @HaoboZ @Olliebrown)
* Light2D was not properly working for DynamicTilemapLayers due to a change in the way tilesets were stored, throwing an Uncaught TypeError at runtime. This is now handled correctly. Fix #4167 #4079 (thanks @koljakutschera @blackjack26 @kainage)
* `Input.dragDistanceThreshold` was not working correctly since 3.18, snapping to the wrong drag state unless the time threshold was also set. Fix #4667 (thanks @muliawanw @Olliebrown)
* `Tilemap.convertLayerToStatic` would throw an error when used multiple times, due to an error with the layer index count. Fix #4737 (thanks @Olliebrown @Vegita2)
* The `Tween` class now uses a cached MAX_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `StaggerBuilder` class now uses a cached MAX_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `Rectangle.FromPoints` function now uses a cached MIN_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `Video` class now uses a cached MIN_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* The `Path` class now uses a cached MIN_SAFE_INTEGER making it compatible with Internet Explorer (thanks @jronn)
* `Video.destroy` has been renamed to `Video.preDestroy`, so that it now destroys properly like all other Game Objects. Fix #4821 (thanks @rexrainbow)
* The Video Game Object will now check to see if the browser supports the `HTMLVideoElement` before creating one (thanks @jcyuan)
* The `DOM.GetScreenOrientation` functions would return out-dated consts (thanks @jcyuan)
* When calling `TileSprite.setTexture` or `setFrame`, if the new frame size didn't match the old one, the new fill pattern would become distorted and the `potWidth` and `potHeight` values would be incorrect.
* Timeline callbacks with extra parameters like `onStart`  would miss the first parameter when the callback was invoked. Fix #4810 (thanks @samme)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@samme (for contributing loads of new Arcade Physics examples) @dranitski @jcyuan @RollinSafary @ilyaryabchinski @jsoref @jcyuan @ghclark2 

Please see the complete [Change Log](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md) for previous releases.

![Contributing](https://phaser.io/images/github/div-contributing.png "Contributing")
<a name="contributing"></a>

The [Contributors Guide][contribute] contains full details on how to help with Phaser development. The main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample. Please state which version of Phaser you are using! This is vitally important.

- Before submitting a Pull Request run your code through [ES Lint](https://eslint.org/) using our [config](https://github.com/photonstorm/phaser/blob/master/.eslintrc.json) and respect our [Editor Config](https://github.com/photonstorm/phaser/blob/master/.editorconfig).

- Before contributing read the [code of conduct](https://github.com/photonstorm/phaser/blob/master/.github/CODE_OF_CONDUCT.md).

Written something cool in Phaser? Please tell us about it in the [forum][forum], or email support@phaser.io

![Created by](https://phaser.io/images/github/div-created-by.png "Created by")

Phaser is a [Photon Storm](http://www.photonstorm.com) production.

![storm](https://www.phaser.io/images/github/photonstorm-x2.png)

Created by [Richard Davey](mailto:rich@photonstorm.com). Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2019 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.21.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.21.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
