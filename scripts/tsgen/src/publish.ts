import * as fs from 'fs-extra';
import * as path from 'path';
import { Parser } from './Parser';
import {
    discoverMigratedModules,
    flattenCanonicalSymbols,
    reportMigrationProgress,
    buildSyntheticDoclets,
    applyMigratedAuthorityOverlay,
    normalizeDeclarationOutput,
    validateNoSyntheticLeak,
} from './MigratedOverlay';

let migratedCanonicalSymbolLookup: Set<string> | null = null;

export function isMigratedCanonicalSymbol(symbol: string): boolean {
    return migratedCanonicalSymbolLookup !== null && migratedCanonicalSymbolLookup.has(symbol);
}

export function publish(data: any, opts: any) {
    // remove undocumented stuff.
    data({ undocumented: true }).remove();
    // remove package data
    data({ kind: 'package' }).remove();
    // remove header comments
    data({ copyright: { isString: true } }).remove();
    // remove private members
    data({ access: 'private' }).remove();
    // remove ignored doclets
    data({ ignore: true }).remove();

    if (!fs.existsSync(opts.destination)) {
        fs.mkdirSync(opts.destination);
    }

    const docs = data().get();

    var str = JSON.stringify(docs, null, 4);

    fs.writeFileSync(path.join(opts.destination, 'phaser.json'), str);

    const manifest = discoverMigratedModules();
    const canonicalSymbols = flattenCanonicalSymbols(manifest);

    migratedCanonicalSymbolLookup = new Set(canonicalSymbols);

    reportMigrationProgress(canonicalSymbols.length);

    const syntheticDoclets = buildSyntheticDoclets(manifest, docs);

    docs.push(...syntheticDoclets);

    var out = new Parser(docs).emit();

    out = applyMigratedAuthorityOverlay(out, manifest);

    out = normalizeDeclarationOutput(out);

    validateNoSyntheticLeak(out, canonicalSymbols);

    fs.writeFileSync(path.join(opts.destination, 'phaser.d.ts'), out);
};
