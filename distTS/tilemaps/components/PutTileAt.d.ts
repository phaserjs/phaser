/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Tile: any;
declare var IsInLayerBounds: any;
declare var CalculateFacesAt: (tileX: any, tileY: any, layer: any) => any;
declare var SetTileCollision: any;
/**
 * Puts a tile at the given tile coordinates in the specified layer. You can pass in either an index
 * or a Tile object. If you pass in a Tile, all attributes will be copied over to the specified
 * location. If you pass in an index, only the index at the specified location will be changed.
 * Collision information will be recalculated at the specified location.
 *
 * @function Phaser.Tilemaps.Components.PutTileAt
 * @private
 * @since 3.0.0
 *
 * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was created or added to this map.
 */
declare var PutTileAt: (tile: any, tileX: any, tileY: any, recalculateFaces: any, layer: any) => any;
