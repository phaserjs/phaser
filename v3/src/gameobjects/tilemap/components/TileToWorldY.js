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
