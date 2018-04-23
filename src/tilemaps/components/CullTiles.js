/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

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
    
    var zoom = camera.zoom;
    var originX = camera.width / 2;
    var originY = camera.height / 2;

    camera.matrix.loadIdentity();
    camera.matrix.translate(camera.x + originX, camera.y + originY);
    camera.matrix.rotate(camera.rotation);
    camera.matrix.scale(zoom, zoom);
    camera.matrix.translate(-originX, -originY);
    camera.matrix.invert();

    var tilemapLayer = layer.tilemapLayer;
    var tileW = layer.tileWidth;
    var tileH = layer.tileHeight;
    var cullX = ((camera.scrollX * tilemapLayer.scrollFactorX) - tileW);
    var cullY = ((camera.scrollY * tilemapLayer.scrollFactorY) - tileH);
    var cullW = (cullX + (camera.width + tileW * 2));
    var cullH = (cullY + (camera.height + tileH * 2));
    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;
    var cameraMatrix = camera.matrix.matrix;
    var a = cameraMatrix[0];
    var b = cameraMatrix[1];
    var c = cameraMatrix[2];
    var d = cameraMatrix[3];
    var e = cameraMatrix[4];
    var f = cameraMatrix[5];
    var tCullX = cullX * a + cullY * c + e;
    var tCullY = cullX * b + cullY * d + f;
    var tCullW = cullW * a + cullH * c + e;
    var tCullH = cullW * b + cullH * d + f;


    for (var y = 0; y < mapHeight; ++y)
    {
        for (var x = 0; x < mapWidth; ++x)
        {
            var tile = mapData[y][x];

            if (tile === null || tile.index === -1)
            { continue; }

            var tileX = tile.pixelX * a + tile.pixelY * c + e;
            var tileY = tile.pixelX * b + tile.pixelY * d + f;

            if (tile.visible &&
                tileX >= tCullX &&
                tileY >= tCullY &&
                tileX + tileW <= tCullW &&
                tileY + tileH <= tCullH
            )
            {
                outputArray.push(tile);
            }
        }
    }


    /* var tilemapLayer = layer.tilemapLayer;
    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;
    var left = (camera.scrollX * camera.zoom * tilemapLayer.scrollFactorX) - tilemapLayer.x;
    var top = (camera.scrollY * camera.zoom * tilemapLayer.scrollFactorY) - tilemapLayer.y;
    var sx = tilemapLayer.scaleX;
    var sy = tilemapLayer.scaleY;
    var tileWidth = layer.tileWidth * sx;
    var tileHeight = layer.tileHeight * sy;

    for (var row = 0; row < mapHeight; ++row)
    {
        for (var col = 0; col < mapWidth; ++col)
        {
            var tile = mapData[row][col];

            if (tile === null || tile.index === -1) { continue; }

            var tileX = tile.pixelX * sx - left;
            var tileY = tile.pixelY * sy - top;
            var cullW = camera.width + tileWidth;
            var cullH = camera.height + tileHeight;

            if (tile.visible &&
                tileX > -tileWidth && tileY > -tileHeight &&
                tileX < cullW && tileY < cullH)
            {
                outputArray.push(tile);
            }
        }
    } */

    return outputArray;
};

module.exports = CullTiles;
