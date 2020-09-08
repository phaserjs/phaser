/**
 * @author       Svipal <svipal@tuta.io>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */


var SnapFloor = require('../../math/snap/SnapFloor');
var SnapCeil = require('../../math/snap/SnapCeil');



/**
 * .This is used internally by the CullTiles component.
 *
 * @function Phaser.Tilemaps.Components.StandardCullTiles
 * @private
 * @since 3.2.x
 * @param {integer} boundsLeft   - leftmost culling bound
 * @param {integer} boundsRight - rightmost culling bound
 * @param {integer} boundsTop   - top culling bound
 * @param {integer} boundsBottom - bottom culling bound
 
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */


var StandardCullTiles = function (boundsLeft,boundsRight,boundsTop,boundsBottom) {
    
    return function (layer, camera, outputArray, renderOrder)
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
    
        if (!tilemapLayer.skipCull && tilemapLayer.scrollFactorX === 1 && tilemapLayer.scrollFactorY === 1)
        {
    
            drawLeft = Math.max(0, boundsLeft);
            drawRight = Math.min(mapWidth, boundsRight);
            drawTop = Math.max(0, boundsTop);
            drawBottom = Math.min(mapHeight, boundsBottom);
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
    

};













module.exports = StandardCullTilesWrapper;
