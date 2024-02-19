/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetTileCollision = require('./SetTileCollision');
var CalculateFacesWithin = require('./CalculateFacesWithin');
var SetLayerCollisionIndex = require('./SetLayerCollisionIndex');

/**
 * Sets collision on all tiles in the given layer, except for tiles that have an index specified in
 * the given array. The `collides` parameter controls if collision will be enabled (true) or
 * disabled (false). Tile indexes not currently in the layer are not affected.
 *
 * @function Phaser.Tilemaps.Components.SetCollisionByExclusion
 * @since 3.0.0
 *
 * @param {number[]} indexes - An array of the tile indexes to not be counted for collision.
 * @param {boolean} collides - If true it will enable collision. If false it will clear collision.
 * @param {boolean} recalculateFaces - Whether or not to recalculate the tile faces after the update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var SetCollisionByExclusion = function (indexes, collides, recalculateFaces, layer)
{
    if (collides === undefined) { collides = true; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    if (!Array.isArray(indexes))
    {
        indexes = [ indexes ];
    }

    // Note: this only updates layer.collideIndexes for tile indexes found currently in the layer
    for (var ty = 0; ty < layer.height; ty++)
    {
        for (var tx = 0; tx < layer.width; tx++)
        {
            var tile = layer.data[ty][tx];

            if (tile && indexes.indexOf(tile.index) === -1)
            {
                SetTileCollision(tile, collides);
                SetLayerCollisionIndex(tile.index, collides, layer);
            }
        }
    }

    if (recalculateFaces)
    {
        CalculateFacesWithin(0, 0, layer.width, layer.height, layer);
    }
};

module.exports = SetCollisionByExclusion;
