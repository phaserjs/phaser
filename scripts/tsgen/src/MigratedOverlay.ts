import * as fs from 'fs-extra';
import * as path from 'path';
import * as ts from 'typescript';
import { SYNTHETIC_DOCLET_FLAG, SYNTHETIC_META_MARKER } from './Parser';

declare const __dirname: string;

export type MigratedModulesManifest = Record<string, string[]>;
type TsgenDoclet = Record<string, any>;
export type DeclarationKind = 'class' | 'function' | 'variable' | 'interface' | 'type' | 'enum' | 'namespace';
type MigratedSourceKind = 'class' | 'function' | 'type' | null;
type OverlayDeclarationKind = 'class' | 'function' | 'interface' | 'type';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

// ---------------------------------------------------------------------------
// Cached source-directory walk — single walk collects both .ts and .js files,
// and infers source kind (class/function) while reading each .ts file.
// ---------------------------------------------------------------------------

interface SrcWalkResult {
    tsFiles: string[];
    jsFiles: string[];
    sourceKindByRelPath: Map<string, MigratedSourceKind>;
}

let cachedSrcWalk: SrcWalkResult | null = null;

function walkSrcDirectory(): SrcWalkResult {
    if (cachedSrcWalk) {
        return cachedSrcWalk;
    }

    const srcDir = path.resolve(REPO_ROOT, 'src');
    const tsFiles: string[] = [];
    const jsFiles: string[] = [];

    function walk(dir: string): void {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                walk(fullPath);
            }
            else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                tsFiles.push(fullPath);
            }
            else if (entry.name.endsWith('.js')) {
                jsFiles.push(fullPath);
            }
        }
    }

    walk(srcDir);

    cachedSrcWalk = { tsFiles, jsFiles, sourceKindByRelPath: new Map() };

    return cachedSrcWalk;
}

// ---------------------------------------------------------------------------
// Canonical symbol extraction
// ---------------------------------------------------------------------------

function extractCanonicalSymbols(source: string): string[] {
    const symbols: string[] = [];
    const seen = new Set<string>();
    const jsdocBlockRegex = /\/\*\*[\s\S]*?\*\//g;
    const classAfterRegex = /export\s+(?:default\s+)?class\s+(\w+)/y;
    const typeAfterRegex = /export\s+type\s+(\w+)\b/y;
    let blockMatch: RegExpExecArray | null;

    while ((blockMatch = jsdocBlockRegex.exec(source)) !== null) {
        const block = blockMatch[0];
        const callbackMatch = block.match(/@callback\s+(Phaser(?:\.\w+)+)(?:\s|$)/);

        if (callbackMatch) {
            typeAfterRegex.lastIndex = skipWhitespaceAndLineCommentsAfterJSDoc(source, blockMatch.index + block.length);
            const typeMatch = typeAfterRegex.exec(source);
            const declarationName = callbackMatch[1].split('.').pop();

            if (typeMatch && typeMatch[1] === declarationName && !seen.has(callbackMatch[1])) {
                seen.add(callbackMatch[1]);
                symbols.push(callbackMatch[1]);
            }

            continue;
        }

        const functionMatch = block.match(/@function\s+(Phaser(?:\.\w+)+)(?:\s|$)/);

        if (functionMatch) {
            if (!seen.has(functionMatch[1])) {
                seen.add(functionMatch[1]);
                symbols.push(functionMatch[1]);
            }

            continue;
        }

        const memberofMatch = block.match(/@memberof\s+(Phaser(?:\.\w+)*)/);

        if (memberofMatch) {
            classAfterRegex.lastIndex = skipWhitespaceAndLineCommentsAfterJSDoc(source, blockMatch.index + block.length);
            const classMatch = classAfterRegex.exec(source);

            if (classMatch) {
                const symbol = `${memberofMatch[1]}.${classMatch[1]}`;

                if (!seen.has(symbol)) {
                    seen.add(symbol);
                    symbols.push(symbol);
                }
            }
        }

        // Handle mixin modules annotated with `@namespace Phaser.xxx.ClassName` where
        // the last segment matches an `export const ClassName` in the same file.
        // This covers migrated mixin components (e.g. Depth, Visible) that cannot use
        // the `@memberof + export class` pattern because they export a mixin function,
        // not a constructor class.
        const namespaceMatch = block.match(/@namespace\s+(Phaser(?:\.\w+)+)(?:\s|$)/);

        if (namespaceMatch) {
            const nsName = namespaceMatch[1];
            const lastName = nsName.split('.').pop()!;
            // Only extract when the file also exports a value with the same name as the
            // last namespace segment (const, function, or class).
            const escapedLastName = lastName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const exportPattern = new RegExp(`\\bexport\\s+(?:const|function|class)\\s+${escapedLastName}\\b`);

            if (exportPattern.test(source) && !seen.has(nsName)) {
                seen.add(nsName);
                symbols.push(nsName);
            }
        }
    }

    return symbols;
}

function skipWhitespaceAndLineCommentsAfterJSDoc(source: string, start: number): number {
    let index = start;

    while (index < source.length) {
        const char = source[index];
        const nextChar = source[index + 1];

        if (/\s/.test(char)) {
            index++;
        }
        else if (char === '/' && nextChar === '/') {
            const lineEnd = source.indexOf('\n', index + 2);

            index = lineEnd === -1 ? source.length : lineEnd + 1;
        }
        else {
            break;
        }
    }

    return index;
}

function inferSourceKind(source: string): MigratedSourceKind {
    if (/\bexport\s+(?:default\s+)?class\b/.test(source)) {
        return 'class';
    }

    if (/\bexport\s+(?:default\s+)?function\b/.test(source)) {
        return 'function';
    }

    if (/\bexport\s+type\s+\w+\b/.test(source)) {
        return 'type';
    }

    return null;
}

