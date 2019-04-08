/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');
var CalculateFacesWithin = require('./CalculateFacesWithin');
var SetTileCollision = require('./SetTileCollision');

/**
 * Sets the tiles in the given rectangular area (in tile coordinates) of the layer with the
 * specified index. Tiles will be set to collide if the given index is a colliding index.
 * Collision information in the region will be recalculated.
 *
 * @function Phaser.Tilemaps.Components.Fill
 * @private
 * @since 3.0.0
 *
 * @param {integer} index - The tile index to fill the area with.
 * @param {integer} tileX - The left most tile index (in tile coordinates) to use as the origin of the area.
 * @param {integer} tileY - The top most tile index (in tile coordinates) to use as the origin of the area.
 * @param {integer} width - How many tiles wide from the `tileX` index the area will be.
 * @param {integer} height - How many tiles tall from the `tileY` index the area will be.
 * @param {boolean} recalculateFaces - `true` if the faces data should be recalculated.
 * @param {Phaser.Tilemaps.LayerData} layer - The tile layer to use. If not given the current layer is used.
 */
var Fill = function (index, tileX, tileY, width, height, recalculateFaces, layer)
{
    var doesIndexCollide = (layer.collideIndexes.indexOf(index) !== -1);

    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].index = index;

        SetTileCollision(tiles[i], doesIndexCollide);
    }

    if (recalculateFaces)
    {
        // Recalculate the faces within the area and neighboring tiles
        CalculateFacesWithin(tileX - 1, tileY - 1, width + 2, height + 2, layer);
    }
};

module.exports = Fill;
