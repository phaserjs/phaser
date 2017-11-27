/**
 * Returns the tiles in the given layer that are within the camera's viewport. This is used
 * internally.
 *
 * @param {LayerData} layer - [description]
 * @param {Camera} [camera=main camera] - [description]
 * @param {array} [outputArray] - [description]
 * @returns {array}
 */
var CullTiles = function (layer, camera, outputArray)
{
    if (outputArray === undefined) { outputArray = []; }

    outputArray.length = 0;

    var tilemapLayer = layer.tilemapLayer;
    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;
    var left = (camera.scrollX * tilemapLayer.scrollFactorX) - tilemapLayer.x;
    var top = (camera.scrollY * tilemapLayer.scrollFactorY) - tilemapLayer.y;
    var tileWidth = layer.tileWidth * tilemapLayer.scaleX;
    var tileHeight = layer.tileHeight * tilemapLayer.scaleY;

    for (var row = 0; row < mapHeight; ++row)
    {
        for (var col = 0; col < mapWidth; ++col)
        {
            var tile = mapData[row][col];

            if (tile === null || (tile.index <= 0 && tilemapLayer.skipIndexZero)) { continue; }

            var tileX = tile.x * tileWidth - left;
            var tileY = tile.y * tileHeight - top;
            var cullW = camera.width + tileWidth;
            var cullH = camera.height + tileHeight;

            if (tile.visible &&
                tileX > -tileWidth && tileY > -tileHeight &&
                tileX < cullW && tileY < cullH)
            {
                outputArray.push(tile);
            }
        }
    }

    return outputArray;
};

module.exports = CullTiles;
