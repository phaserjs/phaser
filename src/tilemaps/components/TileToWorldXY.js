/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TileToWorldX = require('./TileToWorldX');
var TileToWorldY = require('./TileToWorldY');
var Vector2 = require('../../math/Vector2');

/**
 * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
 * layer's position, scale and scroll. This will return a new Vector2 object or update the given
 * `point` object.
 *
 * @function Phaser.Tilemaps.Components.TileToWorldXY
 * @since 3.0.0
 *
 * @param {number} tileX - The x coordinate, in tiles, not pixels.
 * @param {number} tileY - The y coordinate, in tiles, not pixels.
 * @param {Phaser.Math.Vector2} point - A Vector2 to store the coordinates in. If not given a new Vector2 is created.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera to use when calculating the tile index from the world values.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Math.Vector2} The XY location in world coordinates.
 */
var TileToWorldXY = function (tileX, tileY, point, camera, layer)
{
    if (!point) { point = new Vector2(0, 0); }

    point.x = TileToWorldX(tileX, camera, layer);
    point.y = TileToWorldY(tileY, camera, layer);

    return point;
};

module.exports = TileToWorldXY;
