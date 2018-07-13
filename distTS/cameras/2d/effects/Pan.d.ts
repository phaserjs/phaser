/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Clamp: any;
declare var Class: any;
declare var Vector2: any;
declare var EaseMap: any;
/**
 * @classdesc
 * A Camera Pan effect.
 *
 * This effect will scroll the Camera so that the center of its viewport finishes at the given destination,
 * over the duration and with the ease specified.
 *
 * Only the camera scroll is moved. None of the objects it is displaying are impacted, i.e. their positions do
 * not change.
 *
 * The effect will dispatch several events on the Camera itself and you can also specify an `onUpdate` callback,
 * which is invoked each frame for the duration of the effect if required.
 *
 * @class Pan
 * @memberOf Phaser.Cameras.Scene2D.Effects
 * @constructor
 * @since 3.11.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera this effect is acting upon.
 */
declare var Pan: any;
