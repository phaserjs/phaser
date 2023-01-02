/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var GetTilesWithin = require('./GetTilesWithin');

/**
 * Sets a collision callback for the given rectangular area (in tile coordinates) within the layer.
 * If a callback is already set for the tile index it will be replaced. Set the callback to null to
 * remove it.
 *
 * @function Phaser.Tilemaps.Components.SetTileLocationCallback
 * @since 3.0.0
 *
 * @param {number} tileX - The left most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} tileY - The top most tile index (in tile coordinates) to use as the origin of the area.
 * @param {number} width - How many tiles wide from the `tileX` index the area will be.
 * @param {number} height - How many tiles tall from the `tileY` index the area will be.
 * @param {function} callback - The callback that will be invoked when the tile is collided with.
 * @param {object} callbackContext - The context under which the callback is called.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
var SetTileLocationCallback = function (tileX, tileY, width, height, callback, callbackContext, layer)
{
    var tiles = GetTilesWithin(tileX, tileY, width, height, null, layer);

    for (var i = 0; i < tiles.length; i++)
    {
        tiles[i].setCollisionCallback(callback, callbackContext);
    }
};

module.exports = SetTileLocationCallback;
