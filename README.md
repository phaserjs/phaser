# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Phaser is available in two versions: Phaser 3 and [Phaser CE - The Community Edition](https://github.com/photonstorm/phaser-ce). Phaser CE is a community-lead continuation of the Phaser 2 codebase and is hosted on a separate repo. Phaser 3 is the next generation of Phaser.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://github.com/photonstorm/phaser3-docs), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 700+ [Examples](https://labs.phaser.io) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 1st October 2018

I'm pleased to announce that Phaser 3.14 is now out. Hot on the heels of the massive 3.13 release, 3.14 brings some sought-after new features to the party, including support for the new Tiled Map Editor 1.2 file formats, as well as the long-requested feature allowing use of multiple tilesets per single tilemap layer.

There are also new features to make Matter JS debugging easier and body creation when using lists of vertices is now much cleaner too. It's never just features though. There are lots of important fixes and updates in 3.14, including a fix causing gl canvas resizing to fail, better handling of the game shutdown process and fixes for an issue with Graphics.generateTexture.

If you're building an active project on 3.13 then please upgrade to 3.14 and, as usual, report any issues you find on GitHub so we can look at them immediately. Also, in the 3.14 release we have completed over 1000 new areas of documentation. At the time of writing there are now just 1900 items in the API left to document, which may sound like a lot, but is a fraction of the tens of thousands already done! With our current progress we should have 100% documentation coverage within the next couple of months.

In case you missed the notice, Phaser 3.13 introduced the Facebook Instant Games Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync. My thanks to Facebook for helping make this possible.

Also new in 3.13 were the Shape Game Objects, which allows for quick addition of geometry onto the display list. Easily add rectangles, triangles, curves, stars and more into your game and treat them just like any other Game Object. Perfect for place-holder art, abstract style games or just really fast iterations game-jam style.

3.14 continues to represent the tireless effort on my part to get it fully production ready. I'm seeing lots more games being released with Phaser 3 and stacks of tutorials and plugins are starting to surface. My aim has always been to continue the mission of enhancing Phaser 3 as quickly as I can. It means releasing significant updates in relatively short periods of time. But it also means I'm jumping on bug reports as quickly as I can, keeping the issues list total nice and low (the vast majority of the items in there are feature requests now!) - a massive thank-you to all of you who support Phaser on Patreon and PayPal. It's your support that allows me to work on this full-time, to the benefit of everyone.

