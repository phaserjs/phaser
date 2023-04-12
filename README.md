# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

[![Discord chat](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
[![Twitter Follow](https://img.shields.io/twitter/follow/phaser_?style=for-the-badge)](https://twitter.com/phaser_)
![npm](https://img.shields.io/jsdelivr/npm/hm/phaser?style=for-the-badge)
![GitHub](https://img.shields.io/github/downloads/photonstorm/phaser/total?style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by [Photon Storm](http://www.photonstorm.com). As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indie and multi-national digital agencies, and universities worldwide use Phaser. Take a look at their incredible [games](https://phaser.io/games/) in our showcase video:

[![Phaser Games Showcase video](https://img.youtube.com/vi/gnfgwkVg7vc/maxresdefault.jpg)](https://www.youtube.com/watch?v=gnfgwkVg7vc)

**Visit:** The [Phaser website](https://phaser.io) and follow on [Phaser Twitter](https://twitter.com/phaser_)<br />
**Play:** Some of the amazing games [#madewithphaser](https://twitter.com/search?q=%23madewithphaser&src=typed_query&f=live)<br />
**Learn:** [API Docs](https://newdocs.phaser.io), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 2000+ [Examples](https://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Discord:** Join us on [Discord](https://discord.gg/phaser)<br />
**Extend:** With [Phaser Plugins](https://phaser.io/shop/plugins)<br />
**Be awesome:** [Support](#support) the future of Phaser<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div-whats-new.png "What's New")

<div align="center"><img src="https://phaser.io/images/github/news.jpg"></div>

> 12th April 2023

After 24 Beta releases, over 2000 updated examples and a year of insanely hard work we're thrilled to finally announce the release of Phaser 3.60!

Today is also the 10th birthday of Phaser, so it's a very special day for us. 10 years ago we released the v0.5 version on the unsuspecting public and it's no exaggeration to say that it changed both our lives and the face of HTML5 game development forever.

![Phaser is 10](changelog/3.60/images/phaser10banner.png)

Phaser 3.60 is our biggest release ever. Eclipsing any version before it. Some of the headline features include:

**Built-in Special FX** - We now bundle 14 highly flexible special effects into the core, which are available to all Game Objects. These include Glow, Blur, Bloom, Bokeh, Barrel, Wipe, Pixelate, Vignette, Displacement and more.

**Nine-Slice Game Object** - A new native Nine Slice Game Object. A Nine Slice Game Object allows you to display a texture-based object that can be stretched both horizontally and vertically, but that retains fixed-sized corners. The dimensions of the corners are set via the parameters to the class. When you resize a Nine Slice Game Object only the middle sections of the texture stretch. This is extremely useful for UI and button-like elements, where you need them to expand to accommodate the content without distorting the texture.

**Plane Game Object** - A new native Plane Game Object. The Plane Game Object is a helper class that takes the Mesh Game Object and extends it, allowing for fast and easy creation of Planes. A Plane is a one-sided grid of cells, where you specify the number of cells in each dimension. The Plane can have a texture that is either repeated (tiled) across each cell, or applied to the full Plane.

**New Tween System** - We've reworked the entire Tween system to make it both more efficient, more powerful and easier for you to extend. New in this version are perfectly sequential Tween Chains, the ability to tween Sprite textures, much better garbage-collection and auto-destruction of expired tweens and lots more.

**Compressed Texture Support** - Phaser 3.60 contains support for Compressed Textures. It can parse both KTX and PVR containers and within those has support for the following formats: ETC, ETC1, ATC, ASTC, BPTC, RGTC, PVRTC, S3TC and S3TCSRB. Compressed Textures differ from normal textures in that their structure is optimized for fast GPU data reads and lower memory consumption. Popular tools that can create compressed textures include PVRTexTool, ASTC Encoder and Texture Packer.

**Matter Physics v0.19** - We have updated the version of Matter Physics to the latest v0.18 release. This is a big jump and brings with it quite a few internal changes to Matter, as well as a ~40% performance improvement.

There are also hundreds of updates and bug fixes across the entire codebase.

We have created a brand new [Change Log](https://github.com/photonstorm/phaser/blob/master/changelog/3.60/CHANGELOG-v3.60.md) just for v3.60. Previously, we used to put all of the changes in a single file, but this felt impractical. So we've split it all into sections now, so you can easily see what's new and updated.

v3.60 is available now from the [Releases page](https://github.com/photonstorm/phaser/releases). You can also download it from npm:

```
npm i phaser
```

You'll find up to date TypeScript defs that align with this release in the `types` folder of this repository.

> If you find any problems please report them in GitHub issues.

As usual, I'd like to send my thanks to the Phaser community for their help in both reporting issues and submitting pull requests to fix them. So, please do spend some time digging through the Change Log. I assure you, it's worth while 🙂

I'd like to send a massive thank-you to everyone who supports [Phaser on Patreon](https://www.patreon.com/photonstorm), GitHub Sponsors and our corporate backers. Your continued funding allows me to keep working on Phaser full-time and this monster of a new release is the very real result of that. If you've ever considered becoming a backer, now is the perfect time!

If you'd like to stay abreast of developments then I'm now publishing them to the [Phaser Patreon](https://www.patreon.com/photonstorm). Here you can find the latest development reports including the concepts behind Phaser 4.

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Discord](https://discord.gg/phaser).

Phaser 3 wouldn't have been possible without the fantastic support of the community and Patreon. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

Rich - [@photonstorm](https://twitter.com/photonstorm)

![boogie](https://www.phaser.io/images/spacedancer.gif)

![Support Phaser](https://phaser.io/images/github/div-support-phaser.png "Support Phaser")

Because Phaser is an open source project, we cannot charge for it in the same way as traditional retail software. What's more, we don't ever want to. After all, it's built on, and was born from, open web standards. It's part of our manifesto that the core framework will always be free, even if you use it commercially, as many of you do.

**You may not realize it, but because of this, we rely 100% on community backing to fund development.**

Those funds allow Phaser to improve, and when it improves, everyone involved benefits. Your support helps secure a constant cycle of updates, fixes, new features and planning for the future.

We use [Patreon](https://www.patreon.com/photonstorm) to manage the backing and you can [support Phaser](https://www.patreon.com/join/photonstorm?) from $1 per month. The amount you pledge is entirely up to you and can be changed as often as you like. Patreon renews monthly, just like Netflix. You can, of course, cancel at any point. Tears will be shed on this end, but that's not your concern.

You can also support us by using crypto currencies. The Phaser wallet addresses are:

* Ethereum: 0x6a716A122Ad186ECE865C55D16c1D361f1B13724
* BSC / AVAX / Polygon: 0x94aC3F640b8749AbD1d44f29A62ffeB32CA34628

Extra special thanks to the following companies whose support makes Phaser possible:

* [Hathora](https://hathora.dev)
* [Cerebral Fix](https://cerebralfix.com)
* [MoPub](https://www.mopub.com/en)
* [Facebook](https://www.facebook.com)
* [Game Distribution](https://gamedistribution.com)
* [GameCommerce](https://www.gamecommerce.com)
* [Mozilla](https://www.mozilla.org)
* [Texture Packer](https://www.codeandweb.com/texturepacker/tutorials/how-to-create-sprite-sheets-for-phaser3?utm_source=ad&utm_medium=banner&utm_campaign=phaser-2018-10-16)
* [TwilioQuest](https://www.twilio.com/blog/unlock-your-power-to-teach-with-twilioquest?utm_source=github&utm_medium=banner&utm_campaign=phaser)
* [Poki](https://developers.poki.com/)
* [CrazyGames](https://www.crazygames.com)
* [Lagged](https://www.lagged.com)
* [Nakama](https://heroiclabs.com/phaserjs/)

![Sponsors](https://phaser.io/images/github/sponsors-2021-08.png "Our Awesome Sponsors")

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

[![](https://data.jsdelivr.com/v1/package/npm/phaser/badge)](https://www.jsdelivr.com/package/npm/phaser)

[Phaser is on jsDelivr](https://www.jsdelivr.com/package/npm/phaser) which is a "super-fast CDN for developers". Include the following in your html:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://newdocs.phaser.io/ to read the docs online using our brand new interface. Use the links to navigate the namespaces, classes and Game Objects lists and also use the new search box.

The documentation for Phaser 3 is an on-going project. Please help us by contributing improved docs and examples.

### TypeScript Definitions

The [TypeScript definitions](https://github.com/photonstorm/phaser/tree/master/types) can be found inside the `types` folder. They are also referenced in the `types` entry in `package.json`.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"lib": ["es6", "dom", "dom.iterable", "scripthost"],
"typeRoots": ["./node_modules/phaser/types"],
"types": ["Phaser"]
```

We recently updated our [Phaser 3 TypeScript Project Template](https://github.com/photonstorm/phaser3-typescript-project-template), which you can use to get started with. This now uses TypeScript 5 and Phaser v3.60.

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
* Plus, there are [over 700 Phaser tutorials](https://phaser.io/learn) listed on the official website.

We've 3 tutorials related specifically to creating **Facebook Instant Games** with Phaser:

* [Getting Started with Facebook Instant Games](https://phaser.io/news/2018/10/facebook-instant-games-phaser-tutorial)
* [Facebook Instant Games Leaderboards Tutorial](https://phaser.io/news/2018/11/facebook-instant-games-leaderboards-tutorial)
* [Displaying Ads in your Instant Games](https://phaser.io/news/2018/12/facebook-instant-games-ads-tutorial)

### Source Code Examples

During our development of Phaser 3, we created hundreds of examples with the full source code and assets ready available. These examples can be browsed on the [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Hathora

Hathora is a framework for creating online multiplayer games with a focus on providing the best developer experience possible. The framework handles aspects such as State Synchronization, persistence, and authentication so that you can focus on building your game. Once you’ve built your game, you can deploy it to Hathora Cloud with a single command, and it will push your game to servers all over the world, automatically scaling up or down based on the user load. Visit the [Hathora documentation](https://docs.hathora.dev/#/) to learn more.

They have also published a [brand-new tutorial](https://docs.hathora.dev/#/buildkit/tutorial_top_down_shooter) on creating a multiplayer Phaser game. Please give it a read and check out their framework!

### Huge list of Phaser 3 Plugins

Super community member RexRainbow has been publishing Phaser 3 content for years, building up an impressive catalogue in that time. You'll find [loads of plugins](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html#list-of-my-plugins), from UI controls such as text input boxes, to Firebase support, Finite State Machines and lots more. As well as the plugins there is also a comprehensive set of 'Notes' about Phaser 3, going into great detail about how the various systems work. It's an invaluable resource and well worth checking out at [https://rexrainbow.github.io](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html)

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser-arcade-physics.min.js"></script> 
</head>
<body>

    <script></script>

</body>
</html>
```

This is a standard empty webpage. You'll notice there's a script tag that is pulling in a build of Phaser 3, but otherwise this webpage doesn't do anything yet. Now let's set-up the game config. Paste the following between the `<script></script>` tags:

```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: Example
};

const game = new Phaser.Game(config);
```

`config` is a pretty standard Phaser 3 Game Configuration object. We tell `config` to use the WebGL renderer if it can, set the canvas to a size of 800 x 600 pixels, enable Arcade Physics, and finally we tell it to use the Example Scene. This hasn't been implemented yet, so if you run this JavaScript code now you will have an error. Add the following above the `config`:

```javascript
class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setBaseURL('https://labs.phaser.io');

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }

    create ()
    {
    }
}
```

Here we create a Scene called `Example`. We've given it 2 functions. The `preload` function is where you load assets into your game. In `preload`, we set the Base URL to be the Phaser server and load 3 PNG files.

The `create` function is empty, so it's time to fill it in:

```javascript
create ()
{
    this.add.image(400, 300, 'sky');

    const particles = this.add.particles(0, 0, 'red', {
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    const logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    particles.startFollow(logo);
}
```

Here we add a sky image into the game and create a Particle Emitter. The `scale` value means that the particles will initially be large and will shrink to nothing as their lifespan progresses.

After creating the `emitter`, we add a logo image called `logo`. Since `logo` is a Physics Image, `logo` is given a physics body by default. We set some properties for `logo`: velocity, bounce (or restitution), and collision with the world bounds. These properties will make our logo bounce around the screen. Finally, we tell the particle emitter to follow the logo - so as the logo moves, the particles will flow from it.

Run it in your browser and you'll see the following:

![Phaser 3 Demo](https://phaser.io/images/github/300/sample1.png "Phaser 3 Demo")

(Got an error? Here's the [full code](https://gist.github.com/photonstorm/46cb8fb4b19fc7717dcad514cdcec064))

This is a tiny example, and there are hundreds more for you to explore, but hopefully it shows how expressive and quick Phaser is to use. With just a few easily readable lines of code, we've got something pretty impressive up on screen!

[![Ourcade](https://phaser.io/images/github/ourcade.jpg)](https://blog.ourcade.co)

Ourcade have published [two great Phaser 3 books](https://blog.ourcade.co). They'll take you from getting set-up, through to finishing your first game using modern JavaScript or TypeScript and they're both completely free! They also publish a huge range of quality tutorials and videos, so be sure to check out their site every week.

[![HTML5 Cross Platform Game Development with Phaser 3](https://phaser.io/images/github/feronato.png)](https://gumroad.com/a/244184179)

Learn the secrets of HTML5 game development with Phaser 3.50 while building a cross platform endless runner game. Designed both for beginners and skilled programmers, the course guides you from an empty folder introducing the bare bones of JavaScript to advanced Phaser 3 features. Find out more details about [HTML5 Cross Platform Game Development with Phaser](https://gumroad.com/a/244184179).

![Building Phaser](https://phaser.io/images/github/div-building-phaser.png "Building Phaser")

There are both plain and minified compiled versions of Phaser in the `dist` folder of the repository. The plain version is for use during development, and the minified version is for production use. You can and should also create your own builds.

### Custom Builds

Phaser 3 is built using Webpack and we take advantage of the Webpack definePlugin feature to allow for conditional building of the Canvas and WebGL renderers and extra plugins. You can custom the build process to only include the features you require. Doing so can cut the main build file size down to just 70KB.

Read our [comprehensive guide](https://github.com/photonstorm/phaser3-custom-build#creating-custom-phaser-3-builds) on creating Custom Builds of Phaser 3 for full details.

### Building from Source

If you wish to build Phaser 3 from source, ensure you have the required packages by cloning the repository and then running `npm install` on your source directory.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

Due to the increasing size of our Change Logs we have now split them up, one version per folder.

* [v3.60.0 Change Log](changelog/3.60/CHANGELOG-v3.60.md)
* [v3.0.0 to v3.55.2. Change Logs](CHANGELOG.md)

We've organized the Change Logs into commonly themed sections to make it more digestible, but we appreciate there is a lot in there. Please don't feel overwhelmed! If you need clarification about something, join us on the Phaser Discord and ask.

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

The Phaser logo and characters are &copy; 2011 - 2023 Photon Storm Limited.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/photonstorm/phaser/releases/download/v3.60.0/phaser.js
[get-minjs]: https://github.com/photonstorm/phaser/releases/download/v3.60.0/phaser.min.js
[clone-http]: https://github.com/photonstorm/phaser.git
[clone-ssh]: git@github.com:photonstorm/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/photonstorm/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/photonstorm/phaser
[phaser]: https://github.com/photonstorm/phaser
[issues]: https://github.com/photonstorm/phaser/issues
[examples]: https://github.com/photonstorm/phaser3-examples
[contribute]: https://github.com/photonstorm/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
