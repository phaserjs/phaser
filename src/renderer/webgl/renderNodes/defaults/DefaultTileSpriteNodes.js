/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Map = require('../../../../structs/Map');

/**
 * A Map defining the default render nodes used by TileSprite Game Objects in the WebGL renderer.
 *
 * Each entry maps a node role name to the string identifier of the render node class
 * responsible for that role. These nodes work together in the render pipeline to
 * process and draw a TileSprite:
 *
 * - `Submitter`: Submits the TileSprite geometry to the batch for drawing (`SubmitterTileSprite`).
 * - `BatchHandler`: Manages the WebGL batch that accumulates TileSprite draw calls (`BatchHandlerTileSprite`).
 * - `Transformer`: Computes the world transform matrix for the TileSprite (`TransformerTileSprite`).
 * - `Texturer`: Resolves and applies the scrolling texture coordinates for the TileSprite (`TexturerTileSprite`).
 *
 * This map is used when constructing the render node graph for a TileSprite, ensuring
 * each role is fulfilled by an appropriate default implementation unless overridden.
 *
 * @name Phaser.Renderer.WebGL.RenderNodes.Defaults.DefaultTileSpriteNodes
 * @type {Phaser.Structs.Map.<string, string>}
 * @since 3.90.0
 */
var DefaultTileSpriteNodes = new Map([
    [ 'Submitter', 'SubmitterTileSprite' ],
    [ 'BatchHandler', 'BatchHandlerTileSprite' ],
    [ 'Transformer', 'TransformerTileSprite' ],
    [ 'Texturer', 'TexturerTileSprite' ]
]);

module.exports = DefaultTileSpriteNodes;
