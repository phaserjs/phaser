/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
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
 * @since 3.0.0
 *
 * @param {integer} index - [description]
 * @param {integer} [tileX=0] - [description]
 * @param {integer} [tileY=0] - [description]
 * @param {integer} [width=max width based on tileX] - [description]
 * @param {integer} [height=max height based on tileY] - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var Fill = function (index, tileX, tileY, width, height, recalculateFaces, layer)
{
    if (recalculateFaces === undefined) { recalculateFaces = true; }

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
