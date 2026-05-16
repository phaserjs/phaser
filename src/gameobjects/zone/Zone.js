/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  CJS compatibility wrapper — consumed by the hybrid build pipeline and any
//  remaining JS callers during the migration period. Remove once all callers
//  are TypeScript.
module.exports = require('./Zone.ts').default;
