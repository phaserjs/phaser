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
