/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../../structs/Map');

var DefaultTilemapLayerNodes = new Map([
    [ 'Submitter', 'SubmitterQuad' ],
    [ 'SubmitterLight', 'SubmitterQuadLight' ],
    [ 'Transformer', 'TransformerTile' ]
]);

module.exports = DefaultTilemapLayerNodes;
