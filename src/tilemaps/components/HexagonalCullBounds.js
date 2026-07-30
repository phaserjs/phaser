/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var SnapCeil = require('../../math/snap/SnapCeil');
var SnapFloor = require('../../math/snap/SnapFloor');

/**
 * Calculates the tile grid index bounds of a hexagonal Tilemap Layer that fall within the
 * camera's viewport. The bounds account for the layer's stagger axis (x or y), hex side length,
 * tile scale, layer offset, and cull padding, returning the range of tile columns and rows that
 * need to be rendered. This is used internally by the hexagonal cull tiles function.
 *
 * @function Phaser.Tilemaps.Components.HexagonalCullBounds
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to run the cull check against.
 *
 * @return {object} An object containing the `left`, `right`, `top` and `bottom` tile grid index bounds.
 */
var HexagonalCullBounds = function (layer, camera)
{
    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);

    var len = layer.hexSideLength;

    var boundsLeft;
    var boundsRight;
    var boundsTop;
    var boundsBottom;

    if (layer.staggerAxis === 'y')
    {
        var rowH = ((tileH - len) / 2 + len);

        boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
        boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;

        boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, rowH, 0, true) - tilemapLayer.cullPaddingY;
        boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, rowH, 0, true) + tilemapLayer.cullPaddingY;
    }
    else
    {
        var rowW = ((tileW - len) / 2 + len);

        boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, rowW, 0, true) - tilemapLayer.cullPaddingX;
        boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, rowW, 0, true) + tilemapLayer.cullPaddingX;

        boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH, 0, true) - tilemapLayer.cullPaddingY;
        boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH, 0, true) + tilemapLayer.cullPaddingY;
    }

    return {
        left: boundsLeft,
        right: boundsRight,
        top: boundsTop,
        bottom: boundsBottom
    };
};

module.exports = HexagonalCullBounds;
