# TypeScript Definitions #

Reference the `phaser.d.ts` in your project. 

Please use TypeScript 1.4+

- `phaser.d.ts` contains a reference to `pixi.d.ts` and `p2.d.ts` and so both these files must remain siblings in the same directory. 
- `pixi.d.ts` has deviated from the official project. If you are a pixi user, pick up the ball over at [the  official pixi typescript repo](https://github.com/pixijs/pixi-typescript). 

## Including typescript definitions in your project using Typings

You can now use typings, the TypeScript Definition Manager, to include Phaser's typescript definitions in your project: 
- Make sure that typings is installed in your system: `npm install -g typings`
- Install phaser typescript definitions as a global dependency: 
```
typings install github:photonstorm/phaser/typescript/typings.json -GD
```

This will make phaser typescript definitions available for your compiler so that there is no need to reference them from your source files. 
For more information, check [the official typings site](https://github.com/typings/typings). 

## Contributing ##

If you find any mistakes in these definitions or you feel they can be improved in any way, please make a pull request against the dev branch. 

## Note ##

`Creature` defs are not yet provided.

The Box2D defs come from https://github.com/SBCGames/Phaser-Box2D-Typescript-defs
