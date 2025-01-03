/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Tile = require('../Tile');
var IsInLayerBounds = require('./IsInLayerBounds');
var CalculateFacesAt = require('./CalculateFacesAt');

/**
 * Removes the tile at the given tile coordinates in the specified layer and updates the layer's
 * collision information.
 *
 * @function Phaser.Tilemaps.Components.RemoveTileAt
 * @since 3.0.0
 *
 * @param {number} tileX - The x coordinate.
 * @param {number} tileY - The y coordinate.
 * @param {boolean} replaceWithNull - If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1.
 * @param {boolean} recalculateFaces - `true` if the faces data should be recalculated.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was removed.
 */
var RemoveTileAt = function (tileX, tileY, replaceWithNull, recalculateFaces, layer)
{
    if (replaceWithNull === undefined) { replaceWithNull = true; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    if (!IsInLayerBounds(tileX, tileY, layer))
    {
        return null;
    }

    var tile = layer.data[tileY][tileX];

    if (!tile)
    {
        return null;
    }
    else
    {
        layer.data[tileY][tileX] = (replaceWithNull) ? null : new Tile(layer, -1, tileX, tileY, layer.tileWidth, layer.tileHeight);
    }

    //  Recalculate faces only if the removed tile was a colliding tile
    if (recalculateFaces && tile && tile.collides)
    {
        CalculateFacesAt(tileX, tileY, layer);
    }

    return tile;
};

module.exports = RemoveTileAt;
