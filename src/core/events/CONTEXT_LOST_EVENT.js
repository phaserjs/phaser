/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Context Lost Event.
 *
 * This event is dispatched by the Game if the WebGL Renderer it is using encounters a WebGL Context Lost event from the browser.
 *
 * The renderer halts all rendering and cannot resume after this happens.
 *
 * @event Phaser.Core.Events#CONTEXT_LOST
 * @type {string}
 * @since 3.19.0
 */
module.exports = 'contextlost';
