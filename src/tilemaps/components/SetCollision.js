/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SetTileCollision = require('./SetTileCollision');
var CalculateFacesWithin = require('./CalculateFacesWithin');
var SetLayerCollisionIndex = require('./SetLayerCollisionIndex');

/**
 * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
 * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
 * collision will be enabled (true) or disabled (false).
 *
 * @function Phaser.Tilemaps.Components.SetCollision
 * @since 3.0.0
 *
 * @param {(number|array)} indexes - Either a single tile index, or an array of tile indexes.
 * @param {boolean} collides - If true it will enable collision. If false it will clear collision.
 * @param {boolean} recalculateFaces - Whether or not to recalculate the tile faces after the update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {boolean} [updateLayer=true] - If true, updates the current tiles on the layer. Set to false if no tiles have been placed for significant performance boost.
 */
var SetCollision = function (indexes, collides, recalculateFaces, layer, updateLayer)
{
    if (collides === undefined) { collides = true; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }
    if (updateLayer === undefined) { updateLayer = true; }

    if (!Array.isArray(indexes))
    {
        indexes = [ indexes ];
    }

    // Update the array of colliding indexes
    for (var i = 0; i < indexes.length; i++)
    {
        SetLayerCollisionIndex(indexes[i], collides, layer);
    }

    // Update the tiles
    if (updateLayer)
    {
        for (var ty = 0; ty < layer.height; ty++)
        {
            for (var tx = 0; tx < layer.width; tx++)
            {
                var tile = layer.data[ty][tx];

                if (tile && indexes.indexOf(tile.index) !== -1)
                {
                    SetTileCollision(tile, collides);
                }
            }
        }
    }

    if (recalculateFaces)
    {
        CalculateFacesWithin(0, 0, layer.width, layer.height, layer);
    }
};

module.exports = SetCollision;