// ---------------------------------------------------------------------------
// Discovery & progress
// ---------------------------------------------------------------------------

export function discoverMigratedModules(): MigratedModulesManifest {
    const { tsFiles, sourceKindByRelPath } = walkSrcDirectory();
    const manifest: MigratedModulesManifest = {};

    for (const absolutePath of tsFiles) {
        const relativePath = path.relative(REPO_ROOT, absolutePath);
        const source = fs.readFileSync(absolutePath, 'utf8');

        // Cache source kind while we already have the file content
        sourceKindByRelPath.set(relativePath, inferSourceKind(source));

        const symbols = extractCanonicalSymbols(source);

        if (symbols.length > 0) {
            manifest[relativePath] = symbols;
        }
    }

    return manifest;
}

export function flattenCanonicalSymbols(manifest: MigratedModulesManifest): string[] {
    const symbols: string[] = [];
    const seen = new Set<string>();

    for (const [modulePath, canonicalSymbols] of Object.entries(manifest)) {
        for (const symbol of canonicalSymbols) {
            if (seen.has(symbol)) {
                throw new Error(`Duplicate canonical symbol '${symbol}' discovered in '${modulePath}'`);
            }

            seen.add(symbol);
            symbols.push(symbol);
        }
    }

    symbols.sort((a, b) => a.localeCompare(b));

    return symbols;
}

export function reportMigrationProgress(migratedCount: number): void {
    const { tsFiles, jsFiles } = walkSrcDirectory();
    const tsFilePaths = new Set(tsFiles);

    const leafJsCount = jsFiles.filter((jsPath) => {
        if (path.basename(jsPath) === 'index.js') {
            return false;
        }

        const tsCounterpart = jsPath.replace(/\.js$/, '.ts');

        return !tsFilePaths.has(tsCounterpart);
    }).length;

    const totalModules = leafJsCount + migratedCount;
    const percent = totalModules > 0 ? ((migratedCount / totalModules) * 100).toFixed(1) : '0.0';

    console.log('------------------------------------------------------------------');
    console.log(`TypeScript Migration: ${migratedCount} / ${totalModules} source modules (${percent}%)`);

    if (totalModules > 0 && migratedCount / totalModules >= 0.5) {
        console.log('Over 50% of source modules are now TypeScript.');
        console.log('Consider switching to a TS-first declaration pipeline.');
    }

    console.log('------------------------------------------------------------------');
}

// ---------------------------------------------------------------------------
// TS AST helpers (internal)
// ---------------------------------------------------------------------------

function getModuleDeclarationNameText(name: ts.ModuleName): string | null {
    if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
        return name.text;
    }

    return null;
}

export function getDeclarationKindForStatement(statement: ts.Statement): DeclarationKind | null {
    if (ts.isFunctionDeclaration(statement)) { return 'function'; }
    if (ts.isClassDeclaration(statement)) { return 'class'; }
    if (ts.isInterfaceDeclaration(statement)) { return 'interface'; }
    if (ts.isTypeAliasDeclaration(statement)) { return 'type'; }
    if (ts.isEnumDeclaration(statement)) { return 'enum'; }
    if (ts.isModuleDeclaration(statement)) { return 'namespace'; }
    if (ts.isVariableStatement(statement)) { return 'variable'; }

    return null;
}

function getStatementName(statement: ts.Statement): string | null {
    if (ts.isModuleDeclaration(statement)) {
        return getModuleDeclarationNameText(statement.name);
    }

    if ('name' in statement) {
        const named = statement as unknown as { name?: ts.Node };

        if (named.name && ts.isIdentifier(named.name)) {
            return named.name.text;
        }
    }

    return null;
}

/**
 * Collect all statements from the namespace identified by `namespaceParts`,
 * merging multiple declarations of the same namespace (common in .d.ts files).
 * Returns an empty array when the namespace path cannot be resolved.
 */
function collectNamespaceMembers(sourceFile: ts.SourceFile, namespaceParts: string[]): ReadonlyArray<ts.Statement> {
    let currentStatements: ReadonlyArray<ts.Statement> = sourceFile.statements;

    for (const part of namespaceParts) {
        const nextStatements: ts.Statement[] = [];
        let matched = false;

        for (const statement of currentStatements) {
            if (!ts.isModuleDeclaration(statement) || getModuleDeclarationNameText(statement.name) !== part) {
                continue;
            }

            matched = true;

            let body: ts.ModuleBody | undefined = statement.body;

            while (body && ts.isModuleDeclaration(body)) {
                body = body.body;
            }

            if (body && ts.isModuleBlock(body)) {
                for (const stmt of body.statements) {
                    nextStatements.push(stmt);
                }
            }
        }

        if (!matched) {
            return [];
        }

        currentStatements = nextStatements;
    }

    return currentStatements;
}

function findDeclarationNode(
    statements: ReadonlyArray<ts.Statement>,
    declarationName: string,
    expectedKind?: OverlayDeclarationKind
): { node: ts.ClassDeclaration | ts.FunctionDeclaration | ts.InterfaceDeclaration | ts.TypeAliasDeclaration; kind: OverlayDeclarationKind } | null {
    const candidateKinds: OverlayDeclarationKind[] = expectedKind ? [expectedKind] : ['class', 'function', 'interface', 'type'];

    for (const kind of candidateKinds) {
        for (const statement of statements) {
            if (kind === 'class' && ts.isClassDeclaration(statement) && statement.name?.text === declarationName) {
                return { node: statement, kind };
            }

            if (kind === 'function' && ts.isFunctionDeclaration(statement) && statement.name?.text === declarationName) {
                return { node: statement, kind };
            }

            if (kind === 'interface' && ts.isInterfaceDeclaration(statement) && statement.name?.text === declarationName) {
                return { node: statement, kind };
            }

            if (kind === 'type' && ts.isTypeAliasDeclaration(statement) && statement.name?.text === declarationName) {
                return { node: statement, kind };
            }
        }
    }

    return null;
}

