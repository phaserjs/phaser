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

> 20th September 2018

Phaser 3.13 is now available. The main feature introduced in this release is the Facebook Instant Games Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync. My thanks to Facebook for helping make this possible.

Also in this release is the brand new Shape Game Object, which allows for easy and quick addition of geometry onto the display list. Easily add rectangles, triangles, curves, stars and more into your game and treat them just like any other Game Object. Perfect for place-holder art, abstract style games or just really fast iterations game-jam style.

It doesn't end there either. There are some important changes to Pointer Events, lots of updates and fixes and more documentation updates too. My thanks to the highly active community for helping out, reporting issues and providing PRs. I'd urge you to carefully read the Change Log, especially if upgrading from an earlier version in an existing project.

3.13 yet again represents tireless effort on my part to get it fully production ready. I'm seeing lots more games being released with Phaser 3 and stacks of tutorials and plugins are starting to surface. My aim has always been to continue the mission of enhancing Phaser 3 as quickly as I can. It means releasing significant updates in relatively short periods of time. But it also means I'm jumping on bug reports as quickly as I can, keeping the issues list total nice and low (the vast majority of the items in there are feature requests now!) - a massive thank-you to all of you who support Phaser on Patreon and PayPal. It's your support that allows me to work on this full-time, to the benefit of everyone.

