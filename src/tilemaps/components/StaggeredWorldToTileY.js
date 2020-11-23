/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts from world Y coordinates (pixels) to staggered tile Y coordinates (tile units), factoring in the
 * layers position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.StaggeredWorldToTileY
 * @since 3.50.0
 *
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} snapToFloor - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The Y location in tile units.
 */
var StaggeredWorldToTileY = function (worldY, snapToFloor, camera, layer)
{
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer)
    {
        if (!camera) { camera = tilemapLayer.scene.cameras.main; }

        //  Find the world position relative to the static or dynamic layer's top left origin,
        //  factoring in the camera's vertical scroll

        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;
    }

    return (snapToFloor) ? Math.floor(worldY / (tileHeight / 2)) : worldY / (tileHeight / 2);
};

module.exports = StaggeredWorldToTileY;
