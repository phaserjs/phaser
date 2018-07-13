/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var TileToWorldX: any;
declare var TileToWorldY: any;
declare var GetTilesWithin: any;
declare var ReplaceByIndex: any;
/**
 * Creates a Sprite for every object matching the given tile indexes in the layer. You can
 * optionally specify if each tile will be replaced with a new tile after the Sprite has been
 * created. This is useful if you want to lay down special tiles in a level that are converted to
 * Sprites, but want to replace the tile itself with a floor tile or similar once converted.
 *
 * @function Phaser.Tilemaps.Components.CreateFromTiles
 * @private
 * @since 3.0.0
 *
 * @param {(integer|array)} indexes - The tile index, or array of indexes, to create Sprites from.
 * @param {(integer|array)} replacements - The tile index, or array of indexes, to change a converted
 * tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a
 * one-to-one mapping with the indexes array.
 * @param {object} spriteConfig - The config object to pass into the Sprite creator (i.e.
 * scene.make.sprite).
 * @param {Phaser.Scene} [scene=scene the map is within] - The Scene to create the Sprites within.
 * @param {Phaser.Cameras.Scene2D.Camera} [camera=main camera] - The Camera to use when determining the world XY
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 *
 * @return {Phaser.GameObjects.Sprite[]} An array of the Sprites that were created.
 */
declare var CreateFromTiles: (indexes: any, replacements: any, spriteConfig: any, scene: any, camera: any, layer: any) => any[];
