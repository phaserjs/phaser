const fs = require('fs');
const path = require('path');
const { discoverMigratedModules } = require('./tsgen/bin/MigratedOverlay');

const repoRoot = path.resolve(__dirname, '..');

function getLineNumber(text, index)
{
    let line = 1;

    for (let i = 0; i < index; i++)
    {
        if (text[i] === '\n')
        {
            line++;
        }
    }

    return line;
}

function collectViolations(filePath, source)
{
    const violations = [];
    const commentRegex = /\/\*\*[\s\S]*?\*\//g;

    const explicitTypedTagRegex = /@(param|arg|argument|returns?|type|property|prop|typedef)\s*\{(?!@)[^}]+\}/gi;
    const trailingTypedPayloadRegex = /@(param|arg|argument|property|prop)\s+[^{}\n]+\s+\{(?!@)[^}]+\}/gi;

    let commentMatch;

    while ((commentMatch = commentRegex.exec(source)) !== null)
    {
        const commentText = commentMatch[0];
        const commentStart = commentMatch.index;

        const checks = [
            { regex: explicitTypedTagRegex, kind: 'typed-tag' },
            { regex: trailingTypedPayloadRegex, kind: 'typed-tag-payload' }
        ];

        for (let i = 0; i < checks.length; i++)
        {
            const check = checks[i];
            check.regex.lastIndex = 0;

            let lineMatch;

            while ((lineMatch = check.regex.exec(commentText)) !== null)
            {
                const absoluteIndex = commentStart + lineMatch.index;
                const line = getLineNumber(source, absoluteIndex);

                violations.push({
                    filePath,
                    line,
                    kind: check.kind,
                    snippet: lineMatch[0]
                });
            }
        }
    }

    return violations;
}

function main()
{
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

    const migratedFiles = Object.keys(manifest);
    const violations = [];

    for (let i = 0; i < migratedFiles.length; i++)
    {
        const relativePath = migratedFiles[i];
        const absolutePath = path.join(repoRoot, relativePath);

        if (!fs.existsSync(absolutePath))
        {
            console.error(`Manifest entry does not exist: ${relativePath}`);
            process.exit(1);
        }

        const source = fs.readFileSync(absolutePath, 'utf8');
        const fileViolations = collectViolations(relativePath, source);

        for (let j = 0; j < fileViolations.length; j++)
        {
            violations.push(fileViolations[j]);
        }
    }

    if (violations.length > 0)
    {
        console.error('Found type-bearing JSDoc annotations in migrated TypeScript files:');

        for (let i = 0; i < violations.length; i++)
        {
            const violation = violations[i];
            console.error(`- ${violation.filePath}:${violation.line} (${violation.kind}) ${violation.snippet}`);
        }

        process.exit(1);
    }

    console.log('No type-bearing JSDoc annotations found in migrated TypeScript files.');
}

main();
