/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetTilesWithin: any;
declare var WorldToTileX: any;
declare var WorldToTileY: any;
/**
 * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
 *
 * @function Phaser.Tilemaps.Components.GetTilesWithinWorldXY
 * @private
 * @since 3.0.0
 *
 * @param {number} worldX - [description]
 * @param {number} worldY - [description]
 * @param {number} width - [description]
 * @param {number} height - [description]
 * @param {object} [filteringOptions] - Optional filters to apply when getting the tiles.
 * @param {boolean} [filteringOptions.isNotEmpty=false] - If true, only return tiles that don't have
 * -1 for an index.
 * @param {boolean} [filteringOptions.isColliding=false] - If true, only return tiles that collide on
 * at least one side.
 * @param {boolean} [filteringOptions.hasInterestingFace=false] - If true, only return tiles that
 * have at least one interesting face.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - [description]
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} Array of Tile objects.
 */
declare var GetTilesWithinWorldXY: (worldX: any, worldY: any, width: any, height: any, filteringOptions: any, camera: any, layer: any) => any;
