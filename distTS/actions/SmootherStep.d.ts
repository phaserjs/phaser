/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var MathSmootherStep: any;
/**
 * [description]
 *
 * @function Phaser.Actions.SmootherStep
 * @since 3.0.0
 *
 * @generic {Phaser.GameObjects.GameObject[]} G - [items,$return]
 *
 * @param {(array|Phaser.GameObjects.GameObject[])} items - An array of Game Objects. The contents of this array are updated by this Action.
 * @param {string} property - [description]
 * @param {number} min - [description]
 * @param {number} max - [description]
 * @param {number} inc - [description]
 *
 * @return {(array|Phaser.GameObjects.GameObject[])} The array of Game Objects that was passed to this Action.
 */
declare var SmootherStep: (items: any, property: any, min: any, max: any, inc: any) => any;
