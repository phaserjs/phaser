/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts from staggered tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
 * layers position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.StaggeredTileToWorldY
 * @since 3.50.0
 *
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The Y location in world coordinates.
 */
var StaggeredTileToWorldY = function (tileY, camera, layer)
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

    return layerWorldY + tileY * (tileHeight / 2) + tileHeight;
};

module.exports = StaggeredTileToWorldY;
