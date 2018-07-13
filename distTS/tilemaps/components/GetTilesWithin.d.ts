/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetFastValue: any;
/**
 * @typedef {object} GetTilesWithinFilteringOptions
 *
 * @property {boolean} [isNotEmpty=false] - If true, only return tiles that don't have -1 for an index.
 * @property {boolean} [isColliding=false] - If true, only return tiles that collide on at least one side.
 * @property {boolean} [hasInterestingFace=false] - If true, only return tiles that have at least one interesting face.
 */
/**
 * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
 *
 * @function Phaser.Tilemaps.Components.GetTilesWithin
 * @private
 * @since 3.0.0
 *
 * @param {integer} tileX - [description]
 * @param {integer} tileY - [description]
 * @param {integer} width - [description]
 * @param {integer} height - [description]
 * @param {object} GetTilesWithinFilteringOptions - Optional filters to apply when getting the tiles.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.Tilemaps.Tile[]} Array of Tile objects.
 */
declare var GetTilesWithin: any;
