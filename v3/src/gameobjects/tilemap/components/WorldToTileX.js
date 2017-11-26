var WorldToTileX = function (worldX, snapToFloor, camera, layer)
{
    if (snapToFloor === undefined) { snapToFloor = true; }

    var tileWidth = layer.tileWidth;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldX = worldX + (camera.scrollX * tilemapLayer.scrollFactorX) - tilemapLayer.x;

        tileWidth *= tilemapLayer.scaleX;
    }

    return snapToFloor
        ? Math.floor(worldX / tileWidth)
        : worldX / tileWidth;
};

module.exports = WorldToTileX;
