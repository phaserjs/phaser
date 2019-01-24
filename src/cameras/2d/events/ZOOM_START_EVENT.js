/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Camera Zoom Start Event.
 * 
 * This event is dispatched by a Camera instance when the Zoom Effect starts.
 *
 * @event Phaser.Cameras.Scene2D.Events#ZOOM_START
 * 
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera that the effect began on.
 * @param {Phaser.Cameras.Scene2D.Effects.Zoom} effect - A reference to the effect instance.
 * @param {integer} duration - The duration of the effect.
 * @param {number} zoom - The destination zoom value.
 */
module.exports = 'camerazoomstart';
