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
	
	// If skipping cull, loop through every tile in the map.
	
	if(tilemapLayer.skipCull)
	{
		for (var y = 0; y < mapHeight; y++)
		{
			for (var x = 0; x < mapWidth; x++)
			{
				var tile = mapData[y][x];

				if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0)
				{
					continue;
				}

				outputArray.push(tile);
			}
		}
	}
	else
	{
		var drawLeft = Math.max(0, boundsLeft / layer.tileWidth);
		var drawRight = Math.min(mapWidth, boundsRight / layer.tileWidth);
		var drawTop = Math.max(0, boundsTop / layer.tileHeight);
		var drawBottom = Math.min(mapHeight, boundsBottom / layer.tileHeight);
		
		for (var y = drawTop; y < drawBottom; y++)
		{
			for (var x = drawLeft; x < drawRight; x++)
			{
				var tile = mapData[y][x];

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

module.exports = CullTiles;