As always, please check out the [Change Log](#changelog) for comprehensive details about what recent versions contain.

**About Phaser 3**

After 1.5 years in the making, tens of thousands of lines of code, hundreds of examples and countless hours of relentless work: Phaser 3 is finally out. It has been a real labor of love and then some!

This has been a great new chapter in Phaser's life. I will continue to jump on bug reports as quickly as possible and ensure the releases keep flowing.

If you'd like to stay abreast of developments then I publish the [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from the core team and the wider community.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.13/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.13/dist/phaser.min.js"></script>
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.13/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.13/dist/phaser-facebook-instant-games.min.js"></script>
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

## Version 3.13.0 - Yuuki - 20th September 2018

### Facebook Instant Games Plugin

Phaser 3.13 introduces the new Facebook Instant Games Plugin. The plugin provides a seamless bridge between Phaser and version 6.2 of the Facebook Instant Games SDK. Every single SDK function is available via the plugin and we will keep track of the official SDK to make sure they stay in sync.

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

### New Shape Game Objects

Phaser 3.13 has a new Game Object called `Shape`, which by itself isn't much use because it's a base class. However, extending that class are 11 different types of Shape (with more to come) and you can use it to create your own custom Shapes as well. Shapes are added to the display list in the exact same way as any other Game Object. For example:

```
this.add.rectangle(400, 300, 500, 120, 0x00ff00);
```

Here we're creating a new Rectangle shape. It's positioned at 400 x 300 in the Scene and has a size of 500 x 120 pixels. The final value is the fill color.

The thing to remember is that you can treat this Shape just like you'd treat any other Game Object. You can scale it, rotate it, alpha it, blend mode it, change its origin, give it a Camera scroll factor, put it inside a Container or Group, give it input abilities or even give it a physics body. It is, to all intents and purposes, a normal Game Object. The only difference is that when rendering it uses its own special bit of display code.

The shapes available are as follows:

* `GameObject.Arc` - The arc allows you to draw either a circle, or part of a circle. You can set the start and end angle, if the rotation is clockwise or not, and even set the number of iterations the arc will use during rendering.
* `GameObject.Curve` - The Curve Shape can take any Phaser Curve object, such as a Spline or Bezier Curve, and add it to the display list.
* `GameObject.Ellipse` - An ellipse shape, which is essentially a circle with a differing width and height. It can be filled or stroked (or both!) and as with the arc you can set the 'smoothness' of it, allowing you to decrease the number of points used when creating its polygon data.
* `GameObject.Grid` - The Grid Shape object allows you to generate them. You can set the width and height of the grid itself, as well as for the grid cells. The grid can either have a single color, or alternating cell colors and even have outline spacing between the cells, or not.
* `GameObject.Line` - Create a Line Shape drawn between any two points, with a color and thickness. In WebGL you can also specify a different thickness for the start and end of the line.
* `GameObject.Polygon` - A Polygon is effectively a list of points that is drawn between. The points can be provided in a number of different ways (as Vec2 objects, as an array, etc) and then you can either fill or stroke the resulting shape, or both.
* `GameObject.Rectangle` - Simple, but powerful and endlessly useful. Set a width and height and it'll display a Rectangle, with control over the size, fill color and stroke color.
* `GameObject.Star` - The Star shape does as its name suggests: it displays a star. You can control the number of points in the star as well as the inner and outer radius of it.
* `GameObject.Triangle` - A Triangular shape with full control over the points used to make it and its fill and stroke colors. Internally it uses the `batchFillTriangle` method in WebGL, making it actually faster to draw than a Quad! Use them happily for bullets or abstract space ships, or anything else you feel like.
* `GameObject.IsoTriangle` - This draws an isometric triangle, like a pyramid. You can control the colors of each face, if the pyramid is upside down or not and the width and height of it.
* `GameObject.IsoBox` - This draws an isometric box. You can set the colors for each face of the box, as well as the projection angle and also which of the 3 faces are drawn.

All of the Shape objects render in both Canvas and WebGL and are available via the Game Object Factory.

### Pointer and Input Event Updates

The specificity if the input events has been changed to allow you more control over event handling. Previously, the InputPlugin would emit the global `pointerdown` event first, and then the Game Object itself would emit the `pointerdown` event and finally the InputPlugin would emit the `gameobjectdown` event.

The order has now changed. The Game Object will dispatch its `pointerdown` event first. The InputPlugin will then dispatch `gameobjectdown` and finally the less specific of them all, `pointerdown` will be dispatched.

New in 3.13 is the ability to cancel this at any stage. All events are now sent an event object which you can call `event.stopPropagation()` on. This will immediately stop any further listeners from being invoked. If you call `stopPropagation()` after the first Game Object `pointerdown` event, then no more Game Object's will receive their callbacks and the InputPlugin will not dispatch either of its events.

This change has been introduced for `pointerdown`, `pointerup`, `pointermove`, `pointerover` and `pointerout`. No other data is included in the `event` object in this release.

* The Game Object `pointerdown` callback signature has changed. It used to send `pointer, x, y, camera` to the listener. It now sends `pointer, x, y, event` to the listener. If you still need the `camera` property you can get it from `pointer.camera`.
* The Game Object `gameobjectdown` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerdown` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerdown` and `gameobjectdown`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointerup` callback signature has a new argument. It now sends the `event` as the 4th argument.
* The Game Object `gameobjectup` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerup` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerup` and `gameobjectup`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointermove` callback signature has a new argument. It now sends the `event` as the 4th argument.
* The Game Object `gameobjectmove` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointermove` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointermove` and `gameobjectmove`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointerover` callback signature has a new argument. It now sends the `event` as the 4th argument.
* The Game Object `gameobjectover` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerover` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerover` and `gameobjectover`). This gives you the chance to cancel the event before the global listener receives it.
* The Game Object `pointerout` callback signature has a new argument. It now sends the `event` as the 2nd argument.
* The Game Object `gameobjectout` callback signature has a new argument. It now sends `event` as the 3rd argument.
* The `pointerout` event, as dispatched by the InputPlugin, is now sent _after_ the Game Object specific events (`GameObject.pointerout` and `gameobjectout`). This gives you the chance to cancel the event before the global listener receives it.

### Game Object List Updates

When Sprite's are created they are added to two lists within the Scene - the Display List and the Update List. Under 3.12 when a Scene was shut down it would emit a `shutdown` event, which Sprites listened out for. When they received it, they would destroy themselves.

After [profiling and testing](https://github.com/photonstorm/phaser/issues/4028) this process has changed slightly. Game Object's no longer listen for the Scene `shutdown` event. Instead, the Display List and Update List will iterate their children and call `destroy` on them in turn. If being destroyed by a Scene in this way, the child will skip several expensive operations in its destroy function. More importantly, in busy Scenes you no longer need thousands of event listeners registered. The result is that changing Scene is now up to 100% faster than before. You need not change your code to benefit from this, however, if you were relying on custom Game Objects listening for the Scene `shutdown` event natively, then this is no longer the case and you'll have to manually add that listener to your classes.

* The UpdateList will now clear out its internal `_list`, `_pendingRemoval` and `_pendingInsertion` lists on shutdown. Before, it would only clear `_list`.
* `GameObject.destroy` has a new optional boolean argument `fromScene`, which controls how the destroy process flows.

### Camera Render to Texture

In 3.12 a new Camera method called `setRenderToTexture` was introduced. However, it had known issues so was placed under the experimental flag and you were advised not to use it unless in testing.

Thanks to several fixes in this release the experimental flag has been dropped and it's now safe to try using this new feature in production.

The method sets the Camera to render to a texture instead of to the main canvas. The Camera will redirect all Game Objects it's asked to render to this texture. During the render sequence, the texture itself will then be rendered to the main canvas.

Doing this gives you the ability to modify the texture before this happens, allowing for special effects such as Camera specific shaders, or post-processing on the texture.

* `Camera.setRenderToTexture` is a new method that enables the Camera to render to a target texture instead of the main canvas, allowing for application of special effects at run-time.
* `Camera.clearRenderToTexture` is a new method that stops a Camera from rendering to a texture and frees-up all associated resources.
* `Camera.setPipeline` allows you to change the WebGL pipeline being used if the Camera is rendering to a texture, effectively swapping the active shader. Call with no arguments to clear the pipeline.
* `Camera.renderToTexture` is a boolean property that controls where the Camera renders. It can be toggled on the fly.
* `Camera.canvas` is a Canvas Element that the Camera will render to if running under the Canvas Renderer and rendering to a texture.
* `Camera.context` is a Rendering Context that the Camera will render to if running under the Canvas Renderer and rendering to a texture.
* `Camera.glTexture` is a WebGL Texture that the Camera will render to if running under the WebGL Renderer and rendering to a texture.
* `Camera.framebuffer` is a WebGL Frame Buffer that the Camera will render to if running under the WebGL Renderer and rendering to a texture.
* `Camera.pipeline` is the Pipeline that the Camera will render with if running under the WebGL Renderer and rendering to a texture with a pipeline set.
* If you set a Camera to render to a texture then it will emit 2 events during the render loop. First, it will emit the event `prerender`. This happens right before any Game Object's are drawn to the Camera texture. Then, it will emit the event `postrender`. This happens after all Game Object's have been drawn, but right before the Camera texture is rendered to the main game canvas. It's the final point at which you can manipulate the texture before it appears in-game.

### New Features

* The `Color` object has a new property `h` which represents the hue of the color. You can tween or adjust this property in real-time and it will automatically update the internal RGB values with it.
* The `Color` object has a new property `s` which represents the saturation of the color. You can tween or adjust this property in real-time and it will automatically update the internal RGB values with it.
* The `Color` object has a new property `v` which represents the lightness value of the color. You can tween or adjust this property in real-time and it will automatically update the internal RGB values with it.
* `Color.setFromHSV` is a new method that will set the color values based on the HSV values given.
* `Color.gray` is a new method that will set the color to be a shade of gray based on the amount given.
* `Color.random` is a new method that will set the color to be a random hue based on the min and max values given.
* `Color.randomGray` is a new method that will set the color to be a random grayscale based on the min and max values given.
* `Color.saturate` is a new method that will saturate the color based on the amount given. This is a chainable version of adjusting the saturation property directly.
* `Color.desaturate` is a new method that will desaturate the color based on the amount given. This is a chainable version of adjusting the saturation property directly.
* `Color.lighten` is a new method that will lighten the color based on the amount given. This is a chainable version of adjusting the value property directly.
* `Color.darken` is a new method that will darken the color based on the amount given. This is a chainable version of adjusting the value property directly.
* `Color.brighten` is a new method that will brighten the color based on the amount given.
* The `CanvasTexture` class has a new property `imageData` which contains the ImageData of the texture.
* The `CanvasTexture` class has a new property `data` which is a Uint8ClampedArray view into the `buffer`.
* The `CanvasTexture` class has a new property `pixels` which is a Uint32Array view into the `buffer`.
* The `CanvasTexture` class has a new property `buffer` which is an ArrayBuffer the same size as the context ImageData.
* The `CanvasTexture` class has a new method `update` which refreshes the ImageData and ArrayBuffer based on the texture contents.
* The `CanvasTexture` class has a new method `draw` which draws the given Image or Canvas element to the CanvasTexture, then updates the internal ImageData buffer and arrays.
* The `CanvasTexture` class has a new method `getPixel` which will get the color of a specific pixel from the Canvas Texture and store it in the returned Color object. It uses the ArrayBuffer to do this, which is extremely fast, allowing for quick iteration across the canvas data.
* The WebGLPipeline and WebGLRenderer have new a method `setFloat1v` which allows you to set a `uniform1fv` uniform value (thanks @Mattykins)
* The WebGLPipeline and WebGLRenderer have new a method `setFloat2v` which allows you to set a `uniform2fv` uniform value (thanks @Mattykins)
* The WebGLPipeline and WebGLRenderer have new a method `setFloat3v` which allows you to set a `uniform3fv` uniform value (thanks @Mattykins)
* The WebGLPipeline and WebGLRenderer have new a method `setFloat4v` which allows you to set a `uniform4fv` uniform value (thanks @Mattykins)
* `Text.setLineSpacing` is a new method that allows you to easily set the line spacing value of a Text object in a chainable call (thanks @RafelSanso)

### Updates

* The Graphics Canvas Renderer will now automatically call `beginPath` on the target context before processing the command stack. This has the effect of clearing off any sub-paths that may have persisted on the stack from previous Graphics objects or frames. This makes it more in-line with WebGL re: expectations when calling `Graphics.clear`.
* `initPipeline` now defaults to the Texture Tint Pipeline if nothing else is specified. This allowed me to remove explicit strings from 11 different Game Objects, saving some bytes in the process.
* The `RGBToHSV` function can now take an optional `out` argument, which is either a `HSVColorObject` or a `Color` object, and the results will be set into that object instead of creating a new one.
* The `HSVToRGB` function can now take an optional `out` argument, which is either a `HSVColorObject` or a `Color` object, and the results will be set into that object instead of creating a new one.
* `Color.setTo` has a new argument `updateHSV` which allows you to control if the internal HSV values are updated during the same call or not.
* The `Text._lineSpacing` property has been renamed to `lineSpacing` and made public, not private. You still set it in the same way, by passing a `lineSpacing` property to the Text configuration object, but internally it's now clearer.
* If a Scene is already active (i.e. running) and you call `start` on it (such as from another Scene) then it will shutdown the Scene first, before starting it again.

### Bug Fixes

* TileSprite.setTileScale would set the tile position by mistake, instead of the scale. Using the properties directly worked, but the method was incorrect (thanks @alexeymolchan)
* Calling `Text.setStyle` would make the Text vanish if you didn't provide a `resolution` property in the style configuration object. Calling `setStyle` now only changes the properties given in the object, leaving any previously changed properties as-is. Fix #4011 (thanks @okcompewter)
* In Matter.js if a body had its debug `render.visible` property set to `false` it wouldn't then render any other debug body beyond it. Now it will just skip bodies with hidden debug graphics (thanks @jf908)
* If you flagged a Tween as `paused` in its config, never started it, and then called `Tween.stop` it wouldn't ever be removed from the `_pending` array. It's now moved to the Tween Manager's destroy list, ready for removal on the next frame. Fix #4023 (thanks @goldfire)
* Game Objects would not remove themselves from the Scene's `shutdown` event handler when destroyed, leading to a build-up over time (thanks @goldfire)
* The WebGL Renderer will no longer try and just resize a canvas backed texture, instead it will properly delete it then re-create it. Fix #4016 (thanks @alexeymolchan)
* The Camera background for mini-Cameras (those positioned deep inside another Camera) would be offset incorrectly in WebGL, causing the background fills to be displaced (thanks @aaronfc)
* The WebGL Renderer now always enables the `SCISSOR_TEST`, this allows Game Objects that use the scissor (such as custom objects, or Bitmap Text) to render properly again.
* The Cameras `setScene` method, which is called automatically when a new Camera is created, will now call `updateSystem` which correctly increases the custom viewport counter. This fixes an issue with mini-cams inside of larger cameras not clipping their contents properly. If a Camera is moved to another Scene it also now correctly shrinks the total custom viewport counter.
* Due to the two fixes above another bug was fixed: The ability for you to swap between Cameras with and without `setRenderToTexture` enabled with custom shaders. Previously if you used this with a custom shader then only the first Camera using the shader would render, the rest would appear black. Now, all Cameras using the custom shader work correctly. As a result all of the 'experimental' Camera rendering properties from 3.12 have been moved to stable.
* If you destroyed a Game Object that had a custom cursor set during one of its input events the cursor didn't correctly reset. Fix #4033 (thanks @pantoninho)
* `RenderTexture.resize` wouldn't correctly resize the texture under WebGL. Fix #4034 (thanks @jbpuryear)
* Calling `setFrame` on a TileSprite wouldn't change the frame, it would just change the frame size. Fix #4039 (thanks @Jerenaux)
* `Zone.setRectangleDropZone` used the wrong `x` and `y` coordinates for the hit area, causing it to be offset from the zone itself after the changes made for issue #3865 in the 3.12 release.

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@johanlindfors @Arthur3DLHC @JamesSkemp

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
