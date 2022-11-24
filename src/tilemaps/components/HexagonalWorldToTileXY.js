/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

var PointyTop = {
    b0: Math.sqrt(3) / 3,
    b1: -1 / 3,
    b2: 0,
    b3: 2 / 3
};

function Hex (q, r, s)
{
    return { q: q, r: r, s: s };
}

function hexRound (h)
{
    var qi = Math.round(h.q);
    var ri = Math.round(h.r);
    var si = Math.round(h.s);
    var qDiff = Math.abs(qi - h.q);
    var rDiff = Math.abs(ri - h.r);
    var sDiff = Math.abs(si - h.s);

    if (qDiff > rDiff && qDiff > sDiff)
    {
        qi = -ri - si;
    }
    else if (rDiff > sDiff)
    {
        ri = -qi - si;
    }
    else
    {
        si = -qi - ri;
    }

    return Hex(qi, ri, si);
}

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

    var size = { x: PointyTop.b0 * tileWidth, y: tileHeight / 2 };
    var origin = { x: tileWidth / 2, y: tileHeight / 2 };

    var pt = new Vector2((worldX - origin.x) / size.x, (worldY - origin.y) / size.y);

    var q = PointyTop.b0 * pt.x + PointyTop.b1 * pt.y;
    var r = PointyTop.b2 * pt.x + PointyTop.b3 * pt.y;
    var h = Hex(q, r, -q - r);
    var hr = hexRound(h);

    var y = hr.r;
    var x = (y % 2 === 0) ? (hr.r / 2) + hr.q : (hr.r / 2) + hr.q - 0.5;

    return point.set(x, y);
};

module.exports = HexagonalWorldToTileXY;
