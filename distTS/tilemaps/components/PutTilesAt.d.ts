/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var CalculateFacesWithin: (tileX: any, tileY: any, width: any, height: any, layer: any) => void;
declare var PutTileAt: (tile: any, tileX: any, tileY: any, recalculateFaces: any, layer: any) => any;
/**
 * Puts an array of tiles or a 2D array of tiles at the given tile coordinates in the specified
 * layer. The array can be composed of either tile indexes or Tile objects. If you pass in a Tile,
 * all attributes will be copied over to the specified location. If you pass in an index, only the
 * index at the specified location will be changed. Collision information will be recalculated
 * within the region tiles were changed.
 *
 * @function Phaser.Tilemaps.Components.PutTilesAt
 * @private
 * @since 3.0.0
 *
 * @param {(integer[]|integer[][]|Phaser.Tilemaps.Tile[]|Phaser.Tilemaps.Tile[][])} tile - A row (array) or grid (2D array) of Tiles
 * or tile indexes to place.
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var PutTilesAt: (tilesArray: any, tileX: any, tileY: any, recalculateFaces: any, layer: any) => any;
