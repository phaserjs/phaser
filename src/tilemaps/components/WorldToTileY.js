/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.WorldToTileY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {string} orientation - The Tilemap's orientation
 *
 * @return {number} The Y location in tile units.
 */
var WorldToTileY = function (worldY, snapToFloor, camera, layer, orientation)
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

    if (orientation === "orthogonal") {
        return snapToFloor
            ? Math.floor(worldY / tileHeight)
            : worldY / tileHeight;
    } else if (orientation === "isometric") {
        console.warn('With isometric map types you have to use the WorldToTileXY function.');
        return null

    }
};

module.exports = WorldToTileY;
