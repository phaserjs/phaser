/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../const');
var SnapCeil = require('../../math/snap/SnapCeil');
var SnapFloor = require('../../math/snap/SnapFloor');

/**
 * Returns the bounds in the given layer that are within the camera's viewport.
 * This is used internally by the cull tiles function.
 *
 * @function Phaser.Tilemaps.Components.OrthoGetCullBounds
 * @since 3.50.iso
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var OrthoGetCullBounds = function (layer, camera)
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

    return {
        left: boundsLeft,
        right: boundsRight,
        top: boundsTop,
        bottom: boundsBottom
    };
};

/**
 * Returns the bounds in the given layer that are within the camera's viewport.
 * This is used internally by the cull tiles function.
 *
 * @function Phaser.Tilemaps.Components.HexaGetCullBounds
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var HexaGetCullBounds = function (layer, camera)
{
    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);

    var sidel = layer.hexSideLength;
    var rowH = ((tileH - sidel) / 2 + sidel);

    var boundsLeft = SnapFloor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
    var boundsRight = SnapCeil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;

    var boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, rowH, 0, true) - tilemapLayer.cullPaddingY;
    var boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, rowH, 0, true) + tilemapLayer.cullPaddingY;

    return {
        left: boundsLeft,
        right: boundsRight,
        top: boundsTop,
        bottom: boundsBottom
    };
};


/**
 * Returns the bounds in the given layer that are within the camera's viewport.
 * This is used internally by the cull tiles function.
 *
 * @function Phaser.Tilemaps.Components.StagGetCullBounds
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
var StagGetCullBounds = function (layer, camera)
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

    var boundsTop = SnapFloor(camera.worldView.y - tilemapLayer.y, tileH / 2, 0, true) - tilemapLayer.cullPaddingY;
    var boundsBottom = SnapCeil(camera.worldView.bottom - tilemapLayer.y, tileH / 2, 0, true) + tilemapLayer.cullPaddingY;

    return {
        left: boundsLeft,
        right: boundsRight,
        top: boundsTop,
        bottom: boundsBottom
    };
};

var nullFunc = function ()
{
    console.warn('cull bounds are *really* not supported by the current map type');
    return null;
};

var GetCullBounds = function (orientation)
{
    switch (orientation)
    {
        case CONST.ORTHOGONAL:
            return OrthoGetCullBounds;
        case CONST.HEXAGONAL:
            return HexaGetCullBounds;
        case CONST.STAGGERED:
            return StagGetCullBounds;
        default:
            console.warn('cull bounds are not supported by the current map type');
            return nullFunc;
    }

};
module.exports = GetCullBounds;
