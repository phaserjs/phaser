var GetTileAt = require('./GetTileAt');

/**
 * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
 * faces are used internally for optimizing collisions against tiles. This method is mostly used
 * internally to optimize recalculating faces when only one tile has been changed.
 *
 * @param {number} tileX - [description]
 * @param {number} tileY - [description]
 * @param {LayerData} layer - [description]
 */
var RecalculateFacesAt = function (tileX, tileY, layer)
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
        tile.faceBottom = true;
        tile.faceBottom = true;
        tile.faceLeft = true;
        tile.faceRight = true;
    }

    // Reset edges that are shared between tile and its neighbors
    if (above && above.collides)
    {
        if (tileCollides) { tile.faceTop = false; }
        above.faceBottom = !tileCollides;
    }

    if (below && below.collides)
    {
        if (tileCollides) { tile.faceBottom = false; }
        below.faceTop = !tileCollides;
    }

    if (left && left.collides)
    {
        if (tileCollides) { tile.faceLeft = false; }
        left.faceRight = !tileCollides;
    }

    if (right && right.collides)
    {
        if (tileCollides) { tile.faceRight = false; }
        right.faceLeft = !tileCollides;
    }

    return tile;
};

module.exports = RecalculateFacesAt;
