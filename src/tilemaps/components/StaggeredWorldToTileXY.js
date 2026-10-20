/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Converts from world XY coordinates (pixels) to staggered tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.StaggeredWorldToTileXY
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
var StaggeredWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
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

    if (snapToFloor)
    {
        //  Each tile is a diamond inside its bounding box and the boxes of neighboring rows
        //  overlap, so the box alone can't tell which tile the point is in. In half tile units
        //  the diamond centers are where u + v and u - v are both even, on a grid turned by 45 degrees.

        var u = worldX / (tileWidth / 2);
        var v = worldY / (tileHeight / 2);

        var p = 2 * Math.floor((u + v + 1) / 2);
        var q = 2 * Math.floor((u - v + 1) / 2);

        var tileY = (p - q) / 2 - 1;

        return point.set(Math.floor((q + tileY) / 2), tileY);
    }

    var y = worldY / (tileHeight / 2);
    var x = (worldX + (y % 2) * 0.5 * tileWidth) / tileWidth;

    return point.set(x, y);
};

module.exports = StaggeredWorldToTileXY;
