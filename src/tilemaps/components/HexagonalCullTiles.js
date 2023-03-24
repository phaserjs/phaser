/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CullBounds = require('./HexagonalCullBounds');
var RunCull = require('./RunCull');

/**
 * Returns the tiles in the given layer that are within the cameras viewport. This is used internally.
 *
 * @function Phaser.Tilemaps.Components.HexagonalCullTiles
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to run the cull check against.
 * @param {array} [outputArray] - An optional array to store the Tile objects within.
 * @param {number} [renderOrder=0] - The rendering order constant.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var HexagonalCullTiles = function (layer, camera, outputArray, renderOrder)
{
    if (outputArray === undefined) { outputArray = []; }
    if (renderOrder === undefined) { renderOrder = 0; }

    outputArray.length = 0;

    var tilemapLayer = layer.tilemapLayer;

    //  Camera world view bounds, snapped for scaled tile size
    //  Cull Padding values are given in tiles, not pixels

    var bounds = CullBounds(layer, camera);

    if (tilemapLayer.skipCull && tilemapLayer.scrollFactorX === 1 && tilemapLayer.scrollFactorY === 1)
    {
        bounds.left = 0;
        bounds.right = layer.width;
        bounds.top = 0;
        bounds.bottom = layer.height;
    }

    RunCull(layer, bounds, renderOrder, outputArray);

    return outputArray;
};

module.exports = HexagonalCullTiles;
