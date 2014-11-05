# TypeScript Definitions #

If you are a phaser dev then reference the `phaser.d.ts` in your project. 

- `phaser.d.ts` contains a reference to `pixi.d.ts` and so both these files must remain siblings in the same directory.
- `pixi.d.ts` has no dependencies and can be used by pixi devs standalone*

*Versions of TypeScript lower than version 1.0 may experience errors in `pixi.d.ts` due to missing WebGL definitions. If you fall into this category and cannot upgrade your version, then a `webgl.d.ts` has been provided but is disabled by default. Add this line to the top of the `pixi.d.ts` file `/// <reference path="webgl.d.ts" />`

## Contributing ##

If you find any mistakes in these definitions or you feel they can be improved in any way, please make a pull request against the dev branch. 