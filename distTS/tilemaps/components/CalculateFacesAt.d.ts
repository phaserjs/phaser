/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetTileAt: any;
/**
 * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
 * faces are used internally for optimizing collisions against tiles. This method is mostly used
 * internally to optimize recalculating faces when only one tile has been changed.
 *
 * @function Phaser.Tilemaps.Components.CalculateFacesAt
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileX - The x coordinate.
 * @param {integer} tileY - The y coordinate.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var CalculateFacesAt: (tileX: any, tileY: any, layer: any) => any;
