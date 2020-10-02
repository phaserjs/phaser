/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CheckIsoBounds = require('./CheckIsoBounds');
var CONST = require('../const');
var GetCullBounds = require('./GetCullBounds');
var SnapCeil = require('../../math/snap/SnapCeil');
var SnapFloor = require('../../math/snap/SnapFloor');

/**
 * Orientation-Decorated function that returns the tiles in the given layer that are within the camera's viewport. This is used internally.
 *
 * @function Phaser.Tilemaps.Components.GetStandardCullTiles
 * @since 3.50.iso
 * --- decorator:
 * @param {function} getCullBounds
 * --- inner function :
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 * @param {array} [outputArray] - An optional array to store the Tile objects within.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var GetStandardCullTiles = function (getCullBounds)
{
    console.log('getting standard cull tiles function');

    var StandardCullTiles = function (layer, camera, outputArray, renderOrder)
    {
        if (outputArray === undefined) { outputArray = []; }
        if (renderOrder === undefined) { renderOrder = 0; }
        console.log('culling tiles');
        outputArray.length = 0;

        var tilemapLayer = layer.tilemapLayer;

        var mapData = layer.data;
        var mapWidth = layer.width;
        var mapHeight = layer.height;

        var drawLeft = 0;
        var drawRight = mapWidth;
        var drawTop = 0;
        var drawBottom = mapHeight;

        if (!tilemapLayer.skipCull && tilemapLayer.scrollFactorX === 1 && tilemapLayer.scrollFactorY === 1)
        {
        //  Camera world view bounds, snapped for scaled tile size
        //  Cull Padding values are given in tiles, not pixels
            var bounds = getCullBounds(layer,camera);

            drawLeft = Math.max(0, bounds.left);
            drawRight = Math.min(mapWidth, bounds.right);
            drawTop = Math.max(0, bounds.top);
            drawBottom = Math.min(mapHeight, bounds.bottom);
        }
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
    return StandardCullTiles;
};


/**
 * Returns the tiles in the given layer that are within the camera's viewport. This is used internally.
 *
 * @function Phaser.Tilemaps.Components.IsoCullTiles
 * @since 3.50.iso
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 * @param {array} [outputArray] - An optional array to store the Tile objects within.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var IsoCullTiles = function (layer, camera, outputArray, renderOrder)
{
    if (outputArray === undefined) { outputArray = []; }
    if (renderOrder === undefined) { renderOrder = 0; }

    outputArray.length = 0;

    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);

    var drawLeft = 0;
    var drawRight = mapWidth;
    var drawTop = 0;
    var drawBottom = mapHeight;

    if (!tilemapLayer.skipCull && tilemapLayer.scrollFactorX === 1 && tilemapLayer.scrollFactorY === 1)
    {
        if (layer.orientation === CONST.ORTHOGONAL || layer.orientation === CONST.STAGGERED || layer.orientation === CONST.HEXAGONAL)
        {
            //  Camera world view bounds, snapped for scaled tile size
            //  Cull Padding values are given in tiles, not pixels
            var boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
            var boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;

            var boundsTop;
            var boundsBottom;

            if (layer.orientation === CONST.ORTHOGONAL)
            {
                boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH, 0, true) - tilemapLayer.cullPaddingY;
                boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH, 0, true) + tilemapLayer.cullPaddingY;
            }
            else if (layer.orientation === CONST.STAGGERED)
            {
                boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH / 2, 0, true) - tilemapLayer.cullPaddingY;
                boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH / 2, 0, true) + tilemapLayer.cullPaddingY;
            }
            else if (layer.orientation === CONST.HEXAGONAL)
            {
                var sidel = layer.hexSideLength;
                var rowH = ((tileH - sidel) / 2 + sidel);

                boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, rowH, 0, true) - tilemapLayer.cullPaddingY;
                boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, rowH, 0, true) + tilemapLayer.cullPaddingY;
            }




            drawLeft = Math.max(0, boundsLeft);
            drawRight = Math.min(mapWidth, boundsRight);
            drawTop = Math.max(0, boundsTop);

            drawBottom = Math.min(mapHeight, boundsBottom);
        }
    }
    var x;
    var y;
    var tile;


    if (layer.orientation === CONST.ORTHOGONAL || layer.orientation === CONST.STAGGERED || layer.orientation === CONST.HEXAGONAL)
    {

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
    }
    else if (layer.orientation === CONST.ISOMETRIC)
    {
        if (renderOrder === 0)
        {
            //  right-down

            for (y = drawTop; y < drawBottom; y++)
            {
                for (x = drawLeft; mapData[y] && x < drawRight; x++)
                {
                    if (CheckIsoBounds(x,y,layer,camera))
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
                    if (CheckIsoBounds(x,y,layer,camera))
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
                    if (CheckIsoBounds(x,y,layer,camera))
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
                    if (CheckIsoBounds(x,y,layer,camera))
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


var CullTiles = function (orientation)
{
    switch (orientation)
    {
        case CONST.ISOMETRIC:
            return IsoCullTiles;
        default:
            return GetStandardCullTiles(GetCullBounds(orientation));
    }
};
module.exports = CullTiles;
