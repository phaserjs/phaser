/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Converts from world XY coordinates (pixels) to isometric tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.IsometricWorldToTileXY
 * @since 3.50.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} snapToFloor - Whether or not to round the tile coordinate down to the nearest integer.
 * @param {Phaser.Math.Vector2} point - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var IsometricWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
{
    if (!point) { point = new Vector2(); }

    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer)
    {
        if (!camera) { camera = tilemapLayer.scene.cameras.main; }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll

        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll

        worldX = worldX - (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));

        tileWidth *= tilemapLayer.scaleX;
    }

    worldX -= tileWidth / 2;

    var x = (snapToFloor) ? Math.floor((worldX / (tileWidth / 2) + worldY / (tileHeight / 2)) / 2) : ((worldX / (tileWidth / 2) + worldY / (tileHeight / 2)) / 2);
    var y = (snapToFloor) ? Math.floor((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2) : ((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2);

    return point.set(x, y);
};

module.exports = IsometricWorldToTileXY;
