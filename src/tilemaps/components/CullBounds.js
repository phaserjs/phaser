/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Rectangle = require('../../geom/rectangle/Rectangle');
var SnapCeil = require('../../math/snap/SnapCeil');
var SnapFloor = require('../../math/snap/SnapFloor');

var bounds = new Rectangle();

/**
 * Returns the bounds in the given orthogonal layer that are within the cameras viewport.
 * This is used internally by the cull tiles function.
 *
 * @function Phaser.Tilemaps.Components.CullBounds
 * @since 3.50.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to run the cull check against.
 *
 * @return {Phaser.Geom.Rectangle} A rectangle containing the culled bounds. If you wish to retain this object, clone it, as it's recycled internally.
 */
var CullBounds = function (layer, camera)
{
    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);

    var boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
    var boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;

    var boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH, 0, true) - tilemapLayer.cullPaddingY;
    var boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH, 0, true) + tilemapLayer.cullPaddingY;

    return bounds.setTo(
        boundsLeft,
        boundsTop,
        (boundsRight - boundsLeft),
        (boundsBottom - boundsTop)
    );
};

module.exports = CullBounds;
