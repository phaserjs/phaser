var GetTilesWithin = require('./GetTilesWithin');
var CalculateFacesWithin = require('./CalculateFacesWithin');

/**
 * Sets the tiles in the given rectangular area (in tile coordinates) with the specified index.
 * Tiles will be set to collide if the given index is a colliding index. Interesting tile faces in
 * the region will be recalculated.
 *
 * @param {number} index - [description]
 * @param {number} tileX - [description]
 * @param {number} tileY - [description]
 * @param {number} width - [description]
 * @param {number} height - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {LayerData} layer - [description]
 */

// Fills indices, not other properties. Does not modify collisions. Matches v2 functionality.
var Fill = function (index, tileX, tileY, width, height, recalculateFaces, layer)
{
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    var doesIndexCollide = (layer.collideIndexes.indexOf(index) !== -1);

    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);
    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].index = index;

        if (doesIndexCollide)
        {
            tiles[i].setCollision(true);
        }
        else
        {
            tiles[i].resetCollision();
        }
    }

    if (recalculateFaces)
    {
        // Recalculate the faces within the area and neighboring tiles
        CalculateFacesWithin(tileX - 1, tileY - 1, width + 2, height + 2, layer);
    }
};

module.exports = Fill;
