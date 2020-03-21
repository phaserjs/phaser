/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.TileToWorldY
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileY - The x coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * 
 * @return {number}
 */
var TileToWorldY = function (tileY, camera, layer)
{
    var orientation = layer.orientation;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldY = 0;

    if (tilemapLayer)
    {
        if (camera === undefined) { camera = tilemapLayer.scene.cameras.main; }
        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));
        tileHeight *= tilemapLayer.scaleY;
    }

    if (orientation === 'orthogonal')
    {
        return layerWorldY + tileY * tileHeight;
    }
    else if (orientation === 'isometric')
    {
        // Not Best Solution ?
        console.warn('With isometric map types you have to use the TileToWorldXY function.');
        return null;
    }
    else if (orientation === 'staggered')
    {
        return layerWorldY + tileY * (tileHeight / 2);
    }
    else if (orientation === 'hexagonal')
    {
        var sidel = layer.tilemapLayer.tilemap.hexSideLength;
        var rowHeight = ((tileHeight - sidel) / 2 + sidel);

        // same as staggered
        return layerWorldY + tileY * rowHeight;
    }
};

module.exports = TileToWorldY;
