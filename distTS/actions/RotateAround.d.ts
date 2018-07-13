/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var RotateAroundDistance: any;
declare var DistanceBetween: any;
/**
 * Rotates each item around the given point by the given angle.
 *
 * @function Phaser.Actions.RotateAround
 * @since 3.0.0
 * @see Phaser.Math.RotateAroundDistance
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {object} point - Any object with public `x` and `y` properties.
 * @param {number} angle - The angle to rotate by, in radians.
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
declare var RotateAround: (items: any, point: any, angle: any) => any;
