# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Phaser is available in two versions: Phaser 3 and [Phaser CE - The Community Edition](https://github.com/photonstorm/phaser-ce). Phaser CE is a community-lead continuation of the Phaser 2 codebase and is hosted on a separate repo. Phaser 3 is the next generation of Phaser.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://photonstorm.github.io/phaser3-docs/index.html), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 700+ [Examples](https://labs.phaser.io) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Slack](https://phaser.io/community/slack) and [Discord](https://phaser.io/community/discord)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 10th May 2019

After months of hard work, we're very happy to announce that Phaser 3.17 is now released. This is a significant update for a number of reasons, bring some great new features and fixes out. The first is that we have moved the DOM Element Game Objects from the 'experimental' flag they were previously hidden under, finished them off, fully documented them and moved them to main. DOM Elements are a great way to layer HTML content over the top of your game and control it, just as if it was a standard Game Object. Have a look at the demos, read the docs and get stuck-in using them!

Also brand new in this release are Shader Game Objects. Previously, if you wished to use a custom shader in your game, you'd have to create your own WebGL pipeline to handle it. Now, with 3.17, adding a shader is a single line of code - and what's more, you can manipulate them just like regular Game Objects, so they can be rotated, scaled, have hit areas and so on. As with DOM Elements please see the new examples and read the fully complete API Docs to learn how to use them.

