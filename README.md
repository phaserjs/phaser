# Phaser - HTML5 Game Framework

![Phaser Header](https://phaser.io/images/github/300/phaser-header.png "Phaser 3 Header Banner")

[![Discord](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
![JSDelivr](https://img.shields.io/jsdelivr/npm/hm/phaser?style=for-the-badge)
![GitHub](https://img.shields.io/github/downloads/phaserjs/phaser/total?style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.

Along with the fantastic open source community, Phaser is actively developed and maintained by **Phaser Studio Inc**. As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Thousands of developers from indies to multi-national digital agencies, along with universities worldwide use Phaser. Take a look at their incredible [games](https://phaser.io/games/) in our showcase video:

[![Phaser Games Showcase video](https://img.youtube.com/vi/gnfgwkVg7vc/maxresdefault.jpg)](https://www.youtube.com/watch?v=gnfgwkVg7vc)

**Visit** the [Phaser website](https://phaser.io)<br />
**Play** some [amazing games](https://phaser.io/games)<br />
**Learn** By browsing our [API Docs](https://newdocs.phaser.io), [Support Forum][forum] and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code Examples?** We've over 2000 [Examples](https://phaser.io/examples) to learn from<br />
**Read** the weekly [Phaser World](https://phaser.io/newsletter/2024) Newsletter<br />
**Be Social:** Join us on [Discord](https://discord.gg/phaser) and [Reddit](https://phaser.io/community/reddit) or follow us on [Twitter](https://twitter.com/phaser_)<br />

Grab the source and join the fun!

![What's New](https://phaser.io/images/github/div2-whats-new.png "What's New")

> 21st June 2024

The Phaser Studio team have been hard at work on the **v3.85** release, which went into beta today. This release builds upon the improvements made in v3.80 and brings lots more fixes and updates to the party. We send our thanks to the Phaser community for their help in both reporting issues and submitting pull requests. You lot always keep us on our toes 🙂

In parallel we've also been busy working on a replacement physics engine and a brand new renderer, built from the ground-up to be as efficient and powerful as possible for 2D web games. Keep track of everything in our weekly newsletter [Phaser World](https://phaser.io/newsletter/2024).

Phaser also hit **36,500 stars** on GitHub and is used by over 34,600 developers. These figures are a testament to the growing community who has embraced Phaser as their go-to framework for web game development. We're grateful for the support and feedback we've received, and we're committed to continuing to evolve Phaser to meet your needs.

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

### Create Phaser Game App

One of the easiest ways to get started quickly with Phaser is by using our new `create-phaser-game` app. This is a CLI tool that presents an interactive selection of official project templates and demo games. Just issue the command, answer some questions and the app will download and configure the right package for your needs.

Currently, we support all of the following frameworks and bundlers:

| Frameworks | Bundlers |
| --------- | ------- |
| Vue.js | Vite |
| React | Rollup |
| Angular | Parcel |
| Next.js | Webpack |
| SolidJS | ESBuild |
| Svelte | Import Map |
| Remix | Bun |

Most of these come in both JavaScript and TypeScript versions.

[Read all about the app here](https://phaser.io/tutorials/create-game-app).

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

### License

Phaser is released under the [MIT License](https://opensource.org/licenses/MIT).

![Getting Started](https://phaser.io/images/github/div2-getting-started.png "Getting Started")
<a name="getting-started"></a>

Tutorials and guides on Phaser are being published every week.

* [Getting Started with Phaser 3](https://phaser.io/tutorials/getting-started-phaser3) (useful if you are completely new to Phaser)
* [Making your first Phaser 3 Game](https://phaser.io/tutorials/making-your-first-phaser-3-game)
* The [Complete Phaser 3 Game Development course](https://academy.zenva.com/product/html5-game-phaser-mini-degree/?a=13) contains over 15 hours of videos covering all kinds of important topics.
* Plus, there are [over 700 Phaser tutorials](https://phaser.io/learn) listed on the official website.

### Free Phaser by Example Book

A brand-new free 500 page book on game development with Phaser. Learn by building shoot-em-ups, puzzle games, rogue-likes and more.

![Phaser by Example](https://cdn.phaser.io/news/2024/04/phaser-by-example-book.jpg)

Written by long-time prolific Phaser enthusiast Pello Xabier Altadill and Richard Davey, creator of Phaser, it contains over 500 pages of brand-new, up-to-date content on building games with Phaser v3.80.

The book is divided into 17 chapters and takes you through the process of creating a variety of different games. As the title implies, this allows you to learn by working through real-life examples. The games start off simple with an infinite runner game - but then progress through how to build a shoot-em-up, a platformer, a puzzle game, a rogue-like, a story game, and even includes a 3D game and a Multiplayer shooter.

As well as the games, Richard has written a large section on the core concepts of Phaser, covering the terminology and conventions used by the framework, as well as a comprehensive deep dive into Game Objects - the life blood of any Phaser game. You'll be guided through topics including the Game Object Factory, Masks, custom Blend Modes, and lots more.

The book is then rounded out with chapters on working with assets, popular build tools, the rule of 4:44, and the benefits of taking part in game jams — as well as a handy Phaser cookbook.

[Download the book](https://phaser.io/news/2024/04/phaser-by-example-book) by registering for a free Phaser account.

### Source Code Examples

During the development of Phaser, we created hundreds of examples with the full source code and assets ready available. These examples can be browsed on the [Phaser 3 Labs](https://labs.phaser.io), or clone the [examples repo][examples]. We are constantly adding to and refining these examples.

### Hathora

[Hathora Cloud](https://hathora.dev/docs) is a scalable hosting platform for online multiplayer games. You upload your server project using the Hathora console or CLI, and then dynamically create server instances in 10+ regions around the world. You get charged only for the duration of active matches/sessions. It's perfect for nodejs servers handling WebSocket connections, and takes care of SSL termination (for wss) and DDoS protection.

They have also published a [brand-new tutorial](https://bullet-mania.vercel.app/) on creating a scalable multiplayer Phaser game. If you think this could be useful for your hosting needs, join their [Discord server](https://discord.gg/hathora) to get in touch.

### Huge list of Phaser 3 Plugins

Super community member RexRainbow has been publishing Phaser 3 content for years, building up an impressive catalogue in that time. You'll find [loads of plugins](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html#list-of-my-plugins), from UI controls such as text input boxes, to Firebase support, Finite State Machines and lots more. As well as the plugins there is also a comprehensive set of 'Notes' about Phaser 3, going into great detail about how the various systems work. It's an invaluable resource and well worth checking out at [https://rexrainbow.github.io](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html)

### Create Your First Phaser 3 Example

**Phaser Sandbox**: If you'd rather not test Phaser locally, then you can [register for a free account](https://phaser.io/register) on our site and use the [Phaser Sandbox](https://phaser.io/sandbox/XyqPcjNr). Here you'll find a fully-configured online editor, ready to go. Otherwise, read on ...

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

If you can't get it to run, then have a look at this example in the [Phaser Sandbox](https://phaser.io/sandbox/XyqPcjNr).

This is a tiny example, and there are hundreds more for you to explore, but hopefully it shows how expressive and quick Phaser is to use. With just a few easily readable lines of code, we've got something pretty impressive up on screen!

![Building Phaser](https://phaser.io/images/github/div2-building-phaser.png "Building Phaser")

There are both plain and minified compiled versions of Phaser in the `dist` folder of the repository. The plain version is for use during development, and the minified version is for production use. You can and should also create your own builds.

### Phaser Compressor

Use our powerful new web-based tool to crunch your Phaser bundles down by up to 60%, enabling only the features your game requires.

Read more about [Phaser Compressor](https://phaser.io/news/2024/05/phaser-compressor-released)

### Building from Source

If you wish to build Phaser from source, ensure you have the required packages by cloning the repository and then running `npm install` on your source directory.

You can then run `webpack` to create a development build in the `build` folder which includes source maps for local testing. You can also `npm run dist` to create a minified packaged build in the `dist` folder. For a list of all commands available use `npm run help`.

![Change Log](https://phaser.io/images/github/div2-change-log.png "Change Log")
<a name="changelog"></a>

# Change Log

Due to the increasing size of our Change Logs we have now split them up, one version per folder.

* [v3.85 Change Log](changelog/3.85/CHANGELOG-v3.85.md)
* [v3.0.0 to v3.80.1. Change Logs](CHANGELOG.md)

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
[examples]: https://github.com/phaserjs/examples
[contribute]: https://github.com/phaserjs/phaser/blob/master/.github/CONTRIBUTING.md
[forum]: https://phaser.discourse.group/
