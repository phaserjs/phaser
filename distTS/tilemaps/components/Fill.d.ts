/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetTilesWithin: any;
declare var CalculateFacesWithin: (tileX: any, tileY: any, width: any, height: any, layer: any) => void;
declare var SetTileCollision: any;
/**
 * Sets the tiles in the given rectangular area (in tile coordinates) of the layer with the
 * specified index. Tiles will be set to collide if the given index is a colliding index.
 * Collision information in the region will be recalculated.
 *
 * @function Phaser.Tilemaps.Components.Fill
 * @private
 * @since 3.0.0
 *
 * @param {integer} index - [description]
 * @param {integer} [tileX=0] - [description]
 * @param {integer} [tileY=0] - [description]
 * @param {integer} [width=max width based on tileX] - [description]
 * @param {integer} [height=max height based on tileY] - [description]
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var Fill: (index: any, tileX: any, tileY: any, width: any, height: any, recalculateFaces: any, layer: any) => void;
