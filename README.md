# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. You can take a look at their incredible [games](https://phaser.io/games/).

**Visit:** The [Phaser website](https://phaser.io) and follow on [Twitter](https://twitter.com/phaser_) (#phaserjs)<br />
**Learn:** [API Docs](https://photonstorm.github.io/phaser3-docs/index.html), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 1700+ [Examples](https://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Chat:** [Discord](https://phaser.io/community/discord) and [Slack](https://phaser.io/community/slack)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 15th January 2020

We're excited to announce the release of Phaser 3.22, the first of many in the year 2020. The main focus of 3.22 is all the work we've done on Matter Physics integration. Matter has been supported in Phaser since the first release, yet there were lots of things we wanted to do with it to make development life easier. 3.22 brings all of these to the front, including powerful new visual debugging options such as rendering contacts, velocity, the broadphase grid, sensors, joints and more. Matter also now has 100% JSDoc and TypeScripy coverage and I spent a long time rebuilding the TypeScript defs by hand, in order to make them as accurate as possible.

As well as docs and defs there are stacks of handy new methods, including intersection tests such as `intersectPoint`, `intersectRay`, `overlap` and more. New Body level collision callbacks allow you to filter collided pairs a lot more quickly now, combined with new collision events and data type defs to give you all the information you need when resolving. There are now functions to create bodies from SVG data, JSON data or Physics Editor data directly, new Body alignment features and of course bug fixes.

It's not all about Matter Physics, though. Thanks to the community, there are new Math Distance functions such as Chebyshev, Snake and Squared Points. You can now tint particles as they're emitted, Physics Groups finally let you use your own creation and removal callbacks and plenty more besides. There are, of course, lots of bug fixes too and I've done my best to address some of the most important ones. The documentation has improved yet again and with every release the TypeScript defs get stronger and stronger. So, as usual, please do spend some time digging through the [Change Log](#changelog). I assure you, it's worth while :)

With 3.22 released I will now be taking some time to carry on with Phaser 4 development, while planning out the 3.23 release as well. Even though Phaser 4 is in build I will fully support Phaser 3 for the foreseeable future. You can follow the development progress of both versions on the Phaser Patreon.

As usual, I'd like to send a massive thank-you to everyone who supports Phaser on Patreon (and now even GitHub Sponsors, too!) Your continued backing keeps allowing me to work on Phaser full-time and this great new releases is the very real result of that. If you've ever considered becoming a backer, now is the perfect time!

If you'd like to stay abreast of developments then I publish my [Developer Logs](https://phaser.io/phaser3/devlog) in the [Phaser World](https://phaser.io/community/newsletter) newsletter. Subscribe to stay in touch and get all the latest news from the core team and the wider community.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Discord](https://phaser.io/community/discord) and [Slack](https://phaser.io/community/slack) channels.

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
<script src="//cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser.min.js"></script>
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser-facebook-instant-games.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser-facebook-instant-games.min.js"></script>
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
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.22.0/dist/phaser-arcade-physics.min.js"></script> 
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

## Version 3.22 - Kohaku - January 15th 2020

### Matter Physics

All of the following are specific to the Matter Physics implementation used by Phaser:

#### Matter Physics New Features

* Matter Physics now has 100% JSDoc coverage! Woohoo :)
* Matter Physics now has brand new TypeScript defs included in the `types` folder :)
* `MatterDebugConfig` is a new configuration object that contains all of the following new Matter debug settings:
* `showAxes`- Render all of the body axes?
* `showAngleIndicator`- Render just a single body axis?
* `angleColor`- The color of the body angle / axes lines.
* `showBroadphase`- Render the broadphase grid?
* `broadphaseColor`- The color of the broadphase grid.
* `showBounds`- Render the bounds of the bodies in the world?
* `boundsColor`- The color of the body bounds.
* `showVelocity`- Render the velocity of the bodies in the world?
* `velocityColor`- The color of the body velocity line.
* `showCollisions`- Render the collision points and normals for colliding pairs.
* `collisionColor`- The color of the collision points.
* `showSeparation`- Render lines showing the separation between bodies.
* `separationColor`- The color of the body separation line.
* `showBody`- Render the dynamic bodies in the world to the Graphics object?
* `showStaticBody`- Render the static bodies in the world to the Graphics object?
* `showInternalEdges`- When rendering bodies, render the internal edges as well?
* `renderFill`- Render the bodies using a fill color.
* `renderLine`- Render the bodies using a line stroke.
* `fillColor`- The color value of the fill when rendering dynamic bodies.
* `fillOpacity`- The opacity of the fill when rendering dynamic bodies, a value between 0 and 1.
* `lineColor`- The color value of the line stroke when rendering dynamic bodies.
* `lineOpacity`- The opacity of the line when rendering dynamic bodies, a value between 0 and 1.
* `lineThickness`- If rendering lines, the thickness of the line.
* `staticFillColor`- The color value of the fill when rendering static bodies.
* `staticLineColor`- The color value of the line stroke when rendering static bodies.
* `showSleeping`- Render any sleeping bodies (dynamic or static) in the world to the Graphics object?
* `staticBodySleepOpacity`] - The amount to multiply the opacity of sleeping static bodies by.
* `sleepFillColor`- The color value of the fill when rendering sleeping dynamic bodies.
* `sleepLineColor`- The color value of the line stroke when rendering sleeping dynamic bodies.
* `showSensors`- Render bodies or body parts that are flagged as being a sensor?
* `sensorFillColor`- The fill color when rendering body sensors.
* `sensorLineColor`- The line color when rendering body sensors.
* `showPositions`- Render the position of non-static bodies?
* `positionSize`- The size of the rectangle drawn when rendering the body position.
* `positionColor`- The color value of the rectangle drawn when rendering the body position.
* `showJoint`- Render all world constraints to the Graphics object?
* `jointColor`- The color value of joints when `showJoint` is set.
* `jointLineOpacity`- The line opacity when rendering joints, a value between 0 and 1.
* `jointLineThickness`- The line thickness when rendering joints.
* `pinSize`- The size of the circles drawn when rendering pin constraints.
* `pinColor`- The color value of the circles drawn when rendering pin constraints.
* `springColor`- The color value of spring constraints.
* `anchorColor`- The color value of constraint anchors.
* `anchorSize`- The size of the circles drawn as the constraint anchors.
* `showConvexHulls`- When rendering polygon bodies, render the convex hull as well?
* `hullColor`- The color value of hulls when `showConvexHulls` is set.
* `World.renderBody` is a new method that will render a single Matter Body to the given Graphics object. This is used internally during debug rendering but is also public. This allows you to control which bodies are rendered and to which Graphics object, should you wish to use them in-game and not just during debugging.
* `World.renderConstraint` is a new method that will render a single Matter Constraint, such as a pin or a spring, to the given Graphics object. This is used internally during debug rendering but is also public. This allows you to control which constraints are rendered and to which Graphics object, should you wish to use them in-game and not just during debugging.
* `World.renderConvexHull` is a new method that will render the convex hull of a single Matter Body, to the given Graphics object. This is used internally during debug rendering but is also public. This allows you to control which hulls are rendered and to which Graphics object, should you wish to use them in-game and not just during debugging.
* `World.renderGrid` is a new method that will render the broadphase Grid to the given graphics instance.
* `World.renderBodyBounds` is a new method that will render the bounds of all the given bodies to the given graphics instance.
* `World.renderBodyAxes` is a new method that will render the axes of all the given bodies to the given graphics instance.
* `World.renderBodyVelocity` is a new method that will render a velocity line for all the given bodies to the given graphics instance.
* `World.renderSeparations` is a new method that will render the separations in the current pairs list to the given graphics instance.
* `World.renderCollisions` is a new method that will render the collision points and normals in the current pairs list to the given graphics instance.
* `World.getAllBodies` is a new method that will return all bodies in the Matter World.
* `World.getAllConstraints` is a new method that will return all constraints in the Matter World.
* `World.getAllComposites` is a new method that will return all composites in the Matter World.
* `MatterPhysics.composite` is a new reference to the `Matter.Composite` module for easy access from within a Scene.
* `MatterPhysics.detector` is a new reference to the `Matter.Dectector` module for easy access from within a Scene.
* `MatterPhysics.grid` is a new reference to the `Matter.Grid` module for easy access from within a Scene.
* `MatterPhysics.pair` is a new reference to the `Matter.Pair` module for easy access from within a Scene.
* `MatterPhysics.pairs` is a new reference to the `Matter.Pairs` module for easy access from within a Scene.
* `MatterPhysics.query` is a new reference to the `Matter.Query` module for easy access from within a Scene.
* `MatterPhysics.resolver` is a new reference to the `Matter.Resolver` module for easy access from within a Scene.
* `MatterPhysics.sat` is a new reference to the `Matter.SAT` module for easy access from within a Scene.
* `MatterPhysics.constraint` is a new reference to the `Matter.Constraint` module for easy access from within a Scene.
* `MatterPhysics.composites` is a new reference to the `Matter.Composites` module for easy access from within a Scene.
* `MatterPhysics.axes` is a new reference to the `Matter.Axes` module for easy access from within a Scene.
* `MatterPhysics.bounds` is a new reference to the `Matter.Bounds` module for easy access from within a Scene.
* `MatterPhysics.svg` is a new reference to the `Matter.Svg` module for easy access from within a Scene.
* `MatterPhysics.vector` is a new reference to the `Matter.Vector` module for easy access from within a Scene.
* `MatterPhysics.vertices` is a new reference to the `Matter.Vertices` module for easy access from within a Scene.
* `BEFORE_ADD` is a new Event dispatched by `Matter.World` when a Body or Constraint is about to be added to the World.
* `AFTER_ADD` is a new Event dispatched by `Matter.World` when a Body or Constraint has been added to the World.
* `BEFORE_REMOVE` is a new Event dispatched by `Matter.World` when a Body or Constraint is about to be removed from the World.
* `AFTER_REMOVE` is a new Event dispatched by `Matter.World` when a Body or Constraint has been removed from the World.
* `Body.render.lineOpacity` is a new property on the Matter Body object that allows for custom debug rendering.
* `Body.render.lineThickness` is a new property on the Matter Body object that allows for custom debug rendering.
* `Body.render.fillOpacity` is a new property on the Matter Body object that allows for custom debug rendering.
* `World.setCompositeRenderStyle` is a new method that lets you quickly set the render style values on the children of the given compposite.
* `World.setBodyRenderStyle` is a new method that lets you quickly set the render style values on the given Body.
* `World.setConstraintRenderStyle` is a new method that lets you quickly set the render style values on the given Constraint.
* You can now set `restingThresh` in the Matter Configuration file to adjust the Resolver property.
* You can now set `restingThreshTangent` in the Matter Configuration file to adjust the Resolver property.
* You can now set `positionDampen` in the Matter Configuration file to adjust the Resolver property.
* You can now set `positionWarming` in the Matter Configuration file to adjust the Resolver property.
* You can now set `frictionNormalMultiplier` in the Matter Configuration file to adjust the Resolver property.
* `MatterPhysics.containsPoint` is a new method that returns a boolean if any of the given bodies intersect with the given point.
* `MatterPhysics.intersectPoint` is a new method that checks which bodies intersect with the given point and returns them.
* `MatterPhysics.intersectRect` is a new method that checks which bodies intersect with the given rectangular area, and returns them. Optionally, it can check which bodies are outside of the area.
* `MatterPhysics.intersectRay` is a new method that checks which bodies intersect with the given ray segment and returns them. Optionally, you can set the width of the ray.
* `MatterPhysics.intersectBody` is a new method that checks which bodies intersect with the given body and returns them. If the bodies are set to not collide this can be used as an overlaps check.
* `MatterPhysics.overlap` is a new method that takes a target body and checks to see if it overlaps with any of the bodies given. If they do, optional `process` and `overlap` callbacks are invoked, passing the overlapping bodies to them, along with additional collision data.
* `MatterPhysics.setCollisionCategory` is a new method that will set the collision filter category to the value given, on all of the bodies given. This allows you to easily set the category on bodies that don't have a Phaser Matter Collision component.
* `MatterPhysics.setCollisionGroup` is a new method that will set the collision filter group to the value given, on all of the bodies given. This allows you to easily set the group on bodies that don't have a Phaser Matter Collision component.
* `MatterPhysics.setCollidesWith` is a new method that will set the collision filter mask to the value given, on all of the bodies given. This allows you to easily set the filter mask on bodies that don't have a Phaser Matter Collision component.
* `Matter.Body.centerOfMass` is a new vec2 property added to the Matter Body object that retains the center of mass coordinates when the Body is first created, or has parts added to it. These are float values, derived from the body position and bounds.
* `Matter.Body.centerOffset` is a new vec2 property added to the Matter Body object that retains the center offset coordinates when the Body is first created, or has parts added to it. These are pixel values.
* `Constraint.pointAWorld` is a new method added to Matter that returns the world-space position of `constraint.pointA`, accounting for `constraint.bodyA`.
* `Constraint.pointBWorld` is a new method added to Matter that returns the world-space position of `constraint.pointB`, accounting for `constraint.bodyB`.
* `Body.setCentre` is a new method added to Matter that allows you to set the center of mass of a Body (please note the English spelling of this function.)
* `Body.scale` is a new read-only vector that holds the most recent scale values as passed to `Body.scale`.
* `Matter.Bodies.flagCoincidentParts` is a new function that will flags all internal edges (coincident parts) on an array of body parts. This was previously part of the `fromVertices` function, but has been made external for outside use.
* `Matter.getMatterBodies` is a new function that will return an array of Matter JS Bodies from the given input array, which can be Matter Game Objects, or any class that extends them.
* `Matter.World.has` is a new method that will take a Matter Body, or Game Object, and search the world for it. If found, it will return `true`.
* Matter now has the option to use the Runner that it ships with. The Matter Runner operates in two modes: fixed and variable. In the fixed mode, the Matter Engine updates at a fixed delta value every frame (which is what Phaser has used since the first version). In variable mode, the delta will be smoothed and capped each frame to keep the simulation constant, but at the cost of determininism. You can configure the runner by setting the `runner` property in the Matter Config object, both of which are fully covered with JSDocs. As of 3.22 the runner is now used by default in variable (non-fixed) mode. If you wish to return to the previous behavior, set `runner: { isFixed: true }`.
* `Body.onCollideCallback` is a new Matter Body property that can point to a callback to invoke when the body starts colliding.
* `Body.onCollideEndCallback` is a new Matter Body property that can point to a callback to invoke when the body stops colliding.
* `Body.onCollideActiveCallback` is a new Matter Body property that can point to a callback to invoke for the duration the body is colliding.
* `Body.onCollideWith` is a new Matter Body property that holds a mapping between bodies and collision callbacks.
* `MatterGameObject.setOnCollide` is a new method available on any Matter Game Object, that sets a callback that is invoked when the body collides with another.
* `MatterGameObject.setOnCollideEnd` is a new method available on any Matter Game Object, that sets a callback that is invoked when the body stops colliding.
* `MatterGameObject.setOnCollideActive` is a new method available on any Matter Game Object, that sets a callback which is invoked for the duration of the bodies collision with another.
* `MatterGameObject.setOnCollideWith` is a new method available on any Matter Game Object, that allows you to set a callback to be invoked whenever the body collides with another specific body, or array of bodies.
* `Body.gravityScale` is a new vector property that allows you to scale the effect of world gravity on a specific Body.
* `MatterPhysics._tempVec2` is a new private internal vector used for velocity and force calculations.
* `MatterPhysics.setVelocity` is a new method that will set both the horizontal and vertical linear velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.setVelocityX` is a new method that will set the horizontal linear velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.setVelocityY` is a new method that will set the vertical linear velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.setAngularVelocity` is a new method that will set the angular velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.applyForce` is a new method that applies a force to a body, at the bodies current position, including resulting torque. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.applyForceFromPosition` is a new method that applies a force to a body from the given world position, including resulting torque. If no angle is given, the current body angle is used. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.fromSVG` is a new method that allows you to create a Body from the given SVG path data.
* The `Matter.Factory.velocity` method has been removed. Please now use `MatterPhysics.setVelocity` instead.
* The `Matter.Factory.angularVelocity` method has been removed. Please now use `MatterPhysics.setAngularVelocity` instead.
* The `Matter.Factory.force` method has been removed. Please now use `MatterPhysics.applyForce` instead.
* `MatterBodyConfig` is a new type def that contains all of the Body configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterBodyRenderConfig` is a new type def that contains all of the Body debug rendering configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterChamferConfig` is a new type def that contains all of the chamfer configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterCollisionFilter` is a new type def that contains all of the collision configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterConstraintConfig` is a new type def that contains all of the constraint configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterConstraintRenderConfig` is a new type def that contains all of the Constraint debug rendering configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterSetBodyConfig` is a new type def that contains all of the Constraint debug rendering configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterPhysics.getConstraintLength` is a new method that will return the length of the given constraint, as this is something you cannot get from the constraint properties directly.
* `MatterPhysics.alignBody` is a new method that will align a Body, or Matter Game Object, against the given coordinates, using the given alignment constant. For example, this allows you to easily position a body to the `BOTTOM_LEFT`, or `TOP_CENTER`, or a coordinate. Alignment is based on the body bounds.
* `Phaser.Types.Physics.Matter.MatterBody` is a new type def that contains all of the valid Matter Body objects. This is now used through-out the JSDocs to aid in code-completion.
* `Matter.BodyBounds` is a new class that contains methods to help you extract world coordinates from various points around the bounds of a Matter Body. Because Matter bodies are positioned based on their center of mass, and not a dimension based center, you often need to get the bounds coordinates in order to properly align them in the world. You can access this new class via `this.matter.bodyBounds`.
* The method signature for `Matter.PhysicsEditorParser.parseBody` has changed. It now takes `(x, y, config, options)` and no longer has `width` and `height` parameters. Please see the updated documentation for more details if you were calling this method directly.
* `MatterPhysics.fromPhysicsEditor` is a new method that allows you to create a Matter Body based on the given PhysicsEditor shape data. Previously, you could only using PhysicsEditor data with a Matter Game Object, but now you can create a body directly using it.
* `Matter.PhysicsJSONParser` is a new parser that will create Matter bodies from JSON physics data files. Currently onto the Phaser Physics Tracer app exports in this format, but details are published in the JSDocs, so any app can do so.
* `Matter.Factory.fromJSON` is a new method that will create a body from a JSON physics data file.
* The `SetBody` Matter component can now automatically use shapes created in the Phaser Physics Tracer App in the JSON data format.
* `Matter.Components.Sleep.setToSleep` is a new method available on any Matter Game Object that will send the body to sleep, if Engine sleeping has been enabled.
* `Matter.Components.Sleep.setAwake` is a new method available on any Matter Game Object that will awake a body from sleep, if Engine sleeping has been enabled.

#### Matter Physics Updates

* The `debug` property in the Matter World Config is now a `MatterDebugConfig` option instead of a boolean. However, if a boolean is given, it will use the default debug config values.
* The following `MatterWorldConfig` options have now been removed: `debugShowBody`, `debugShowStaticBody`, `debugBodyColor`, `debugBodyFillColor`, `debugStaticBodyColor`, `debugShowJoint`, `debugJointColor`, `debugWireframes`, `debugShowInternalEdges`, `debugShowConvexHulls`, `debugConvexHullColor` and `debugShowSleeping`. These can all be set via the new `MatterDebugConfig` object instead.
* The object `World.defaults` has been removed. Defaults are now access via `World.debugDefaults`.
* `World.renderBodies` has been rewritten to cache commonly-used values and avoid a situation when a single body would be rendered twice.
* The private method `World.renderConvexHulls` has been removed as it's no longer used internally.
* The private method `World.renderWireframes` has been removed as it's no longer used internally.
* The method `World.fromPath` has been removed. This was never used internally and you can get the same results by calling `Vertices.fromPath`.
* The `World.setBounds` argument `thickness` now defaults to 64, not 128, to keep it matching the Matter World Config.
* The `Body.render.fillStyle` property that existed on the Matter Body object has been removed and replaced with `fillColor`.
* The `Body.render.strokeStyle` property that existed on the Matter Body object has been removed and replaced with `lineColor`.
* `Matter.Body.render.sprite.xOffset` and `yOffset` are no longer set to anything when a Body is created. They are left as zero, or you can override them in the Body config, in which case the value is added to the sprite origin offset during a call to `setExistingBody`.
* The `Matter.Mass.centerOfMass` component property now returns the pre-calculated Body `centerOfMass` property, which is much more accurate than the previous bounds offset value.
* `Matter.setExistingBody`, which is called interally whenever a Body is set on a Game Object, now uses the new `centerOffset` values to ensure that the texture frame is correctly centered based on the center of mass, not the Body bounds, allowing for much more accurate body to texture mapping with complex multi-part compound bodies.
* The `Matter.PhysicsEditorParser` has been updated so it no longer needs to set the render offsets, and instead uses the center of mass values.
* If the `Matter.Body` config doesn't contain a `position` property, it will now default to using `Vertices.centre(body.vertices)` as the position. In most cases, this is what you need, so it saves having to pass it in the config object.
* Bumped Matter Plugin versions to avoid console logs from Common.info and Common.warn.
* `PhysicsEditorParser.parseVertices` now uses `Bodies.flagCoincidentParts` to avoid duplicating code.
* `MatterGameObject` has a new optional boolean constructor parameter `addToWorld` which lets you control if the Body should be added to the world or not. Useful for toggling off should you be merging pre-existing bodies with Game Objects.
* The `Matter.SetBody.setExistingBody` function, which all Matter Game Objects have, has a new parameter `addToWorld` which allows you to control when the body is added to the Matter world should you not require it immediately. It will also only add the body to the world if it doesn't already exist within it, or any of its composites.
* `PointerConstraint` has been recoded so that when pressed down, it only polls the World for a body hit test during the next game update. This stops it coming out of sync with the state of the world. Use of the constraint remains the same as before.
* You can now set `gravity: false` in your Matter Config and it will reset gravity from the defaults to zero.
* The internal Matter `Composite.setModified` function will now emit a `compositeModified` event, which the Matter World listens for, if debug draw is enabled, so it can update the composite children render styles.
* `Matter.PhysicsEditorParser.parseBody` can now accept a MatterBodyConfig file as a 4th parameter. This allows you to set Body properties when the body is created, overriding whatever values may have been set in the PhysicsEditor JSON.

#### Matter Physics Bug Fixes

* Due to the rewrite of the debug rendering, it is now possible to render _just_ constraints, where-as before this was only possible if bodies were being rendered as well. Fix #4880 (thanks @roberto257)
* `Matter.PhysicsEditorParser` had a bug where it would allow fixtures with non-clockwise sorted vertices through, which would break pointer constraint interaction with these bodies. The parser now sorts the vertices properly. Fix #4261 (thanks @Sanchez3)

### New Features

* `TimeStep.smoothStep` is a new boolean property that controls if any delta smoothing takes place during the game step. Delta smoothing has been enabled in Phaser since the first version and helps avoid delta spikes and dips, especially after loss of focus. However, you can now easily toggle if this happens via this property and the corresponding `FPSConfig` property.
* `Phaser.Math.Distance.BetweenPoints` is a new function that will return the distance between two Vector2-like objects (thanks @samme)
* `Phaser.Math.Distance.BetweenPointsSquared` is a new function that will return the squared distance between two Vector2-like objects (thanks @samme)
* `Phaser.Math.Distance.Chebyshev` is a new function that will return the Chebyshev (or chessboard) distance between two Vector2-like objects (thanks @samme)
* `Phaser.Math.Distance.Snake` is a new function that will return the rectilinear distance between two Vector2-like objects (thanks @samme)
* `ParticleEmitter.setTint` is a new method that will set the tint of emitted particles for the given Emitter only (thanks @samme)
* `ParticleEmitter.remove` is a new method that will remove the Emitter from its Emitter Manager (thanks @samme)
* `ParticleEmitterManager.removeEmitter` is a new method that will remove the given emitter from the manager, if the emitter belongs to it (thanks @samme)
* `AlphaSingle` is a new Game Object Component that allows a Game Object to set its alpha values, but only as a single uniform value, not on a per-quad basis.
* `Actions.AlignTo` (in combination with the new `Display.Align.To.QuickSet` function) allows you to align an array of Game Objects so they sit next to each other, one at a time. The first item isn't moved, the second is moved to sit next to the first, and so on. You can align them using any of the alignment constants (thanks @samme)
* `Scene.Systems.getData` is a new method that will return any data that was sent to the Scene by another Scene, i.e. during a `run` or `launch` command. You can access it via `this.sys.getData()` from within your Scene.
* `Group.internalCreateCallback` is a new optional callback that is invoked whenever a child is added to a Group. This is the same as `createCallback` except it's only for use by the parent class, allowing a parent to invoke a creation callback and for you to still provide one via the Group config.
* `Group.internalRemoveCallback` is a new optional callback that is invoked whenever a child is removed from a Group. This is the same as `removeCallback` except it's only for use by the parent class, allowing a parent to invoke a callback and for you to still provide one via the Group config.

### Updates

* `Body.deltaXFinal` is a new method on Arcade Physics Bodies that will return the final change in the horizontal position of the body, as based on all the steps that took place this frame. This property is calculated during the `postUpdate` phase, so must be listened for accordingly (thanks Bambosh)
* `Body.deltaYFinal` is a new method on Arcade Physics Bodies that will return the final change in the vertical position of the body, as based on all the steps that took place this frame. This property is calculated during the `postUpdate` phase, so must be listened for accordingly (thanks Bambosh)
* `Body._tx` is a new internal private var, holding the Arcade Physics Body combined total delta x value.
* `Body._ty` is a new internal private var, holding the Arcade Physics Body combined total delta y value.
* `LineCurve.getUtoTmapping` has been updated to return `u` directly to avoid calculations as it's identical to `t` in a Line (thanks @rexrainbow)
* `Curve.getSpacedPoints` will now take an optional array as the 3rd parameter to store the points results in (thanks @rexrainbow)
* Trying to play or resume an audio file with an incorrect key will now throw a runtime error, instead of a console warning (thanks @samme)
* The `Shape` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the shape, rather than a quad alpha, which never worked for Shape objects.
* The `Container` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the container, rather than a quad alpha, which never worked consistently across Container children. Fix #4916 (thanks @laineus)
* The `DOMElement` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the element, rather than a quad alpha, which never worked for these objects.
* The `Graphics` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the element, rather than a quad alpha, which never worked for these objects.
* `TweenData` has a new property called `previous` which holds the eased property value prior to the update.
* The `TWEEN_UPDATE` event now sends two new parameters to the handler: `current` and `previous` which contain the current and previous property values.
* During `collideSpriteVsGroup` checks it will now skip bodies that are disabled to save doing a `contains` test (thanks @samme)
* `Display.Align.In.QuickSet` now accepts `LEFT_BOTTOM` as `BOTTOM_LEFT`, `LEFT_TOP` as `TOP_LEFT`, `RIGHT_BOTTOM` as `BOTTOM_RIGHT` and `RIGHT_TOP` as `TOP_RIGHT`. Fix #4927 (thanks @zaniar)
* `PhysicsGroup` now uses the new `internalCreateCallback` and `internalRemoveCallback` to handle its body creation and destruction, allowing you to use your own `createCallback` and `removeCallback` as defined in the Group config. Fix #4420 #4657 #4822 (thanks @S4n60w3n @kendistiller @scrubperson)
* `DOMElement` has a new private method `handleSceneEvent` which will handle toggling the display setting of the element when a Scene sleeps and wakes. A DOM Element will now listen for the Scene sleep and wake events. These event listeners are removed in the `preDestroy` method.
* A `DOMElement` will now set the display mode to 'none' during its render if the Scene in which it belongs is no longer visible.

### Bug Fixes

* BitmapText with a `maxWidth` set wouldn't update the text correctly if it was modified post-creation. You can now update the text and/or width independantly and it'll update correctly. Fix #4881 (thanks @oxguy3)
* Text objects will no longer add any white-space when word-wrapping if the last line is only one word long. Fix #4867 (thanks @gaamoo @rexrainbow)
* When `Game.destroy` is running, Scenes are now destroyed _before_ plugins, avoiding bugs when closing down plugins and deleting Render Textures. Fix #4849 #4876 (thanks @rexrainbow @siyuanqiao)
* The `Mesh` and `Quad` Game Objects have had the `GetBounds` component removed as it cannot operate on a Mesh as they don't have origins. Fix #4902 (thanks @samme)
* Setting `lineSpacing` in the Text Game Object style config would set the value but not apply it to the Text, leaving you to call `updateText` yourself. If set, it's now applied on instantiation. Fix #4901 (thanks @FantaZZ)
* External calls to the Fullscreen API using `element.requestFullscreen()` would be blocked by the Scale Manager. The Scale Manager will no longer call `stopFullScreen` should it be triggered outside of Phaser (thanks @AdamXA)
* The `Tilemaps.Tile.tint` property wasn't working correctly as it expected the colors in the wrong order (BGR instead of RGB). It will now expect them in the correct RGB order (thanks @Aedalus @plissken2013es)
* The `ScaleManager.destroy` method wasn't being called when the Game `DESTROY` event was dispatched, causing minor gc to build up. The destroy method will now be called properly on game destruction. Fix #4944 (thanks @sunshineuoow)
* `FacebookInstantGamesPlugin.showAd` and `showVideo` will now break out of the ad iteration search once a valid ad has been found and called. Previously, it would carry on interating if the async didn't complete quickly. Fix #4888 (thanks @east62687)
* When playing an Animation, if you were to play another, then pause it, then play another the internal `_paused` wouldn't get reset, preventing you from them pausing the animations from that point on. You can now play and pause animations at will. Fix #4835 (thanks @murteira)
* In `Actions.GridAlign` if you set `width` to -1 it would align the items vertically, instead of horizontally. It now aligns them horizontally if `width` is set, or vertically if `height` is set. Fix #4899 (thanks @BenjaVR)
* A `PathFollower` with a very short duration would often not end in the correct place, which is the very end of the Path, due to the tween handling the movement not running one final update when the tween was complete. It will now always end at the final point of the path, no matter how short the duration. Fix #4950 (thanks @bramp)
* A `DOMElement` would still remain visible even if the Scene in which it belongs to was sent to sleep. A sleeping Scene shouldn't render anything. DOM Elements will now respond to sleep and wake events from their parent Scene. Fix #4870 (thanks @peonmodel)
* If a config object was passed to `MultiAtlasFile` it expected the atlas URL to be in the `url` property, however the docs and file config expected it in `atlasURL`. You can now use either of these properties to declare the url. Fix #4815 (thanks @xense)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@fselcukcan Bambosh @louisth @hexus @javigaralva @samme @BeLi4L @jcyuan @javigaralva @T-Grave @bramp @Chnapy @dranitski @RollinSafary @xense

The Matter TypeScript defs have been updated to include lots of missing classes, removed some redundant elements and general fixes. The Phaser TypeScript defs now reference the Matter defs directly and no longer try to parse them from the JSDocs. This allows the `MatterJS` namespace to work in TypeScript projects without any compilation warnings.

The Spine Plugin now has new TypeScript defs in the `types` folder thanks to @supertommy

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

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.22.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.22.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
