/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Render Event.
 *
 * This event is dispatched by the Phaser Renderer for every camera in every Scene.
 *
 * It is dispatched before any of the children in the Scene have been rendered.
 *
 * @event Phaser.Renderer.Events#RENDER
 * @type {string}
 * @since 3.50.0
 *
 * @param {Phaser.Scene} scene - The Scene being rendered.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Scene Camera being rendered.
 */
module.exports = 'render';