As always, please check out the [Change Log](#changelog) for comprehensive details about what recent versions contain.

If you'd like to stay abreast of developments then I publish my [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from the core team and the wider community.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord) channels.

Phaser 3 wouldn't have been possible without the fantastic support of the community and Patreon. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](https://www.phaser.io/images/spacedancer.gif)

![Support Phaser](https://phaser.io/images/github/div-support-phaser.png "Support Phaser")

Developing Phaser takes a lot of time, effort and money. There are monthly running costs as well as countless hours of development time, community support, and assistance resolving issues.

If you have found Phaser useful in your development life or have made income as a result of it please support our work via:

* A monthly contribution on [Patreon](https://www.patreon.com/photonstorm).
* A [one-off donation](https://phaser.io/community/donate) with PayPal.
* Purchase any of our [plugins or books](https://phaser.io/shop).

It all helps and genuinely contributes towards future development.

Extra special thanks to our top-tier sponsors: [Orange Games](http://orangegames.com) and [CrossInstall](https://crossinstall.com).

![Sponsors](https://phaser.io/images/github/patreon-sponsors-2018-1.png "Top Patreon Sponsors")

![Phaser Newsletter](https://phaser.io/images/github/div-newsletter.png "Phaser Newsletter")

<div align="center"><img src="https://phaser.io/images/github/phaser-world.png"></div>

We publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. The newsletter also contains our weekly Development Progress updates which let you know about the new features we're working on.

Over 120 previous editions can be found on our [Back Issues](https://phaser.io/community/backissues) page.

![Download Phaser](https://phaser.io/images/github/div-download.png "Download Phaser")
<a name="download"></a>

Phaser 3 is available via GitHub, npm and CDNs:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the Github [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.14/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.14/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online. Use the drop-down menus at the top to navigate the name spaces, classes and Game Objects lists.

Or, if you wish to run the docs locally you can checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

[TypeScript Definitions](https://github.com/photonstorm/phaser3-docs/tree/master/typescript) are now available.

They are automatically generated from the jsdoc comments in the Phaser source code. If you wish to help refine them then you must edit the Phaser jsdoc blocks directly. You can find more details, including the source to the conversion tool we wrote in the Docs repo.

As soon as we're happy with the accuracy of the TS defs we'll merge them into the main repo, for now, please download them from the docs repo, linked above, and add them to your project. When we release new versions of Phaser we publish new TS defs too.

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

Phaser 3.13 introduces the new [Facebook Instant Games](https://developers.facebook.com/docs/games/instant-games) Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync.

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

A special build of Phaser with the Facebook Instant Games Plugin ready-enabled is [available on jsDelivr](https://www.jsdelivr.com/projects/phaser). Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.14/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.14/dist/phaser-facebook-instant-games.min.js"></script>
```

The build files are in the git repository in the `dist` folder, and you can also include the plugin in custom builds.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets ready available. Until these examples are fully integrated into the Phaser website, you can browse them on [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Facebook Instant Games

Phaser 3.13 introduced the new Facebook Instant Games Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync.

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

The plugin is fully documented and official tutorials and project templates will follow shortly.

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://labs.phaser.io/build/phaser-arcade-physics.min.js"></script> 
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

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install`.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

## Version 3.14.0 - Tachikoma - 1st October 2018

### Tilemap New Features, Updates and Fixes

* Both Static and Dynamic Tilemap layers now support rendering multiple tilesets per layer in both Canvas and WebGL. To use multiple tilesets pass in an array of Tileset objects, or strings, to the `createStaticLayer` and `createDynamicLayer` methods respectively.
* `Tilemap.createStaticLayer` now supports passing either a Tileset reference, or a string, or an array of them as the 2nd argument. If strings, the string should be the Tileset name (usually defined in Tiled).
* `Tilemap.createDynamicLayer` now supports passing either a Tileset reference, or a string, or an array of them as the 2nd argument. If strings, the string should be the Tileset name (usually defined in Tiled).
* `Tilemap.createBlankDynamicLayer` now supports passing either a Tileset reference, or a string, or an array of them as the 2nd argument. If strings, the string should be the Tileset name (usually defined in Tiled).
* Static Tilemap Layers now support tile rotation and flipping. Previously this was a feature only for Dynamic Tilemap Layers, but now both have it. Close #4037 (thanks @thisredone)
* `Tilemap.getTileset` is a new method that will return a Tileset based on its name.
* `ParseTilesets` has been rewritten so it will convert the new data structures of Tiled 1.2 into the format expected by Phaser, allowing you to use either Tiled 1.2.x or Tiled 1.1 JSON exports. Fix #3998 (thanks @martin-pabst @halgorithm)
* `Tilemap.setBaseTileSize` now sets the size into the LayerData `baseTileWidth` and `baseTileHeight` properties accordingly. Fix #4057 (thanks @imilo)
* Calling `Tilemap.renderDebug` ignored the layer world position when drawing to the Graphics object. It will now translate to the layer position before drawing. Fix #4061 (thanks @Zax37)
* Calling `Tilemap.renderDebug` ignored the layer scale when drawing to the Graphics object. It will now scale the layer before drawing. Fix #4026 (thanks @JasonHK)
* The Static Tilemap Layer would stop drawing all tiles from that point on, if it encountered a tile which had invalid texture coordinates (such as a tile from another tileset). It now skips invalid tiles properly again. Fix #4002 (thanks @jdotrjs)
* If you used a RenderTexture as a tileset then Dynamic Tilemap Layers would render the tiles inversed on the y-axis in WebGL. Fix #4017 (thanks @s-s)
* If you used a scaled Dynamic Tilemap Layer and rotated or flipped tiles, the tiles that were rotated or flipped would be positioned incorrectly in WebGL. Fix #3778 (thanks @nkholski)
* `StaticTilemapLayer.tileset` is now an array of Tileset objects, where-as before it was a single reference.
* `StaticTilemapLayer.vertexBuffer` is now an array of WebGLBuffer objects, where-as before it was a single instance.
* `StaticTilemapLayer.bufferData` is now an array of ArrayBuffer objects, where-as before it was a single instance.
* `StaticTilemapLayer.vertexViewF32` is now an array of Float3Array objects, where-as before it was a single instance.
* `StaticTilemapLayer.vertexViewU32` is now an array of Uint32Array objects, where-as before it was a single instance.
* `StaticTilemapLayer.dirty` is now an array of booleans, where-as before it was a single boolean.
* `StaticTilemapLayer.vertextCount` is now an array of integers, where-as before it was a single integer.
* `StaticTilemapLayer.updateVBOData()` is a new private method that creates the internal VBO data arrays for the WebGL renderer.
* The `StaticTilemapLayer.upload()` method has a new parameter `tilesetIndex` which controls which tileset to prepare the VBO data for.
* The `StaticTilemapLayer.batchTile()` method has a new parameter `tilesetIndex` which controls which tileset to batch the tile for.
* `StaticTilemapLayer.setTilesets()` is a new private method that creates the internal tileset references array.
* `DynamicTilemapLayer.tileset` is now an array of Tileset objects, where-as before it was a single reference.
* `DynamicTilemapLayer.setTilesets()` is a new private method that creates the internal tileset references array.

### New Features

* `bodyDebugFillColor` is a new Matter Physics debug option that allows you to set a color used when drawing filled bodies to the debug Graphic.
* `debugWireframes` is a new Matter Physics debug option that allows you to control if the wireframes of the bodies are used when drawing to the debug Graphic. The default is `true`. If enabled bodies are not filled.
* `debugShowInternalEdges` is a new Matter Physics debug option that allows you to set if the internal edges of a body are rendered to the debug Graphic.
* `debugShowConvexHulls` is a new Matter Physics debug option that allows you to control if the convex hull of a body is drawn to the debug Graphic. The default is `false`.
* `debugConvexHullColor` is a new Matter Physics debug option that lets you set the color of the convex hull, if being drawn to the debug Graphic.
* `debugShowSleeping` is a new Matter Physics debug option that lets you draw sleeping bodies at 50% opacity.
* `Curves.Ellipse.angle` is a new getter / setter that handles the rotation of the curve in degrees instead of radians.

### Updates

* The Loader has been updated to handle the impact of you destroying the game instance while still processing files. It will no longer throw cache and texture related errors. Fix #4049 (thanks @pantoninho)
* `Polygon.setTo` can now take a string of space separated numbers when creating the polygon data, i.e.: `'40 0 40 20 100 20 100 80 40 80 40 100 0 50'`. This update also impacts the Polygon Shape object, which can now also take this format as well.
* The `poly-decomp` library, as used by Matter.js, has been updated to 0.3.0.
* `Matter.verts`, available via `this.matter.verts` from within a Scene, is a quick way of accessing the Matter Vertices functions.
* You can now specify the vertices for a Matter `fromVerts` body as a string.
* `TextureTintPipeline.batchTexture` has a new optional argument `skipFlip` which allows you to control the internal render texture flip Y check.
* The Device.OS check for `node` will now do a `typeof` first to avoid issues with rollup packaged builds needing to shim the variable out. Fix #4058 (thanks @hollowdoor)
* Arcade Physics Bodies will now sync the display origin of the parent Game Object to the body properties as part of the `updateBounds` call. This means if you change the origin of an AP enabled Game Object, after creation of the body, it will be reflected in the body position. This may or may not be a breaking change for your game. Previously it was expected that the origin should always be 0.5 and you adjust the body using `setOffset`, but this change makes a bit more sense logically. If you find that your bodies are offset after upgrading to this version then this is likely why. Close #4052 (thanks @SolarOmni)
* The `Texture.getFramesFromTextureSource` method has a new boolean argument `includeBase`, which defaults to `false` and allows you to set if the base frame should be returned into the array or not.
* There is a new Animation Event that is dispatched when an animation restarts. Listen for it via `Sprite.on('animationrestart')`.
* All of the Animation Events now pass the Game Object as the final argument, this includes `animationstart`, `animationrestart`, `animationrepeat`, `animationupdate` and `animationcomplete`.
* `Curves.Ellipse.rotation` is a getter / setter that holds the rotation of the curve. Previously it expected the value in degrees and when getting it returned the value in radians. It now expects the value in radians and returns radians to keep it logical.
* `Set.size` will now only set the new size if the value is smaller than the current size, truncating the Set in the process. Values larger than the current size are ignored.
* Arcade Physics `shutdown` will check to see if the world instance still exists and only try removing it if so. This prevents errors when stopping a world and then destroying it at a later date.
* `Text.setFont`, `Text.setFontFamily`, `Text.setFontStyle` and `Text.setStroke` will no longer re-measure the parent Text object if their values have not changed.

### Bug Fixes

* GameObjects added to and removed from Containers no longer listen for the `shutdown` event at all (thanks Vitali)
* Sprites now have `preDestroy` method, which is called automatically by `destroy`. The method destroys the Animation component, unregistering the `remove` event in the process and freeing-up resources. Fix #4051 (thanks @Aveyder)
* `UpdateList.shutdown` wasn't correctly iterating over the pending lists (thanks @felipeprov)
* Input detection was known to be broken when the game resolution was !== 1 and the Camera zoom level was !== 1. Fix #4010 (thanks @s-s)
* The `Shape.Line` object was missing a `lineWidth` property unless you called the `setLineWidth` method, causing the line to not render in Canvas only. Fix #4068 (thanks @netgfx)
* All parts of Matter Body now have the `gameObject` property set correctly. Previously only the first part of the Body did.
* When using `MatterGameObject` and `fromVerts` as the shape type it wouldn't pass the values to `Bodies.fromVertices` because of a previous conditional. It now passes them over correctly and the body is only set if the result is valid.
* The `Texture.getFramesFromTextureSource` method was returning an array of Frame names by mistake, instead of Frame references. It now returns the Frames themselves.
* When using `CanvasTexture.refresh` or `Graphics.generateTexture` it would throw WebGL warnings like 'bindTexture: Attempt to bind a deleted texture'. This was due to the Frames losing sync with the glTexture reference used by their TextureSource. Fix #4050 (thanks @kanthi0802)
* Fixed an error in the `batchSprite` methods in the Canvas and WebGL Renderers that would incorrectly set the frame dimensions on Sprites with the crop component. This was particularly noticeable on Sprites with trimmed animation frames (thanks @sergeod9)
* Fixed a bug where the gl scissor wasn't being reset during a renderer resize, causing it to appear as if the canvas didn't resize properly when `autoResize` was set to `true` in the game config. Fix #4066 (thanks @Quinten @hsan999)
* If a Game instance is destroyed without using the `removeCanvas` argument, it would throw exceptions in the `MouseManager` after the destroy process has run, as the event listeners were not unbound. They're not unbound, regardless of if the parent canvas is removed or not. Fix #4015 (thanks @garethwhittaker)

### Examples and TypeScript

A huge thanks to @presidenten for his work on the Phaser 3 Examples. You'll notice they now have a lovely screen shots for every example and the scripts generate them automatically :)

Also, thanks to the following for helping with the Phaser 3 Examples and TypeScript definitions, either by reporting errors, or even better, fixing them:

@madanus @truncs @samme

### Phaser Doc Jam

The [Phaser Doc Jam](http://docjam.phaser.io) is an on-going effort to ensure that the Phaser 3 API has 100% documentation coverage. Thanks to the monumental effort of myself and the following people we're now really close to that goal! My thanks to:

31826615 - @16patsle - @bobonthenet - @rgk - @samme - @shaneMLK - @wemyss - ajmetal - andiCR - Arian Fornaris - bsparks - Carl - cyantree - DannyT - Elliott Wallace - felixnemis - griga - Hardylr - henriacle - Hsaka - icbat - Kanthi - Kyle - Lee - Nathaniel Foldan - Peter Pedersen - rootasjey - Sam Frantz - SBCGames - snowbillr - Stephen Hamilton - STuFF - TadejZupancic - telinc1

If you'd like to help finish off the last parts of documentation then take a look at the [Doc Jam site](http://docjam.phaser.io).

Please see the complete [Change Log](https://github.com/photonstorm/phaser/blob/master/CHANGELOG.md) for previous releases.

Looking for a v2 change? Check out the [Phaser CE Change Log](https://github.com/photonstorm/phaser-ce/blob/master/CHANGELOG.md)

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

The Phaser logo and characters are &copy; 2018 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.11/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.11/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: http://www.html5gamedevs.com/forum/33-phaser-3/
