/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var IsInLayerBounds: any;
/**
 * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
 * false if there is no tile or if the tile at that location has an index of -1.
 *
 * @function Phaser.Tilemaps.Components.HasTileAt
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {boolean}
 */
declare var HasTileAt: (tileX: any, tileY: any, layer: any) => boolean;
