/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var SnapFloor: any;
declare var SnapCeil: (value: any, gap: any, start: any) => any;
/**
 * Returns the tiles in the given layer that are within the camera's viewport. This is used
 * internally.
 *
 * @function Phaser.Tilemaps.Components.CullTiles
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera to run the cull check against.
 * @param {array} [outputArray] - [description]
 *
 * @return {Phaser.Tilemaps.Tile[]} An array of Tile objects.
 */
declare var CullTiles: (layer: any, camera: any, outputArray: any) => any;
