/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var RemoveTileAt: (tileX: any, tileY: any, replaceWithNull: any, recalculateFaces: any, layer: any) => any;
declare var WorldToTileX: any;
declare var WorldToTileY: any;
/**
 * Removes the tile at the given world coordinates in the specified layer and updates the layer's
 * collision information.
 *
 * @function Phaser.Tilemaps.Components.RemoveTileAtWorldXY
 * @private
 * @since 3.0.0
 *
 * @param {(integer|Phaser.Tilemaps.Tile)} tile - The index of this tile to set or a Tile object.
 * @param {number} worldX - [description]
 * @param {number} worldY - [description]
 * @param {boolean} [replaceWithNull=true] - If true, this will replace the tile at the specified
 * location with null instead of a Tile with an index of -1.
 * @param {boolean} [recalculateFaces=true] - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The Tile object that was removed.
 */
declare var RemoveTileAtWorldXY: (worldX: any, worldY: any, replaceWithNull: any, recalculateFaces: any, camera: any, layer: any) => any;
