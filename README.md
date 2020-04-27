# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

[![Discord chat](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
[![Twitter Follow](https://img.shields.io/twitter/follow/phaser_?style=for-the-badge)](https://twitter.com/phaser_)
![GitHub All Releases](https://img.shields.io/github/downloads/photonstorm/phaser/total?style=for-the-badge)
![npm](https://img.shields.io/npm/dy/phaser?label=npm&style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://photonstorm.github.io/phaser3-docs/index.html), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 1700+ [Examples](https://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Discord:** Join us on [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 27th April 2020

This brand new release of Phaser 3 introduces hundreds of updates from the core team and wider community. We've also hit a massive milestone with it: 100% complete JSDoc coverage the entire API! Every single property, function, class and method now has full documentation. We didn't stop at the public API, either, as docs cover every single all private, protected and internal property too. No stone was left unturned.

There are lots of new features in this release including the brand new Rope Game Object. This allows you to create Sprites with long strips of vertices that can be independently colored and manipulated, allowing for some lovely effects! You'll also find a new Camera Rotation Effect, updates for Arcade Physics, new Data Manager functions, Tiled import tweaks and lots, lots more. The new docs, combined with great community contributions also mean better TypeScript definitions, too.

So, as usual, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

As usual, I'd like to send a massive thank-you to everyone who supports [Phaser on Patreon](https://www.patreon.com/photonstorm) (and now even GitHub Sponsors, too!) Your continued backing keeps allowing me to work on Phaser full-time and this great new releases is the very real result of that. If you've ever considered becoming a backer, now is the perfect time!

As well as all of these updates, development has been progressing rapidly on Phaser 4. If you'd like to stay abreast of developments then I'm now publishing them to the [Phaser Patreon](https://www.patreon.com/photonstorm). Here you can find details about the latest developments and concepts behind Phaser 4.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Discord](https://phaser.io/community/discord).

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

![Sponsors](https://phaser.io/images/github/sponsors-2019-12.png "Awesome  Sponsors")

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.23.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.23.0/dist/phaser.min.js"></script>
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.23.0/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.23.0/dist/phaser-facebook-instant-games.min.js"></script>
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
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.23.0/dist/phaser-arcade-physics.min.js"></script> 
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

## Version 3.23 - Ginro - 27th April 2020

### JSDocs

The entire Phaser 3 API now has 100% complete JSDoc coverage!

The following sections had their documentation completed in this release:

* Animations
* Create
* Curves
* Geom
* Math
* Renderer
* Textures
* Tilemaps

### Removed

The following features have been removed in this version of Phaser:

* Impact Physics has been removed completely and is no longer a choice of physics system. The resulting `Scene.impact` property and Impact config object have also been removed.

### Deprecated

The following features are now deprecated and will be removed in a future version of Phaser:

* The Light Pipeline and associated components will be removed. This feature was never properly finished and adds too much redundant, non-optional code into the core API. The ability to load normal maps alongside textures will _remain_, for use in your own lighting shaders, which gives you far more control over the final effect.

### New: Rope Game Object

This version of Phaser contains the brand new Rope Game Object. A Rope is a special kind of Game Object that has a repeating texture that runs in a strip, either horizontally or vertically. Unlike a Sprite, you can define how many vertices the Rope has, and can modify each of them during run-time, allowing for some really lovely effects.

Ropes can be created via the Game Object Factory in the normal way (`this.add.rope()`) and you should look at the examples and documentation for further implementation details.

Note that Ropes are a WebGL only feature.

### New Features

* `Line.GetEasedPoints` is a new function that will take a Line, a quantity, and an ease function, and returns an array of points where each point has been spaced out across the length of the Line based on the ease function given.
* `XHRSettings.withCredentials` is a new boolean property that controls the `withCredentials` setting of the XHR Request made by the Loader. It indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. You can set this on a per-file basis, or global in the Game Config.
* `Config.loaderWithCredentials` is the new global setting for `XHRSettings.withCredentials`.
* `Camera.renderToGame` is a new property used in conjunction with `renderToTexture`. It controls if the Camera should still render to the Game canvas after rendering to its own texture or not. By default, it will render to both, but you can now toggle this at run-time.
* `Camera.setRenderToTexture` has a new optional parameter `renderToGame` which sets the `Camera.renderToGame` property, controlling if the Camera should render to both its texture and the Game canvas, or just its texture.
* The free version of Texture Packer exports a `pivot` property when using JSON Array or Hash, however the Texture Packer Phaser export uses the `anchor` property. This update allows the loaders to work with either property, regardless of which export you use (thanks @veleek)
* `get()` is a new method in the HTML and Web Audio Sound Managers that will get the first sound in the manager matching the given key, if any (thanks @samme)
* `getAll()` is a new method in the HTML and Web Audio Sound Managers that will get all sounds in the manager matching the given key, if any (thanks @samme)
* `removeAll()` is a new method in the HTML and Web Audio Sound Managers that will remove all sounds in the manager, destroying them (thanks @samme)
* `stopByKey()` is a new method in the HTML and Web Audio Sound Managers that will stop any sound in the manager matching the given key, if any (thanks @samme)
* `Rectangle.FromXY` is a new function that will create the smallest Rectangle containing two coordinate pairs, handy for marquee style selections (thanks @samme)
* `PathFollower.pathDelta` is a new property that holds the distance the follower has traveled from the previous point to the current one, at the last update (thanks @samme)
* `Vector2.fuzzyEquals` is a new method that will check whether the Vector is approximately equal to a given Vector (thanks @samme)
* `Vector2.setAngle` is a new method that will set the angle of the Vector (thanks @samme)
* `Vector2.setLength` is a new method that will set the length, or magnitude of the Vector (thanks @samme)
* `Vector2.normalizeLeftHand` is a new method that will rotate the Vector to its perpendicular, in the negative direction (thanks @samme)
* `Vector2.limit` is a new method that will limit the length, or magnitude of the Vector (thanks @samme)
* `Vector2.reflect` is a new method that will reflect the Vector off a line defined by a normal (thanks @samme)
* `Vector2.mirror` is a new method that will reflect the Vector across another (thanks @samme)
* `Vector2.rotate` is a new method that will rotate the Vector by an angle amount (thanks @samme)
* `Math.Angle.Random` is a new function that will return a random angle in radians between -pi and pi (thanks @samme)
* `Math.Angle.RandomDegrees` is a new function that will return a random angle in degrees between -180 and 180 (thanks @samme)
* `Physics.Arcade.World.fixedStep` is a new boolean property that synchronizes the physics fps to the rendering fps when enabled. This can help in some cases where "glitches" can occur in the movement of objects. These glitches are especially noticeable on objects that move at constant speed and the fps are not consistent. Enabling this feature disables the fps and timeScale properties of the Arcade.World class (thanks @jjcapellan)
* `Curves.Path.getTangent` is a new method that gets a unit vector tangent at a relative position on the path (thanks @samme)
* `DataManager.inc` is a new method that will increase a value for the given key. If the key doesn't already exist in the Data Manager then it is increased from 0 (thanks @rexrainbow)
* `DataManager.toggle` is a new method that will toggle a boolean value for the given key. If the key doesn't already exist in the Data Manager then it is toggled from false (thanks @rexrainbow)
* The Tiled parser will now recognize Tiled `point objects` and export them with `point: true`. Equally, Sprites generated via `createFromObjects` are now just set to the position of the Point object, using the Sprites dimensions. This is a breaking change, so if you are using Point objects and `createFromObjects` please re-test your maps against this release of Phaser (thanks @samme)
* You can now use Blob URLs when loading `Audio` objects via the Loader (thanks @aucguy)
* You can now use Blob URLs when loading `Video` objects via the Loader (thanks @aucguy)
* Tiled Image Collections now have rudimentary support and will create a single tileset per image. This is useful for prototyping, but should not be used heavily in production. See #4964 (thanks @gogoprog)
* When loading files using your own XHR Settings you can now use the new property `headers` to define an object containing multiple headers, all of which will be sent with the xhr request (thanks @jorbascrumps)
* `Camera.rotateTo` is a new Camera effect that allows you to set the rotation of the camera to a given value of the duration specified (thanks @jan1za)

### Updates

* `XHRLoader` will now use the `XHRSettings.withCredentials` as set in the file or global loader config.
* `Animation.setCurrentFrame` will no longer try to call `setOrigin` or `updateDisplayOrigin` if the Game Object doesn't have the Origin component, preventing unknown function errors.
* `MatterTileBody` now extends `EventEmitter`, meaning you can listen to collision events from Tiles directly and it will no longer throw errors about `gameObject.emit` not working. Fix #4967 (thanks @reinildo)
* Added `MatterJS.BodyType` to `GameObject.body` type. Fix #4962 (thanks @meisterpeeps)
* The `JSONHash` loader didn't load custom pivot information, but `JSONArray` did. So that functionality has been duplicated into the `JSONHash` file type (thanks @veleek)
* When enabling a Game Object for input debug, the debug body's depth was 0. It's now set to be the same depth as the actual Game Object (thanks @mktcode)
* Spine Files can now be loaded via a manifest, allowing you to specify a prefix in the loader object and providing absolute paths to textures. Fix #4813 (thanks @FostUK @a610569731)
* `collideSpriteVsGroup` now exits early when the Sprite has `checkCollision.none`, skipping an unnecessary iteration of the group (thanks @samme)
* `collideSpriteVsGroup` when looping through the tree results now skips bodies with `checkCollision.none` (thanks @samme)
* When enabling a Game Object for Input Debugging the created debug shape will now factor in the position, scale and rotation of the Game Objects parent Container, if it has one (thanks @scott20145)

### Bug Fixes

* The conditional checking if the `PathFollower` was at the end of the path or not was incorrect (thanks @samme)
* Creating an `Arcade Physics Body` from a scaled Game Object would use the un-scaled dimensions for the body. They now use the scaled dimensions. This may be a breaking change in some games, so please be aware of it (thanks @samme)
* Creating an `Arcade Physics Static Body` from a scaled Game Object would use the un-scaled dimensions for the body. They now use the scaled dimensions. This may be a breaking change in some games, so please be aware of it (thanks @samme)
* The `Arcade Physics Static Body` center was incorrect after construction. Probably caused problems with circle collisions. Fix  #4770 (thanks @samme)
* An Arcade Physics Body `center` and `position` are now correct after construction and before preUpdate(), for any Game Object origin or scale (thanks @samme)
* When calling `Body.setSize` with the `center` parameter as `true` the calculated offset would be incorrect for scaled Game Objects. The offset now takes scaling into consideration (thanks @samme)
* `HTML5AudioFile.load` would throw an error in strict mode (thanks @samme)
* When using the `No Audio` Sound Manager, calling `destroy()` would cause a Maximum call stack size exceeded error as it was missing 6 setter methods. It will now destroy properly (thanks @samme)
* When using HTML5 Audio, setting the game or sound volume outside of the range 0-1 would throw an index size error. The value is now clamped before being set (thanks @samme)
* Sound Managers were still listening to Game BLUR, FOCUS, and PRE_STEP events after being destroyed. These events are now cleared up properly (thanks @samme)
* In WebGL, the `TextureTintPipeline` is now set before rendering any camera effects. If the pipeline had been changed, the effects would not run (thanks @TroKEMp)
* When transitioning to a sleeping Scene, the transition `data` wasn't sent to the Scene `wake` method. It's now sent across to both sleeping and waking scenes. Fix #5078 (thanks @MrMadClown)
* `Scale.lockOrientation('portrait')` would throw a runtime error in Firefox: 'TypeError: 'mozLockOrientation' called on an object that does not implement interface Screen.' It no longer does this. Fix #5069 (thanks @123survesh)
* The `FILE_COMPLETE` event was being emitted twice for a JSON loaded animation file. It now only fires once. Fix #5059 (thanks @jjcapellan)
* If you restart or stop / start a scene and then queue at least one new file in `preload`, the scenes `update` function is called before `create`, likely causing an error. Fix #5065 (thanks @samme)
* `Circle.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Ellipse.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Line.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Polygon.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Rectangle.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* `Triangle.GetPoints` will now check that `stepRate` is > 0 to avoid division by zero errors leading to the quantity becoming infinity (thanks @jdcook)
* Changing the game size with a scale mode of FIT resulted in a canvas with a incorrect aspect ratio. Fix #4971 (thanks @Kitsee @samme)
* The Matter Physics `Common.isString` function would cause a 'TypeError: Invalid calling object' in Internet Explorer (thanks @samme)
* `Arcade.Body.checkCollision.none` did not prevent collisions with Tiles. Now it does (thanks @samme)
* When running in HEADLESS mode, using a `Text` Game Object would cause a runtime error "Cannot read property gl of null". Fix #4976 (thanks @raimon-segura @samme)
* The Tilemap `LayerData` class `properties` property has been changed from 'object' to an array of objects, which is what Tiled exports when defining layer properties in the editor. Fix #4983 (thanks @Nightspeller)
* `AudioFile` and `VideoFile` had their state set to `undefined` instead of `FILE_PROCESSING` (thanks @samme)
* `Container.getBounds` would return incorrect values if it had child Containers within it. Fix #4580 (thanks @Minious @thedrint)
* The Loader no longer prepends the current path to the URL if it's a Blob object (thanks @aucguy)
* Spine Atlases can now be loaded correctly via Asset Packs, as they now have the right index applied to them (thanks @jdcook)
* Input events for children inside nested Containers would incorrectly fire depending on the pointer position (thanks @rexrainbow)
* Animations with both `yoyo` and `repeatDelay` set will respect the delay after each yoyo runs (thanks @cruzdanilo)
* `CanvasTexture.setSize` forgot to update the `width` and `height` properties of the Texture itself. These now match the underlying canvas element. Fix #5054 (thanks @sebbernery)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@JasonHK @supertommy @majalon @samme @MartinBlackburn @halilcakar @jcyuan @MrMadClown @Dinozor @EmilSV @Jazcash

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.23.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.23.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
