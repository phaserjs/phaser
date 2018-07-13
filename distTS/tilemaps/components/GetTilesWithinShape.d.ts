/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Geom: any;
declare var GetTilesWithin: any;
declare var Intersects: any;
declare var NOOP: any;
declare var TileToWorldX: any;
declare var TileToWorldY: any;
declare var WorldToTileX: any;
declare var WorldToTileY: any;
declare var TriangleToRectangle: (triangle: any, rect: any) => any;
/**
 * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
 * Line, Rectangle or Triangle. The shape should be in world coordinates.
 *
 * @function Phaser.Tilemaps.Components.GetTilesWithinShape
 * @private
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Circle|Phaser.Geom.Line|Phaser.Geom.Rectangle|Phaser.Geom.Triangle)} shape - A shape in world (pixel) coordinates
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
declare var GetTilesWithinShape: (shape: any, filteringOptions: any, camera: any, layer: any) => any[];