function getNodeRange(node: ts.Node): { start: number; end: number } {
    return { start: node.getFullStart(), end: node.end };
}

// ---------------------------------------------------------------------------
// Declaration index - single AST walk that records every class / function /
// namespace by its fully-qualified canonical name. Subsequent symbol lookups
// run in O(1) without re-walking the AST per symbol.
// ---------------------------------------------------------------------------

interface DeclarationIndexEntry {
    classNode?: ts.ClassDeclaration;
    functionNode?: ts.FunctionDeclaration;
    interfaceNode?: ts.InterfaceDeclaration;
    typeNode?: ts.TypeAliasDeclaration;
    namespaceNode?: ts.ModuleDeclaration;
    /** End offset of the last member statement inside this namespace (max across merged declarations). */
    lastMemberEnd?: number;
}

interface DeclarationIndex {
    byPath: Map<string, DeclarationIndexEntry>;
}

function buildDeclarationIndex(sourceFile: ts.SourceFile): DeclarationIndex {
    const byPath = new Map<string, DeclarationIndexEntry>();

    const getOrCreate = (path: string): DeclarationIndexEntry => {
        let entry = byPath.get(path);

        if (!entry) {
            entry = {};
            byPath.set(path, entry);
        }

        return entry;
    };

    const visit = (statements: ReadonlyArray<ts.Statement>, prefix: string): void => {
        let maxEnd = -1;

        for (const statement of statements) {
            if (statement.end > maxEnd) {
                maxEnd = statement.end;
            }

            if (ts.isClassDeclaration(statement) && statement.name) {
                const path = prefix ? `${prefix}.${statement.name.text}` : statement.name.text;
                const entry = getOrCreate(path);

                if (!entry.classNode) { entry.classNode = statement; }
            }
            else if (ts.isFunctionDeclaration(statement) && statement.name) {
                const path = prefix ? `${prefix}.${statement.name.text}` : statement.name.text;
                const entry = getOrCreate(path);

                if (!entry.functionNode) { entry.functionNode = statement; }
            }
            else if (ts.isInterfaceDeclaration(statement) && statement.name) {
                const path = prefix ? `${prefix}.${statement.name.text}` : statement.name.text;
                const entry = getOrCreate(path);

                if (!entry.interfaceNode) { entry.interfaceNode = statement; }
            }
            else if (ts.isTypeAliasDeclaration(statement) && statement.name) {
                const path = prefix ? `${prefix}.${statement.name.text}` : statement.name.text;
                const entry = getOrCreate(path);

                if (!entry.typeNode) { entry.typeNode = statement; }
            }
            else if (ts.isModuleDeclaration(statement)) {
                const name = getModuleDeclarationNameText(statement.name);

                if (!name) { continue; }

                const path = prefix ? `${prefix}.${name}` : name;
                const entry = getOrCreate(path);

                if (!entry.namespaceNode) { entry.namespaceNode = statement; }

                let body: ts.ModuleBody | undefined = statement.body;

                while (body && ts.isModuleDeclaration(body)) {
                    body = body.body;
                }

                if (body && ts.isModuleBlock(body)) {
                    visit(body.statements, path);
                }
            }
        }

        if (prefix && maxEnd >= 0) {
            const parentEntry = getOrCreate(prefix);

            if (parentEntry.lastMemberEnd === undefined || maxEnd > parentEntry.lastMemberEnd) {
                parentEntry.lastMemberEnd = maxEnd;
            }
        }
    };

    visit(sourceFile.statements, '');

    return { byPath };
}

function getDeclarationRangeFromIndex(
    index: DeclarationIndex,
    canonicalSymbol: string,
    expectedKind?: OverlayDeclarationKind
): { start: number; end: number; kind: OverlayDeclarationKind } {
    const dotIndex = canonicalSymbol.indexOf('.');

    if (dotIndex < 0 || !canonicalSymbol.startsWith('Phaser.')) {
        throw new Error(`Unsupported canonical symbol '${canonicalSymbol}'. Expected to start with 'Phaser.'.`);
    }

    const entry = index.byPath.get(canonicalSymbol);
    const candidateKinds: OverlayDeclarationKind[] = expectedKind ? [expectedKind] : ['class', 'function', 'interface', 'type'];

    if (entry) {
        for (const kind of candidateKinds) {
            const node = kind === 'class' ? entry.classNode : kind === 'function' ? entry.functionNode : kind === 'interface' ? entry.interfaceNode : entry.typeNode;

            if (node) {
                return { ...getNodeRange(node), kind };
            }
        }
    }

    // Distinguish "namespace missing" from "declaration missing" to preserve
    // the original error messages used by callers and tests.
    const parentPath = canonicalSymbol.substring(0, canonicalSymbol.lastIndexOf('.'));
    const parentEntry = index.byPath.get(parentPath);

    if (!parentEntry || parentEntry.lastMemberEnd === undefined) {
        throw new Error(`Unable to find namespace '${parentPath}' in generated declaration output.`);
    }

    const prefix = expectedKind ? `${expectedKind} ` : '';

    throw new Error(`Unable to find ${prefix}declaration for migrated symbol '${canonicalSymbol}'.`);
}

