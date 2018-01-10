/**
 * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @param {number} worldY - [description]
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
 * nearest integer.
 * @param {Camera} [camera=main camera] - [description]
 * @param {LayerData} layer - [description]
 * @returns {number} The Y location in tile units.
 */
var WorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    if (snapToFloor === undefined) { snapToFloor = true; }

    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;
    }

    return snapToFloor
        ? Math.floor(worldY / tileHeight)
        : worldY / tileHeight;
};

module.exports = WorldToTileY;
