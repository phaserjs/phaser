/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Tile = require('../Tile');
var IsInLayerBounds = require('./IsInLayerBounds');
var CalculateFacesAt = require('./CalculateFacesAt');
var SetTileCollision = require('./SetTileCollision');

/**
 * Puts a tile at the given tile coordinates in the specified layer. You can pass in either an index
 * or a Tile object. If you pass in a Tile, all attributes will be copied over to the specified
 * location. If you pass in an index, only the index at the specified location will be changed.
 * Collision information will be recalculated at the specified location.
 *
 * @function Phaser.Tilemaps.Components.PutTileAt
 * @since 3.0.0
 *
 * @param {(number|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {boolean} recalculateFaces - `true` if the faces data should be recalculated.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was created or added to this map.
 */
var PutTileAt = function (tile, tileX, tileY, recalculateFaces, layer)
{
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    if (!IsInLayerBounds(tileX, tileY, layer))
    {
        return null;
    }

    var oldTile = layer.data[tileY][tileX];
    var oldTileCollides = oldTile && oldTile.collides;

    if (tile instanceof Tile)
    {
        if (layer.data[tileY][tileX] === null)
        {
            layer.data[tileY][tileX] = new Tile(layer, tile.index, tileX, tileY, layer.tileWidth, layer.tileHeight);
        }

        layer.data[tileY][tileX].copy(tile);
    }
    else
    {
        var index = tile;

        if (layer.data[tileY][tileX] === null)
        {
            layer.data[tileY][tileX] = new Tile(layer, index, tileX, tileY, layer.tileWidth, layer.tileHeight);
        }
        else
        {
            layer.data[tileY][tileX].index = index;
        }
    }

    // Updating colliding flag on the new tile
    var newTile = layer.data[tileY][tileX];
    var collides = layer.collideIndexes.indexOf(newTile.index) !== -1;

    SetTileCollision(newTile, collides);

    // Recalculate faces only if the colliding flag at (tileX, tileY) has changed
    if (recalculateFaces && (oldTileCollides !== newTile.collides))
    {
        CalculateFacesAt(tileX, tileY, layer);
    }

    return newTile;
};

module.exports = PutTileAt;
