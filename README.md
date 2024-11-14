# Phaser - HTML5 Game Framework

![Phaser Banner](changelog/assets/phaser-banner.png "Phaser Banner")

[![Discord](https://img.shields.io/discord/244245946873937922?style=for-the-badge)](https://discord.gg/phaser)
![JSDelivr](https://img.shields.io/jsdelivr/npm/hm/phaser?style=for-the-badge)
![GitHub](https://img.shields.io/github/downloads/phaserjs/phaser/total?style=for-the-badge)

Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers and has been actively developed for over 10 years.

Games can be built for the web, or as YouTube Playables, Discord Activities, Twitch Overlays or compiled to iOS, Android, Steam and native apps using 3rd party tools. You can use JavaScript or TypeScript for development. Phaser supports over 40 different front-end frameworks including React and Vue.

Phaser is commercially developed and maintained by **Phaser Studio Inc** along with our fantastic open source community. As a result of rapid support, and a developer friendly API, Phaser is currently one of the [most starred](https://github.com/collections/javascript-game-engines) game frameworks on GitHub.

Interested in learning more? Click the image below to watch our intro video.

[![YouTube](http://i.ytimg.com/vi/jHTRu4iNTcA/maxresdefault.jpg)](https://www.youtube.com/watch?v=jHTRu4iNTcA)

## v4 Beta Release

You are looking at the Beta Release of Phaser v4. There are large internal differences between Phaser v3 and v4, although the public API has remained largely, but not entirely, the same.

Please only use this release if you wish to help beta test Phaser v4.

v4 contains the following API-breaking changes:

✔️ We have removed `Phaser.Struct.Set` and replaced it with a regular JS `Set` instance. This means methods like `iterateLocal` are gone.  
✔️ We have removed the `Create.GenerateTexture` function and all of the Create Palettes and the `create` folder.  
✔️ `TextureManager.generate` has been removed as a result of the GenerateTexture removal.  
✔️ We have removed the `phaser-ie9.js` entry-point.  
✔️ We have removed the following polyfills: Array.forEach, Array.isArray, AudioContextMonkeyPatch, console, Math.trunc, performance.now, requestAnimationFrame and Uint32Array.  
✔️ We have removed the Facebook Plugin detection constants from the core library.  
✔️ We have removed the Camera3D Plugin.  
✔️ We have removed the Layer3D Plugin.  
* We are removing `Phaser.Struct.Map` and replacing it with a regular JS `Map` instance. This means methods like `contains` and `setAll` will be gone.  
* The `Geom.Point` class and all related functions will be removed. All functionality for this can be found in the existing Vector2 math classes. All Geometry classes that currently create and return Point objects will be updated to return Vector2 objects instead.  
* The Spine 3 and Spine 4 plugins will no longer be updated. You should now use the official Phaser Spine plugin created by Esoteric Software.  

## Installing Phaser from NPM

Install via [npm](https://www.npmjs.com/package/phaser):

```bash
npm install phaser@beta
```

## Phaser TypeScript Definitions

Full TypeScript definitions can be found inside the [types folder](https://github.com/phaserjs/phaser/tree/master/types). They are also referenced in the `types` entry in `package.json`, meaning modern editors such as VSCode will detect them automatically.

Depending on your project, you may need to add the following to your `tsconfig.json` file:

```json
"lib": ["es6", "dom", "dom.iterable", "scripthost"],
"typeRoots": ["./node_modules/phaser/types"],
"types": ["Phaser"]
```

## Have fun!

Grab the source and join the fun!

Phaser wouldn't have been possible without the fantastic support of the community. Thank you to everyone who supports our work, who shares our belief in the future of HTML5 gaming, and Phaser's role in that.

Happy coding everyone!

Cheers,

[Rich](mailto:rich@phaser.io) and the whole team at Phaser Studio

![boogie](https://www.phaser.io/images/spacedancer.gif)

**Visit** the [Phaser website](https://phaser.io)<br />
**Play** some [amazing games](https://phaser.io/games)<br />
**Learn** By browsing our [API Docs](https://newdocs.phaser.io), [Support Forum](https://phaser.discourse.group/) and [StackOverflow](https://stackoverflow.com/questions/tagged/phaser-framework)<br />
**Code Examples?** We've over 2000 [Examples](https://phaser.io/examples) to learn from<br />
**Read** the weekly [Phaser World](https://phaser.world) Newsletter<br />
**Be Social:** Join us on [Discord](https://discord.gg/phaser) and [Reddit](https://phaser.io/community/reddit) or follow us on [Twitter](https://twitter.com/phaser_)<br />

Powered by coffee, anime, pixels and love.

The Phaser logo and characters are &copy; 2011 - 2024 Phaser Studio Inc.

All rights reserved.

"Above all, video games are meant to be just one thing: fun. Fun for everyone." - Satoru Iwata
