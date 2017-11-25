var WorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    if (snapToFloor === undefined) { snapToFloor = true; }

    var tileHeight = layer.tileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        worldY = worldY + (camera.scrollY * tilemapLayer.scrollFactorY) - tilemapLayer.y;

        tileHeight *= tilemapLayer.scaleY;
    }

    return snapToFloor
        ? Math.floor(worldY / tileHeight)
        : worldY / tileHeight;
};

module.exports = WorldToTileY;
