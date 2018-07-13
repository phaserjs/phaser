/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
 * layer's position, scale and scroll.
 *
 * @function Phaser.Tilemaps.Components.WorldToTileY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldY - [description]
 * @param {boolean} [snapToFloor=true] - Whether or not to round the tile coordinate down to the
 * nearest integer.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {number} The Y location in tile units.
 */
declare var WorldToTileY: any;
