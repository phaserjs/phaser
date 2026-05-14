## TypeScript Defs Generation Tool

The TypeScript defs generation tool is called `tsgen` and is written in TypeScript. Build it by running `npm run build-tsgen`. This will compile the parser locally.

You can then run `npm run tsgen` to build the actual defs. They will replace the file located in the root `types` folder. Once the parser is built you only need use this command. Use it to re-generate the defs if you have modified the Phaser source code and wish to test your change worked.

There is also a test script available: `npm run test-ts` which will compile a test TypeScript project and output any compilation errors to `output.txt`.

## Hybrid migration foundation

Type generation now uses a hybrid model during native TypeScript migration:

1. JSDoc + tsgen remain the baseline for non-migrated modules.
2. Migrated modules are declared from native TypeScript and overlaid into the final single-file output.
3. `types/phaser.d.ts` remains the public artifact.

### Migrated module discovery

Migrated modules are discovered automatically by scanning `src/**/*.ts` files
(excluding `.d.ts`) for JSDoc namespace annotations (`@function Phaser.X.Y` or
`@class` + `@memberof Phaser.X`). No manual manifest is required.

The discovery drives synthetic continuity handling and migrated-symbol validation.

### Synthetic symbol continuity rationale

When a module moves from JSDoc-authored `.js` to native `.ts`, its JSDoc owner doclets can disappear from the baseline parse. Non-migrated helpers under the same namespace path can then lose parent ownership and fail to bind.

To avoid this, tsgen injects synthetic migrated parent symbols before parser resolution. These placeholders preserve namespace/class/function continuity for baseline binding and are then replaced by TS-authoritative declarations during overlay.

### Guard scripts and expected usage

- `npm run check:migrated-jsdoc-types`: fails if migrated `.ts` files still contain type-bearing JSDoc payloads.
- `npm run validate:migrated-symbols`: fails if canonical symbols listed in the manifest are missing from `types/phaser.d.ts`.

Recommended verification sequence for hybrid migration work:

1. `npm run build-tsgen`
2. `npm run check:migrated-jsdoc-types`
3. `npm run tsgen`
4. `npm run validate:migrated-symbols`
5. `npm run test-ts`

Run `npm run build` as a final repository-level integration gate when landing migration changes.

### Adding a newly migrated module

For each newly migrated module:

1. Keep runtime `.js` wrapper compatibility in place during the hybrid period.
2. Remove only type-bearing JSDoc syntax in the migrated `.ts` file; keep semantic docs and tags
   (including `@function Phaser.X.Y` or `@class` + `@memberof Phaser.X` — these are used for
   auto-discovery).
3. Regenerate and validate with the hybrid verification sequence above.

Wrapper lifecycle policy during hybrid migration:

- wrappers remain while runtime/test pipelines depend on `src`-path `.js` loading,
- runtime dynamic wrapper generation is not allowed,
- deterministic manifest-driven wrapper generation is optional only if manual maintenance becomes noisy,
- wrapper removal is allowed only after CI validates wrapper-free build and type gates.
