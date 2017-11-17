var SnapFloor = require('../../../math/snap/SnapFloor');

var WorldToTileY = function (worldY, camera, layer)
{
    var tilemapLayer = layer.tilemapLayer;
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldY = worldY + (camera.scrollY * tilemapLayer.scrollFactorY) - tilemapLayer.y;
    }

    return SnapFloor(worldY, layer.tileWidth) / layer.tileWidth;
};

module.exports = WorldToTileY;
