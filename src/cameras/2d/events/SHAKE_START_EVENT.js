/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Camera Shake Start Event.
 *
 * This event is dispatched by a Camera instance when the Shake Effect starts.
 *
 * @event Phaser.Cameras.Scene2D.Events#SHAKE_START
 * @type {string}
 * @since 3.3.0
 *
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Shake} effect - A reference to the effect instance.
 * @param {number} duration - The duration of the effect.
 * @param {number} intensity - The intensity of the effect.
 */
module.exports = 'camerashakestart';
