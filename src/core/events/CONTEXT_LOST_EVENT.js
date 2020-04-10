/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Context Lost Event.
 * 
 * This event is dispatched by the Game if the WebGL Renderer it is using encounters a WebGL Context Lost event from the browser.
 * 
 * The partner event is `CONTEXT_RESTORED`.
 *
 * @event Phaser.Core.Events#CONTEXT_LOST
 * @since 3.19.0
 */
module.exports = 'contextlost';
