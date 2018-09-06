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

> 4th September 2018

I'm pleased to announce the immediate availability of Phaser 3.12. As usual the Change Log is massive, so please take your time to digest it. There are a huge number of significant improvements including lots of updates to the Flat Tint Pipeline, increasing Graphics and Image rendering speeds dramatically. I've also worked hard on improving the Render Textures feature, WebGL scissor handling, new Text and TileSprite features and added new Tilemap rendering modes.

It doesn't end there either. Matter.js has been updated, High DPi support is now a lot better than before, the Camera 3D system has moved to its own plugin and masses of other updates and fixes across the whole API. My thanks to the highly active community for helping out, reporting issues and providing PRs. I'd urge you to carefully read the Change Log, especially if upgrading from an earlier version in an existing project.

3.12 represents tireless effort on my part to get it fully production ready. I'm seeing lots more games being released with Phaser 3 and stacks of tutorials and plugins are starting to surface. My aim has always been to continue the mission of enhancing Phaser 3 as quickly as I can. It means releasing significant updates in relatively short periods of time. But it also means I'm jumping on bug reports as quickly as I can, keeping the issues list total nice and low (the vast majority of the items in there are feature requests now!) - a massive thank-you to all of you who support Phaser on Patreon and PayPal. It's your support that allows me to work on this full-time, to the benefit of everyone.

