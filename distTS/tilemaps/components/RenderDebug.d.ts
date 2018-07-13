/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var GetTilesWithin: any;
declare var Color: any;
/**
 * Draws a debug representation of the layer to the given Graphics. This is helpful when you want to
 * get a quick idea of which of your tiles are colliding and which have interesting faces. The tiles
 * are drawn starting at (0, 0) in the Graphics, allowing you to place the debug representation
 * wherever you want on the screen.
 *
 * @function Phaser.Tilemaps.Components.RenderDebug
 * @private
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Graphics} graphics - The target Graphics object to draw upon.
 * @param {object} styleConfig - An object specifying the colors to use for the debug drawing.
 * @param {?Phaser.Display.Color} [styleConfig.tileColor=blue] - Color to use for drawing a filled rectangle at
 * non-colliding tile locations. If set to null, non-colliding tiles will not be drawn.
 * @param {?Phaser.Display.Color} [styleConfig.collidingTileColor=orange] - Color to use for drawing a filled
 * rectangle at colliding tile locations. If set to null, colliding tiles will not be drawn.
 * @param {?Phaser.Display.Color} [styleConfig.faceColor=grey] - Color to use for drawing a line at interesting
 * tile faces. If set to null, interesting tile faces will not be drawn.
 * @param {Phaser.Tilemaps.LayerData} layer - The Tilemap Layer to act upon.
 */
declare var RenderDebug: (graphics: any, styleConfig: any, layer: any) => void;
