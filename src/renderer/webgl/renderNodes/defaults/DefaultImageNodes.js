/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../../structs/Map');

var DefaultImageNodes = new Map([
    [ 'Submitter', 'SubmitterQuad' ],
    [ 'BatchHandler', 'BatchHandlerQuad' ],
    [ 'Transformer', 'TransformerImage' ],
    [ 'Texturer', 'TexturerImage' ]
]);

module.exports = DefaultImageNodes;
