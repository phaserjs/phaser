/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTileAt = require('./GetTileAt');
var GetTilesWithin = require('./GetTilesWithin');

/**
 * Calculates the interesting faces for all collidable tiles within the rectangular area specified
 * (in tile coordinates) of the layer. An "interesting face" is an exposed edge of a collidable tile
 * — specifically, any face that is not shared with another collidable tile adjacent to it. For
 * example, if two collidable tiles sit side by side, the shared edge between them is not an
 * interesting face because a physics body moving between them would never collide with it. Only
 * interesting faces are tested during collision resolution, which avoids the internal-edge problem
 * and keeps collision checks efficient. This function is called automatically when tiles are placed
 * or removed, and is mostly used internally by the tilemap system.
 *
 * @function Phaser.Tilemaps.Components.CalculateFacesWithin
 * @since 3.0.0
 *
 * @param {number} tileX - The left most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} tileY - The top most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} width - How many tiles wide from the `tileX` index the area will be.
 * @param {number} height - How many tiles tall from the `tileY` index the area will be.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var CalculateFacesWithin = function (tileX, tileY, width, height, layer)
{
    var above = null;
    var below = null;
    var left = null;
    var right = null;

    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    for (var i = 0; i < tiles.length; i++)
    {
        var tile = tiles[i];

        if (tile)
        {
            if (tile.collides)
            {
                above = GetTileAt(tile.x, tile.y - 1, true, layer);
                below = GetTileAt(tile.x, tile.y + 1, true, layer);
                left = GetTileAt(tile.x - 1, tile.y, true, layer);
                right = GetTileAt(tile.x + 1, tile.y, true, layer);

                tile.faceTop = (above && above.collides) ? false : true;
                tile.faceBottom = (below && below.collides) ? false : true;
                tile.faceLeft = (left && left.collides) ? false : true;
                tile.faceRight = (right && right.collides) ? false : true;
            }
            else
            {
                tile.resetFaces();
            }
        }
    }
};

module.exports = CalculateFacesWithin;
