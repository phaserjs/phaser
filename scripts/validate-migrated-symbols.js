const fs = require('fs');
const path = require('path');
const {
    discoverMigratedModules,
    parseSourceFile,
    collectExportedDeclarationKinds,
    validateSymbolInDeclarations
} = require('./tsgen/bin/MigratedOverlay');

const repoRoot = path.resolve(__dirname, '..');
const declarationsPath = path.join(repoRoot, 'types', 'phaser.d.ts');
const supportedExpectedKinds = new Set([ 'class', 'function', 'variable', 'interface', 'type', 'enum', 'namespace' ]);

function getCanonicalSymbolName(canonicalSymbol)
{
    const parts = canonicalSymbol.split('.');

    if (parts.length < 2)
    {
        return null;
    }

    return parts[parts.length - 1];
}

function inferExpectedKindForSymbol(modulePath, canonicalSymbol, moduleSymbolKindsCache)
{
    let symbolKinds = moduleSymbolKindsCache.get(modulePath);

    if (!symbolKinds)
    {
        const absoluteModulePath = path.join(repoRoot, modulePath);

        if (!fs.existsSync(absoluteModulePath))
        {
            throw new Error(`Manifest references missing module file: ${modulePath}`);
        }

        symbolKinds = collectExportedDeclarationKinds(absoluteModulePath);
        moduleSymbolKindsCache.set(modulePath, symbolKinds);
    }

    const symbolName = getCanonicalSymbolName(canonicalSymbol);

    if (!symbolName)
    {
        throw new Error(`Invalid canonical symbol path: ${canonicalSymbol}`);
    }

    const expectedKinds = symbolKinds.get(symbolName);

    if (!expectedKinds || expectedKinds.size === 0)
    {
        throw new Error(`Unable to infer declaration kind for ${canonicalSymbol} from ${modulePath}. Expected an exported declaration named ${symbolName}.`);
    }

    const inferredKinds = Array.from(expectedKinds);

    for (let i = 0; i < inferredKinds.length; i++)
    {
        if (!supportedExpectedKinds.has(inferredKinds[i]))
        {
            throw new Error(`Unsupported declaration kind for ${canonicalSymbol} from ${modulePath}: ${inferredKinds[i]}. Supported kinds: class, function, variable, interface, type, enum, namespace.`);
        }
    }

    inferredKinds.sort();

    // Heuristic: variable exports typically represent mixin factories whose
    // companion interface should also be validated.
    if (inferredKinds.includes('variable') && !inferredKinds.includes('interface'))
    {
        inferredKinds.push('interface');
    }

    return inferredKinds;
}

function collectCanonicalSymbols(manifest)
{
    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest))
    {
        throw new Error('Invalid manifest shape: expected an object mapping module paths to arrays of canonical symbols.');
    }

    const symbols = [];
    const seenSymbols = new Map();
    const moduleSymbolKindsCache = new Map();
    const files = Object.keys(manifest);

    for (let i = 0; i < files.length; i++)
    {
        const modulePath = files[i];
        const canonicalSymbols = manifest[modulePath];

        if (!Array.isArray(canonicalSymbols))
        {
            throw new Error(`Invalid manifest entry for ${modulePath}: expected an array of canonical symbols.`);
        }

        for (let j = 0; j < canonicalSymbols.length; j++)
        {
            const canonicalSymbol = canonicalSymbols[j];

            if (typeof canonicalSymbol !== 'string' || canonicalSymbol.length === 0)
            {
                throw new Error(`Invalid canonical symbol in ${modulePath} at index ${j}: expected a non-empty string.`);
            }

            if (seenSymbols.has(canonicalSymbol))
            {
                const firstModulePath = seenSymbols.get(canonicalSymbol);

                throw new Error(`Duplicate canonical symbol in manifest: ${canonicalSymbol} appears in both ${firstModulePath} and ${modulePath}.`);
            }

            seenSymbols.set(canonicalSymbol, modulePath);

            symbols.push({
                symbol: canonicalSymbol,
                expectedKinds: inferExpectedKindForSymbol(modulePath, canonicalSymbol, moduleSymbolKindsCache)
            });
        }
    }

    symbols.sort((a, b) => a.symbol.localeCompare(b.symbol));

    return symbols;
}

function main()
{
    if (!fs.existsSync(declarationsPath))
    {
        console.error(`Unable to find generated declarations: ${declarationsPath}`);
        process.exit(1);
    }

    let manifest;

    try
    {
        manifest = discoverMigratedModules();
    }
    catch (error)
    {
        console.error(`Unable to discover migrated modules: ${error.message}`);
        process.exit(1);
    }

    let canonicalSymbols;

    try
    {
        canonicalSymbols = collectCanonicalSymbols(manifest);
    }
    catch (error)
    {
        console.error(`Invalid migrated modules: ${error.message}`);
        process.exit(1);
    }

    const sourceFile = parseSourceFile(declarationsPath);
    const missingSymbols = [];

    for (let i = 0; i < canonicalSymbols.length; i++)
    {
        const entry = canonicalSymbols[i];
        const result = validateSymbolInDeclarations(sourceFile, entry.symbol, entry.expectedKinds);

        if (result)
        {
            missingSymbols.push(result);
        }
    }

    if (missingSymbols.length > 0)
    {
        console.error('Missing migrated canonical symbols in types/phaser.d.ts:');

        for (let i = 0; i < missingSymbols.length; i++)
        {
            const missing = missingSymbols[i];
            console.error(`- ${missing.symbol} (${missing.reason})`);
        }

        process.exit(1);
    }

    console.log(`Validated ${canonicalSymbols.length} migrated canonical symbols in types/phaser.d.ts with declaration kind checks.`);
}

main();
