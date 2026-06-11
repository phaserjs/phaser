/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  CJS compatibility wrapper — consumed by Class() factory Mixins arrays during the
//  hybrid JS/TS migration period. Remove once all callers are TypeScript.
const mod = require('./Depth.ts');
module.exports = mod.DepthDescriptors;
Object.defineProperty(module.exports, 'Depth', { value: mod.Depth });