function getClassInsertionPointFromIndex(index: DeclarationIndex, canonicalSymbol: string): number {
    // Insertion point: if a namespace already exists at the canonical symbol's
    // path, insert immediately before it (so the class can be merged with the
    // namespace declaration). Otherwise append after the parent's last member.
    const entry = index.byPath.get(canonicalSymbol);

    if (entry?.namespaceNode) {
        return entry.namespaceNode.getFullStart();
    }

    const parentPath = canonicalSymbol.substring(0, canonicalSymbol.lastIndexOf('.'));
    const parentEntry = parentPath ? index.byPath.get(parentPath) : undefined;

    if (parentEntry?.lastMemberEnd !== undefined) {
        return parentEntry.lastMemberEnd;
    }

    throw new Error(`Unable to resolve insertion point for '${canonicalSymbol}'.`);
}

function getTopLevelDeclarationRange(source: string, declarationName: string, expectedKind?: OverlayDeclarationKind): { start: number; end: number; kind: OverlayDeclarationKind } {
    const sourceFile = ts.createSourceFile('migrated-fragment.d.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const result = findDeclarationNode(sourceFile.statements, declarationName, expectedKind);

    if (!result) {
        const prefix = expectedKind ? `${expectedKind} ` : '';

        throw new Error(`Unable to find top-level ${prefix}declaration '${declarationName}' in emitted fragment.`);
    }

    return { ...getNodeRange(result.node), kind: result.kind };
}

function removePrivateClassMembers(source: string, className: string): string {
    const sourceFile = ts.createSourceFile('migrated-fragment.d.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const removals: Array<{ start: number; end: number }> = [];

    for (const statement of sourceFile.statements) {
        if (!ts.isClassDeclaration(statement) || statement.name?.text !== className) {
            continue;
        }

        for (const member of statement.members) {
            const jsDoc = ts.getJSDocTags(member);

            if (jsDoc.some((tag) => tag.tagName.text === 'private')) {
                removals.push({ start: member.getFullStart(), end: member.getEnd() });
            }
        }
    }

    let output = source;

    for (const removal of removals.sort((a, b) => b.start - a.start)) {
        output = output.slice(0, removal.start) + output.slice(removal.end);
    }

    return output;
}

// ---------------------------------------------------------------------------
// Exported AST helpers for external validation scripts
// ---------------------------------------------------------------------------

export function parseSourceFile(filePath: string): ts.SourceFile {
    const sourceText = fs.readFileSync(filePath, 'utf8');

    return ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function hasExportModifier(node: ts.Node): boolean {
    if (!ts.canHaveModifiers(node)) {
        return false;
    }

    const modifiers = ts.getModifiers(node);

    return modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function addToKindMap(map: Map<string, Set<string>>, name: string, kind: string): void {
    let kinds = map.get(name);

    if (!kinds) {
        kinds = new Set();
        map.set(name, kinds);
    }

    kinds.add(kind);
}

/**
 * Return the declaration kind and the set of names introduced by a statement,
 * or null if the statement does not introduce any named declarations.
 */
function getDeclarationNames(statement: ts.Statement): { kind: DeclarationKind; names: string[] } | null {
    const kind = getDeclarationKindForStatement(statement);

    if (!kind) {
        return null;
    }

    if (ts.isVariableStatement(statement)) {
        const names: string[] = [];

        for (const declaration of statement.declarationList.declarations) {
            if (ts.isIdentifier(declaration.name)) {
                names.push(declaration.name.text);
            }
        }

        return names.length > 0 ? { kind, names } : null;
    }

    const name = getStatementName(statement);

    return name ? { kind, names: [name] } : null;
}

/**
 * Parse a TypeScript source file and collect all exported declaration kinds by name.
 * Returns a map from declaration name to the set of declaration kinds (class, function, etc.).
 */
export function collectExportedDeclarationKinds(filePath: string): Map<string, Set<string>> {
    const sourceFile = parseSourceFile(filePath);
    const localKinds = new Map<string, Set<string>>();
    const exportedKinds = new Map<string, Set<string>>();

    // Single pass: collect local declaration kinds, and exported ones when the statement has `export`.
    for (const statement of sourceFile.statements) {
        const info = getDeclarationNames(statement);

        if (!info) {
            continue;
        }

        const isExported = hasExportModifier(statement);

        for (const name of info.names) {
            addToKindMap(localKinds, name, info.kind);

            if (isExported) {
                addToKindMap(exportedKinds, name, info.kind);
            }
        }
    }

    // Handle `export { Foo, Bar as Baz }` declarations (must run after localKinds is fully built).
    for (const statement of sourceFile.statements) {
        if (!ts.isExportDeclaration(statement) || statement.moduleSpecifier) {
            continue;
        }

        if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
            continue;
        }

        for (const element of statement.exportClause.elements) {
            const exportedName = element.name.text;
            const localName = element.propertyName ? element.propertyName.text : exportedName;
            const kinds = localKinds.get(localName);

            if (kinds) {
                for (const kind of kinds) {
                    addToKindMap(exportedKinds, exportedName, kind);
                }
            }
        }
    }

    return exportedKinds;
}

/**
 * Check whether a canonical symbol (e.g. "Phaser.Math.Vector2") exists in the
 * given parsed declaration file with one of the expected declaration kinds.
 * Returns null on success, or a reason object on failure.
 */
export function validateSymbolInDeclarations(
    declarationsFile: ts.SourceFile,
    canonicalSymbol: string,
    expectedKinds: string[]
): { symbol: string; reason: string } | null {
    const parts = canonicalSymbol.split('.');

    if (parts.length < 2) {
        return { symbol: canonicalSymbol, reason: 'invalid canonical symbol path' };
    }

    const namespaceParts = parts.slice(0, -1);
    const symbolName = parts[parts.length - 1];
    const members = collectNamespaceMembers(declarationsFile, namespaceParts);

    if (members.length === 0) {
        return { symbol: canonicalSymbol, reason: 'namespace path not found' };
    }

    const expectedKindSet = new Set(expectedKinds);

    for (const statement of members) {
        const kind = getDeclarationKindForStatement(statement);

        if (!kind || !expectedKindSet.has(kind)) {
            continue;
        }

        if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
                if (ts.isIdentifier(declaration.name) && declaration.name.text === symbolName) {
                    return null;
                }
            }

            continue;
        }

        const name = getStatementName(statement);

        if (name === symbolName) {
            return null;
        }
    }

    return { symbol: canonicalSymbol, reason: `declaration anchor not found for expected kind(s) "${expectedKinds.join(', ')}"` };
}

// ---------------------------------------------------------------------------
// Kind inference
// ---------------------------------------------------------------------------

function inferKindFromMigratedSource(modulePath: string): MigratedSourceKind {
    const { sourceKindByRelPath } = walkSrcDirectory();

    if (sourceKindByRelPath.has(modulePath)) {
        return sourceKindByRelPath.get(modulePath)!;
    }

    // Fallback: read file if not in cache (shouldn't happen after discoverMigratedModules)
    const sourcePath = path.resolve(REPO_ROOT, modulePath);

    if (!fs.existsSync(sourcePath)) {
        sourceKindByRelPath.set(modulePath, null);

        return null;
    }

    const source = fs.readFileSync(sourcePath, 'utf8');
    const kind = inferSourceKind(source);

    sourceKindByRelPath.set(modulePath, kind);

    return kind;
}

function inferSyntheticKind(modulePath: string, symbol: string, docs: TsgenDoclet[]): 'class' | 'function' | 'typedef' {
    const inferredFromSource = inferKindFromMigratedSource(modulePath);

    if (inferredFromSource === 'type') {
        return 'typedef';
    }

    if (inferredFromSource) {
        return inferredFromSource;
    }

    const instancePrefix = `${symbol}#`;

    for (const doclet of docs) {
        const longname = doclet.longname;

        if (typeof longname !== 'string') {
            continue;
        }

        if (longname === symbol) {
            if (doclet.kind === 'class') { return 'class'; }
            if (doclet.kind === 'function') { return 'function'; }
        }

        if ((doclet.memberof === symbol && doclet.scope === 'instance') || longname.startsWith(instancePrefix)) {
            return 'class';
        }
    }

    return 'function';
}

// ---------------------------------------------------------------------------
// Synthetic doclet generation
// ---------------------------------------------------------------------------

function createSyntheticDoclet(kind: string, longname: string, lineno: number): TsgenDoclet {
    const dotIndex = longname.lastIndexOf('.');
    const hashIndex = longname.lastIndexOf('#');
    const splitIndex = Math.max(dotIndex, hashIndex);
    const memberof = (splitIndex !== -1) ? longname.substring(0, splitIndex) : undefined;
    const name = (splitIndex !== -1) ? longname.substring(splitIndex + 1) : longname;
    const scope = (hashIndex > dotIndex) ? 'instance' : 'static';

    const doclet: TsgenDoclet = {
        [SYNTHETIC_DOCLET_FLAG]: true,
        kind,
        name,
        longname,
        scope,
        meta: {
            filename: `${SYNTHETIC_META_MARKER}/auto-discovered`,
            lineno,
            columnno: 0,
            path: SYNTHETIC_META_MARKER
        }
    };

    if (kind === 'function' || kind === 'class') {
        doclet.params = [
            {
                name: 'args',
                variable: true,
                type: { names: ['*'] }
            }
        ];
    }

    if (kind === 'function') {
        doclet.returns = [
            {
                type: { names: ['*'] }
            }
        ];
    }

    if (kind === 'typedef') {
        doclet.type = { names: ['function'] };
        doclet.params = [
            {
                name: 'args',
                variable: true,
                type: { names: ['*'] }
            }
        ];
        doclet.returns = [
            {
                type: { names: ['*'] }
            }
        ];
    }

    if (memberof) {
        doclet.memberof = memberof;
    }

    return doclet;
}

export function buildSyntheticDoclets(manifest: MigratedModulesManifest, docs: TsgenDoclet[]): TsgenDoclet[] {
    const existingLongnames = new Set<string>();
    const syntheticKinds = new Map<string, 'class' | 'function' | 'namespace' | 'member' | 'typedef'>();
    const syntheticOrder: string[] = [];

    for (const doclet of docs) {
        if (typeof doclet.longname === 'string') {
            existingLongnames.add(doclet.longname);
        }
    }

    for (const [modulePath, canonicalSymbols] of Object.entries(manifest)) {
        if (!Array.isArray(canonicalSymbols)) {
            continue;
        }

        for (const symbol of canonicalSymbols) {
            if (!existingLongnames.has(symbol) && !syntheticKinds.has(symbol)) {
                syntheticKinds.set(symbol, inferSyntheticKind(modulePath, symbol, docs));
                syntheticOrder.push(symbol);
            }

            const parts = symbol.split('.');

            for (let i = 1; i < parts.length; i++) {
                const parentLongname = parts.slice(0, i).join('.');

                if (existingLongnames.has(parentLongname) || syntheticKinds.has(parentLongname)) {
                    continue;
                }

                syntheticKinds.set(parentLongname, 'namespace');
                syntheticOrder.push(parentLongname);
            }
        }
    }

    syntheticOrder.sort((a, b) => {
        const byDepth = a.split('.').length - b.split('.').length;

        if (byDepth !== 0) {
            return byDepth;
        }

        return a.localeCompare(b);
    });

    return syntheticOrder.map((longname, index) => {
        const kind = syntheticKinds.get(longname)!;
        return createSyntheticDoclet(kind, longname, index + 1);
    });
}

// ---------------------------------------------------------------------------
// Declaration emission & overlay
// ---------------------------------------------------------------------------

function detectAuthorityKind(modulePath: string, canonicalSymbol: string, declarationFragment: string): OverlayDeclarationKind {
    const declarationName = canonicalSymbol.split('.').pop() || canonicalSymbol;
    const classPattern = new RegExp(`\\bclass\\s+${declarationName}\\b`);

    if (classPattern.test(declarationFragment)) {
        return 'class';
    }

    const functionPattern = new RegExp(`\\bfunction\\s+${declarationName}\\s*\\(`);

    if (functionPattern.test(declarationFragment)) {
        return 'function';
    }

    // Check for an interface declaration with the canonical name.
    // This handles mixin modules where the exported mixin interface has been
    // renamed (via MODULE_TYPE_RULES) from e.g. DepthMixin to Depth before
    // this function is called.
    const interfacePattern = new RegExp(`\\binterface\\s+${declarationName}\\b`);

    if (interfacePattern.test(declarationFragment)) {
        return 'interface';
    }

    const typePattern = new RegExp(`\\btype\\s+${declarationName}\\b`);

    if (typePattern.test(declarationFragment)) {
        return 'type';
    }

    // Fallback: const/variable/type/enum exports are not recognised here and
    // will default to 'function'; those cases are handled upstream.
    return inferKindFromMigratedSource(modulePath) || 'function';
}

function buildCanonicalSymbolModuleLookup(manifest: MigratedModulesManifest): Map<string, string> {
    const symbolToModulePath = new Map<string, string>();

    for (const [modulePath, canonicalSymbols] of Object.entries(manifest)) {
        for (const canonicalSymbol of canonicalSymbols) {
            symbolToModulePath.set(canonicalSymbol, modulePath);
        }
    }

    return symbolToModulePath;
}

function toIndentedBlock(block: string, indent: string): string {
    const normalized = block.replace(/\s+$/, '');
    const lines = normalized.split(/\r?\n/);

    return `${lines.map((line) => (line.length > 0 ? `${indent}${line}` : '')).join('\n')}\n`;
}

function normalizeAuthorityFragment(modulePath: string, declarationText: string): string {
    let fragment = declarationText;

    fragment = fragment.replace(/^import[^\n]*\n/gm, '');
    fragment = fragment.replace(/^export\s+default[^\n]*\n/gm, '');
    fragment = fragment.replace(/\bexport\s+declare\s+/g, '');
    fragment = fragment.replace(/\bexport\s+/g, '');

    return fragment.trim();
}

function qualifyType(fragment: string, shortName: string, qualifiedName: string): string {
    const prefix = qualifiedName.slice(0, qualifiedName.length - shortName.length);
    const pattern = new RegExp(`\\b${shortName}\\b`, 'g');

    // Pre-compute JSDoc comment regions so we can skip prose matches.
    // Only matches inside /** ... */ blocks are skipped; type positions
    // (extends clauses, parameter types, return types) are outside comments.
    const commentRegions: Array<{ start: number; end: number }> = [];
    const commentPattern = /\/\*\*[\s\S]*?\*\//g;
    let cm: RegExpExecArray | null;

    while ((cm = commentPattern.exec(fragment)) !== null) {
        commentRegions.push({ start: cm.index, end: cm.index + cm[0].length });
    }

    return fragment.replace(pattern, (match, offset, source) => {
        if (offset >= prefix.length && source.startsWith(prefix, offset - prefix.length)) {
            return match;
        }

        // Don't qualify type names inside JSDoc prose comments.
        for (const region of commentRegions) {
            if (offset >= region.start && offset < region.end) {
                return match;
            }
        }

        return qualifiedName;
    });
}

type QualificationRule =
    | { type: 'qualify'; shortName: string; qualifiedName: string }
    | { type: 'replace'; pattern: RegExp; replacement: string };

const MODULE_TYPE_RULES: Record<string, QualificationRule[]> = {
    'src/geom/rectangle/Rectangle.ts': [
        { type: 'replace', pattern: /typeof\s+Line\.prototype/g, replacement: 'Phaser.Geom.Line' },
        { type: 'qualify', shortName: 'Vector2', qualifiedName: 'Phaser.Math.Vector2' },
    ],
    'src/gameobjects/nineslice/NineSliceVertex.ts': [
        { type: 'qualify', shortName: 'Vector2', qualifiedName: 'Phaser.Math.Vector2' },
    ],
    'src/geom/rectangle/Contains.ts': [
        { type: 'qualify', shortName: 'Rectangle', qualifiedName: 'Phaser.Geom.Rectangle' },
    ],
    'src/math/Vector2.ts': [
        { type: 'qualify', shortName: 'Vector2Like', qualifiedName: 'Phaser.Types.Math.Vector2Like' },
    ],
    'src/structs/Map.ts': [
        { type: 'replace', pattern: /map: Map<K, V>/g, replacement: 'map: Phaser.Structs.Map<K, V>' },
        { type: 'replace', pattern: /\bEachMapCallback\s*<\s*K\s*,\s*V\s*>/g, replacement: '(key: K, entry: V) => boolean | void' },
    ],
    'src/gameobjects/components/Depth.ts': [
        { type: 'replace', pattern: /\bDepthMixin\b/g, replacement: 'Depth' },
    ],
    'src/gameobjects/components/Visible.ts': [
        { type: 'replace', pattern: /\bVisibleMixin\b/g, replacement: 'Visible' },
    ],
    'src/gameobjects/zone/Zone.ts': [
        { type: 'qualify', shortName: 'HitAreaCallback', qualifiedName: 'Phaser.Types.Input.HitAreaCallback' },
    ],
    'src/input/typedefs/HitAreaCallback.ts': [
        { type: 'replace', pattern: /gameObject:\s*GameObject\b/g, replacement: 'gameObject: Phaser.GameObjects.GameObject' },
    ],
};

function normalizeCanonicalDeclaration(modulePath: string, declarationText: string): string {
    let fragment = declarationText;
    const rules = MODULE_TYPE_RULES[modulePath];

    if (rules) {
        for (const rule of rules) {
            if (rule.type === 'qualify') {
                fragment = qualifyType(fragment, rule.shortName, rule.qualifiedName);
            }
            else {
                fragment = fragment.replace(rule.pattern, rule.replacement);
            }
        }
    }

    fragment = fragment.replace(/extends\s+\w*Base\b/g, 'extends Phaser.GameObjects.GameObject');
    fragment = fragment.replace(/\bTODO_MIGRATE_Scene\b/g, 'Phaser.Scene');
    fragment = fragment.replace(/\bTODO_MIGRATE_GameObjectInstance\b/g, 'Phaser.GameObjects.GameObject');
    fragment = fragment.replace(/\bTODO_MIGRATE_GameObjectCtor\b/g, 'Phaser.GameObjects.GameObject');

    return fragment.trim();
}

function getSourceText(modulePath: string): string {
    return fs.readFileSync(path.resolve(REPO_ROOT, modulePath), 'utf8');
}

function extractClassComponentExtends(source: string, className: string): string[] {
    const jsdocBlockRegex = /\/\*\*[\s\S]*?\*\//g;
    const classAfterRegex = /export\s+(?:default\s+)?class\s+(\w+)/y;
    const extendsTags: string[] = [];
    let blockMatch: RegExpExecArray | null;

    while ((blockMatch = jsdocBlockRegex.exec(source)) !== null) {
        classAfterRegex.lastIndex = skipWhitespaceAndLineCommentsAfterJSDoc(source, blockMatch.index + blockMatch[0].length);
        const classMatch = classAfterRegex.exec(source);

        if (!classMatch || classMatch[1] !== className) {
            continue;
        }

        const tagRegex = /@extends\s+(Phaser\.GameObjects\.Components\.\w+)/g;
        let tagMatch: RegExpExecArray | null;

        while ((tagMatch = tagRegex.exec(blockMatch[0])) !== null) {
            extendsTags.push(tagMatch[1]);
        }

        break;
    }

    return Array.from(new Set(extendsTags));
}

function buildClassMergeInterface(modulePath: string, className: string): string | null {
    const components = extractClassComponentExtends(getSourceText(modulePath), className);

    if (components.length === 0) {
        return null;
    }

    return `interface ${className} extends ${components.join(', ')} {\n}`;
}

function deriveCanonicalDeclarationMap(
    moduleDeclarationMap: Map<string, string>,
    symbolToModulePath: Map<string, string>
): Map<string, string> {
    const canonicalDeclarationMap = new Map<string, string>();
    const canonicalSymbols = Array.from(symbolToModulePath.keys()).sort((a, b) => a.localeCompare(b));

    for (const canonicalSymbol of canonicalSymbols) {
        const modulePath = symbolToModulePath.get(canonicalSymbol)!;
        const moduleDeclaration = moduleDeclarationMap.get(modulePath);

        if (!moduleDeclaration) {
            throw new Error(`No declaration fragment available for migrated module '${modulePath}'.`);
        }

        const declarationName = canonicalSymbol.split('.').pop()!;

        // Apply module-type rules (e.g. interface renames) to the full declaration
        // fragment *before* authority-kind detection and declaration extraction.
        // This ensures that detectAuthorityKind and getTopLevelDeclarationRange see
        // the final canonical names (e.g. `interface Depth` after renaming `DepthMixin`).
        const normalizedModuleDeclaration = normalizeCanonicalDeclaration(modulePath, moduleDeclaration);

        const expectedKind = detectAuthorityKind(modulePath, canonicalSymbol, normalizedModuleDeclaration);
        const range = getTopLevelDeclarationRange(normalizedModuleDeclaration, declarationName, expectedKind);
        let declaration = normalizedModuleDeclaration.substring(range.start, range.end).trim();

        if (expectedKind === 'class') {
            declaration = removePrivateClassMembers(declaration, declarationName);

            const mergeInterface = buildClassMergeInterface(modulePath, declarationName);

            if (mergeInterface) {
                declaration += `\n\n${mergeInterface}`;
            }
        }

        // Normalization was applied to the full module text, not just this range.
        canonicalDeclarationMap.set(canonicalSymbol, declaration);
    }

    return canonicalDeclarationMap;
}

function emitMigratedModuleDeclarations(manifest: MigratedModulesManifest): Map<string, string> {
    const modulePaths = Object.keys(manifest).sort((a, b) => a.localeCompare(b));
    const entryFiles = modulePaths.map((modulePath) => path.resolve(REPO_ROOT, modulePath));
    const emittedDeclarations = new Map<string, string>();
    const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2018,
        module: ts.ModuleKind.Node16,
        moduleResolution: ts.ModuleResolutionKind.Node16,
        declaration: true,
        emitDeclarationOnly: true,
        allowJs: true,
        skipLibCheck: true,
        strict: false
    };
    const host = ts.createCompilerHost(compilerOptions);

    const program = ts.createProgram(entryFiles, compilerOptions, {
        ...host,
        writeFile: (fileName: string, content: string) => {
            if (fileName.endsWith('.d.ts')) {
                emittedDeclarations.set(path.normalize(fileName), content);
            }
        }
    });

    const emitResult = program.emit();
    const diagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics)
        .filter((diagnostic) => diagnostic.code !== 2578);

    if (diagnostics.length > 0) {
        const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCurrentDirectory: () => REPO_ROOT,
            getCanonicalFileName: (fileName) => fileName,
            getNewLine: () => '\n'
        });

        throw new Error(`Failed to emit authoritative migrated declarations:\n${formattedDiagnostics}`);
    }

    const moduleDeclarationMap = new Map<string, string>();

    for (const modulePath of modulePaths) {
        const absoluteSource = path.resolve(REPO_ROOT, modulePath);
        const emittedPath = path.normalize(absoluteSource.replace(/\.[jt]s$/, '.d.ts'));
        const declarationText = emittedDeclarations.get(emittedPath);

        if (!declarationText) {
            throw new Error(`Missing emitted declaration for migrated module '${modulePath}'.`);
        }

        moduleDeclarationMap.set(modulePath, normalizeAuthorityFragment(modulePath, declarationText));
    }

    return moduleDeclarationMap;
}

