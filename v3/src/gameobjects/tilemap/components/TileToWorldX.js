/**
 * Internally used method to convert from tile X coordinates to world X coordinates, factoring in
 * layer position, scale and scroll.
 *
 * @param {integer} tileX - [description]
 * @param {Camera} [camera=main camera] - [description]
 * @param {LayerData} layer - [description]
 * @returns {number}
 */
var TileToWorldX = function (tileX, camera, layer)
{
    var tileWidth = layer.tileWidth;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldX = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        layerWorldX = tilemapLayer.x - (camera.scrollX * tilemapLayer.scrollFactorX);

        tileWidth *= tilemapLayer.scaleX;
    }

    return layerWorldX + tileX * tileWidth;
};

module.exports = TileToWorldX;
