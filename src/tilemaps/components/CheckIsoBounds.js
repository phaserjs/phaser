/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector2 = require('../../math/Vector2');

var point = new Vector2();

/**
 * Checks if the given tile coordinate is within the isometric layer bounds, or not.
 *
 * @function Phaser.Tilemaps.Components.CheckIsoBounds
 * @since 3.50.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to check against.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 *
 * @return {boolean} Returns `true` if the coordinates are within the iso bounds.
 */
var CheckIsoBounds = function (tileX, tileY, layer, camera)
{
    var tilemapLayer = layer.tilemapLayer;

    var cullPaddingX = tilemapLayer.cullPaddingX;
    var cullPaddingY = tilemapLayer.cullPaddingY;

    var pos = tilemapLayer.tilemap.tileToWorldXY(tileX, tileY, point, camera, tilemapLayer);

    // we always subtract 1/2 of the tile's height/width to make the culling distance start from the center of the tiles.
    return pos.x > camera.worldView.x + tilemapLayer.scaleX * layer.tileWidth * (-cullPaddingX - 0.5)
        && pos.x < camera.worldView.right + tilemapLayer.scaleX * layer.tileWidth * (cullPaddingX - 0.5)
        && pos.y > camera.worldView.y + tilemapLayer.scaleY * layer.tileHeight * (-cullPaddingY - 1.0)
        && pos.y < camera.worldView.bottom + tilemapLayer.scaleY * layer.tileHeight * (cullPaddingY - 0.5);
};

module.exports = CheckIsoBounds;