As always, please check out the [Change Log](#changelog) for comprehensive details about what recent versions contain.

**About Phaser 3**

After 1.5 years in the making, tens of thousands of lines of code, hundreds of examples and countless hours of relentless work: Phaser 3 is finally out. It has been a real labor of love and then some!

Please understand this is a bleeding-edge and brand new release. There are features we've had to leave out, areas of the documentation that need completing and so many cool new things we wanted to add. But we had to draw a line in the sand somewhere and 3.0.0 represents that.

For us this is just the start of a new chapter in Phaser's life. We will be jumping on bug reports as quickly as we can and releasing new versions rapidly. We've structured v3 in such a way that we can push out point releases as fast as needed.

We publish our [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from us and the wider Phaser community.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.12/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.12/dist/phaser.min.js"></script>
```

### API Documentation

1. Go to https://photonstorm.github.io/phaser3-docs/index.html to read the docs online. Use the drop-down menus at the top to navigate the name spaces, classes and Game Objects lists. If you wish to run the docs locally you can ...
2. Checkout the [phaser3-docs](https://github.com/photonstorm/phaser3-docs) repository and then read the documentation by pointing your browser to the local `docs/` folder, and again selecting from the Classes or Namespaces links at the top of the page.

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

Phaser 3 is so new the "paint is still wet", but tutorials and guides are starting to come out!

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* [Phaser 3 Bootstrap and Platformer Example](https://phaser.io/news/2018/02/phaser-3-bootstrap-platformer)

Also, please subscribe to the [Phaser World](https://phaser.io/community/newsletter) newsletter for details about new tutorials as they are published.

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets. Until these examples are fully integrated into the Phaser website, you can browse them on [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

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

Phaser 3 is built using Webpack and we take advantage of the Webpack definePlugin feature to allow for conditional building of the Canvas and WebGL renderers.

There is a [comprehensive guide](https://madmimi.com/p/ffcfbc) on creating Custom Builds of Phaser 3 in Issue 127 of our newsletter.

### Building from Source

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install`.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

## Version 3.12.0 - Silica - 4th September 2018

### FlatTintPipeline Updates

In 3.11 I overhauled the TextureTintPipeline, the WebGL batch used to render all texture based Game Objects, such as Sprites. In this release I did the same to the FlatTintPipeline. This pipeline was used exclusively by the Graphics Game Object to draw filled and stroked primitives in WebGL. It was also used by classes such as the Camera in order to draw their colored backgrounds and flash / fade effects.

When I looked closely at the shaders being used by the texture and graphics pipelines I noticed they were virtually identical. Yet if you were to mix Graphics objects and Sprites in your game, it would cause a complete batch flush as it switched between the them as it rebound the shaders, adding to both the draw calls and gl ops per frame.

The more I looked through the graphics pipeline, the more I saw the same kind of things the texture one previously had: duplicate vars, in-line matrix operations and so on. So I worked through the process of refactoring it, boiling it down to just a handful of core methods and re-using methods the texture pipeline already had. The end result is that I've been able to remove the FlatTintPipeline entirely. This saves 42.3KB (unminifed) and removes 1000 lines of code from the build. Of course, lots of the methods were added to the texture pipeline, but that only increased from 730 sloc to 1087 sloc, a fraction of the amount before! And the benefits don't end there.

If you had any custom pipelines that extended the FlatTintPipeline please update them to extend the TextureTintPipeline instead. You'll likely need to remap a few methods, but most of them remain the same. Double-check the method signatures though.

The same pipeline can now draw both graphics and sprites, with the same shader and no texture swapping either. This means you can happily mix Graphics objects alongside Sprites and it won't cost any extra overhead at all. There are more benefits too, which are outlined in the list below.

* The TextureTintPipeline now has 100% jsdoc coverage.
* The removal of the FlatTintPipeline shaves 42.3KB and 1000 sloc from the bundle size.
* The Graphics fill and line styles are now cached in the pipeline, rather than being re-calculated for every primitive drawn.
* The new `batchTri` method will add a triangle to the vertex batch, either textured or filled.
* `drawFillRect` is a new method that will add an untransformed rectangle to the batch. These are used by things like Cameras to fill in background colors.
* `batchFillRect` has been moved to the TextureTintPipeline and has a new much more concise method signature.
* `batchFillTriangle` has been moved to the TextureTintPipeline and has a new much more concise method signature.
* `batchFillPath` has been moved to the TextureTintPipeline and has a new much more concise method signature.
* `batchLine` has been moved to the TextureTintPipeline.
* When drawing Graphics paths with a line width of 1 it will no longer spend any time drawing the line joins, speeding-up the rendering of 1px lines.

### WebGL Scissor Update

The process of managing scissors in the WebGLRenderer has been completely rewritten. Previously, the gl scissor was being constantly enabled and disabled for every Camera in your game, leading to pointless gl operations.

* Cameras have a new internal method `updateSystem` which is automatically called if you change any Camera viewport values. This in turn tells the Scene Manager if there are any cameras with custom viewports, in any Scene of your game. If there are not then the scissor is never even enabled or set, meaning zero gl ops! If your game uses full sized Cameras it now doesn't cost anything at all with regard to scissoring.
* If a new scissor is set it will now check to see if it's the same size and position as the current scissor, and if so, it'll skip setting it at all.

### Render Texture New Features and Updates

The Render Texture class has been rewritten from scratch and all Game Objects have been updated to support it. Previously it was very restricted in what you could do with it. It used to have a matrix stack for internal transforms, but this has been replaced with a Camera instead. This means you have the full power of a Camera system (scrolling, zooming, rotation) but it only impacts the contents of the Render Texture.

* The biggest update is the change in what the `draw` method can accept. Previously you had to pass in a texture and frame reference. This has changed, as has the method signature. It can now accept any of the following:

    - Any renderable Game Object, such as a Sprite, Text, Graphics or TileSprite.
    - Dynamic and Static Tilemap Layers.
    - A Group. The contents of which will be iterated and drawn in turn.
    - A Container. The contents of which will be iterated fully, and drawn in turn.
    - A Scene. Pass in `Scene.children` to draw the whole display list.
    - Another Render Texture.
    - A Texture Frame instance.
    - A string. This is used to look-up a texture from the Texture Manager.

* There is a new method `drawFrame` which allows you to pass in a string-based texture and frame key and have it drawn to the Render Texture.
* The new method `saveTexture` allows you to save the Render Texture into the Texture Manager using your own key. You can then use the Render Texture for any Game Object that accepts textures as a source, such as Sprites or even Tilemap Layers. You can add frame data to a Render Texture using the `RenderTexture.texture.add` method.
* The new `camera` property is an instance of a complete 2D Camera. You can use it to change the view into your Render Texture. Scroll, rotate, zoom, just like you would with a normal Camera, except it will only influence the objects being drawn to the Render Texture.
* All of the matrix-style methods have been removed: `save`, `translate`, `restore`, `scale`, `rotate`. You can now achieve the same thing by either transforming the object you want to draw to the Render Texture, or using the built-in Camera.
* You can now crop a Render Texture. Use the `setCrop` method to define the crop region.

See the fully complete documentation for more details and the extensive examples and tests created.

### Text Game Object New Features and Updates

The Text Game Object has been given an internal overhaul to make it more flexible. Some properties have been renamed or moved and new features added:

* Text can now be cropped in WebGL and Canvas! Use the `setCrop` method to crop the text.
* Text now keeps a reference to the renderer in the `renderer` property.
* The `canvasTexture` property has been removed.
* Text now has internal `texture` and `frame` properties. These replace the old `canvasTexture` but perform the same task, while allowing for texture cropping and much smaller renderer code.
* Previously, changing a Text object by setting its `text` property directly wouldn't change the text being rendered as using `setText` was the expected way to change what was being displayed. Internally the `text` property has been renamed to `_text` and flagged as private, and a new getter / setter for `text` has been added, which hands over to the `setText` method, meaning you can now use both ways of setting the text. Fix #3919 (thanks @hackhat @samid737)

### Tile Sprite Object New Features and Updates

The Tile Sprite Game Object has been given an internal overhaul to make it more flexible. Some properties have been renamed or moved and new features added:

* Tile Sprites can now be cropped in WebGL and Canvas! Use the `setCrop` method to crop the tile sprite.
* There is a new method `setTileScale` which will set the tile scale in a chainable call.
* There is a new internal `canvas` property. Tile Sprites work differently than before in Canvas mode: Previously they would use the `fillRect` command on the game canvas to draw themselves every frame, even if they hadn't changed. They now draw to an internal canvas only when their position or scale changes. This canvas is then drawn to the game canvas instead. It's faster, as it doesn't fillRect every frame and also allows you to draw them to other contexts, such as Render Textures.
* There are two new internal properties `_tilePosition` and `_tileScale` which are Vector 2s that hold the position and scale. Getters have been added, so use the same properties as before in your code.
* There are two new properties `displayTexture` and `displayFrame`. These replace the previous `texture` and `frame` properties and hold references to the source texture the Tile Sprite is using.
* The `canvasPattern` property has been renamed to `fillPattern`.
* The `oldFrame` property has been removed.
* The `canvasBuffer` property has been renamed to `fillCanvas`.
* The `canvasBufferCtx` property has been renamed to `fillContext`.

### Tilemap New Features and Updates

The Tilemap and Dynamic and Static Tilemap Layer classes now all support 4 different modes of render order for drawing the tiles. This allows you to control the z-order of the tiles during render. This feature was requested by @etienne (who provided the test maps too) - see the new examples in the Labs for better understand the impact this has.

The default is 'right-down', meaning it will order the tiles starting from the top-left, drawing to the right and then moving down to the next row.

The four draw orders are:

0 = right-down
1 = left-down
2 = right-up
3 = left-up

* Tilemap has a new property `renderOrder` which is a string based version of the render order, as used when new layers are created via the map. If the map is created from Tiled JSON data, it will use whatever render order has been specified in the map data.
* Tilemap has a new method `setRenderOrder`. This takes either an integer or a string-based version of the render order and stores it locally. It's then used during the creation of any layers from that point on.
* The DynamicTilemapLayer has a new method `setRenderOrder`. This takes either an integer or a string-based version of the render order and stores it locally. It's then used during rendering of the layer. You can change the value on the fly.
* The StaticTilemapLayer has a new method `setRenderOrder`. This takes either an integer or a string-based version of the render order and stores it locally. Under WebGL it will re-create the whole vertex buffer, using the new draw order. Under Canvas it uses it at run-time during rendering. You can change it on the fly.
* ParseJSONTiled now extracts the `renderorder` property from the Tiled JSON.
* MapData has a new `renderOrder` property, which is populated by the Tiled Parser.

### Matter.js Updates

The version of Matter.js used by Phaser has been updated from 0.13.1 to 0.14.2. To clarify why we don't include Matter via npm, it's because we use a customized version of Matter that includes extra features and optimizations not yet found in the official library.

Most of the updates were about documentation and module namespacing, however those relevant to Phaser are listed below. You can also view the full [Matter Change Log](https://github.com/liabru/matter-js/blob/master/CHANGELOG.md).

* fix Composite.bounds global issue, closes #627, closes #544 ([f7f77b4](https://github.com/liabru/matter-js/commit/f7f77b4)), closes [#627](https://github.com/liabru/matter-js/issues/627) [#544](https://github.com/liabru/matter-js/issues/544)
* updated pathseg library, closes #548, closes #602, closes #424 ([1e5758f](https://github.com/liabru/matter-js/commit/1e5758f)), closes [#548](https://github.com/liabru/matter-js/issues/548) [#602](https://github.com/liabru/matter-js/issues/602) [#424](https://github.com/liabru/matter-js/issues/424)
* fix Common.isElement on node, closes #535 ([ec38eeb](https://github.com/liabru/matter-js/commit/ec38eeb)), closes [#535](https://github.com/liabru/matter-js/issues/535)
* added Query.collides, closes #478 ([6593a72](https://github.com/liabru/matter-js/commit/6593a72)), closes [#478](https://github.com/liabru/matter-js/issues/478)
* fix `point` argument of Body.scale, closes #428 ([894c1ef](https://github.com/liabru/matter-js/commit/894c1ef)), closes [#428](https://github.com/liabru/matter-js/issues/428)
* fix Body.scale for compound bodies ([50a89d0](https://github.com/liabru/matter-js/commit/50a89d0))
* fix centroid for static compound bodies, closes #483 ([ece66e6](https://github.com/liabru/matter-js/commit/ece66e6)), closes [#483](https://github.com/liabru/matter-js/issues/483)
* fix Common.isElement, closes #501, closes #507, closes #459, closes #468, closes #517 ([18a0845](https://github.com/liabru/matter-js/commit/18a0845)), closes [#501](https://github.com/liabru/matter-js/issues/501) [#507](https://github.com/liabru/matter-js/issues/507) [#459](https://github.com/liabru/matter-js/issues/459) [#468](https://github.com/liabru/matter-js/issues/468) [#517](https://github.com/liabru/matter-js/issues/517)
* fix inertia change in Body.setMass, closes #378 ([f7d1877](https://github.com/liabru/matter-js/commit/f7d1877)), closes [#378](https://github.com/liabru/matter-js/issues/378)
* fix Vertices.chamfer radius argument, closes #467 ([3bceef4](https://github.com/liabru/matter-js/commit/3bceef4)), closes [#467](https://github.com/liabru/matter-js/issues/467)

### Camera 3D Plugin

Support for Camera 3D and Sprite 3D Game Objects have been removed from the core Phaser bundle and moved to an optional plugin.

You can find the source for Camera 3D in the new `plugins/camera3d` folder, along with a README file explaining how to now use the plugin in your games.

* When a Sprite3D object is added to a Camera via `Camera.add` it is now added to the Display and Update Lists. Fix #3945 (thanks @vvega)

### New Features

* `Camera.resolution` is a new read-only property that holds the current game config resolution that the camera is using. This is used internally for viewport calculations.
* `Text.resolution` and the method `Text.setResolution` allows you to control the resolution of a Static Text Game Object. By default it will be set to match the resolution set in the Game Config, but you can override it yourself via the TextStyle. It allows for much clearer text on High DPI devices, at the cost of larger internal Canvas textures for the Text - so please use with caution, as the more high res Text you have, the more memory it uses up. Fix #3528 (thanks @kirillbunin)
* `TransformMatrix.getCSSMatrix` will return a CSS transform matrix formatted string from the current matrix values.
* `CacheManager` now creates a new cache called `html` which is used to store all loaded HTML snippets.
* `FileType.HTML` is a new file type loader that will load an HTML snippet and store it in the new `html` cache. Access it via `load.html` (this method was previously used to load html to textures, please see `load.htmlTexture` for this feature now)
* `TransformMatrix.getX` is a new method that return the x component from the given x and y values based on the current matrix. This is used heavily in the pipelines.
* `TransformMatrix.getY` is a new method that return the y component from the given x and y values based on the current matrix. This is used heavily in the pipelines.
* `TransformMatrix.copyToArray` is a new method that will copy the matrix values to the given array. It's the counter-part of `copyFromArray`.
* `Graphics.setTexture` is a new WebGL only method that allows you to set a texture to be used when drawing the shapes on the Graphics object. You can also specify how the texture should be blended with the current fill or gradient colors. Note that the texture is not tiled, it is stretched to fit the shape being drawn.
* `Graphics.fillGradientStyle` is a new WebGL only method that allows you to set a gradient for the shapes being filled. You can control the colors at the 4 corners of a rectangle. The colors are then blended automatically in the shader. Use of this feature is limited. For example, you cannot gradient fill a whole path or an arc, as it's made up of lots of triangles. But for quick gradient backgrounds or buttons it's perfect.
* `Graphics.lineGradientStyle` is a new WebGL only method that allows you to set a gradient for the shapes being stroked. You can control the colors at the 4 corners of a rectangle. The colors are then blended automatically in the shader. Use of this feature is limited. For example, you cannot gradient stroke a whole path or an arc, as it's made up of lots of triangles. But for quick gradient lines it's perfect.
* `TextureManager.getBase64` is a new method that will take a texture frame key and return a base64 encoded version of the frame. You can also provide the image type and encoder options.
* Global Plugins now have a new optional `data` object, the contents of which are passed to the plugins `init` method. This allows users to pass data directly into a plugin when added in the config: `{ key: 'BankPlugin', plugin: BankPluginV3, start: true, data: { gold: 5000 } }` or when adding a plugin via the `install` method (thanks @samme)
* You can now play animations in reverse! Use the new `Sprite.anims.playReverse` method to play a pre-defined animation in reverse from its starting frame. Or call `Sprite.anims.reverse` to immediately reverse the flow of an already running animation. Animations running in reverse still count towards the repeat total and respect the yoyo flag (thanks @khaleb85 @Ben-Millions)
* The `ParticleEmitterManager` now has the Transform component. This means you can now set the position, rotation or scale of the Emitter Manager, and it will influence every Emitter it is rendering. The Managers transform is mixed with that of the Camera. This works in both Canvas and WebGL.
* `TextureManager.addRenderTexture` is a new method that will add a Render Texture into the Texture Manager, allowing you to use it as the texture for Game Objects just by using the texture key. Modifying the source Render Texture will immediately modify any Game Objects using it.
* TextureSource has a new boolean property `isRenderTexture` which is set automatically when it's created.
* The Canvas Renderer has a new method `setContext` which allows it to swap the context being drawn to by all draw operations. Call the method with no arguments to reset it to the default game canvas.
* If you set `window.FORCE_WEBGL` or `window.FORCE_CANVAS` in the window in which the Phaser game is loaded it will over-ride the renderer type setting in your game config, and force either WebGL or Canvas. This is handy for quickly testing the differences between renderers without having to do a new build each time.
* `TextureSource.source` is a new property that contains the original source of the Texture image. It is cleared when the source is destroyed.
* `TransformMatrix.copyToContext` is a new method that will copy the values from the Matrix to the given Canvas Rendering Context.
* `Phaser.Utils.String.UUID` will return an RFC4122 complaint UUID as a string. This is used internally to avoid cache key conflicts, but is exposed for your own use as well.
* There is a new `Crop` Component which is used by non-texture based Game Objects, such as Text and TileSprite. You either use `TextureCrop` or `Crop`, not both together on the same object.
* `TransformMatrix.setToContext` is a new method that will set the values from the Matrix to the given Canvas Rendering Context using setTransform rather than transform.
* `SetTransform` is a new Canvas Renderer function that consolidates the process of preparing a Game Object for rendering, without actually rendering it. This is used internally by the Graphics and Bitmap Text classes.
* The Texture Manager has a new method called `renameTexture` which will let you rename a texture, changing the key to the new one given. All existing Game Objects will still maintain their reference, even after a rename.
* When loading an SVG file you can now change the size of the SVG during the load process, before it is rendered to a texture. This is really helpful if you wish to increase SVGs that have small viewBoxes set, or want to try and reduce memory consumption from SVGs with extra large dimensions. You can either pass in a fixed width and height: `this.load.svg('morty', 'file.svg', { width: 300, height: 600 })` or you can provide a scale factor instead: `this.load.svg('morty', 'file.svg', { scale: 4 })` (thanks @ysraelJMM)
* `Polygon.Perimeter` will return the perimeter for the given Polygon (thanks @iamchristopher)
* `Polygon.GetPoints` will return an array of Point objects containing the coordinates of the points around the perimeter of the Polygon, based on the given quantity or stepRate values. This is available as a static function and as the `getPoints` method on a Polygon (thanks @iamchristopher)

### Updates

* The Camera class has been split into two: `BaseCamera` which contains all of the core Camera functions and properties, and would serve as a great base for you to extend for your own custom Cameras, and `Camera` which is the same class name as previously. `Camera` extends the Base Camera and adds in follower support and the Special Effects. You don't need to update your code, even if currently extending a Camera, as they work the same as before.
* `Camera.x` and `Camera.y` have been turned into getters / setters, mapped to the internal private values `_x` and `_y` respectively. This is so that setting the Camera viewport position directly will now update the new internal resolution calculation vars too.
* `Camera.setScene` will now set the Cameras `resolution` property at the same time and update the internal viewport vars.
* The `Cull Tiles` method used by the Dynamic Tilemap Layer has had a nice and significant optimization. It will now use the cull area dimensions to restrict the amount of tile iteration that takes place per layer, resulting in dramatic reductions in processing time on large layers, or multiple layers (thanks @tarsupin)
* `GameObject.willRender` now takes a Camera as its only argument and uses it within the check. This has allowed me to remove 23 duplicate checks spread across the various Game Objects, all of which did the same thing, saving both KB and CPU time as the flags were being checked twice in most cases.
* The file type loader `HTML` has been renamed to `HTMLTexture`. If you were using this then please change your calls from `load.html` to `load.htmlTexture`. The arguments remain the same.
* The `setBlendMode` method in the WebGL Renderer now returns a boolean. True if a new blend mode was set, otherwise false. Previously it returned a reference to the renderer instance.
* The method `batchVertices` in the TextureTintPipeline has been renamed to `batchQuad` which more accurately describes what it does.
* In ArcadePhysics `Body.setSize` you can now choose to not pass width and height values to the method. If you do this it will check to see if the parent Game Object has a texture frame, and if so, it will use the frame sizes for the Body dimensions (thanks @tarsupin)
* `PluginCache.destroyCorePlugins` will remove all core plugins from the cache. Be very careful calling this as Phaser cannot restart or create any new Scenes once this has been called.
* `PluginCache.destroyCustomPlugins` will remove all custom plugins from the cache.
* `PluginManager.destroy` will now clear all custom plugins from the Plugin Cache. This fixes an issue with not being able to destroy a Phaser game instance and restart it if it used a custom plugin (thanks jd.joshuadavison)
* `Game.destroy` has a new boolean argument `noReturn`. If set it will remove all Core plugins when the game instance is destroyed. You cannot restart Phaser on the same web page after doing this, so only set it if you know you're done and don't need to run Phaser again.
* The `MouseManager` will no longer process its native events if the manager reference has been removed (i.e. you move the pointer as the game is destroying itself)
* The `TouchManager` will no longer process its native events if the manager reference has been removed (i.e. you move the pointer as the game is destroying itself)
* `Particle.color` has been removed as it's now calculated during rendering to allow for Camera alpha support.
* The Game boot event flow has changed slightly. The Game will now listen for a `texturesready` event, which is dispatched by the Texture Manager when the default textures have finished processing. Upon receiving this, the Game will emit the `ready` event, which all the other systems listen for and respond to. The difference is that the Renderer uses the `texturesready` event to ensure that it is the first thing to be activated, before any other system.
* The WebGLRenderer has a new property `blankTexture` which is a reference to an empty 32x32 transparent WebGL Texture. This is used internally for things like rendering Graphics with no texture fills and where no other texture has been set.
* The WebGLRenderer has a new method `setBlankTexture` which forces it to set the blank texture as the current texture. This is used after drawing a Render Texture to ensure no other object tries to draw to itself.
* The StaticTilemapLayer has had the following properties and methods added to it: `skipCull`, `tilesDrawn`, `tilesTotal`, `cullPaddingX`, `cullPaddingY`, `cullCallback`, `setSkipCull` and `setCullPadding` as these are all used by the Canvas Static Layer renderer. Static Layers in 3.11 didn't render in Canvas because the cull values were missing, but now render correctly and can also be rendered to other targets, like a Render Texture.
* The Math.Snap methods `Snap.Floor`, `Snap.Ceil` and `Snap.To` have all gained a new optional boolean argument `divide`. If set the resulting snapped value will be divided by the gap amount before returning. This is handy if you're trying to quickly snap a value into a grid or array location.
* The `currentBlendMode` property has been removed from the Canvas Renderer and is no longer checked by any class. Blend modes are now set directly on the context to avoid state saving invalidation.
* The `currentAlpha` property has been removed from the Canvas Renderer and is no longer checked by any class. Alpha values are now set directly on the context to avoid state saving invalidation.
* `TextureCrop` and `Crop` have a new method `resetCropObject` which generates the crop data object required by Game Objects that support cropping. This allows us to remove duplicate code from a number of Game Objects and replace it with a single function call.
* The Canvas Renderer has a new `batchSprite` method that consolidates the process of drawing a texture-based Game Object to the canvas. It processes the alpha, blend mode and matrix calculations in a single function and now is used by nearly all Game Object canvas renderers.
* The `batchTexture` method in the Texture Tint Pipeline now supports cropped Game Objects and will adjust the drawn texture frame accordingly.
* The `Matrix Stack` Component has been removed. It's no longer used internally and was just wasting space.
* You can now specify the `lineHeight` of a Retro Font in the Retro Font Config object (thanks @FelixNemis)
* When a Static Tilemap Layer is generated in WebGL it will use the Cameras `roundPixels` value to clamp the tile coordinates.
* The `CanvasRenderer.DrawImage` function has been removed, as has the associated `drawImage` property from the Canvas Renderer as they're no longer used.
* The `CanvasRenderer.BlitImage` function has been removed, as has the associated `blitImage` property from the Canvas Renderer as they're no longer used.
* You can now access the Game instance directly from a Scene using `this.game` as long as it exists in the Scene's Injection Map, which it does by default. Be very careful what you do here: there's next to nothing you should actually use this for.
* `Camera.ignore` can now take nested-arrays of Game Objects and also supports both Groups and Containers.
* The `changedata` event dispatched by the Data Manager now includes the previous value as the 4th argument to the callback, so the event signature is now: `parent, key, value, previousValue` (thanks @iamchristopher)
* The call to `gl.clearColor` is now skipped when `clearBeforeRender` is set to `false` (thanks @goldfire)
* The calls to `DistanceBetween` have been replaced with `DistanceSquared` in the `closest` and `furthest` functions within Arcade Physics (thanks @Mursaat)
* The RandomDataGenerator will now create a default random seed if you instantiate your own version of the class (instead of using `Phaser.Math.RND`) and don't provide a seed for it (thanks michaeld)
* The Tilemap `createFromObjects` method will now add custom properties to the Game Objects. It works by checking if the property exists or not, and if not, it sets it in the Game Objects Data Manager (thanks @scalemailted @samme)
* In Matter.js if you scaled a Body it would only scale correctly once, due to the way Matter handles scaling internally. We now automatically reset the Matter scale before applying the new value, which allows you to keep the Phaser and Matter object scales in sync. Fix #3785 #3951 (thanks @bergben)
* The default Container Blend Mode is now `SKIP_TEST`. This allows you to either set a blend mode for a Container, in which case all children use that blend mode. Or, you can set a blend mode on the children and the children will render using their own blend modes, as the Container doesn't have one set. The WebGL and Canvas Renderer functions have also been updated to support this change. Fix #3684 (thanks @TadejZupancic)
* Previously the Input Manager would create a Touch handler unless the Game Config had `input.touch` set to `false` (the default was true). If no such property is set, it no longer defaults to `true` and instead is set to whatever `Device.input.touch` returns. On non-touchscreen desktops this means it will now only create one single Pointer, rather than two.
* The Arcade Physics Body `_tempMatrix` property has been removed. It was only used if the Body's Game Object had a parent. The matrix has been moved to the World instance instead, shared by all bodies.
* Arcade Physics World has gained two new private properties `_tempMatrix` and `_tempMatrix2`. These are used by all bodies in the simulation that need a temporal matrix for calculations, rather than having their own instances.
* The Input Manager has gained a new private property `_tempMatrix2`. This is used internally in the hitTest checks to avoid constant matrix creation.
* The Transform Matrix has a new method `applyInverse` which will take an x/y position and inverse translate it through the current matrix.
* Using `keyboard.addKeys("W, A, S, D")` would fail because of the spacing between the characters. `addKeys` will now trim the input allowing you to space characters out if you prefer (thanks @dhruvyad)
* Calling `setTimeScale` on the Sprite's Animation component will now set the time scale value and keep it set until you change it again. Previously it would be reset to 1 when a new animation was loaded into the component, but this no longer happens - once the time scale is set it remains in effect, regardless of which animations are played on the Sprite.

### Game Config Resolution Specific Bug Fixes

Setting the `resolution` property in the Game Config to a value other than 1 would cause various errors in the API. The following have been fixed:

* The game canvas would be sized incorrectly, unless you had enabled auto resizing. It now scales the canvas to the size given, maintaining the resolution. Fix #3468 (thanks @Legomite)
* Cameras with background colors set would display the filled color area at the wrong size. Camera fills now respect the resolution.
* The Camera Fade Effect would display the fade fill rectangle at the wrong size. Camera fades now respect the resolution.
* The Camera Flash Effect would display the fade fill rectangle at the wrong size. Camera flashes now respect the resolution.
* The Camera Shake Effect would shake the Camera using the wrong width values. Camera Shakes now respect the resolution.
* Input calculations would not factor in the Game Resolution correctly. If a Camera viewport was not at 0x0 or not the full size, or the Camera was rotated or zoomed, the input areas would be wrong if `resolution` was > 1. These are now factored in correctly and changing the resolution no longer breaks input. Fix #3606 (thanks @Secretmapper @thanh-taro)

### Bug Fixes

* The `setCrop` method stored its crop object on the prototype chain by mistake, causing all Images or Sprites that were cropped to display the same frame. The crop data has been moved to the Game Object instance, where it should be, fixing this issue (thanks NoxBrutalis)
* If an AudioFile failed to load and throw an incomplete error, it would cause the console.log to crash JavaScript when trying to log the error. It now only logs the message if it exists. Fix #3830 (thanks @kelostrada)
* Particles using a blend mode wouldn't render correctly after the updates in 3.11. If the blend mode changes during the processing of an emitter manager it'll now correctly rebind the texture, stopping the particles from vanishing. Fix #3851 (thanks @maxailloud)
* Adding an array of children to a Group would cause it to mistakenly think you were passing a config object. Fix #3854 (thanks @pedro-w)
* Graphics paths in WebGL would not render the line join between the final and the first path if the path was closed, leaving a noticeable gap if you used particularly thick strokes. If the path is closed it will now render the final line join properly.
* If a Mesh caused a batch flush it would fail to render as its texture was lost. It's now rebound correctly after the flush.
* `ArcadePhysics.closest` and `ArcadePhysics.furthest` used the wrong tree reference, causing them to throw errors (thanks @samme)
* `BlitterCanvasRenderer` would fail to render a Bob in Canvas mode if it was flipped (thanks @SBCGames)
* `RenderTexture.draw` would fail to draw the frame in Canvas mode (thanks @SBCGames)
* `ParticleEmitter` would fail to draw a textured particle in Canvas mode (thanks @SBCGames)
* `RenderTexture.preDestroy` will now release the canvas back to the CanvasPool if running in canvas mode (thanks @SBCGames)
* The `alpha` value is now always set for Render Textures in canvas mode, regardless of the previous alpha value in the renderer (thanks @SBCGames)
* Zone now calls `updateDisplayOrigin` in its constructor, causing the `displayOriginX` and `displayOriginY` values to now be correct if you create a Zone and then don't resize it. Fix #3865 (thanks @rexrainbow)
* The `CameraManager` was accidentally adding extra destroy event calls when a Scene was restarted, causing an `Uncaught TypeError: Cannot read property 'events' of null` when trying to destroy a game instance having swapped from a Scene to another, and back again. Fix #3878 (thanks @mbunby)
* RenderTextures in WebGL will now set the viewport size, stopping the console warning in Firefox. Fix #3823 (thanks @SBCGames)
* Particles now take the Cameras alpha value into consideration when calculating their final alpha values in WebGL. They previously ignored it. If you now alpha a Camera out all particles will change accordingly.
* The `CullTiles` updates from 3.11 didn't factor in the position of the Tilemap Layer to its bounds calculations, causing Static layers displayed out of the Camera viewport to never render in Canvas mode. The method has also been optimized further, with less divisions and less checks if culling is disabled.
* The Particle Emitter when running in Canvas wouldn't allow more than 1 emitter to use a blend mode (as seen in the Electric examples). The blend mode is properly set for each emitter now.
* The Blend Mode is now set directly in all Canvas Renderers without comparing it to what's stored in the Canvas Renderer. This fixes problems where the blend mode would be lost between two different Game Objects because they restored the context, but didn't update the renderer flag. Game Objects in Canvas can now mix and match blend modes across the display list.
* Matter.js has received a tiny update that prevents `collisionEnd` from triggering many times when it should only trigger once (thanks @mikewesthad)
* Graphics objects couldn't be set to be ignored by Cameras. Now every renderable Game Object can be ignored by a Camera, either directly or via a Container. The exception are Groups because they don't render and are non-exclusive parents.
* The Tilemap Culling function now uses the Tilemap tile dimensions for its bounds calculations, instead of the layer tile sizes, as they two don't have to match and it's the underlying grid size that takes precedence when calculating visible tiles. Fix #3893 (thanks @Zax37)
* The Arcade Physics `Body.speed` property is now set whenever you set the velocity via `setVelocity` or `setVelocityX` or `setVelocityY` which stops the body velocity being reset to zero if `useDamping` is enabled. Fix #3888 (thanks @samme)
* The `getPixelAlpha` method in the Texture Manager wasn't using the correct frame name. This is now passed in correctly. Fix #3937 (thanks @goldfire)
* The `getPixelAlpha` and `getPixel` methods in the Texture Manager would allow x/y coordinates from outside the cut area of a frame. It now tests to ensure they're within the frame. Fix #3937 (thanks @goldfire)
* A Game Object couldn't have a blend mode of `SKIP_TEST` set by using the getter or the `setBlendMode` method.
* In Arcade Physics the `World.disable` call was passing the wrong argument, so never disabling the actual body (thanks @samme)
* There was a visual bug with Rounded Rectangles in Canvas mode, due to the addition of the `overshoot` argument in the Graphics arc call. This has been fixed, so arcs will now render correctly and consistently in WebGL and Canvas and Rounded Rectangles are back to normal again too. Fix #3912 (thanks @valse)
* The `InputManager.inputCandidate` method, which determines if a Game Object can be interacted with by a given Pointer and Camera combination, now takes the full camera status into consideration. This means if a Camera is set to ignore a Game Object you can now no longer interact with it, or if the Camera is ignoring a Container with an interactive Game Object inside it, you cannot interact with the Container children anymore. Previously they would interact regardless of the Camera state. Fix #3984 (thanks @NemoStein @samid737)
* `Transform.getWorldTransformMatrix` has been recoded to iterate the transform parents correctly, applying the matrix multiplications as it goes. This (along with some changes in the Input Manager) fix the issue with Game Objects inside of Containers failing hit tests between certain angles. Fix #3920 (thanks @chaping @hackhat)
* Calling Arcade Physics `collide` during an `update` method wouldn't inject the results back into the Body parent, causing the bodies to carry on moving. Using Colliders worked, but manually checking did not. Now, both methods work. Fix #3777 (thanks @samme)
* The `setTintFill` method would ignore the `alpha` value of the Game Object in the shader. The alpha value is now blended with the tint fill, allowing you to properly alpha out tint-filled Game Objects. Fix #3992 (thanks @trl-bsd)
* Arcade Physics World `collideSpriteVsTilemapLayer` now syncs the collision results back to the body, allowing you to call `collide` from within an update loop once again. Fix #3999 (thanks @nkholski @mikewesthad)
* Arcade Physics Body `deltaX` and `deltaY` methods will now return the previous steps delta values, rather than zero. Fix #3987 (thanks @HaoboZ)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@SBCGames @rgk @rook2pawn @robbintt @bguyl @halilcakarr @PhaserEditor2D @Edwin222 @tfelix @Yudikubota @hexus @guzmonne @ampled @thanh-taro @dcbriccetti @Dreaded-Gnu @padme-amidala @rootasjey @ampled @thejonanshow @polarstoat @jdjoshuadavison @alexeymolchan @samme @PBird @spontoreau @hypertrifle @kid-wumeng

Thanks to @khaleb85 for fixing the super-annoying lag on the API Docs pages when it hung the browser while indexing the search field.

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
