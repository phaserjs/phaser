"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMigratedCanonicalSymbol = isMigratedCanonicalSymbol;
exports.publish = publish;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const Parser_1 = require("./Parser");
const MigratedOverlay_1 = require("./MigratedOverlay");
let migratedCanonicalSymbolLookup = null;
function isMigratedCanonicalSymbol(symbol) {
    return migratedCanonicalSymbolLookup !== null && migratedCanonicalSymbolLookup.has(symbol);
}
function publish(data, opts) {
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
    const manifest = (0, MigratedOverlay_1.discoverMigratedModules)();
    const canonicalSymbols = (0, MigratedOverlay_1.flattenCanonicalSymbols)(manifest);
    migratedCanonicalSymbolLookup = new Set(canonicalSymbols);
    (0, MigratedOverlay_1.reportMigrationProgress)(canonicalSymbols.length);
    const syntheticDoclets = (0, MigratedOverlay_1.buildSyntheticDoclets)(manifest, docs);
    docs.push(...syntheticDoclets);
    var out = new Parser_1.Parser(docs).emit();
    out = (0, MigratedOverlay_1.applyMigratedAuthorityOverlay)(out, manifest);
    out = (0, MigratedOverlay_1.normalizeDeclarationOutput)(out);
    (0, MigratedOverlay_1.validateNoSyntheticLeak)(out, canonicalSymbols);
    fs.writeFileSync(path.join(opts.destination, 'phaser.d.ts'), out);
}
;
//# sourceMappingURL=publish.js.map