/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

/**
 * Converts from world XY coordinates (pixels) to hexagonal tile XY coordinates (tile units), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.HexagonalWorldToTileXY
 * @since 3.50.0
 *
 * @param {number} worldX - The x coordinate to be converted, in pixels, not tiles.
 * @param {number} worldY - The y coordinate to be converted, in pixels, not tiles.
 * @param {boolean} snapToFloor - Whether or not to round the tile coordinates down to the nearest integer.
 * @param {Phaser.Math.Vector2} point - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in tile units.
 */
var HexagonalWorldToTileXY = function (worldX, worldY, snapToFloor, point, camera, layer)
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

        worldX = worldX - (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));
        worldY = worldY - (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileWidth *= tilemapLayer.scaleX;
        tileHeight *= tilemapLayer.scaleY;
    }

    //  Hard-coded orientation values for Pointy-Top Hexagons only
    var b0 = 0.5773502691896257; // Math.sqrt(3) / 3
    var b1 = -0.3333333333333333; // -1 / 3
    var b2 = 0;
    var b3 = 0.6666666666666666; // 2 / 3

    //  origin
    var tileWidthHalf = tileWidth / 2;
    var tileHeightHalf = tileHeight / 2;

    var px;
    var py;
    var q;
    var r;
    var s;

    //  size
    if (layer.staggerAxis === 'y')
    {
        //  x = b0 * tileWidth
        //  y = tileHeightHalf
        px = (worldX - tileWidthHalf) / (b0 * tileWidth);
        py = (worldY - tileHeightHalf) / tileHeightHalf;

        q = b0 * px + b1 * py;
        r = b2 * px + b3 * py;
    }
    else
    {
        //  x = tileWidthHalf
        //  y = b0 * tileHeight
        px = (worldX - tileWidthHalf) / tileWidthHalf;
        py = (worldY - tileHeightHalf) / (b0 * tileHeight);

        q = b1 * px + b0 * py;
        r = b3 * px + b2 * py;
    }

    s = -q - r;

    var qi = Math.round(q);
    var ri = Math.round(r);
    var si = Math.round(s);

    var qDiff = Math.abs(qi - q);
    var rDiff = Math.abs(ri - r);
    var sDiff = Math.abs(si - s);

    if (qDiff > rDiff && qDiff > sDiff)
    {
        qi = -ri - si;
    }
    else if (rDiff > sDiff)
    {
        ri = -qi - si;
    }

    var x;
    var y = ri;

    if (layer.staggerIndex === 'odd')
    {
        x = (y % 2 === 0) ? (ri / 2) + qi : (ri / 2) + qi - 0.5;
    }
    else
    {
        x = (y % 2 === 0) ? (ri / 2) + qi : (ri / 2) + qi + 0.5;
    }

    return point.set(x, y);
};

module.exports = HexagonalWorldToTileXY;
