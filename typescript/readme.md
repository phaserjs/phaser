# TypeScript Definitions #

If you are a phaser dev then reference the `phaser.d.ts` in your project. 

Please use TypeScript 1.4

- `phaser.d.ts` contains a reference to `pixi.d.ts` and so both these files must remain siblings in the same directory.
- `pixi.d.ts` has no dependencies and can be used by pixi devs standalone.

Included in this folder are also:

- `phaser.comments.d.ts` 
- `pixi.comments.d.ts`

These are simply annotated versions of their respective files. You should only include one version of each file, commented or not otherwise
you will run into conflicts.

## Contributing ##

If you find any mistakes in these definitions or you feel they can be improved in any way, please make a pull request against the dev branch. 