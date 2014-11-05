# TypeScript Definitions #

If you are a phaser dev, just grab the whole directory as is. It is setup with sibling references and is the easiest way to get full typed support. Otherwise:

- `phaser.plugins.x.d.ts` depend on `phaser.d.ts` and are optional.*
- `phaser.d.ts` depends on `pixi.d.ts` and so both these files are needed
- `pixi.d.ts` has no dependicies and can be used by pixi devs**

*If creating a third party plugin definition. Please add a reference path to point at phaser `/// <reference path="phaser.d.ts" />`

**Versions of TypeScript lower than version 1.0 may experience errors in `pixi.d.ts` due to missing WebGL definitions. If you fall into this category then a `webgl.d.ts` has been provided but is disabled by default. Add this line to the top of the pixi.d.ts file `/// <reference path="webgl.d.ts" />` to fix the type errors. 