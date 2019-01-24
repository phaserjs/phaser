/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Tile = require('../Tile');
var IsInLayerBounds = require('./IsInLayerBounds');
var CalculateFacesAt = require('./CalculateFacesAt');

/**
 * Removes the tile at the given tile coordinates in the specified layer and updates the layer's
 * collision information.
 *
 * @function Phaser.Tilemaps.Components.RemoveTileAt
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileX - The x coordinate.
 * @param {integer} tileY - The y coordinate.
 * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1.
 * @param {boolean} [recalculateFaces=true] - `true` if the faces data should be recalculated.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was removed.
 */
var RemoveTileAt = function (tileX, tileY, replaceWithNull, recalculateFaces, layer)
{
    if (replaceWithNull === undefined) { replaceWithNull = false; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }
    if (!IsInLayerBounds(tileX, tileY, layer)) { return null; }

    var tile = layer.data[tileY][tileX] || null;
    if (tile === null)
    {
        return null;
    }
    else
    {
        layer.data[tileY][tileX] = replaceWithNull
            ? null
            : new Tile(layer, -1, tileX, tileY, tile.width, tile.height);
    }

    // Recalculate faces only if the removed tile was a colliding tile
    if (recalculateFaces && tile && tile.collides)
    {
        CalculateFacesAt(tileX, tileY, layer);
    }

    return tile;
};

module.exports = RemoveTileAt;
