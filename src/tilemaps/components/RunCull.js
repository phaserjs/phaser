/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the tiles in the given layer that are within the cameras viewport. This is used internally.
 *
 * @function Phaser.Tilemaps.Components.RunCull
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {object} bounds - An object containing the `left`, `right`, `top` and `bottom` bounds.
 * @param {number} renderOrder - The rendering order constant.
 * @param {array} outputArray - The array to store the Tile objects within.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var RunCull = function (layer, bounds, renderOrder, outputArray)
{
    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;

    var tilemapLayer = layer.tilemapLayer;

    var drawLeft = Math.max(0, bounds.left);
    var drawRight = Math.min(mapWidth, bounds.right);
    var drawTop = Math.max(0, bounds.top);
    var drawBottom = Math.min(mapHeight, bounds.bottom);

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
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                {
                    continue;
                }

                outputArray.push(tile);
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
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                {
                    continue;
                }

                outputArray.push(tile);
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
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                {
                    continue;
                }

                outputArray.push(tile);
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
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
                {
                    continue;
                }

                outputArray.push(tile);
            }
        }
    }

    tilemapLayer.tilesDrawn = outputArray.length;
    tilemapLayer.tilesTotal = mapWidth * mapHeight;

    return outputArray;
};

module.exports = RunCull;