The final significant new feature comes in the way of masks. Phaser 3 has always supported Bitmap and Geometry Masks, but using them was limited (you couldn't mask children inside Containers, for example), and they were pretty slow. After a lot of development they're now fully batched, meaning the same mask applied to thousands of game objects no longer impacts performance. They can also be nested and will restore the mask stack as they're used and what's more, you can now add masks to Cameras. This is a great feature in itself and opens up the possibility for lots of visual effects in your games.

It doesn't end there, though. You'll find hundreds of great new features, updates and fixes. So, as usual, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

A massive thank-you to everyone who supports Phaser on Patreon and PayPal. Your continued backing has allowed me to work on Phaser all year, and this great new releases is the very real result of that. If you've ever considered becoming a backer, now is the perfect time!

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

![Sponsors](https://phaser.io/images/github/sponsors-2019-05.png "Awesome  Sponsors")

![Phaser Newsletter](https://phaser.io/images/github/div-newsletter.png "Phaser Newsletter")

<div align="center"><img src="https://phaser.io/images/github/phaser-world.png"></div>

We publish the [Phaser World](https://phaser.io/community/newsletter) newsletter. It's packed full of the latest Phaser games, tutorials, videos, meet-ups, talks, and more. The newsletter also contains our weekly Development Progress updates which let you know about the new features we're working on.

Over 140 previous editions can be found on our [Back Issues](https://phaser.io/community/backissues) page.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.17.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.17.0/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online. Use the drop-down menus at the top to navigate the namespaces, classes and Game Objects lists.

Or, if you wish to run the docs locally you can checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the `docs/` folder.

The documentation for Phaser 3 is an on-going project. Please help us by searching the Phaser code for any instance of the string `[description]` and then replacing it with some documentation.

### TypeScript Definitions

You can find the [TypeScript definitions](https://github.com/photonstorm/phaser/tree/master/types) inside the `types` folder. They are also referenced in the types entry in `package.json`.

The defs are automatically generated from the JSDoc comments found in the Phaser source code. If you wish to help refine them then you must edit the Phaser JSDoc blocks directly, not the defs file. You can find more details about the parser we built in the `scripts/tsgen` folder.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.17.0/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.17.0/dist/phaser-facebook-instant-games.min.js"></script>
```

The build files are in the git repository in the `dist` folder, and you can also include the plugin in custom builds.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets ready available. Until these examples are fully integrated into the Phaser website, you can browse them on [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.17.0/dist/phaser-arcade-physics.min.js"></script> 
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

## Version 3.17.0 - Motoko - 10th May 2019

### Shaders

'Shader' is a new type of Game Object which allows you to easily add a quad with its own shader into the display list, and manipulate it as you would any other Game Object, including scaling, rotating, positioning and adding to Containers. Shaders can be masked with either Bitmap or Geometry masks and can also be used as a Bitmap Mask for a Camera or other Game Object. They can also be made interactive and used for input events.

They work by taking a reference to a `Phaser.Display.BaseShader` instance, as found in the Shader Cache. These can be created dynamically at runtime, or loaded in via the updated GLSL File Loader:

```javascript
function preload ()
{
    this.load.glsl('fire', 'shaders/fire.glsl.js');
}
 
function create ()
{
    this.add.shader('fire', 400, 300, 512, 512);
}
```

Please see the Phaser 3 Examples GitHub repo for examples of loading and creating shaders dynamically.

* `Display.BaseShader` is a new type of object that contain the fragment and vertex source, together with any uniforms the shader needs, and are used when creating the new `Shader` Game Objects. They are stored in the Shader cache.
* The Shader Cache `this.cache.shader` has been updated. Rather than holding plain text fragments, it now holds instances of the new `BaseShader` objects. As a result, using `cache.shader.get(key)` will now return a `BaseShader` instead of a text file.
* The `GLSLFile` loader has been updated with new arguments. As well as a URL to the shader file you can also specify if the file is a fragment or vertex shader. It then uses this value to help create or update a `BaseShader` instance in the shader cache.
* The `GLSLFile` loader now supports shader bundles. These allow for multiple shaders to be stored in a single file, with each shader separated by a block of front-matter that represents its contents. Example shader bundles can be found in the Phaser 3 Examples repo.

### DOM Elements

DOM Elements have finally left the experimental stage and are now part of the full Phaser release.

DOM Element Game Objects are a way to control and manipulate HTML Elements over the top of your game. In order for DOM Elements to display you have to enable them by adding the following to your game configuration object:

```javascript
dom {
  createContainer: true
}
```

When this is added, Phaser will automatically create a DOM Container div that is positioned over the top of the game canvas. This div is sized to match the canvas, and if the canvas size changes, as a result of settings within the Scale Manager, the dom container is resized accordingly.

You can create a DOM Element by either passing in DOMStrings, or by passing in a reference to an existing
Element that you wish to be placed under the control of Phaser. For example:

```javascript
this.add.dom(x, y, 'div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
```

The above code will insert a div element into the DOM Container at the given x/y coordinate. The DOMString in the 4th argument sets the initial CSS style of the div and the final argument is the inner text. In this case, it will create a lime colored div that is 220px by 100px in size with the text Phaser in it, in an Arial font.

You should nearly always, without exception, use explicitly sized HTML Elements, in order to fully control alignment and positioning of the elements next to regular game content.

Rather than specify the CSS and HTML directly you can use the `load.html` File Loader to load it into the cache and then use the `createFromCache` method instead. You can also use `createFromHTML` and various other methods available in this class to help construct your elements.

Once the element has been created you can then control it like you would any other Game Object. You can set its position, scale, rotation, alpha and other properties. It will move as the main Scene Camera moves and be clipped at the edge of the canvas. It's important to remember some limitations of DOM Elements: The obvious one is that they appear above or below your game canvas. You cannot blend them into the display list, meaning you cannot have a DOM Element, then a Sprite, then another DOM Element behind it.

You can find lots of examples on using DOM Elements in the Phaser 3 Examples repo.

### Geometry and Bitmap Masks

* `Camera.setMask` is a new method that allows you to set a geometry or bitmap mask on any camera. The mask can be set to remain fixed in position, or to translate along with the camera. It will impact anything the camera renders. A reference to the mask is stored in the `Camera.mask` property.
* `Camera.clearMask` is a new method that clears a previously set mask on a Camera.
* There is a new Game Config property `input.windowEvents` which is true by default. It controls if Phaser will listen for any input events on the Window. If you disable this, Phaser will stop being able to emit events like `POINTER_UP_OUTSIDE`, or be aware of anything that happens outside of the Canvas re: input.
* Containers can now contain masked children and have those masks respected, including the mask on the Container itself (if any). Masks work on any depth of child up to 255 children deep.
* Geometry Masks are now batched. Previously, using the same mask on multiple Game Objects would create brand new stencil operations for every single Game Object, causing performance to tank. Now, the mask is only set if it's different from the previously masked object in the display list, allowing you to mask thousands of Game Objects and retain batching through-out.
* `GeometryMask.setInvertAlpha` is a new method that allows you to set the `invertAlpha` property in a chainable call.
* Previously, setting a mask on a Particle Emitter wouldn't work (it had to be set on the Emitter Manager instance), even though the mask methods and properties existed. You can now set a geometry or bitmap mask directly on an emitter.
* The Particle Emitter Manager was missing the Mask component, even though it fully supported masking. The Mask component has now been added. You can now mask the manager, which impacts all emitters you create through it, or a specific emitter. Different emitters can have different masks, although they override the parent mask, if set.
* You can now apply a Bitmap Mask to a Camera or Container and a Geometry Mask to a child and have it work correctly.
* `WebGLRenderer.maskCount` is a new internal property that tracks the number of masks in the stack.
* `WebGLRenderer.maskStack` is a new internal array that contains the current mask stack.

### Arcade Physics

#### New Features

* `overlapTiles` is a new method that allows you to check for overlaps between a physics enabled Game Object and an array of Tiles. The Tiles don't have to have been enable for collision, or even be on the same layer, for the overlap check to work. You can provide your own process callback and/or overlap callback. This is handy for testing for overlap for a specific Tile in your map, not just based on a tile index. This is available via `this.physics.overlapTiles` and the World instance.
* `collideTiles` is a new method that allows you to check for collision between a physics enabled Game Object and an array of Tiles. The Tiles don't have to have been enable for collision, or even be on the same layer, for the collision to work. You can provide your own process callback and/or overlap callback. There are some limitations in using this method, please consult the API Docs for details, but on the whole, it allows for dynamic collision on small sets of Tile instances. This is available via `this.physics.collideTiles` and the World instance.
* `overlapRect` is a new method that allows you to return an array of all physics bodies within the given rectangular region of the World. It can return dynamic or static bodies and will use the RTree for super-fast searching, if enabled (which it is by default)
* The `Body.setCollideWorldBounds` method has two new optional arguments `bounceX` and `bounceY` which, if given, will set the World Bounce values for the body.

#### Updates

* `Body.preUpdate` is a new method that is called only once per game step. It resets all collision status properties and syncs the Body with the parent Game Object.
* `Body.update` has been rewritten to just perform one single physics step and no longer re-syncs with the Game Object. It can be called multiple times per game step, depending on the World FPS rate.
* `Body.postUpdate` has been rewritten to make it more compact. It syncs the body data back to the parent Game Object and is only called once per game step now (previously it was called whenever the Body updated)
* The `World.late` Set has been removed and is no longer populated, as it's no longer required.
* `World.update` now calls `Body.preUpdate` just once per game step, then calls `Body.update` as many times as is required as per the FPS setting, and no longer calls `Body.postUpdate` at all.
* `World.collideSpriteVsTilemapLayer` now returns a boolean if a collision or overlap happens, where-as before it didn't.
* `World.collideSpriteVsTilemapLayerHandler` is a new private method that handles all tilemap collision checks.
* The internal method `SeparateTile` now has a new argument `isLayer` which controls if the set comes from a layer or an array.
* The internal method `TileCheckX` now has a new argument `isLayer` which controls if the set comes from a layer or an array.
* The internal method `TileCheckY` now has a new argument `isLayer` which controls if the set comes from a layer or an array.
* `Body.isMoving` has been removed as it was never used internally.
* `Body.stopVelocityOnCollide` has been removed as it was never used internally.
* All of the Arcade Physics Components are now available directly under the `Phaser.Physics.Arcade.Components` namespace. Fix #4440 (thanks @jackfreak)
* `Phaser.Physics.Arcade.Events` is now exposed in the namespace, preventing it from erroring if you use them in TypeScript. Fix #4481 (thanks @danielalves)
* The Matter World configuration value `bodyDebugFillColor` has been renamed to `debugBodyFillColor` to be consistent with the rest of the options.
* The Matter World configuration has a new property: `debugStaticBodyColor` that sets the static body debug color.

#### Bug Fixes

* The `Body.delta` values are now able to be read and acted upon during a Scene update, due to the new game step flow. This means you can now call `this.physics.collide` during a Scene `update` and it will work properly again. Fix #4370 (thanks @NokFrt)
* `ArcadePhysics.furthest` now iterates the bodies Set, rather than the RTree, which keeps it working even if the RTree has been disabled.
* `ArcadePhysics.closest` now iterates the bodies Set, rather than the RTree, which keeps it working even if the RTree has been disabled.
* `Body.setVelocity` caused the `speed` property to be set to `NaN` if you didn't provide a `y` argument.
* Passing an _array_ of configuration objects to `physics.add.group` would ignore them and none of the children would be assigned a physics body. Fix #4511 (thanks @rgk)
* A Body with `damping` and `drag` enabled would fail to move if it went from zero velocity to a new velocity inside an `update` loop. It will now reset its speed accordingly and retain its new velocity (thanks StealthGary)

### Facebook Instant Games Plugin

* The method `consumePurchases` has been renamed to `consumePurchase` to bring it in-line with the Facebook API.
* `getProduct` is a new method that will return a single Product from the product catalog based on the given Product ID. You can use this to look-up product details based on a purchase list.

### New Features

* A Scene will now emit the new `CREATE` event after it has been created by the Scene Manager. If the Scene has a `create` method this event comes after that, so is useful to knowing when a Scene may have finished creating Game Objects, etc. (thanks @jackfreak)
* `Tilemap.removeTile` is a new method that allows you to remove a tile, or an array of tiles, by passing in references to the tiles themselves, rather than coordinates. The tiles can be replaced with new tiles of the given index, or removed entirely, and the method can optionally recalculate interesting faces on the layer.
* `TweenManager.remove` is a new method that immediately removes the given Tween from all of its internal arrays.
* `Tween.remove` is a new method that immediately removes the Tween from the TweenManager, regardless of what state the tween is in. Once called the tween will no longer exist within any internal TweenManager arrays.
* `SceneManager.isPaused` is a new method that will return if the given Scene is currently paused or not (thanks @samme)
* `ScenePlugin.isPaused` is a new method that will return if the given Scene is currently paused or not (thanks @samme)
* `TextureManager.removeKey` is a new method that will remove a key from the Texture Manager without destroying the texture itself.
* `Matter.World.resetCollisionIDs` is a new method that will reset the collision IDs that Matter JS uses for body collision groups. You should call this before destroying your game if you need to restart the game again on the same page, without first reloading the page. Or, if you wish to consistently destroy a Scene that contains Matter.js and then run it again (thanks @clesquir)
* RenderTexture has two new optional constructor arguments `key` and `frame`. This allows you to create a RenderTexture pre-populated with the size and frame from an existing texture (thanks @TadejZupancic)
* `GameObjects.Components.PathFollower` is a new component that manages any type of Game Object following a path. The original Path Follower Game Object has been updated to use this new component directly, but it can be applied to any custom Game Object class.
* `Tilemap.removeLayer` is a new method that allows you to remove a specific layer from a Tilemap without destroying it.
* `Tilemap.destroyLayer` is a new method that allows you to destroy a layer and remove it from a Tilemap.
* `Tilemap.renderDebugFull` is a new method that will debug render all layers in the Tilemap to the given Graphics object.
* `Geom.Intersects.GetCircleToCircle` is a new function that will return the point/s of intersection between two circles (thanks @florianvazelle)
* `Geom.Intersects.GetCircleToRectangle` is a new function that will return the point/s of intersection between a circle and a rectangle (thanks @florianvazelle)
* `Geom.Intersects.GetLineToCircle` is a new function that will return the point/s of intersection between a line and a circle (thanks @florianvazelle)
* `Geom.Intersects.GetLineToRectangle` is a new function that will return the point/s of intersection between a line and a rectangle (thanks @florianvazelle)
* `Geom.Intersects.GetRectangleToRectangle` is a new function that will return the point/s of intersection between two rectangles (thanks @florianvazelle)
* `Geom.Intersects.GetRectangleToTriangle` is a new function that will return the point/s of intersection between a rectangle and a triangle (thanks @florianvazelle)
* `Geom.Intersects.GetTriangleToCircle` is a new function that will return the point/s of intersection between a triangle and a circle (thanks @florianvazelle)
* `Geom.Intersects.GetTriangleToLine` is a new function that will return the point/s of intersection between a triangle and a line (thanks @florianvazelle)
* `Geom.Intersects.GetTriangleToTriangle` is a new function that will return the point/s of intersection between two triangles (thanks @florianvazelle)
* `Size.setCSS` is a new method that will set the Size components width and height to the respective CSS style properties of the given element.
* `CSSFile` is a new Loader FileType that allows you to load css into the current document via the normal Phaser Loader, using the `load.css` method. As such, you can chain it with other load calls, load via config, use as part of a pack load or any other option available to all loader filetypes. The CSS is applied immediately to the document.
* `MultiScriptFile` is a new Loader FileType that allows you to load multiple script files into the document via the Phaser Loader, using the new `load.scripts` method. The difference between this and `load.script` is that you must pass an array of script file URLs to this method and they will be loaded in parallel but _processed_ (i.e. added to the document) in the exact order specified in the array. This allows you to load a bundle of scripts that have dependencies on each other.
* `Key.getDuration` is a new method that will return the duration, in ms, that the Key has been held down for. If the Key isn't down it will return zero.
* The `Container.setScrollFactor` method has a new optional argument `updateChildren`. If set, it will change the `scrollFactor` values of all the Container children as well as the Container. Fix #4466 #4475 (thanks @pinkkis @enriqueto)
* There is a new webpack config `FEATURE_SOUND` which is set to `true` by default, but if set to `false` it will exclude the Sound Manager and all of its systems from the build files. Fix #4428 (thanks @goldfire)
* `Scene.Systems.renderer` is a new property that is a reference to the current renderer the game is using.
* `Utils.Objects.SetValue` is a new function that allows you to set a value in an object by specifying a property key. The function can set a value to any depth by using dot-notation for the key, i.e. `SetValue(data, 'world.position.x', 100)`.
* `WebGLRenderer.glFuncMap` is a new object, populated during the `init` method, that contains uniform mappings from key to the corresponding gl function, i.e. `mat2` to `gl.uniformMatrix2fv`.
* `BaseCache.getKeys` is a new method that will return all keys in use in the current cache, i.e. `this.cache.shader.getKeys()`.

### Updates

* Removed all references to CocoonJS from the API, including in the Device.OS object and elsewhere, as Cocoon is no longer.
* The MouseManager and TouchManager now use separate handlers for the Window level input events, which check to see if the canvas is the target or not, and redirect processing accordingly.
* `AnimationManager.generateFrameNumbers` can now accept a start number greater than the end number, and will generate them in reverse (thanks @cruzdanilo)
* The return from the `ScenePlugin.add` method has changed. Previously, it would return the ScenePlugin, but now it returns a reference to the Scene that was added to the Scene Manager, keeping it in-line with all other `add` methods in the API. Fix #4359 (thanks @BigZaphod)
* The `PluginManager.installScenePlugin` method has a new optional boolean parameter `fromLoader` which controls if the plugin is coming in from the result of a Loader operation or not. If it is, it no longer throws a console warning if the plugin already exists. This fixes an issue where if you return to a Scene that loads a Scene Plugin it would throw a warning and then not install the plugin to the Scene.
* The Scale Manager has a new event `FULLSCREEN_FAILED` which is fired if you try to enter fullscreen mode, but the browser rejects it for some reason.
* The `ScaleMode` Component has been removed from every Game Object, and along with it the `scaleMode` property and `setScaleMode` method. These did nothing anyway as they were not hooked to the render pipeline and scale mode should be set on the texture, not the Game Object. Fix #4413 (thanks @jcyuan)
* The `Clock.now` property value is now synced to be the `TimeStep.time` value when the Clock plugin boots and is no longer `Date.now()` until the first update (thanks @Antriel)
* `Graphics.strokePoints` has renamed the second argument from `autoClose` to `closeShape`. There is also a new third argument `closePath`, which defaults to `true` and automatically closes the path before stroking it. The `endIndex` argument is now the fourth argument, instead of the third.
* `Graphics.fillPoints` has renamed the second argument from `autoClose` to `closeShape`. There is also a new third argument `closePath`, which defaults to `true` and automatically closes the path before filling it. The `endIndex` argument is now the fourth argument, instead of the third.
* Calling `Texture.destroy` will now call `TextureManager.removeKey` to ensure the key is removed from the manager, should you destroy a texture directly, rather than going via `TextureManager.remove`. Fix #4461 (thanks @BigZaphod)
* `SpriteSheetFromAtlas` now adds in a `__BASE` entry for the Sprite Sheet it creates, keeping it consistent with the other frame parsers (thanks @Cirras)
* The `from` and `to` properties in the PathFollower Config can now be used to set the span of the follow duration (thanks @kensleebos)
* `Graphics.lineFxTo` and `Graphics.moveFxTo` have been removed as they were not being rendered anyway.
* You can now use "infinite" tilemaps as created in Tiled v1.1 and above. Support is basic in that it takes the chunk data and builds one giant map from it. However, at least you are still able to now load and use infinite maps, even if they don't chunk during the game (thanks @Upperfoot)
* `MapData.infinite` is a new boolean that controls if the map data is infinite or not.
* `DynamicTilemapLayer.destroy` will now remove the layer from the Tilemap it belongs to, clearing it from the layers array. Fix #4319 (thanks @APXEOLOG)
* `StaticTilemapLayer.destroy` will now remove the layer from the Tilemap it belongs to, clearing it from the layers array. Fix #4319 (thanks @APXEOLOG)
* `DynamicTilemapLayer.destroy` has a new optional boolean argument `removeFromTilemap` which will control if the layer is removed from the parent map or not.
* `StaticTilemapLayer.destroy` has a new optional boolean argument `removeFromTilemap` which will control if the layer is removed from the parent map or not.
* `Tilemap.copy` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.fill` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.forEachTile` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.putTilesAt` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.randomize` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.calculateFacesAt` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.renderDebug` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.replaceByIndex` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollision` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionBetween` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionByProperty` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionByExclusion` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setCollisionFromCollisionGroup` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setTileIndexCallback` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.setTileLocationCallback` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.shuffle` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.swapByIndex` now actually returns `null` if an invalid layer was given, as per the docs.
* `Tilemap.weightedRandomize` now actually returns `null` if an invalid layer was given, as per the docs.
* `BaseCamera.cameraManager` is a new property that is a reference to the Camera Manager, set in the `setScene` method.
* `CameraManager.default` is a new property that contains a single un-transformed instance of a Camera, that exists outside of the camera list and doesn't render. It's used by other systems as a default camera matrix.
* The `Graphics` Game Object now has 3 new Transform Matrix instances called `_tempMatrix1` to `_tempMatrix3`, which are used by it during the WebGL Rendering process. This is because Graphics objects can be used as Geometry Masks, which need to retain their own matrix state mid-render of another object, so cannot share the renderer temp matrices that other Game Objects can use. This also indirectly fixes an issue where masked children (such as emitters or container children) would get incorrect camera scroll values.
* The `Key` method signature has changed. It now expects to receive a reference to the KeyboardPlugin instance that is creating the Key as the first argument. This is now stored in the new `Key.plugin` property, and cleared in `destroy`.
* `KeyboardPlugin.removeKey` has a new optional argument `destroy` that will, if set, destroy the Key object being removed from the plugin.
* `InteractiveObject.customHitArea` is a new property that records if the hitArea for the Interactive Object was created based on texture size (false), or a custom shape (true)
* A Camera will pause following a Game Object for the duration of the Camera Pan Effect, as the two will clash over the Camera scroll position (thanks fruitbatinshades).
* `ParseXMLBitmapFont` has now been exposed as a static function on the `BitmapText` object, so you can access it easily from your own code (thanks @jcyuan)
* The math used in the circle to circle Arcade Physics collision has been updated to better handle horizontal collision, giving a more realistic response. Fix #4256 (thanks @akuskis @JeSuisUnCaillou)

### Bug Fixes

* The parent bounds are reset when exiting fullscreen mode in the Scale Manager. This fixes an issue when leaving fullscreen mode by pressing ESC (instead of programmatically) would leave the canvas in the full screen size. Fix #4357 (thanks @khutchins and @HeyStevenXu)
* `GetAdvancedValue` now uses the correct Math RND reference, which means anything that used the `randInt` or `randFloat` features of this function, such as creating a Sprite from a Config object, or Bitmap Text sizing, will no longer throw an error about a null object reference. Fix #4369 (thanks @sanadov)
* Trying to enter Fullscreen mode on Android / Chrome, or iOS / Safari, would throw an error regarding an unhandled Promise and a failure to invoke the event from a user gesture. This has been tightened up, using a proper Promise handler internally and the documentation clarified to explicitly say that you must call the function from a `pointerup` handler, and not `pointerdown`. Fix #4355 (thanks @matrizet)
* Camera fadeIn and fadeOut would sometimes leave a very low alpha-valued rectangle rendering to the camera. Fix #3833 (thanks @bdaenen)
* `Actions.Spread` would only use the `min` value to work out the step value but not apply it to the property being set (thanks @galman33)
* Calling `Tween.pause` returns the Tween instance, however, if it was already paused, it would return `undefined`, causing problems when chaining Tween methods (thanks @kyranet)
* Calling `TweenManager.makeActive` returns the TweenManager instance, however, if you create a tween externally and call `makeActive` with it, this would return `undefined`.
* Setting the `fixedWidth` and / or `fixedHeight` properties in the configuration of a `Text` would be ignored, they were only supported when calling the `setFixedSize` method. They now work via either option. Fix #4424 (thanks @rexrainbow)
* When calculating the width of a Text object for word wrapping it would ignore the extra spaces added from the wrap. It now accounts for these in the width. Fix #4187 (thanks @rexrainbow)
* `Utils.Array.Add` would act incorrectly when adding an object into an array in which it already belonged. This would manifest if, for example, adding a child into a display list it was already a part of. Fix #4411 (thanks @mudala @LoolzRules)
* `Tile.getCenterX` and `Tile.getCenterY` would return the wrong values for tiles on scaled layers. Fix #3845 (thanks @oloflarsson @florianvazelle)
* `Camera.startFollow` will now ensure that if the Camera is using bounds that the `scrollX` and `scrollY` values set after first following the Game Object do not exceed the bounds (thanks @snowbillr)
* Creating a Tween with a `duration` of zero would cause the tweened object properties to be set to `NaN`. Now they will tween for one single frame before being set to progress 1. Fix #4235 (thanks @BigZaphod)
* The First frame of a Texture would take on the appearance of the second frame in a Sprite Sheet created from trimmed Texture Atlas frames. Fix #4088 (thanks @Cirras)
* `Tween.stop` assumed that the parent was the TweenManager. If the Tween has been added to the Timeline, that was not true and the stop method crashed (thanks @TadejZupancic)
* Calling `Tween.restart` multiple times in a row would cause the tween to freeze. It will now disregard all additional calls to `restart` if it's already in a pending state (thanks @rgk)
* Tween Timelines would only apply the `delay` value of a child tween once and not on loop. Fix #3841 (thanks @Edwin222 @Antriel)
* `Texture.add` will no longer let you add a frame to a texture with the same name or index as one that already exists in the texture. Doing so will now return `null` instead of a Frame object, and the `frameTotal` will never be incremented. Fix #4459 (thanks @BigZaphod)
* The InputPlugin will now dispatch an update event, allowing the Gamepad Plugin to update itself every frame, regardless of DOM events. This allows Gamepads to work correctly again. Fix #4414 (thanks @CipSoft-Components)
* Calling `Tween.play` on a tween that had already finished and was pending removal will stop the tween from getting stuck in an `isPlaying` state and will restart the tween again from the beginning. Calling `play` on a Tween that is already playing does nothing. Fix #4184 (thanks @SamCode)
* Declared `Audio.dataset`, which fixes Internet Explorer 10 crashing when trying to access the dataset property of the object (thanks @SirLink)
* The `InputManager.update` method is now called every frame, as long as a native DOM event hasn't already fired it, which allows things like `setPollRate` to work again. Fix #4405 (thanks @Shucki)
* `Pointer.getDuration` would only return zero until the pointer was released, or moved (basically any action that generated a DOM event). It now returns the duration regardless of the DOM events. Fix #4444 (thanks @plazicx)
* `Keyboard.UpDuration` has been changed so the `duration` being checked is now against the current game clock. This means you can use it to check if a Key was released within `duration` ms ago, based on the time now, not the historic value of the Key.
* `Keyboard.DownDuration` has been changed so the `duration` being checked is now against the current game clock. This fixes an issue where it couldn't be used while the Key was actively being held down. Fix #4484 (thanks @belen-albeza)
* Keys would lose track of the state of a Scene when the Scene became paused. They're now updated regardless, stopping them from getting stuck if you pause and resume a Scene while holding them down. Fix #3822 (thanks @DannyT)
* Changing any aspect of a Text object, such as the font size or content, wouldn't update its `hitArea` if it had been enabled for input, causing it to carry on using the old hit area size. Now, as long as the Text was created _without_ a custom hitArea, the hitArea size will be changed to match the new texture size on update. If you have provided your own custom hitArea shape, you need to modify it when the Text changes size yourself. Fix #4456 (thanks @thanh-taro and @rexrainbow)
* `Camera.clearRenderToTexture` will check to see if the Scene is available before proceeding, avoiding potential errors when a Camera is destroyed multiple times during a Scene shutdown.
* Destroying a Game object during its `pointerup` event handler on a touch device will no longer cause `Uncaught TypeError: Cannot read property 'localX' of undefined`. All InputPlugin process handlers now check to see if the Game Object has been destroyed at any stage and abort if it has. Fix #4463 (thanks @PatrickSachs)
* `InputPlugin.clear` has a new argument `skipQueue` which is used to avoid clearing a Game Object twice. This, combined with the fix for 4463 means you will no longer get a `Cannot read property 'dragState'` error if you destroy a Game Object enabled for drag where another draggable object exists. Fix #4228 (thanks @YannCaron)
* `UpdateList.remove` will now move the removed child to the internal `_pendingRemoval` array, instead of slicing it directly out of the active list. The pending list is cleared at the start of the next game frame. Fix #4365 (thanks @jcyuan)
* Setting `pixelPerfect` when input enabling a Container would cause it to crash, because Containers don't have a texture to check. It will now throw a run-time warning and skip the Container for input. You should use a custom input callback instead. Fix #4492 (thanks @BigZaphod)
* Setting `fixedWidth` and `fixedHeight` on a Text object will now clamp the size of the canvas being created, as well as the width and height properties of the Text object itself (thanks @rexrainbow)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@sky-coding @G-Rath @S4n60w3n @rootasjey @englercj @josephmbustamante @Jason-Cooke @Zamiell @krzysztof-grzybek @S4n60w3n @m31271n @peterellisjones @martinlindhe @TylerMorley @samme @schomatis @BeLi4L @hizzd @OmarShehata @antoine-pous @digitsensitive

Also, thanks to @Osmose there is a new Dashing config added to the Phaser 3 Docs Repo, with a new command `build-docset` which will build a [Dash](https://kapeli.com/dash) compatible docset for those who like to use Dash for their docs.

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.17.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.17.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
