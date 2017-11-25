var SnapFloor = require('../../../math/snap/SnapFloor');

var WorldToTileX = function (worldX, snapToFloor, camera, layer)
{
    if (snapToFloor === undefined) { snapToFloor = true; }

    var tilemapLayer = layer.tilemapLayer;
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldX = worldX + (camera.scrollX * tilemapLayer.scrollFactorX) - tilemapLayer.x;
    }

    return snapToFloor
        ? SnapFloor(worldX, layer.tileWidth) / layer.tileWidth
        : worldX / layer.tileWidth;
};

module.exports = WorldToTileX;
