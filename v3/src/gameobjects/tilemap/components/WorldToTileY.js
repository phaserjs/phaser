var SnapFloor = require('../../../math/snap/SnapFloor');

var WorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    if (snapToFloor === undefined) { snapToFloor = true; }

    var tilemapLayer = layer.tilemapLayer;
    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldY = worldY + (camera.scrollY * tilemapLayer.scrollFactorY) - tilemapLayer.y;
    }

    return snapToFloor
        ? SnapFloor(worldY, layer.tileHeight) / layer.tileHeight
        : worldY / layer.tileHeight;
};

module.exports = WorldToTileY;
