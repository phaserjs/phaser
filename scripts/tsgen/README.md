## TypeScript Defs Generation Tool

The TypeScript defs generation tool is called `tsgen` and is written in TypeScript. Build it by running `npm run build-tsgen`. This will compile the parser locally.

You can then run `npm run tsgen` to build the actual defs. They will replace the file located in the root `types` folder. Once the parser is built you only need use this command. Use it to re-generate the defs if you have modified the Phaser source code and wish to test your change worked.

There is also a test script available: `npm run test-ts` which will compile a test TypeScript project and output any compilation errors to `output.txt`.
