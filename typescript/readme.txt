
If you are a phaser dev, just grab the whole directory as is. It is setup with sibling references and is the easiest way to get full typed support. Otherwise:

phaser.plugins.x.d.ts depend on phaser.d.ts and are optional.*
phaser.d.ts depends on pixi.d.ts and so both these files are needed
pixi.d.ts has no dependicies**

*If creating a third party plugin definition. Please add a reference path to point at phaser /// <reference path="phaser.d.ts" />

*Versions of TypeScript lower than version 1.0 may experience errors in pixi.d.ts due to missing WebGL definitions. Download this https://github.com/piersh/WebGL.ts and add the definition to the top of your pixi.d.ts file with a reference. /// <reference path="webgl.d.ts" /> to resolve these errors.