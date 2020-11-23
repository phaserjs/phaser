/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTileAt = require('./GetTileAt');

/**
 * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
 * faces are used internally for optimizing collisions against tiles. This method is mostly used
 * internally to optimize recalculating faces when only one tile has been changed.
 *
 * @function Phaser.Tilemaps.Components.CalculateFacesAt
 * @since 3.0.0
 *
 * @param {number} tileX - The x coordinate.
 * @param {number} tileY - The y coordinate.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var CalculateFacesAt = function (tileX, tileY, layer)
{
    var tile = GetTileAt(tileX, tileY, true, layer);
    var above = GetTileAt(tileX, tileY - 1, true, layer);
    var below = GetTileAt(tileX, tileY + 1, true, layer);
    var left = GetTileAt(tileX - 1, tileY, true, layer);
    var right = GetTileAt(tileX + 1, tileY, true, layer);
    var tileCollides = tile && tile.collides;

    // Assume the changed tile has all interesting edges
    if (tileCollides)
    {
        tile.faceTop = true;
        tile.faceBottom = true;
        tile.faceLeft = true;
        tile.faceRight = true;
    }

    // Reset edges that are shared between tile and its neighbors
    if (above && above.collides)
    {
        if (tileCollides)
        {
            tile.faceTop = false;
        }

        above.faceBottom = !tileCollides;
    }

    if (below && below.collides)
    {
        if (tileCollides)
        {
            tile.faceBottom = false;
        }

        below.faceTop = !tileCollides;
    }

    if (left && left.collides)
    {
        if (tileCollides)
        {
            tile.faceLeft = false;
        }

        left.faceRight = !tileCollides;
    }

    if (right && right.collides)
    {
        if (tileCollides)
        {
            tile.faceRight = false;
        }

        right.faceLeft = !tileCollides;
    }

    if (tile && !tile.collides)
    {
        tile.resetFaces();
    }

    return tile;
};

module.exports = CalculateFacesAt;
