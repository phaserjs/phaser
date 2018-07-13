/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Tile: any;
declare var IsInLayerBounds: any;
declare var CalculateFacesAt: (tileX: any, tileY: any, layer: any) => any;
/**
 * Removes the tile at the given tile coordinates in the specified layer and updates the layer's
 * collision information.
 *
 * @function Phaser.Tilemaps.Components.RemoveTileAt
 * @private
 * @since 3.0.0
 *
 * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified
 * location with null instead of a Tile with an index of -1.
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was removed.
 */
declare var RemoveTileAt: (tileX: any, tileY: any, replaceWithNull: any, recalculateFaces: any, layer: any) => any;