// ---------------------------------------------------------------------------
// Public overlay API
// ---------------------------------------------------------------------------

export function applyMigratedAuthorityOverlay(out: string, manifest: MigratedModulesManifest): string {
    const moduleDeclarationMap = emitMigratedModuleDeclarations(manifest);
    const symbolToModulePath = buildCanonicalSymbolModuleLookup(manifest);
    const canonicalDeclarationMap = deriveCanonicalDeclarationMap(moduleDeclarationMap, symbolToModulePath);

    // Parse the declaration output once and build a name-keyed index so each
    // canonical symbol lookup below is O(1) instead of an AST traversal.
    const sourceFile = ts.createSourceFile('phaser.d.ts', out, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const index = buildDeclarationIndex(sourceFile);

    type ReplacementOp = {
        start: number;
        end: number;
        fragment: string;
    };

    const ops: ReplacementOp[] = [];

    for (const [canonicalSymbol, declarationFragment] of canonicalDeclarationMap) {
        const modulePath = symbolToModulePath.get(canonicalSymbol)!;
        const expectedKind = detectAuthorityKind(modulePath, canonicalSymbol, declarationFragment);
        let replaceStart: number;
        let replaceEnd: number;

        try {
            const range = getDeclarationRangeFromIndex(index, canonicalSymbol, expectedKind);

            replaceStart = range.start;
            replaceEnd = range.end;
        }
        catch (error) {
            // Only class/interface may be freshly inserted; functions must replace existing.
            if (expectedKind !== 'class' && expectedKind !== 'interface') {
                throw error;
            }

            // No existing class/interface declaration: insert a fresh one inside the namespace.
            replaceStart = getClassInsertionPointFromIndex(index, canonicalSymbol);
            replaceEnd = replaceStart;
        }

        ops.push({ start: replaceStart, end: replaceEnd, fragment: declarationFragment });
    }

    // Sort ascending by start offset for segment-based assembly
    ops.sort((a, b) => a.start - b.start);

    const segments: string[] = [];
    let cursor = 0;

    for (const op of ops) {
        // Preserve text between previous op and this one
        segments.push(out.substring(cursor, op.start));

        // Compute indentation from original text
        const lineStart = out.lastIndexOf('\n', op.start - 1) + 1;
        const linePrefix = out.substring(lineStart, op.start);
        const indentMatch = linePrefix.match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';
        let replacement = toIndentedBlock(op.fragment, indent);

        if (op.start > 0 && out[op.start - 1] !== '\n') {
            replacement = `\n${replacement}`;
        }

        // Ensure a trailing newline if the original text after the op doesn't start with one
        const charAfterEnd = op.end < out.length ? out[op.end] : '\n';
        const needsTrailingGap = charAfterEnd !== '\r' && charAfterEnd !== '\n';

        segments.push(replacement);

        if (needsTrailingGap) {
            segments.push('\n');
        }

        cursor = op.end;
    }

    segments.push(out.substring(cursor));

    // Normalize blank lines: toIndentedBlock uses LF and appends '\n',
    // while the original d.ts uses CRLF. This can create runs of 3+
    // consecutive line breaks at replacement boundaries (both between
    // adjacent replacements and between a replacement and original text).
    // Collapse any such run to exactly 2 line breaks (one blank line).
    return segments.join('').replace(/(\r?\n){3,}/g, (match) => {
        // Detect line-ending style from the first captured sequence
        const eol = match.includes('\r\n') ? '\r\n' : '\n';

        return `${eol}${eol}`;
    });
}

export function validateNoSyntheticLeak(out: string, canonicalSymbols: string[]): void {
    const leakedMarkers = [SYNTHETIC_META_MARKER, SYNTHETIC_DOCLET_FLAG];

    for (const marker of leakedMarkers) {
        if (out.includes(marker)) {
            throw new Error(`Synthetic marker metadata leaked into emitted declarations: '${marker}'.`);
        }
    }

    // Parse once and index by canonical name for O(1) symbol range lookups.
    const sourceFile = ts.createSourceFile('phaser.d.ts', out, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const index = buildDeclarationIndex(sourceFile);

    const fallbackPatterns = [/\.\.\.args:\s*any\[\]/, /@returns\s+undefined/, /constructor\(\.\.\.args:\s*any\[\]\)/];

    for (const canonicalSymbol of canonicalSymbols) {
        const range = getDeclarationRangeFromIndex(index, canonicalSymbol);
        const declarationText = out.substring(range.start, range.end);

        for (const pattern of fallbackPatterns) {
            if (pattern.test(declarationText)) {
                throw new Error(`Synthetic fallback signature leaked for migrated symbol '${canonicalSymbol}' (${pattern}).`);
            }
        }
    }
}

export function normalizeDeclarationOutput(out: string): string {
    return out.replace(/\r\n?/g, '\n');
}
