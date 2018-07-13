/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       samme <samme.npm@gmail.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Wrap: any;
/**
 * Wrap each item's coordinates within a rectangle's area.
 *
 * @function Phaser.Actions.WrapInRectangle
 * @since 3.0.0
 * @see Phaser.Math.Wrap
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {Phaser.Geom.Rectangle} rect - The rectangle.
 * @param {number} [padding=0] - An amount added to each side of the rectangle during the operation.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
declare var WrapInRectangle: (items: any, rect: any, padding: any) => any;
