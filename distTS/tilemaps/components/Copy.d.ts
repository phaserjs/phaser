/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetTilesWithin: any;
declare var CalculateFacesWithin: (tileX: any, tileY: any, width: any, height: any, layer: any) => void;
/**
 * Copies the tiles in the source rectangular area to a new destination (all specified in tile
 * coordinates) within the layer. This copies all tile properties & recalculates collision
 * information in the destination region.
 *
 * @function Phaser.Tilemaps.Components.Copy
 * @private
 * @since 3.0.0
 *
 * @param {integer} srcTileX - [description]
 * @param {integer} srcTileY - [description]
 * @param {integer} width - [description]
 * @param {integer} height - [description]
 * @param {integer} destTileX - [description]
 * @param {integer} destTileY - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var Copy: (srcTileX: any, srcTileY: any, width: any, height: any, destTileX: any, destTileY: any, recalculateFaces: any, layer: any) => void;
