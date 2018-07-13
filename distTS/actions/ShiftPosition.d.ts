/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Vector2: any;
/**
 * Iterate through items changing the position of each element to
 * be that of the element that came before it in the array (or after it if direction = 1)
 * The first items position is set to x/y.
 * The final x/y coords are returned
 *
 * @function Phaser.Actions.ShiftPosition
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items]
 * @generic {Phaser.Math.Vector2} O - [output,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {integer} [direction=0] - [description]
 * @param {(Phaser.Math.Vector2|object)} [output] - [description]
 *
 * @return {Phaser.Math.Vector2} The output vector.
 */
declare var ShiftPosition: (items: any, x: any, y: any, direction: any, output: any) => any;
