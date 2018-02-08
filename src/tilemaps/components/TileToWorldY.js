/**
 * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.TileToWorldY
 * @since 3.0.0
 *
 * @param {integer} tileY - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - [description]
 * 
 * @return {number}
 */
var TileToWorldY = function (tileY, camera, layer)
{
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }

        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;
    }

    return layerWorldY + tileY * tileHeight;
};

module.exports = TileToWorldY;
