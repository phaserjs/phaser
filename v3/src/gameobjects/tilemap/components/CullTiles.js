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

    for (var row = 0; row < mapHeight; ++row)
    {
        for (var col = 0; col < mapWidth; ++col)
        {
            var tile = mapData[row][col];

            if (tile === null || (tile.index <= 0 && tilemapLayer.skipIndexZero)) { continue; }

            var tileX = tile.worldX - left;
            var tileY = tile.worldY - top;
            var cullW = camera.width + tile.width;
            var cullH = camera.height + tile.height;

            if (tile.visible &&
                tileX > -tile.width && tileY > -tile.height &&
                tileX < cullW && tileY < cullH)
            {
                outputArray.push(tile);
            }
        }
    }

    return outputArray;
};

module.exports = CullTiles;
