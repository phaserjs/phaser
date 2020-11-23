/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CheckIsoBounds = require('./CheckIsoBounds');

/**
 * Returns the tiles in the given layer that are within the cameras viewport. This is used internally.
 *
 * @function Phaser.Tilemaps.Components.IsometricCullTiles
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to run the cull check against.
 * @param {array} [outputArray] - An optional array to store the Tile objects within.
 * @param {number} [renderOrder=0] - The rendering order constant.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var IsometricCullTiles = function (layer, camera, outputArray, renderOrder)
{
    if (outputArray === undefined) { outputArray = []; }
    if (renderOrder === undefined) { renderOrder = 0; }

    outputArray.length = 0;

    var tilemapLayer = layer.tilemapLayer;

    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;

    var drawLeft = 0;
    var drawRight = mapWidth;
    var drawTop = 0;
    var drawBottom = mapHeight;

    if (!tilemapLayer.skipCull)
    {
        var x;
        var y;
        var tile;

        if (renderOrder === 0)
        {
            //  right-down

            for (y = drawTop; y < drawBottom; y++)
            {
                for (x = drawLeft; mapData[y] && x < drawRight; x++)
                {
                    if (CheckIsoBounds(x, y, layer, camera))
                    {
                        tile = mapData[y][x];

                        if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                        {
                            continue;
                        }

                        outputArray.push(tile);
                    }
                }
            }
        }
        else if (renderOrder === 1)
        {
            //  left-down

            for (y = drawTop; y < drawBottom; y++)
            {
                for (x = drawRight; mapData[y] && x >= drawLeft; x--)
                {
                    if (CheckIsoBounds(x, y, layer, camera))
                    {
                        tile = mapData[y][x];

                        if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                        {
                            continue;
                        }

                        outputArray.push(tile);
                    }
                }
            }
        }
        else if (renderOrder === 2)
        {
            //  right-up

            for (y = drawBottom; y >= drawTop; y--)
            {
                for (x = drawLeft; mapData[y] && x < drawRight; x++)
                {
                    if (CheckIsoBounds(x, y, layer, camera))
                    {
                        tile = mapData[y][x];

                        if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                        {
                            continue;
                        }

                        outputArray.push(tile);
                    }
                }
            }
        }
        else if (renderOrder === 3)
        {
            //  left-up

            for (y = drawBottom; y >= drawTop; y--)
            {
                for (x = drawRight; mapData[y] && x >= drawLeft; x--)
                {
                    if (CheckIsoBounds(x, y, layer, camera))
                    {
                        tile = mapData[y][x];

                        if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                        {
                            continue;
                        }

                        outputArray.push(tile);
                    }
                }
            }
        }
    }

    tilemapLayer.tilesDrawn = outputArray.length;
    tilemapLayer.tilesTotal = mapWidth * mapHeight;

    return outputArray;
};

module.exports = IsometricCullTiles;
