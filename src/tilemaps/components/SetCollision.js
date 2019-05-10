/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
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
 * @private
 * @since 3.0.0
 *
 * @param {(integer|array)} indexes - Either a single tile index, or an array of tile indexes.
 * @param {boolean} [collides=true] - If true it will enable collision. If false it will clear collision.
 * @param {boolean} [recalculateFaces=true] - Whether or not to recalculate the tile faces after the update.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var SetCollision = function (indexes, collides, recalculateFaces, layer)
{
    if (collides === undefined) { collides = true; }
    if (recalculateFaces === undefined) { recalculateFaces = true; }
    if (!Array.isArray(indexes)) { indexes = [ indexes ]; }

    // Update the array of colliding indexes
    for (var i = 0; i < indexes.length; i++)
    {
        SetLayerCollisionIndex(indexes[i], collides, layer);
    }

    // Update the tiles
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

    if (recalculateFaces)
    {
        CalculateFacesWithin(0, 0, layer.width, layer.height, layer);
    }
};

module.exports = SetCollision;
