/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var SnapFloor = require('../../math/snap/SnapFloor');
var SnapCeil = require('../../math/snap/SnapCeil');

/**
 * Returns the tiles in the given layer that are within the camera's viewport. This is used
 * internally.
 *
 * @function Phaser.Tilemaps.Components.CullTiles
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 * @param {array} [outputArray] - [description]
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var CullTiles = function (layer, camera, outputArray)
{
    if (outputArray === undefined) { outputArray = []; }

    outputArray.length = 0;
    
    var tilemapLayer = layer.tilemapLayer;
    var skipCull = tilemapLayer.skipCull;

    var tileW = Math.floor(layer.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(layer.tileHeight * tilemapLayer.scaleY);

    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;

    //  Camera world view bounds, snapped for tile size

    var boundsLeft = SnapFloor(camera.worldView.x, tileW) - (tilemapLayer.cullPaddingX * tileW);
    var boundsRight = SnapCeil(camera.worldView.right, tileW) + (tilemapLayer.cullPaddingX * tileW);
    var boundsTop = SnapFloor(camera.worldView.y, tileH) - (tilemapLayer.cullPaddingY * tileH);
    var boundsBottom = SnapCeil(camera.worldView.bottom, tileH) + (tilemapLayer.cullPaddingY * tileH);

    for (var y = 0; y < mapHeight; y++)
    {
        for (var x = 0; x < mapWidth; x++)
        {
            var tile = mapData[y][x];

            if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
            {
                continue;
            }

            var tilePixelX = (tile.pixelX + tilemapLayer.x) * tilemapLayer.scaleX;
            var tilePixelY = (tile.pixelY + tilemapLayer.y) * tilemapLayer.scaleY;

            if (skipCull || (tilePixelX >= boundsLeft && tilePixelX + tileW <= boundsRight && tilePixelY >= boundsTop && tilePixelY + tileH <= boundsBottom))
            {
                outputArray.push(tile);
            }
        }
    }

    tilemapLayer.tilesDrawn = outputArray.length;
    tilemapLayer.tilesTotal = mapWidth * mapHeight;

    return outputArray;
};

module.exports = CullTiles;
