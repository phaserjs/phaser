/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var TileCheckX: any;
declare var TileCheckY: any;
declare var TileIntersectsBody: any;
/**
 * The core separation function to separate a physics body and a tile.
 *
 * @function Phaser.Physics.Arcade.Tilemap.SeparateTile
 * @since 3.0.0
 *
 * @param {number} i - [description]
 * @param {Phaser.Physics.Arcade.Body} body - The Body object to separate.
 * @param {Phaser.Tilemaps.Tile} tile - The tile to collide against.
 * @param {Phaser.Geom.Rectangle} tileWorldRect - [description]
 * @param {(Phaser.Tilemaps.DynamicTilemapLayer|Phaser.Tilemaps.StaticTilemapLayer)} tilemapLayer - The tilemapLayer to collide against.
 * @param {number} tileBias - [description]
 *
 * @return {boolean} Returns true if the body was separated, otherwise false.
 */
declare var SeparateTile: any;
