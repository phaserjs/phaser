/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SnapFloor = require('../../math/snap/SnapFloor');
var SnapCeil = require('../../math/snap/SnapCeil');

/**
 * Returns the tiles in the given layer that are within the camera's viewport. This is used internally.
 *
 * @function Phaser.Tilemaps.Components.CullTiles
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 * @param {array} [outputArray] - An optional array to store the Tile objects within.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var CullTiles = function (layer, camera, outputArray, renderOrder)
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

    // we define the isometric culling function as a dummy early on for it to make sense in scope 
    var inIsoBounds = function () { return true; };
    if (!tilemapLayer.skipCull && tilemapLayer.scrollFactorX === 1 && tilemapLayer.scrollFactorY === 1)
    {
        if (layer.orientation === 'orthogonal')
        {
            //  Camera world view bounds, snapped for scaled tile size
            //  Cull Padding values are given in tiles, not pixels

            var boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
            var boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;
            var boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH, 0, true) - tilemapLayer.cullPaddingY;
            var boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH, 0, true) + tilemapLayer.cullPaddingY;

            drawLeft = Math.max(0, boundsLeft);
            drawRight = Math.min(mapWidth, boundsRight);
            drawTop = Math.max(0, boundsTop);
            drawBottom = Math.min(mapHeight, boundsBottom);
        }
        else if (layer.orientation === 'isometric')
        {
            inIsoBounds = function (x,y)
            {
                var cullDistances = tilemapLayer.isoCullDistances;
                var pos = tilemapLayer.tileToWorldXY(x,y,undefined,camera);
                
                // we always subtract 1/2 of the tile's height/width to make the culling distance start from the center of the tiles.
                return pos.x > camera.worldView.x + tilemapLayer.scaleX * layer.tileWidth * (- cullDistances.x - 1 / 2)
                    && pos.x < camera.worldView.right + tilemapLayer.scaleX * layer.tileWidth * (cullDistances.x - 1 / 2)
                    && pos.y > camera.worldView.y + tilemapLayer.scaleY * layer.tileHeight * (- cullDistances.y - 1 / 2)
                    && pos.y < camera.worldView.bottom + tilemapLayer.scaleY * layer.tileHeight * (cullDistances.y - 1 / 2);
            };
        }
    }
    var x;
    var y;
    var tile;


    if (layer.orientation === 'orthogonal')
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
    else if (layer.orientation === 'isometric')
    {
        if (renderOrder === 0)
        {
            //  right-down

            for (y = drawTop; y < drawBottom; y++)
            {
                for (x = drawLeft; mapData[y] && x < drawRight; x++)
                {
                    if (inIsoBounds(x,y))
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
                    if (inIsoBounds(x,y))
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
                    if (inIsoBounds(x,y))
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
                    if (inIsoBounds(x,y))
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

module.exports = CullTiles;
