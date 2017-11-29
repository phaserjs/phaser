/**
 * Internally used method to convert from tile Y coordinates to world Y coordinates, factoring in
 * layer position, scale and scroll.
 *
 * @param {integer} tileY - [description]
 * @param {Camera} [camera=main camera] - [description]
 * @param {LayerData} layer - [description]
 * @returns {number}
 */
var TileToWorldY = function (tileY, camera, layer)
{
    var tileHeight = layer.tileHeight;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        layerWorldY = tilemapLayer.y - (camera.scrollY * tilemapLayer.scrollFactorY);

        tileHeight *= tilemapLayer.scaleY;
    }

    return layerWorldY + tileY * tileHeight;
};

module.exports = TileToWorldY;
