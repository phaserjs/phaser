/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetTileCollision = require('./SetTileCollision');
var CalculateFacesWithin = require('./CalculateFacesWithin');
var SetLayerCollisionIndex = require('./SetLayerCollisionIndex');

/**
 * Sets collision on a range of tiles in a layer whose index is between the specified `start` and
 * `stop` (inclusive). Calling this with a start value of 10 and a stop value of 14 would set
 * collision for tiles 10, 11, 12, 13 and 14. The `collides` parameter controls if collision will be
 * enabled (true) or disabled (false).
 *
 * @function Phaser.Tilemaps.Components.SetCollisionBetween
 * @since 3.0.0
 *
 * @param {number} start - The first index of the tile to be set for collision.
 * @param {number} stop - The last index of the tile to be set for collision.
 * @param {boolean} collides - If true it will enable collision. If false it will clear collision.
 * @param {boolean} recalculateFaces - Whether or not to recalculate the tile faces after the update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {boolean} [updateLayer=true] - If true, updates the current tiles on the layer. Set to false if no tiles have been placed for significant performance boost.
 */
var SetCollisionBetween = function (start, stop, collides, recalculateFaces, layer, updateLayer)
{
    if (collides === undefined) { collides = true; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }
    if (updateLayer === undefined) { updateLayer = true; }

    if (start > stop)
    {
        return;
    }

    //  Update the array of colliding indexes
    for (var index = start; index <= stop; index++)
    {
        SetLayerCollisionIndex(index, collides, layer);
    }

    //  Update the tiles
    if (updateLayer)
    {
        for (var ty = 0; ty < layer.height; ty++)
        {
            for (var tx = 0; tx < layer.width; tx++)
            {
                var tile = layer.data[ty][tx];

                if (tile)
                {
                    if (tile.index >= start && tile.index <= stop)
                    {
                        SetTileCollision(tile, collides);
                    }
                }
            }
        }
    }

    if (recalculateFaces)
    {
        CalculateFacesWithin(0, 0, layer.width, layer.height, layer);
    }
};

module.exports = SetCollisionBetween;
