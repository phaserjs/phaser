//  CJS compatibility wrapper - consumed by Class() factory Mixins arrays during the
//  hybrid JS/TS migration period. Remove once all callers are TypeScript.
const mod = require('./Mixin.ts');
module.exports = mod;
module.exports.applyMixin = mod.applyMixin;
module.exports.defineMixin = mod.defineMixin;
module.exports.composeMixins = mod.composeMixins;
