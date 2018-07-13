/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var PutTileAt: (tile: any, tileX: any, tileY: any, recalculateFaces: any, layer: any) => any;
declare var WorldToTileX: any;
declare var WorldToTileY: any;
/**
 * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
 * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
 * specified location. If you pass in an index, only the index at the specified location will be
 * changed. Collision information will be recalculated at the specified location.
 *
 * @function Phaser.Tilemaps.Components.PutTileAtWorldXY
 * @private
 * @since 3.0.0
 *
 * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
 * @param {integer} worldX - [description]
 * @param {integer} worldY - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was created or added to this map.
 */
declare var PutTileAtWorldXY: (tile: any, worldX: any, worldY: any, recalculateFaces: any, camera: any, layer: any) => any;
