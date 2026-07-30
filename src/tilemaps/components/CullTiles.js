/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CullBounds = require('./CullBounds');
var RunCull = require('./RunCull');

/**
 * Returns the tiles in the given layer that are within the camera's viewport. Culling avoids
 * rendering tiles that are off-screen, improving performance. The camera's world view bounds
 * are calculated and snapped to the scaled tile size, taking cull padding (expressed in tiles)
 * into account. If the layer has `skipCull` enabled, or if its scroll factors differ from 1,
 * the full layer dimensions are used instead so that all tiles are included. This function is
 * used internally by the tilemap rendering pipeline.
 *
 * @function Phaser.Tilemaps.Components.CullTiles
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to run the cull check against.
 * @param {array} [outputArray] - An optional array to store the culled Tile objects within.
 * @param {number} [renderOrder=0] - The rendering order constant. Controls the order in which tiles are iterated and added to the output array.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var CullTiles = function (layer, camera, outputArray, renderOrder)
{
    if (outputArray === undefined) { outputArray = []; }
    if (renderOrder === undefined) { renderOrder = 0; }

    outputArray.length = 0;

    var tilemapLayer = layer.tilemapLayer;

    //  Camera world view bounds, snapped for scaled tile size
    //  Cull Padding values are given in tiles, not pixels
    var bounds = CullBounds(layer, camera);

    if (tilemapLayer.skipCull || tilemapLayer.scrollFactorX !== 1 || tilemapLayer.scrollFactorY !== 1)
    {
        bounds.left = 0;
        bounds.right = layer.width;
        bounds.top = 0;
        bounds.bottom = layer.height;
    }

    RunCull(layer, bounds, renderOrder, outputArray);

    return outputArray;
};

module.exports = CullTiles;
