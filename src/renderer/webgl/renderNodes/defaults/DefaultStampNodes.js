/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../../structs/Map');

var DefaultStampNodes = new Map([
    [ 'Submitter', 'SubmitterQuad' ],
    [ 'BatchHandler', 'BatchHandlerQuad' ],
    [ 'Transformer', 'TransformerStamp' ],
    [ 'Texturer', 'TexturerImage' ]
]);

module.exports = DefaultStampNodes;
