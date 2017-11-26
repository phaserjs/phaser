var GetTileAt = require('./GetTileAt');
var GetTilesWithin = require('./GetTilesWithin');

/**
 * Calculates interesting faces within the rectangular area specified (in tile coordinates).
 * Interesting faces are used internally for optimizing collisions against tiles. This method is
 * mostly used internally.
 *
 * @param {number} [tileX=0] - [description]
 * @param {number} [tileY=0] - [description]
 * @param {number} [width=max width based on tileX] - [description]
 * @param {number} [height=max height based on tileY] - [description]
 * @param {LayerData} layer - [description]
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

        if (tile && tile.collides)
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
    }
};

module.exports = CalculateFacesWithin;
