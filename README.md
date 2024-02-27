# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

[![Discord chat](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
[![Twitter Follow](https://img.shields.io/twitter/follow/phaser_?style=for-the-badge)](https://twitter.com/phaser_)
![npm](https://img.shields.io/jsdelivr/npm/hm/phaser?style=for-the-badge)
![GitHub](https://img.shields.io/github/downloads/phaserjs/phaser/total?style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by **Phaser Studio Inc**. As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indies to multi-national digital agencies, along with universities worldwide use Phaser. Take a look at their incredible [games](https://phaser.io/games/) in our showcase video:

[![Phaser Games Showcase video](https://img.youtube.com/vi/gnfgwkVg7vc/maxresdefault.jpg)](https://www.youtube.com/watch?v=gnfgwkVg7vc)

**Visit:** The [Phaser website](https://phaser.io) and follow on [Phaser Twitter](https://twitter.com/phaser_)<br />
**Play:** Some of the amazing games [#madewithphaser](https://twitter.com/search?q=%23madewithphaser&src=typed_query&f=live)<br />
**Learn:** [API Docs](https://newdocs.phaser.io), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code:** 2000+ [Examples](https://phaser.io/examples) (source available in this [repo][examples])<br />
**Read:** The [Phaser World](#newsletter) Newsletter<br />
**Discord:** Join us on [Discord](https://discord.gg/phaser)<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div2-whats-new.png "What's New")

> 27th February 2024

The release of Phaser 3.80, affectionately dubbed "Nino," represents a significant leap forward in our quest to provide an even more powerful and versatile web game development framework. This update showcases our commitment to innovation, bolstered by the insightful feedback and contributions from our dedicated community and the tireless efforts of our development team.

Phaser 3.80 brings an array of new capabilities and improvements that enrich the developer experience. Among the highlights:

- **WebGL Context Loss Handling**: A robust solution to keep your games running smoothly, even in the face of WebGL context losses, ensuring uninterrupted gameplay.

- **Compressed Texture Improvements**: Added support for BPTC and RGTC file formats, sRGB color spaces and lots of updates around Mipmaps levels.

- **Base64 Loader Integration**: Allows for the loading of base64 encoded assets, facilitating smoother development processes for environments requiring embedded assets, like Playable Ads.

- **Scale Manager Snap Mode**: A new feature allowing developers to set a 'snapping' value for game dimensions, ideal for pixel-art games and those requiring precise scaling control.

- **Tilemap Enhancements**: Fixes and updates for tile collision and rendering, enhanced Tile to Sprite creation properties and more control over tile-based game elements.

With this release, we've implemented over **100 updates and bug fixes**, addressing community-reported issues and optimizing Phaser's performance and stability. These changes reflect our ongoing dedication to enhancing the framework's capabilities, ensuring developers have the tools they need to bring their creative visions to life.

At the same time as this release we also hit the **36,000 stars** milestone on GitHub, are used by over 32,000 developers and have over 550 contributors! These figures are a testament to the growing community of developers who have embraced Phaser as their go-to framework for web game development. We're grateful for the support and feedback we've received, and we're committed to continuing to evolve Phaser to meet the needs of our community.

We're excited for you to dive into Phaser 3.80 "Nino" and explore the new features and improvements. As always, we look forward to your feedback and contributions as we continue to evolve Phaser together. To make sure you read our weekly Developer Logs, please [subscribe to our free newsletter](https://phaser.io/community/newsletter/).

> If you find any problems please report them in GitHub issues.

As usual, I'd like to send my thanks to the Phaser community for their help in both reporting issues and submitting pull requests to fix them 🙂

You can also follow Phaser on [Twitter](https://twitter.com/phaser_) and chat with fellow Phaser devs in our [Discord](https://discord.gg/phaser).

Phaser wouldn't have been possible without the fantastic support of the community. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

Rich and the team at Phaser Studio<br>
[@photonstorm](https://twitter.com/photonstorm)

![boogie](https://www.phaser.io/images/spacedancer.gif)

![Download Phaser](https://phaser.io/images/github/div2-download.png "Download Phaser")
<a name="download"></a>

Phaser is available via GitHub, npm and CDNs:

* Clone the git repository via [https][clone-http], [ssh][clone-ssh] or with the GitHub [Windows][clone-ghwin] or [Mac][clone-ghmac] clients.
* Download as [zip](https://github.com/phaserjs/phaser/archive/master.zip)
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
<script src="//cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.js"></script>
```

or the minified version:

```html
<script src="//cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
```

### API Documentation

Go to https://newdocs.phaser.io/ to read the docs online. Use the links to navigate the namespaces, classes and Game Objects lists and also use the search box.

The documentation for Phaser is an on-going project. Please help us by contributing improved docs and examples.

### TypeScript Definitions

The [TypeScript definitions](https://github.com/phaserjs/phaser/tree/master/types) can be found inside the `types` folder. They are also referenced in the `types` entry in `package.json`.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"lib": ["es6", "dom", "dom.iterable", "scripthost"],
"typeRoots": ["./node_modules/phaser/types"],
"types": ["Phaser"]
```

The TypeScript defs are automatically generated from the JSDoc comments found in the Phaser source code. If you wish to help refine them then you must edit the Phaser JSDoc blocks directly, not the defs file. You can find more details about the parser we built in the `scripts/tsgen` folder.

### Project Templates

If you are familiar with web development and bundlers, then we have published a selection of project templates to help you get started with your game quicky. Choose from the following:

* [Vue 3 + Vite Template](https://github.com/phaserjs/template-vue)
* [Vite Template](https://github.com/phaserjs/template-vite)
* [Webpack Template](https://github.com/phaserjs/template-webpack)
* [ESBuild Template](https://github.com/phaserjs/template-esbuild)
* [Import Map Template](https://github.com/phaserjs/template-importmap)
* [Rollup Template](https://github.com/phaserjs/template-rollup)
* [Parcel Template](https://github.com/phaserjs/template-parcel)

### License

Phaser is released under the [MIT License](https://opensource.org/licenses/MIT).

![Phaser World](https://phaser.io/images/github/div2-newsletter.png "Phaser World")
<a name="newsletter"></a>

The Phaser World newsletter is a weekly email that contains the latest news, updates, and releases from the Phaser community. It includes new games, code examples, and the latest articles.

[Subscribe here](https://phaser.io/community/newsletter)

![Getting Started](https://phaser.io/images/github/div2-getting-started.png "Getting Started")
<a name="getting-started"></a>

<img src="https://phaser.io/images/github/learn.jpg" align="right">

Tutorials and guides on Phaser are being published every week.

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* The [Complete Phaser 3 Game Development course](https://academy.zenva.com/product/html5-game-phaser-mini-degree/?a=13) contains over 15 hours of videos covering all kinds of important topics.
* Plus, there are [over 700 Phaser tutorials](https://phaser.io/learn) listed on the official website.

### Source Code Examples

During the development of Phaser, we created hundreds of examples with the full source code and assets ready available. These examples can be browsed on the [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Hathora

[Hathora Cloud](https://hathora.dev/docs) is a scalable hosting platform for online multiplayer games. You upload your server project using the Hathora console or CLI, and then dynamically create server instances in 10+ regions around the world. You get charged only for the duration of active matches/sessions. It's perfect for nodejs servers handling WebSocket connections, and takes care of SSL termination (for wss) and DDoS protection.

They have also published a [brand-new tutorial](https://bullet-mania.vercel.app/) on creating a scalable multiplayer Phaser game. If you think this could be useful for your hosting needs, join their [Discord server](https://discord.gg/hathora) to get in touch.

### Huge list of Phaser 3 Plugins

Super community member RexRainbow has been publishing Phaser 3 content for years, building up an impressive catalogue in that time. You'll find [loads of plugins](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html#list-of-my-plugins), from UI controls such as text input boxes, to Firebase support, Finite State Machines and lots more. As well as the plugins there is also a comprehensive set of 'Notes' about Phaser 3, going into great detail about how the various systems work. It's an invaluable resource and well worth checking out at [https://rexrainbow.github.io](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html)

### Create Your First Phaser 3 Example

Create an `index.html` page locally and paste the following code into it:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser-arcade-physics.min.js"></script> 
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

![Building Phaser](https://phaser.io/images/github/div2-building-phaser.png "Building Phaser")

There are both plain and minified compiled versions of Phaser in the `dist` folder of the repository. The plain version is for use during development, and the minified version is for production use. You can and should also create your own builds.

### Custom Builds

Phaser 3 is built using Webpack and we take advantage of the Webpack definePlugin feature to allow for conditional building of the Canvas and WebGL renderers and extra plugins. You can custom the build process to only include the features you require. Doing so can cut the main build file size down to just 70KB.

Read our [comprehensive guide](https://github.com/phaserjs/phaser3-custom-build#creating-custom-phaser-3-builds) on creating Custom Builds of Phaser 3 for full details.

### Building from Source

If you wish to build Phaser from source, ensure you have the required packages by cloning the repository and then running `npm install` on your source directory.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div2-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

Due to the increasing size of our Change Logs we have now split them up, one version per folder.

* [v3.80.1 Change Log](changelog/3.80.1/CHANGELOG-v3.80.1.md)
* [v3.0.0 to v3.80.0. Change Logs](CHANGELOG.md)

We've organized the Change Logs into commonly themed sections to make it more digestible, but we appreciate there is a lot in there. Please don't feel overwhelmed! If you need clarification about something, join us on the Phaser Discord and ask.

![Contributing](https://phaser.io/images/github/div2-contributing.png "Contributing")
<a name="contributing"></a>

The [Contributors Guide][contribute] contains full details on how to help with Phaser development. The main points are:

- Found a bug? Report it on [GitHub Issues][issues] and include a code sample. Please state which version of Phaser you are using! This is vitally important.

- Before submitting a Pull Request run your code through [ES Lint](https://eslint.org/) using our [config](https://github.com/phaserjs/phaser/blob/master/.eslintrc.json) and respect our [Editor Config](https://github.com/phaserjs/phaser/blob/master/.editorconfig).

- Before contributing read the [code of conduct](https://github.com/phaserjs/phaser/blob/master/.github/CODE_OF_CONDUCT.md).

Written something cool in Phaser? Please tell us about it in Discord, the [forum][forum], or simply email games@phaser.io

![Created by](https://phaser.io/images/github/div2-created-by.png "Created by")

Phaser is a [Photon Storm](http://www.photonstorm.com) and **Phaser Studio Inc** production.

![storm](https://www.phaser.io/images/github/photonstorm-x2.png)

Created by [Richard Davey](mailto:rich@phaser.io) and the team at **Phaser Studio Inc**. Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2011 - 2024 Phaser Studio Inc.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata

[get-js]: https://github.com/phaserjs/phaser/releases/download/v3.80.1/phaser.js
[get-minjs]: https://github.com/phaserjs/phaser/releases/download/v3.80.1/phaser.min.js
[clone-http]: https://github.com/phaserjs/phaser.git
[clone-ssh]: git@github.com:phaserjs/phaser.git
[clone-ghwin]: github-windows://openRepo/https://github.com/phaserjs/phaser
[clone-ghmac]: github-mac://openRepo/https://github.com/phaserjs/phaser
[phaser]: https://github.com/phaserjs/phaser
[issues]: https://github.com/phaserjs/phaser/issues
[examples]: https://github.com/phaserjs/phaser3-examples
[contribute]: https://github.com/phaserjs/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
