/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetTileAt: any;
declare var WorldToTileX: any;
declare var WorldToTileY: any;
/**
 * Gets a tile at the given world coordinates from the given layer.
 *
 * @function Phaser.Tilemaps.Components.GetTileAtWorldXY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - X position to get the tile from (given in pixels)
 * @param {number} worldY - Y position to get the tile from (given in pixels)
 * @param {boolean} [nonNull=false] - If true, function won't return null for empty tiles, but a Tile
 * object with an index of -1.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile} The tile at the given coordinates or null if no tile was found or the coordinates
 * were invalid.
 */
declare var GetTileAtWorldXY: (worldX: any, worldY: any, nonNull: any, camera: any, layer: any) => any;
